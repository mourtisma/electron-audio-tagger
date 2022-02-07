import sinon from 'sinon';
import NodeID3 from 'node-id3';
import fs from 'fs';
import path from 'path';
import NodeID3Adapter from '@model/adapters/node-id3-adapter';
import AudioFile from '@model/audio-file';

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
        });
        read.withArgs(path.join(directory, 'file2.wav')).resolves({
            title: 'File 2',
        });

        const audioFiles: AudioFile[] = await new NodeID3Adapter().getAll(
            directory,
        );

        expect(audioFiles).toHaveLength(2);
        expect(audioFiles[0]).toStrictEqual({
            name: 'file1.mp3',
            title: 'File 1',
            error: false,
        });
        expect(audioFiles[1]).toStrictEqual({
            name: 'file2.wav',
            title: 'File 2',
            error: false,
        });
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
        });
        read.withArgs(path.join(directory, 'file2.wav')).rejects(Error);

        const audioFiles: AudioFile[] = await new NodeID3Adapter().getAll(
            directory,
        );

        expect(audioFiles).toHaveLength(2);
        expect(audioFiles[0]).toStrictEqual({
            name: 'file1.mp3',
            title: 'File 1',
            error: false,
        });
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
        });

        const audioFile: AudioFile = await new NodeID3Adapter().getOne(
            'myDir/',
            'file1.mp3',
        );
        expect(audioFile).toStrictEqual({
            name: 'file1.mp3',
            title: 'File 1',
            error: false,
        });
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
        };
        update.withArgs(tags, 'myDir/file1.mp3').resolves(true);

        const audioFile: AudioFile = {
            name: 'file1.mp3',
            title: 'File 1',
            error: false,
        };

        const newAudioFile: AudioFile = await new NodeID3Adapter().update(
            'myDir/',
            'file1.mp3',
            audioFile,
        );
        expect(newAudioFile).toStrictEqual(audioFile);
    });

    it('Returns an error whenever NodeID3 fails to update the tags of a file', async () => {
        const update = sinon.stub(NodeID3.Promise, 'update');
        const tags: NodeID3.Tags = {
            title: 'File 1',
        };
        update.withArgs(tags, 'myDir/file1.mp3').rejects(Error);

        const audioFile: AudioFile = {
            name: 'file1.mp3',
            title: 'File 1',
            error: false,
        };

        await expect(() =>
            new NodeID3Adapter().update('myDir/', 'file1.mp3', audioFile),
        ).rejects.toThrow();
    });
});
