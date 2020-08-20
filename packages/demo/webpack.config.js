const path = require('path');
const MomentLocalesPlugin = require('moment-locales-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: './src/index.ts',
    plugins: [
        new MomentLocalesPlugin({
            localesToKeep: ['en'],
        }),
    ],
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'demo.js',
    },
    module: {
        rules: [
            {
                test: /\.ts$|\.tsx$/,
                loader: 'ts-loader',
                options: { allowTsInNodeModules: true },
            },
            /*{
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
            },*/
            {
                test: /\.(jpe?g|gif|png|svg)$/i,
                use: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 8192,
                        },
                    },
                ],
            },
        ],
    },
};
