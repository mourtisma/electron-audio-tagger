import sinon from 'sinon';
import AudioFile from '@model/audio-file';
import NodeID3Adapter from '@model/adapters/node-id3-adapter';
import AudioFileRepository from '@model/audio-file-repository';

describe('AudioFileRepository#getAll', () => {
    it('Uses the adapter to return the ID3 tags of all the audio files in a directory', async () => {
        const directory: string = 'my-files/';

        const nodeID3AdapterStub = sinon.createStubInstance(NodeID3Adapter);
        nodeID3AdapterStub.getAll.resolves([
            { name: 'file.mp3', title: 'File 1', error: false },
        ]);

        const audioFiles: AudioFile[] = await new AudioFileRepository(
            nodeID3AdapterStub,
        ).getAll(directory);

        expect(audioFiles).toHaveLength(1);
        expect(audioFiles[0]).toStrictEqual({
            name: 'file.mp3',
            title: 'File 1',
            error: false,
        });
    });
});

describe('AudioFileRepository#getOne', () => {
    it('Uses the adapter to return the ID3 tags of a particular file', async () => {
        const directory: string = 'my-files/';
        const filePath: string = 'file1.mp3';

        const nodeID3AdapterStub = sinon.createStubInstance(NodeID3Adapter);
        nodeID3AdapterStub.getOne.resolves({
            name: 'file.mp3',
            title: 'File 1',
            error: false,
        });

        const audioFile: AudioFile = await new AudioFileRepository(
            nodeID3AdapterStub,
        ).getOne(directory, filePath);

        expect(audioFile).toStrictEqual({
            name: 'file.mp3',
            title: 'File 1',
            error: false,
        });
    });
});
