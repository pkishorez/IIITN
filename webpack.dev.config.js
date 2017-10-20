var copyWebpackPlugin = require("copy-webpack-plugin");
var fs = require("fs");
var serverConfig = require("./webpack.server.config");

module.exports = [
	{
		entry: {
			SW: './App/SW.ts',
			"bundle/bundle": './index.tsx'
		},
		output: {
			filename: 'production/[name].js'
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
	},
	serverConfig
];