/**
 * @description 公共资源配置
 * @date 2020-01-08
 * @author mayijun
 */
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const { resolve } = require('./utils')

const libs = {
  _frame: ['vue', 'vue-router', 'vuex','axios','element-ui','babel-polyfill','echarts']
}

module.exports = {
  mode: 'production',
  entry: { ...libs },
  performance: false,
  output: {
    path: resolve('dll'),
    filename: '[name].dll.js',
    library: '[name]' // 与 DllPlugin.name 保持一致
  },
  plugins: [
    new CleanWebpackPlugin(),
    new webpack.DllPlugin({
      name: '[name]',
      path: resolve('dll', '[name].manifest.json'),
      context: __dirname,
    })
  ]
}
