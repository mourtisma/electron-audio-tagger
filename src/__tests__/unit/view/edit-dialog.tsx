import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import EditDialog from '@view/edit-dialog';
import AudioFile from '@model/audio-file';
import { EditAudioFileContext } from '@view/context';

test('Renders the data of a particular audio file and closes after edit', async () => {
    const audioFile: AudioFile = {
        name: 'file1.mp3',
        title: 'File 1',
        error: false,
    };
    const editAudioFile = jest.fn();
    const { getByText, getByLabelText, getByDisplayValue } = render(
        <EditAudioFileContext.Provider value={{ audioFile, editAudioFile }}>
            <EditDialog open handleClose={() => {}} />
        </EditAudioFileContext.Provider>,
    );

    expect(getByText('Edit file1.mp3')).toBeInTheDocument();
    const input = getByLabelText('Title') as HTMLInputElement;

    await act(async () => {
        fireEvent.change(input, { target: { value: 'File 1 - New' } });
    });

    await act(async () => {
        fireEvent.click(getByDisplayValue('Edit file'));
    });

    expect(editAudioFile).toBeCalled();
});

test('Calls the onClose handler after clicking on the close button', async () => {
    const audioFile: AudioFile = {
        name: 'file1.mp3',
        title: 'File 1',
        error: false,
    };
    const handleClose = jest.fn();
    const { getByTestId } = render(
        <EditAudioFileContext.Provider value={{ audioFile }}>
            <EditDialog open handleClose={handleClose} />
        </EditAudioFileContext.Provider>,
    );

    fireEvent.click(getByTestId('close'));

    expect(handleClose).toBeCalled();
});
