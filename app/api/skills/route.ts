import { Prisma } from "@/src/generated/prisma/client";
import { prisma } from "@/src/lib/db/prisma";
import { getSession } from "@/src/lib/session";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Not logged in" }, { status: 401 });
  }
  const { name } = await request.json();
  const normalizedName = typeof name === "string" ? name.trim() : "";
  if (!normalizedName || normalizedName.length > 50) {
    return Response.json(
      { error: "Enter a skill(max 50 characters)" },
      { status: 400 },
    );
  }

  const skillExist = await prisma.skills.findFirst({
    where: { name: { equals: normalizedName, mode: "insensitive" } },
  });

  if (skillExist) {
    return Response.json({ error: "Skill already exists" }, { status: 409 });
  }

  try {
    const skill = await prisma.skills.create({
      data: { name: normalizedName },
    });

    return Response.json(skill, { status: 201 });
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      return Response.json({ error: "Skill already exists" }, { status: 409 });
    }
    throw e;
  }
}

export async function GET() {
  const skills = await prisma.skills.findMany({ orderBy: { name: "asc" } });

  return Response.json(skills, { status: 200 });
}
