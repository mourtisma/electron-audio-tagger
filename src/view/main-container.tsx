import React, { useState } from 'react';
import AudioFileController from '@controller/audio-file-controller';
import helpers from './electron-helpers';

const AudioGridContext = React.createContext({ handleClick: undefined });

const OpenButton = () => (
    <AudioGridContext.Consumer>
        {({ handleClick }) => (
            <button
                type="button"
                id="open-button"
                onClick={() => handleClick()}
            >
                Open directory
            </button>
        )}
    </AudioGridContext.Consumer>
);

export default () => {
    const [state, setState] = useState({
        audioFiles: [],
        error: false,
        selectedDirectory: null,
    });

    const handleClick = async () => {
        const { canceled, filePaths } = await helpers.showOpenDialog();

        if (!canceled) {
            const directory = filePaths[0];
            try {
                const audioFiles = await AudioFileController.openDirectory(
                    directory,
                );
                setState({
                    audioFiles,
                    error: false,
                    selectedDirectory: directory,
                });
            } catch (e) {
                setState({
                    audioFiles: [],
                    error: true,
                    selectedDirectory: null,
                });
            }
        } else {
            setState({ audioFiles: [], error: false, selectedDirectory: null });
        }
    };
    return (
        <AudioGridContext.Provider value={{ handleClick }}>
            <OpenButton />
            {state.selectedDirectory ? (
                <p>Selected directory: {state.selectedDirectory}</p>
            ) : (
                <p>No selected directory</p>
            )}
            {state.error ? (
                <p>Error</p>
            ) : (
                state.audioFiles.map((audioFile) => (
                    <p key={audioFile.name}>
                        {audioFile.name}
                        {audioFile.error && ' - Error'}
                    </p>
                ))
            )}
        </AudioGridContext.Provider>
    );
};
