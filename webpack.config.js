'use strict'
console.info('dirname in webpack: ', __dirname)

const
  path = require('path'),
  // fs = require('fs-extra'),
  webpack = require('webpack')

const
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin'),
  { VueLoaderPlugin } = require('vue-loader'),
  plugins = [
    new HtmlWebpackPlugin({
      title: 'My Anime Assistant',
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

module.exports = [
  {
    name: 'renderer',
    mode: 'development',
    stats: {
      children: false,
      modules: false,
      // assets: false,
      entrypoints: false,
      // chunks: false,
      // depth: false,
    },
    // target: 'node',
    // target: 'electron-main',
    target: 'electron-renderer',
    node: {
      fs: true,
      // ws: 'empty',
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
      extensions: ['.ts', '.js', '.vue', '.json'],
      alias: {
        'vue$': 'vue/dist/vue.esm.js',
        'main': path.resolve(__dirname, 'src/main'),
        'common': path.resolve(__dirname, 'src/common'),
        'renderer': path.resolve(__dirname, 'src/renderer'),
      }
    },
    module: {
      rules: [
        {
          test: /\.ts$/,
          loader: 'ts-loader',
        },
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
  },
  {
    name: 'main',
    mode: 'development',
    target: 'electron-main',
    stats: {
      modules: false,
      entrypoints: false,
    },
    node: {
      // ws: true,
      // fs: true,
      __dirname: true,
      __filename: true,
    },
    entry: {
      index: './src/main/index.js',
    },
    output: {
      path: path.resolve(__dirname, 'build/main'),
      // path: path.resolve(__dirname, './src/common/mal-scraper/build'),
      filename: '[name].js'
    },
    resolve: {
      extensions: ['.ts', '.js', '.json', '.html', '.css', '.gif', '.png', '.jpg'],
      alias: {
        // 'vue$': 'vue/dist/vue.esm.js',
        'main': path.resolve(__dirname, 'src/main'),
        'common': path.resolve(__dirname, 'src/common'),
        'renderer': path.resolve(__dirname, 'src/renderer'),
        'build': path.resolve(__dirname, 'build'),
        'resources': path.resolve(__dirname, 'resources'),
      }
    },
    externals: ['ws', 'fsevents', 'puppeteer', 'vue'],
    module: {
      // noParse: /ws|puppeteer|fsevents/,
      noParse: /nativeRequireBypassWebpack\.js/,
      rules: [
        { test: /\.ts$/, loader: 'ts-loader' },
        { test: /\.html$/, loader: 'html-loader' },
        { test: /\.css$/, loader: 'css-loader' },
        { test: /\.gif|\.png|\.jpg$/, loader: 'file-loader' },
      ]
    },
    plugins: [
      new webpack.IgnorePlugin(/chrome\-head/),
    ],
  }
]
