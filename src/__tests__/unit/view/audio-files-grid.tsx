import React from 'react';
import { render } from '@testing-library/react';
import AudioFilesGrid from '@view/audio-files-grid';
import AudioFile from '@model/audio-file';

test('Renders a grid with the audio files information', async () => {
    const audioFiles: AudioFile[] = [
        { name: 'file1.mp3', title: 'File 1', error: false },
        { name: 'file2.mp3', error: true },
    ];
    const { getByText } = render(<AudioFilesGrid audioFiles={audioFiles} />);

    expect(getByText('file1.mp3')).toBeInTheDocument();
    expect(getByText('File 1')).toBeInTheDocument();
    expect(getByText('file2.mp3')).toBeInTheDocument();
    expect(getByText('Error')).toBeInTheDocument();
});
