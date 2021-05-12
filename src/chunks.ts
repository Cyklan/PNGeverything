import crc32 from "./calculateCRC";
import { byteArrayToString, toBytesInt32 } from "./convertBytes";

export class IHDR {
  length = toBytesInt32(13);
  type = new Uint8Array([0x49, 0x48, 0x44, 0x52]);
  width: Uint8Array;
  height: Uint8Array;
  bitDepth = new Uint8Array([8]);
  colorType = new Uint8Array([6]);
  compressionMethod = new Uint8Array([0]);
  filterMethod = new Uint8Array([0]);
  interlaceMethod = new Uint8Array([0]);

  constructor(width: number, height: number) {
    this.width = toBytesInt32(width);
    this.height = toBytesInt32(height);
  }

  getBuffer() {
    return Buffer.concat([this.length, this.getBufferForCRC(), this.calcCRC()]);
  }

  private getBufferForCRC() {
    return Buffer.concat([
      this.type,
      this.width,
      this.height,
      this.bitDepth,
      this.colorType,
      this.compressionMethod,
      this.filterMethod,
      this.interlaceMethod,
    ]);
  }

  private calcCRC() {
    return toBytesInt32(crc32(this.getBufferForCRC()));
  }
}

// HOW TO GET DATA
// GET 64KB OF DATA
// CALCULATE AMOUNT OF SCANLINES IN IDAT CHUNK
// WRITE IDAT AS TYPE
// CREATE UInt8Arrays FROM THE 16KB OF DATA
// PREPEND FILTERMETHOD TO SCANLINE
// COMPRESS DATA WITH pako
// GET DATA LENGTH
// CALC CRC
// TADA
export class IDAT {
  scanLineWidth = 4;
  pixelByteSize = 4;
  data: Buffer;

  constructor(data: Buffer) {
    this.data = data;
  }
}
