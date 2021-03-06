var webpack = require('webpack')
var BrowserSyncPlugin = require('browser-sync-webpack-plugin')

module.exports = {
    entry: {
        app: './src/app/app.jsx',
        admin: './src/app/admin.jsx',
        login: './src/app/login.jsx',
    },
    output: {
        filename: '[name].bundle.js',
        publicPath: "http://localhost:8080/",
        path: './dist/js'
    },
    module: {
        loaders: [
            {
                test: /\.jsx$/,
                loader: 'babel-loader',
                query: {
                    presets: ['latest', 'react'],
                }
            }, 
            {test: /\.less$/, loader: 'style!css!less'},
            {test: /\.css$/, loader: 'style!css'},
        ]
    },
    plugins: [
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            }
        }),
    ],
    devtool: 'source-map',
}
