import React from 'react';
import { render } from '@testing-library/react';
import EditDialog from '@view/edit-dialog';
import AudioFile from '@model/audio-file';

test('Renders the data of a particular audio file', async () => {
    const audioFile: AudioFile = {
        name: 'file1.mp3',
        title: 'File 1',
        error: false,
    };
    const { getByText } = render(
        <EditDialog audioFile={audioFile} open handleClose={() => {}} />,
    );

    expect(getByText('Edit file1.mp3')).toBeInTheDocument();
    expect(getByText('Title: File 1')).toBeInTheDocument();
});

test('Renders the data of a particular audio file without title', async () => {
    const audioFile: AudioFile = { name: 'file1.mp3', error: false };
    const { getByText } = render(
        <EditDialog audioFile={audioFile} open handleClose={() => {}} />,
    );

    expect(getByText('Edit file1.mp3')).toBeInTheDocument();
    expect(getByText('Title:')).toBeInTheDocument();
});
