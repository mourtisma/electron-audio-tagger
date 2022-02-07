import React, { ChangeEvent, useContext, useState, useEffect } from 'react';

import { useForm, Controller } from 'react-hook-form';

import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import AudioFile from '@model/audio-file';
import { EditAudioFileContext } from './context';

export default (): JSX.Element => {
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
        setAudioFileValues({
            ...audioFileValues,
            [target.name]: target.value,
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

                    <input type="submit" value="Edit file" />
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
