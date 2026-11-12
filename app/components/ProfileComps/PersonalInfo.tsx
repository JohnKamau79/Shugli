import { prisma } from "@/src/lib/db/prisma";
import { getSession } from "@/src/lib/session";

export default async function PersonalInfo() {
  const session = await getSession();
  const user = await prisma.users.findUnique({
    where: {
      id: session?.userId,
    },
    include: {
      city: {
        select: {
          name: true,
        },
      },
    },
  });

  return (
    <section className="mx-auto grid max-w-6xl gap-6 px-4 py-8 sm:px-6 lg:grid-cols-3">
      <div className="space-y-6 lg:col-span-2">
        <h1 className="font-logo text-3xl font-bold text-primary hidden md:inline-block">Profile</h1>
        <div className="rounded-2xl border border-border bg-surface p-6">
          <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-full bg-primary font-logo text-primary-foreground text-3xl font-bold ">
              {user?.firstName[0]} {user?.lastName[0]}
            </span>
            <div className="min-w-0">
              <h2 className="font-logo text-2xl font-bold text-foreground flex gap-1">
                <span>{user?.firstName}</span>
                <span>{user?.lastName}</span>
              </h2>
              <span className="mt-1 inline-block rounded-2xl bg-primary text-primary-foreground px-3 text-sm">
                {user?.role}
              </span>
            </div>
          </div>

          <dl className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="min-w-0">
              <dt className="text-sm text-foreground/60">Email</dt>
              <dt className="wrap-break-word font-semibold">{user?.email}</dt>
            </div>
            <div>
              <dt className="text-sm text-foreground/60">Phone</dt>
              <dt className="wrap-break-word font-semibold">{user?.phone}</dt>
            </div>
            <div>
              <dt className="text-sm text-foreground/60">City</dt>
              <dt className="wrap-break-word font-semibold">
                {user?.city.name}
              </dt>
            </div>

            <div>
              <dt className="text-sm text-foreground/60">Member since</dt>
              <dt className="wrap-break-word font-semibold">
                {user?.createdAt.getFullYear()}
              </dt>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
