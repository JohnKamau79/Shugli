import { prisma } from "@/src/lib/db/prisma";
import { getSession } from "@/src/lib/session";

export async function POST(request: Request) {
    const session = await getSession()
    if (!session) {
        return Response.json({ error: "Not logged in" }, { status: 401 });
    }

    // if (session.role !== "Employer") {
    //     return Response.json({ error: "Only employers can post jobs" }, { status: 403 });
    // }

    const { title, jobType, description, cityId, categoryId, salary, expiresAt } = await request.json();

    if (!title || !jobType || !description || !cityId || !categoryId || !salary) {
        return Response.json({ error: "Missing fields" }, { status: 400 });
    }
    if (!["Remote", "Onsite", "Hybrid"].includes(jobType)) {
        return Response.json({ error: "Invalid job type" }, { status: 400 });
    }

    const job = await prisma.jobs.create({
        data: {
            title,
            jobType,
            description,
            cityId,
            categoryId,
            salary,
            expiresAt: expiresAt ? new Date(expiresAt) : null,
            userId: session.userId,
        }
    });

    return Response.json(job, { status: 201 });
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const cityId = searchParams.get("cityId")
    const categoryId = searchParams.get("categoryId")
    // const jobType = searchParams.get("jobType")

    const jobs = await prisma.jobs.findMany({
        where: {
            ...(cityId && { cityId: Number("cityId") }),
            ...(categoryId && { categoryId: Number("categoryId") }),
            OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
        include: {
            city: true,
            category: true,
            employer: { select: { id: true, firstName: true } },
        },
        orderBy: { createdAt: "desc" },
    });


    if (!jobs) {
        return Response.json({ error: "No jobs exist" }, { status: 201 });
    }
    if (jobs) {
        return Response.json(jobs, { status: 200 });
    }
}