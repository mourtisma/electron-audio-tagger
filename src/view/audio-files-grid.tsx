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
import { getTrackNumber } from '@helpers/node-id3';

interface AudioFilesGridProps {
    audioFiles: AudioFile[];
    onFileSelect: (filename: string, directory: string) => void;
    selectedDirectory: string;
}
const AudioFilesGrid = ({
    audioFiles,
    onFileSelect,
    selectedDirectory,
}: AudioFilesGridProps): JSX.Element => {
    const onEditIconSelect = (selectedFile: GridRowId) => {
        onFileSelect(selectedFile as string, selectedDirectory);
    };

    const columns = [
        { field: 'name', headerName: 'Name', flex: 1 },
        { field: 'title', headerName: 'Title', flex: 1 },
        { field: 'artist', headerName: 'Artist', flex: 1 },
        { field: 'album', headerName: 'Album', flex: 1 },
        { field: 'composer', headerName: 'Composer', flex: 1 },
        {
            field: 'trackNumber',
            headerName: 'Track position',
            flex: 1,
            valueGetter: ({
                row: { trackPosition, totalNumberOfTracks },
            }: GridCellParams): string =>
                getTrackNumber(trackPosition, totalNumberOfTracks),
        },
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
                autoHeight
                columns={columns}
                rows={audioFiles}
                columnBuffer={8}
                getRowId={(af: AudioFile) => af.name}
            />
        </div>
    );
};

export default React.memo(
    AudioFilesGrid,
    (prevProps, nextProps) =>
        prevProps.selectedDirectory === nextProps.selectedDirectory &&
        JSON.stringify(prevProps.audioFiles) ===
            JSON.stringify(nextProps.audioFiles),
);
