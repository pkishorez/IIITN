var nodeExternals = require('webpack-node-externals');
var webpack = require('webpack');
var path = require('path');

module.exports = {
	target: 'node',
	externals: [nodeExternals()],
	entry: './Server/index.ts',
	output: {
		filename: './production/bundle/server.bundle.js',
		libraryTarget: 'commonjs2'
	},
	module: {
		loaders: [
			{
				test: /\.ts$/,
				exclude: /node_modules/,
				loader: 'ts-loader',
				options: {
					configFile: 'tsconfig.server.json'
				}
			}
		]
	},
	resolve: {
		extensions: [".ts", ".js"],
		alias: {
			App: path.join(__dirname, 'App/'),
			Server: path.join(__dirname, "Server/"),
			Common: path.join(__dirname, "Common/"),
			Utils: path.join(__dirname, "Utils/")
		}
	},
	plugins: [
		new webpack.DefinePlugin({ // <-- key to reducing React's size
			'process.env': {
				'NODE_ENV': JSON.stringify('production')
			}
		})
		//new webpack.optimize.UglifyJsPlugin(), //minify everything
		//new webpack.optimize.AggressiveMergingPlugin()//Merge chunks 
	]
};