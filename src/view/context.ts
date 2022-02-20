import { createContext } from 'react';
import AudioFile from '@model/audio-file';

interface EditAudioFileContextInterface {
    audioFile?: AudioFile;
    editAudioFile?: (audioFileValues: AudioFile) => Promise<AudioFile>;
}

export default createContext<EditAudioFileContextInterface>({});
