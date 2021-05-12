import fs from "fs";
import { IHDR } from "./chunks";
import { IEND, pngHeader, sRGB } from "./png-specifics";
import { toBytesInt32 } from "./convertBytes";

// GAME PLAN
// Get byte size of non-png file
// get file type 
// get file type char length
// store length in 4 byte integer (first pixel)
// store chars of file type as next bytes
// prepend those bytes to file bytes


const header = new IHDR(500, 500);

fs.writeFileSync(
  "./test.png",
  Buffer.concat([pngHeader, header.getBuffer(), sRGB, IEND])
);
