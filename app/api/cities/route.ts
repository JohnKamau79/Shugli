import { prisma } from "@/src/lib/db/prisma"

export async function GET() {
    const cities = await prisma.city.findMany();
    return Response.json(cities)
}