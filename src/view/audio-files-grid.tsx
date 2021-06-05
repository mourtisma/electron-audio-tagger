import React from 'react';
import { DataGrid } from '@material-ui/data-grid';
import AudioFile from '@model/audio-file';

export default ({ audioFiles }: { audioFiles: AudioFile[] }): JSX.Element => {
    const columns = [
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'title', headerName: 'Title', flex: 1 },
        { field: 'error', headerName: 'Error', type: 'boolean', flex: 0.5 },
    ];

    return (
        <div style={{ height: 400, width: '100%' }}>
            <DataGrid
                columns={columns}
                rows={audioFiles}
                getRowId={(af) => af.name}
            />
        </div>
    );
};
