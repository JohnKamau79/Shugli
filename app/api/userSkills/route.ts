import { prisma } from "@/src/lib/db/prisma";
import { getSession } from "@/src/lib/session";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Not logged in" }, { status: 401 });
  }

  const user = await prisma.users.findUnique({
    where: {
      id: session.userId,
    },
    select: {
      skills: {
        orderBy: {
          name: "asc",
        },
      },
    },
  });

  return Response.json(user?.skills ?? []);
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Not logged in" }, { status: 401 });
  }

  const { name } = await request.json();

  const normalizedName = typeof name === "string" ? name.trim() : "";
  if (!normalizedName || normalizedName.length > 50) {
    return Response.json(
      { error: "Enter a skill (max 50 characters)" },
      { status: 400 },
    );
  }

  const existingSkill = await prisma.skills.findFirst({
    where: {
      name: { equals: normalizedName, mode: "insensitive" },
    },
  });

  const user = await prisma.users.update({
    where: {
      id: session.userId,
    },

    data: {
      skills: {
        connectOrCreate: {
          where: {
            name: existingSkill?.name ?? normalizedName,
          },
          create: {
            name: normalizedName,
          },
        },
      },
    },

    select: {
      skills: {
        orderBy: {
          name: "asc",
        },
      },
    },
  });

  return Response.json(user.skills, { status: 201 });
}

export async function DELETE(request: Request) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Not logged in" }, { status: 401 });
  }

  const { skillId } = await request.json();
  if (!Number(skillId)) {
    return Response.json({ error: "Invalid skill" }, { status: 400 });
  }
  const user = await prisma.users.update({
    where: {
      id: session.userId,
    },
    data: {
      skills: {
        disconnect: {
          id: skillId,
        },
      },
    },
    select: {
      skills: {
        orderBy: {
          name: "asc",
        },
      },
    },
  });

  return Response.json(user.skills);
}
