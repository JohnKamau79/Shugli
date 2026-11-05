import { prisma } from "@/src/lib/db/prisma";
import { notFound } from "next/navigation";

export default async function CategoryPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const categoryId = Number(id);

    function formatDate(date: Date) {
        const today = new Date();
        const yesterday = new Date();

        today.setHours(0, 0, 0, 0);
        yesterday.setDate(yesterday.getDate() - 1);
        yesterday.setHours(0, 0, 0, 0);

        const created = new Date(date);
        created.setHours(0, 0, 0, 0);

        if (created.getTime() === today.getTime()) return "Today"
        if (created.getTime() === yesterday.getTime()) return "Yesterday"

        return created.toLocaleString();
    }


    if (!Number.isInteger(categoryId)) notFound();

    const category = await prisma.category.findUnique({
        where: { id: categoryId },
        include: {
            jobs: {
                include: {
                    city: {
                        select: { name: true }
                    }
                }
            }
        }
    });

    if (!category) notFound();

    return (

        <main>
            <div className="h-1/2  bg-primary text-primary-foreground p-4 pt-15 pb-50">
                <h1 className="text-6xl mb-5 font-semibold font-logo">{category.name}</h1>
                <h1 className="text-lg">{category.description}</h1>
            </div>

            <div className="pt-10 pl-2">
                {category.jobs.length === 0 ? (<p>No jobs available in this category!</p>) :
                    (
                        <ul className="">
                            {category.jobs.map((job) => (
                                <li
    key={job.id}
    className="bg-card border border-border rounded-xl p-5 min-w-sm max-w-sm shadow-sm hover:shadow-md transition-shadow"
>
    {/* Company */}
    <div className="flex items-center gap-3 mb-5">
        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
            <span className="text-primary text-xl font-bold">
                {job.title.charAt(0)}
            </span>
        </div>

        <div className="flex-1">
            <p className="font-semibold">{job.companyy}</p>
            <p className="text-sm text-muted-foreground">
                {job.city.name}
            </p>
        </div>

        <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">
            {job.jobType.replace("_", "-").toLowerCase()}
        </span>
    </div>

    {/* Job title */}
    <h2 className="text-xl font-bold mb-2">
        {job.title}
    </h2>

    {/* Description */}
    <p className="text-sm text-muted-foreground line-clamp-2 mb-5">
        {job.description}
    </p>

    <div className="border-t border-border pt-4 flex justify-between items-center">
        <div>
            <p className="text-xs text-muted-foreground mb-1">SALARY</p>
            <p className="font-bold text-primary">
                {job.salary
                    ? `Ksh ${job.salary.toLocaleString()}`
                    : "Negotiable"}
            </p>
        </div>

        <div className="text-right">
            <p className="text-xs text-muted-foreground mb-1">POSTED</p>
            <p className="font-medium text-sm">
                {formatDate(job.createdAt)}
            </p>
        </div>
    </div>

    <button className="w-full mt-5 bg-primary text-primary-foreground rounded-lg py-2.5 font-semibold hover:opacity-90 transition">
        View Details
    </button>
</li>
                            ))}
                        </ul>
                    )}
            </div>
        </main>
    )

}