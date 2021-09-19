import * as React from 'react';
import {
  BrowserWindow,
  ComponentMeta,
  mdxComponents,
} from 'react-showroom/client';
import { ComponentDocRoute } from '../components/component-doc-route';
import AnotherButtonDocs from './button-other-example.mdx';
import anotherbuttonDocsSource from './button-other-example.mdx?showroomRaw';
import anotherButtonCodeBlocks from './button-other-example.mdx?showroomRemarkCodeblocks';
import { imports as buttonWithCommentsImports } from './button-other-example.mdx?showroomRemarkImports';
import buttonWithCommentsData from './button-with-comments?showroomComponent';
import buttonWithCommentsSource from './button-with-comments?showroomRaw';
import ButtonDocs from './button.mdx';
import docsSource from './button.mdx?showroomRaw';
import buttonCodeblocks from './button.mdx?showroomRemarkCodeblocks';
import { imports as buttonImports } from './button.mdx?showroomRemarkImports';
import buttonData from './button?showroomComponent';
import buttonSource from './button?showroomRaw';
import oldButtonData from './old-button?showroomComponent';
import oldButtonSource from './old-button?showroomRaw';
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

const markdownData = {
  component: buttonWithCommentsData,
  doc: ButtonDocs,
  imports: buttonImports,
  codeblocks: buttonCodeblocks,
};

export const MarkdownResult = () => <ComponentDocRoute data={markdownData} />;

export const AnotherMarkdownSource = () => (
  <Pre>
    <Code className="language-mdx" static fileName="src/components/button.mdx">
      {anotherbuttonDocsSource}
    </Code>
  </Pre>
);

const anotherMarkdownData = {
  component: buttonWithCommentsData,
  doc: AnotherButtonDocs,
  imports: buttonWithCommentsImports,
  codeblocks: anotherButtonCodeBlocks,
};

export const AnotherMarkdownResult = () => (
  <ComponentDocRoute data={anotherMarkdownData} />
);
