import React, { useContext } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import CloseIcon from '@mui/icons-material/Close';
import { makeStyles } from '@mui/styles';
import EditAudioFileForm from './edit-audio-file-form';
import EditAudioFileContext from './context';

const useStyles = makeStyles({
    closeButton: {
        position: 'absolute',
        right: '0.5em',
        top: '0.5em',
        cursor: 'pointer',
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
            <Dialog
                onClose={handleClose}
                open={open}
                PaperProps={{ sx: { height: '550px', maxHeight: '650px' } }}
            >
                <DialogTitle>{`Edit ${audioFile.name}`}</DialogTitle>
                <div
                    role="none"
                    onClick={handleClose}
                    id="close-edit-dialog-btn"
                >
                    <CloseIcon
                        data-testid="close"
                        className={classes.closeButton}
                    />
                </div>
                <div className={classes.attributes}>
                    <EditAudioFileForm />
                </div>
            </Dialog>
        )
    );
};
