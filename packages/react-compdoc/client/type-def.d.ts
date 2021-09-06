declare module '*.wasm' {
  const src: string;
  export default src;
}

declare module 'react-compdoc-components' {
  import type { ComponentDoc as DocgenComponentDoc } from 'react-docgen-typescript';
  import type { ComponentType } from 'react';
  import type { CodeBlocks } from '@compdoc/core';

  export interface ComponentDocItem {
    component: DocgenComponentDoc;
    doc: null | ComponentType<any>;
    /**
     * codeBlocks are [code snippet]: [compiled code] key-value pair
     * generated at build time to improve initial load UI.
     */
    codeBlocks: CodeBlocks;
  }

  interface ReactCompdocData {
    items: Array<ComponentDocItem>;
  }

  var data: ReactCompdocData;

  export default data;
}

declare module 'react-compdoc-imports' {
  export const imports: Record<string, any>;
}
