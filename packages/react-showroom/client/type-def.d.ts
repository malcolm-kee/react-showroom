declare module '*.wasm' {
  const src: string;
  export default src;
}

declare module '?raw' {
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

declare module 'react-showroom-all-imports' {
  declare const imports: Record<string, any>;
  export default imports;
}

declare module 'react-showroom-all-components' {
  export const AllComponents: Record<string, any>;
}

declare module 'react-showroom-doc-placeholder' {
  import type { ComponentType } from 'react';

  declare const DocPlaceholder: ComponentType<{
    componentFilePath: string;
  }>;
  export default DocPlaceholder;
}

declare module 'react-showroom-comp-metadata?showroomAllComp' {
  import { ComponentDoc } from 'react-docgen-typescript';

  declare const All: Record<string, ComponentDoc & { id: string }>;

  export default All;
}

declare module 'react-showroom-comp-metadata?showroomCompProp' {
  declare const allComponentProps: string;

  export default allComponentProps;
}

declare module 'react-showroom-index' {
  import { SearchIndexItem } from '@showroomjs/core/react';

  declare const index: Array<SearchIndexItem>;

  export default index;
}

declare namespace NodeJS {
  import type { FrameDimension, Environment } from '@showroomjs/core';
  import type { ThemeConfiguration } from '@showroomjs/core/react';
  import type { CompilerOptions } from 'typescript';
  import type { Spec } from 'axe-core';

  interface ProcessEnv {
    readonly NODE_ENV: Environment;
    readonly REACT_SHOWROOM_THEME: ThemeConfiguration;
    readonly PRERENDER: boolean;
    readonly PRERENDER_EXAMPLE: boolean;
    readonly SITE_URL: string;
    readonly BASE_PATH: string;
    readonly SSR: boolean;
    readonly AUDIENCE_TOGGLE: 'design' | 'code' | false;
    readonly EXAMPLE_DIMENSIONS: Array<FrameDimension>;
    readonly ENABLE_ADVANCED_EDITOR: boolean;
    readonly SHOW_DEVICE_FRAME: boolean;
    readonly SYNC_STATE_TYPE: 'state' | 'event';
    readonly A11Y_CONFIG: Spec;
    readonly COMPONENTS_ENTRY_NAME: string | undefined;
    readonly COMPILER_OPTIONS: Partial<CompilerOptions>;
    readonly USE_SW: boolean;
  }
}
