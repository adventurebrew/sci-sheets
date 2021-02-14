import {unpackMSG, unpackTranslation} from './unpack';
import {packMSG, packTranslation} from "./pack";

describe('pack-unpack test', () => {
  const MSG95 = Buffer.from(
    `jwAMDQAAvgUWAAEBAAFj5AAUALoCAQABY/QApqamBAEAAWMhAaampgUEAAFjTgF3AAAGBAABY2wB` +
    `APR3BgQBAWO6AaampgYBAAFj3wEAAAAHAQABYwYCAAAACAQAAWM0AqampgkBAAFjWAJBU1QKAAIB` +
    `Y4YCAAIACgADAWOjAnempgoABAFjugKmNacKAAUBYykDwncACgEAAWNTA6bCdwozAAFjFASmpqYL` +
    `BAABYzIEAAAACwEAAWOWBHeVdwwBAAFj8wSmpqYDBAABY04FAAAAAwQBAWNzBQCmpgMBAAFjmAWm` +
    `pqZUaGUgYmFjayBkb29yLiAAVGhleSByZW1pbmQgeW91IG9mIGEgYnVuY2ggb2YgS25vY2hlbGtv` +
    `cGZzLiAAVGhlcmUgaXMgYSBjaGFuZGVsaWVyIHdpdGggYSByb3BlIGF0dGFjaGVkLiAAVGhlIGRv` +
    `b3IgaXMgYWxyZWFkeSBibG9ja2VkLiAATm8gdGltZSBmb3IgdGhhdCBhZ2FpbiAoYWx0aG91Z2gg` +
    `aXQgV0FTIGZ1bikuICBKdXN0IGdldCB0aGUgaGVjayBvdXR0YSBoZXJlLiAAVGhlIGNoYW5kZWxp` +
    `ZXIgaXMgb3V0IG9mIHlvdXIgcmVhY2guAENoYW5kZWxpZXIsIHVzZWQgdG8gaG9sZCB1cCB0aGUg` +
    `cm9wZS4gAEhlJ3MgYmVlbiBkcmlua2luZyBUcm9sbCdzIHN3ZWF0IGFsbCBuaWdodC4gIABUaGUg` +
    `ZnJvbnQgZG9vciBpcyBhbHJlYWR5IGJhcnJlZC4gIABUaGUgZmxvb3IgaXMgc3RyZXduIHdpdGgg` +
    `ZmxvdHNhbSBhbmQgamV0c2FtLiAAWW91IGNsb3NlIGFuZCBiYXIgdGhlIGRvb3IuIAAiT2gsIGEg` +
    `d2lzZSBndXksIGVoPyIgAFRoZXJlJ3Mgbm8gbmVlZCB0byBrbm9jayB0aGlzIGd1eSBvdXQ7IHRo` +
    `ZSBUcm9sbCdzIFN3ZWF0IGhlJ3MgYmVlbiBkcmlua2luZyBoYXMgYWxyZWFkeSBkb25lIHRoZSBq` +
    `b2IgZm9yIHlvdS4gAFlvdSBtb3ZlIHRoZSBjaGFpciBpbiBmcm9udCBvZiB0aGUgZG9vci4gAFdv` +
    `b2RlbiB0YWJsZXMsIGJlbmNoZXMsIGFuZCBjaGFpcnMgZmlsbCB0aGUgc3BhY2Ugb2YgdGhpcyBi` +
    `cmlnYW5kIG1lZXRpbmcgYXJlYS4gIEEgY2hhbmRlbGllciBsaWdodHMgdGhlIHJvb20gYW5kICBh` +
    `biB1bmxpdCBjYW5kZWxhYnJhIHN0YW5kcyBpbiB0aGUgY29ybmVyLiAgQSByb3BlIGhhbmdzIGZy` +
    `b20gdGhlIGNoYW5kZWxpZXIuIABOb25lIG9mIHRoZSBkb29ycyBhcmUgbG9ja2VkLgBMZWF2ZSB0` +
    `aGUgcm9wZSBhbG9uZSBmb3Igbm93LiAgSXQncyBzZXJ2aW5nIGEgdmVyeSBpbXBvcnRhbnQgZnVu` +
    `Y3Rpb24gYnkgaG9sZGluZyB1cCB0aGUgY2hhbmRlbGllci4AVGhlIHJvcGUgaG9sZHMgdXAgdGhl` +
    `IGNoYW5kZWxpZXIuICBJdCdzIHVzZWQgdG8gbG93ZXIgdGhlIGNoYW5kZWxpZXIgc28gdGhhdCBp` +
    `dCBjYW4gYmUgbGl0LiAATW9zdCBvZiB0aGUgdGFibGVzIGFyZSBncmlteSB3aXRoIGRyaWVkIGJl` +
    `ZXIgYW5kIHN1Y2guICBUaGUgaGVhZCB0YWJsZSwgdGhvdWdoLCBpcyBjbGVhbi4gAFlvdSBiZWdp` +
    `biB0b3BwbGluZyB0aGUgY2FuZGVsYWJyYS4gIABUaGUgY2FuZGVsYWJyYSBoYXMgYWxyZWFkeSBm` +
    `YWxsZW4uICAAU3R1cmR5LWxvb2tpbmcgZGV2aWNlIGZvciBob2xkaW5nIGNhbmRsZXMuIAAAAAAA` +
    `AAAAAAAAAAAAAAAAAAAAAAAA`, 'base64'
  );

  it('should unpack a message resource file', () => {
    const msg = unpackMSG(MSG95, { encoding: 'ascii' });
    expect(msg).toMatchSnapshot();
  });

  it('should pack a message resource file back', () => {
    const msg = unpackMSG(MSG95, { encoding: 'ascii' });
    const buffer = packMSG(msg, { encoding: 'ascii' });
    expect(Buffer.from(buffer)).toEqual(MSG95);
  });

  it('should convert a message resource file to translations', () => {
    const translation = unpackTranslation(MSG95, { encoding: 'ascii' });
    expect(translation).toMatchSnapshot();
  });

  it('should convert a message resource to translations and back again', () => {
    const translation = unpackTranslation(MSG95, { encoding: 'ascii' });
    const buffer = packTranslation(translation, { encoding: 'ascii' });

    expect(Buffer.from(buffer)).toEqual(MSG95);
  });
});
