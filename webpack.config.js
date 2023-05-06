const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack')


module.exports = {
  mode: "development",// 模式--开发模式
  watch: true,
  entry: {// 入口设置
    index: path.resolve(__dirname, "./src/index.ts")
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
    alias: {
      v3: path.resolve(__dirname, 'src/v3/'),
      types: path.resolve(__dirname, 'src/types/'),
    },
  },
  devtool: 'inline-source-map',// 追踪错误到代码的指定位置
  devServer: {
    static: path.resolve(__dirname, "dist"),// 配置启动的js文件位置
    client: {
      logging: "error",
      overlay: {
        errors: true,
        warnings: false
      }
    },

  },
  stats: {
    assets: false,
    builtAt: false,
    modules: false,
    errorDetails: true
  },
  plugins: [// 插件的配置
    new HtmlWebpackPlugin({
      title: 'Development',
      template:  path.resolve(__dirname, "./public/index.html"), // 模板文件
      filename: 'index.html',
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true
      },
      hash: true
    }),
    new webpack.DefinePlugin({
      __DEV__:  JSON.stringify(true)
    })
  ],
  output: {// 出口的配置
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true
  },
  optimization: {
    runtimeChunk: "single"
  }
}
