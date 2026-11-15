import { clean } from "@/lib/utils/trim";
import { prisma } from "@/src/lib/db/prisma";
import { getSession } from "@/src/lib/session";

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) Response.json({ error: "Not logged in" }, { status: 400 });

  const { name, description } = await request.json();

  if (!name || !description) {
    return Response.json({ error: "Missing field" }, { status: 400 });
  }

  const normalizedName = clean(name);
  const normalizedDescription = clean(description);

  const category = await prisma.category.create({
    data: {
      name: normalizedName,
      description: normalizedDescription,
    },
  });

  return Response.json(category, { status: 200 });
}

export async function GET() {
  const categories = await prisma.category.findMany({
    orderBy: { id: "desc" },
  });

  if (!categories) {
    return Response.json({ error: "No jobs exist" }, { status: 201 });
  }
  return Response.json(categories, { status: 200 });
}
