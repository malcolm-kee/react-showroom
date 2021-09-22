import * as React from 'react';
import { mdxComponents } from 'react-showroom/client';
import { MarkdownDocRoute } from '../components/markdown-doc-route';
import * as markdownExampleResult from './markdown-example.mdx';
import markdownExampleSource from './markdown-example.mdx?raw';
import markdownExampleCodeblocks from './markdown-example.mdx?showroomRemarkCodeblocks';
import * as markdownExampleImports from './markdown-example.mdx?showroomRemarkDocImports';
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
      type: 'markdown',
      Component: markdownExampleResult.default,
      title: markdownExampleResult.title,
      slug: 'content',
      headings: markdownExampleResult.headings,
      frontmatter: {},
      codeblocks: markdownExampleCodeblocks,
      imports: markdownExampleImports.imports,
    }}
  />
);
