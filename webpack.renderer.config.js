const path = require('path');

const rules = require('./webpack.rules');
const plugins = require('./webpack.plugins');

rules.push({
    test: /\.css$/,
    use: [{ loader: 'style-loader' }, { loader: 'css-loader' }],
});

module.exports = {
    module: {
        rules,
    },
    plugins,
    resolve: {
        extensions: ['.js', '.ts', '.jsx', '.tsx', '.css'],
        alias: {
            '@model': path.resolve(__dirname, 'src/model'),
            '@view': path.resolve(__dirname, 'src/view'),
            '@controller': path.resolve(__dirname, 'src/controller'),
            '@helpers': path.resolve(__dirname, 'src/helpers'),
        },
    },
};
