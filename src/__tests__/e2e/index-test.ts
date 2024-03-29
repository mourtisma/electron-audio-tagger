import path from 'path';

import { ClientFunction } from 'testcafe';
import NodeID3 from 'node-id3';
import { setElectronDialogHandler } from 'testcafe-browser-provider-electron';
import { screen } from '@testing-library/testcafe';

const dir1 = path.join(__dirname, 'audio-files', 'dir1');
const dir2 = path.join(__dirname, 'audio-files', 'dir2');

const tagSampleFiles = async () => {
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
            title: 'Sample file OGG',
            artist: 'Sample artist OGG',
            album: 'Sample album OGG',
            composer: 'Sample composer OGG',
            trackNumber: '1/3',
        },
        path.join(dir1, 'sample-file-ogg.ogg'),
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
};

fixture`Getting Started`
    .page('../../../.webpack/renderer/main_window/index.html')
    .before(tagSampleFiles)
    .after(tagSampleFiles);

/**
 * If we use t.click() on the dialog close button, the dialog disappears, but the other DOM elements are not
 * clickable anymore. As a workaround, we use a testcafe ClientFunction which will trigger a regular click action
 *
 * Link to the issue: https://github.com/DevExpress/testcafe/issues/4146
 */
const clickCloseBtn = ClientFunction(() => {
    // eslint-disable-next-line testing-library/no-node-access
    (document.querySelector('#close-edit-dialog-btn') as HTMLElement).click();
});

test('Main page', async (t) => {
    // Open dir2
    await setElectronDialogHandler(
        () => ({ canceled: false, filePaths: [dir2] }),
        { dir2 },
    );

    await t.expect(screen.getByText('Open directory').exists).ok();

    await t
        .click(screen.getByText('Open directory'))
        .expect(screen.getByText('Change directory').exists)
        .ok()
        .expect(screen.getByText('sample-file-2.mp3').exists)
        .ok();

    // Open edit dialog
    await t
        .click(screen.getByTestId('edit-sample-file-2.mp3'))
        .expect(screen.getByText('Edit sample-file-2.mp3').exists)
        .ok();

    const titleInput = screen.getByLabelText('Title');
    const artistInput = screen.getByLabelText('Artist');
    const albumInput = screen.getByLabelText('Album');
    const composerInput = screen.getByLabelText('Composer');
    const trackPositionInput = screen.getByLabelText('Track position');
    const totalTracksInput = screen.getByLabelText('Total tracks');

    await t
        .expect(titleInput.value)
        .eql('Sample file 2')
        .expect(artistInput.value)
        .eql('Sample artist 2')
        .expect(albumInput.value)
        .eql('Sample album 2')
        .expect(composerInput.value)
        .eql('Sample composer 2')
        .expect(trackPositionInput.value)
        .eql('2')
        .expect(totalTracksInput.value)
        .eql('4');

    // Close dialog
    await clickCloseBtn();

    await setElectronDialogHandler(
        () => ({ canceled: false, filePaths: [dir1] }),
        { dir1 },
    );

    // Change directory
    await t
        .click(screen.getByText('Change directory'))
        .expect(screen.getByText('sample-file-1.mp3').exists)
        .ok()
        .expect(screen.getByText('sample-file-ogg.ogg').exists)
        .ok()
        .expect(screen.queryByText('hello-world.txt').exists)
        .notOk();

    // Open edit dialog
    await t
        .click(screen.getByTestId('edit-sample-file-1.mp3'))
        .expect(screen.getByText('Edit sample-file-1.mp3').exists)
        .ok()
        .expect(titleInput.value)
        .eql('Sample file 1')
        .expect(artistInput.value)
        .eql('Sample artist 1')
        .expect(albumInput.value)
        .eql('Sample album 1')
        .expect(composerInput.value)
        .eql('Sample composer 1')
        .expect(trackPositionInput.value)
        .eql('1')
        .expect(totalTracksInput.value)
        .eql('3');

    // Validation failure
    await t
        .typeText(titleInput, 'Sample File - New', { replace: true })
        .typeText(trackPositionInput, '4', { replace: true })
        .typeText(totalTracksInput, '2', { replace: true })
        .expect(
            screen.getAllByText(
                'The track position must be lower than the total number of tracks',
            ).exists,
        )
        .ok();

    // Submit failure
    await t
        .click(screen.getByText('Edit file'))
        .expect(screen.queryByText('Edit sample-file-1.mp3').exists)
        .ok();

    // Validation success
    await t
        .typeText(trackPositionInput, '2', { replace: true })
        .typeText(totalTracksInput, '4', { replace: true })
        .expect(
            screen.queryByText(
                'The track position must be lower than the total number of tracks',
            ).exists,
        )
        .notOk();

    // Submit success
    await t
        .click(screen.getByText('Edit file'))
        .expect(screen.queryByText('Edit sample-file-1.mp3').exists)
        .notOk()
        .expect(screen.getByText('Sample File - New').exists)
        .ok()
        .expect(screen.getByText('2/4').exists)
        .ok();
});
