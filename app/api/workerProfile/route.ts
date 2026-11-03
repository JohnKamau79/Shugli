import { prisma } from "@/src/lib/db/prisma";
import { getSession } from "@/src/lib/session";

export async function POST(request: Request) {
    const session = await getSession();
    if (!session) {
        return Response.json({ error: "You're not logged in" }, { status: 401 });
    }
    const { headline, bio, yoe, categoryId } = await request.json();

    const profileExist = await prisma.workerProfile.findUnique({ where: { userId: session.userId } });
    if (profileExist) {
        return Response.json({ error: "You already have a profile" });
    }

    const workerProfile = await prisma.workerProfile.create({
        data: {
            userId: session.userId,
            headline,
            bio,
            yoe,
            categoryId,
        }
    });

    return Response.json(workerProfile, { status: 200 });
}

export async function GET() {
    const session = await getSession();

    if (!session) {
        return Response.json({ error: "Not logged in" }, { status: 401 });
    }

    const userId = session.userId

    const workerProfile = await prisma.workerProfile.findUnique({ where: { userId: userId }, include: { category: { select: { name: true } }, user: { select: { firstName: true } } } });

    if(!workerProfile) {
        return Response.json({error: "Profile is null"}, {status: 404});
    }

    return Response.json(workerProfile, { status: 200 });
}