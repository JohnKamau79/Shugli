import { prisma } from "@/src/lib/db/prisma";
import { getSession } from "@/src/lib/session";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "You're not logged in" }, { status: 401 });
  }
  const { headline, bio, yoe, categoryId } = await request.json();

  const cId = Number(categoryId);
  const years = Number(yoe);

  const profileExist = await prisma.workerProfile.findUnique({
    where: { userId: session.userId },
  });
  if (profileExist) {
    return Response.json({ error: "You already have a profile" });
  }

  if (!headline || !bio || !yoe || !categoryId) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  const workerProfile = await prisma.workerProfile.create({
    data: {
      userId: session.userId,
      headline,
      bio,
      yoe: years,
      categoryId: cId,
    },
  });

  return Response.json(workerProfile, { status: 200 });
}

export async function GET() {
  const session = await getSession();

  if (!session) {
    return Response.json({ error: "Not logged in" }, { status: 401 });
  }

  const userId = session.userId;

  const workerProfile = await prisma.workerProfile.findUnique({
    where: { userId: userId },
    include: {
      category: { select: { name: true } },
      user: { select: { firstName: true } },
    },
  });

  if (!workerProfile) {
    return Response.json({ error: "Profile is null" }, { status: 404 });
  }

  return Response.json(workerProfile, { status: 200 });
}

export async function PATCH(request: Request) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Not logged in" }, { status: 409 });
  }

  const { headline, bio, yoe, categoryId } = await request.json();

  await prisma.workerProfile.update({
    where: {
      userId: session.userId,
    },
    data: {
      ...(headline !== undefined && { headline }),
      ...(bio !== undefined && { bio }),
      ...(yoe !== undefined && { yoe: Number(yoe) }),
      ...(categoryId !== undefined && { categoryId: Number(categoryId) }),
    },
  });

  const updatedWorkerProfile = await prisma.workerProfile.findUnique({
    where: {
      userId: session.userId,
    },
    include: {
      category: {
        select: {
          name: true,
        },
      },
    },
  });

  return Response.json(updatedWorkerProfile, { status: 200 });
}

export async function DELETE() {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "You're not logged in" }, { status: 401 });
  }

  const workerProfile = await prisma.workerProfile.findUnique({
    where: { userId: session.userId },
  });
  if (!workerProfile) {
    return Response.json({ error: "Profile not found" }, { status: 404 });
  }

  await prisma.workerProfile.delete({ where: { id: workerProfile.id } });

  return Response.json("Worker Profile deleted successfully", { status: 200 });
}
