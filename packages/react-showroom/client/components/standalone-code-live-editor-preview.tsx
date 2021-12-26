import { isNumber, SupportedLanguage } from '@showroomjs/core';
import { css, styled, useConstant, useQueryParams } from '@showroomjs/ui';
import { Enable as ResizeEnable, Resizable } from 're-resizable';
import * as React from 'react';
import { useCodeFrameContext } from '../lib/code-frame-context';
import { safeCompress, safeDecompress } from '../lib/compress';
import {
  CodePreviewIframe,
  CodePreviewIframeImperative,
} from './code-preview-iframe';
import { DeviceFrame } from './device-frame';
import { useSize } from '../lib/use-size';

export interface StandaloneCodeLiveEditorPreviewListProps {
  code: string;
  lang: SupportedLanguage;
  codeHash: string;
  isCommenting: boolean;
  onClickCommentPoint: (coordinate: { x: number; y: number }) => void;
  hiddenSizes: Array<[number, number | '100%']>;
  fitHeight: boolean;
  zoom: string;
  showFrame: boolean;
  children?: React.ReactNode;
  syncState?: boolean;
  syncScroll?: boolean;
  wrapContent?: boolean;
}

const PARAM_KEY = '_fS';

type StateMaps = Map<string, Map<string, any>>;

export const StandaloneCodeLiveEditorPreviewList = React.forwardRef<
  HTMLDivElement,
  StandaloneCodeLiveEditorPreviewListProps
