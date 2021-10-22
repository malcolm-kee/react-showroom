import { SupportedLanguage } from '@showroomjs/core';
import { css, ResizeIcon, styled } from '@showroomjs/ui';
import cx from 'classnames';
import { Enable as ResizeEnable, Resizable } from 're-resizable';
import * as React from 'react';
import { useComponentMeta } from '../lib/component-props-context';
import { useParentWindow } from '../lib/frame-message';
import { getPreviewUrl } from '../lib/preview-url';

export interface CodePreviewIframeProps {
  code: string;
  lang: SupportedLanguage;
  codeHash: string | undefined;
  className?: string;
}

const initialHeightMap = new Map<string, number>();

export const CodePreviewIframe = ({
  code,
  codeHash,
  lang,
  className,
}: CodePreviewIframeProps) => {
  const [frameHeight, setFrameHeight] = React.useState(
    () => (codeHash && initialHeightMap.get(codeHash)) || 100
  );

  const [isResizing, setIsResizing] = React.useState(false);
  const sizeEl = React.useRef<HTMLDivElement>(null);

  const { targetRef, sendMessage } = useParentWindow((ev) => {
    if (ev.type === 'heightChange') {
      setFrameHeight(ev.height);
      if (codeHash && !initialHeightMap.has(codeHash)) {
        initialHeightMap.set(codeHash, ev.height);
      }
    }
  });

  const componentMeta = useComponentMeta();

  React.useEffect(() => {
    sendMessage({ type: 'code', code, lang });
  }, [code, lang]);

  return (
    <Resizable
      className={cx(
        resizable({
          animate: !isResizing,
        }),
        className
      )}
      maxHeight={frameHeight}
      minHeight={frameHeight}
      minWidth={320 + handleWidth + 2}
      maxWidth="100%"
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
      {codeHash ? (
        <Frame
          ref={targetRef}
          src={getPreviewUrl(
            codeHash,
            componentMeta && componentMeta.displayName
          )}
          title="Preview"
          height={frameHeight}
          animate={!isResizing}
        />
      ) : null}
      <ResizeHandle>
        <HandleIcon width={16} height={16} />
      </ResizeHandle>
      {isResizing && <SizeDisplay ref={sizeEl} />}
    </Resizable>
  );
};

const handleWidth = 16;

const resizable = css({
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
