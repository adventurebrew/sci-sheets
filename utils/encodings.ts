const UNKNOWN = '?'.charCodeAt(0);

export type CharMapper = (charCode: number) => number;
export const fromASCII: CharMapper = (code) => code;
export const toASCII: CharMapper = (code) => code < 128 ? code : UNKNOWN;

export const fromWin1255: CharMapper = (code) => code >= 224 ? code + 1264 : code;
export const toWin1255: CharMapper = (code) => code >= 1488 ? (code & 0xFF) + 16 : fromASCII(code);
