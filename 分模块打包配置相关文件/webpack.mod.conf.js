/**
 * @description 业务模块打包配置
 * @date 2020-01-08
 * @author mayijun
 */
const webpack = require('webpack')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const TerserJSPlugin = require("terser-webpack-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const config = require('./config')
const {resolve} = require('./utils')
console.log("###################"+resolve('src'));
/**
 * 业务模块独立打包配置
 * mod 模块名称
 * contentHash的方式，表示文件内容不变，哈希值不变
 */
const generateModConfig = mod => {
	const webpackConfig = {
		//生产环境
		mode: 'production',
		//是否自动删除webpack里的目录
		devtool: config.production.sourceMap ? 'cheap-module-source-map' : 'none',
		//模块入口文件
		entry: resolve(`src/modules/${mod}/index.js`),
		output: {
			path: resolve(`modules/${mod}`),
			publicPath: `/modules/${mod}/`,
			filename: `index.js`,
			chunkFilename: '[name].[contentHash:5].chunk.js',
			library: `_${mod}`,
			libraryTarget: 'umd'
		},
		resolve: {
			alias: {
				'@': resolve('src'),
				'@mod': resolve('src/modules')
			}
		},
		module: {
			rules: [
				{
					test: /\.(png|jpe?g|gif|webp)$/,
					use: [{
						loader: 'url-loader',
						options: {
							// 文件命名
							name: '[name].[ext]',
							// 输出路径
							outputPath: '../../dist/static/images/',
							// 小于 10k 的图片转成 base64 编码
							limit: 10240
						}
					}]
				},
				{
					test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/i,
					use: {
						loader: 'file-loader',
						options: {
							name: '[name].[ext]',
							outputPath: '../../dist/static/fonts/'
						}
					}
				}
			],
		},
		optimization: {
			minimizer: [
				new TerserJSPlugin({
					parallel: true // 开启多线程压缩
				}),
				new OptimizeCSSAssetsPlugin({})
			],
			//webpack4的默认配置
			splitChunks: {
				/**
				 * async表示只从异步加载得模块（动态加载import()）里面进行拆分
				 * initial表示只从入口模块进行拆分
				 * all表示以上两者都包括
				 */
				chunks: 'all',
				minSize: 20000,
				maxSize: 0,
				minChunks: 1,
				/**
				 * 异步模块内部的并行最大请求数：每个import()它里面的最大并行请求数量
				 * 1、import()文件本身算一个请求
　　               		 * 2、并不算js以外的公共资源请求比如css
 				 * 3、当同时又两个模块满足拆分条件的时候更大的包会先被拆分
				 */
				maxAsyncRequests: 5,
				/**
				 * 表示允许入口并行加载的最大请求数
				 * 1、当同时又两个模块满足拆分条件的时候更大的包会先被拆分
				 * 2、入口文件本身算一个请求
				 * 3、入口文件里引入js的数量
				 */
				maxInitialRequests: 3,
				automaticNameDelimiter: '/',
				name: true,
				cacheGroups: {
					vendors: {
						test: /[\\/]node_modules[\\/]/, //从这里筛选引入的模块
						priority: -10
					},
					default: {
						minChunks: 2, //重复引用的次数，达到次数被拆分出来
						priority: -20, //default的权重，和vendors的权重比较决定谁优先
						reuseExistingChunk: true
					}
				}
			}
		},
		plugins: [
			new CleanWebpackPlugin(),
			new MiniCssExtractPlugin({
				filename: 'css/[name].[contenthash:5].css',
				chunkFilename: 'css/[name].[contenthash:5].css'
			}),
			//为每个chunk文件头设置注释
			new webpack.BannerPlugin({
				banner: `@version ${
          require('../package.json').version
          }\n@info hash:[hash], chunkhash:[chunkhash], name:[name], filebase:[filebase], query:[query], file:[file]`
			})
		]
	}

	if(config.production.bundleAnalyzer) {
		const BundleAnalyzerPlugin = require('webpack-bundle-analyzer')
			.BundleAnalyzerPlugin
		webpackConfig.plugins.push(new BundleAnalyzerPlugin())
	}

	return webpackConfig
}

module.exports = generateModConfig