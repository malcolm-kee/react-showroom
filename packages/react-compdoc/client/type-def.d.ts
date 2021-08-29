declare module '*.wasm' {
  const src: string;
  export default src;
}

declare module 'react-compdoc-components' {
  import type { ComponentDoc as DocgenComponentDoc } from 'react-docgen-typescript';
  import type { ComponentType } from 'react';

  interface ComponentDocItem {
    component: DocgenComponentDoc;
    doc: null | ComponentType<{}>;
  }

  interface ReactCompdocData {
    items: Array<ComponentDocItem>;
  }

  var data: ReactCompdocData;

  export default data;
}
