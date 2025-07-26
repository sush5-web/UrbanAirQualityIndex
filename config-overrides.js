// config-overrides.js
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');

module.exports = function override(config, env) {
  config.resolve.alias = {
    ...config.resolve.alias,
    cesium: path.resolve(__dirname, 'node_modules/cesium/Source'),
  };

  config.module.rules.push({
    test: /\.css$/,
    include: path.resolve(__dirname, 'node_modules/cesium'),
    use: ['style-loader', 'css-loader'],
  });

  config.plugins = [
    ...config.plugins,
    new CopyWebpackPlugin({
      patterns: [
        {
          from: path.join('node_modules/cesium/Source', 'Assets'),
          to: 'Assets',
        },
        {
          from: path.join('node_modules/cesium/Source', 'Widgets'),
          to: 'Widgets',
        },
        {
          from: path.join('node_modules/cesium/Source', 'ThirdParty'),
          to: 'ThirdParty',
        },
        {
          from: path.join('node_modules/cesium/Source', 'Workers'),
          to: 'Workers',
        },
      ],
    }),
    new webpack.DefinePlugin({
      CESIUM_BASE_URL: JSON.stringify(''),
    }),
  ];

  return config;
};
