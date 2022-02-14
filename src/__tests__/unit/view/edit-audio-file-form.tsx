import React from 'react';
import sinon from 'sinon';
import { render, fireEvent, act } from '@testing-library/react';
import EditAudioFileForm from '@view/edit-audio-file-form';
import AudioFile from '@model/audio-file';
import { EditAudioFileContext } from '@view/context';
import { audioFileMp3 as audioFile } from '../audio-files-fixtures';

test('Fills the form with the data of a particular audio file', async () => {
    const { getByLabelText } = render(
        <EditAudioFileContext.Provider value={{ audioFile }}>
            <EditAudioFileForm />
        </EditAudioFileContext.Provider>,
    );
    const input = getByLabelText('Title') as HTMLInputElement;

    expect(input.value).toBe('File 1');
});

test('Fills the form with the data of a particular audio file without title', async () => {
    const audioFileWithoutTitle: AudioFile = {
        name: 'file1.mp3',
        error: false,
    };
    const { getByLabelText } = render(
        <EditAudioFileContext.Provider
            value={{ audioFile: audioFileWithoutTitle }}
        >
            <EditAudioFileForm />
        </EditAudioFileContext.Provider>,
    );

    const input = getByLabelText('Title') as HTMLInputElement;

    expect(input.value).toBe('');
});

test('Calls the change and submit handlers when necessary', async () => {
    const editAudioFile = jest.fn();
    const { getByLabelText, getByDisplayValue } = render(
        <EditAudioFileContext.Provider value={{ audioFile, editAudioFile }}>
            <EditAudioFileForm />
        </EditAudioFileContext.Provider>,
    );

    const input = getByLabelText('Title') as HTMLInputElement;

    await act(async () => {
        fireEvent.change(input, { target: { value: 'File 1 - New' } });
    });

    await act(async () => {
        fireEvent.click(getByDisplayValue('Edit file'));
    });

    expect(editAudioFile).toBeCalledWith({
        ...audioFile,
        title: 'File 1 - New',
    });
});

test('Shows a snackbar if an error occurs when editing the file', async () => {
    const editAudioFile = sinon.stub();
    editAudioFile.throws();

    const { getByLabelText, getByDisplayValue, getByText } = render(
        <EditAudioFileContext.Provider value={{ audioFile, editAudioFile }}>
            <EditAudioFileForm />
        </EditAudioFileContext.Provider>,
    );

    const input = getByLabelText('Title') as HTMLInputElement;

    await act(async () => {
        fireEvent.change(input, { target: { value: 'File 1 - New' } });
    });

    await act(async () => {
        fireEvent.click(getByDisplayValue('Edit file'));
    });

    expect(getByText('Error when editing file1.mp3')).toBeInTheDocument();

    // Click outside the snackbar, to execute the onClose callback
    fireEvent.click(getByLabelText('Title'));

    // With RTL, the snackbar is still present in the DOM, whereas it shouldn't be
    // => For the moment, it's impossible to add an expect statement
});
