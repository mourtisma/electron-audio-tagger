import React from 'react';
import sinon from 'sinon';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';

import EditAudioFileForm from '@view/edit-audio-file-form';
import EditAudioFileContext from '@view/context';

import AudioFile from '@model/audio-file';

import { audioFileMp3 as audioFile } from '../audio-files-fixtures';

test('Fills the form with the data of a particular audio file', async () => {
    render(
        <EditAudioFileContext.Provider value={{ audioFile }}>
            <EditAudioFileForm />
        </EditAudioFileContext.Provider>,
    );
    const titleInput = screen.getByLabelText('Title') as HTMLInputElement;
    const artistInput = screen.getByLabelText('Artist') as HTMLInputElement;
    const albumInput = screen.getByLabelText('Album') as HTMLInputElement;
    const composerInput = screen.getByLabelText('Composer') as HTMLInputElement;
    const trackPositionInput = screen.getByLabelText(
        'Track position',
    ) as HTMLInputElement;
    const totalTracksInput = screen.getByLabelText(
        'Total tracks',
    ) as HTMLInputElement;

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
    render(
        <EditAudioFileContext.Provider
            value={{ audioFile: audioFileWithoutTags }}
        >
            <EditAudioFileForm />
        </EditAudioFileContext.Provider>,
    );

    const titleInput = screen.getByLabelText('Title') as HTMLInputElement;
    const artistInput = screen.getByLabelText('Artist') as HTMLInputElement;
    const albumInput = screen.getByLabelText('Album') as HTMLInputElement;
    const composerInput = screen.getByLabelText('Composer') as HTMLInputElement;
    const trackPositionInput = screen.getByLabelText(
        'Track position',
    ) as HTMLInputElement;
    const totalTracksInput = screen.getByLabelText(
        'Total tracks',
    ) as HTMLInputElement;

    expect(titleInput.value).toBe('');
    expect(artistInput.value).toBe('');
    expect(albumInput.value).toBe('');
    expect(composerInput.value).toBe('');
    expect(trackPositionInput.value).toBe('');
    expect(totalTracksInput.value).toBe('');
});

test('Calls the change and submit handlers when necessary', async () => {
    const editAudioFile = jest.fn();
    render(
        <EditAudioFileContext.Provider value={{ audioFile, editAudioFile }}>
            <EditAudioFileForm />
        </EditAudioFileContext.Provider>,
    );

    const titleInput = screen.getByLabelText('Title') as HTMLInputElement;
    const trackPositionInput = screen.getByLabelText(
        'Track position',
    ) as HTMLInputElement;
    const totalTracksInput = screen.getByLabelText(
        'Total tracks',
    ) as HTMLInputElement;

    fireEvent.change(titleInput, { target: { value: 'File 1 - New' } });

    fireEvent.change(trackPositionInput, { target: { value: '2' } });

    fireEvent.change(totalTracksInput, { target: { value: '' } });
    fireEvent.click(screen.getByText('Edit file'));

    await waitFor(() => {
        expect(editAudioFile).toBeCalledWith({
            ...audioFile,
            title: 'File 1 - New',
            trackPosition: 2,
            totalNumberOfTracks: undefined,
        });
    });
});

test('Shows an error if the track position is superior to the total number of tracks', async () => {
    const editAudioFile = jest.fn();
    render(
        <EditAudioFileContext.Provider value={{ audioFile, editAudioFile }}>
            <EditAudioFileForm />
        </EditAudioFileContext.Provider>,
    );

    const trackPositionInput = screen.getByLabelText(
        'Track position',
    ) as HTMLInputElement;
    const totalTracksInput = screen.getByLabelText(
        'Total tracks',
    ) as HTMLInputElement;

    fireEvent.change(trackPositionInput, { target: { value: '2' } });

    fireEvent.change(totalTracksInput, { target: { value: '1' } });

    await waitFor(() => {
        expect(
            screen.getAllByText(
                'The track position must be lower than the total number of tracks',
            ).length,
        ).toBe(2);
    });
});

test('Shows a snackbar if an error occurs when editing the file', async () => {
    const editAudioFile = sinon.stub();
    editAudioFile.throws('Error when editing file1.mp3');

    render(
        <EditAudioFileContext.Provider value={{ audioFile, editAudioFile }}>
            <EditAudioFileForm />
        </EditAudioFileContext.Provider>,
    );

    const input = screen.getByLabelText('Title') as HTMLInputElement;

    fireEvent.change(input, { target: { value: 'File 1 - New' } });

    fireEvent.click(screen.getByText('Edit file'));

    await waitFor(() => {
        expect(
            screen.getByText('Error when editing file1.mp3'),
        ).toBeInTheDocument();
    });

    // Click outside the snackbar, to execute the onClose callback
    fireEvent.click(screen.getByLabelText('Title'));

    await waitFor(() => {
        expect(
            screen.queryByText('Error when editing file1.mp3'),
        ).not.toBeInTheDocument();
    });
});
