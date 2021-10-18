import type { PrismTheme } from 'prism-react-renderer';
import type { ComponentType } from 'react';
import type {
  ComponentDoc as DocgenComponentDoc,
  ParserOptions,
} from 'react-docgen-typescript';
import type { Configuration } from 'webpack';
import { CodeBlocks, Environment } from './index';

export interface ItemConfigurationWithPath {
  title?: string;
  /**
   * path for the section. Will be inferred from title if not provided
   */
  path?: string;
}

export interface ComponentSectionConfiguration
  extends ItemConfigurationWithPath {
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

export interface ContentItemConfiguration extends ItemConfigurationWithPath {
  type: 'content';
  /**
   * location of a Markdown file containing the overview content.
   */
  content: string;
}

export interface LinkItemConfiguration {
  type: 'link';
  title: string;
  /**
   * URL for the link
   */
  href: string;
}

export interface DocSectionConfiguration extends ItemConfigurationWithPath {
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

export interface GroupSectionConfiguration extends ItemConfigurationWithPath {
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
  items?: Array<ItemConfiguration>;
  /**
   * Webpack configuration to load your components (or any other resources that are needed by the components, e.g. CSS)
   */
  webpackConfig?: Configuration | ((env: Environment) => Configuration);
  /**
   * modules to be available in examples via `import`.
   *
   * Pass 'name' (how it is imported) and 'path' (relative path from project root).
   */
  imports?: Array<ImportConfig>;
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
  docgen?: Partial<DocgenConfiguration>;
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
    /**
     * Set a prefix for the static site.
     *
     * @example '/docs'
     *
     * @default ''
     */
    basePath?: string;
    /**
     * Preload all CSS to avoid possible screen flashing.
     *
     * @default true
     */
    preloadAllCss?: boolean;
    /**
     * Prefetch all resources using `<link rel="prefetch">` resource hints.
     *
     * @default true
     */
    prefetchAll?: boolean;
  };
  debug?: boolean;
}

export interface ReactShowroomComponentSectionConfig {
  type: 'component';
  sourcePath: string;
  docPath: string | null;
  parentSlugs: Array<string>;
  id: string;
}

interface ReactShowroomMarkdownSectionConfig {
  type: 'markdown';
  sourcePath: string;
  slug: string;
  title?: string;
  formatLabel: (oriTitle: string) => string;
}

interface ReactShowroomLinkSectionConfig {
  type: 'link';
  href: string;
  title: string;
}

interface ReactShowroomGroupSectionConfig {
  type: 'group';
  title: string;
  slug: string;
  items: Array<ReactShowroomSectionConfig>;
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
    'items' | 'devServer' | 'build' | 'components' | 'css'
  > {
  sections: Array<ReactShowroomSectionConfig>;
  ignores: Array<string>;
  outDir: string;
  prerender: boolean;
  basePath: string;
  preloadAllCss: boolean;
  prefetchAll: boolean;
  /**
   * assetDirs in absolute paths
   */
  devServerPort: number;
  docgen: DocgenConfiguration;
  theme: ThemeConfiguration;
  url: string;
  css: {
    enabled: boolean;
    usePostcss: boolean;
  };
}

export interface ReactShowroomComponentContent {
  metadata: DocgenComponentDoc & {
    Component: ComponentType<any> | undefined;
  };
  doc: null | ComponentType<any>;
  imports: Record<string, any>;
  codeblocks: CodeBlocks;
}

export interface ComponentDocItem {
  load: () => Promise<ReactShowroomComponentContent>;
  preloadUrl: string;
}

export interface ReactShowroomComponentSection {
  type: 'component';
  data: ComponentDocItem;
  title: string;
  description: string;
  slug: string;
  id: string;
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
}

export interface ReactShowroomMarkdownSection {
  type: 'markdown';
  fallbackTitle: string;
  slug: string;
  frontmatter: ReactShowroomMarkdownFrontmatter;
  preloadUrl: string;
  load: () => Promise<ReactShowroomMarkdownContent>;
  formatLabel: (oriTitle: string) => string;
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
}

export type ReactShowroomSection =
  | ReactShowroomComponentSection
  | ReactShowroomMarkdownSection
  | ReactShowroomLinkSection
  | ReactShowroomGroupSection;
