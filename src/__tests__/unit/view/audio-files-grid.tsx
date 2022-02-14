import React from 'react';
import { render } from '@testing-library/react';
import AudioFilesGrid from '@view/audio-files-grid';
import { audioFileMp3, audioFileWithError } from '../audio-files-fixtures';

test('Renders a grid with the audio files information', async () => {
    const { getByText, getByTestId } = render(
        <AudioFilesGrid
            audioFiles={[audioFileMp3, audioFileWithError]}
            onFileSelect={() => {}}
        />,
    );

    expect(getByText('file1.mp3')).toBeInTheDocument();
    expect(getByText('File 1')).toBeInTheDocument();
    expect(getByText('file2.mp3')).toBeInTheDocument();
    expect(getByTestId('error-file2.mp3')).toBeInTheDocument();
    expect(getByTestId('edit-file1.mp3')).toBeInTheDocument();
    expect(getByTestId('edit-file2.mp3')).toBeInTheDocument();
});
