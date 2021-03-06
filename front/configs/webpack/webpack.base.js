const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HappyPack = require('happypack');

module.exports = {
  entry: [
    './src/index',
  ],
  output: {
    filename: 'bundle.min.js',
    path: path.resolve(__dirname, '../../public'),
    publicPath: '/',
  },
  resolve: {
    mainFields: ['browser', 'main', 'module'],
    extensions: ['.ts', '.tsx', '.js'],
    alias: {
      src: path.resolve(__dirname, '../../src/'),
      '@gql': path.resolve(__dirname, '../../src/graphql'),
      '@comp': path.resolve(__dirname, '../../src/components'),
      '@utils': path.resolve(__dirname, '../../src/utils'),
      'typings': path.resolve(__dirname, '../../typings'),
      '@const': path.resolve(__dirname, '../../src/consts/index.ts'),
      '@hoc': path.resolve(__dirname, '../../src/components/hoc/index.ts'),
    },
  },
  module: {
    rules: [
      {
        test: /\.(tsx|ts)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "babel-loader",
            options: {
              cacheDirectory: true,
              babelrc: false,
              presets: [
                [
                  "@babel/preset-env",
                  { targets: { browsers: "last 2 versions" } }
                ],
                "@babel/preset-typescript",
                "@babel/preset-react"
              ],
              plugins: [
                ["@babel/plugin-proposal-decorators", { legacy: true }],
                ["@babel/plugin-proposal-class-properties", { loose: true }],
                "graphql-tag",
                "import-graphql",
                "react-hot-loader/babel"
              ]
            }
          },
          {
            loader: 'ts-loader',
            options: {
              transpileOnly: true,
              happyPackMode: true
            }
          },
        ],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'source-map-loader',
        enforce: 'pre',
      },
      {
        test: /\.(graphql|gql)$/,
        exclude: /node_modules/,
        loader: 'graphql-tag/loader',
      },
      {
        test: /\.(yml|yaml)$/,
        exclude: /node_modules/,
        use: [
          {
            loader: "json-loader",
          },
          {
            loader: 'yaml-loader',
          },
        ],
      },
    ]
  },
  plugins: [
    new HappyPack({
      loaders: ['babel-loader', 'ts-loader', 'source-map-loader', 'graphql-tag/loader'],
    }),
    new webpack.NoEmitOnErrorsPlugin(),
    new HtmlWebpackPlugin({
      title: 'Chat',
      filename: 'index.html',
      template: path.join(__dirname, '../app.ejs'),
      minify: false,
      hash: true,
      inject: 'body',
    }),
    new webpack.LoaderOptionsPlugin({
      debug: false,
    }),
  ],
  bail: true,
};

