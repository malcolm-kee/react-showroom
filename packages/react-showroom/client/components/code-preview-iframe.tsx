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
import { Message, useParentWindow } from '../lib/frame-message';
import { getPreviewUrl } from '../lib/preview-url';
import { useConsole } from '../lib/use-preview-console';

export interface CodePreviewIframeImperative {
  sendToChild: (msg: Message) => void;
}

export interface CodePreviewIframeProps {
  code: string;
  lang: SupportedLanguage;
  codeHash: string | undefined;
  resizable?: boolean;
  className?: string;
  imperativeRef?: React.Ref<CodePreviewIframeImperative>;
  onStateChange?: (data: { stateId: string; stateValue: any }) => void;
  nonVisual?: boolean;
  onIsCompilingChange?: (isCompiling: boolean) => void;
  initialHeight?: number;
  height?: number;
}

const initialHeightMap = new Map<string, number>();

export const CodePreviewIframe = styled(function CodePreviewIframe({
  code,
  codeHash,
  lang,
  resizable,
  className,
  onStateChange,
  imperativeRef,
  nonVisual,
  onIsCompilingChange,
  initialHeight = 100,
  height: providedHeight,
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

  const onIsCompilingChangeCb = useStableCallback(onIsCompilingChange);
  const { targetRef, sendMessage } = useParentWindow((ev) => {
    if (ev.type === 'heightChange') {
      if (!providedHeight) {
        setFrameHeight(ev.height);
        saveHeight(ev.height);
      }
    } else if (ev.type === 'log') {
      previewConsole[ev.level](...(ev.data || []));
    } else if (ev.type === 'stateChange') {
      if (onStateChange) {
        onStateChange(ev);
      }
    } else if (ev.type === 'compileStatus') {
      onIsCompilingChangeCb(ev.isCompiling);
    }
  });

  React.useImperativeHandle(imperativeRef, () => ({
    sendToChild: (msg) => sendMessage(msg),
  }));

  const componentMeta = useComponentMeta();

  React.useEffect(() => {
    sendMessage({ type: 'code', code, lang });
  }, [code, lang]);

  const height = providedHeight || frameHeight;

  const content = codeHash ? (
    <Frame
      ref={targetRef}
      src={getPreviewUrl(codeHash, componentMeta && componentMeta.displayName)}
      title="Preview"
      height={nonVisual ? 0 : resizable ? height : '100%'}
      animate={!isResizing}
      className={resizable ? undefined : className}
    />
  ) : null;

  return resizable ? (
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
      onResizeStop={() => setIsResizing(false)}
      onResize={(_, __, el) => {
        if (sizeEl.current) {
          sizeEl.current.textContent = `${el.clientWidth - handleWidth}px`;
        }
      }}
    >
      {content}
      <ResizeHandle>
        <HandleIcon width={16} height={16} />
      </ResizeHandle>
      {isResizing && <SizeDisplay ref={sizeEl} />}
    </Resizable>
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
