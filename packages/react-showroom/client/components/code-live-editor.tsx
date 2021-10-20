import { ArrowsExpandIcon } from '@heroicons/react/outline';
import { removeTrailingSlash, SupportedLanguage } from '@showroomjs/core';
import {
  Collapsible,
  css,
  icons,
  ResizeIcon,
  styled,
  useDebounce,
} from '@showroomjs/ui';
import type { Language } from 'prism-react-renderer';
import { Enable as ResizeEnable, Resizable } from 're-resizable';
import * as React from 'react';
import { useCodeTheme } from '../lib/code-theme-context';
import { useCodeBlocks } from '../lib/codeblocks-context';
import { useParentWindow } from '../lib/frame-message';
import { getPreviewUrl } from '../lib/preview-url';
import { Link, useRouteMatch } from '../lib/routing';
import { Div } from './base';
import { BrowserWindow } from './browser-window';
import { CodeEditor } from './code-editor';
import { CodePreviewFrame } from './code-preview-frame';

export interface CodeLiveEditorProps {
  code: string;
  lang: SupportedLanguage;
  hasHeading?: boolean;
  id?: string;
  className?: string;
  noEditor?: boolean;
  frame?: boolean;
}

export const CodeLiveEditor = ({
  hasHeading,
  className,
  noEditor,
  frame,
  ...props
}: CodeLiveEditorProps) => {
  const theme = useCodeTheme();

  const [code, setCode] = React.useState(props.code);

  const debouncedCode = useDebounce(code);

  const [showCode, setShowCode] = React.useState<boolean | undefined>(false);

  const [frameHeight, setFrameHeight] = React.useState(100);

  const [isResizing, setIsResizing] = React.useState(false);
  const sizeEl = React.useRef<HTMLDivElement>(null);

  const { targetRef, sendMessage } = useParentWindow((ev) => {
    if (ev.type === 'heightChange') {
      setFrameHeight(ev.height);
    }
  });

  const encodedCode = React.useMemo(
    () => encodeURIComponent(props.code),
    [props.code]
  );

  React.useEffect(() => {
    sendMessage({ type: 'code', code: debouncedCode, lang: props.lang });
  }, [debouncedCode]);

  const content = (
    <>
      <Div
        css={{
          position: 'relative',
          roundedT: hasHeading ? '$none' : '$base',
          ...(frame
            ? {
                backgroundColor: '$gray-400',
                borderBottomRightRadius: '$base',
              }
            : {
                minHeight: 48,
                border: '1px solid',
                borderColor: '$gray-300',
              }),
        }}
      >
        {frame ? (
          <Resizable
            className={resizable({
              animate: !isResizing,
            })}
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
                sizeEl.current.textContent = `${
                  el.clientWidth - handleWidth
                }px`;
              }
            }}
          >
            <Frame
              ref={targetRef}
              src={getPreviewUrl(props.id, encodedCode, props.lang)}
              title="Preview"
              height={frameHeight}
              animate={!isResizing}
            />
            <ResizeHandle>
              <HandleIcon width={16} height={16} />
            </ResizeHandle>
            {isResizing && <SizeDisplay ref={sizeEl} />}
          </Resizable>
        ) : (
          <CodePreviewFrame code={debouncedCode} lang={props.lang} />
        )}
      </Div>
      {!noEditor && (
        <Collapsible.Root open={showCode} onOpenChange={setShowCode}>
          <Div
            css={{
              display: 'flex',
              justifyContent: 'space-between',
              py: '$1',
            }}
          >
            <Collapsible.Button
              css={{
                display: 'flex',
                alignItems: 'center',
                gap: '$1',
                fontSize: '$sm',
                lineHeight: '$sm',
              }}
            >
              <Collapsible.ToggleIcon
                hide={showCode}
                aria-label={showCode ? 'Hide' : 'View'}
                width="16"
                height="16"
              />
              Code
            </Collapsible.Button>
            <LinkToStandaloneView code={props.code} />
          </Div>
          <Collapsible.Content animate>
            <CodeEditor
              code={code}
              onChange={setCode}
              language={props.lang as Language}
              className={editorBottom()}
              theme={theme}
            />
          </Collapsible.Content>
        </Collapsible.Root>
      )}
    </>
  );

  return (
    <div className={className}>
      {noEditor ? (
        <BrowserWindow url="preview">{content}</BrowserWindow>
      ) : (
        content
      )}
    </div>
  );
};

const LinkToStandaloneView = (props: { code: string }) => {
  const { url } = useRouteMatch();

  const codeBlocks = useCodeBlocks();
  const matchCodeData = codeBlocks[props.code];

  return matchCodeData ? (
    <Button
      as={Link}
      to={`${removeTrailingSlash(url)}/_standalone/${
        matchCodeData.initialCodeHash
      }`}
    >
      Standalone
      <ArrowsExpandIcon width={20} height={20} className={icons()} />
    </Button>
  ) : null;
};

const handleWidth = 16;

const Button = styled('button', {
  display: 'inline-flex',
  alignItems: 'center',
  textDecoration: 'none',
  px: '$1',
  gap: '$1',
  fontSize: '$sm',
  color: '$gray-500',
  outlineRing: '',
});

const editorBottom = css({
  borderRadius: '$base',
});

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
