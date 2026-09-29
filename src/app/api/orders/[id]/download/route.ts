import { db } from "@/db";
import { generateMockup } from "@/lib/mockup";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
  req: Request,
  props: { params: Promise<{ id: string }> },
) {
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

  const type = new URL(req.url).searchParams.get("type");

  // Mockup (default): case color + photo + phone frame, flattened
  if (type !== "original" && type !== "print") {
    try {
      const png = await generateMockup(order.configuration);
      return new NextResponse(new Uint8Array(png), {
        headers: {
          "Content-Type": "image/png",
          "Content-Disposition": `attachment; filename="order-${order.id}-mockup.png"`,
        },
      });
    } catch (err) {
      console.error(err);
      return new NextResponse("Could not generate mockup", { status: 502 });
    }
  }

  const fileUrl =
    type === "original"
      ? order.configuration.imageUrl
      : (order.configuration.croppedImageUrl ?? order.configuration.imageUrl);

  const upstream = await fetch(fileUrl);
  if (!upstream.ok) {
    return new NextResponse("Could not fetch file", { status: 502 });
  }

  const contentType = upstream.headers.get("content-type") ?? "image/png";
  const ext = contentType.split("/")[1]?.split(";")[0] ?? "png";
  const filename = `order-${order.id}-${type}.${ext}`;

  return new NextResponse(upstream.body, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
