export const parseTrackNumber = (
    trackNumber: string | undefined,
): [number | undefined, number | undefined] => {
    if (!trackNumber) {
        return [undefined, undefined];
    }
    const splittedTrackNumber = trackNumber.split('/');
    if (splittedTrackNumber.length !== 2) {
        return [undefined, undefined];
    }
    const [trackPositionStr, totalNumberOfTracksStr] = splittedTrackNumber;
    const trackPosition = parseInt(trackPositionStr, 10);
    const totalNumberOfTracks = parseInt(totalNumberOfTracksStr, 10);

    return Number.isNaN(trackPosition) || Number.isNaN(totalNumberOfTracks)
        ? [undefined, undefined]
        : [trackPosition, totalNumberOfTracks];
};

export const getTrackNumber = (
    trackPosition: number | undefined,
    totalNumberOfTracks: number | undefined,
): string =>
    trackPosition && totalNumberOfTracks
        ? `${trackPosition}/${totalNumberOfTracks}`
        : '';
