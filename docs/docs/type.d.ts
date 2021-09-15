declare module '*?showroomRaw' {
  var value: string;

  export default value;
}

declare module '*?showroomRemarkImports' {
  export var imports: Record<string, any>;
}

declare module '*?showroomComponent' {
  import { ComponentDocItem } from '@showroomjs/core/react';

  var data: ComponentDocItem['component'];

  export default data;
}

declare module '*.mdx' {
  import { ComponentType } from 'react';

  var data: ComponentType<any>;

  export = data;
}
