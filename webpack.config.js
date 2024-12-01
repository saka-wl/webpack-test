const ESLintPlugin = require('eslint-webpack-plugin');
const { resolve } = require('path');

module.exports = {
    entry: {
        index: resolve(__dirname, './src/index.js')
    },
    output: {
        path: resolve(__dirname, './dist'),
        filename: '[name].js',
        clean: true
    },
    plugins: [new ESLintPlugin()],
};