const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require("extract-text-webpack-plugin");

const DIST_DIR = path.resolve(__dirname, "dist");
const SRC_DIR = path.resolve(__dirname, "src");

module.exports = {
  entry: SRC_DIR + "/main.js",

  output: {
    path: DIST_DIR,
    filename: "bundle.js",
    sourceMapFilename: "bundle.map",
    //publicPath: "/dist/"
  },
  module: {
    rules: [
      {
        test: /\.js$/, //regex what files
        include: SRC_DIR, //what directory
        exclude: /node-modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["react", "es2015", "stage-2"],
            plugins: ['react-html-attrs', 'transform-decorators-legacy', 'transform-class-properties']
          }
        }
      },
      {
        test: /\.scss$/,
        include: SRC_DIR,
        //loaders: ["style-loader", "css-loader"] //NOTE: loaderS ... S at the end
        use: ExtractTextPlugin.extract({
          use: [{
            loader: "css-loader",
            options: {
              modules: true,
              localIdentName: "[name]__[local]--[hash:base64:5]"
            }
          }, {
            loader: "sass-loader"
          }],
          fallback: "style-loader"
        })
      },
      {
        test: /\.(png|jpg|gif)$/,
        use: [
          {
            loader: "url-loader",
            options: {
              limit: 8192
            }
          }
        ]
      }
    ]
  },
  plugins:
    [
      new ExtractTextPlugin({filename: "styles.css"}),
      new webpack.optimize.UglifyJsPlugin({ mangle: false, sourcemap: false }),
    ],
  //where has webpack looking for modules
  resolve: {
    modules: [
      "node_modules",
      path.resolve(__dirname, "src"),
      path.resolve(__dirname, "src/public"),
    ]
  }
};
