import { clean } from "@/lib/utils/trim";
import { prisma } from "@/src/lib/db/prisma";
import { getSession } from "@/src/lib/session";

export async function POST(request: Request) {
  const session = await getSession();

  if (!session) {
    return Response.json({ error: "Not logged in" }, { status: 401 });
  }

  const userId = session.userId;

  const { institute, level, course, doEntry, doExit } = await request.json();

  const edInstitute = clean(institute);
  const edCourse = clean(course);

  if (!edInstitute || !edCourse || !doEntry) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  const workerEducation = await prisma.workerEducation.create({
    data: {
      userId: userId,
      institute: edInstitute,
      level,
      course: edCourse,
      doEntry: new Date(doEntry),
      doExit: doExit ? new Date(doExit) : null,
    },
  });

  return Response.json(workerEducation, { status: 200 });
}

export async function GET() {
  const session = await getSession();

  if (!session) {
    return Response.json({ error: "Not logged in" }, { status: 401 });
  }

  const workerEducation = await prisma.workerEducation.findMany({
    where: { userId: session.userId },
  });

  return Response.json(workerEducation, { status: 200 });
}
