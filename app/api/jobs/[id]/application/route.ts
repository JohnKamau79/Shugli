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



// export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
//     const { id } = await params;
//     const jobId = Number(id);

//     await prisma.jobs.delete({ where: { id: jobId } });
//     return Response.json("Deleted successfully", { status: 200 });

// }


// id        Int      @id @default(autoincrement())
//   userId    Int
//   user      Users    @relation(fields: [userId], references: [id])
//   jobId     Int
//   job       Jobs     @relation(fields: [jobId], references: [id])
//   createdAt DateTime @default(now())
//   status    Status   @default(Pending)