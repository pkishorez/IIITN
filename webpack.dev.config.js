var copyWebpackPlugin = require("copy-webpack-plugin");
var fs = require("fs");
var serverConfig = require("./webpack.server.config");
var path = require("path");

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
			extensions: [".tsx", ".ts", ".js"],
			alias: {
				App: path.join(__dirname, 'App/'),
				Server: path.join(__dirname, "Server/"),
				Common: path.join(__dirname, "Common/"),
				Utils: path.join(__dirname, "Utils/")
			},
		},

		plugins: [
			new copyWebpackPlugin([
				{
					from: 'node_modules/highlight.js/styles/vs.css',
					to: 'production/assets/vs.css'
				}
			]),
			new copyWebpackPlugin([
				{
					from: 'node_modules/classui/bundle/',
					to: 'production/bundle/'
				}
			]),
			new copyWebpackPlugin([
				{
					from: 'node_modules/classui/assets/font-awesome',
					to: 'production/assets/font-awesome'
				}
			]),
			new copyWebpackPlugin([
				{
					from: 'node_modules/@iiitn/canvas2d/bundle',
					to: 'production/assets/canvas2d'
				}
			]),
			new copyWebpackPlugin([
				{
					from: 'node_modules/draft-js/dist/Draft.css',
					to: 'production/assets/Draft.css'
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