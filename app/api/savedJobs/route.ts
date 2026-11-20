import { sessionCheck } from "@/lib/utils/sessionCheck";
import { prisma } from "@/src/lib/db/prisma";
import { error } from "console";

export async function GET() {
  const userId = await sessionCheck();
  if (userId instanceof Response) return userId;

  const saved = await prisma.savedJobs.findMany({
    where: {
      userId: Number(userId),
    },
    select: {
      job: {
        select: {
          id: true,
          title: true,
          jobType: true,
          duration: true,
          company: true,
          city: { select: { name: true } },
          category: { select: { name: true } },
          salary: true,
          employer: { select: { firstName: true, lastName: true } },
          createdAt: true,
        },
      },
    },
  });

  return Response.json(saved);
}

export async function POST(request: Request) {
  const userId = await sessionCheck();
  if (userId instanceof Response) return userId;

  const { id } = await request.json();
  const jobId = Number(id);

  const existing = await prisma.savedJobs.findUnique({
    where: {
      userId_jobId: {
        userId: Number(userId),
        jobId: jobId,
      },
    },
  });

  if (existing) {
    await prisma.savedJobs.delete({
      where: {
        userId_jobId: {
          userId: Number(userId),
          jobId: jobId,
        },
      },
    });

    return Response.json({ saved: false });
  }

  const saved = await prisma.savedJobs.create({
    data: {
      userId: Number(userId),
      jobId: jobId,
    },
  });

  if (!saved) {
    return false;
  }

  return Response.json({ saved: true });
}
