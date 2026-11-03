import { prisma } from "@/src/lib/db/prisma";

export async function POST(request: Response) {
    const { name } = await request.json();
    const normalizedName = name.trim();

    const skillExist = await prisma.skills.findFirst({ where: { name: { equals: normalizedName, mode: "insensitive" } } })

    if (skillExist) {
        return Response.json({ error: "Skill already exists" });
    }

    const skill = await prisma.skills.create({
        data: {
            name,
        }
    });

    return Response.json(skill, { status: 200 });
}

export async function GET() {
    const skills = await prisma.skills.findMany({ orderBy: { id: "desc" } });

    return Response.json(skills, { status: 200 });
}