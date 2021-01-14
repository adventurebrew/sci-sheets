import {TranslationLine} from "../types/SCI";
import {writeUint16, writeUint8, writeWin1255} from "../utils/binary";

export type PackOptions = {
    encoding: 'ascii' | 'win1255';
};

function sumOf<T>(arr: T[], fn: (x: T, i: number, a: T[]) => number): number {
    let sum = 0;
    for (let i = 0; i < arr.length; i++)
        sum += fn(arr[i], i, arr);
    return sum;
}

export function pack(lines: TranslationLine[], options: PackOptions): Uint8Array {
    const strLength = (line: TranslationLine) => line.text.length + 1;
    const output = new Uint8Array(10 + lines.length * 10 + sumOf(lines, strLength));
    writeUint16(output, 0, 0x008F);
    writeUint16(output, 2, 0x0D0C);

    const totalSize = lines.reduce((size, line) => {
        return size + (line.text.length + 10 + 1);
    }, 0);

    writeUint16(output, 6, totalSize + 2);
    writeUint16(output, 8, lines.length);

    for (let index = 0, s_offset = 10 + (lines.length) * 10; index < lines.length; index++) {
        const offset = 10 + index * 10;
        const {entry, text} = lines[index];

        writeUint8(output,  offset + 0, entry.noun);
        writeUint8(output,  offset + 1, entry.verb);
        writeUint8(output,  offset + 2, entry.condition);
        writeUint8(output,  offset + 3, entry.sequence);
        writeUint8(output,  offset + 4, entry.talker);
        writeUint16(output, offset + 5, entry.offset);
        writeUint8(output,  offset + 7, entry.refNoun);
        writeUint8(output,  offset + 8, entry.refVerb);
        writeUint8(output,  offset + 9, entry.refCond);
        writeWin1255(output, entry.offset, text);
        s_offset += entry.offset + text.length + 1;
    }

    return output;
}

