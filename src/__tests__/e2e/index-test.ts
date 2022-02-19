import 'testcafe';
import NodeID3 from 'node-id3';
import path from 'path';
import { setElectronDialogHandler } from 'testcafe-browser-provider-electron';
import { screen } from '@testing-library/testcafe';

fixture`Getting Started`.page(
    '../../../.webpack/renderer/main_window/index.html',
);

test('Main page', async (t) => {
    const directory = path.join(__dirname, 'audio-files');

    // Set the tags of the sample file
    await NodeID3.Promise.update(
        {
            title: 'Sample File',
            artist: 'Sample artist',
            album: 'Sample album',
            composer: 'Sample composer',
            trackNumber: '1/3',
        },
        path.join(directory, 'sample-file.mp3'),
    );

    await setElectronDialogHandler(
        () => ({ canceled: false, filePaths: [directory] }),
        { directory },
    );

    await t.expect(screen.getByText('Open directory').exists).ok();

    await t.click('#open-button');
    await t.expect(screen.getByText('sample-file.mp3').exists).ok();

    await t.click(screen.getByTestId('edit-sample-file.mp3'));
    await t.expect(screen.getByText('Edit sample-file.mp3').exists).ok();

    const titleInput = screen.getByLabelText('Title');
    const trackPositionInput = screen.getByLabelText('Track position');
    const totalTracksInput = screen.getByLabelText('Total tracks');

    await t.typeText(titleInput, 'Sample File - New', { replace: true });
    await t.typeText(trackPositionInput, '2', { replace: true });
    await t.typeText(totalTracksInput, '4', { replace: true });

    await t.click(screen.getByDisplayValue('Edit file'));

    await t.expect(screen.queryByText('Edit sample-file.mp3').exists).notOk();

    await t.expect(screen.getByText('Sample File - New').exists).ok();
    await t.expect(screen.getByText('2/4').exists).ok();
});
