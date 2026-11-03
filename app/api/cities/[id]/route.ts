import { prisma } from "@/src/lib/db/prisma";
import { getSession } from "@/src/lib/session";
import { error } from "console";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const cityId = Number(id);

    const city = await prisma.city.findUnique({ where: { id: cityId } });

    if (!city) {
        return Response.json({ error: "City not found" });
    }

    const { name } = await request.json();
    if (typeof name !== "string" || !name.trim()) {
        return Response.json({ error: "Wrong naming" });
    }

    const updated = await prisma.city.update({
        where: { id: cityId },
        data: {
            ...(name !== undefined && { name })
        }
    });
    return Response.json(updated, { status: 200 });
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const session = await getSession();
    if (!session) {
        return Response.json({ error: "You're not logged in" }, { status: 409 });
    }
    const { id } = await params;
    const cityId = Number(id);

    await prisma.city.delete({ where: { id: cityId } });
    return Response.json("Successfully deleted city");
}