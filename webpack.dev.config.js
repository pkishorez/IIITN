var copyWebpackPlugin = require("copy-webpack-plugin");
var fs = require("fs");

module.exports = {
	entry: './index.tsx',
	
	output: {
		filename: 'production/bundle/bundle.js'
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
				to: 'production/bundle/classui.css'
			}
		]),
		(!fs.existsSync("production/assets/vs"))?new copyWebpackPlugin([
			{
				from: 'node_modules/monaco-editor/min/vs',
				to: 'production/assets/vs'
			}
		]):new copyWebpackPlugin([])
	],

	devtool: 'source-map',
	
	devServer: {
		host: '0.0.0.0',
		port: "2002"
	}
};