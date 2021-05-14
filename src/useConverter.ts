import FileSaver from "file-saver";
import { useEffect, useState } from "react";
import { decode, encode } from "./converter";

export default function useConverter(file?: File) {

  const [converting, setConverting] = useState(false);

  useEffect(() => {
    if (file == null) {
      return;
    }
    setConverting(true);
    if (file.name.endsWith(".png")) {
      decode(file)
        .then(res => FileSaver.saveAs(new Blob([res.bytes]), res.fileName))
        .then(() => setConverting(false));
      return;
    }

    encode(file)
      .then(png => {
        FileSaver.saveAs(new Blob([png]), file.name + ".png");
      }).then(() => setConverting(false));
  }, [file]);

  return converting;
}
