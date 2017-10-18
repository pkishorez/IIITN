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
				loader: 'source-map-loader'
			},
			{
				test: /\.jsx?$/,
				loader: 'source-map-loader'
			},
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				loader: 'ts-loader?configFile=./tsconfig.dev.json'
			}
		]
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
		]):new copyWebpackPlugin([])
	],

	devtool: 'source-map',
	
	devServer: {
		host: '0.0.0.0',
		port: "2002"
	}
};