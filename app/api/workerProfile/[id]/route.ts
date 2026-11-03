import { prisma } from "@/src/lib/db/prisma";
import { getSession } from "@/src/lib/session";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) {
        return Response.json({ error: "Not logged in" }, { status: 409 });
    }
    const { id } = await params;
    const workerProfileId = Number(id);

    const { headline, bio, yoe, categoryId } = await request.json();

    const workerProfile = await prisma.workerProfile.update({
        where: {
            id: workerProfileId,
        },
        data: {
            ...(headline !== undefined && { headline }),
            ...(bio !== undefined && { bio }),
            ...(yoe !== undefined && { yoe }),
            ...(categoryId !== undefined && { categoryId }),
        }
    });

    return Response.json(workerProfile, { status: 200 });

}


export async function DELETE() {
    const session = await getSession();
    if (!session) {
        return Response.json({ error: "You're not logged in" }, { status: 401 });
    }
    // const { id } = await params;
    // const workerProfileId = Number(id);

    const workerProfile = await prisma.workerProfile.findUnique({ where: { userId: session.userId } });
    if (!workerProfile) {
        return Response.json({ error: "Profile not found" }, { status: 404 });
    }

    await prisma.workerProfile.delete({ where: { id: workerProfile.id } });

    return Response.json("Worker Profile deleted successfully", { status: 200 });
}