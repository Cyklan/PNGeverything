import { DragEvent, useState } from "react";
import "./DropContainer.css";
import useConverter from "./useConverter";

export function DropContainer() {

  const [file, setFile] = useState<File>();
  useConverter(file);

  function preventDefault(event: DragEvent) {
    event.preventDefault();
  }

  return (
    <div className="dropcontainer" onDragOver={preventDefault} onDragEnter={preventDefault} onDrop={event => {
      event.preventDefault();
      const files = event.dataTransfer.files;
      if (files.length > 1) return;
      setFile(files[0]);
    }}>
      DROP FILE HERE
    </div>
  );
}