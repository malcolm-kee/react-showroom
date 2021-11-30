declare module '*?showroomRaw' {
  var value: string;

  export default value;
}

declare module '*?raw' {
  var value: string;

  export default value;
}

declare module '*.mdx?showroomRemarkCodeblocks' {
  import { CodeBlocks } from '@showroomjs/core';

  var codeBlocks: CodeBlocks;

  export = codeBlocks;
}

declare module '*.mdx?showroomRemarkImportsDts' {
  var value: Record<string, string>;

  export default value;
}

declare module '*?showroomRemarkImports' {
  export var imports: Record<string, any>;
}

declare module '*?showroomRemarkDocImports' {
  export var imports: Record<string, any>;
}

declare module '*?showroomAllComp' {
  export default any;
}

declare module '*.mdx' {
  import {
    ReactShowroomMarkdownFrontmatter,
    ReactShowroomMarkdownHeading,
  } from '@showroomjs/core/react';
  import { ComponentType } from 'react';

  export const headings: Array<ReactShowroomMarkdownHeading>;

  export const frontmatter: ReactShowroomMarkdownFrontmatter | undefined;

  export const title: string;

  const data: ComponentType<any>;

  export default data;
}

declare module '*.png' {
  const src: string;
  export default src;
}
