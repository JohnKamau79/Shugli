import { clean } from "@/lib/utils/trim";
import { prisma } from "@/src/lib/db/prisma";
import { getSession } from "@/src/lib/session";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "You're not logged in" }, { status: 401 });
  }
  const { jobTitle, company, doEntry, doExit, cityId, skills, achievements } =
    await request.json();

  const title = clean(jobTitle);
  const companyName = clean(company);

  if (
    !title ||
    !companyName ||
    !doEntry ||
    !cityId ||
    !Array.isArray(skills) ||
    skills.length === 0 ||
    !Array.isArray(achievements) ||
    achievements.length === 0
  ) {
    return Response.json({ error: "Missing field" }, { status: 400 });
  }

  const workExperience = await prisma.workExperience.create({
    data: {
      userId: session.userId,
      jobTitle: title,
      company: companyName,
      doEntry: new Date(doEntry),
      doExit: doExit ? new Date(doExit) : null,
      cityId: Number(cityId),
      skills,
      achievements,
    },
    include: {
      city: true,
    },
  });

  return Response.json(workExperience, { status: 200 });
}

export async function GET() {
  const session = await getSession();

  if (!session) {
    return Response.json({ error: "Not logged in" }, { status: 401 });
  }

  const userId = session.userId;

  const workExperience = await prisma.workExperience.findMany({
    where: { userId: userId },
    include: { city: { select: { name: true } } },
  });

  return Response.json(workExperience, { status: 200 });
}
