import { sessionCheck } from "@/lib/utils/sessionCheck";
import { prisma } from "@/src/lib/db/prisma";
import { deleteSession } from "@/src/lib/session";

export async function GET() {
  const userId = await sessionCheck();
  if (userId instanceof Response) return userId;

  const user = await prisma.users.findUnique({
    where: {
      id: Number(userId),
    },
  });

  if (!user) {
    return Response.json({ error: "User not found" }, { status: 404 });
  }
  return Response.json(user, { status: 200 });
}

export async function PATCH(request: Request) {
  const userId = await sessionCheck();
  if (userId instanceof Response) return userId;

  const { firstName, lastName, email, phone, gender, cityId } =
    await request.json();

  if (!firstName || !lastName || !email || !phone || !gender || !cityId) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  const user = await prisma.users.update({
    where: {
      id: userId,
    },
    data: {
      ...(firstName !== undefined && { firstName }),
      ...(lastName !== undefined && { lastName }),
      ...(email !== undefined && { email }),
      ...(phone !== undefined && { phone }),
      ...(gender !== undefined && { gender }),
      ...(cityId !== undefined && { cityId }),
    },
  });

  return Response.json(user);
}

export async function DELETE() {
  const userId = await sessionCheck();
  if (userId instanceof Response) return userId;

  await prisma.users.deleteMany({
    where: {
      id: userId,
    },
  });

  await deleteSession();

  return Response.json("Deleted successfully");
}
