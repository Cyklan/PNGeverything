import FileSaver from "file-saver";
import { useEffect } from "react";
import { decode, encode } from "./converter";

export default function useConverter(file?: File) {

  useEffect(() => {
    if (file == null) {
      return;
    }
    console.log(file.name);
    if (file.name.endsWith(".png")) {
      decode(file)
        .then(res => FileSaver.saveAs(new Blob([res.bytes]), res.fileName));
      return;
    }

    encode(file)
      .then(png => {
        FileSaver.saveAs(new Blob([png]), file.name + ".png");
      });
  }, [file]);
}