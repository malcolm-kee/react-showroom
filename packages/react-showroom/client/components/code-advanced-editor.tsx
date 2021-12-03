import Editor, { EditorProps } from '@monaco-editor/react';
import { CompileResult, omit } from '@showroomjs/core';
import { styled, useStableCallback } from '@showroomjs/ui';
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { Language } from 'prism-react-renderer';
import * as React from 'react';
import allComponentDts from 'react-showroom-comp-metadata?showroomCompProp';
import { useLoadDts } from '../lib/code-imports-context';
import { useComponentMeta } from '../lib/component-props-context';
import { compilerOptions, componentsEntryName } from '../lib/config';

type Monaco = typeof monaco;
export interface CodeAdvancedEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: Language;
  className?: string;
  initialResult: CompileResult | undefined;
}

const languageMapping: { [key in Language]?: string } = {
  tsx: 'typescript',
  typescript: 'typescript',
  jsx: 'javascript',
  javascript: 'javascript',
};

const languageExtension: { [key in Language]?: string } = {
  tsx: 'tsx',
  typescript: 'ts',
  jsx: 'jsx',
  javascript: 'js',
};

export const CodeAdvancedEditor = styled(function CodeAdvancedEditor({
  value,
  onChange,
  language,
  className,
  initialResult,
}: CodeAdvancedEditorProps) {
  const onChangeCallback = useStableCallback(onChange);
  const [initialized, setInitialized] = React.useState(false);

  const onEditorChange = React.useCallback<
    NonNullable<EditorProps['onChange']>
  >(
    (value) => {
      onChangeCallback(value || '');
    },
    [onChangeCallback]
  );

  const mappedLanguage = languageMapping[language];

  const extension = languageExtension[language];

  const componentMeta = useComponentMeta();

  const loadDts = useLoadDts();

  return (
    <Editor
      defaultLanguage={mappedLanguage || language}
      defaultValue={value}
      onChange={initialized ? onEditorChange : undefined}
      path={extension ? `index.${extension}` : undefined}
      theme="vs-dark"
      onMount={(editor, monaco) => {
        const langService = setupLanguage(
          monaco,
          language,
          !!initialResult &&
            initialResult.type === 'success' &&
            initialResult.importedPackages.length > 0,
          componentMeta
        );

        if (extension) {
          monaco.editor.getModels().forEach((model) => model.dispose());

          const model = monaco.editor.createModel(
            value,
            extension ? 'typescript' : language,
            monaco.Uri.parse(`index.${extension}`)
          );
          editor.setModel(null);
          editor.setModel(model);
        }

        if (langService) {
          loadDts().then((m) => {
            if (m.default) {
              Object.entries(m.default).forEach(([name, content]) => {
                langService.addExtraLib(content, `file:///${name}`);
              });
            }

            setInitialized(true);
          });
        } else {
          setInitialized(true);
        }
      }}
      options={editorOptions}
      className={className}
    />
  );
});

const isAndroid = process.env.SSR
  ? false
  : navigator && /android/i.test(navigator.userAgent);

const editorOptions: EditorProps['options'] = {
  minimap: { enabled: false },
  lightbulb: { enabled: true },
  quickSuggestions: {
    other: !isAndroid,
    comments: !isAndroid,
    strings: !isAndroid,
  },
  acceptSuggestionOnCommitCharacter: !isAndroid,
  acceptSuggestionOnEnter: !isAndroid ? 'on' : 'off',
  inlayHints: {
    enabled: true,
  },
};

const setupLanguage = (
  monaco: Monaco,
  language: Language,
  isModule: boolean,
  componentMeta: { id: string; displayName: string } | undefined
) => {
  const defaultService =
    language === 'tsx' ||
    language === 'typescript' ||
    language === 'jsx' ||
    language === 'javascript'
      ? monaco.languages.typescript.typescriptDefaults
      : undefined;

  if (defaultService) {
    defaultService.setCompilerOptions({
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      ...omit(compilerOptions, [
        'baseUrl',
        'paths',
        'module',
        'isolatedModules',
        'lib',
      ]),
      target: monaco.languages.typescript.ScriptTarget.ES2018,
      jsx: monaco.languages.typescript.JsxEmit.React,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      noEmit: true,
      allowJs: true,
    });

    defaultService.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
      onlyVisible: true,
    });

    const componentPkgName = componentsEntryName || 'react-showroom-components';

    const hasComponentDef = !!(allComponentDts && componentMeta?.displayName);

    if (allComponentDts) {
      defaultService.addExtraLib(
        JSON.stringify({
          name: componentPkgName,
          version: '1.0.0',
          types: 'index.d.ts',
        }),
        `file:///node_modules/${componentPkgName}/package.json`
      );
      defaultService.addExtraLib(
        allComponentDts,
        `file:///node_modules/${componentPkgName}/index.d.ts`
      );
    }

    const global = isModule
      ? `import * as React from 'react';
${
  hasComponentDef
    ? `import { ${componentMeta.displayName} as Comp } from '${componentPkgName}';`
    : ''
}

declare global {
  const React: typeof React;

  ${hasComponentDef ? `const ${componentMeta.displayName}: typeof Comp;` : ''}

  function render(ui: React.ReactElement): void;
}`
      : `/// <reference types="react" />
declare function render(ui: React.ReactElement): void;

${
  hasComponentDef
    ? `declare const ${componentMeta.displayName}: import('${componentPkgName}').${componentMeta.displayName};`
    : ''
}`;

    defaultService.addExtraLib(global, 'global.d.ts');

    return defaultService;
  }
};
