import bcrypt from "bcryptjs";
import { prisma } from "@/src/lib/db/prisma"

export async function POST(request: Request) {
    const body = await request.json()
    const { firstName, lastName, email, phone, password, gender, role, cityId } = body;

    if (!firstName || !lastName || !email || !phone || !password || !gender || !role || !cityId) {
        return Response.json({ error: "Missing fields" }, { status: 400 })
    }

    if (!["Employer", "Applicant", "Worker", "Customer"].includes(role)) {
        return Response.json({ error: "Invalid role" }, { status: 400 })
    }

    const passwordHash = await bcrypt.hash(password, 10)

    try {
        const user = await prisma.users.create({
            data: { firstName, lastName, email, phone, passwordHash, gender, role, cityId },
            select: { id: true, firstName: true, email: true, role: true, city: { select: { id: true, name: true } } },
        });

        return Response.json(user, { status: 201 })

    }
    catch {
        return Response.json({ error: "Email or phone already in use" }, { status: 409 });
    }
}