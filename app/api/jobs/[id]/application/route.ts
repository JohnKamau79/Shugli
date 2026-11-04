import { Prisma } from "@/src/generated/prisma/client";
import { prisma } from "@/src/lib/db/prisma";
import { getSession } from "@/src/lib/session";

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) {
        return Response.json({ error: "Not logged in" }, { status: 401 });
    }

    const { id } = await params;
    const jobId = Number(id);

    if (!Number.isInteger(jobId)) {
        return Response.json({ error: "Invalid job id" }, { status: 400 });
    }

    const job = await prisma.jobs.findUnique({ where: { id: jobId } });
    if (!job) {
        return Response.json({ error: "Job not found" }, { status: 404 });
    }

    if (job.userId == session.userId) {
        return Response.json({ error: "Not allowed to apply to your own job" }, { status: 403 });
    }

    try {
        const application = await prisma.application.create({
            data: {
                userId: session.userId,
                jobId: jobId,
            }
        });

        return Response.json(application, { status: 201 });
    } catch (e) {
        if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === "P2002") {
            return Response.json({ error: "You've already applied to this job!" }, { status: 409 });
        }
        throw e;
    }
}


export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) {
        return Response.json({ error: "Not logged in" }, { status: 401 });
    }

    const { id } = await params;
    const jobId = Number(id);

    const applications = await prisma.application.findMany({
        where: {
            jobId: jobId,
            userId: session.userId,
        },
        include: {
            job: {
                select: { title: true, jobType: true, city: { select: { name: true } }, category: { select: { name: true } }, salary: true, employer: { select: { firstName: true, lastName: true } }, createdAt: true }
            },
            // city: {select: name: true},
        }
    });

    if (!applications) {
        return Response.json({ error: "No applications available for this job!" }, { status: 404 });
    }

    return Response.json(applications, { status: 200 });
}