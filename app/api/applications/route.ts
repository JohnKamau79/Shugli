import { prisma } from "@/src/lib/db/prisma";
import { getSession } from "@/src/lib/session";

export async function GET() {
    const session = await getSession();
    if (!session) {
        return Response.json({ error: "Not logged in" }, { status: 401 });
    }
    const applications = await prisma.application.findMany({
        where: {
            userId: session.userId,
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