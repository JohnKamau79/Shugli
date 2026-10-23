import { jwtVerify, SignJWT } from "jose"
import { cookies } from "next/headers";

const key = new TextEncoder().encode(process.env.SESSION_SECRET)

export async function createSession(userId: number, role: string) {
    const token = await new SignJWT({ userId, role })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime("1d")
        .sign(key);

    (await cookies()).set("session", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 7,
        path: "/"
    });
}

export async function getSession() {
    const token = (await cookies()).get("session")?.value;
    if (!token) return null

    try {
        const { payload } = await jwtVerify(token, key)
        return payload as { userId: number, role: string }
    }
    catch {
        return null
    }

}

export async function deleteSession() {
    (await cookies()).delete("session");

}