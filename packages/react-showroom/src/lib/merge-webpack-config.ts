import { Environment } from '@showroomjs/core';
import isFunction from 'lodash/isFunction';
import omit from 'lodash/omit';
import { Configuration } from 'webpack';
import { mergeWithCustomize, unique } from 'webpack-merge';

const IGNORE_SECTIONS = ['entry', 'externals', 'output', 'watch', 'stats'];
const IGNORE_SECTIONS_ENV: Record<Environment, string[]> = {
  development: [],
  // For production builds, we'll ignore devtool settings to avoid
  // source mapping bloat.
  production: ['devtool'],
};

const IGNORE_PLUGINS = [
  'CommonsChunkPlugins',
  'MiniHtmlWebpackPlugin',
  'HtmlWebpackPlugin',
  'OccurrenceOrderPlugin',
  'DedupePlugin',
  'UglifyJsPlugin',
  'TerserPlugin',
  'HotModuleReplacementPlugin',
];

const merge = mergeWithCustomize({
  // Ignore user’s plugins to avoid duplicates and issues with our plugins
  customizeArray: unique(
    'plugins',
    IGNORE_PLUGINS,
    (plugin: any) => plugin.constructor && plugin.constructor.name
  ),
});

type MetaConfig = Configuration | ((env: Environment) => Configuration);

/**
 * Merge two Webpack configs.
 *
 * In the user config:
 * - Ignores given sections (options.ignore).
 * - Ignores plugins that shouldn’t be used twice or may cause issues.
 */
export function mergeWebpackConfig(
  baseConfig: Configuration,
  userConfig?: MetaConfig,
  env: Environment = 'production'
) {
  const userConfigObject = isFunction(userConfig)
    ? userConfig(env)
    : userConfig;
  const safeUserConfig = omit(
    userConfigObject,
    IGNORE_SECTIONS.concat(IGNORE_SECTIONS_ENV[env])
  );
  return merge(baseConfig, safeUserConfig);
}
