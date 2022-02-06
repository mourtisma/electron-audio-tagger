import React, { ChangeEvent, useContext, useEffect, useState } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';
import AudioFile from '@model/audio-file';
import EditAudioFileForm from './edit-audio-file-form';
import { EditAudioFileContext } from './context';

const useStyles = makeStyles({
    closeButton: {
        position: 'absolute',
        right: '0.5em',
        bottom: '0.5em',
    },
    attributes: {
        marginLeft: '0.5em',
    },
});

interface EditDialogProps {
    open: boolean;
    handleClose: () => void;
}

export default ({ open, handleClose }: EditDialogProps): JSX.Element => {
    const classes = useStyles();
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
        handleClose();
    };

    return (
        audioFile && (
            <Dialog onClose={handleClose} open={open}>
                <DialogTitle>{`Edit ${audioFile.name}`}</DialogTitle>
                <div
                    data-testid="close"
                    role="none"
                    onClick={() => {
                        handleClose();
                    }}
                >
                    <CloseIcon className={classes.closeButton} />
                </div>
                <div className={classes.attributes}>
                    <EditAudioFileForm
                        handleChange={(e: ChangeEvent) => handleChange(e)}
                        audioFileValues={audioFileValues}
                        onSubmit={() => onSubmit()}
                    />
                </div>
            </Dialog>
        )
    );
};
