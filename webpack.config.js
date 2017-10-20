var webpack = require("webpack");
var copyWebpackPlugin = require("copy-webpack-plugin");
var CompressionPlugin = require('compression-webpack-plugin');
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
					to: 'production/bundle/classui.css'
				}
			]),
			(!fs.existsSync("production/assets/vs"))?new copyWebpackPlugin([
				{
					from: 'node_modules/monaco-editor/min/vs',
					to: 'production/assets/vs'
				}
			]):new copyWebpackPlugin([]),
			new webpack.DefinePlugin({ // <-- key to reducing React's size
				'process.env': {
					'NODE_ENV': JSON.stringify('production')
				}
			}),
			new webpack.optimize.UglifyJsPlugin(), //minify everything
			new webpack.optimize.AggressiveMergingPlugin(),//Merge chunks 
			new CompressionPlugin({
				asset: "./production/bundle/bundle.js.gz",
				algorithm: "gzip",
				test: /\.js$|\.css$|\.html$/,
				threshold: 10240,
				minRatio: 0.8
			})
		]
	},
	serverConfig
];