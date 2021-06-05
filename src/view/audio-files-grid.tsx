import React from 'react';
import AudioFile from '@model/audio-file';

export default ({ audioFiles }: { audioFiles: AudioFile[] }) => (
    <table>
        <thead>
            <tr>
                <th>Name</th>
                <th>Title</th>
                <th aria-label="Error" />
            </tr>
        </thead>
        <tbody>
            {audioFiles.map((audioFile) => (
                <tr key={audioFile.name}>
                    <td>{audioFile.name}</td>
                    <td>{audioFile.title || ''}</td>
                    <td>{audioFile.error && 'Error'}</td>
                </tr>
            ))}
        </tbody>
    </table>
);
