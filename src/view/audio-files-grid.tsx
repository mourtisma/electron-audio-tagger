import React from 'react';
import { DataGrid, GridCellParams } from '@material-ui/data-grid';
import ErrorIcon from '@material-ui/icons/Error';
import Tooltip from '@material-ui/core/Tooltip';
import AudioFile from '@model/audio-file';

export default ({ audioFiles }: { audioFiles: AudioFile[] }): JSX.Element => {
    const columns = [
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'title', headerName: 'Title', flex: 1 },
        {
            field: 'error',
            headerName: 'Error',
            type: 'boolean',
            flex: 0.5,
            renderCell: ({ value, id }: GridCellParams): JSX.Element =>
                value ? (
                    <Tooltip title="Error when reading this file">
                        <ErrorIcon color="error" data-testid={`error-${id}`} />
                    </Tooltip>
                ) : (
                    <></>
                ),
        },
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
