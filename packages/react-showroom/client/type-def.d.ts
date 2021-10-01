/// <reference types="vite/client" />

declare module '*.wasm' {
  const src: string;
  export default src;
}

declare module 'react-showroom-codeblocks' {
  import type { CodeBlocks } from '@showroomjs/core';

  interface ReactShowroomData {
    items: Array<CodeBlocks>;
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

declare module 'react-showroom-require' {
  export default {};
}

declare namespace NodeJS {
  import type { ThemeConfiguration } from '@showroomjs/core/react';

  interface ProcessEnv {
    readonly REACT_SHOWROOM_THEME: ThemeConfiguration;
    readonly PRERENDER: boolean;
    readonly IS_SPA: boolean;
    readonly SITE_URL: string;
    readonly BASE_PATH: string;
  }
}
