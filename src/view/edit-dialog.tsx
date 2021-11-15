import React from 'react';
import AudioFile from '@src/model/audio-file';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import CloseIcon from '@material-ui/icons/Close';

interface EditDialogProps {
    audioFile: AudioFile;
    open: boolean;
    handleClose: () => void;
}

export default ({
    audioFile,
    open,
    handleClose,
}: EditDialogProps): JSX.Element =>
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
                <CloseIcon />
            </div>
            <p>{`Title: ${audioFile.title || ''}`}</p>
        </Dialog>
    );
