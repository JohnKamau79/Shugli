import { sessionCheck } from "@/lib/utils/sessionCheck";
import { clean } from "@/lib/utils/trim";
import { prisma } from "@/src/lib/db/prisma";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await sessionCheck();

  if (userId instanceof Response) return userId;

  const { id } = await params;
  const certId = Number(id);

  const { name, issueDate } = await request.json();

  if (!name || !issueDate) {
    return Response.json({ error: "Missing fields" }, { status: 400 });
  }

  const normalizedName = clean(name);

  const update = await prisma.certification.update({
    where: {
      id: certId,
    },
    data: {
      ...(name !== undefined && { name: normalizedName }),
      ...(issueDate !== undefined && { issueDate: new Date(issueDate) }),
    },
  });

  return Response.json(update);
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const userId = await sessionCheck();

  if (userId instanceof Response) return userId;

  const { id } = await params;
  const certId = Number(id);

  await prisma.certification.deleteMany({
    where: {
      id: certId,
      userId: Number(userId),
    },
  });

  return Response.json("Deleted successfully");
}
