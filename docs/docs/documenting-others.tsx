import * as React from 'react';
import { useQueryClient } from 'react-query';
import {
  BrowserWindow,
  MarkdownArticle,
  mdxComponents,
} from 'react-showroom/client';
import * as markdownExampleResult from './markdown-example.mdx';
import markdownExampleSource from './markdown-example.mdx?showroomRaw';
import markdownExampleCodeblocks from './markdown-example.mdx?showroomRemarkCodeblocks';

const { pre: Pre, code: Code } = mdxComponents;

export const MarkdownExampleSource = () => {
  const queryClient = useQueryClient();

  React.useEffect(() => {
    [markdownExampleCodeblocks].forEach((blocks) => {
      Object.keys(blocks).forEach((soureCode) =>
        queryClient.setQueryData(
          ['codeCompilation', soureCode],
          blocks[soureCode]
        )
      );
    });
  }, []);

  return (
    <Pre>
      <Code className="language-mdx" static fileName="docs/content.mdx">
        {markdownExampleSource}
      </Code>
    </Pre>
  );
};

export const MarkdownExampleResult = () => (
  <BrowserWindow url="http://localhost:6969/content" className="mb-4">
    <section className="px-6">
      <MarkdownArticle
        section={{
          type: 'markdown',
          Component: markdownExampleResult.default,
          title: markdownExampleResult.title,
          slug: 'content',
          headings: markdownExampleResult.headings,
          frontmatter: {},
        }}
      />
    </section>
  </BrowserWindow>
);
