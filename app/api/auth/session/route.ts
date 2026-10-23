import { getSession } from "@/src/lib/session";

export async function GET() {
    const session = await getSession();
    if (!session) return Response.json({ error: "No session" }, { status: 401 })
    return Response.json(session);
}