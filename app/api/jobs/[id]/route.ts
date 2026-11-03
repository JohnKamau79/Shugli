import { prisma } from "@/src/lib/db/prisma";
import { getSession } from "@/src/lib/session";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
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

    if (job.userId !== session.userId) {
        return Response.json({ error: "Not your job" }, { status: 403 });
    }

    const { title, jobType, description, cityId, categoryId, salary, expiresAt } = await request.json();

    if (!title || !jobType || !description || !cityId || !categoryId || !salary) {
        return Response.json({ error: "Missing fields" }, { status: 400 });
    }
    if (!["Remote", "Onsite", "Hybrid"].includes(jobType)) {
        return Response.json({ error: "Invalid job type" }, { status: 400 });
    }

    const updated = await prisma.jobs.update({
        where: { id: jobId },
        data: {
            ...(title !== undefined && { title }),
            ...(jobType !== undefined && { jobType }),
            ...(description !== undefined && { description }),
            ...(cityId !== undefined && { cityId }),
            ...(categoryId !== undefined && { categoryId }),
            ...(salary !== undefined && { salary }),
            ...(expiresAt !== undefined && { expiresAt: expiresAt ? new Date(expiresAt) : null }),
        },
    });

    return Response.json(updated, { status: 200 });


}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const jobId = Number(id);

    await prisma.jobs.delete({ where: { id: jobId } });
    return Response.json("Deleted successfully", { status: 200 });

}