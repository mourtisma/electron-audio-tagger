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

    await t.expect(screen.getByText('Open directory').exists).ok();

    await t.click('#open-button');
    await t.expect(screen.queryAllByText('name.mp3').exists).ok();

    await t.click(screen.getByTestId('edit-name.mp3'));
    await t.expect(screen.queryAllByText('Edit name.mp3').exists).ok();

    const input = screen.getByLabelText('Title');

    await t.typeText(input, 'File 1 - New');

    await t.click(screen.getByDisplayValue('Edit file'));

    await t.expect(screen.queryAllByText('Edit name.mp3').exists).notOk();
});
