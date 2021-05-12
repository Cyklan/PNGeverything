import { useEffect } from "react";
import { decode, encode } from "./converter";

export default function useConverter(file?: File) {

  useEffect(() => {
    if (file == null) {
      return;
    }

    if (file.name.endsWith(".png")) {
      decode(file);
    }

    encode(file);
  }, [file]);
}