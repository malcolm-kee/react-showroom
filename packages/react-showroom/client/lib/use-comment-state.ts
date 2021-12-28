import { useId, useQueryParams } from '@showroomjs/ui';
import lzString from 'lz-string';
import * as React from 'react';

export interface CommentData {
  text: string;
  zoomLevel: string;
  hiddenSizes: Array<[number, number | '100%']>;
  top: number;
  left: number;
  id: string;
  showFrame: boolean;
}

type CommentEvent =
  | {
      type: 'add';
      data: CommentData;
    }
  | {
      type: 'remove';
      id: string;
    }
  | {
      type: 'set';
      items: Array<CommentData>;
    }
  | {
      type: 'update';
      data: Partial<CommentData> & { id: string };
    }
  | {
      type: 'clear';
    };

interface CommentState {
  items: Array<CommentData>;
}

const commentReducer = (
  state: CommentState,
  event: CommentEvent
): CommentState => {
  switch (event.type) {
    case 'add':
      return {
        ...state,
        items: state.items.concat(event.data),
      };

    case 'set':
      return {
        items: event.items,
      };

    case 'update':
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === event.data.id
            ? {
                ...item,
                ...event.data,
              }
            : item
        ),
      };

    case 'remove':
      return {
        ...state,
        items: state.items.filter((item) => item.id !== event.id),
      };

    case 'clear':
      return defaultState;

    default:
      throw new Error(`Unsupported event type: ${(event as any).type}`);
  }
};

const defaultState: CommentState = {
  items: [],
};

export const useCommentState = (idPrefix?: string) => {
  const id_prefix = useId(idPrefix);
  const idCountRef = React.useRef(0);

  const [state, dispatch] = React.useReducer(commentReducer, defaultState);

  const [qParams, setQParams, isReady] = useQueryParams();

  React.useEffect(() => {
    if (isReady) {
      if (qParams.comments) {
        const stored = deCompress(qParams.comments);

        if (stored) {
          dispatch({
            type: 'set',
            items: stored,
          });
        }
      }
    }
  }, [isReady]);

  React.useEffect(() => {
    setQParams({
      comments: state.items.length > 0 ? compress(state.items) : undefined,
    });
  }, [state.items]);

  return {
    state,
    add: React.useCallback((data: Omit<CommentData, 'id'>) => {
      dispatch({
        type: 'add',
        data: {
          ...data,
          id: `${id_prefix}-${Date.now()}-${idCountRef.current++}`,
        },
      });
    }, []),
    update: React.useCallback(
      (changes: Partial<CommentData> & { id: string }) => {
        dispatch({
          type: 'update',
          data: changes,
        });
      },
      []
    ),
    remove: React.useCallback((id: string) => {
      dispatch({
        type: 'remove',
        id,
      });
    }, []),
    clear: React.useCallback(
      () =>
        dispatch({
          type: 'clear',
        }),
      []
    ),
  };
};

const compress = (data: Array<CommentData>) => {
  return lzString.compressToEncodedURIComponent(JSON.stringify(data));
};

const deCompress = (str: string): Array<CommentData> | null => {
  try {
    const decompressed = lzString.decompressFromEncodedURIComponent(str);

    if (!decompressed) {
      return null;
    }

    const parsedResult = JSON.parse(decompressed);

    return Array.isArray(parsedResult) ? parsedResult : null;
  } catch (err) {
    return null;
  }
};
