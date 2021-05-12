import { saveAs } from "file-saver";

export default function createPNG(data: Uint8Array, fileName: string) {
  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");
  const imageSize = Math.ceil(Math.sqrt(data.length / 4));
  canvas.width = canvas.height = imageSize;

  const imageData = context?.createImageData(imageSize, imageSize);

  if (imageData == null) return;
  const iData = imageData?.data;
  if (iData == null) return;
  for (let i = 0; i < data.length; i++) {
    iData[i] = data[i] ?? 0;
  }

  context?.putImageData(imageData, 0, 0);
  canvas.toBlob((blob) => {
    if (blob === null) return;
    saveAs(blob, fileName);
  });
}