>(function StandaloneCodeLiveEditorPreviewList(props, forwardedRef) {
  const zoomValue = React.useMemo(() => Number(props.zoom), [props.zoom]);
  const shouldAdjustZoom = !isNaN(zoomValue) && zoomValue !== 100;

  const frameMap = useConstant(
    () => new Map<string, CodePreviewIframeImperative>()
  );
  const currentStateMaps = useConstant<StateMaps>(() => new Map());
  const [stateMaps, setStateMaps] = React.useState(currentStateMaps);
  const storeState = React.useCallback(
    (frameName: string, stateId: string, stateValue: any) => {
      let stateMap = stateMaps.get(frameName);

      if (!stateMap) {
        stateMap = new Map<string, any>();
        stateMaps.set(frameName, stateMap);
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
    if (process.env.SYNC_STATE_TYPE === 'state') {
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
    }
  }, [props.fitHeight, stateMaps]);

  const codeFrameSetttings = useCodeFrameContext();

  const visibleFrames = codeFrameSetttings.frameDimensions.filter(
    (f) => !props.hiddenSizes.some(([w, h]) => w === f.width && h === f.height)
  );

  const maxFrameHeight = Math.max.apply(
    null,
    visibleFrames.map((f) => (isNumber(f.height) ? f.height : 0))
  );

  const maxEffectiveHeight =
    maxFrameHeight &&
    (props.showFrame ? maxFrameHeight + 300 : maxFrameHeight + 100);

  const adjustedEffectiveHeight =
    maxEffectiveHeight &&
    (shouldAdjustZoom
      ? Math.ceil((maxEffectiveHeight * zoomValue) / 100)
      : maxEffectiveHeight) + 30; // additional 30px for device label

  const screenListRef = React.useRef<HTMLDivElement>(null);

  const screenListSize = useSize(screenListRef);

  const content = visibleFrames.map((dimension) => {
    return (
      <ScreenWrapper isCommenting={props.isCommenting} key={dimension.name}>
        <DeviceFrame dimension={dimension} showFrame={props.showFrame}>
          <Screen
            css={
              props.showFrame
                ? {
                    width: '100%',
                    height: '100%',
                  }
                : {
                    width: `${dimension.width}px`,
                    height: '100%',
                  }
            }
          >
            <CodePreviewIframe
              code={props.code}
              lang={props.lang}
              codeHash={props.codeHash}
              css={{
                width: `${dimension.width}px`,
                height: '100%',
              }}
              imperativeRef={(ref) => {
                if (ref) {
                  frameMap.set(dimension.name, ref);
                } else {
                  frameMap.delete(dimension.name);
                }
              }}
              onStateChange={(change) => {
                if (process.env.SYNC_STATE_TYPE === 'state') {
                  if (props.syncState) {
                    frameMap.forEach((frame, frameName) => {
                      if (frameName !== dimension.name) {
                        frame.sendToChild({
                          type: 'syncState',
                          stateId: change.stateId,
                          stateValue: change.stateValue,
                        });
                      }
                      storeState(frameName, change.stateId, change.stateValue);
                    });
                  } else {
                    storeState(
                      dimension.name,
                      change.stateId,
                      change.stateValue
                    );
                  }

                  setQueryParams({
                    [PARAM_KEY]: serializeStateMaps(stateMaps) || undefined,
                  });
                }
              }}
              onScrollChange={(xy) => {
                if (props.syncScroll) {
                  frameMap.forEach((frame, frameName) => {
                    if (frameName !== dimension.name) {
                      frame.sendToChild({
                        type: 'scroll',
                        scrollPercentageXY: xy,
                      });
                    }
                  });
                }
              }}
              onDomEvent={(ev) => {
                if (props.syncState) {
                  frameMap.forEach((frame, frameName) => {
                    if (frameName !== dimension.name) {
                      frame.sendToChild({
                        type: 'domEvent',
                        data: ev,
                      });
                    }
                  });
                }
              }}
            />
          </Screen>
        </DeviceFrame>
        <ScreenSize>
          <ScreenSizeText
            css={
              shouldAdjustZoom
                ? {
                    transform: `scale(${100 / zoomValue})`,
                    transformOrigin: 'top left',
                  }
                : undefined
            }
          >
            {dimension.name}
          </ScreenSizeText>
        </ScreenSize>
      </ScreenWrapper>
    );
  });

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
    <Root
      {...rootProps}
      css={
        screenListSize
          ? {
              height: screenListSize.height + 36,
              flex: 'none',
            }
          : {}
      }
      ref={forwardedRef}
    >
      <ScreenList
        css={
          shouldAdjustZoom
            ? {
                transform: `scale(${zoomValue / 100})`,
                transformOrigin: 'top left',
                ...(props.wrapContent
                  ? {
                      width: `${(100 * 100) / zoomValue}%`,
                    }
                  : {}),
              }
            : {}
        }
        wrap={props.wrapContent}
        ref={screenListRef}
      >
        {content}
      </ScreenList>
      {props.children}
    </Root>
  ) : (
    <Resizable
      enable={resizeEnable}
      maxHeight={
        (props.wrapContent
          ? screenListSize && screenListSize.height + 36
          : adjustedEffectiveHeight) || undefined
      }
      {...rootProps}
    >
      <ScreenList
        css={
          shouldAdjustZoom
            ? {
                transform: `scale(${zoomValue / 100})`,
                transformOrigin: 'top left',
                ...(props.wrapContent
                  ? {
                      width: `${(100 * 100) / zoomValue}%`,
                    }
                  : {}),
              }
            : {}
        }
        wrap={props.wrapContent}
        ref={screenListRef}
      >
        {content}
      </ScreenList>
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

const Root = styled('div', {
  flex: 1,
});

const ScreenList = styled('div', {
  display: 'flex',
  gap: '$6',
  variants: {
    wrap: {
      true: {
        flexWrap: 'wrap',
      },
    },
  },
});

const resizeStyle = css({
  overflowX: 'auto',
  overflowY: 'hidden',
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
});

const ScreenSizeText = styled('span', {
  display: 'inline-block', // required for transform to work
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
  marginBottom: '$6',
  variants: {
    isCommenting: {
      true: {
        pointerEvents: 'none',
      },
    },
  },
});

const serializeStateMaps = (stateMaps: StateMaps): string => {
  const mapObj: Record<string, string> = {};

  stateMaps.forEach((stateMap, frameName) => {
    mapObj[frameName] = JSON.stringify(Array.from(stateMap.entries()));
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

      Object.entries(mapObj).forEach(([frameName, stateString]) => {
        result.set(frameName, new Map(JSON.parse(stateString)));
      });

      return result;
    }
  } catch (err) {}
  return null;
};
