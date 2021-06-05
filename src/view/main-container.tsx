import React, { useState } from 'react';
import AudioFileController from '@controller/audio-file-controller';
import AudioFile from '@model/audio-file';
import AudioFilesGrid from './audio-files-grid';
import helpers from './electron-helpers';

type MainContainerState = {
    audioFiles: AudioFile[];
    error: boolean;
    selectedDirectory: string;
};

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
    const [state, setState] = useState<MainContainerState>({
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
                <AudioFilesGrid audioFiles={state.audioFiles} />
            )}
        </AudioGridContext.Provider>
    );
};
