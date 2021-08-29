import type { LoaderContext } from 'webpack';
import type { ComponentDoc as DocgenComponentDoc } from 'react-docgen-typescript';
import type { ComponentType } from 'react';

export interface ReactCompdocConfiguration {
  components?: string;
}

export interface NormalizedReactCompdocConfiguration {
  components: string;
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
