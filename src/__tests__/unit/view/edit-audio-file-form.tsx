import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import EditAudioFileForm from '@view/edit-audio-file-form';
import AudioFile from '@model/audio-file';

test('Fills the form with the data of a particular audio file', async () => {
    const audioFile: AudioFile = {
        name: 'file1.mp3',
        title: 'File 1',
        error: false,
    };
    const { getByLabelText } = render(
        <EditAudioFileForm
            handleChange={() => {}}
            audioFileValues={audioFile}
            onSubmit={jest.fn()}
        />,
    );
    const input = getByLabelText('Title') as HTMLInputElement;

    expect(input.value).toBe('File 1');
});

test('Fills the form with the data of a particular audio file without title', async () => {
    const audioFile: AudioFile = { name: 'file1.mp3', error: false };
    const { getByLabelText } = render(
        <EditAudioFileForm
            handleChange={() => {}}
            audioFileValues={audioFile}
            onSubmit={jest.fn()}
        />,
    );

    const input = getByLabelText('Title') as HTMLInputElement;

    expect(input.value).toBe('');
});

test('Calls the change and submit handlers when necessary', async () => {
    const audioFile: AudioFile = {
        name: 'file1.mp3',
        title: 'File 1',
        error: false,
    };
    const onSubmit = jest.fn();
    const handleChange = jest.fn();
    const { getByLabelText, getByDisplayValue } = render(
        <EditAudioFileForm
            handleChange={handleChange}
            audioFileValues={audioFile}
            onSubmit={onSubmit}
        />,
    );

    const input = getByLabelText('Title') as HTMLInputElement;

    await act(async () => {
        fireEvent.change(input, { target: { value: 'File 1 - New' } });
    });

    await act(async () => {
        fireEvent.click(getByDisplayValue('Edit file'));
    });

    expect(onSubmit).toBeCalled();
    expect(handleChange).toBeCalled();
});
