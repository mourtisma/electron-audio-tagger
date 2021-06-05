import Electron from 'electron';
import { dialog } from '@electron/remote';

export default {
    showOpenDialog: (): Promise<Electron.OpenDialogReturnValue> =>
        dialog.showOpenDialog({
            title: 'Open directory',
            properties: ['openDirectory'],
        }),
};
