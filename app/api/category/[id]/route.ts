import { prisma } from "@/src/lib/db/prisma";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const categoryId = Number(id);

    const category = await prisma.category.findUnique({ where: { id: categoryId } });

    if (!category) {
        return Response.json({ error: "Category not found" }, { status: 404 });
    }

    const { name } = await request.json();

    if (typeof name !== "string" || !name.trim()) {
        Response.json({ error: "Fill in category" });
    }

    const updated = await prisma.category.update({
        where: { id: categoryId },
        data: {
            ...(name !== undefined && { name })
        }
    });

    return Response.json(updated);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const categoryId = Number(id);

    await prisma.category.delete({ where: { id: categoryId } });
    return Response.json("Category deleted successfully", { status: 200 });
}