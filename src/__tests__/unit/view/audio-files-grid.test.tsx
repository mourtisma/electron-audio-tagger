import React from 'react';
import { render, screen } from '@testing-library/react';

import AudioFilesGrid from '@view/audio-files-grid';

import { audioFileFixtures } from '../audio-files-fixtures';

test('Renders a grid with the audio files information', async () => {
    render(
        <AudioFilesGrid
            audioFiles={audioFileFixtures}
            onFileSelect={() => {}}
            selectedDirectory="directory"
        />,
    );

    expect(screen.getByText('file1.mp3')).toBeInTheDocument();
    expect(screen.getByText('File 1')).toBeInTheDocument();
    expect(screen.getByText('Artist 1')).toBeInTheDocument();
    expect(screen.getByText('Album 1')).toBeInTheDocument();
    expect(screen.getByText('Composer 1')).toBeInTheDocument();
    expect(screen.getByText('1/3')).toBeInTheDocument();

    expect(screen.getByText('file2.mp3')).toBeInTheDocument();
    expect(screen.getByText('File 2')).toBeInTheDocument();
    expect(screen.getByText('Artist 2')).toBeInTheDocument();
    expect(screen.getByText('Album 2')).toBeInTheDocument();
    expect(screen.getByText('Composer 2')).toBeInTheDocument();
    expect(screen.getByText('2/4')).toBeInTheDocument();

    expect(screen.getByText('file2.mp3')).toBeInTheDocument();
    expect(screen.getByTestId('error-file2.mp3')).toBeInTheDocument();
    expect(screen.getByTestId('edit-file1.mp3')).toBeInTheDocument();
    expect(screen.getByTestId('edit-file2.mp3')).toBeInTheDocument();
});
