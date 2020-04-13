//此为webpack核心概念  学习完毕总结的配置  不懂得复制去webpack笔记搜索 即可知道每一项具体作用

const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const webpack = require('webpack');

//创建一个 .babelr 文件配置
// presets: [['@babel/preset-env', {
// 	targets: {
//      chrome: "67",
//    },
// 	useBuiltIns: 'usage'
// }]]

// 1. 创建一个 postcss.config.js 配置文件
// 2. npm install autoprefixer -D （安装 autoprefixer 插件）
// 3. postcss.config.js 配置如下
// module.exports = {
// 	plugins:[
// 		require('autoprefixer')
// 	]
// }


module.exports = {
	mode: 'development',
	devtool: 'cheap-module-eval-source-map',
	entry: {
		main: './src/index.js'
	},
	devServer: {
		contentBase: './dist',
		open: true,
		port: 8080,
		hot: true,
		hotOnly: true
	},
	module: {
		rules: [{
			test: /\.js$/,
			exclude: /node_modules/,
			loader: 'babel-loader', //需要.babelr 文件配置 ES6
		}, {
			test: /\.(jpg|png|gif)$/,
			use: {
				loader: 'url-loader',
				options: {
					name: '[name]_[hash].[ext]',
					outputPath: 'images/',
					limit: 10240
				}
			}
		}, {
			test: /\.(eot|ttf|svg)$/,
			use: {
				loader: 'file-loader'
			}
		}, {
			test: /\.scss$/,
			use: [
				'style-loader',
				{
					loader: 'css-loader',
					options: {
						importLoaders: 2
					}
				},
				'sass-loader',
				'postcss-loader'  //需要postcss.config.js 文件配置 厂商前缀
			]
		}, {
			test: /\.css$/,
			use: [
				'style-loader',
				'css-loader',
				'postcss-loader'
			]
		}]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: 'src/index.html'
		}),
		new CleanWebpackPlugin(['dist']),
		new webpack.HotModuleReplacementPlugin()
	],
	output: {
		filename: '[name].js',
		path: path.resolve(__dirname, 'dist')
	}
}