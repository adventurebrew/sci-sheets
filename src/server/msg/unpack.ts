import {IndexEntry, MsgData, MsgResource, TranslationLine} from '../types/SCI';
import {readString, readUint16, readUint32, readUint8} from '../utils/binary';
import {PackOptions, SIZE_ENTRY, SIZE_HEADER} from './common';

export function unpackTranslation(buffer: Uint8Array, options: PackOptions) {
  return msg2translation(unpackMSG(buffer, options));
}

export function unpackMSG(buffer: Uint8Array, options: PackOptions): MsgResource {
  let index: number;
  let entry: IndexEntry;

  const { encoding } = options;
  const data = readMsgData(buffer);
  const strings = new Array(data.nEntries);

  for (index = 0; index < data.nEntries; index++) {
    entry = data.entries[index];
    strings[index] = readString(encoding, buffer, entry.offset + 2);
  }

  return { data, strings };
}

export function msg2translation(msg: MsgResource): TranslationLine[] {
  let index: number;
  let entry: IndexEntry;

  const { nEntries } = msg.data;
  const lines = new Array<TranslationLine>(nEntries);

  for (index = 0; index < nEntries; index++) {
    entry = msg.data.entries[index];

    lines[index] = {
      noun: entry.noun,
      verb: entry.verb,
      condition: entry.condition,
      sequence: entry.sequence,
      talker: entry.talker,
      refNoun: entry.refNoun,
      refVerb: entry.refVerb,
      refCond: entry.refCond,
      text: msg.strings[index]
    };
  }

  return lines;
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

function readEntry(buffer: Uint8Array, index: number): IndexEntry {
  const entryOffset = SIZE_HEADER + (SIZE_ENTRY * index);

  const noun      = readUint8(buffer, entryOffset + 0);
  const verb      = readUint8(buffer, entryOffset + 1);
  const condition = readUint8(buffer, entryOffset + 2);
  const sequence  = readUint8(buffer, entryOffset + 3);
  const talker    = readUint8(buffer, entryOffset + 4);
  const offset    = readUint16(buffer, entryOffset + 5);
  const refNoun   = readUint8(buffer, entryOffset + 7);
  const refVerb   = readUint8(buffer, entryOffset + 8);
  const refCond   = readUint8(buffer, entryOffset + 9);
  const refSeq    = 0;

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
