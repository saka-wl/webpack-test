const { resolve } = require('path');
// 会帮你创建一个html 直接引用入口文件
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
// https://www.webpackjs.com/plugins/terser-webpack-plugin/#root
const TerserPlugin = require('terser-webpack-plugin');
// https://www.webpackjs.com/plugins/css-minimizer-webpack-plugin/#minify
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
// https://www.webpackjs.com/plugins/image-minimizer-webpack-plugin/#root
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const os = require('os');

const threads = os.cpus().length - 1;  // cpu核数

module.exports = {
    entry: {
        index: resolve(__dirname, '../src/index.js')
    },
    output: {
        path: resolve(__dirname, '../dist'),
        filename: '[name].js',
        clean: true
    },
    module: {
        rules: [
            {
                oneOf: [
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
                            // 用了MiniCssExtractPlugin.loader就不要使用style-loader了
                            MiniCssExtractPlugin.loader,
                            // 'style-loader',
                            {
                                loader: 'css-loader',
                                options: {
                                    // 每一个 CSS 的 `@import` 与 CSS 模块/ICSS 都会运行 `postcss-loader`，不要忘了 `sass-loader` 将不属于 CSS 的 `@import` 编译到一个文件中
                                    // 如果您需要在每个 CSS 的 `@import` 上运行 `sass-loader` 和 `postcss-loader`，请将其设置为 `2`。
                                    importLoaders: 1,
                                },
                            },
                            // postcss-loader 兼容处理
                            {
                                loader: 'postcss-loader',
                                options: {
                                    postcssOptions: {
                                        plugins: [
                                            [
                                                'postcss-preset-env',
                                                {
                                                    // 其他选项
                                                },
                                            ],
                                        ],
                                    },
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
                            options: {
                                // 开启cache缓存
                                cacheDirectory: true,
                                // 缓存压缩
                                cacheCompression: false,
                                // 减少代码体积
                                plugins: ['@babel/plugin-transform-runtime']
                            }
                        },
                    },
                ]
            }
        ]
    },
    optimization: {
        minimize: true,
        minimizer: [
            // 压缩js
            new TerserPlugin({
                // 开启多进程
                parallel: threads,
            }),
            new CssMinimizerPlugin(),
            new ImageMinimizerPlugin({
                minimizer: {
                    implementation: ImageMinimizerPlugin.imageminGenerate,
                    options: {
                        plugins: [
                            ["gifsicle", { interlaced: true }],
                            ["jpegtran", { progressive: true }],
                            ["optipng", { optimizationLevel: 5 }],
                            [
                                "svgo",
                                {
                                    plugins: [
                                        "preset-default",
                                        "prefixIds",
                                        {
                                            name: "sortAttrs",
                                            params: {
                                                xmlnsOrder: "alphabetical",
                                            },
                                        },
                                    ],
                                },
                            ],
                        ],
                    },
                },
            }),
        ],
    },
    plugins: [
        new ESLintPlugin({
            context: resolve(__dirname, '../src'),
            exclude: "node_modules",
            cache: true,
            // 缓存到哪个文件
            cacheLocation: resolve(__dirname, '../node_modules/.cache/eslint-cache'),
            threads
        }),
        new HtmlWebpackPlugin({
            title: 'webpack',
            template: resolve(__dirname, '../public', 'template.html')
        }),
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: ['dist']
        }),
        new MiniCssExtractPlugin({
            filename: 'css/[name].[contenthash:10].css'
        }),
    ],
    mode: 'production',
    // 生产环境下，详细到行+列
    // devtool: 'source-map',
};