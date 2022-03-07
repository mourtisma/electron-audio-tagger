import sinon from 'sinon';

import AudioFileController from '@controller/audio-file-controller';

import AudioFile from '@model/audio-file';
import AudioFileRepository from '@model/audio-file-repository';

import { audioFileMp3, audioFileWav } from '../audio-files-fixtures';

describe('AudioFileController#openDirectory', () => {
    it('Uses the repository to return the ID3 tags of all the audio files in a directory', async () => {
        const directory: string = 'my-files/';

        sinon
            .stub(AudioFileRepository.prototype, 'getAll')
            .resolves([audioFileMp3, audioFileWav]);

        const audioFiles: AudioFile[] = await AudioFileController.openDirectory(
            directory,
        );

        expect(audioFiles).toHaveLength(2);
        expect(audioFiles[0]).toStrictEqual(audioFileMp3);
        expect(audioFiles[1]).toStrictEqual(audioFileWav);
    });
});

describe('AudioFileController#readFile', () => {
    it('Uses the repository to return the ID3 tags of a particular file', async () => {
        const directory: string = 'my-files/';
        const fileName: string = 'file1.mp3';

        sinon
            .stub(AudioFileRepository.prototype, 'getOne')
            .resolves(audioFileMp3);

        const audioFile: AudioFile = await AudioFileController.readFile(
            directory,
            fileName,
        );

        expect(audioFile).toStrictEqual(audioFileMp3);
    });
});

describe('AudioFileController#editFile', () => {
    beforeEach(() => {
        sinon.restore();
    });
    it('Uses the repository to update the ID3 tags of a particular file', async () => {
        const directory: string = 'my-files/';
        const fileName: string = 'file1.mp3';

        sinon
            .stub(AudioFileRepository.prototype, 'update')
            .resolves(audioFileMp3);

        const newAudioFile: AudioFile = await AudioFileController.editFile(
            directory,
            fileName,
            audioFileMp3,
        );

        expect(newAudioFile).toStrictEqual(audioFileMp3);
    });

    it('Throws an error during the update the ID3 tags of a particular file if the repository throws an error', async () => {
        const directory: string = 'my-files/';
        const fileName: string = 'file1.mp3';

        sinon.stub(AudioFileRepository.prototype, 'update').throws(Error);

        await expect(() =>
            AudioFileController.editFile(directory, fileName, audioFileMp3),
        ).rejects.toThrow(Error);
    });
});
