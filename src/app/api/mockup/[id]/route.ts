import { db } from "@/db";
import { generateMockup } from "@/lib/mockup";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
  const { id } = await props.params;

  const configuration = await db.configuration.findUnique({ where: { id } });
  if (!configuration) return new NextResponse("Not found", { status: 404 });

  const w = Number(new URL(req.url).searchParams.get("w")) || undefined;
  const width = w ? Math.min(Math.max(w, 100), 1200) : undefined;

  try {
    const png = await generateMockup(configuration, width);
    return new NextResponse(new Uint8Array(png), {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch (err) {
    console.error(err);
    return new NextResponse("Could not generate mockup", { status: 502 });
  }
}
