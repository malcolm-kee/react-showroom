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

declare module 'react-showroom-sections' {
  import type { ReactShowroomSection } from '@showroomjs/core/react';

  var sections: Array<ReactShowroomSection>;

  export default sections;
}

declare module 'react-showroom-wrapper' {
  import type { ComponentType } from 'react';

  var Wrapper: ComponentType<{}>;

  export default Wrapper;
}

declare namespace NodeJS {
  interface ProcessEnv {
    readonly REACT_SHOWROOM_THEME: string;
  }
}
