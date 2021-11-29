import Editor, { EditorProps } from '@monaco-editor/react';
import { CompileResult } from '@showroomjs/core';
import { styled, useStableCallback } from '@showroomjs/ui';
// @ts-expect-error
import reactDefinition from '@types/react/index.d.ts?raw';
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { Language } from 'prism-react-renderer';
import * as React from 'react';
import allComponentProps from 'react-showroom-comp-metadata?showroomCompProp';
import { useDependenciesVersions } from '../lib/code-imports-context';
import { useComponentMeta } from '../lib/component-props-context';
import { componentsEntryName } from '../lib/config';

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

  const versions = useDependenciesVersions();

  console.log({ versions });

  return (
    <Editor
      defaultLanguage={mappedLanguage || language}
      defaultValue={value}
      onChange={initialized ? onEditorChange : undefined}
      path={extension ? `index.${extension}` : undefined}
      theme="vs-dark"
      onMount={(editor, monaco) => {
        setupLanguage(
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

        setInitialized(true);
      }}
      options={editorOptions}
      className={className}
    />
  );
});

const editorOptions: EditorProps['options'] = {
  minimap: { enabled: false },
};

const setupLanguage = (
  monaco: Monaco,
  language: Language,
  isModule: boolean,
  componentMeta: { id: string } | undefined
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
      jsx: monaco.languages.typescript.JsxEmit.React,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      noEmit: true,
      allowJs: true,
      allowSyntheticDefaultImports: true,
      esModuleInterop: true,
      target: monaco.languages.typescript.ScriptTarget.ES2018,
    });

    defaultService.setDiagnosticsOptions({
      noSemanticValidation: true,
      noSyntaxValidation: true,
      onlyVisible: true,
    });

    const componentDef =
      componentMeta &&
      allComponentProps.find((comp) => comp.id === componentMeta.id);

    const global = isModule
      ? `import * as R from 'react';
declare global {
  const React: typeof R;
  const function render(ui: R.ReactElement): void;

  ${
    componentDef
      ? `const ${componentDef.name}: R.ComponentType<${componentDef.props}>`
      : ''
  }
}`
      : `/// <reference types="react" />

declare function render(ui: React.ReactElement): void;

${
  componentDef
    ? `declare const ${componentDef.name}: React.ComponentType<${componentDef.props}>;`
    : ''
}`;

    defaultService.addExtraLib(global, 'global.d.ts');

    defaultService.addExtraLib(
      reactDefinition,
      'file:///node_modules/@types/react/index.d.ts'
    );

    if (componentsEntryName) {
      defaultService.addExtraLib(
        `import * as React from 'react';
        
        ${allComponentProps
          .map(
            (component) =>
              `export const ${component.name}: React.ComponentType<${component.props}>`
          )
          .join('\n')}`,
        `file:///node_modules/${componentsEntryName}/index.d.ts`
      );
    }
  }
};
