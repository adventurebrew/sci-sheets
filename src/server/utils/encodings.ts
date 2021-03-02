import ascii from './encodings/ascii';
import win1255 from './encodings/win1255';

type FromTo = { from: CharMapper, to: CharMapper };
export type CharMapper = (charCode: number) => number;
export type LegacyEncoding = 'ascii' | 'win1255';

export const ENCODINGS: Record<LegacyEncoding, FromTo> = {
  ascii,
  win1255,
};
