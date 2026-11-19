import { sessionCheck } from "@/lib/utils/sessionCheck";
import { clean } from "@/lib/utils/trim";
import { LanguageLevel } from "@/src/generated/prisma/enums";
import { prisma } from "@/src/lib/db/prisma";
import { error } from "console";

export async function POST(request: Request) {
  const userId = await sessionCheck();
  if (userId instanceof Response) return userId;

  const { langId, level } = await request.json();

  if (!langId || !level) {
    return Response.json({ error: "Missing field" }, { status: 400 });
  }

  const normalizedLevel = clean(level);

  const languageExists = await prisma.languages.findFirst({
    where: {
      id: Number(langId),
    },
  });

  if (!languageExists) {
    return Response.json({ error: "Language doesn't exist" }, { status: 404 });
  }

  const alreadyAdded = await prisma.userLanguages.findFirst({
    where: {
      userId: userId,
      langId: Number(langId),
    },
  });

  if (alreadyAdded?.langId) {
    return Response.json({ error: "Language already added!" }, { status: 409 });
  }

  const language = await prisma.userLanguages.create({
    data: {
      level: normalizedLevel as LanguageLevel,
      userId: userId,
      langId: Number(languageExists.id),
    },
    include: {
      language: {
        select: {
          name: true,
        },
      },
    },
  });

  return Response.json(language, { status: 201 });
}

export async function GET() {
  const userId = await sessionCheck();
  if (userId instanceof Response) return userId;

  const languages = await prisma.userLanguages.findMany({
    where: {
      userId: Number(userId),
    },
    include: {
      language: {
        select: {
          name: true,
        },
      },
    },
  });

  if (languages.length === 0) {
    return Response.json(
      { error: "No languages found for user" },
      { status: 404 },
    );
  }

  return Response.json(languages, { status: 200 });
}

export async function DELETE(request: Request) {
  const userId = await sessionCheck();
  if (userId instanceof Response) return userId;

  const { id } = await request.json();

  await prisma.userLanguages.deleteMany({
    where: {
      id: id,
      userId: Number(userId),
    },
  });

  return Response.json("User language deleted successfully!");
}
