import sinon from 'sinon';
import React from 'react';
import { render, fireEvent, act } from '@testing-library/react';
import AudioFileController from '@controller/audio-file-controller';
import helpers from '@view/electron-helpers';
import MainContainer from '@view/main-container';
import { audioFileMp3, audioFileWithError } from '../audio-files-fixtures';

jest.mock('@view/electron-helpers', () => ({
    showOpenDialog: jest.fn(),
}));

afterEach(() => {
    sinon.restore();
});

test('Renders a grid with the audio files information', async () => {
    const {
        getByText,
        getByDisplayValue,
        findByText,
        findByTestId,
        getByTestId,
        queryByText,
    } = render(<MainContainer />);
    const showOpenDialogSpy = jest.spyOn(helpers, 'showOpenDialog');
    showOpenDialogSpy.mockImplementation(async () => ({
        filePaths: ['directory'],
        canceled: false,
    }));
    sinon
        .stub(AudioFileController, 'openDirectory')
        .resolves([audioFileMp3, audioFileWithError]);

    fireEvent.click(getByText('Open directory'));

    expect(
        await findByText('Selected directory: directory'),
    ).toBeInTheDocument();
    expect(await findByText('file1.mp3')).toBeInTheDocument();

    expect(await findByText('file2.mp3')).toBeInTheDocument();
    expect(await findByTestId('error-file2.mp3')).toBeInTheDocument();
    fireEvent.mouseOver(await findByTestId('error-file2.mp3'));
    expect(
        await findByText('Error when reading this file'),
    ).toBeInTheDocument();

    expect(await findByText('Change directory')).toBeInTheDocument();

    sinon.stub(AudioFileController, 'readFile').resolves(audioFileMp3);

    fireEvent.click(getByTestId('edit-file1.mp3'));

    expect(await findByText('Edit file1.mp3')).toBeInTheDocument();

    sinon
        .stub(AudioFileController, 'editFile')
        .resolves({ ...audioFileMp3, title: 'File 1 - New' });

    await act(async () => {
        fireEvent.click(getByDisplayValue('Edit file'));
    });
    expect(queryByText('Edit file1.mp3')).not.toBeInTheDocument();

    expect(getByText('File 1 - New')).toBeInTheDocument();
});

test('Shows an error message when the opening of the directory fails', async () => {
    const { getByText, findByText } = render(<MainContainer />);
    const showOpenDialogSpy = jest.spyOn(helpers, 'showOpenDialog');
    showOpenDialogSpy.mockImplementation(async () => ({
        filePaths: ['selectedDirectory'],
        canceled: false,
    }));
    sinon.stub(AudioFileController, 'openDirectory').throws(Error);

    fireEvent.click(getByText('Open directory'));

    expect(
        await findByText('Error when opening directory selectedDirectory'),
    ).toBeInTheDocument();
    expect(await findByText('Change directory')).toBeInTheDocument();

    // Click outside the snackbar, to execute the onClose callback
    fireEvent.click(getByText('Selected directory: selectedDirectory'));

    // With RTL, the snackbar is still present in the DOM, whereas it shouldn't be
    // => For the moment, it's impossible to add an expect statement
});

test('Does not render the grid when the user closes the open dialog', async () => {
    const { getByText, findByText } = render(<MainContainer />);
    const showOpenDialogSpy = jest.spyOn(helpers, 'showOpenDialog');
    showOpenDialogSpy.mockImplementation(async () => ({
        filePaths: [],
        canceled: true,
    }));

    fireEvent.click(getByText('Open directory'));

    expect(await findByText('Open directory')).toBeInTheDocument();
});

test('Proposes to change directory when a directory is selected and the new dialog is closed', async () => {
    const { getByText, findByText } = render(<MainContainer />);
    const showOpenDialogSpy = jest.spyOn(helpers, 'showOpenDialog');
    showOpenDialogSpy.mockImplementation(async () => ({
        filePaths: ['directory'],
        canceled: false,
    }));
    sinon
        .stub(AudioFileController, 'openDirectory')
        .resolves([audioFileMp3, audioFileWithError]);

    fireEvent.click(getByText('Open directory'));
    expect(await findByText('Change directory')).toBeInTheDocument();

    showOpenDialogSpy.mockImplementation(async () => ({
        filePaths: ['directory'],
        canceled: true,
    }));

    fireEvent.click(getByText('Change directory'));
    expect(await findByText('Change directory')).toBeInTheDocument();
});
