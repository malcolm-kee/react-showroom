import type { ComponentType } from 'react';
import type { ComponentDoc as DocgenComponentDoc } from 'react-docgen-typescript';
import type { Configuration } from 'webpack';

export { flattenArray, NestedArray } from './flatten-array';
export { Ssr } from './ssr-types';
export { ImportMapData, Packages, transpileImports } from './transpile-imports';

export interface RequestCompileData {
  source: string;
  messageId: number;
}

export interface CompilationError {
  type: 'compilationError';
  line: number;
}

export interface CompilationSuccessResult {
  type: 'success';
  code: string;
  messageId: number;
}

export type CompileResult =
  | CompilationSuccessResult
  | {
      type: 'error';
      error: string;
      messageId: number;
      meta?: CompilationError;
    };

export type CodeBlocks = Record<string, CompilationSuccessResult | undefined>;

export interface ComponentDocItem {
  component: DocgenComponentDoc & { slug: string };
  doc: null | ComponentType<any>;
}

export type Environment = 'development' | 'production';

export interface SectionConfiguration {
  /**
   * section title
   */
  title: string;
  /**
   * location of a Markdown file containing the overview content.
   */
  content?: string;
  /**
   * A short description of this section.
   */
  description?: string;
  /**
   * a glob pattern string
   */
  components?: string;
  sections?: Array<SectionConfiguration>;
  /**
   * an URL to navigate to instead of navigating to the section content
   */
  href?: string;
}

export interface ReactCompdocConfiguration
  extends Pick<SectionConfiguration, 'components' | 'sections'> {
  imports: Array<{
    name: string;
    path: string;
  }>;
  /**
   * Title to be displayed for the site.
   *
   * @default 'React Compdoc'
   */
  title?: string;
  webpackConfig?: Configuration | ((env: Environment) => Configuration);
  /**
   * output of the generated site.
   *
   * @default 'compdoc'
   */
  outDir?: string;
  /**
   * controls if the build output should be pre-rendered.
   *
   * This is useful to ensure your components are SSR-friendly.
   *
   * Note that this would increase time to generate the static site because
   * we will need to generate separate bundle for pre-rendering.
   *
   * @default false
   */
  prerender?: boolean;
}

export interface ReactCompdocComponentSectionConfig {
  type: 'component';
  sourcePath: string;
  docPath: string | null;
  parentSlugs: Array<string>;
}

interface ReactCompdocMarkdownSectionConfig {
  type: 'markdown';
  sourcePath: string;
  parentSlugs: Array<string>;
  title?: string;
}

interface ReactCompdocLinkSectionConfig {
  type: 'link';
  href: string;
  title: string;
}

interface ReactCompdocGroupSectionConfig {
  type: 'group';
  title: string;
  slug: string;
  parentSlugs: Array<string>;
  docPath: string | null;
  items: Array<ReactCompdocSectionConfig>;
}

/**
 * @private
 */
export type ReactCompdocSectionConfig =
  | ReactCompdocComponentSectionConfig
  | ReactCompdocMarkdownSectionConfig
  | ReactCompdocLinkSectionConfig
  | ReactCompdocGroupSectionConfig;

export interface NormalizedReactCompdocConfiguration
  extends Omit<ReactCompdocConfiguration, 'components' | 'sections'> {
  title: string;
  sections: Array<ReactCompdocSectionConfig>;
  components: Array<ReactCompdocComponentSectionConfig>;
  outDir: string;
  prerender: boolean;
}

export interface ReactCompdocComponentSection {
  type: 'component';
  data: ComponentDocItem;
  slug: string;
}

export interface ReactCompdocMarkdownSection {
  type: 'markdown';
  Component: ComponentType<any>;
  title: string;
  slug: string;
}

interface ReactCompdocLinkSection {
  type: 'link';
  href: string;
  title: string;
}

export interface ReactCompdocGroupSection {
  type: 'group';
  title: string;
  docPath: string | null;
  Component: ComponentType<any> | null;
  slug: string;
  items: Array<ReactCompdocSection>;
}

export type ReactCompdocSection =
  | ReactCompdocComponentSection
  | ReactCompdocMarkdownSection
  | ReactCompdocLinkSection
  | ReactCompdocGroupSection;
