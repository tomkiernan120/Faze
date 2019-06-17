const path = require( 'path' );
const webpack = require( 'webpack' );
const PACKAGE = require( './package.json' );
const HtmlWebpackPlugin = require('html-webpack-plugin')
var StringReplacePlugin = require("string-replace-webpack-plugin");
// const ClosurePlugin = require('closure-webpack-plugin');

module.exports = {
  mode: 'production',
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
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env'],
            plugins: ['@babel/plugin-proposal-object-rest-spread']
          }
        }
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'eslint-loader',
        options: {}
      },
      {
        test: /\.js$/,
        loader: StringReplacePlugin.replace({
          replacements: [
            {
              pattern: /(\[VERSION\])/,
              replacement: function( match, p1, offset, string ) {
                return PACKAGE.version;
              }
            }
          ]
        })
      }
    ]
  },
  plugins: [
    new webpack.BannerPlugin({
      banner: 'hash:[hash], chunkhash:[chunkhash], name:[name], filebase:[filebase], query:[query], file:[file]'
    }),
    new StringReplacePlugin()
  ]
}