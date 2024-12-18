const { resolve } = require('path');
const path = require('path');
// 会帮你创建一个html 直接引用入口文件
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const os = require('os');

const threads = os.cpus().length - 1;  // cpu核数
module.exports = {
    entry: {
        main: resolve(__dirname, '../src/main.js'),
        app: resolve(__dirname, '../src/app.js'),
    },
    output: {
        path: undefined,
        filename: '[name].js',
    },
    module: {
        rules: [
            {
                // 每个文件只经过一个loader处理
                oneOf: [
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
                    // 处理css资源 执行顺序 从下到上
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
                        use: [
                            {
                                // 开启多进程loader
                                loader: 'thread-loader',
                                options: {
                                    // 进程数量
                                    works: threads
                                }
                            },
                            {
                                loader: 'babel-loader',
                                // 写在了 babel.config.js 中
                                // options: {
                                //     presets: ['@babel/preset-env'],
                                // },
                                options: {
                                    // 开启cache缓存
                                    cacheDirectory: true,
                                    // 缓存压缩
                                    cacheCompression: false,
                                    // 减少代码体积
                                    plugins: ['@babel/plugin-transform-runtime']
                                }
                            },
                        ]
                    },
                ]
            }
        ]
    },
    plugins: [
        new ESLintPlugin({
            context: resolve(__dirname, '../src'),
            exclude: "node_modules",
            cache: true,
            cacheLocation: resolve(__dirname, '../node_modules/.cache/eslint-cache'),
            threads
        }),
        new HtmlWebpackPlugin({
            title: 'webpack',
            template: resolve(__dirname, '../public', 'template.html')
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['dist']
        })
    ],
    devServer: {
        host: 'localhost',
        port: '8080',
        open: true,
        hot: true, // 开启HMR
    },
    mode: 'development',
    // 开发模式下，行
    devtool: 'cheap-module-source-map',
};