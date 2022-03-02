const path = require('path');

const icon = path.join(__dirname, 'img', 'icon');
module.exports = {
    packagerConfig: {
        icon, // Sets the icon for non-linux platforms
    },
    makers: [
        {
            name: '@electron-forge/maker-zip',
        },
        {
            name: '@electron-forge/maker-deb',
            config: {
                icon, // Sets the icon in case the app is installed through a DEB installer
                productDescription:
                    'Open a directory, and edit the properties of its audio files as you wish.',
                homepage: 'https://github.com/mourtisma/electron-audio-tagger',
            },
        },
    ],
    publishers: [
        {
            name: '@electron-forge/publisher-github',
            config: {
                repository: {
                    owner: 'mourtisma',
                    name: 'electron-audio-tagger',
                },
            },
        },
    ],
    plugins: [
        [
            '@electron-forge/plugin-webpack',
            {
                mainConfig: './webpack.main.config.js',
                renderer: {
                    config: './webpack.renderer.config.js',
                    entryPoints: [
                        {
                            html: './src/index.html',
                            js: './src/renderer.ts',
                            name: 'main_window',
                        },
                    ],
                },
            },
        ],
    ],
};
