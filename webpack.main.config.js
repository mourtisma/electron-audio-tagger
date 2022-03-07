const path = require('path');

const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    /**
     * This is the main entry point for your application, it's the first file
     * that runs in the main process.
     */
    entry: './src/index.ts',
    // Put your normal webpack config below here
    module: {
        rules: require('./webpack.rules'),
    },
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css', '.json'],
    },
    plugins: [
        /**
         * During the creation of the BrowserWindow in the main process, the code that is executed
         * is in the .webpack/main directory.
         *
         *  => The img/ folder containing the icon must be moved alongside index.js
         * in order for the icon to appear after loading the app, when it is installed through
         * a ZIP archive.
         */
        new CopyWebpackPlugin({
            patterns: [
                {
                    from: path.resolve(__dirname, 'img'),
                    to: path.resolve(__dirname, '.webpack/main/img'),
                },
            ],
        }),
    ],
};
