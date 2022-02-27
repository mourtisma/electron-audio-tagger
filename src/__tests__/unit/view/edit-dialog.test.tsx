import React from 'react';
import { render, fireEvent } from '@testing-library/react';

import EditDialog from '@view/edit-dialog';
import EditAudioFileContext from '@view/context';

import { audioFileMp3 as audioFile } from '../audio-files-fixtures';

test('Renders the data of a particular audio file and closes after edit', async () => {
    const { getByText } = render(
        <EditAudioFileContext.Provider value={{ audioFile }}>
            <EditDialog open handleClose={() => {}} />
        </EditAudioFileContext.Provider>,
    );

    expect(getByText('Edit file1.mp3')).toBeInTheDocument();
});

test('Calls the onClose handler after clicking on the close button', async () => {
    const handleClose = jest.fn();
    const { getByTestId } = render(
        <EditAudioFileContext.Provider value={{ audioFile }}>
            <EditDialog open handleClose={handleClose} />
        </EditAudioFileContext.Provider>,
    );

    fireEvent.click(getByTestId('close'));

    expect(handleClose).toBeCalled();
});
