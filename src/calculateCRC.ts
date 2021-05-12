import crcTable from "./crcTable";

export default function crc32(input: Uint8Array) {
  let crc = 0 ^ (-1);
  for (let i = 0; i < input.length; i++) {
    crc = (crc >>> 8) ^ crcTable[(crc ^ input[i]) & 0xFF];
  }

  return (crc ^ (-1)) >>> 0;
}