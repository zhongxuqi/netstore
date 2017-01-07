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
        //new webpack.optimize.UglifyJsPlugin({
        //    compress: {
        //        warnings: false
        //    }
        //}),
        new BrowserSyncPlugin({
            host: 'localhost',
            port: 8080,
            proxy: 'localhost:8888',
            files: 'dist/*',
            //server: {
            //    //指定服务器启动根目录
            //    baseDir: './dist'
            //}
        })
    ],
    //devServer: {
    //    historyApiFallback:true,
    //    hot:true,
    //    inline:true,
    //    progress:true,
    //    proxy: {
    //        '/openapi': {
    //              target: 'http://localhost:8888/',
    //              secure: false
    //        }
    //    }
    //}
}
