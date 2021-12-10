const path = require("path");
const webpack = require("webpack");
const packageManifest = require("./package");
const FileManagerPlugin = require('filemanager-webpack-plugin');

const OUTPUT_FOLDER =  __dirname + '/dist';

module.exports = {
    output: {
        path: OUTPUT_FOLDER,
        filename: 'singular-sdk.js',
        libraryTarget: 'umd',
    },
    entry: ["@babel/polyfill/noConflict", './src/index.js'],
    // devtool: 'eval-source-map',
    module: {
        rules: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                }
            }
        ]
    },
    plugins: [
        new webpack.DefinePlugin({
            SDK_VERSION: JSON.stringify(packageManifest.version),
            SDK_ENDPOINT: JSON.stringify("https://sdk-api-v1.singular.net/api/v1/"),
        }),
        new FileManagerPlugin({
            onEnd: {
                copy: [
                    {source: OUTPUT_FOLDER, destination: path.resolve(__dirname, "../web-sdk-app/singular-sdk-app")},
                ],
            },
        }),
    ]
};
