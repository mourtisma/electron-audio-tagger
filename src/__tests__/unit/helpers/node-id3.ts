import {
    parseTrackNumber,
    getTrackNumber,
    verifyTrackNumber,
} from '@helpers/node-id3';

describe('NodeID3 Helpers', () => {
    it('Parses Track Number', () => {
        expect(parseTrackNumber('')).toStrictEqual([undefined, undefined]);
        expect(parseTrackNumber('3')).toStrictEqual([undefined, undefined]);
        expect(parseTrackNumber('3/a')).toStrictEqual([undefined, undefined]);
        expect(parseTrackNumber('3/4')).toStrictEqual([3, 4]);
    });

    it('Gets Track Number as string', () => {
        expect(getTrackNumber(3, undefined)).toBe('');
        expect(getTrackNumber(3, 4)).toBe('3/4');
    });

    it('Verifies that the track number is lower than the total number of tracks', () => {
        expect(verifyTrackNumber(3, 4)).toBe(true);
        expect(verifyTrackNumber(3, 0)).toBe(true);
        expect(verifyTrackNumber(3, undefined)).toBe(true);
        expect(verifyTrackNumber(undefined, 2)).toBe(true);

        expect(verifyTrackNumber(2, 1)).toBe(false);
    });
});
