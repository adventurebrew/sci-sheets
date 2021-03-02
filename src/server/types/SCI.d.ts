import { Uint8, Uint16, Uint32, Uchar } from "./primitives";

export type MsgResource = {
  data: MsgData;
  strings: string[];
};

export type MsgData = {
  version: Uint32;
  length: Uint16;
  lastMsgNum: Uint16;
  nEntries: Uint16;
  entries: IndexEntry[];
};

export type IndexEntry = {
  noun: Uint8;
  verb: Uint8;
  condition: Uint8;
  sequence: Uint8;
  talker: Uint8;
  offset: Uint16;
  refNoun: Uchar;
  refVerb: Uchar;
  refCond: Uchar;
  refSeq: Uchar;
};

export type TranslationLine = {
  noun: number;
  verb: number;
  condition: number;
  sequence: number;
  talker: number;
  refNoun: number;
  refVerb: number;
  refCond: number;
  text: string;
};

export type TranslationLineWithResourceId = TranslationLine & {
  resource: number;
};
