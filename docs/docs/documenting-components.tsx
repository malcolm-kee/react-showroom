import * as React from 'react';
import {
  BrowserWindow,
  ComponentMeta,
  mdxComponents,
} from 'react-showroom/client';
import { ComponentDocRoute } from '../components/component-doc-route';
import AnotherButtonDocs from './button-other-example.mdx';
import anotherbuttonDocsSource from './button-other-example.mdx?raw';
import anotherButtonCodeBlocks from './button-other-example.mdx?showroomRemarkCodeblocks';
import { imports as anotherButtonImports } from './button-other-example.mdx?showroomRemarkImports';
import buttonWithCommentsSource from './button-with-comments?raw';
import buttonWithCommentsData from './button-with-comments?showroomComponent';
import ButtonDocs from './components/button.mdx';
import docsSource from './components/button.mdx?raw';
import buttonCodeblocks from './components/button.mdx?showroomRemarkCodeblocks';
import { imports as buttonImports } from './components/button.mdx?showroomRemarkImports';
import buttonSource from './components/button?raw';
import buttonData from './components/button?showroomComponent';
import oldButtonSource from './old-button?raw';
import oldButtonData from './old-button?showroomComponent';
import { useSetCompilationCaches } from './set-compilation-caches';

const { pre: Pre, code: Code } = mdxComponents;

export const DocumentingComponentPropsSource = () => {
  useSetCompilationCaches([buttonCodeblocks, anotherButtonCodeBlocks]);

  return (
    <Pre>
      <Code
        className="language-tsx"
        static
        fileName="src/components/button.tsx"
      >
        {buttonSource}
      </Code>
    </Pre>
  );
};

export const DocumentingComponentPropsResult = () => (
  <BrowserWindow url="http://localhost:6969" className="mb-4">
    <article className="p-6">
      <ComponentMeta componentData={buttonData} propsDefaultOpen slug="" />
    </article>
  </BrowserWindow>
);

export const DocumentingComponentCommentsSource = () => (
  <Pre>
    <Code className="language-tsx" static fileName="src/components/button.tsx">
      {buttonWithCommentsSource}
    </Code>
  </Pre>
);

export const DocumentingComponentCommentsResult = () => (
  <BrowserWindow url="http://localhost:6969" className="mb-4">
    <article className="p-6">
      <ComponentMeta
        componentData={buttonWithCommentsData}
        propsDefaultOpen
        slug=""
      />
    </article>
  </BrowserWindow>
);

export const DeprecatedExampleSource = () => (
  <Pre>
    <Code className="language-tsx" static fileName="src/components/button.tsx">
      {oldButtonSource}
    </Code>
  </Pre>
);

export const DeprecatedExampleResult = () => (
  <BrowserWindow url="http://localhost:6969" className="mb-4">
    <article className="p-6">
      <ComponentMeta componentData={oldButtonData} propsDefaultOpen slug="" />
    </article>
  </BrowserWindow>
);

export const MarkdownSource = () => (
  <Pre>
    <Code className="language-mdx" static fileName="src/components/button.mdx">
      {docsSource}
    </Code>
  </Pre>
);

const markdownContent = {
  metadata: buttonWithCommentsData,
  doc: ButtonDocs,
  imports: buttonImports,
  codeblocks: buttonCodeblocks,
};

export const MarkdownResult = () => (
  <ComponentDocRoute content={markdownContent} slug="" />
);

export const AnotherMarkdownSource = () => (
  <Pre>
    <Code className="language-mdx" static fileName="src/components/button.mdx">
      {anotherbuttonDocsSource}
    </Code>
  </Pre>
);

const anotherMarkdownContent = {
  doc: AnotherButtonDocs,
  imports: anotherButtonImports,
  codeblocks: anotherButtonCodeBlocks,
  metadata: buttonWithCommentsData,
};

export const AnotherMarkdownResult = () => (
  <ComponentDocRoute content={anotherMarkdownContent} slug="" />
);
