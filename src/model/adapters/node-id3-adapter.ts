import NodeID3 from 'node-id3';
import { readdir } from 'fs/promises';
import path from 'path';
import {
    parseTrackNumber,
    getTrackNumber,
    verifyTrackNumber,
} from '@helpers/node-id3';
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
            const { title, artist, album, composer, trackNumber } = tags;
            const [trackPosition, totalNumberOfTracks] = parseTrackNumber(
                trackNumber,
            );
            result = {
                title,
                artist,
                album,
                composer,
                trackPosition,
                totalNumberOfTracks,
                ...result,
            };
        }

        return result;
    }

    private static toNodeID3Tags(audioFile: AudioFile): NodeID3.Tags {
        const {
            title,
            artist,
            album,
            composer,
            trackPosition,
            totalNumberOfTracks,
        } = audioFile;
        const trackNumber: string = getTrackNumber(
            trackPosition,
            totalNumberOfTracks,
        );
        return { title, artist, album, composer, trackNumber };
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
        console.log(directory);
        let fileNames: string[] = [];
        try {
            fileNames = await this.getAudioFilesFromDirectory(directory);
        } catch (error) {
            console.log(error);
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

    async update(
        directory: string,
        fileName: string,
        newAudioFile: AudioFile,
    ): Promise<AudioFile> {
        if (
            !verifyTrackNumber(
                newAudioFile.trackPosition,
                newAudioFile.totalNumberOfTracks,
            )
        ) {
            throw new Error(
                'The track position must be lower than the total number of tracks',
            );
        }
        const newTags: NodeID3.Tags = NodeID3Adapter.toNodeID3Tags(
            newAudioFile,
        );
        const filePath: string = path.join(directory, fileName);
        try {
            await NodeID3.Promise.update(newTags, filePath);
        } catch (e) {
            throw new Error(
                `There was an internal error during the update of ${filePath}: ${e}`,
            );
        }

        return newAudioFile;
    }
}
