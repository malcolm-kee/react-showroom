import type { Options as HtmlWebpackTagsPluginOptions } from 'html-webpack-tags-plugin';
import type { PrismTheme } from 'prism-react-renderer';
import type { ComponentType } from 'react';
import type {
  ComponentDoc as DocgenComponentDoc,
  ParserOptions,
} from 'react-docgen-typescript';
import type { CompilerOptions } from 'typescript';
import type { Configuration } from 'webpack';
import type { DeviceName, FrameDimension } from './device-dimensions';
import type { Spec } from 'axe-core';
import { CodeBlocks, Environment } from './index';

export interface HtmlOptions
  extends Pick<
    HtmlWebpackTagsPluginOptions,
    'scripts' | 'tags' | 'links' | 'metas'
  > {}

export interface ItemConfigBase {
  title?: string;
  /**
   * path for the section. Will be inferred from title if not provided
   */
  path?: string;
  hideFromSidebar?: boolean;
}

export interface ComponentSectionConfiguration extends ItemConfigBase {
  type: 'components';
  /**
   * A short description of this section.
   */
  description?: string;
  /**
   * glob pattern to look for the components
   */
  components: string | Array<string>;
}

export interface ContentItemConfiguration extends ItemConfigBase {
  type: 'content';
  /**
   * location of a Markdown file containing the overview content.
   */
  content: string;
  /**
   * @internal
   *
   * Used by docs site
   */
  _associatedComponentName?: string;
}

export interface LinkItemConfiguration {
  type: 'link';
  title: string;
  /**
   * URL for the link
   */
  href: string;
}

export interface DocSectionConfiguration extends ItemConfigBase {
  type: 'docs';
  /**
   * relative path to the folder that contents all the markdown files.
   */
  folder: string;
  ignores?: Array<string>;
  /**
   * Formatting the label for the title in the sidebar.
   *
   * By default it will use the first h1 tag of the markdown file if available.
   *
   * Note that this function must be pure and do not use any outer scope variable as
   * we will stringify it and run it on client side.
   */
  formatLabel?: (oriTitle: string) => string;
}

export interface GroupSectionConfiguration extends ItemConfigBase {
  type: 'group';
  /**
   * section title
   */
  title?: string;
  /**
   * path for the section. Will be inferred from title if not provided
   */
  path?: string;
  items: Array<ItemConfiguration>;
}

export type ItemConfiguration =
  | ComponentSectionConfiguration
  | ContentItemConfiguration
  | LinkItemConfiguration
  | DocSectionConfiguration
  | GroupSectionConfiguration;

export type ImportConfig =
  | string
  | {
      name: string;
      path: string;
    };

export interface ThemeConfiguration {
  /**
   * Title to be displayed for the site.
   *
   * @default 'React Showroom'
   */
  title: string;
  /**
   * One of the themes provided by `'prism-react-renderer'`.
   */
  codeTheme: PrismTheme;
  /**
   * whether to include CSS reset
   *
   * @default true
   */
  resetCss: boolean;
  /**
   * Default value for the audience toggle.
   *
   * Set to `false` if you do not want to show the toggle, which means it will always be 'code'.
   */
  audienceToggle: 'design' | 'code' | false;
  colors: {
    'primary-50': string;
    'primary-100': string;
    'primary-200': string;
    'primary-300': string;
    'primary-400': string;
    'primary-500': string;
    'primary-600': string;
    'primary-700': string;
    'primary-800': string;
    'primary-900': string;
  };
  navbar: {
    /**
     * Version for the library to be shown in header
     */
    version?: string;
    logo?: {
      alt: string;
      src: string;
      width?: string;
      height?: string;
    };
    items?: Array<{
      to: string;
      label: string;
      showInMobileMenu?: boolean;
    }>;
  };
  favicon?: string;
}

export interface DocgenConfiguration {
  /**
   * @default 'tsconfig.json' at project root
   */
  tsconfigPath: string;
  options: ParserOptions;
}

