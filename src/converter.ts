// Dateilänge: 16 Byte
// Dateinamenlänge: 8 Byte
// Dateiname: x Byte
// Datei: y Byte
export async function encode(file: File) {
  const encoder = new TextEncoder();
  const fileLength = toBytesInt64(BigInt(file.size));
  const fileName = encoder.encode(file.name);
  const fileNameLength = toBytesInt32(fileName.length);
  const fileInfo = concatArrays(fileNameLength, fileName);
  const fileBytes = bufferToBytesInt8(await file.arrayBuffer());
  
  return concatArrays(fileLength, concatArrays(fileInfo, fileBytes));
}

export async function decode(file: File) {
  let analyzedFile = file.slice(16);
  analyzedFile = analyzedFile.slice(0, analyzedFile.size - 12);
  const dimensions = analyzedFile.slice(0, 4);
  analyzedFile = analyzedFile.slice(17);
  const data = analyzeIDATs(analyzedFile);
}

async function analyzeIDATs(data: Blob) {
  let remainingData = data;
  while (remainingData.size > 0) {
    const chunkSizeBytes = await remainingData.slice(4).arrayBuffer();

  }
}

function bytesToBigInt(arr: ArrayBuffer) {
  let value = 0;
  const a = new BigUint64Array(arr);
  for (let i = a.length - 1; i >= 0; i--) {
    value = (value * 256) + Number(a[i]);
  }

  return value;
}

function bufferToBytesInt8(arr: ArrayBuffer) {
  return new Uint8Array(arr);
}

function toBytesInt8(n: number) {
  const arr = new ArrayBuffer(1);
  const view = new DataView(arr);
  view.setUint8(0, n);
  return new Uint8Array(arr);
}

function toBytesInt32(n: number) {
  const arr = new ArrayBuffer(4);
  const view = new DataView(arr);
  view.setUint32(0, n, false);
  return new Uint8Array(arr);
}

function toBytesInt64(n: bigint) {
  const arr = new ArrayBuffer(8);
  const view = new DataView(arr);
  view.setBigUint64(0, n, false);
  return new Uint8Array(arr);
}

function concatArrays(arr: Uint8Array, arr2: Uint8Array) {
  const c = new Uint8Array(arr.length + arr2.length);
  c.set(arr);
  c.set(arr2, arr.length);
  return c;
}
