export default interface AudioFile {
    name: string;
    error: boolean;
    title?: string;
    artist?: string;
    album?: string;
    composer?: string;
    trackPosition?: number;
    totalNumberOfTracks?: number;
}
