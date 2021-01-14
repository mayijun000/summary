/**
 * @description 生产环境配置
 * @date 2020-01-08
 * @author mayijun
 */
const webpack = require('webpack')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const TerserJSPlugin = require("terser-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const CompressionPlugin = require("compression-webpack-plugin")
const productionGzipExtensions = /\.(js|css|mp4|wasm)(\?.*)?$/i;

const config = require('./config')
const { resolve } = require('./utils')

const webpackConfig = {
    mode: 'production',
    devtool: config.production.sourceMap ?
        'eval-source-map' : 'none',
    output: {
        filename: 'static/js/[name].[contentHash:5].js',
        chunkFilename: 'static/js/[name].[contentHash:5].chunk.js'
    },
    optimization: {
        minimizer: [
            new TerserJSPlugin({
                parallel: true // 开启多线程压缩
            }),
            new OptimizeCSSAssetsPlugin({})
        ],
        splitChunks: {
            chunks: 'all',
            minSize: 20000, // 正常设置 20000+ 即 20k+ ，但这里我们的公共文件只有几行代码，所以设置为 1
            maxSize: 0,
            minChunks: 1,
            maxAsyncRequests: 5,
            maxInitialRequests: 3,
            automaticNameDelimiter: '/',
            name: false,
            cacheGroups: {
                vendors: {
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10,
                    // filename: 'static/js/[name].bundle.js'
                },
                default: {
                    minChunks: 2,
                    priority: -20,
                    reuseExistingChunk: true
                }
            }
        }
    },
    plugins: [
        new CleanWebpackPlugin(),
        new CopyWebpackPlugin([{
                from: 'static/',
                to: 'static/'
            },
            {
                from: 'modules/',
                to: 'modules/'
            },
            {
                from: 'dll/',
                to: 'dll/'
            }
        ]),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:5].css',
            chunkFilename: 'css/[name].[contenthash:5].css'
        }),
        new webpack.DllReferencePlugin({
            context: __dirname,
            manifest: require(resolve('dll', '_frame.manifest.json'))
        }),
        new CompressionPlugin({
            test: productionGzipExtensions,
            threshold: 10240, // 只处理比这个值大的资源。按字节计算
            minRatio: 0.8, // 只有压缩率比这个值小的资源才会被处理
            deleteOriginalAssets: false // 删除源文件
        })
    ]
}

if (config.production.bundleAnalyzer) {
    const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
        .BundleAnalyzerPlugin
    webpackConfig.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = webpackConfig