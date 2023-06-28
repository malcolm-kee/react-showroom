import { SupportedLanguage } from '@showroomjs/core';
import {
  ResizeIcon,
  tw,
  useDebouncedCallback,
  useStableCallback,
} from '@showroomjs/ui';
import { Resizable, Enable as ResizeEnable } from 're-resizable';
import * as React from 'react';
import { useComponentMeta } from '../lib/component-props-context';
import { DomEvent, Message, useParentWindow } from '../lib/frame-message';
import { getPreviewUrl } from '../lib/preview-url';
import { getScrollFn } from '../lib/scroll-into-view';
import { useA11yResult } from '../lib/use-a11y-result';
import { useConsole } from '../lib/use-preview-console';
import { PropsEditorContext } from '../lib/use-props-editor';
import { WidthMarkers, useActiveWidth } from './width-markers';

export interface CodePreviewIframeImperative {
  sendToChild: (msg: Message) => void;
  scrollIntoView: () => void;
}

export interface CodePreviewIframeProps {
  code: string;
  lang: SupportedLanguage;
  codeHash: string | undefined;
  resizable?: boolean;
  className?: string;
  imperativeRef?: React.Ref<CodePreviewIframeImperative>;
  onStateChange?: (data: { stateId: string; stateValue: any }) => void;
  onScrollChange?: (xy: [number | null, number | null]) => void;
  onDomEvent?: (ev: DomEvent) => void;
  nonVisual?: boolean;
  onIsCompilingChange?: (isCompiling: boolean) => void;
  initialHeight?: number;
  height?: number;
  initialWidth?: number;
  'data-frame-id'?: string;
  style?: React.CSSProperties;
}

const initialHeightMap = new Map<string, number>();

export function CodePreviewIframe({
  code,
  codeHash,
  lang,
  resizable,
  className,
  onStateChange,
  onScrollChange,
  onDomEvent,
  imperativeRef,
  nonVisual,
  onIsCompilingChange,
  initialHeight = 100,
  height: providedHeight,
  initialWidth,
  style,
  'data-frame-id': frameId,
}: CodePreviewIframeProps) {
  const [frameHeight, setFrameHeight] = React.useState(
    () => (codeHash && initialHeightMap.get(codeHash)) || initialHeight
  );
  const previewConsole = useConsole();

  // add 3 sec wait time before setting initial height to allow some layout shift
  const saveHeight = useDebouncedCallback(function saveInitialHeight(
    height: number
  ) {
    if (codeHash && !initialHeightMap.has(codeHash)) {
      initialHeightMap.set(codeHash, height);
    }
  },
  3000);

  const [isResizing, setIsResizing] = React.useState(false);
  const sizeEl = React.useRef<HTMLDivElement>(null);

  const [propsEditor, syncPropsEditor] = React.useContext(PropsEditorContext);

  const { setResult } = useA11yResult();

  const onIsCompilingChangeCb = useStableCallback(onIsCompilingChange);
  const { targetRef, sendMessage } = useParentWindow((ev) => {
    switch (ev.type) {
      case 'heightChange':
        if (!providedHeight) {
          setFrameHeight(ev.height);
          saveHeight(ev.height);
        }
        return;

      case 'log':
        previewConsole[ev.level](...(ev.data || []));
        return;

      case 'compileStatus':
        onIsCompilingChangeCb(ev.isCompiling);
        return;

      case 'stateChange':
        if (onStateChange) {
          onStateChange(ev);
        }
        return;

      case 'scroll':
        if (onScrollChange) {
          onScrollChange(ev.scrollPercentageXY);
        }
        return;

      case 'domEvent':
        if (onDomEvent) {
          onDomEvent(ev.data);
        }
        return;

      case 'syncPropsEditor':
        syncPropsEditor({
          type: 'init',
          initialState: ev.data,
        });
        return;

      case 'a11yCheckResult':
        setResult(ev.result);
        return;
    }
  });

  React.useImperativeHandle(imperativeRef, () => ({
    sendToChild: (msg) => sendMessage(msg),
    scrollIntoView: () => {
      getScrollFn().then((scroll) => {
        if (targetRef.current) {
          scroll(targetRef.current, {
            block: 'center',
            behavior: 'smooth',
            inline: 'center',
          });
        }
      });
    },
  }));

  const componentMeta = useComponentMeta();

  React.useEffect(() => {
    sendMessage({ type: 'code', code, lang });
  }, [code, lang]);

  React.useEffect(() => {
    if (propsEditor) {
      sendMessage({ type: 'syncPropsEditor', data: propsEditor });
    }
  }, [propsEditor]);

  const height = providedHeight || frameHeight;

  const [activeWidth, setActiveWidth] = useActiveWidth();

  const resizableRef = React.useRef<Resizable>(null);

  // React.useEffect(() => {
  //   if (resizableRef.current && initialWidth) {
  //     resizableRef.current.updateSize({
  //       width: initialWidth,
  //       height,
  //     });
  //   }
  // }, []);

  const content = codeHash ? (
    <iframe
      ref={targetRef}
      src={getPreviewUrl(codeHash, componentMeta && componentMeta.id)}
      title="Preview"
      height={nonVisual ? 0 : resizable ? height : '100%'}
      className={tw(
        [
          'flex-1 w-full border-0',
          !isResizing &&
            '[transition-property:height] duration-300 ease-in-out',
        ],
        [resizable ? undefined : className]
      )}
      data-frame-id={frameId}
      style={resizable ? undefined : style}
    />
  ) : null;

  return resizable ? (
    <WidthMarkers
      currentWidth={activeWidth}
      onMarkerClick={(newWidth) => {
        if (resizableRef.current) {
          resizableRef.current.updateSize({
            width: newWidth + handleWidth + 2,
            height,
          });
        }
      }}
    >
      <Resizable
        className={tw(
          [
            'flex overflow-hidden border-1 border-zinc-300 rounded-r bg-white',
            !isResizing &&
              '[transition-property:max-height] duration-300 ease-in-out',
          ],
          [className]
        )}
        minHeight={height}
        maxHeight={height}
        minWidth={320 + handleWidth + 2}
        maxWidth={'100%'}
        defaultSize={
          initialWidth
            ? {
                width: initialWidth + handleWidth + 2,
                height,
              }
            : undefined
        }
        enable={resizeEnable}
        handleStyles={{
          right: {
            width: 4 + handleWidth,
          },
        }}
        onResizeStart={() => setIsResizing(true)}
        onResizeStop={() => {
          setIsResizing(false);
          setActiveWidth(undefined);
        }}
        onResize={(_, __, el) => {
          if (sizeEl.current) {
            const width = el.clientWidth - handleWidth;
            sizeEl.current.textContent = `${width}px`;
            setActiveWidth(width);
          }
        }}
        style={style}
        ref={resizableRef}
      >
        {content}
        <div
          className={tw(['flex-shrink-0 flex items-center bg-zinc-200'])}
          style={{
            width: handleWidth,
          }}
        >
          <ResizeIcon
            width={16}
            height={16}
            className={tw(['text-zinc-500'])}
          />
        </div>
        {isResizing && (
          <div
            ref={sizeEl}
            className={tw([
              'absolute top-px right-4 text-xs px-3 py-1 bg-white/70',
            ])}
          />
        )}
      </Resizable>
    </WidthMarkers>
  ) : (
    content
  );
}

const handleWidth = 16;

const resizeEnable: ResizeEnable = {
  top: false,
  right: true,
  bottom: false,
  left: false,
  topRight: false,
  bottomRight: false,
  bottomLeft: false,
  topLeft: false,
};
