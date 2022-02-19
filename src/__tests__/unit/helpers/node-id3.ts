import { parseTrackNumber, getTrackNumber } from '@helpers/node-id3';

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
});
