import * as React from 'react';
import buttonSource from './button?showroomRaw';
import buttonData from './button?showroomComponent';
import AnotherButtonDocs from './button-other-example.mdx';
import anotherbuttonDocsSource from './button-other-example.mdx?showroomRaw';
import buttonWithCommentsSource from './button-with-comments?showroomRaw';
import buttonWithCommentsData from './button-with-comments?showroomComponent';
import oldButtonSource from './old-button?showroomRaw';
import oldButtonData from './old-button?showroomComponent';
import docsSource from './button.mdx?showroomRaw';
import ButtonDocs from './button.mdx';
import {
  mdxComponents,
  ComponentMeta,
  BrowserWindow,
  ComponentDocArticle,
} from 'react-showroom/client-dist/exposes';

const { pre: Pre, code: Code } = mdxComponents;

export const DocumentingComponentPropsSource = () => (
  <Pre>
    <Code className="language-tsx" static fileName="src/components/button.tsx">
      {buttonSource}
    </Code>
  </Pre>
);

export const DocumentingComponentPropsResult = () => (
  <BrowserWindow url="http://localhost:6969" className="mb-4">
    <div className="p-6">
      <ComponentMeta componentData={buttonData} propsDefaultOpen />
    </div>
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
    <div className="p-6">
      <ComponentMeta componentData={buttonWithCommentsData} propsDefaultOpen />
    </div>
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
    <div className="p-6">
      <ComponentMeta componentData={oldButtonData} propsDefaultOpen />
    </div>
  </BrowserWindow>
);

export const MarkdownSource = () => (
  <Pre>
    <Code className="language-mdx" static fileName="src/components/button.mdx">
      {docsSource}
    </Code>
  </Pre>
);

export const MarkdownResult = () => (
  <BrowserWindow url="http://localhost:6969" className="mb-4">
    <div className="p-6">
      <ComponentDocArticle
        doc={{
          type: 'component',
          slug: buttonWithCommentsData.slug,
          data: {
            component: buttonWithCommentsData,
            doc: ButtonDocs,
          },
        }}
      />
    </div>
  </BrowserWindow>
);

export const AnotherMarkdownSource = () => (
  <Pre>
    <Code className="language-mdx" static fileName="src/components/button.mdx">
      {anotherbuttonDocsSource}
    </Code>
  </Pre>
);

export const AnotherMarkdownResult = () => (
  <BrowserWindow url="http://localhost:6969" className="mb-4">
    <div className="p-6">
      <ComponentDocArticle
        doc={{
          type: 'component',
          slug: buttonWithCommentsData.slug,
          data: {
            component: buttonWithCommentsData,
            doc: AnotherButtonDocs,
          },
        }}
      />
    </div>
  </BrowserWindow>
);
