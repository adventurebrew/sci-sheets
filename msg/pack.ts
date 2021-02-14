import {MsgData, MsgResource, TranslationLine} from "../types/SCI";
import {
  writeString,
  writeUint16,
  writeUint32,
  writeUint8
} from "../utils/binary";
import {sumOf} from "../utils/collections";
import {PackOptions, SIZE_ENTRY, SIZE_HEADER} from "../common";

const getZeroTerminatedStringLength = (line: string) => line.length + 1;

export function packTranslation(lines: TranslationLine[], options: PackOptions) {
  const msgResource = translation2msg(lines);
  return packMSG(msgResource, options);
}

export function translation2msg(lines: TranslationLine[]): MsgResource {
  const strings = lines.map(l => l.text);
  const data: MsgData = {
    version: 0xD0C008F,
    length: SIZE_HEADER
      + (lines.length * SIZE_ENTRY)
      + sumOf(strings, getZeroTerminatedStringLength),
    lastMsgNum: 0,
    nEntries: lines.length,
    entries: [],
  };

  let stringsOffset = SIZE_HEADER + (lines.length * SIZE_ENTRY);
  for (const line of lines) {
    data.entries.push({
      noun: line.noun,
      verb: line.verb,
      condition: line.condition,
      sequence: line.sequence,
      talker: line.talker,
      offset: stringsOffset - 2,
      refNoun: line.refNoun,
      refVerb: line.refVerb,
      refCond: line.refCond,
      refSeq: 0,
    });

    stringsOffset += line.text.length + 1;
  }

  return { data, strings };
}

export function packMSG(msg: MsgResource, options: PackOptions): Uint8Array {
  let index: number;
  let entryOffset: number;

  const nEntries = msg.data.nEntries;
  const fileSize = SIZE_HEADER
    + (nEntries * SIZE_ENTRY)
    + sumOf(msg.strings, getZeroTerminatedStringLength);

  const output = new Uint8Array(fileSize);
  writeUint32(output, 0, 0xD0C008F);
  writeUint16(output, 6, output.length);
  writeUint16(output, 8, msg.strings.length);

  entryOffset = SIZE_HEADER;
  for (index = 0; index < nEntries; index++) {
    const entry = msg.data.entries[index];
    writeUint8(output,  entryOffset + 0, entry.noun);
    writeUint8(output,  entryOffset + 1, entry.verb);
    writeUint8(output,  entryOffset + 2, entry.condition);
    writeUint8(output,  entryOffset + 3, entry.sequence);
    writeUint8(output,  entryOffset + 4, entry.talker);
    writeUint16(output, entryOffset + 5, entry.offset);
    writeUint8(output,  entryOffset + 7, entry.refNoun);
    writeUint8(output,  entryOffset + 8, entry.refVerb);
    writeUint8(output,  entryOffset + 9, entry.refCond);
    writeString(options.encoding, output, entry.offset + 2, msg.strings[index]);

    entryOffset += SIZE_ENTRY;
  }

  return output;
}

