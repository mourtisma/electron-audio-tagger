import React from 'react';
import sinon from 'sinon';
import { render, fireEvent, act } from '@testing-library/react';
import EditAudioFileForm from '@view/edit-audio-file-form';
import AudioFile from '@model/audio-file';
import EditAudioFileContext from '@view/context';
import { audioFileMp3 as audioFile } from '../audio-files-fixtures';

test('Fills the form with the data of a particular audio file', async () => {
    const { getByLabelText } = render(
        <EditAudioFileContext.Provider value={{ audioFile }}>
            <EditAudioFileForm />
        </EditAudioFileContext.Provider>,
    );
    const titleInput = getByLabelText('Title') as HTMLInputElement;
    const artistInput = getByLabelText('Artist') as HTMLInputElement;
    const albumInput = getByLabelText('Album') as HTMLInputElement;
    const composerInput = getByLabelText('Composer') as HTMLInputElement;
    const trackPositionInput = getByLabelText(
        'Track position',
    ) as HTMLInputElement;
    const totalTracksInput = getByLabelText('Total tracks') as HTMLInputElement;

    expect(titleInput.value).toBe('File 1');
    expect(artistInput.value).toBe('Artist 1');
    expect(albumInput.value).toBe('Album 1');
    expect(composerInput.value).toBe('Composer 1');
    expect(trackPositionInput.value).toBe('1');
    expect(totalTracksInput.value).toBe('3');
});

test('Fills the form with the data of a particular audio file without tags', async () => {
    const audioFileWithoutTags: AudioFile = {
        name: 'file1.mp3',
        error: false,
    };
    const { getByLabelText } = render(
        <EditAudioFileContext.Provider
            value={{ audioFile: audioFileWithoutTags }}
        >
            <EditAudioFileForm />
        </EditAudioFileContext.Provider>,
    );

    const titleInput = getByLabelText('Title') as HTMLInputElement;
    const artistInput = getByLabelText('Artist') as HTMLInputElement;
    const albumInput = getByLabelText('Album') as HTMLInputElement;
    const composerInput = getByLabelText('Composer') as HTMLInputElement;
    const trackPositionInput = getByLabelText(
        'Track position',
    ) as HTMLInputElement;
    const totalTracksInput = getByLabelText('Total tracks') as HTMLInputElement;

    expect(titleInput.value).toBe('');
    expect(artistInput.value).toBe('');
    expect(albumInput.value).toBe('');
    expect(composerInput.value).toBe('');
    expect(trackPositionInput.value).toBe('');
    expect(totalTracksInput.value).toBe('');
});

test('Calls the change and submit handlers when necessary', async () => {
    const editAudioFile = jest.fn();
    const { getByLabelText, getByText } = render(
        <EditAudioFileContext.Provider value={{ audioFile, editAudioFile }}>
            <EditAudioFileForm />
        </EditAudioFileContext.Provider>,
    );

    const titleInput = getByLabelText('Title') as HTMLInputElement;
    const trackPositionInput = getByLabelText(
        'Track position',
    ) as HTMLInputElement;
    const totalTracksInput = getByLabelText('Total tracks') as HTMLInputElement;

    await act(async () => {
        fireEvent.change(titleInput, { target: { value: 'File 1 - New' } });
    });
    await act(async () => {
        fireEvent.change(trackPositionInput, { target: { value: '2' } });
    });
    await act(async () => {
        fireEvent.change(totalTracksInput, { target: { value: '' } });
    });

    await act(async () => {
        fireEvent.click(getByText('Edit file'));
    });

    expect(editAudioFile).toBeCalledWith({
        ...audioFile,
        title: 'File 1 - New',
        trackPosition: 2,
        totalNumberOfTracks: undefined,
    });
});

test('Shows an error if the track position is superior to the total number of tracks', async () => {
    const editAudioFile = jest.fn();
    const { getByLabelText, getAllByText } = render(
        <EditAudioFileContext.Provider value={{ audioFile, editAudioFile }}>
            <EditAudioFileForm />
        </EditAudioFileContext.Provider>,
    );

    const trackPositionInput = getByLabelText(
        'Track position',
    ) as HTMLInputElement;
    const totalTracksInput = getByLabelText('Total tracks') as HTMLInputElement;

    await act(async () => {
        fireEvent.change(trackPositionInput, { target: { value: '2' } });
    });
    await act(async () => {
        fireEvent.change(totalTracksInput, { target: { value: '1' } });
    });

    expect(
        getAllByText(
            'The track position must be lower than the total number of tracks',
        ).length,
    ).toBe(2);
});

test('Shows a snackbar if an error occurs when editing the file', async () => {
    const editAudioFile = sinon.stub();
    editAudioFile.throws('Error when editing file1.mp3');

    const { getByLabelText, getByText } = render(
        <EditAudioFileContext.Provider value={{ audioFile, editAudioFile }}>
            <EditAudioFileForm />
        </EditAudioFileContext.Provider>,
    );

    const input = getByLabelText('Title') as HTMLInputElement;

    await act(async () => {
        fireEvent.change(input, { target: { value: 'File 1 - New' } });
    });

    await act(async () => {
        fireEvent.click(getByText('Edit file'));
    });

    expect(getByText('Error when editing file1.mp3')).toBeInTheDocument();

    // Click outside the snackbar, to execute the onClose callback
    fireEvent.click(getByLabelText('Title'));

    // With RTL, the snackbar is still present in the DOM, whereas it shouldn't be
    // => For the moment, it's impossible to add an expect statement
});
