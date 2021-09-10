declare module '*.wasm' {
  const src: string;
  export default src;
}

declare module 'react-compdoc-codeblocks' {
  import type { CodeBlocks } from '@compdoc/core';

  interface ReactCompdocData {
    items: Array<{
      codeBlocks: CodeBlocks;
    }>;
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

declare namespace NodeJS {
  interface ProcessEnv {
    readonly CODE_THEME: string;
  }
}
