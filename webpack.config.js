const path = require('path');
const webpack = require('webpack');
module.exports = {
    context: path.resolve(__dirname, './source'),
    entry: {
         app: './main.js',
     },
    output: {
        path: path.resolve(__dirname, './build'),
        filename: '[name].js',
    },
    plugins: [
         new webpack.NoEmitOnErrorsPlugin()
    ],
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: [/node_modules/],
                use: [{
                    loader: 'babel-loader',
                    options: { presets: ['es2015'] }
                }]
            },
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "eslint-loader"
            },
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            }

        ]
    },
    devtool: 'source-map',
    resolve: {
        modules: [path.resolve(__dirname, './'), 'node_modules', path.resolve(__dirname, '../tests')]
    }
};
