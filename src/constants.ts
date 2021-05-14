const PNGHeader = new Uint8Array([137, 80, 78, 71, 13, 10, 26, 10]);
const IHDRLength = new Uint8Array([0, 0, 0, 13]);
const IHDRType = new Uint8Array([73, 72, 68, 82]);
const IHDRConfig = new Uint8Array([8, 6, 0, 0, 0]);
const IDATType = new Uint8Array([73, 68, 65, 84]);
const IENDChunk = new Uint8Array([0, 0, 0, 0, 73, 69, 78, 68, 174, 66, 96, 130]);
const FilterTypeByte = new Uint8Array([0]);
export { PNGHeader, IHDRLength, IHDRType, IHDRConfig, IDATType, IENDChunk, FilterTypeByte };