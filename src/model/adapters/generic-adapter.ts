import AudioFile from '../audio-file';

export default interface GenericAdapter {
    getAll(directory: string): Promise<AudioFile[]>;
}
