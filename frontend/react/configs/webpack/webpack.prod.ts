import { LoaderOptionsPlugin, Configuration, EnvironmentPlugin } from 'webpack';
import CompressionPlugin from 'compression-webpack-plugin';
import merge from 'webpack-merge';
import HtmlWebpackPlugin from 'html-webpack-plugin';
import * as path from 'path';
import baseConfig from './webpack.base';

const prod: Configuration = {
  mode: 'production',
  plugins: [
    new EnvironmentPlugin([
      'AWS_REGION',
      'API_URL',
      'API_SERVER_URL',
      'IDENTITY_POOL_ID',
      'USER_POOL_ID',
      'USER_POOL_WEB_CLIENT_ID',
      'AUTH_DOMAIN',
      'AUTH_SIGN_IN_URL',
      'AUTH_SIGN_OUT_URL',
    ]),
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
