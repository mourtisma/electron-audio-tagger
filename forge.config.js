module.exports = {
    packagerConfig: {},
    makers: [
      {
        name: "@electron-forge/maker-squirrel",
        config: {
          name: "electron_audio_tagger"
        }
      },
      {
        name: "@electron-forge/maker-zip",
        platforms: [
          "darwin"
        ]
      },
      {
        name: "@electron-forge/maker-deb",
        config: {}
      },
      {
        name: "@electron-forge/maker-rpm",
        config: {}
      }
    ],
    publishers: [
        {
            name: "@electron-forge/publisher-github",
            config: {
              repository: {
                owner: "mourtisma",
                name: "electron-audio-tagger"
              }
            }
          }
    ],
    plugins: [
      [
        "@electron-forge/plugin-webpack",
        {
          mainConfig: "./webpack.main.config.js",
          renderer: {
            config: "./webpack.renderer.config.js",
            entryPoints: [
              {
                html: "./src/index.html",
                js: "./src/renderer.ts",
                name: "main_window"
              }
            ]
          }
        }
      ]
    ]
}