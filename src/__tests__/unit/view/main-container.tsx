import sinon from 'sinon';
import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import AudioFileController from '@controller/audio-file-controller';
import helpers from '@view/electron-helpers';
import MainContainer from '@view/main-container';

jest.mock('@view/electron-helpers', () => ({
    showOpenDialog: jest.fn(),
}));

afterEach(() => {
    sinon.restore();
});

test('Renders a grid with the audio files information', async () => {
    const { getByText, findByText, findByTestId } = render(<MainContainer />);
    const showOpenDialogSpy = jest.spyOn(helpers, 'showOpenDialog');
    showOpenDialogSpy.mockImplementation(async () => ({
        filePaths: ['directory'],
        canceled: false,
    }));
    sinon.stub(AudioFileController, 'openDirectory').resolves([
        { name: 'file1.mp3', error: false },
        { name: 'file2.mp3', error: true },
    ]);

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
