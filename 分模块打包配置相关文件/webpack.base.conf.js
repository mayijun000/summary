/**
 * @description 基础公共配置
 * @date 2020-01-08
 * @author mayijun
 */
const HtmlWebpackPlugin = require('html-webpack-plugin')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const {
	resolve,
	generateAddAssests,
	generateDllReferences
} = require('./utils')

const sourceMapEnabled = true;
const isProduction = process.env.NODE_ENV === "production";
const rulesPath = process.env.NODE_ENV === "mod" ? "../../dist/" : "";
let webpackConfig = {
	entry: {
		app: ["babel-polyfill",'./src/main.js']
	},
	output: {
		// webpack编译输出的发布路径
		publicPath: '/',
		filename: '[name].[hash:5].js',
		chunkFilename: '[name].[hash:5].chunk.js',
		path: resolve('dist')
	},
	resolve: {
		extensions: ['.vue', '.js', 'json'],
		alias: {
			'@': resolve('src'),
			'@mod': resolve('src/modules')
		},
		modules: [resolve('./node_modules')]
	},
	performance: false,
	module: {
		rules: [{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.js$/,
				exclude: /node_modules\/(?!ansi-regex)/,
				loader: 'babel-loader?cacheDirectory',
			},
			{
				test: /\.(png|jpe?g|gif|webp|cur)$/,
				use: [{
					loader: 'url-loader',
					options: {
						// 文件命名
						name: '[name].[ext]',
						// 输出路径
						outputPath: rulesPath + 'static/images/',
						// 小于 10k 的图片转成 base64 编码
						limit: 10240
					}
				}]
			},
			{test: /\.css$/, use: [
	          	'vue-style-loader',
	          	'css-loader',
	        ]},
			{test: /\.scss$/, use: [
	          	'vue-style-loader',
	          	'css-loader',
	          	'sass-loader'
	        ]},
			{
				test: /\.(woff2?|eot|ttf|otf|svg)(\?.*)?$/i,
				use: {
					loader: 'file-loader',
					options: {
						name: '[name].[ext]',
						outputPath: rulesPath + 'static/fonts/'
					}
				}
			}
		],
	},
	plugins: [
		new VueLoaderPlugin(),
		new MiniCssExtractPlugin({ //将css提取单独文件
			filename: 'css/[name].[contenthash:5].css',
			chunkFilename: 'css/[name].[contenthash:5].css'
		}),
		...generateDllReferences()
	]
}

// 非 mod 模式使用 HtmlWebpackPlugin
if(process.env.NODE_ENV !== 'mod') {
	webpackConfig.plugins.push(
		new HtmlWebpackPlugin({
			template: resolve('index.html'),
			favicon: './favicon.ico',
			//解决组件循环引用报错的问题,插件版本要4.0以上
			//chunksSortMode: 'none'
		})
	)
	// webpack 4+ 需要在 html-webpack-plugin 之后使用
	webpackConfig.plugins.push(...generateAddAssests())
}

module.exports = webpackConfig
