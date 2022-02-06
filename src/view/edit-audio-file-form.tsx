import React, { ChangeEvent } from 'react';

import { useForm, Controller } from 'react-hook-form';

import TextField from '@material-ui/core/TextField';
import AudioFile from '@model/audio-file';

interface EditAudioFileFormProps {
    handleChange: (e: ChangeEvent) => void;
    onSubmit: () => void;
    audioFileValues: AudioFile;
}

export default ({
    handleChange,
    audioFileValues,
    onSubmit,
}: EditAudioFileFormProps): JSX.Element => {
    const { control, handleSubmit } = useForm({
        defaultValues: audioFileValues,
    });
    return (
        audioFileValues && (
            <form onSubmit={handleSubmit(() => onSubmit())}>
                <Controller
                    name="title"
                    control={control}
                    render={({ field: { name } }) => (
                        <TextField
                            id="title"
                            label="Title"
                            name={name}
                            value={audioFileValues.title || ''}
                            onChange={(e: ChangeEvent) => handleChange(e)}
                        />
                    )}
                />

                <input type="submit" value="Edit file" />
            </form>
        )
    );
};
