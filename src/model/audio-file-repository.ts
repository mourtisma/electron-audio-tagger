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
}
