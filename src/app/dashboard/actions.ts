"use server";

import { db } from "@/db";
import { OrderStatus } from "@prisma/client";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const changeOrderStatus = async ({
  id,
  newStatus,
}: {
  id: string;
  newStatus: OrderStatus;
}) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();
  if (!user || user.email !== process.env.ADMIN_EMAIL) {
    throw new Error("Not authorized");
  }

  await db.order.update({
    where: { id },
    data: { status: newStatus },
  });
};
