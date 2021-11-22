import React from 'react';
import AudioFile from '@src/model/audio-file';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';

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
    audioFile: AudioFile;
    open: boolean;
    handleClose: () => void;
}

export default ({
    audioFile,
    open,
    handleClose,
}: EditDialogProps): JSX.Element => {
    const classes = useStyles();
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
                    <p>{`Title: ${audioFile.title || ''}`}</p>
                </div>
            </Dialog>
        )
    );
};