export interface FrameWithMaybeName extends Omit<FrameDimension, 'name'> {
  name?: string;
}

export interface ExampleConfiguration {
  dimensions: Array<FrameDimension>;
  /**
   * path to a module/file that export default a React component that should be displayed when there is no associated markdown file for component.
   */
  placeholder?: string;
  /**
   * whether to allow using advanced editor (which is monaco editor) in standalone view.
   *
   * Enable this may cause some performance issue, so you can decide to disable it for development.
   *
   * @default true
   */
  enableAdvancedEditor: boolean;
  /**
   * mechanism to sync states across frames.
   *
   * @default 'state'
   */
  syncStateType: 'state' | 'event';
  /**
   * whether to show device frame in standalone view
   *
   * @default true
   */
  showDeviceFrame: boolean;
  a11y: {
    config: Spec;
  };
}

export interface ShowroomHtmlConfiguration {
  showroom?: HtmlOptions;
  preview?: HtmlOptions;
}

export interface ReactShowroomConfiguration {
  /**
   * URL for the site.
   *
   * @example 'https://react-showroom.js.org'
   */
  url?: string;
  /**
   * a glob pattern string to search for all your components.
   *
   * If you want to organize your components in a nested structure, use `items`.
   */
  components?: string;
  /**
   * Patterns to ignore for components.
   *
   * @default Default patterns for jest tests
   */
  ignores?: Array<string>;
  /**
   * Ignore components that don’t have an example file nor props definition other than defined in `'@types/react'`.
   */
  skipEmptyComponent?: boolean;
  items?: Array<ItemConfiguration>;
  example?: Partial<Omit<ExampleConfiguration, 'dimensions'>> & {
    dimensions?: Array<FrameWithMaybeName | DeviceName>;
    widths?: Array<number>;
  };
  /**
   * Webpack configuration to load your components (or any other resources that are needed by the components, e.g. CSS)
   */
  webpackConfig?: Configuration | ((env: Environment) => Configuration);
  componentsEntry?: {
    name: string;
    path: string;
    dts?: string | false;
  };
  /**
   * packages to be available in examples via `import`.
   */
  imports?: Array<string>;
  /**
   * Modules that are required for your style guide. Useful for third-party styles or polyfills.
   */
  require?: Array<string>;
  theme?: Partial<ThemeConfiguration>;
  /**
   * Your application static assets folder will be accessible as / in the style guide dev server.
   *
   * @example 'public'
   */
  assetDir?: string;
  /**
   * path to a module/file that export default a React component that should wrap the entire showroom.
   *
   * Use this to render context providers that your application need, e.g. Redux Provider.
   */
  wrapper?: string;
  docgen?: Partial<Pick<DocgenConfiguration, 'tsconfigPath'>>;
  html?: ShowroomHtmlConfiguration;
  /**
   * Configuration to specify how css should be processed.
   *
   * Default to enable `css-loader` and auto inject postcss if `postcss.config.js` is detected.
   *
   * Set to `false` if your webpack config already process css.
   */
  css?:
    | {
        postcss?: boolean;
      }
    | false;
  devServer?: {
    port?: number;
  };
  build?: {
    /**
     * Output folder for the generated site.
     *
     * @default 'showroom'
     */
    outDir?: string;
    /**
     * controls if the examples should be pre-rendered.
     *
     * This is useful to ensure your components are SSR-friendly.
     *
     * @default true
     */
    prerender?: boolean;
    /**
     * Set a prefix for the static site.
     *
     * @example '/docs'
     *
     * @default ''
     */
    basePath?: string;
  };
  /**
   * Set cache directory for the build.
   *
   * Pass `false` to disable caching.
   *
   * @default '.showroom_cache'
   */
  cacheDir?: string;
  debug?: boolean;
}

export interface ReactShowroomComponentSectionConfig {
  type: 'component';
  sourcePath: string;
  docPath: string | null;
  parentSlugs: Array<string>;
  id: string;
  hideFromSidebar?: boolean;
}

