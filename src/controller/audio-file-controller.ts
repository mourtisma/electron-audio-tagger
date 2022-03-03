import AudioFileRepository from '@model/audio-file-repository';
import NodeID3Adapter from '@model/adapters/node-id3-adapter';
import AudioFile from '@model/audio-file';

class AudioFileController {
    private audioFileRepository: AudioFileRepository;

    constructor(audioFileRepository: AudioFileRepository) {
        this.audioFileRepository = audioFileRepository;
    }

    async openDirectory(directory: string): Promise<AudioFile[]> {
        return this.audioFileRepository.getAll(directory);
    }

    async readFile(directory: string, fileName: string): Promise<AudioFile> {
        return this.audioFileRepository.getOne(directory, fileName);
    }

    async editFile(
        directory: string,
        fileName: string,
        newAudioFile: AudioFile,
    ): Promise<AudioFile> {
        return this.audioFileRepository.update(
            directory,
            fileName,
            newAudioFile,
        );
    }
}

const audioFileController = new AudioFileController(
    new AudioFileRepository(new NodeID3Adapter()),
);

export default {
    openDirectory: (directory: string): Promise<AudioFile[]> =>
        audioFileController.openDirectory(directory),

    readFile: (directory: string, fileName: string): Promise<AudioFile> =>
        audioFileController.readFile(directory, fileName),

    editFile: (directory: string, fileName: string, newAudioFile: AudioFile) =>
        audioFileController.editFile(directory, fileName, newAudioFile),
};
