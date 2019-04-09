const path = require( "path" );
var HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
    mode: "development",
    output: {
      path: path.resolve( __dirname, "./dist" ),
      filename: "index.js",
    },
    module: {
      rules: [
        {
          test: /\.m?js$/,
          exclude: /(node_modules|bower_components)/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            }
          }
        }
      ]
    },
    watch: true,
    entry: "./src/Faze.js",
    devServer: {
      contentBase: path.join( __dirname, "./dist" ),
      compress: true,
      port: 9000,
    },
    plugins: [ new HtmlWebpackPlugin() ]
};