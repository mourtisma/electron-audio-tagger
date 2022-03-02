<p align="center">
  <a href="https://github.com/mourtisma/electron-audio-tagger/actions/workflows/ci.yaml">
    <img alt="Build/Release" src="https://github.com/mourtisma/electron-audio-tagger/actions/workflows/ci.yaml/badge.svg">
  </a>
  <a href="https://www.npmjs.com/package/semantic-release">
    <img alt="semantic-release" src="https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg">
  </a>
  
  <a href="https://codecov.io/gh/mourtisma/electron-audio-tagger">
    <img alt="codecov" src="https://codecov.io/gh/mourtisma/electron-audio-tagger/branch/init/graph/badge.svg?token=J3S4I784CB"/>
  </a>    
</p>

![Application icon](/img/icon)

# Electron Audio Tagger

A portable desktop app for tagging your audio files.

## Table of contents

-   [User Manual](#user-manual)
    -   [Installing the app](#installing-the-app)
        -   [On Linux](#on-linux)
        -   [On Windows or MAC](#on-windows-or-mac)
    -   [Usage](#usage)
    -   [Troubleshooting](#troubleshooting)
-   [For developers](#for-developers)
    -   [Installing the dependencies](#installing-the-dependencies)
    -   [Linting and formatting](#linting-and-formatting)
    -   [Running unit tests](#running-unit-tests)
    -   [Running E2E tests](#running-e2e-tests)
    -   [Starting a development server](#starting-a-development-server)
    -   [Building executables](#building-executables)
    -   [Contributing](#contributing)

## User Manual

### Installing the app

Firstly, go to [the releases page of the app's repository](https://github.com/mourtisma/electron-audio-tagger/releases). Choose the release you want to use, and dowload either the corresponding package or ZIP archive, depending on your platform.

#### On Linux

You can either:

-   Download and unpack the .deb package
-   Or download and extract the ZIP archive to your favourite directory. In order to run the app, open a terminal in this directory and run:

```bash
./electron-audio-tagger
```

#### On Windows or MAC

Simply extract the ZIP archive into your favourite directory and run the `electron-audio-tagger` executable.

### Usage

Click the **Open directory** button, and choose a directory containing audio files.

For each file you want to edit, click on the **Edit button (pen icon)**, and a dialog window will open.

Edit the properties as you please, and to conclude, click on the **Edit file** button.

**Supported formats**: MP3, WAV, WMA, AAC, FLAC, OGG, AIFF, M4A.

### Troubleshooting

If you encounter any issue, you can write an email to [the maintainer](mailto:ismail.mourtada@gmail.com).

And if you have a Github account, please don't hesitate to open an issue in the repository.

## For developers

### Installing the dependencies

Since this app uses [Electron](https://www.electronjs.org/) (with React and Typescript), the local installation is straightforward.

```bash
npm install
```

It uses the [node-id3](https://www.npmjs.com/package/node-id3) library, to read and edit tags from the files.

### Linting and formatting

Linting is done through [ESLint](https://eslint.org/) and some useful plugins, and formatting is done through [Prettier](https://prettier.io/).

There are various available scripts to perform linting and formatting.

-   Linting the code: `npm run lint`
-   Linting the code and automatically fixing errors: `npm run lint:fix`
-   Formatting the code: `npm run format`

### Running unit tests

Unit tests are ran with [Jest](https://jestjs.io/). UI testing is implemented with [React Testing Library (RTL)](https://testing-library.com/docs/react-testing-library/intro/)

-   To run the unit tests: `npm t`
-   To run the unit tests and output code coverage: `npm run test:ci`. Coverage can be analyzed in the `coverage/` directory.

### Running E2E tests

E2E tests are ran with [TestCafé](https://testcafe.io/) and its [Electron Browser Provider](https://github.com/DevExpress/testcafe-browser-provider-electron). They are implemented with [TestCafé Testing Library](https://testing-library.com/docs/testcafe-testing-library/intro/). To run the E2E test suite(s), simply execute `npm run test:e2e`.

### Starting a development server

This app uses [Electron Forge](https://www.electronforge.io/), with the Webpack template, to start, package and publish it. The development server (with hot reload) can be started by running: `npm start`.

### Building executables

Electron Forge takes care of building the executable for the platform you are using. If you are using Linux, it will create both a DEB package, and a ZIP archive. To build your executable, simply run: `npm run make`.

### Contributing

This app is open-source, so contribution is highly encouraged. If you wish to do so, for a fix, a feature, etc... Here are the steps:

-   Open an issue in the repository, describing what you want to implement
-   If you are unsure about the validity of your idea, or prefer to wait for approval before opening a PR, don't hesitate to ask
-   **Branch out from the `dev` branch**
-   Open a PR when you are done
