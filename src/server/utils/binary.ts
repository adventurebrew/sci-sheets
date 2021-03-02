import {ENCODINGS, LegacyEncoding} from './encodings';
import { Uint8, Uint16, Uint32 } from '../types/primitives';

export function readUint8(buf: Uint8Array, offset: number): Uint8 {
  return buf[offset];
}

export function readUint16(buf: Uint8Array, offset: number): Uint16 {
  const lower = readUint8(buf, offset);
  const higher = readUint8(buf, offset + 1);

  return (higher << 8) | lower;
}

export function readUint32(buf: Uint8Array, offset: number): Uint32 {
  const lower = readUint16(buf, offset);
  const higher = readUint16(buf, offset + 2);

  return (higher << 16) | lower;
}

export function readString(encoding: LegacyEncoding, buffer: Uint8Array, offset: number): string {
  let i: number;

  const end = buffer.indexOf(0, offset);
  const bytes = buffer.slice(offset, end);
  const n = bytes.length;
  const decodeChar = ENCODINGS[encoding].from;
  let decoded = '';

  for (i = 0; i < n; i++) {
    decoded += String.fromCharCode(decodeChar(bytes[i]));
  }

  return decoded;
}

export function writeUint8(buf: Uint8Array, offset: number, value: number): void {
  buf[offset] = value;
}

export function writeUint16(buf: Uint8Array, offset: number, value: number): void {
  writeUint8(buf, offset, value);
  writeUint8(buf, offset + 1, value >> 8);
}

export function writeUint32(buf: Uint8Array, offset: number, value: number): void {
  writeUint16(buf, offset, value);
  writeUint16(buf, offset + 2, value >> 16);
}

export function writeString(encoding: LegacyEncoding, buf: Uint8Array, offset: number, value: string): void {
  let n: number = value.length;
  let code: number = 0;

  const encodeChar = ENCODINGS[encoding].to;
  for (let i = 0; i < n; i++) {
    code = value.charCodeAt(i);
    writeUint8(buf, offset + i, encodeChar(code));
  }

  buf[offset + n] = 0;
}
