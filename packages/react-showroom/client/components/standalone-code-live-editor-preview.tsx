import { SupportedLanguage } from '@showroomjs/core';
import { css, styled, useConstant, useQueryParams } from '@showroomjs/ui';
import { Enable as ResizeEnable, Resizable } from 're-resizable';
import * as React from 'react';
import { EXAMPLE_WIDTHS } from '../lib/config';
import { safeCompress, safeDecompress } from '../lib/compress';
import {
  CodePreviewIframe,
  CodePreviewIframeImperative,
} from './code-preview-iframe';

export interface StandaloneCodeLiveEditorPreviewListProps {
  code: string;
  lang: SupportedLanguage;
  codeHash: string;
  isCommenting: boolean;
  onClickCommentPoint: (coordinate: { x: number; y: number }) => void;
  hiddenSizes: Array<number>;
  fitHeight: boolean;
  zoom: string;
  children?: React.ReactNode;
  syncState?: boolean;
  syncScroll?: boolean;
}

const PARAM_KEY = '_fS';

type StateMaps = Map<number, Map<string, any>>;

export const StandaloneCodeLiveEditorPreviewList = React.forwardRef<
  HTMLDivElement,
  StandaloneCodeLiveEditorPreviewListProps
>(function StandaloneCodeLiveEditorPreviewList(props, forwardedRef) {
  const zoomValue = React.useMemo(() => Number(props.zoom), [props.zoom]);
  const shouldAdjustZoom = !isNaN(zoomValue) && zoomValue !== 100;

  const frameMap = useConstant(
    () => new Map<number, CodePreviewIframeImperative>()
  );
  const currentStateMaps = useConstant<StateMaps>(() => new Map());
  const [stateMaps, setStateMaps] = React.useState(currentStateMaps);
  const storeState = React.useCallback(
    (frameWidth: number, stateId: string, stateValue: any) => {
      let stateMap = stateMaps.get(frameWidth);

      if (!stateMap) {
        stateMap = new Map<string, any>();
        stateMaps.set(frameWidth, stateMap);
      }

      stateMap.set(stateId, stateValue);
    },
    [stateMaps]
  );

  const [queryParams, setQueryParams, isReady] = useQueryParams();
  React.useEffect(() => {
    if (isReady) {
      const pValue = queryParams[PARAM_KEY];
      if (pValue && currentStateMaps.size === 0) {
        const serializedStateMap = deserializeStateMap(pValue);
        if (serializedStateMap) {
          setStateMaps(serializedStateMap);
        }
      }
    }
  }, [isReady]);

  React.useEffect(() => {
    // fitHeight props will cause the iframe to remount
    // so we need to sync the state
    stateMaps.forEach((stateMap, width) => {
      const frame = frameMap.get(width);

      if (frame) {
        stateMap.forEach((stateValue, stateId) => {
          frame.sendToChild({
            type: 'syncState',
            stateId,
            stateValue,
          });
        });
      }
    });
  }, [props.fitHeight, stateMaps]);

  const content = EXAMPLE_WIDTHS.map((exampleWidth) =>
    props.hiddenSizes.includes(exampleWidth) ? null : (
      <ScreenWrapper isCommenting={props.isCommenting} key={exampleWidth}>
        <Screen
          css={{
            width: `${
              shouldAdjustZoom
                ? Math.round((exampleWidth * zoomValue) / 100)
                : exampleWidth
            }px`,
          }}
        >
          <CodePreviewIframe
            code={props.code}
            lang={props.lang}
            codeHash={props.codeHash}
            css={{
              width: `${exampleWidth}px`,
              ...(shouldAdjustZoom
                ? {
                    transform: `scale(${zoomValue / 100})`,
                    transformOrigin: 'top left',
                  }
                : {}),
            }}
            imperativeRef={(ref) => {
              if (ref) {
                frameMap.set(exampleWidth, ref);
              } else {
                frameMap.delete(exampleWidth);
              }
            }}
            onStateChange={(change) => {
              if (props.syncState) {
                frameMap.forEach((frame, frameWidth) => {
                  if (frameWidth !== exampleWidth) {
                    frame.sendToChild({
                      type: 'syncState',
                      stateId: change.stateId,
                      stateValue: change.stateValue,
                    });
                  }
                  storeState(frameWidth, change.stateId, change.stateValue);
                });
              } else {
                storeState(exampleWidth, change.stateId, change.stateValue);
              }

              setQueryParams({
                [PARAM_KEY]: serializeStateMaps(stateMaps) || undefined,
              });
            }}
            onScrollChange={(xy) => {
              if (props.syncScroll) {
                frameMap.forEach((frame, frameWidth) => {
                  if (frameWidth !== exampleWidth) {
                    frame.sendToChild({
                      type: 'scroll',
                      scrollPercentageXY: xy,
                    });
                  }
                });
              }
            }}
          />
        </Screen>
        <ScreenSize>{exampleWidth}px</ScreenSize>
      </ScreenWrapper>
    )
  );

  const rootProps = {
    className: resizeStyle({
      isCommenting: props.isCommenting,
    }),
    onClick: props.isCommenting
      ? (ev: React.MouseEvent<HTMLElement, MouseEvent>) => {
          props.onClickCommentPoint({
            x: ev.pageX,
            y: ev.pageY,
          });
        }
      : undefined,
  };

  return props.fitHeight ? (
    <ScreenList {...rootProps} ref={forwardedRef}>
      {content}
      {props.children}
    </ScreenList>
  ) : (
    <Resizable enable={resizeEnable} {...rootProps}>
      {content}
      {props.children}
    </Resizable>
  );
});

