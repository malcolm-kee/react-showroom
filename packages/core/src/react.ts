import type { PrismTheme } from 'prism-react-renderer';
import type { ComponentType } from 'react';
import type { ComponentDoc as DocgenComponentDoc } from 'react-docgen-typescript';
import type { Configuration } from 'webpack';
import { Environment } from './index';

export interface ComponentDocItem {
  component: DocgenComponentDoc & { slug: string };
  doc: null | ComponentType<any>;
}

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
   * a glob pattern string
   */
  components: string;
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

export interface ReactShowroomConfiguration {
  /**
   * a glob pattern string to search for all your components.
   *
   * If you want to organize your components in a nested structure, use `items`.
   */
  components?: string;
  items?: Array<ItemConfiguration>;
  /**
   * Webpack configuration to load your components (or any other resources that are needed by the components, e.g. CSS)
   */
  webpackConfig?: Configuration | ((env: Environment) => Configuration);
  /**
   * modules to be available in examples via `import`.
   *
   * - If it's a local module in the project, pass 'name' (how it is imported) and 'path' (relative path from project root).
   * - If it's a third-party library, pass the package name.
   */
  imports?: Array<
    | {
        name: string;
        path: string;
      }
    | string
  >;
  /**
   * Title to be displayed for the site.
   *
   * @default 'React Showroom'
   */
  title?: string;
  /**
   * One of the themes provided by `'prism-react-renderer'`.
   */
  codeTheme?: PrismTheme;
  /**
   * Your application static assets folder will be accessible as / in the style guide dev server.
   *
   * @example ['public']
   */
  assetDirs?: Array<string>;
  /**
   * path to a module/file that export default a React component that should wrap the entire showroom.
   *
   * Use this to render context providers that your application need, e.g. Redux Provider.
   */
  wrapper?: string;
  /**
   * whether to include CSS reset
   *
   * @default true
   */
  resetCss?: boolean;
  devServer?: {
    port?: number;
  };
  build?: {
    /**
     * output of the generated site.
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
     * Note that this only takes effect if `prerender` is set to `true`.
     *
     * @example '/docs'
     *
     * @default '/''
     */
    basePath?: string;
  };
}

export interface ReactShowroomComponentSectionConfig {
  type: 'component';
  sourcePath: string;
  docPath: string | null;
  parentSlugs: Array<string>;
}

interface ReactShowroomMarkdownSectionConfig {
  type: 'markdown';
  sourcePath: string;
  slug: string;
  title?: string;
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
    'items' | 'devServer' | 'build' | 'components'
  > {
  title: string;
  sections: Array<ReactShowroomSectionConfig>;
  components: Array<ReactShowroomComponentSectionConfig>;
  outDir: string;
  prerender: boolean;
  basePath: string;
  codeTheme: PrismTheme;
  /**
   * assetDirs in absolute paths
   */
  assetDirs: Array<string>;
  resetCss: boolean;
  devServerPort: number;
}

export interface ReactShowroomComponentSection {
  type: 'component';
  data: ComponentDocItem;
  slug: string;
}

export interface ReactShowroomMarkdownSection {
  type: 'markdown';
  Component: ComponentType<any>;
  title: string;
  slug: string;
  frontmatter: {
    title?: string;
    order?: number;
    hideSidebar?: boolean;
    hideHeader?: boolean;
    description?: string;
  };
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
