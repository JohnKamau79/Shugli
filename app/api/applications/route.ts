import { sessionCheck } from "@/lib/utils/sessionCheck";
import { prisma } from "@/src/lib/db/prisma";

export async function GET() {
  const userId = await sessionCheck();
  if (userId instanceof Response) return userId;
  const applications = await prisma.application.findMany({
    where: {
      userId: Number(userId),
    },
    include: {
      job: {
        select: {
          id: true,
          title: true,
          jobType: true,
          city: { select: { name: true } },
          category: { select: { name: true } },
          salary: true,
          employer: { select: { firstName: true, lastName: true } },
          createdAt: true,
        },
      },
      // city: {select: name: true},
    },
  });

  return Response.json(applications, { status: 200 });
}
