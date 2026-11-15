import { sessionCheck } from "@/lib/utils/sessionCheck";
import { clean } from "@/lib/utils/trim";
import { prisma } from "@/src/lib/db/prisma";

export async function GET() {
  const userId = await sessionCheck();

  if (userId instanceof Response) return userId;

  const cert = await prisma.certification.findMany({
    where: {
      userId: Number(userId),
    },
    orderBy: {
      issueDate: "desc",
    },
  });

  if (cert.length === 0) {
    return Response.json({ error: "You have no certification!" });
  }
  return Response.json(cert, { status: 200 });
}

export async function POST(request: Request) {
  const userId = await sessionCheck();

  if (userId instanceof Response) return userId;

  const { name, issueDate } = await request.json();

  if (!name || !issueDate) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  const normalizedName = clean(name);

  const cert = await prisma.certification.create({
    data: {
      userId: userId,
      name: normalizedName,
      issueDate: new Date(issueDate),
    },
  });

  return Response.json(cert, { status: 201 });
}
