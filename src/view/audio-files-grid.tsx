import React from 'react';
import {
    DataGrid,
    GridAlignment,
    GridCellParams,
    GridRowId,
} from '@material-ui/data-grid';
import ErrorIcon from '@material-ui/icons/Error';
import EditIcon from '@material-ui/icons/Edit';
import Tooltip from '@material-ui/core/Tooltip';
import AudioFile from '@model/audio-file';

interface AudioFilesGridProps {
    audioFiles: AudioFile[];
    onFileSelect: (filename: string) => void;
}
export default ({
    audioFiles,
    onFileSelect,
}: AudioFilesGridProps): JSX.Element => {
    const onEditIconSelect = (selectedFile: GridRowId) => {
        onFileSelect(selectedFile as string);
    };

    const columns = [
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'title', headerName: 'Title', flex: 1 },
        {
            field: '',
            headerName: 'Edit',
            disableColumnMenu: true,
            sortable: false,
            flex: 0.2,
            align: 'center' as GridAlignment,
            renderCell: ({ id }: GridCellParams): JSX.Element => (
                <Tooltip title="Edit">
                    <div
                        data-testid={`edit-${id}`}
                        role="none"
                        onClick={() => {
                            onEditIconSelect(id);
                        }}
                    >
                        <EditIcon />
                    </div>
                </Tooltip>
            ),
        },
        {
            field: 'error',
            headerName: 'Error',
            disableColumnMenu: true,
            sortable: false,
            flex: 0.2,
            renderCell: ({ value, id }: GridCellParams): JSX.Element =>
                value ? (
                    <Tooltip title="Error when reading this file">
                        <div data-testid={`error-${id}`}>
                            <ErrorIcon color="error" />
                        </div>
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
                columnBuffer={8}
                getRowId={(af: AudioFile) => af.name}
            />
        </div>
    );
};
