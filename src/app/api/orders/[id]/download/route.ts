import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function GET(req: Request, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    return new NextResponse("Not found", { status: 404 });
  }

  const order = await db.order.findUnique({
    where: { id: params.id },
    include: { configuration: true },
  });
  if (!order) return new NextResponse("Not found", { status: 404 });

  const { searchParams } = new URL(req.url);
  const wantsOriginal = searchParams.get("type") === "original";
  const fileUrl = wantsOriginal
    ? order.configuration.imageUrl
    : (order.configuration.croppedImageUrl ?? order.configuration.imageUrl);

  const upstream = await fetch(fileUrl);
  if (!upstream.ok) {
    return new NextResponse("Could not fetch file", { status: 502 });
  }

  const contentType = upstream.headers.get("content-type") ?? "image/png";
  const ext = contentType.split("/")[1]?.split(";")[0] ?? "png";
  const filename = `order-${order.id}-${wantsOriginal ? "original" : "design"}.${ext}`;

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
