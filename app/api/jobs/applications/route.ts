import { prisma } from "@/src/lib/db/prisma";
import { getSession } from "@/src/lib/session";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) {
        return Response.json({ error: "Not logged in" }, { status: 401 });
    }

    const { id } = await params;
    const jobId = Number(id);

    // const job = await prisma.jobs.findUnique({ where: { id: jobId } });
    // if (!job) {
    //     return Response.json({ error: "No job found" }, { status: 404 });
    // }

    const applications = await prisma.application.findMany({
        where: {
            jobId: jobId,
        },
        include: {
            job: {
                select: { title: true, jobType: true, city: { select: { name: true } }, category: { select: { name: true } }, salary: true, employer: { select: { firstName: true, lastName: true } }, createdAt: true }
            },
            // city: {select: name: true},
        }
    });

    return Response.json(applications, { status: 200 });
}