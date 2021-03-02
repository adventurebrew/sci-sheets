const UNKNOWN = 0x3F; // '?'

export default {
  from: (code: number) => code,
  to: (code: number) => code < 128 ? code : UNKNOWN
};
