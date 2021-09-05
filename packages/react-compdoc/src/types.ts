import type { ComponentType } from 'react';
import type { ComponentDoc as DocgenComponentDoc } from 'react-docgen-typescript';
import type { Configuration, LoaderContext } from 'webpack';

export type Environment = 'development' | 'production';

export interface ReactCompdocConfiguration {
  imports: Array<{
    name: string;
    path: string;
  }>;
  webpackConfig?: Configuration | ((env: Environment) => Configuration);
  components?: string;
  /**
   * output of the generated site.
   *
   * @default 'compdoc'
   */
  outDir?: string;
  /**
   * controls if the build output should be pre-rendered.
   *
   * @default true
   */
  prerender?: boolean;
}

export interface NormalizedReactCompdocConfiguration
  extends ReactCompdocConfiguration {
  components: string;
  outDir: string;
  prerender: boolean;
}

export interface ReactCompdocLoaderContext extends LoaderContext<any> {
  _reactcompdoc: NormalizedReactCompdocConfiguration;
}

export interface ComponentDocItem {
  component: DocgenComponentDoc;
  doc: null | ComponentType<{}>;
}

export interface ReactCompdocData {
  items: Array<ComponentDocItem>;
}
