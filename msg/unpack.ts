import {IndexEntry, MsgData, MsgResource} from "../types/SCI";
import {readString, readUint16, readUint32, readUint8} from "../utils/binary";
import {LegacyEncoding} from "../utils/encodings";

function readEntry(buffer: Uint8Array, index: number): IndexEntry {
  const SIZE_HEADER = 10;
  const SIZE_ENTRY = 10;
  const entryOffset = SIZE_HEADER + (SIZE_ENTRY * index);

  const noun      = readUint8(buffer, entryOffset + 0);
  const verb      = readUint8(buffer, entryOffset + 1);
  const condition = readUint8(buffer, entryOffset + 2);
  const sequence  = readUint8(buffer, entryOffset + 3);
  const talker    = readUint8(buffer, entryOffset + 4);
  const offset    = readUint16(buffer, entryOffset + 5) + 2;
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

function readMsgData(buffer: Uint8Array): MsgData {
  const version = readUint32(buffer, 0);
  const length = readUint16(buffer, 4);
  const lastMsgNum = readUint16(buffer, 6);
  const nEntries = readUint16(buffer, 8);
  const entries = new Array(nEntries);

  for (let index = 0; index < nEntries; index++) {
    entries[index] = readEntry(buffer, index);
  }

  return {
    version,
    length,
    lastMsgNum,
    nEntries,
    entries,
  };
}

export function unpackMSG(buffer: Uint8Array, encoding: LegacyEncoding): MsgResource {
  let index: number, entry: IndexEntry;
  const data = readMsgData(buffer);
  const strings = new Array(data.nEntries);

  for (index = 0; index < data.nEntries; index++) {
    entry = data.entries[index];
    strings[index] = readString(encoding, buffer, entry.offset);
  }

  return { data, strings };
}
