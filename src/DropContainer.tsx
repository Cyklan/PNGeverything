import { DragEvent, useEffect, useState } from "react";
import "./DropContainer.css";
import useConverter from "./useConverter";

export function DropContainer() {

  const [file, setFile] = useState<File>();
  const [message, setMessage] = useState("DROP FILE HERE");
  const converting = useConverter(file);

  function preventDefault(event: DragEvent) {
    event.preventDefault();
  }

  useEffect(() => {
    setMessage(converting ? "CONVERTING..." : "DROP FILE HERE");
  }, [converting]);

  return (
    <div className="dropcontainer" onDragOver={preventDefault} onDragEnter={preventDefault} onDrop={event => {
      event.preventDefault();
      const files = event.dataTransfer.files;
      if (files.length !== 1) {
        setMessage("ONLY CONVERT ONE FILE");
        return;
      }
      if (files[0].size > 200 * 1024 * 1024) {
        setMessage("MAX FILE SIZE: 200MB");
        return;
      }
      setFile(files[0]);
    }}>
      {message}
    </div>
  );
}