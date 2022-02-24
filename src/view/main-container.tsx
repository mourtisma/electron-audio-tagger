import React, { useState } from 'react';
import AudioFileController from '@controller/audio-file-controller';
import AudioFile from '@model/audio-file';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Snackbar from '@mui/material/Snackbar';
import electronHelpers from '@helpers/electron';
import EditAudioFileContext from './context';
import AudioFilesGrid from './audio-files-grid';
import EditDialog from './edit-dialog';

interface OpenButtonProps {
    handleClick: () => void | undefined;
    buttonText: 'Open directory' | 'Change directory';
}

const OpenButton = ({
    handleClick,
    buttonText,
}: OpenButtonProps): JSX.Element => (
    <Button variant="contained" color="primary" onClick={handleClick}>
        {buttonText}
    </Button>
);

export default (): JSX.Element => {
    const [audioFiles, setAudioFiles] = useState<AudioFile[]>([]);
    const [audioFileToEdit, setAudioFileToEdit] = useState<AudioFile | null>(
        null,
    );
    const [error, setError] = useState<boolean>(false);
    const [selectedDirectory, setSelectedDirectory] = useState<string | null>(
        null,
    );
    const [editDialogOpen, setEditDialogOpen] = useState<boolean>(false);

    const handleClick = async () => {
        const { canceled, filePaths } = await electronHelpers.showOpenDialog();

        if (!canceled) {
            const [directory] = filePaths;
            try {
                const newAudioFiles = await AudioFileController.openDirectory(
                    directory,
                );
                setAudioFiles(newAudioFiles);
            } catch (e) {
                setAudioFiles([]);
                setError(true);
            } finally {
                setSelectedDirectory(directory);
            }
        }
    };

    const handleErrorSnackbarClose = () => {
        setError(false);
    };

    const onFileSelect = async (filename: string) => {
        const audioFile = await AudioFileController.readFile(
            selectedDirectory,
            filename,
        );
        setAudioFileToEdit(audioFile);
        setEditDialogOpen(true);
    };

    const handleEditDialogClose = () => {
        setAudioFileToEdit(null);
        setEditDialogOpen(false);
    };

    const editAudioFile = async (
        newAudioFile: AudioFile,
    ): Promise<AudioFile> => {
        const editedAudioFile: AudioFile = await AudioFileController.editFile(
            selectedDirectory,
            newAudioFile.name,
            newAudioFile,
        );

        handleEditDialogClose();

        setAudioFiles(
            audioFiles.map((audioFile) =>
                audioFile.name === editedAudioFile.name
                    ? editedAudioFile
                    : audioFile,
            ),
        );

        return editedAudioFile;
    };

    if (!selectedDirectory) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="95vh"
            >
                <OpenButton
                    handleClick={handleClick}
                    buttonText="Open directory"
                />
            </Box>
        );
    }
    return (
        <>
            <OpenButton
                handleClick={handleClick}
                buttonText="Change directory"
            />
            <Typography variant="h6">
                Selected directory: {selectedDirectory}
            </Typography>
            <Snackbar
                open={error}
                onClose={handleErrorSnackbarClose}
                autoHideDuration={5000}
                message={`Error when opening directory ${selectedDirectory}`}
            />
            <AudioFilesGrid
                audioFiles={audioFiles}
                onFileSelect={onFileSelect}
                selectedDirectory={selectedDirectory}
            />
            <EditAudioFileContext.Provider
                value={{ audioFile: audioFileToEdit, editAudioFile }}
            >
                <EditDialog
                    open={editDialogOpen}
                    handleClose={handleEditDialogClose}
                />
            </EditAudioFileContext.Provider>
        </>
    );
};
