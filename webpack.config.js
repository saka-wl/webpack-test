const ESLintPlugin = require('eslint-webpack-plugin');
const { resolve } = require('path');
// 会帮你创建一个html 直接引用入口文件
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    entry: {
        index: resolve(__dirname, './src/index.js')
    },
    output: {
        path: resolve(__dirname, './dist'),
        filename: '[name].js',
        clean: true
    },
    module: {
        rules: [
            {
                test: /\.css$/i,
                exclude: /\.module\.css$/i,
                use: [
                    'style-loader',
                    'css-loader',
                ]
            },
            // 处理ttf与woff2字体资源
            {
                test: /\.(ttf|woff2?)$/,
                type: 'asset',
                generator: {
                    filename: 'static/name[hash:10][ext]'
                }
            },
            // 处理图片等资源
            {
                test: /\.(png|jpe?g|gif)$/,
                type: 'asset/resource',
                parser: {
                    dataUrlCondition: {
                        // 小于这么大时使用 base64
                        maxSize: 10 * 1024
                    }
                },
                generator: {
                    filename: 'static/[hash:10][ext][query]'
                }
            },
            // 处理css资源
            {
                test: /\.((c|sa|sc)ss)$/i,
                use: [
                    'style-loader',
                    {
                        loader: 'css-loader',
                        options: {
                            // 每一个 CSS 的 `@import` 与 CSS 模块/ICSS 都会运行 `postcss-loader`，不要忘了 `sass-loader` 将不属于 CSS 的 `@import` 编译到一个文件中
                            // 如果您需要在每个 CSS 的 `@import` 上运行 `sass-loader` 和 `postcss-loader`，请将其设置为 `2`。
                            importLoaders: 1,
                        },
                    },
                    // 也可能是 `less-loader`
                    {
                        loader: 'sass-loader',
                    },
                ],
            },
            // babel处理
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components|dist)/,
                use: {
                    loader: 'babel-loader',
                    // 写在了 babel.config.js 中
                    // options: {
                    //     presets: ['@babel/preset-env'],
                    // },
                },
            },
        ]
    },
    plugins: [
        new ESLintPlugin(),
        new HtmlWebpackPlugin({
            title: 'webpack'
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['dist']
        })
    ],
};