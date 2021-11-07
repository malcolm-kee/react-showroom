import * as React from 'react';
import { mdxComponents } from 'react-showroom/client';
import { MarkdownDocRoute } from '../components/markdown-doc-route';
import * as markdownExampleResult from './markdown-example.mdx';
import markdownExampleSource from './markdown-example.mdx?raw';
import markdownExampleCodeblocks from './markdown-example.mdx?showroomRemarkCodeblocks';
import * as markdownExampleImports from './markdown-example.mdx?showroomRemarkDocImports';
import * as markdownCodeExampleResult from './markdown-code-example.mdx';
import markdownCodeExampleSource from './markdown-code-example.mdx?raw';
import markdownCodeExampleCodeblocks from './markdown-code-example.mdx?showroomRemarkCodeblocks';
import * as markdownCodeExampleImports from './markdown-code-example.mdx?showroomRemarkDocImports';
import { useSetCompilationCaches } from './set-compilation-caches';

const { pre: Pre, code: Code } = mdxComponents;

export const MarkdownExampleSource = () => {
  useSetCompilationCaches([markdownExampleCodeblocks]);

  return (
    <Pre>
      <Code className="language-mdx" static fileName="docs/content.mdx">
        {markdownExampleSource}
      </Code>
    </Pre>
  );
};

export const MarkdownExampleResult = () => (
  <MarkdownDocRoute
    data={{
      Component: markdownExampleResult.default,
      headings: markdownExampleResult.headings,
      codeblocks: markdownExampleCodeblocks,
      imports: markdownExampleImports.imports,
    }}
    title="Title"
  />
);

export const MarkdownCodeExampleSource = () => {
  useSetCompilationCaches([markdownCodeExampleCodeblocks]);

  return (
    <Pre>
      <Code className="language-mdx" static fileName="docs/content.mdx">
        {markdownCodeExampleSource}
      </Code>
    </Pre>
  );
};

export const MarkdownCodeExampleResult = () => (
  <MarkdownDocRoute
    data={{
      Component: markdownCodeExampleResult.default,
      headings: markdownCodeExampleResult.headings,
      codeblocks: markdownCodeExampleCodeblocks,
      imports: markdownCodeExampleImports.imports,
    }}
    title="Code Blocks in Markdown"
  />
);
