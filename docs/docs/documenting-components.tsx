import * as React from 'react';
import {
  allComponentsMetadata,
  BrowserWindow,
  ComponentMeta,
  mdxComponents,
} from 'react-showroom/client';
import { ComponentDocRoute } from '../components/component-doc-route';
import { Button } from './components/button';
import buttonWithCommentsSource from './components/button-with-comments?raw';
import ButtonDocs, {
  headings as buttonHeadings,
} from './components/button.mdx';
import docsSource from './components/button.mdx?raw';
import buttonCodeblocks from './components/button.mdx?showroomRemarkCodeblocks';
import { imports as buttonImports } from './components/button.mdx?showroomRemarkImports';
import buttonSource from './components/button?raw';
import oldButtonSource from './components/old-button?raw';
import AnotherButtonDocs, {
  headings as anotherButtonHeadings,
} from './documenting-components/button-other-example.mdx';
import anotherbuttonDocsSource from './documenting-components/button-other-example.mdx?raw';
import anotherButtonCodeBlocks from './documenting-components/button-other-example.mdx?showroomRemarkCodeblocks';
import { imports as anotherButtonImports } from './documenting-components/button-other-example.mdx?showroomRemarkImports';

import ButtonUnionPropsDocs, {
  headings as buttonUnionPropsHeadings,
} from './documenting-components/button-union-example.mdx';
import buttonUnionPropsDocsSource from './documenting-components/button-union-example.mdx?raw';
import buttonUnionPropsCodeBlocks from './documenting-components/button-union-example.mdx?showroomRemarkCodeblocks';
import { imports as buttonUnionPropsImports } from './documenting-components/button-union-example.mdx?showroomRemarkImports';

import { useSetCompilationCaches } from './set-compilation-caches';

const allMetadata = Object.values(allComponentsMetadata);

const buttonWithCommentsData = allMetadata.find(
  (m) => m.displayName === 'ButtonWithComments'
)!;
const buttonData = allMetadata.find((m) => m.displayName === 'Button')!;
const oldButtonData = allMetadata.find((m) => m.displayName === 'OldButton')!;

const { pre: Pre, code: Code } = mdxComponents;

export const DocumentingComponentPropsSource = () => {
  useSetCompilationCaches([
    buttonCodeblocks,
    anotherButtonCodeBlocks,
    buttonUnionPropsCodeBlocks,
  ]);

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
  doc: ButtonDocs,
  headings: buttonHeadings,
  imports: buttonImports,
  codeblocks: buttonCodeblocks,
  Component: Button,
  loadDts: () => import('./components/button.mdx?showroomRemarkImportsDts'),
};

export const MarkdownResult = () => (
  <ComponentDocRoute content={markdownContent} slug="" metadata={buttonData} />
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
  headings: anotherButtonHeadings,
  imports: anotherButtonImports,
  codeblocks: anotherButtonCodeBlocks,
  loadDts: () =>
    import(
      './documenting-components/button-other-example.mdx?showroomRemarkImportsDts'
    ),
  Component: Button,
};

export const AnotherMarkdownResult = () => (
  <ComponentDocRoute
    content={anotherMarkdownContent}
    slug=""
    metadata={buttonData}
  />
);

export const UnionPropsSource = () => (
  <Pre>
    <Code className="language-mdx" static fileName="src/components/button.mdx">
      {buttonUnionPropsDocsSource}
    </Code>
  </Pre>
);

const unionPropsContent = {
  doc: ButtonUnionPropsDocs,
  headings: buttonUnionPropsHeadings,
  imports: buttonUnionPropsImports,
  codeblocks: buttonUnionPropsCodeBlocks,
  Component: Button,
  loadDts: () =>
    import(
      './documenting-components/button-union-example.mdx?showroomRemarkImportsDts'
    ),
};

export const UnionPropsResult = () => (
  <ComponentDocRoute
    content={unionPropsContent}
    slug=""
    metadata={buttonData}
  />
);
