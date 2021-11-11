import * as React from 'react';
import { allComponentsMetadata, mdxComponents } from 'react-showroom/client';
import { ComponentDocRoute } from '../components/component-doc-route';
import ButtonPlaygroundDocs2, {
  headings as headings2,
} from './button-playground-example-2.mdx';
import playgroundSource2 from './button-playground-example-2.mdx?raw';
import playgroundCodeBlocks2 from './button-playground-example-2.mdx?showroomRemarkCodeblocks';
import { imports as imports2 } from './button-playground-example-2.mdx?showroomRemarkImports';
import ButtonPlaygroundDocs, {
  headings,
} from './button-playground-example.mdx';
import playgroundSource from './button-playground-example.mdx?raw';
import playgroundCodeBlocks from './button-playground-example.mdx?showroomRemarkCodeblocks';
import { imports } from './button-playground-example.mdx?showroomRemarkImports';
import { Button } from './components/button';
import { useSetCompilationCaches } from './set-compilation-caches';

const allMetadata = Object.values(allComponentsMetadata);

const buttonData = allMetadata.find((m) => m.displayName === 'Button')!;
const { pre: Pre, code: Code } = mdxComponents;

const playgroundContent = {
  doc: ButtonPlaygroundDocs,
  headings,
  imports,
  codeblocks: playgroundCodeBlocks,
  Component: Button,
};

export const PlaygroundSource = () => {
  useSetCompilationCaches([playgroundCodeBlocks, playgroundCodeBlocks2]);

  return (
    <Pre>
      <Code
        className="language-mdx"
        static
        fileName="src/components/button.mdx"
      >
        {playgroundSource}
      </Code>
    </Pre>
  );
};

export const PlaygroundResult = () => (
  <ComponentDocRoute
    content={playgroundContent}
    slug=""
    metadata={buttonData}
  />
);

const playgroundContent2 = {
  doc: ButtonPlaygroundDocs2,
  headings: headings2,
  imports: imports2,
  codeblocks: playgroundCodeBlocks2,
  Component: Button,
};

export const PlaygroundSource2 = () => {
  return (
    <Pre>
      <Code
        className="language-mdx"
        static
        fileName="src/components/button.mdx"
      >
        {playgroundSource2}
      </Code>
    </Pre>
  );
};

export const PlaygroundResult2 = () => (
  <ComponentDocRoute
    content={playgroundContent2}
    slug=""
    metadata={buttonData}
  />
);
