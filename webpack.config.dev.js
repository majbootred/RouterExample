var path = require("path");
var webPack = require("webpack");
var htmlWebPackPlugin = require("html-webpack-plugin");
var fs = require("fs");
var buildConfig = require("./build.config");

module.exports = {
  entry: {
    main: './src/index',
    vendor: ['react', 'react-dom', 'office-ui-fabric-react']
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: '[name].bundle.js',
    publicPath: buildConfig.dev.publicPath
  },
  devServer: {
    inline: true,
    hot: true,
    contentBase: path.join(__dirname, 'dist')
  },
  devtool: 'source-map',
  plugins: fs.readdirSync('./src/Templates').map(function (filename) {
    return new htmlWebPackPlugin({
      template: './src/Templates/' + filename,
      filename: filename
    });
  }).concat(
    new webPack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'inline'],
      minChunks: Infinity
    })
    ),
  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader",
        query: {
          presets: [
            'env',
            'react'
          ],
          plugins: [
            'transform-object-rest-spread',
            'transform-class-properties',
            'transform-object-assign',
            'transform-proto-to-assign'
          ]
        }
      },
      {
        test: /\.(scss|css)$/,
        loaders: ['style-loader', 'css-loader', 'sass-loader']
      }
    ]
  },
};