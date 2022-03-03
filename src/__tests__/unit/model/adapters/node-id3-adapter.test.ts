import fs from 'fs';
import path from 'path';

import sinon from 'sinon';
import NodeID3 from 'node-id3';

import NodeID3Adapter from '@model/adapters/node-id3-adapter';
import AudioFile from '@model/audio-file';

import { audioFileMp3, audioFileWav } from '../../audio-files-fixtures';

const directory: string = 'my-files/';

describe('NodeID3Adapter#getAll', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('Returns the ID3 tags of all the audio files in a directory', async () => {
        const readdirStub = (sinon.stub(
            fs.promises,
            'readdir',
        ) as unknown) as sinon.SinonStub<
            [
                path: fs.PathLike,
                options: fs.BaseEncodingOptions & {
                    withFileTypes: false;
                },
            ],
            Promise<string[]>
        >;
        readdirStub.resolves(['file1.mp3', 'file2.wav']);

        const read = sinon.stub(NodeID3.Promise, 'read');
        read.withArgs(path.join(directory, 'file1.mp3')).resolves({
            title: 'File 1',
            artist: 'Artist 1',
            album: 'Album 1',
            composer: 'Composer 1',
            trackNumber: '1/3',
        });
        read.withArgs(path.join(directory, 'file2.wav')).resolves({
            title: 'File 2',
            artist: 'Artist 2',
            album: 'Album 2',
            composer: 'Composer 2',
            trackNumber: '2/4',
        });

        const audioFiles: AudioFile[] = await new NodeID3Adapter().getAll(
            directory,
        );

        expect(audioFiles).toHaveLength(2);
        expect(audioFiles[0]).toStrictEqual(audioFileMp3);
        expect(audioFiles[1]).toStrictEqual(audioFileWav);
    });

    it('Throws an error when reading the files in a directory was unsuccessful', () => {
        sinon.stub(fs.promises, 'readdir').rejects(Error);

        expect(() => new NodeID3Adapter().getAll(directory)).rejects.toThrow();
    });

    it('Marks the file as errored whenever NodeID3 fails to read its tags', async () => {
        const readdirStub = (sinon.stub(
            fs.promises,
            'readdir',
        ) as unknown) as sinon.SinonStub<
            [
                path: fs.PathLike,
                options: fs.BaseEncodingOptions & {
                    withFileTypes: false;
                },
            ],
            Promise<string[]>
        >;
        readdirStub.resolves(['file1.mp3', 'file2.wav']);

        const read = sinon.stub(NodeID3.Promise, 'read');
        read.withArgs(path.join(directory, 'file1.mp3')).resolves({
            title: 'File 1',
            artist: 'Artist 1',
            album: 'Album 1',
            composer: 'Composer 1',
            trackNumber: '1/3',
        });
        read.withArgs(path.join(directory, 'file2.wav')).rejects(Error);

        const audioFiles: AudioFile[] = await new NodeID3Adapter().getAll(
            directory,
        );

        expect(audioFiles).toHaveLength(2);
        expect(audioFiles[0]).toStrictEqual(audioFileMp3);
        expect(audioFiles[1]).toStrictEqual({ name: 'file2.wav', error: true });
    });
});

describe('NodeID3Adapter#getOne', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('Returns the ID3 tags of one particular audio file', async () => {
        const read = sinon.stub(NodeID3.Promise, 'read');
        read.withArgs('myDir/file1.mp3').resolves({
            title: 'File 1',
            artist: 'Artist 1',
            album: 'Album 1',
            composer: 'Composer 1',
            trackNumber: '1/3',
        });

        const audioFile: AudioFile = await new NodeID3Adapter().getOne(
            'myDir/',
            'file1.mp3',
        );
        expect(audioFile).toStrictEqual(audioFileMp3);
    });

    it('Marks the file as errored whenever NodeID3 fails to read its tags', async () => {
        const read = sinon.stub(NodeID3.Promise, 'read');
        read.withArgs('myDir/file1.mp3').rejects(Error);

        const audioFile: AudioFile = await new NodeID3Adapter().getOne(
            'myDir/',
            'file1.mp3',
        );
        expect(audioFile).toStrictEqual({ name: 'file1.mp3', error: true });
    });
});

describe('NodeID3Adapter#update', () => {
    afterEach(() => {
        sinon.restore();
    });

    it('Modifies the ID3 tags of one particular audio file', async () => {
        const update = sinon.stub(NodeID3.Promise, 'update');
        const tags: NodeID3.Tags = {
            title: 'File 1',
            artist: 'Artist 1',
            album: 'Album 1',
            composer: 'Composer 1',
            trackNumber: '1/3',
        };
        update.withArgs(tags, 'myDir/file1.mp3').resolves(true);

        const newAudioFile: AudioFile = await new NodeID3Adapter().update(
            'myDir/',
            'file1.mp3',
            audioFileMp3,
        );
        expect(newAudioFile).toStrictEqual(audioFileMp3);
    });

    it('Returns an error whenever NodeID3 fails to update the tags of a file', async () => {
        const update = sinon.stub(NodeID3.Promise, 'update');
        const tags: NodeID3.Tags = {
            title: 'File 1',
            artist: 'Artist 1',
            album: 'Album 1',
            composer: 'Composer 1',
            trackNumber: '1/3',
        };
        update.withArgs(tags, 'myDir/file1.mp3').rejects(Error);

        await expect(() =>
            new NodeID3Adapter().update('myDir/', 'file1.mp3', audioFileMp3),
        ).rejects.toThrow();
    });

    it('Returns an error the track position is greater than the total number of tracks', async () => {
        await expect(() =>
            new NodeID3Adapter().update('myDir/', 'file1.mp3', {
                ...audioFileMp3,
                trackPosition: 2,
                totalNumberOfTracks: 1,
            }),
        ).rejects.toThrow(
            'The track position must be lower than the total number of tracks',
        );
    });
});
