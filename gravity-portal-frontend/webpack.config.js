const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	entry: {
		'js/bundle': './App.jsx'
	},
	output: {
		filename: '[name].js?[contenthash]',
		path: __dirname + '/../nginx/www',
		publicPath: '/'
	},
	module: {
		rules: [{
			test: /\.(js|jsx)$/,
			exclude: /node_modules/,
			use: {
				loader: 'babel-loader',
				options: {
					presets: [
						['@babel/preset-env', { targets: { chrome: 58 } }],
						'@babel/preset-react'
					],
					plugins: [
						['import', { libraryName: 'antd', style: true }]
					]
				}
			}
		}, {
			test: /\.less$/,
			use: [ MiniCssExtractPlugin.loader, 'css-loader', 'less-loader?javascriptEnabled=1' ]
		}]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: 'css/style.css?[contenthash]'
		}),
		new HtmlWebpackPlugin({
			template: './index.html',
			filename: 'index.html'
		})
	],
	devServer: {
		historyApiFallback: true
	}
};
