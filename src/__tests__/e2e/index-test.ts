import 'testcafe';
import NodeID3 from 'node-id3';
import path from 'path';
import { setElectronDialogHandler } from 'testcafe-browser-provider-electron';
import { screen } from '@testing-library/testcafe';

fixture`Getting Started`.page(
    '../../../.webpack/renderer/main_window/index.html',
);

test('Main page', async (t) => {
    const dir1 = path.join(__dirname, 'audio-files', 'dir1');
    const dir2 = path.join(__dirname, 'audio-files', 'dir2');

    // Set the tags of the sample files
    await NodeID3.Promise.update(
        {
            title: 'Sample file 1',
            artist: 'Sample artist 1',
            album: 'Sample album 1',
            composer: 'Sample composer 1',
            trackNumber: '1/3',
        },
        path.join(dir1, 'sample-file-1.mp3'),
    );

    await NodeID3.Promise.update(
        {
            title: 'Sample file 2',
            artist: 'Sample artist 2',
            album: 'Sample album 2',
            composer: 'Sample composer 2',
            trackNumber: '2/4',
        },
        path.join(dir2, 'sample-file-2.mp3'),
    );

    // Open dir2
    await setElectronDialogHandler(
        () => ({ canceled: false, filePaths: [dir2] }),
        { dir2 },
    );

    await t.expect(screen.getByText('Open directory').exists).ok();

    await t.click(screen.getByText('Open directory'));
    await t.expect(screen.getByText('Change directory').exists).ok();
    await t.expect(screen.getByText('sample-file-2.mp3').exists).ok();

    // Open edit dialog
    await t.click(screen.getByTestId('edit-sample-file-2.mp3'));
    await t.expect(screen.getByText('Edit sample-file-2.mp3').exists).ok();

    const titleInput = screen.getByLabelText('Title');
    const artistInput = screen.getByLabelText('Artist');
    const albumInput = screen.getByLabelText('Album');
    const composerInput = screen.getByLabelText('Composer');
    const trackPositionInput = screen.getByLabelText('Track position');
    const totalTracksInput = screen.getByLabelText('Total tracks');

    await t.expect(titleInput.value).eql('Sample file 2');
    await t.expect(artistInput.value).eql('Sample artist 2');
    await t.expect(albumInput.value).eql('Sample album 2');
    await t.expect(composerInput.value).eql('Sample composer 2');
    await t.expect(trackPositionInput.value).eql('2');
    await t.expect(totalTracksInput.value).eql('4');

    // Close dialogy
    await t.click(screen.getByTestId('close'));

    // Change directory
    await setElectronDialogHandler(
        () => ({ canceled: false, filePaths: [dir1] }),
        { dir1 },
    );
    await t.click(screen.getByText('Change directory'));
    await t.wait(1000);
    await t.expect(screen.getByText('sample-file-1.mp3').exists).ok();

    // Open edit dialog
    await t.click(screen.getByTestId('edit-sample-file-1.mp3'));
    await t.expect(screen.getByText('Edit sample-file-1.mp3').exists).ok();

    await t.expect(titleInput.value).eql('Sample file 1');
    await t.expect(artistInput.value).eql('Sample artist 1');
    await t.expect(albumInput.value).eql('Sample album 1');
    await t.expect(composerInput.value).eql('Sample composer 1');
    await t.expect(trackPositionInput.value).eql('1');
    await t.expect(totalTracksInput.value).eql('3');

    // Validation failure
    await t.typeText(titleInput, 'Sample File - New', { replace: true });
    await t.typeText(trackPositionInput, '4', { replace: true });
    await t.typeText(totalTracksInput, '2', { replace: true });

    await t
        .expect(
            screen.getAllByText(
                'The track position must be lower than the total number of tracks',
            ).exists,
        )
        .ok();

    // Submit failure
    await t.click(screen.getByDisplayValue('Edit file'));

    await t.expect(screen.queryByText('Edit sample-file-1.mp3').exists).ok();

    // Validation success
    await t.typeText(trackPositionInput, '2', { replace: true });
    await t.typeText(totalTracksInput, '4', { replace: true });

    // Submit success
    await t.click(screen.getByDisplayValue('Edit file'));

    await t.expect(screen.queryByText('Edit sample-file-1.mp3').exists).notOk();

    await t.expect(screen.getByText('Sample File - New').exists).ok();
    await t.expect(screen.getByText('2/4').exists).ok();
});
