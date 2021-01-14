import { writeUint8 } from './binary';

describe('binary utils', () => {
    const MAX_SIZE = 1000;
    let buf: Uint8Array;

    beforeEach(() => {
        buf = new Uint8Array(MAX_SIZE);
    });

    describe('writeUint8', () => {
        it('should write only first 8 bits', () => {
            writeUint8(buf, 1, 0xFFAA);

            expect(buf[0]).toBe(0x00);
            expect(buf[1]).toBe(0xAA);
            expect(buf[2]).toBe(0x00);
        });
    });
});

