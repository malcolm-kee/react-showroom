declare module '*.wasm' {
  const src: string;
  export default src;
}

declare module 'react-compdoc-components' {
  import type { ComponentDoc as DocgenComponentDoc } from 'react-docgen-typescript';
  import type { ComponentType } from 'react';
  import type { CodeBlocks, ComponentDocItem } from '@compdoc/core';

  interface ReactCompdocData {
    items: Array<ComponentDocItem>;
  }

  var data: ReactCompdocData;

  export default data;
}

declare module 'react-compdoc-imports' {
  export const imports: Record<string, any>;
}

declare module 'react-compdoc-sections' {
  import type { ReactCompdocSection } from '@compdoc/core';

  var sections: Array<ReactCompdocSection>;

  export default sections;
}
