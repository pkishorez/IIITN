var copyWebpackPlugin = require("copy-webpack-plugin");

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
				loader: 'ts-loader'
			}
		]
	},
	resolve: {
		extensions: [".tsx", ".ts", ".js"]
	},
	plugins: [
		new copyWebpackPlugin([{
			from: 'node_modules/classui/bundle/classui.css',
			to: 'bundle/classui.css'
		}])
	],
	devtool: 'source-map',
	
	devServer: {
		host: '0.0.0.0',
		port: "2002"
	}
};