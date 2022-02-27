import React, { ChangeEvent, useContext, useState, useEffect } from 'react';

import { useForm, Controller } from 'react-hook-form';

import TextField from '@mui/material/TextField';
import Snackbar from '@mui/material/Snackbar';
import SaveIcon from '@mui/icons-material/Save';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { makeStyles } from '@mui/styles';
import AudioFile from '@model/audio-file';
import { verifyTrackNumber } from '@helpers/node-id3';
import EditAudioFileContext from './context';

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
        float: 'right',
        right: '1.5em',
        top: '3em',
    },
    textField: {
        width: '90%',
    },
    numberField: {
        width: '80%',
    },
    errorText: {
        color: 'red',
        height: 0,
        marginTop: 0,
    },
});

export default (): JSX.Element => {
    const classes = useStyles();
    const { audioFile, editAudioFile } = useContext(EditAudioFileContext);
    const [audioFileValues, setAudioFileValues] = useState<AudioFile>(
        audioFile,
    );
    const [editError, setEditError] = useState<string>('');

    const handleErrorSnackbarClose = () => {
        setEditError('');
    };

    useEffect(() => {
        setAudioFileValues(audioFile);
    }, [audioFile]);

    const {
        control,
        handleSubmit,
        trigger,
        formState: { errors },
    } = useForm<AudioFile>({
        defaultValues: audioFileValues,
    });

    const onSubmit = async () => {
        try {
            await editAudioFile(audioFileValues);
        } catch (e) {
            setEditError(e);
        }
    };

    const handleChange = (e: ChangeEvent) => {
        const target = e.target as HTMLInputElement;
        const newValue = parseInputValue(target);
        setAudioFileValues({
            ...audioFileValues,
            [target.name]: newValue,
        });
        trigger();
    };

    const validateTrackFields = () =>
        verifyTrackNumber(
            audioFileValues.trackPosition,
            audioFileValues.totalNumberOfTracks,
        ) || 'The track position must be lower than the total number of tracks';

    return (
        audioFileValues && (
            <>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
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
                                        className={classes.textField}
                                        fullWidth
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
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
                                        className={classes.textField}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
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
                                        className={classes.textField}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={12}>
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
                                        className={classes.textField}
                                    />
                                )}
                            />
                        </Grid>

                        <Grid item xs={6}>
                            <Controller
                                name="trackPosition"
                                control={control}
                                rules={{ validate: validateTrackFields }}
                                render={({ field: { name } }) => (
                                    <TextField
                                        id="trackPosition"
                                        label="Track position"
                                        type="number"
                                        name={name}
                                        value={
                                            audioFileValues.trackPosition || ''
                                        }
                                        onChange={handleChange}
                                        inputProps={{ min: 0 }}
                                        error={Boolean(errors?.name)}
                                        helperText={
                                            errors?.trackPosition?.message
                                        }
                                        className={classes.numberField}
                                        FormHelperTextProps={{
                                            classes: {
                                                root: classes.errorText,
                                            },
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controller
                                name="totalNumberOfTracks"
                                control={control}
                                rules={{ validate: validateTrackFields }}
                                render={({ field: { name } }) => (
                                    <TextField
                                        id="totalNumberOfTracks"
                                        label="Total tracks"
                                        type="number"
                                        name={name}
                                        value={
                                            audioFileValues.totalNumberOfTracks ||
                                            ''
                                        }
                                        onChange={handleChange}
                                        inputProps={{ min: 0 }}
                                        error={Boolean(errors?.name)}
                                        helperText={
                                            errors?.totalNumberOfTracks?.message
                                        }
                                        className={classes.numberField}
                                        FormHelperTextProps={{
                                            classes: {
                                                root: classes.errorText,
                                            },
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>
                    <Button
                        variant="contained"
                        color="secondary"
                        startIcon={<SaveIcon />}
                        className={classes.editButton}
                        type="submit"
                    >
                        Edit file
                    </Button>
                </form>
                <Snackbar
                    open={!!editError}
                    onClose={handleErrorSnackbarClose}
                    autoHideDuration={5000}
                    message={`${editError}`}
                />
            </>
        )
    );
};
