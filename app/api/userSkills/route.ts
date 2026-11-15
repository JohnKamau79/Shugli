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

  const alreadyHas = await prisma.users.findFirst({
    where: {
      id: session.userId,
      skills: {
        some: {
          name: {
            equals: normalizedName,
            mode: "insensitive",
          },
        },
      },
    },
  });

  if (alreadyHas) {
    return Response.json(
      { error: "You already possess this skill!" },
      { status: 400 },
    );
  }

  const existingSkill = await prisma.skills.findFirst({
    where: {
      name: { equals: normalizedName, mode: "insensitive" },
    },
  });

  const capitalize = normalizedName.charAt(0).toUpperCase() + normalizedName.slice(1)


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
            name: capitalize,
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

  const { id } = await request.json();
  if (!Number(id)) {
    return Response.json({ error: "Invalid skill" }, { status: 400 });
  }
  const user = await prisma.users.update({
    where: {
      id: session.userId,
    },
    data: {
      skills: {
        disconnect: {
          id: id,
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
