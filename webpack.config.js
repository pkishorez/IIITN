var webpack = require("webpack");
var copyWebpackPlugin = require("copy-webpack-plugin");
var fs = require("fs");

module.exports = {
	entry: './index.tsx',

	output: {
		filename: 'bundle/bundle.js'
	},

	module: {
		loaders: [
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: 'ts-loader'
			}
		]
	},
	externals: {
		"monaco": "monaco"
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"]
	},
	plugins: [
		new copyWebpackPlugin([
			{
				from: 'node_modules/classui/bundle/classui.css',
				to: 'bundle/classui.css'
			}
		]),
		(!fs.existsSync("assets/vs"))?new copyWebpackPlugin([
			{
				from: 'node_modules/monaco-editor/min/vs',
				to: 'assets/vs'
			}
		]):new copyWebpackPlugin([]),
		new webpack.DefinePlugin({ // <-- key to reducing React's size
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		}),
		new webpack.optimize.UglifyJsPlugin(), //minify everything
		new webpack.optimize.AggressiveMergingPlugin()//Merge chunks 
	]
};