interface ReactShowroomMarkdownSectionConfig {
  type: 'markdown';
  sourcePath: string;
  slug: string;
  title?: string;
  formatLabel: (oriTitle: string) => string;
  hideFromSidebar?: boolean;
  /**
   * @internal
   *
   * Used by docs site
   */
  _associatedComponentName?: string;
}

interface ReactShowroomLinkSectionConfig {
  type: 'link';
  href: string;
  title: string;
  hideFromSidebar?: boolean;
}

interface ReactShowroomGroupSectionConfig {
  type: 'group';
  title: string;
  slug: string;
  items: Array<ReactShowroomSectionConfig>;
  hideFromSidebar?: boolean;
}

/**
 * @private
 */
export type ReactShowroomSectionConfig =
  | ReactShowroomComponentSectionConfig
  | ReactShowroomMarkdownSectionConfig
  | ReactShowroomLinkSectionConfig
  | ReactShowroomGroupSectionConfig;

export interface NormalizedReactShowroomConfiguration
  extends Omit<
    ReactShowroomConfiguration,
    | 'items'
    | 'devServer'
    | 'build'
    | 'components'
    | 'css'
    | 'cacheDir'
    | 'imports'
  > {
  sections: Array<ReactShowroomSectionConfig>;
  ignores: Array<string>;
  outDir: string;
  imports: Array<ImportConfig>;
  cacheDir: string;
  prerender: boolean;
  basePath: string;
  devServerPort: number;
  docgen: DocgenConfiguration;
  theme: ThemeConfiguration;
  url: string;
  css: {
    enabled: boolean;
    usePostcss: boolean;
  };
  html: ShowroomHtmlConfiguration;
  example: ExampleConfiguration;
  /**
   * typescript compiler options to be used in advanced code editor
   */
  compilerOptions: Partial<CompilerOptions>;
}

export interface ReactShowroomComponentContent {
  Component: ComponentType<any> | undefined;
  doc: null | ComponentType<any>;
  headings: Array<ReactShowroomMarkdownHeading>;
  imports: Record<string, any>;
  codeblocks: CodeBlocks;
  loadDts: () => Promise<{ default: Record<string, string> }>;
}

export interface ComponentDocItem {
  load: () => Promise<ReactShowroomComponentContent>;
}

export interface ReactShowroomComponentSection {
  type: 'component';
  data: ComponentDocItem;
  metadata: DocgenComponentDoc & { id: string };
  title: string;
  description: string;
  slug: string;
  id: string;
  hideFromSidebar?: boolean;
}

export interface ReactShowroomMarkdownFrontmatter {
  title?: string;
  order?: number;
  hideSidebar?: boolean;
  hideHeader?: boolean;
  description?: string;
}

export interface ReactShowroomMarkdownHeading {
  text: string;
  id?: string;
  rank: number;
}

export interface ReactShowroomMarkdownContent {
  Component: ComponentType<any>;
  headings: Array<ReactShowroomMarkdownHeading>;
  imports: Record<string, any>;
  codeblocks: CodeBlocks;
  loadDts: () => Promise<{ default: Record<string, string> }>;
}

export interface ReactShowroomMarkdownSection {
  type: 'markdown';
  fallbackTitle: string;
  slug: string;
  frontmatter: ReactShowroomMarkdownFrontmatter;
  load: () => Promise<ReactShowroomMarkdownContent>;
  formatLabel: (oriTitle: string) => string;
  hideFromSidebar?: boolean;
  /**
   * @internal
   *
   * Used by docs site
   */
  _associatedComponentName?: string;
}

interface ReactShowroomLinkSection {
  type: 'link';
  href: string;
  title: string;
}

export interface ReactShowroomGroupSection {
  type: 'group';
  title: string;
  slug: string;
  items: Array<ReactShowroomSection>;
  hideFromSidebar?: boolean;
}

export type ReactShowroomSection =
  | ReactShowroomComponentSection
  | ReactShowroomMarkdownSection
  | ReactShowroomLinkSection
  | ReactShowroomGroupSection;
