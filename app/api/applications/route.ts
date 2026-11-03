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

// id           Int           @id @default(autoincrement())
//   title        String
//   jobType      JobType
//   description  String
//   cityId       Int
//   city         City          @relation(fields: [cityId], references: [id])
//   categoryId   Int
//   category     Category      @relation(fields: [categoryId], references: [id])
//   salary       Int?
//   userId       Int
//   employer     Users         @relation(fields: [userId], references: [id])
//   createdAt    DateTime      @default(now())
//   updatedAt    DateTime      @updatedAt
//   expiresAt    DateTime?
//   applications Application[]