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

    // Remove the tags of the sample file
    await NodeID3.Promise.removeTags(path.join(directory, 'name.mp3'));

    await setElectronDialogHandler(
        () => ({ canceled: false, filePaths: [directory] }),
        { directory },
    );

    await t.expect(screen.getByText('Open directory').exists).ok();

    await t.click('#open-button');
    await t.expect(screen.getByText('name.mp3').exists).ok();

    await t.click(screen.getByTestId('edit-name.mp3'));
    await t.expect(screen.getByText('Edit name.mp3').exists).ok();

    const input = screen.getByLabelText('Title');

    await t.typeText(input, 'File 1 - New');

    await t.click(screen.getByDisplayValue('Edit file'));

    await t.expect(screen.queryByText('Edit name.mp3').exists).notOk();

    await t.expect(screen.getByText('File 1 - New').exists).ok();
});
