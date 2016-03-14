'use strict';

var gulp = require("gulp");
var gutil = require("gulp-util");
var webpack = require("webpack");
var argv = require('yargs').argv;
var WebpackDevServer = require("webpack-dev-server");
var webpackConfig = require("./webpack.config.js");
var myDevConfig = Object.create(webpackConfig);
// create a single instance of the compiler to allow caching
var devCompiler = webpack(myDevConfig);
var proxy = require('express-http-proxy');
var fs = require('fs');
var path = require('path');

if(!argv.prod){
    myDevConfig.devtool = "sourcemap";
    myDevConfig.debug = true;
}

// The development server (the recommended option for development)
gulp.task("default", ["webpack-dev-server"]);

gulp.task("build-dev", ["webpack:build-dev"], function() {
    gulp.watch(["src/**/*"], ["webpack:build-dev"]);
});

// Production build
gulp.task("build", ["webpack:build"]);
gulp.task("webpack:build", function(callback) {
    // modify some webpack config options
    var myConfig = Object.create(webpackConfig);
    console.log(webpackConfig.plugins);
    myConfig.plugins = myConfig.plugins.concat(
        new webpack.DefinePlugin({
            "process.env": {
                // This has effect on the react lib size
                "NODE_ENV": JSON.stringify("production")
            }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin()
    );

    // run webpack
    webpack(myConfig, function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:build", err);
        gutil.log("[webpack:build]", stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task("webpack:build-dev", function(callback) {
    // run webpack
    devCompiler.run(function(err, stats) {
        if(err) throw new gutil.PluginError("webpack:build-dev", err);
        gutil.log("[webpack:build-dev]", stats.toString({
            colors: true
        }));
        callback();
    });
});

gulp.task("webpack-dev-server", function() {
    // modify some webpack config options
    var myConfig = Object.create(webpackConfig);
    myConfig.devtool = "eval";
    myConfig.debug = true;

    // Start a webpack-dev-server
    var server = new WebpackDevServer(webpack(myConfig), {
        contentBase: __dirname,
        hot: true,
        quiet: false,
        noInfo: false,
        publicPath: "/build/",
        stats: { colors: true }
    });
    
    server.use('/api', proxy('http://ec2-52-27-255-166.us-west-2.compute.amazonaws.com:9000', {
      forwardPath: function(req, res) {
        return require('url').parse(req.url).path;
      }
    }));

    server.use(function(req, res, next) {
        if (req.headers && req.headers['x-requested-with'] === 'XMLHttpRequest') {
          return next();
        }
        res.statusCode = 200;
        res.write(fs.readFileSync(path.resolve(__dirname, 'index.html'), 'utf8'));
        res.end();
    });
    
    server.listen(8090, "localhost", function(err) {
        if(err) throw new gutil.PluginError("webpack-dev-server", err);
        gutil.log("[webpack-dev-server]", "http://localhost:8050/webpack-dev-server/index.html");
    }); 
});