import { deleteSession } from "@/src/lib/session";

export async function POST() {
    await deleteSession();
    return Response.json("You've logged out")
}