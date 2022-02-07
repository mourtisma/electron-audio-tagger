import React, { useContext } from 'react';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';
import { makeStyles } from '@material-ui/styles';
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
    const { audioFile } = useContext(EditAudioFileContext);

    return (
        audioFile && (
            <Dialog onClose={handleClose} open={open}>
                <DialogTitle>{`Edit ${audioFile.name}`}</DialogTitle>
                <div data-testid="close" role="none" onClick={handleClose}>
                    <CloseIcon className={classes.closeButton} />
                </div>
                <div className={classes.attributes}>
                    <EditAudioFileForm />
                </div>
            </Dialog>
        )
    );
};
