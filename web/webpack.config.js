const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { resolve } = require('path');

module.exports = {
    mode: 'production',
    entry: resolve(__dirname, 'src', 'index.tsx'),
    output: {
        path: resolve(__dirname, 'dist'),
        filename: 'bundle.js'
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
    plugins: [new MiniCssExtractPlugin()]
};