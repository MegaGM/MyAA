'use strict'

const
  path = require('path'),
  webpack = require('webpack')

const
  HtmlWebpackPlugin = require('html-webpack-plugin'),
  MiniCssExtractPlugin = require('mini-css-extract-plugin'),
  { VueLoaderPlugin } = require('vue-loader'),
  rendererPlugins = [
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
    name: 'electron-renderer',
    mode: 'development',
    devtool: 'inline-source-map',
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
      'electron-renderer': './src/renderer/electron-renderer.js',
    },
    output: {
      path: path.resolve(__dirname, 'build/electron-renderer'),
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
    plugins: rendererPlugins,
  },
  // {
  //   name: 'electron-main',
  //   mode: 'development',
  //   target: 'electron-main',
  //   stats: {
  //     modules: false,
  //     entrypoints: false,
  //   },
  //   node: {
  //     // ws: true,
  //     // fs: true,
  //     __dirname: true,
  //     __filename: true,
  //   },
  //   entry: {
  //     'electron-main': './src/main/electron-main.js',
  //   },
  //   output: {
  //     path: path.resolve(__dirname, 'build/main'),
  //     // path: path.resolve(__dirname, './src/common/mal-scraper/build'),
  //     filename: '[name].js'
  //   },
  //   resolve: {
  //     extensions: ['.ts', '.js', '.json', '.html', '.css', '.gif', '.png', '.jpg'],
  //     alias: {
  //       // 'vue$': 'vue/dist/vue.esm.js',
  //       'main': path.resolve(__dirname, 'src/main'),
  //       'common': path.resolve(__dirname, 'src/common'),
  //       'renderer': path.resolve(__dirname, 'src/renderer'),
  //       'build': path.resolve(__dirname, 'build'),
  //       'resources': path.resolve(__dirname, 'resources'),
  //     }
  //   },
  //   externals: ['ws', 'fsevents', 'puppeteer', 'vue'],
  //   module: {
  //     // noParse: /ws|puppeteer|fsevents/,
  //     noParse: /nativeRequireBypassWebpack\.js/,
  //     rules: [
  //       { test: /\.ts$/, loader: 'ts-loader' },
  //       { test: /\.html$/, loader: 'html-loader' },
  //       { test: /\.css$/, loader: 'css-loader' },
  //       { test: /\.gif|\.png|\.jpg$/, loader: 'file-loader' },
  //     ]
  //   },
  //   plugins: [
  //     new webpack.IgnorePlugin(/chrome\-head/),
  //   ],
  // },
  {
    name: 'web-renderer',
    mode: 'development',
    devtool: 'inline-source-map',
    stats: {
      children: false,
      modules: false,
      entrypoints: false,
    },
    target: 'web',
    node: {
      // fs: true,
      __dirname: true,
      __filename: true,
    },
    entry: {
      'web-renderer': './src/renderer/web-renderer.js',
    },
    output: {
      path: path.resolve(__dirname, 'build/web-renderer'),
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
    plugins: rendererPlugins,
  },
  // {
  //   name: 'node-main',
  //   mode: 'development',
  //   target: 'async-node',
  //   devtool: 'inline-source-map',
  //   stats: {
  //     modules: false,
  //     entrypoints: false,
  //   },
  //   node: {
  //     __dirname: true,
  //     __filename: true,
  //     // fs: true,
  //     // ws: true,
  //   },
  //   entry: {
  //     'node-main': './src/main/node-main.js',
  //   },
  //   output: {
  //     path: path.resolve(__dirname, 'build/main'),
  //     filename: '[name].js'
  //   },
  //   resolve: {
  //     extensions: ['.ts', '.js', '.json', '.html', '.css', '.gif', '.png', '.jpg'],
  //     alias: {
  //       // 'vue$': 'vue/dist/vue.esm.js',
  //       'main': path.resolve(__dirname, 'src/main'),
  //       'common': path.resolve(__dirname, 'src/common'),
  //       'renderer': path.resolve(__dirname, 'src/renderer'),
  //       'build': path.resolve(__dirname, 'build'),
  //       'resources': path.resolve(__dirname, 'resources'),
  //     }
  //   },
  //   externals: ['ws', 'fsevents', 'puppeteer', 'vue'],
  //   module: {
  //     noParse: /nativeRequireBypassWebpack\.js/,
  //     rules: [
  //       { test: /\.ts$/, loader: 'ts-loader' },
  //       { test: /\.html$/, loader: 'html-loader' },
  //       { test: /\.css$/, loader: 'css-loader' },
  //       { test: /\.gif|\.png|\.jpg$/, loader: 'file-loader' },
  //     ]
  //   },
  // },
  {
    name: 'mal-api',
    mode: 'development',
    target: 'async-node',
    devtool: 'inline-source-map',
    stats: {
      modules: false,
      entrypoints: false,
    },
    entry: {
      'MAL.api': './src/main/mal-api/MAL.api.ts',
    },
    output: {
      library: 'MyAA',
      libraryTarget: 'commonjs2',
      path: path.resolve(__dirname, './src/main/mal-api/build'),
      filename: '[name].js'
    },
    resolve: {
      extensions: ['.ts', '.js', '.json'],
    },
    module: {
      noParse: /nativeRequireBypassWebpack\.js/,
      rules: [{ test: /\.ts$/, loader: 'ts-loader' }]
    },
  },
]
