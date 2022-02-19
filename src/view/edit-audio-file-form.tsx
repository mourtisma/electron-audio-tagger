import React, { ChangeEvent, useContext, useState, useEffect } from 'react';

import { useForm, Controller } from 'react-hook-form';

import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/styles';
import AudioFile from '@model/audio-file';
import { EditAudioFileContext } from './context';

const parseInputValue = (
    target: HTMLInputElement,
): string | number | undefined => {
    if (target.type !== 'number') {
        return target.value;
    }

    return Number.isNaN(target.valueAsNumber)
        ? undefined
        : target.valueAsNumber;
};

const useStyles = makeStyles({
    editButton: {
        position: 'absolute',
        right: '10em',
        bottom: '0.5em',
    },
});

export default (): JSX.Element => {
    const classes = useStyles();
    const { audioFile, editAudioFile } = useContext(EditAudioFileContext);
    const [audioFileValues, setAudioFileValues] = useState<AudioFile>(
        audioFile,
    );
    const [error, setError] = useState<boolean>(false);

    const handleErrorSnackbarClose = () => {
        setError(false);
    };

    useEffect(() => {
        setAudioFileValues(audioFile);
    }, [audioFile]);

    const handleChange = (e: ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        const newValue = parseInputValue(target);
        setAudioFileValues({
            ...audioFileValues,
            [target.name]: newValue,
        });
    };
    const onSubmit = async () => {
        try {
            await editAudioFile(audioFileValues);
        } catch (e) {
            setError(true);
        }
    };

    const { control, handleSubmit } = useForm({
        defaultValues: audioFileValues,
    });
    return (
        audioFileValues && (
            <>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Controller
                        name="title"
                        control={control}
                        render={({ field: { name } }) => (
                            <TextField
                                id="title"
                                label="Title"
                                name={name}
                                value={audioFileValues.title || ''}
                                onChange={handleChange}
                            />
                        )}
                    />
                    <Controller
                        name="artist"
                        control={control}
                        render={({ field: { name } }) => (
                            <TextField
                                id="artist"
                                label="Artist"
                                name={name}
                                value={audioFileValues.artist || ''}
                                onChange={handleChange}
                            />
                        )}
                    />
                    <Controller
                        name="album"
                        control={control}
                        render={({ field: { name } }) => (
                            <TextField
                                id="album"
                                label="Album"
                                name={name}
                                value={audioFileValues.album || ''}
                                onChange={handleChange}
                            />
                        )}
                    />
                    <Controller
                        name="composer"
                        control={control}
                        render={({ field: { name } }) => (
                            <TextField
                                id="composer"
                                label="Composer"
                                name={name}
                                value={audioFileValues.composer || ''}
                                onChange={handleChange}
                            />
                        )}
                    />
                    <Controller
                        name="trackPosition"
                        control={control}
                        render={({ field: { name } }) => (
                            <TextField
                                id="trackPosition"
                                label="Track position"
                                type="number"
                                name={name}
                                value={audioFileValues.trackPosition || ''}
                                onChange={handleChange}
                            />
                        )}
                    />
                    <Controller
                        name="totalNumberOfTracks"
                        control={control}
                        render={({ field: { name } }) => (
                            <TextField
                                id="totalNumberOfTracks"
                                label="Total tracks"
                                type="number"
                                name={name}
                                value={
                                    audioFileValues.totalNumberOfTracks || ''
                                }
                                onChange={handleChange}
                            />
                        )}
                    />

                    <input
                        type="submit"
                        value="Edit file"
                        className={classes.editButton}
                    />
                </form>
                <Snackbar
                    open={error}
                    onClose={handleErrorSnackbarClose}
                    autoHideDuration={5000}
                    message={`Error when editing ${audioFileValues.name}`}
                />
            </>
        )
    );
};
