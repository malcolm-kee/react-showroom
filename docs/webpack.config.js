const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

/**
 * @return {import('webpack').Configuration}
 */
const config = (env) => {
  const isProd = env === 'production';

  return {
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          resourceQuery: {
            not: [/showroomRaw/],
          },
          use: {
            loader: require.resolve('esbuild-loader'),
            options: {
              loader: 'tsx',
              target: 'es2015',
            },
          },
        },
        {
          test: /\.css$/,
          use: [
            isProd
              ? {
                  loader: MiniCssExtractPlugin.loader,
                }
              : {
                  loader: require.resolve('style-loader'),
                },
            {
              loader: require.resolve('css-loader'),
              options: {
                importLoaders: 1,
                modules: {
                  auto: true,
                  localIdentName: isProd
                    ? '[hash:base64]'
                    : '[path][name]__[local]',
                },
              },
            },
            {
              loader: require.resolve('postcss-loader'),
              options: {
                postcssOptions: {
                  config: path.resolve(__dirname, 'postcss.config.js'),
                },
              },
            },
          ],
        },
        {
          test: /\.png$/,
          type: 'asset',
        },
      ],
    },
    plugins: [
      new MiniCssExtractPlugin({
        filename: 'static/css/[name].[contenthash].css',
        chunkFilename: 'static/css/[name].[contenthash].css',
      }),
    ],
    optimization: {
      minimize: isProd,
      minimizer: ['...', new CssMinimizerPlugin()],
    },
  };
};

module.exports = config;
