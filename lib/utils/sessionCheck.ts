import { getSession } from "@/src/lib/session";

export async function sessionCheck() {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "User not logged in" }, { status: 401 });
  }

  const userId = session.userId

  return userId;
}
