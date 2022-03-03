import sinon from 'sinon';
import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';

import MainContainer from '@view/main-container';

import AudioFileController from '@controller/audio-file-controller';

import AudioFile from '@model/audio-file';

import electronHelpers from '@helpers/electron';

import { audioFileFixtures } from '../audio-files-fixtures';

jest.mock('@helpers/electron', () => ({
    showOpenDialog: jest.fn(),
}));

afterEach(() => {
    sinon.restore();
});

test('Renders a grid with the audio files information and allows to edit files', async () => {
    render(<MainContainer />);
    const showOpenDialogSpy = jest.spyOn(electronHelpers, 'showOpenDialog');
    showOpenDialogSpy.mockImplementation(async () => ({
        filePaths: ['directory'],
        canceled: false,
    }));
    sinon
        .stub(AudioFileController, 'openDirectory')
        .resolves(audioFileFixtures);

    fireEvent.click(screen.getByText('Open directory'));

    expect(
        await screen.findByText('Selected directory: directory'),
    ).toBeInTheDocument();
    expect(await screen.findByText('file1.mp3')).toBeInTheDocument();
    expect(await screen.findByText('file2.wav')).toBeInTheDocument();

    expect(await screen.findByText('file2.mp3')).toBeInTheDocument();
    expect(await screen.findByTestId('error-file2.mp3')).toBeInTheDocument();
    fireEvent.mouseOver(await screen.findByTestId('error-file2.mp3'));
    expect(
        await screen.findByText('Error when reading this file'),
    ).toBeInTheDocument();

    expect(await screen.findByText('Change directory')).toBeInTheDocument();

    const audioFileMp3: AudioFile = audioFileFixtures[0];

    sinon.stub(AudioFileController, 'readFile').resolves(audioFileMp3);

    fireEvent.click(screen.getByTestId('edit-file1.mp3'));

    expect(await screen.findByText('Edit file1.mp3')).toBeInTheDocument();

    sinon.stub(AudioFileController, 'editFile').resolves({
        ...audioFileMp3,
        title: 'File 1 - New',
        trackPosition: 3,
        totalNumberOfTracks: 4,
    });

    fireEvent.click(screen.getByText('Edit file'));
    await waitFor(() => {
        expect(screen.queryByText('Edit file1.mp3')).not.toBeInTheDocument();
    });

    expect(screen.getByText('File 1 - New')).toBeInTheDocument();
    expect(screen.getByText('3/4')).toBeInTheDocument();
});

test('Shows an error message when the opening of the directory fails', async () => {
    render(<MainContainer />);
    const showOpenDialogSpy = jest.spyOn(electronHelpers, 'showOpenDialog');
    showOpenDialogSpy.mockImplementation(async () => ({
        filePaths: ['selectedDirectory'],
        canceled: false,
    }));
    sinon.stub(AudioFileController, 'openDirectory').throws(Error);

    fireEvent.click(screen.getByText('Open directory'));

    expect(
        await screen.findByText(
            'Error when opening directory selectedDirectory',
        ),
    ).toBeInTheDocument();
    expect(await screen.findByText('Change directory')).toBeInTheDocument();

    // Click outside the snackbar, to execute the onClose callback
    fireEvent.click(screen.getByText('Selected directory: selectedDirectory'));

    await waitFor(() => {
        expect(
            screen.queryByText(
                'Error when opening directory selectedDirectory',
            ),
        ).not.toBeInTheDocument();
    });
});

test('Does not render the grid when the user closes the open dialog', async () => {
    render(<MainContainer />);
    const showOpenDialogSpy = jest.spyOn(electronHelpers, 'showOpenDialog');
    showOpenDialogSpy.mockImplementation(async () => ({
        filePaths: [],
        canceled: true,
    }));

    fireEvent.click(screen.getByText('Open directory'));

    expect(await screen.findByText('Open directory')).toBeInTheDocument();
});

test('Proposes to change directory when a directory is selected and the new dialog is closed', async () => {
    render(<MainContainer />);
    const showOpenDialogSpy = jest.spyOn(electronHelpers, 'showOpenDialog');
    showOpenDialogSpy.mockImplementation(async () => ({
        filePaths: ['directory'],
        canceled: false,
    }));
    sinon
        .stub(AudioFileController, 'openDirectory')
        .resolves(audioFileFixtures);

    fireEvent.click(screen.getByText('Open directory'));
    expect(await screen.findByText('Change directory')).toBeInTheDocument();

    showOpenDialogSpy.mockImplementation(async () => ({
        filePaths: ['directory'],
        canceled: true,
    }));

    fireEvent.click(screen.getByText('Change directory'));
    expect(await screen.findByText('Change directory')).toBeInTheDocument();
});
