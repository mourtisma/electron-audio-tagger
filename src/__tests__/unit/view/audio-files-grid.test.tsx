import React from 'react';
import { render } from '@testing-library/react';

import AudioFilesGrid from '@view/audio-files-grid';

import { audioFileFixtures } from '../audio-files-fixtures';

test('Renders a grid with the audio files information', async () => {
    const { getByText, getByTestId } = render(
        <AudioFilesGrid
            audioFiles={audioFileFixtures}
            onFileSelect={() => {}}
            selectedDirectory="directory"
        />,
    );

    expect(getByText('file1.mp3')).toBeInTheDocument();
    expect(getByText('File 1')).toBeInTheDocument();
    expect(getByText('Artist 1')).toBeInTheDocument();
    expect(getByText('Album 1')).toBeInTheDocument();
    expect(getByText('Composer 1')).toBeInTheDocument();
    expect(getByText('1/3')).toBeInTheDocument();

    expect(getByText('file2.mp3')).toBeInTheDocument();
    expect(getByText('File 2')).toBeInTheDocument();
    expect(getByText('Artist 2')).toBeInTheDocument();
    expect(getByText('Album 2')).toBeInTheDocument();
    expect(getByText('Composer 2')).toBeInTheDocument();
    expect(getByText('2/4')).toBeInTheDocument();

    expect(getByText('file2.mp3')).toBeInTheDocument();
    expect(getByTestId('error-file2.mp3')).toBeInTheDocument();
    expect(getByTestId('edit-file1.mp3')).toBeInTheDocument();
    expect(getByTestId('edit-file2.mp3')).toBeInTheDocument();
});
