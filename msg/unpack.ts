import {IndexEntry} from "../types/SCI";
import {readUint16, readUint8} from "../utils/binary";

export function readEntry(buffer: Uint8Array, index: number): IndexEntry {
    const entryOffset = (1 + index) * 10;

    const noun      = readUint8(buffer, entryOffset + 0);
    const verb      = readUint8(buffer, entryOffset + 1);
    const condition = readUint8(buffer, entryOffset + 2);
    const sequence  = readUint8(buffer, entryOffset + 3);
    const talker    = readUint8(buffer, entryOffset + 4);
    const offset    = readUint16(buffer, entryOffset + 5);
    const refNoun   = readUint8(buffer, entryOffset + 7);
    const refVerb   = readUint8(buffer, entryOffset + 8);
    const refCond   = readUint8(buffer, entryOffset + 9);
    const refSeq    = readUint8(buffer, entryOffset + 10);

    return {
        noun,
        verb,
        condition,
        sequence,
        talker,
        offset,
        refNoun,
        refVerb,
        refCond,
        refSeq,
    };
}
