import { SupportedLanguage } from '@showroomjs/core';
import {
  css,
  ResizeIcon,
  styled,
  useDebouncedCallback,
  useStableCallback,
} from '@showroomjs/ui';
import cx from 'classnames';
import { Enable as ResizeEnable, Resizable } from 're-resizable';
import * as React from 'react';
import { useComponentMeta } from '../lib/component-props-context';
import { DomEvent, Message, useParentWindow } from '../lib/frame-message';
import { getFrameId } from '../lib/get-frame-id';
import { getPreviewUrl } from '../lib/preview-url';
import { getScrollFn } from '../lib/scroll-into-view';
import { useA11yResult } from '../lib/use-a11y-result';
import { useConsole } from '../lib/use-preview-console';
import { PropsEditorContext } from '../lib/use-props-editor';
import { useActiveWidth, WidthMarkers } from './width-markers';

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
  'data-frame-id'?: string;
}

const initialHeightMap = new Map<string, number>();

export const CodePreviewIframe = styled(function CodePreviewIframe({
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

  const content = codeHash ? (
    <Frame
      ref={targetRef}
      src={getPreviewUrl(codeHash, componentMeta && componentMeta.id)}
      title="Preview"
      height={nonVisual ? 0 : resizable ? height : '100%'}
      animate={!isResizing}
      className={resizable ? undefined : className}
      data-frame-id={frameId}
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
        className={cx(
          resizableStyle({
            animate: !isResizing,
          }),
          className
        )}
        minHeight={height}
        maxHeight={height}
        minWidth={320 + handleWidth + 2}
        maxWidth={'100%'}
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
        ref={resizableRef}
      >
        {content}
        <ResizeHandle>
          <HandleIcon width={16} height={16} />
        </ResizeHandle>
        {isResizing && <SizeDisplay ref={sizeEl} />}
      </Resizable>
    </WidthMarkers>
  ) : (
    content
  );
});

const handleWidth = 16;

const resizableStyle = css({
  overflow: 'hidden',
  display: 'flex',
  border: '1px solid',
  borderColor: '$gray-300',
  borderTopRightRadius: '$base',
  borderBottomRightRadius: '$base',
  backgroundColor: 'White',
  variants: {
    animate: {
      true: {
        transition: 'max-height 300ms ease-in-out',
      },
    },
  },
});

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

const SizeDisplay = styled('div', {
  position: 'absolute',
  top: 1,
  right: 16,
  backgroundColor: 'rgba(255, 255, 255, 0.7)',
  fontSize: '$xs',
  lineHeight: '$xs',
  px: '$3',
  py: '$1',
});

const ResizeHandle = styled('div', {
  flexShrink: 0,
  width: handleWidth,
  backgroundColor: '$gray-200',
  display: 'flex',
  alignItems: 'center',
});

const HandleIcon = styled(ResizeIcon, {
  color: '$gray-500',
});

const Frame = styled('iframe', {
  width: '100%',
  flex: 1,
  border: 0,
  variants: {
    animate: {
      true: {
        transition: 'height 300ms ease-in-out',
      },
    },
  },
});
