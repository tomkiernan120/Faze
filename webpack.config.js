const path = require( 'path' );
const webpack = require( 'webpack' );
const PACKAGE = require( './package.json' );
const HtmlWebpackPlugin = require('html-webpack-plugin')
// const ClosurePlugin = require('closure-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: './src/faze.js',
  watch: true,
  output: {
    filename: "faze.min.js",
    path: path.resolve( __dirname, 'dist' ),
    publicPath: '/'
  },
  devServer: {
    compress: true,
    port: 8080,
    open: true,
    contentBase: './dist/'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {}
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: 'hash:[hash], chunkhash:[chunkhash], name:[name], filebase:[filebase], query:[query], file:[file]'
    }),
  ]
}