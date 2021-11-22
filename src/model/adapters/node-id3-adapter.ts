import NodeID3 from 'node-id3';
import { readdir } from 'fs/promises';
import path from 'path';
import AudioFile from '../audio-file';
import GenericAdapter from './generic-adapter';

export default class NodeID3Adapter implements GenericAdapter {
    extensions = new Set<string>(['.mp3', '.wav']);

    private static toAudioFile(
        name: string,
        tags: NodeID3.Tags,
        error: boolean,
    ): AudioFile {
        let result: AudioFile = { name, error };
        if (tags) {
            const { title } = tags;
            result = { title, ...result };
        }

        return result;
    }

    private static async readAudioFile(
        directory: string,
        fileName: string,
    ): Promise<AudioFile> {
        let error: boolean = false;
        let tags: NodeID3.Tags;
        try {
            tags = await NodeID3.Promise.read(path.join(directory, fileName));
        } catch (e) {
            error = true;
        }
        return NodeID3Adapter.toAudioFile(fileName, tags, error);
    }

    private async getAudioFilesFromDirectory(
        directory: string,
    ): Promise<string[]> {
        const files: string[] = await readdir(directory);

        return files.filter((f) =>
            this.extensions.has(path.extname(f).toLowerCase()),
        );
    }

    async getAll(directory: string): Promise<AudioFile[]> {
        let fileNames: string[] = [];
        try {
            fileNames = await this.getAudioFilesFromDirectory(directory);
        } catch (error) {
            throw new Error(
                `There was an error reading directory ${directory}`,
            );
        }

        return Promise.all(
            fileNames.map((fileName) =>
                NodeID3Adapter.readAudioFile(directory, fileName),
            ),
        );
    }

    async getOne(directory: string, fileName: string): Promise<AudioFile> {
        return NodeID3Adapter.readAudioFile(directory, fileName);
    }
}
