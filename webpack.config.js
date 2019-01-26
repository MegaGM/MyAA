'use strict'

const
  path = require('path'),
  fs = require('fs-extra'),
  webpack = require('webpack')

const
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin'),
  { VueLoaderPlugin } = require('vue-loader'),
  plugins = [
    new HtmlWebpackPlugin({
      title: 'Horrible Nyaa MAL',
      template: './src/renderer/index.html',
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: '[file].map',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css',
      chunkFilename: '[id].css',
    }),
    new VueLoaderPlugin(),
  ]

module.exports = [{
  name: 'renderer',
  mode: 'development',
  // stats: {
  //   children: false,
  // },
  // target: 'node',
  // target: 'electron-main',
  target: 'electron-renderer',
  node: {
    fs: true,
    __dirname: true,
    __filename: true,
  },
  entry: {
    index: './src/renderer/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'build/renderer'),
    filename: '[name].js'
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js',
    }
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.css$/,
        use: [
          {
            loader: MiniCssExtractPlugin.loader,
            options: {
              publicPath: '../'
            }
          },
          'css-loader'
        ]
      }
    ]
  },
  plugins,
}]
