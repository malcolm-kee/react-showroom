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
