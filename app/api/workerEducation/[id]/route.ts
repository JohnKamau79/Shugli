import { prisma } from "@/src/lib/db/prisma";
import { getSession } from "@/src/lib/session";

{
  /* id        Int
    userId    Int
    user      Users
    institute String
    level     EducationLevel
    course    String
    doEntry   DateTime
    doExit    DateTime? */
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Not logged in" }, { status: 401 });
  }

  const { id } = await params;
  const educationId = Number(id);

  const { institute, level, course, doEntry, doExit } = await request.json();

  if (!institute || !level || !course || !doEntry) {
    return Response.json({ error: "Missing field" }, { status: 400 });
  }

  const result = await prisma.workerEducation.updateMany({
    where: {
      userId: session.userId,
      id: educationId,
    },

    data: {
      ...(institute !== undefined && { institute }),
      ...(level !== undefined && { level }),
      ...(course !== undefined && { course }),
      ...(doEntry !== undefined && { doEntry: new Date(doEntry) }),
      ...(doExit !== undefined && { doExit: doExit ? new Date(doExit) : null }),
    },
  });

  if (result.count === 0) {
    return Response.json({ error: "Education not found" }, { status: 404 });
  }

  const updatedEducation = await prisma.workerEducation.findUnique({
    where: {
      id: educationId,
    },
  });

  return Response.json(updatedEducation, { status: 200 });
}
