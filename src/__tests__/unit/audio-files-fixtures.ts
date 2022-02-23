import AudioFile from '@src/model/audio-file';

export const audioFileMp3: AudioFile = {
    name: 'file1.mp3',
    title: 'File 1',
    artist: 'Artist 1',
    album: 'Album 1',
    composer: 'Composer 1',
    trackPosition: 1,
    totalNumberOfTracks: 3,
    error: false,
};
export const audioFileWav: AudioFile = {
    name: 'file2.wav',
    title: 'File 2',
    artist: 'Artist 2',
    album: 'Album 2',
    composer: 'Composer 2',
    trackPosition: 2,
    totalNumberOfTracks: 4,
    error: false,
};
export const audioFileWithError: AudioFile = { name: 'file2.mp3', error: true };

export const audioFileFixtures = [
    audioFileMp3,
    audioFileWav,
    audioFileWithError,
];
