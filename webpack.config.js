'use strict';
var path = require("path");
var webpack = require("webpack");

module.exports = { 
  entry: [
      './src/main.jsx'
  ],
  output: {
    path: path.join(__dirname, "build"),
    //publicPath: path.join(__dirname, "build/"),
    publicPath: "http://localhost:8081/build/",
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      { test: /\.jsx$/, loader: 'jsx-loader?harmony' },
      { test: /\.less$/, loader: 'style-loader!css-loader!less-loader' }, // use ! to chain loaders
      { test: /\.css$/, loader: 'style-loader!css-loader' },
      //{ test: /\.(png|jpg)$/, loader: 'url-loader?limit=104192' }, // inline base64 URLs for <=8k images, direct URLs for the rest
      { test: /\.woff$/,   loader: "url-loader?prefix=font/&limit=5000&mimetype=application/font-woff" },
      { test: /\.png$/, loader: "url-loader?mimetype=image/png" },
      { test: /\.jpg$/, loader: "url-loader?mimetype=image/jpg" },
      { test: /\.gif$/, loader: "url-loader?mimetype=image/gif" },
      { test: /\.ttf$/,    loader: "file-loader" },
      { test: /\.eot$/,    loader: "file-loader" },
      { test: /\.svg$/,    loader: "file-loader" }
    ]
  },
  resolve: {
        alias: {
            moment: 'moment/moment.js'
        },
        root: [path.join(__dirname, "bower_components")],
        extensions: ['', '.js', '.jsx', '.json']
    },
    plugins: [
        new webpack.ContextReplacementPlugin(/moment[\\\/]locale$/, /^\.\/(zh-cn|zh-tw)$/),
        new webpack.ResolverPlugin(
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        )
    ]
}; 