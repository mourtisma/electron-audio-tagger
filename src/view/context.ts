import { createContext } from 'react';
import AudioFile from '@model/audio-file';

type AudioGridContextType = {
    handleClick: () => void | undefined;
    buttonText: 'Open directory' | 'Change directory';
};

export const AudioGridContext = createContext<AudioGridContextType>({
    handleClick: undefined,
    buttonText: 'Open directory',
});

type EditAudioFileContextType = {
    audioFile?: AudioFile;
    editAudioFile?: (audioFileValues: AudioFile) => Promise<AudioFile>;
};

export const EditAudioFileContext = createContext<EditAudioFileContextType>({});
