import sinon from 'sinon';

import AudioFile from '@model/audio-file';
import NodeID3Adapter from '@model/adapters/node-id3-adapter';
import AudioFileRepository from '@model/audio-file-repository';

import { audioFileMp3, audioFileWav } from '../audio-files-fixtures';

describe('AudioFileRepository#getAll', () => {
    it('Uses the adapter to return the ID3 tags of all the audio files in a directory', async () => {
        const directory: string = 'my-files/';

        const nodeID3AdapterStub = sinon.createStubInstance(NodeID3Adapter);
        nodeID3AdapterStub.getAll.resolves([audioFileMp3, audioFileWav]);

        const audioFiles: AudioFile[] = await new AudioFileRepository(
            nodeID3AdapterStub,
        ).getAll(directory);

        expect(audioFiles).toHaveLength(2);
        expect(audioFiles[0]).toStrictEqual(audioFileMp3);
        expect(audioFiles[1]).toStrictEqual(audioFileWav);
    });
});

describe('AudioFileRepository#getOne', () => {
    it('Uses the adapter to return the ID3 tags of a particular file', async () => {
        const directory: string = 'my-files/';
        const filePath: string = 'file1.mp3';

        const nodeID3AdapterStub = sinon.createStubInstance(NodeID3Adapter);
        nodeID3AdapterStub.getOne.resolves(audioFileMp3);

        const audioFile: AudioFile = await new AudioFileRepository(
            nodeID3AdapterStub,
        ).getOne(directory, filePath);

        expect(audioFile).toStrictEqual(audioFileMp3);
    });
});

describe('AudioFileRepository#update', () => {
    beforeEach(() => {
        sinon.restore();
    });
    it('Uses the adapter to update the ID3 tags of a particular file', async () => {
        const directory: string = 'my-files/';
        const filePath: string = 'file1.mp3';

        const nodeID3AdapterStub = sinon.createStubInstance(NodeID3Adapter);
        nodeID3AdapterStub.update.resolves(audioFileMp3);

        const newAudioFile: AudioFile = await new AudioFileRepository(
            nodeID3AdapterStub,
        ).update(directory, filePath, audioFileMp3);

        expect(newAudioFile).toStrictEqual(audioFileMp3);
    });

    it('Throws an error if the adapted throws an error', async () => {
        const directory: string = 'my-files/';
        const filePath: string = 'file1.mp3';

        const nodeID3AdapterStub = sinon.createStubInstance(NodeID3Adapter);
        nodeID3AdapterStub.update.throws(Error);

        await expect(() =>
            new AudioFileRepository(nodeID3AdapterStub).update(
                directory,
                filePath,
                audioFileMp3,
            ),
        ).rejects.toThrow(Error);
    });
});
