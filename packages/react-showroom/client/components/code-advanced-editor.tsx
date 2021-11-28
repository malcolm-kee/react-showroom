import Editor, { EditorProps } from '@monaco-editor/react';
import { styled, useStableCallback } from '@showroomjs/ui';
// @ts-expect-error
import reactDefinition from '@types/react/index.d.ts?raw';
import type * as monaco from 'monaco-editor/esm/vs/editor/editor.api';
import { Language } from 'prism-react-renderer';
import * as React from 'react';
import allComponentProps from 'react-showroom-comp-metadata?showroomCompProp';
import { useComponentMeta } from '../lib/component-props-context';

type Monaco = typeof monaco;

export interface CodeAdvancedEditorProps {
  value: string;
  onChange: (value: string) => void;
  language: Language;
  className?: string;
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

  return (
    <Editor
      defaultLanguage={mappedLanguage || language}
      defaultValue={value}
      onChange={initialized ? onEditorChange : undefined}
      path={extension ? `index.${extension}` : undefined}
      theme="vs-dark"
      onMount={(editor, monaco) => {
        setupLanguage(monaco, language, componentMeta);

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
  componentMeta: { id: string } | undefined
) => {
  const componentDef =
    componentMeta &&
    allComponentProps.find((comp) => comp.id === componentMeta.id);

  const global = `/// <reference types="react" />

declare function render(ui: React.ReactElement): void;

${
  componentDef
    ? `declare const ${componentDef.name}: React.ComponentType<${componentDef.props}>;`
    : ''
}`;

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

    defaultService.addExtraLib(global, 'global.d.ts');

    defaultService.addExtraLib(
      reactDefinition,
      'file:///node_modules/@types/react/index.d.ts'
    );
  }
};
