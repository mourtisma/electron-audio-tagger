import React, { ChangeEvent, useContext, useState, useEffect } from 'react';

import { useForm, Controller } from 'react-hook-form';

import TextField from '@material-ui/core/TextField';
import AudioFile from '@model/audio-file';
import { EditAudioFileContext } from './context';

export default (): JSX.Element => {
    const { audioFile, editAudioFile } = useContext(EditAudioFileContext);
    const [audioFileValues, setAudioFileValues] = useState<AudioFile>(
        audioFile,
    );
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
        await editAudioFile(audioFileValues);
    };

    const { control, handleSubmit } = useForm({
        defaultValues: audioFileValues,
    });
    return (
        audioFileValues && (
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
        )
    );
};
