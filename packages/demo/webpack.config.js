const path = require('path');
const { merge } = require('webpack-merge')
const { createDefaultConfig } = require('@open-wc/building-webpack')
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

module.exports = merge(
    createDefaultConfig({
        input: path.resolve(__dirname, './index.html'),
    }),
    {
        plugins: [
            new MomentLocalesPlugin({
                localesToKeep: ['en'],
            }),
        ],
        resolve: {
            extensions: ['.ts', '.tsx', '.mjs', '.js', '.json'],
            alias: {
                stream: 'readable-stream',
            },
        },
        module: {
            rules: [
                {
                    test: /\.nq$/,
                    use: ['raw-loader'],
                },
                {
                    test: /\.ttl$/,
                    use: ['raw-loader'],
                },

            ],
        },
        node: {
            crypto: true,
        },
    })

