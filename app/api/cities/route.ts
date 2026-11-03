import { prisma } from "@/src/lib/db/prisma";
import { getSession } from "@/src/lib/session";

export async function POST(request: Request) {
    const session = await getSession();
    if (!session) Response.json({ error: "Not logged in" }, { status: 401 });

    const { name } = await request.json();

    if (typeof name !== "string" || !name.trim()) {
        return Response.json({ error: "Fill in city" }, { status: 400 });
    }

    const normalizedName = name.trim();

    const sameCity = await prisma.city.findFirst({ where: { name: { equals: normalizedName, mode: "insensitive" } } });
    if (sameCity) {
        return Response.json({ error: "City already exists" }, { status: 409 });
    }

    const city = await prisma.city.create({
        data: {
            name: normalizedName,
        }
    });

    return Response.json(city, { status: 201 });
}

export async function GET() {
    const cities = await prisma.city.findMany({ orderBy: { id: "desc" } });
    return Response.json(cities, { status: 200 });
}