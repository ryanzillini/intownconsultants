const MAX_EDGE = 2400;
const JPEG_QUALITY = 0.82;

function loadImage(file: File) {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve(image);
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read this photo — try JPEG or PNG"));
    };
    image.src = url;
  });
}

export async function prepareImage(file: File) {
  const image = await loadImage(file);
  const longest = Math.max(image.width, image.height);
  const scale = longest > MAX_EDGE ? MAX_EDGE / longest : 1;
  const width = Math.max(1, Math.round(image.width * scale));
  const height = Math.max(1, Math.round(image.height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const context = canvas.getContext("2d");
  if (!context) {
    throw new Error("Could not process this photo");
  }
  context.drawImage(image, 0, 0, width, height);
  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (result) resolve(result);
        else reject(new Error("Could not compress this photo"));
      },
      "image/jpeg",
      JPEG_QUALITY,
    );
  });
  return { blob, width, height };
}

export function safeFilename(name: string) {
  const base = name.replace(/\.[^.]+$/, "").toLowerCase();
  const slug = base.replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  return `${slug || "photo"}.jpg`;
}
