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

function byteArrayToString(arr: Buffer) {
  const decoder = new TextDecoder("utf-8");
  return decoder.decode(arr);
}

function stringToByteArray(str: string) {
  const encoder = new TextEncoder();
  return encoder.encode(str);
}

export { toBytesInt32, toBytesInt8, byteArrayToString, stringToByteArray };
