import { readFile } from "fs/promises";
import { join } from "path";

export async function getLogoDataUri() {
  const logoData = await readFile(
    join(process.cwd(), "public/images/neura-logo.png")
  );
  return `data:image/png;base64,${logoData.toString("base64")}`;
}
