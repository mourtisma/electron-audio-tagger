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
        expect(audioFiles[0].name).toBe('file.mp3');
        expect(audioFiles[0].error).toBeFalsy();
    });
});
