import {
  NON_VISUAL_LANGUAGES,
  PropsEditorFeature,
  SUPPORTED_LANGUAGES,
} from '@showroomjs/core';
import { tw } from '@showroomjs/ui';
import parseNumRange from 'parse-numeric-range';
import * as React from 'react';
import { useCodeTheme } from '../lib/code-theme-context';
import { A11yResultContextProvider } from '../lib/use-a11y-result';
import { useCodeCompilationCache } from '../lib/use-code-compilation';
import { CodeHighlight } from './code-highlight';
import {
  CodeLiveEditor,
  CodeLiveEditorProps,
  NonVisualCodeLiveEditor,
} from './code-live-editor';
import { CodePlayground } from './code-playground';
import { LanguageTag } from './language-tag';

const IsBlockCodeContext = React.createContext(false);
IsBlockCodeContext.displayName = 'ShowroomIsBlockCodeContext';

export const Pre = (props: { children: React.ReactNode }) => (
  <div className={tw(['mt-4 mb-8'])}>
    <IsBlockCodeContext.Provider value={true}>
      {props.children}
    </IsBlockCodeContext.Provider>
  </div>
);

export interface CodeProps extends React.ComponentPropsWithoutRef<'code'> {
  static?: boolean;
  inlineBlock?: boolean;
  fileName?: string;
  noEditor?: boolean;
  frame?: boolean;
  initialHeight?: string;
  initialWidth?: string;
  height?: string;
  highlights?: string;
}

export const Code = ({
  static: isStatic,
  inlineBlock,
  fileName,
  noEditor,
  frame,
  initialHeight,
  initialWidth,
  height,
  highlights,
  ...props
}: CodeProps) => {
  const isBlockCode = React.useContext(IsBlockCodeContext);

  const theme = useCodeTheme();

  const highlightedLines = React.useMemo(
    () =>
      highlights
        ? parseNumRange(highlights.replace(/^\{|\}$/g, ''))
        : undefined,
    []
  );

  if (!isBlockCode || typeof props.children !== 'string') {
    return (
      <code
        {...props}
        className={tw(
          ['inline-block px-1 [font-family:monospace] bg-zinc-200 rounded-sm'],
          [props.className]
        )}
      />
    );
  }

  const lang: any = props.className && props.className.split('-').pop();
  const code = props.children.trim();

  const heading = fileName ? (
    <div className={tw(['px-4 py-3 text-sm bg-zinc-200 rounded-t-md'])}>
      <code>{fileName}</code>
    </div>
  ) : null;

  if (!SUPPORTED_LANGUAGES.includes(lang) || isStatic) {
    return (
      <>
        {heading}
        <div
          style={{
            ...(typeof theme.plain === 'object' ? (theme.plain as any) : {}),
          }}
          className={tw(
            [
              'text-sm py-[10px] [font-family:monospace] relative whitespace-pre overflow-auto',
              !heading && (inlineBlock ? 'rounded-t-xl' : 'rounded-t'),
              inlineBlock
                ? 'inline-block px-6 rounded-b-xl'
                : 'block rounded-b px-[10px]',
            ],
            ['react-showroom-code', props.className]
          )}
        >
          <CodeHighlight
            code={code}
            language={lang}
            theme={theme}
            highlights={highlightedLines}
          />
          {!inlineBlock && lang && <LanguageTag language={lang} />}
        </div>
      </>
    );
  }

  return (
    <>
      {heading}
      {NON_VISUAL_LANGUAGES.includes(lang) ? (
        <NonVisualCodeLiveEditor
          code={code}
          lang={lang}
          id={props.id}
          noEditor={noEditor}
          frame={frame}
        />
      ) : (
        <A11yResultContextProvider>
          <VisualCodeBlock
            code={code}
            lang={lang}
            id={props.id}
            hasHeading={!!heading}
            noEditor={noEditor}
            frame={frame}
            initialHeight={initialHeight}
            initialWidth={initialWidth}
            height={height}
          />
        </A11yResultContextProvider>
      )}
    </>
  );
};

const VisualCodeBlock = (props: CodeLiveEditorProps) => {
  const compileCache = useCodeCompilationCache(props.code, props.lang);

  const propsEditorFeature = React.useMemo(
    () =>
      compileCache.data &&
      compileCache.data.type === 'success' &&
      (compileCache.data.features.find((f) => f.feature === 'propsEditor') as
        | PropsEditorFeature
        | undefined),
    [compileCache.data]
  );

  const hasUnionProps = React.useMemo(
    () =>
      compileCache.data &&
      compileCache.data.type === 'success' &&
      compileCache.data.features.some((f) => f.feature === 'unionProps'),
    [compileCache.data]
  );

  if (propsEditorFeature) {
    return (
      <CodePlayground
        {...props}
        hasPropsEditor={propsEditorFeature.hasRenderEditor}
      />
    );
  }

  return (
    <CodeLiveEditor
      {...props}
      {...(hasUnionProps
        ? {
            noEditor: true,
          }
        : {})}
    />
  );
};
