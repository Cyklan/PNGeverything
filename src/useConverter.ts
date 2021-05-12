import { useEffect } from "react";
import { decode, encode } from "./converter";
import createPNG from "./createPNG";

export default function useConverter(file?: File) {
  useEffect(() => {
    if (file == null) {
      return;
    }

    if (file.name.endsWith(".png")) {
      decode(file);
      return;
    }

    encode(file).then((array) => {
      createPNG(array, file.name);
    });
  }, [file]);
}
