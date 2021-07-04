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

    it('Throws an error when reading the files in a directory was unsuccessful', async () => {
        sinon.stub(fs.promises, 'readdir').rejects(Error);

        await expect(() =>
            new NodeID3Adapter().getAll(directory),
        ).rejects.toThrow();
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