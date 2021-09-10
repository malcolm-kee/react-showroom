declare module '*.wasm' {
  const src: string;
  export default src;
}

declare module 'react-showroom-codeblocks' {
  import type { CodeBlocks } from '@showroomjs/core';

  interface ReactShowroomData {
    items: Array<{
      codeBlocks: CodeBlocks;
    }>;
  }

  var data: ReactShowroomData;

  export default data;
}

declare module 'react-showroom-imports' {
  export const imports: Record<string, any>;
}

declare module 'react-showroom-sections' {
  import type { ReactShowroomSection } from '@showroomjs/core';

  var sections: Array<ReactShowroomSection>;

  export default sections;
}

declare namespace NodeJS {
  interface ProcessEnv {
    readonly CODE_THEME: string;
  }
}
