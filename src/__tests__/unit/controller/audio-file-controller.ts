import sinon from 'sinon';
import AudioFile from '@model/audio-file';
import AudioFileRepository from '@model/audio-file-repository';
import AudioFileController from '@controller/audio-file-controller';

describe('AudioFileController#openDirectory', () => {
    it('Uses the repository to return the ID3 tags of all the audio files in a directory', async () => {
        const directory: string = 'my-files/';

        sinon
            .stub(AudioFileRepository.prototype, 'getAll')
            .resolves([{ name: 'file.mp3', error: false }]);

        const audioFiles: AudioFile[] = await AudioFileController.openDirectory(
            directory,
        );

        expect(audioFiles).toHaveLength(1);
        expect(audioFiles[0]).toStrictEqual({ name: 'file.mp3', error: false });
    });
});

describe('AudioFileController#readFile', () => {
    it('Uses the repository to return the ID3 tags of a particular file', async () => {
        const directory: string = 'my-files/';
        const fileName: string = 'file1.mp3';

        sinon
            .stub(AudioFileRepository.prototype, 'getOne')
            .resolves({ name: 'file.mp3', error: false });

        const audioFile: AudioFile = await AudioFileController.readFile(
            directory,
            fileName,
        );

        expect(audioFile).toStrictEqual({ name: 'file.mp3', error: false });
    });
});

describe('AudioFileController#editFile', () => {
    beforeEach(() => {
        sinon.restore();
    });
    it('Uses the repository to update the ID3 tags of a particular file', async () => {
        const directory: string = 'my-files/';
        const fileName: string = 'file1.mp3';
        const audioFile: AudioFile = {
            name: 'file.mp3',
            title: 'File',
            error: false,
        };

        sinon
            .stub(AudioFileRepository.prototype, 'update')
            .resolves({ name: 'file.mp3', title: 'File', error: false });

        const newAudioFile: AudioFile = await AudioFileController.editFile(
            directory,
            fileName,
            audioFile,
        );

        expect(newAudioFile).toStrictEqual(audioFile);
    });

    it('Throws an error during the update the ID3 tags of a particular file if the repository throws an error', async () => {
        const directory: string = 'my-files/';
        const fileName: string = 'file1.mp3';
        const audioFile: AudioFile = {
            name: 'file.mp3',
            title: 'File',
            error: false,
        };

        sinon.stub(AudioFileRepository.prototype, 'update').throws(Error);

        await expect(() =>
            AudioFileController.editFile(directory, fileName, audioFile),
        ).rejects.toThrow(Error);
    });
});
