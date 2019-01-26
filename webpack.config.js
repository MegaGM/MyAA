'use strict'

const
  path = require('path'),
  fs = require('fs-extra'),
  webpack = require('webpack')

let plugins = [
  new webpack.SourceMapDevToolPlugin({
    filename: '[file].map'
  }),
]

const env = process.env.NODE_ENV
console.info('WEBPACK_ENV: ', env)

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
    ]
  },
  plugins,
}]
