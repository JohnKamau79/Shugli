import { prisma } from "@/src/lib/db/prisma";
import { createSession } from "@/src/lib/session";
import bcrypt from "bcryptjs";

export async function POST(request: Request) {
    const body = await request.json()
    const { email, password } = body;

    if (!email || !password) {
        return Response.json({ error: "Missing email or password" }, { status: 400 })
    }

    const user = await prisma.users.findUnique({ where: { email } })

    const valid = user && (await bcrypt.compare(password, user.passwordHash))

    if (!valid) {
        return Response.json({ error: "Invalid username or password" }, { status: 404 })
    }

    await createSession(user.id, user.role);

    return Response.json({
        id: user.id,
        firstName: user.firstName,
        email: user.email,
        role: user.role
    })

}