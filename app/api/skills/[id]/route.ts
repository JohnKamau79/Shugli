import { prisma } from "@/src/lib/db/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const skillId = Number(id);

    const { name } = await request.json();

    const normalizedName = name.trim();

    const skillExist = await prisma.skills.findFirst({ where: { name: { equals: normalizedName, mode: "insensitive" } } });

    if (skillExist) {
        return Response.json({ error: "Skill already exists" });
    }

    const skill = await prisma.skills.update({
        where: {
            id: skillId
        },
        data: {
            ...(name !== undefined && { name })
        }
    });

    return Response.json(skill, { status: 200 });

}


export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const skillId = Number(id);

    await prisma.skills.delete({ where: { id: skillId } });
    return Response.json("Skills has been deleted successfuly", { status: 200 });
}