import sharp from "sharp";
import { readFile } from "fs/promises";
import path from "path";
import type { CaseColor, Configuration } from "@prisma/client";

// Tailwind hex values for the bg-* classes the designer uses.
// Verify these against COLORS in src/validators/option-validator.ts.
const COLOR_HEX: Record<CaseColor, string> = {
  black: "#18181b", // zinc-900
  blue: "#172554", // blue-950
  rose: "#4c0519", // rose-950
};

export async function generateMockup(
  configuration: Configuration,
  width?: number,
): Promise<Buffer> {
  const template = await readFile(
    path.join(process.cwd(), "public", "phone-template-white-edges.png"),
  );
  const { width: tw, height: th } = await sharp(template).metadata();
  if (!tw || !th) throw new Error("Could not read phone template");

  const res = await fetch(
    configuration.croppedImageUrl ?? configuration.imageUrl,
  );
  if (!res.ok) throw new Error(`Could not fetch design image (${res.status})`);
  const design = Buffer.from(await res.arrayBuffer());

  const designLayer = await sharp(design)
    .resize(tw, th, { fit: "cover" })
    .png()
    .toBuffer();

  const flat = await sharp({
    create: {
      width: tw,
      height: th,
      channels: 4,
      background: COLOR_HEX[configuration.color ?? "black"],
    },
  })
    .composite([{ input: designLayer }, { input: template }])
    .png()
    .toBuffer();

  return width ? sharp(flat).resize({ width }).png().toBuffer() : flat;
}
