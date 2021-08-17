import { LoaderOptionsPlugin, Configuration, EnvironmentPlugin } from 'webpack';
import CompressionPlugin from 'compression-webpack-plugin';
import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import * as path from 'path';
import baseConfig from './webpack.base';

const prod: Configuration = {
  mode: 'production',
  plugins: [
    new Dotenv({ path: 'frontend.env' }),
    new HtmlWebpackPlugin({
      title: 'Chat',
      filename: 'index.html',
      template: path.join(__dirname, '../app.ejs'),
      minify: false,
      hash: true,
      inject: 'body',
    }),
    new LoaderOptionsPlugin({
      debug: false,
    }),
    // new CompressionPlugin({
    //   test: /\.js$/,
    //   filename: '[path].gz[query]',
    //   // Build failed: required python
    //   // algorithm: (source, compressionOptions, callback) => {
    //   //   return zopfli.gzip(Buffer.from(source), compressionOptions, callback);
    //   // }
    // }),
  ],
};

export default merge(baseConfig, prod);
