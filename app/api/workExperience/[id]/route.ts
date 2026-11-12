import { prisma } from "@/src/lib/db/prisma";
import { getSession } from "@/src/lib/session";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await getSession();
  if (!session)
    return Response.json({ error: "Not logged in" }, { status: 409 });

  const { id } = await params;
  const experienceId = Number(id);

  const userId = session.userId;

  const { jobTitle, company, doEntry, doExit, cityId, skills, achievements } =
    await request.json();

  const workExperience = await prisma.workExperience.updateMany({
    where: {
      userId: userId,
      id: experienceId,
    },
    data: {
      ...(jobTitle !== undefined && { jobTitle }),
      ...(company !== undefined && { company }),
      ...(doEntry !== undefined && { doEntry: new Date(doEntry) }),
      ...(doExit !== undefined && { doExit: doExit ? new Date(doExit) : null }),
      ...(cityId !== undefined && { cityId: Number(cityId) }),
      ...(skills !== undefined && { skills }),
      ...(achievements !== undefined && { achievements }),
    },
  });

  if (workExperience.count === 0) {
    return Response.json(
      { error: "Work experience not found" },
      { status: 404 },
    );
  }

  const updatedExperience = await prisma.workExperience.findFirst({
    where: {
      id: experienceId,
      userId: userId,
    },
    include: {
      city: true,
    },
  });

  return Response.json(updatedExperience, { status: 200 });
}