const resizeEnable: ResizeEnable = {
  top: false,
  right: false,
  bottom: true,
  left: false,
  topRight: false,
  bottomRight: false,
  bottomLeft: false,
  topLeft: false,
};

const ScreenList = styled('div', {
  flex: 1,
});

const resizeStyle = css({
  display: 'flex',
  overflowX: 'auto',
  overflowY: 'hidden',
  gap: '$3',
  paddingTop: '$3',
  paddingBottom: '$6',
  px: '$3',
  backgroundColor: '$gray-200',
  position: 'relative',
  variants: {
    isCommenting: {
      true: {
        color: '$gray-300',
        cursor: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' /%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' /%3E%3C/svg%3E"), auto`,
      },
    },
  },
});

const ScreenSize = styled('div', {
  px: '$2',
  py: '$1',
  fontSize: '$sm',
  lineHeight: '$sm',
  color: '$gray-500',
});

const Screen = styled('div', {
  shadow: 'sm',
  backgroundColor: 'White',
  transition: 'box-shadow 100ms ease-in-out',
  height: '100%',
  overflow: 'hidden',
});

const ScreenWrapper = styled('div', {
  [`&:hover ${ScreenSize}`]: {
    color: 'Black',
    fontWeight: '500',
  },
  [`&:hover ${Screen}`]: {
    shadow: 'lg',
  },
  variants: {
    isCommenting: {
      true: {
        pointerEvents: 'none',
      },
    },
  },
});

const serializeStateMaps = (stateMaps: StateMaps): string => {
  const mapObj: Record<number, string> = {};

  stateMaps.forEach((stateMap, width) => {
    mapObj[width] = JSON.stringify(Array.from(stateMap.entries()));
  });

  try {
    const result = safeCompress(JSON.stringify(mapObj));
    return result;
  } catch (err) {
    return '';
  }
};

const deserializeStateMap = (string: string): StateMaps | null => {
  try {
    const decomp = safeDecompress(string, '');
    if (decomp) {
      const mapObj = JSON.parse(decomp) as Record<string, string>;

      const result: StateMaps = new Map();

      Object.entries(mapObj).forEach(([widthStr, stateString]) => {
        const width = Number(widthStr);

        if (!isNaN(width)) {
          result.set(width, new Map(JSON.parse(stateString)));
        }
      });

      return result;
    }
  } catch (err) {}
  return null;
};
