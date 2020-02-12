const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// const env = process.env.NODE_ENV || 'development';

const config = {

    // mode: env,
    // devtool: (env === 'development') ? 'cheap-module-eval-source-map' : undefined,
    devServer: {
        historyApiFallback: true,
        overlay: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
            },
            {
                test: /\.(scss|sass|css)$/,
                use: [
                    // For hot reload in dev https://github.com/webpack-contrib/mini-css-extract-plugin/issues/34
                    (env === 'development') ? 'style-loader' : MiniCssExtractPlugin.loader,
                    'css-loader',
                    'sass-loader'
                ],
            },
            // {
            //     test: /\.(png|jpg|gif|otf)$/,
            //     use: [{
            //         loader: 'file-loader',
            //         options: {}
            //     }]
            // }
        ],
    },
    plugins: [
        // new MiniCssExtractPlugin({
        //     filename: (env === 'development') ? '[name].css' : '[name].[hash].css',
        //     chunkFilename: (env === 'development') ? '[id].css' : '[id].[hash].css',
        // })
    ]

};

module.exports = config;