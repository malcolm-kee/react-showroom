import * as React from 'react';
import { useQueryClient } from 'react-query';
import { mdxComponents } from 'react-showroom/client';
import { MarkdownDocRoute } from '../components/markdown-doc-route';
import * as markdownExampleResult from './markdown-example.mdx';
import markdownExampleSource from './markdown-example.mdx?showroomRaw';
import markdownExampleCodeblocks from './markdown-example.mdx?showroomRemarkCodeblocks';
import * as markdownExampleImports from './markdown-example.mdx?showroomRemarkDocImports';

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
