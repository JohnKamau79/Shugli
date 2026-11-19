import { sessionCheck } from "@/lib/utils/sessionCheck";
import { clean } from "@/lib/utils/trim";
import { prisma } from "@/src/lib/db/prisma";

export async function GET() {
  const userId = await sessionCheck();

  if (userId instanceof Response) return userId;

  const languages = await prisma.languages.findMany({
    orderBy: {
      name: "asc",
    },
  });

  return Response.json(languages, { status: 200 });
}

export async function POST(request: Request) {
  const userId = await sessionCheck();
  if (userId instanceof Response) return userId;

  const { name } = await request.json();

  if (!name) {
    return Response.json({ error: "Missing field" }, { status: 400 });
  }

  const normalizedName = clean(name);

  const languageExists = await prisma.languages.findFirst({
    where: {
      name: { equals: normalizedName, mode: "insensitive" },
    },
  });

  if (languageExists) {
    return Response.json({ error: "Language exists" }, { status: 409 });
  }

  const language = await prisma.languages.create({
    data: {
      name: normalizedName,
    },
  });

  return Response.json(language, { status: 201 });
}

export async function DELETE(request: Request) {
  const userId = await sessionCheck();
  if (userId instanceof Response) return userId;

  const { id } = await request.json();

  await prisma.languages.deleteMany({
    where: {
      id: id,
    },
  });

  return Response.json("Language deleted successfully")
}
