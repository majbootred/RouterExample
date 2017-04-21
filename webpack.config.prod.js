var path = require("path");
var webPack = require("webpack");
var htmlWebPackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: {
    main: './src/index',
    vendor: ['react', 'react-dom', 'office-ui-fabric-react']
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "[name].[hash].bundle.js",
    publicPath: '/Style Library/react-fabric-sharepoint/'
  },
  plugins: [
    new webPack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webPack.optimize.CommonsChunkPlugin({
      names: ['vendor', 'inline'],
      minChunks: Infinity
    }),
    new webPack.optimize.UglifyJsPlugin({
      mangle: { screw_ie8: true },
      compress: { screw_ie8: true, warnings: false },
    }),
    new htmlWebPackPlugin({
      filename: 'index-prod.html',
      template: './src/Templates/index-prod.html'
    })
  ],
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