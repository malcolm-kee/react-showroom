import { isFunction, isNumber, SupportedLanguage } from '@showroomjs/core';
import { tw, useConstant, useQueryParams } from '@showroomjs/ui';
import { Resizable, Enable as ResizeEnable } from 're-resizable';
import * as React from 'react';
import { useCodeFrameContext } from '../lib/code-frame-context';
import { safeCompress, safeDecompress } from '../lib/compress';
import { getFrameId } from '../lib/get-frame-id';
import {
  A11yResultContextProvider,
  useA11yResultByFrame,
} from '../lib/use-a11y-result';
import { useSize } from '../lib/use-size';
import { A11ySummary } from './a11y-summary';
import {
  CodePreviewIframe,
  CodePreviewIframeImperative,
} from './code-preview-iframe';
import { DeviceFrame } from './device-frame';

export interface StandaloneCodeLiveEditorPreviewListProps {
  code: string;
  lang: SupportedLanguage;
  codeHash: string;
  isCommenting: boolean;
  isMeasuring: boolean;
  onClickCommentPoint: (coordinate: { x: number; y: number }) => void;
  hiddenSizes: Array<[number, number | '100%']>;
  fitHeight: boolean;
  zoom: string;
  showFrame: boolean;
  onA11ySummaryClick: (frameName: string) => void;
  a11yHighlightData:
    | {
        frameName: string;
        selectors: string[];
        color: string;
      }
    | undefined;
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

  const [queryParams, setQueryParams] = useQueryParams();
  React.useEffect(() => {
    const pValue = queryParams.get(PARAM_KEY);
    if (pValue && currentStateMaps.size === 0) {
      const serializedStateMap = deserializeStateMap(pValue);
      if (serializedStateMap) {
        setStateMaps(serializedStateMap);
      }
    }
  }, []);

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

  React.useEffect(() => {
    frameMap.forEach((frame) => {
      frame.sendToChild({
        type: 'toggleMeasure',
        active: props.isMeasuring,
      });
    });
  }, [props.isMeasuring]);

  React.useEffect(() => {
    if (props.a11yHighlightData) {
      const frame = frameMap.get(props.a11yHighlightData.frameName);

      if (frame) {
        frame.sendToChild({
          type: 'highlightElements',
          selectors: props.a11yHighlightData.selectors,
          color: props.a11yHighlightData.color,
        });

        if (props.a11yHighlightData.selectors.length > 0) {
          frame.scrollIntoView();
        }
      }
    }
  }, [props.a11yHighlightData]);

  const codeFrameSettings = useCodeFrameContext();

  const visibleFrames = codeFrameSettings.frameDimensions.filter(
    (f) => !props.hiddenSizes.some(([w, h]) => w === f.width && h === f.height)
  );

  const maxFrameHeight =
    visibleFrames.length > 0
      ? Math.max.apply(
          null,
          visibleFrames.map((f) => (isNumber(f.height) ? f.height : 0))
        )
      : 0;

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

  const { setResult } = useA11yResultByFrame();

  const content = visibleFrames.map((dimension) => {
    return (
      <A11yResultContextProvider
        onResultChange={(result) => setResult(dimension.name, result)}
        key={dimension.name}
      >
        <div
          className={tw([
            'group/wrapper mb-6',
            props.isCommenting && 'pointer-events-none',
          ])}
        >
          <DeviceFrame dimension={dimension} showFrame={props.showFrame}>
            <div
              className={tw([
                'h-full overflow-hidden transition-shadow bg-white shadow-sm',
                'group-hover/wrapper:shadow-lg',
              ])}
              style={
                props.showFrame
                  ? {
                      width: '100%',
                    }
                  : {
                      width: `${dimension.width}px`,
                    }
              }
            >
              <CodePreviewIframe
                code={props.code}
                lang={props.lang}
                codeHash={props.codeHash}
                className={tw(['h-full'])}
                style={{
                  width: `${dimension.width}px`,
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
                        storeState(
                          frameName,
                          change.stateId,
                          change.stateValue
                        );
                      });
                    } else {
                      storeState(
                        dimension.name,
                        change.stateId,
                        change.stateValue
                      );
                    }

                    const nextValue = serializeStateMaps(stateMaps);

                    setQueryParams(
                      {
                        [PARAM_KEY]: nextValue || undefined,
                      },
                      {
                        merge: true,
                      }
                    );
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
                data-frame-id={getFrameId(dimension)}
              />
            </div>
          </DeviceFrame>
          <div className={tw(['px-2 py-1'])}>
            <span
              className={tw([
                'inline-flex flex-col items-start text-sm',
                'text-zinc-500 group-hover/wrapper:text-black',
              ])}
              style={
                shouldAdjustZoom
                  ? {
                      transform: `scale(${100 / zoomValue})`,
                      transformOrigin: 'top left',
                    }
                  : undefined
              }
            >
              {dimension.name}
              <A11ySummary
                onClick={() => props.onA11ySummaryClick(dimension.name)}
              />
            </span>
          </div>
        </div>
      </A11yResultContextProvider>
    );
  });

  const rootProps = {
    className: tw([
      'relative pt-3 pb-6 px-3 bg-zinc-200 overflow-x-auto overflow-y-hidden',
      props.isCommenting && 'text-zinc-300',
      screenListSize ? 'flex-none' : 'flex-1',
    ]),
    style: {
      ...(props.isCommenting
        ? {
            cursor: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='none' viewBox='0 0 24 24' stroke='%236B7280'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z' /%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M15 11a3 3 0 11-6 0 3 3 0 016 0z' /%3E%3C/svg%3E"), auto`,
          }
        : {}),
      ...(screenListSize
        ? {
            height: screenListSize.height + 36,
          }
        : {}),
    },
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
    <div {...rootProps} ref={forwardedRef}>
      <ScreenList
        style={
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
    </div>
  ) : (
    <Resizable
      enable={resizeEnable}
      maxHeight={
        (props.wrapContent
          ? screenListSize && screenListSize.height + 36
          : adjustedEffectiveHeight) || undefined
      }
      ref={(resizableRef) => {
        if (resizableRef) {
          resizableRef.ref = (innerRef) => {
            if (isFunction(forwardedRef)) {
              forwardedRef(innerRef as HTMLDivElement);
            } else if (forwardedRef) {
              forwardedRef.current = innerRef as HTMLDivElement;
            }
          };
        }
      }}
      {...rootProps}
    >
      <ScreenList
        style={
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

const ScreenList = React.forwardRef<
  HTMLDivElement,
  React.ComponentPropsWithoutRef<'div'> & { wrap?: boolean }
>(function ScreenList({ wrap, className, ...props }, forwardedRef) {
  return (
    <div
      {...props}
      ref={forwardedRef}
      className={tw(['flex gap-6', wrap && 'flex-wrap'], [className])}
    />
  );
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
    const stateString = safeDecompress(string, '');
    if (stateString) {
      const mapObj = JSON.parse(stateString) as Record<string, string>;

      const result: StateMaps = new Map();

      Object.entries(mapObj).forEach(([frameName, stateString]) => {
        result.set(frameName, new Map(JSON.parse(stateString)));
      });

      return result;
    }
  } catch (err) {
    return null;
  }
  return null;
};
