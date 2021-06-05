import 'testcafe';
import path from 'path';
import { setElectronDialogHandler } from 'testcafe-browser-provider-electron';
import { screen } from '@testing-library/testcafe';

fixture`Getting Started`.page(
    '../../../.webpack/renderer/main_window/index.html',
);

test('Main page', async (t) => {
    const directory = path.join(__dirname, 'audio-files');
    await setElectronDialogHandler(
        () => ({ canceled: false, filePaths: [directory] }),
        { directory },
    );

    await t.expect(screen.queryAllByText('Open directory').exists).ok();

    await t.click('#open-button');

    await t.expect(screen.queryAllByText('name.mp3').exists).ok();
});
