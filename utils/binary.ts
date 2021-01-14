import {CharMapper, fromASCII, fromWin1255, toASCII, toWin1255} from "./encodings";

export function readUint8(buf: Uint8Array, offset: number): Uint8 {
    return buf[offset];
}

export function readUint16(buf: Uint8Array, offset: number): Uint16 {
    const lower = readUint8(buf, offset);
    const higher = readUint8(buf, offset + 1);

    return (higher << 8) | lower;
}

function readAscii(buffer: Uint8Array, offset: number): string {
    return readString(fromASCII, buffer, offset);
}

function readWin1255(buffer: Uint8Array, offset: number): string {
    return readString(fromWin1255, buffer, offset);
}

function readString(decodeChar: CharMapper, buffer: Uint8Array, offset: number): string {
    let i: number;

    const end = buffer.indexOf(0, offset);
    const bytes = buffer.slice(offset, end);
    const n = bytes.length;

    for (i = 0; i < n; i++) {
        bytes[i] = decodeChar(bytes[i]);
    }

    return String.fromCharCode.apply(null, bytes);
}

export function writeUint8(buf: Uint8Array, offset: number, value: number): void {
    buf[offset] = value;
}

export function writeUint16(buf: Uint8Array, offset: number, value: number): void {
    writeUint8(buf, offset, value);
    writeUint8(buf, offset + 1, value >> 8);
}

export function writeAscii(buf: Uint8Array, offset: number, value: string): void {
    writeString(toASCII, buf, offset, value);
}

export function writeWin1255(buf: Uint8Array, offset: number, value: string): void {
    writeString(toWin1255, buf, offset, value);
}

function writeString(encodeChar: CharMapper, buf: Uint8Array, offset: number, value: string): void {
    let n: number = value.length;
    let code: number = 0;

    for (let i = 0; i < n; i++) {
        code = value.charCodeAt(i);
        writeUint8(buf, offset + i, encodeChar(code));
    }

    buf[offset + n] = 0;
}
