const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const { resolve } = require('path');
const { readFileSync } = require('fs');
const htmlTemplate = readFileSync(resolve(__dirname, 'public', 'index.html')).toString();

module.exports = {
    mode: 'production',
    entry: resolve(__dirname, 'src', 'index.tsx'),
    output: {
        path: resolve(__dirname, 'dist'),
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: resolve(__dirname, 'dist')
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader'
            },
            {
                test: /\.css$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader'],
            },
        ]
    },
    plugins: [
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            templateContent: htmlTemplate
        })
    ]
};