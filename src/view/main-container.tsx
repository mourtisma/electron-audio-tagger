import React, { useState } from 'react';
import AudioFileController from '@controller/audio-file-controller';
import AudioFile from '@model/audio-file';
import Button from '@material-ui/core/Button';
import Box from '@material-ui/core/Box';
import AudioFilesGrid from './audio-files-grid';
import helpers from './electron-helpers';

type MainContainerState = {
    audioFiles: AudioFile[];
    error: boolean;
    selectedDirectory: string;
};

type AudioGridContextType = {
    handleClick: () => void | undefined;
    buttonText: 'Open directory' | 'Change directory';
};

const AudioGridContext = React.createContext<AudioGridContextType>({
    handleClick: undefined,
    buttonText: 'Open directory',
});

const OpenButton = (): JSX.Element => (
    <AudioGridContext.Consumer>
        {({ handleClick, buttonText }) => (
            <Button
                id="open-button"
                variant="contained"
                color="primary"
                onClick={() => handleClick()}
            >
                {buttonText}
            </Button>
        )}
    </AudioGridContext.Consumer>
);

export default (): JSX.Element => {
    const [state, setState] = useState<MainContainerState>({
        audioFiles: [],
        error: false,
        selectedDirectory: null,
    });

    const handleClick = async () => {
        const { canceled, filePaths } = await helpers.showOpenDialog();

        if (!canceled) {
            const [directory] = filePaths;
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
                    selectedDirectory: directory,
                });
            }
        } else {
            setState({ audioFiles: [], error: false, selectedDirectory: null });
        }
    };
    if (!state.selectedDirectory) {
        return (
            <AudioGridContext.Provider
                value={{ handleClick, buttonText: 'Open directory' }}
            >
                <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                    minHeight="95vh"
                >
                    <OpenButton />
                </Box>
            </AudioGridContext.Provider>
        );
    }
    return (
        <>
            <AudioGridContext.Provider
                value={{ handleClick, buttonText: 'Change directory' }}
            >
                <OpenButton />
            </AudioGridContext.Provider>
            <p>Selected directory: {state.selectedDirectory}</p>
            {state.error ? (
                <p>Error</p>
            ) : (
                <AudioFilesGrid audioFiles={state.audioFiles} />
            )}
        </>
    );
};
