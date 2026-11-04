import { prisma } from "@/src/lib/db/prisma";
import { getSession } from "@/src/lib/session";

export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) {
        return Response.json({ error: "Not logged in" }, { status: 401 });
    }

    const { id } = await params;
    const jobId = Number(id);

    if (!Number.isSafeInteger(jobId) || jobId <= 0) {
        return Response.json({ error: "Invalid application ID" }, { status: 400 })
    }

    const employerApplications = await prisma.application.findMany({
        where: {
            jobId: jobId,
            job: { userId: session.userId }
        },
        include: {
            job: {
                select: { title: true, jobType: true, city: { select: { name: true } }, category: { select: { name: true } }, salary: true, employer: { select: { firstName: true, lastName: true, email: true } }, createdAt: true }
            },
        }
    });

    return Response.json(employerApplications, { status: 200 });
}