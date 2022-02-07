import GenericAdapter from './adapters/generic-adapter';
import AudioFile from './audio-file';

export default class AudioFileRepository {
    private adapter: GenericAdapter;

    constructor(adapter: GenericAdapter) {
        this.adapter = adapter;
    }

    async getAll(directory: string): Promise<AudioFile[]> {
        return this.adapter.getAll(directory);
    }

    async getOne(directory: string, fileName: string): Promise<AudioFile> {
        return this.adapter.getOne(directory, fileName);
    }

    async update(
        directory: string,
        fileName: string,
        newAudioFile: AudioFile,
    ): Promise<AudioFile> {
        return this.adapter.update(directory, fileName, newAudioFile);
    }
}
