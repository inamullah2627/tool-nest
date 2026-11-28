import { zipSync } from "fflate";

export async function createImageZip(
  files: Array<{ name: string; blob: Blob }>,
) {
  const entries: Record<string, Uint8Array> = {};
  for (const file of files) {
    let name = file.name;
    let index = 2;
    while (entries[name]) {
      const dot = file.name.lastIndexOf(".");
      name =
        dot < 0
          ? `${file.name}-${index}`
          : `${file.name.slice(0, dot)}-${index}${file.name.slice(dot)}`;
      index += 1;
    }
    entries[name] = new Uint8Array(await file.blob.arrayBuffer());
  }
  return new Blob([zipSync(entries, { level: 0 }) as BlobPart], {
    type: "application/zip",
  });
}
