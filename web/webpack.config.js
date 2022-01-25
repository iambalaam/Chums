const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');

const { resolve } = require('path');
const { readFileSync } = require('fs');
const webpack = require('webpack');
const htmlTemplate = readFileSync(resolve(__dirname, 'index.html')).toString();

if (!process.env['NODE_ENV']) throw new Error('Please set NODE_ENV');
const localDeno = true;
const LOCAL_DENO = 'http://localhost:8000';
const PROD_DENO = 'https://chumstennis.net';

module.exports = {
    mode: process.env['NODE_ENV'],
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
    devtool: 'inline-source-map',
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
            templateContent: htmlTemplate,
            inject: true
        }),
        new webpack.DefinePlugin({
            __ENDPOINT__: localDeno 
            ? JSON.stringify(LOCAL_DENO) 
            : JSON.stringify(PROD_DENO)
        })
        // new BundleAnalyzerPlugin()
    ]
};