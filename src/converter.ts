import crc32 from "./calculateCRC";
import { IHDRConfig, IHDRLength, IHDRType, FilterTypeByte, IDATType, PNGHeader, IENDChunk } from "./constants";
import Pako from "pako";

export async function encode(file: File) {
  const fileBytes = await getFileBytes(file);
  const dimensions = Math.ceil(Math.sqrt(fileBytes.length / 4));

  const IHDR = await generateIHDRChunk(dimensions);

  const IDATChunks: Uint8Array[] = [];
  let remainingBytes = fileBytes;
  while (remainingBytes.length > 0) {
    let IDATBytes = remainingBytes.slice(0, dimensions * 4);
    if (IDATBytes.length < dimensions * 4) {
      const difference = dimensions * 4 - IDATBytes.length;
      IDATBytes = concatArrays(IDATBytes, new Uint8Array(difference));
    }

    IDATChunks.push(await generateIDATChunk(IDATBytes));
    remainingBytes = remainingBytes.slice(dimensions * 4);
  }

  let PNG = concatArrays(PNGHeader, IHDR);
  for (let i = 0; i < IDATChunks.length; i++) {
    PNG = concatArrays(PNG, IDATChunks[i]);
  }
  PNG = concatArrays(PNG, IENDChunk);

  return PNG;
}

export async function decode(file: File) {
  // const dimensions = getDimensions(file);
  const noHead = stripHead(file);

  let remainingBytes = noHead;
  const pixelData: Uint8Array[] = [];
  while (remainingBytes.size > 0) {
    if (await checkForIEND(remainingBytes)) break;
    const IDATLengthBytes = remainingBytes.slice(0, 4);
    const IDATLength = bytesToNumber(await IDATLengthBytes.arrayBuffer(), 4);
    pixelData.push(await decodeIDAT(remainingBytes.slice(0, IDATLength + 12)));
    remainingBytes = remainingBytes.slice(IDATLength + 12);
  }

  let bytes: Uint8Array = new Uint8Array();
  for (let i = 0; i < pixelData.length; i++) {
    bytes = concatArrays(bytes, pixelData[i]);
  }

  const fileSizeBytes = bytes.slice(0, 4);
  const fileNameSizeBytes = bytes.slice(4, 8);
  const fileSize = bytesToNumber(fileSizeBytes.buffer, 4);
  const fileNameSize = bytesToNumber(fileNameSizeBytes.buffer, 4);
  const fileNameBytes = bytes.slice(8, 8 + fileNameSize);
  const fileName = bytesToText(fileNameBytes);

  return {
    bytes: bytes.slice(8 + fileNameSize).slice(0, fileSize),
    fileName
  };
}

export function bytesToText(bytes: Uint8Array) {
  const decoder = new TextDecoder();
  return decoder.decode(bytes);

}

export async function decodeIDAT(data: Blob) {
  const justData = data.slice(8).slice(0, data.size - 12);
  const pixelData = Pako.inflate(new Uint8Array(await justData.arrayBuffer())).slice(1);
  return pixelData;
}

export async function checkForIEND(data: Blob) {
  const typeBytes = data.slice(4, 8);
  const typeByteArray = await blobToUint8(typeBytes);
  const IENDType = new Uint8Array([0x49, 0x45, 0x4E, 0x44]);
  for (let i = 0; i < IENDType.length; i++) {
    if (typeByteArray[i] !== IENDType[i]) return false;
  }
  return true;
}

async function blobToUint8(data: Blob) {
  return new Uint8Array(await data.arrayBuffer());
}

export async function getDimensions(data: Blob) {
  const dimensionsBytes = data.slice(16, 20);
  return bytesToNumber(await dimensionsBytes.arrayBuffer(), 4);
}

export function stripHead(data: Blob) {
  return data.slice(33);
}

async function generateIHDRChunk(dimensions: number) {
  const dimensionsBytes = toBytesInt32(dimensions);
  const crcData = concatArrays(
    IHDRType,
    concatArrays(
      concatArrays(dimensionsBytes, dimensionsBytes),
      IHDRConfig
    ));

  const crc = performCRC(crcData);
  return concatArrays(
    IHDRLength, concatArrays(crcData, crc)
  );
}

// ONE CHUNK PER SCANLINE
async function generateIDATChunk(bytes: Uint8Array) {
  const filteredScanline = concatArrays(FilterTypeByte, bytes);
  const compressed = Pako.deflate(filteredScanline);
  const crcData = concatArrays(IDATType, compressed);
  const crc = performCRC(crcData);
  const IDATLength = toBytesInt32(compressed.length);
  return concatArrays(IDATLength, concatArrays(crcData, crc));
}

async function getFileBytes(file: File) {
  const encoder = new TextEncoder();
  const fileName = encoder.encode(file.name);
  const fileNameLength = toBytesInt32(fileName.length);
  const fileSize = toBytesInt32(file.size);

  const fileBytes = concatArrays(
    fileSize,
    concatArrays(fileNameLength,
      concatArrays(fileName,
        bufferToBytesInt8(await file.arrayBuffer()))));
  return fileBytes;
}

function bytesToNumber(arr: ArrayBuffer | Array<number>, byteSize: number) {
  const a = new Uint8Array(arr);
  let value = a[a.length - 1];
  for (let i = 2; i < byteSize; i++) {
    value |= a[a.length - i] << ((i - 1) * 8);
  }

  return value;
}

function bufferToBytesInt8(arr: ArrayBuffer) {
  return new Uint8Array(arr);
}

function toBytesInt32(n: number) {
  const arr = new ArrayBuffer(4);
  const view = new DataView(arr);
  view.setUint32(0, n, false);
  return new Uint8Array(arr);
}

function concatArrays(arr: Uint8Array, arr2: Uint8Array) {
  const c = new Uint8Array(arr.length + arr2.length);
  c.set(arr);
  c.set(arr2, arr.length);
  return c;
}

function performCRC(data: Uint8Array) {
  return toBytesInt32(crc32(data));
}
