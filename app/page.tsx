import { prisma } from "@/src/lib/db/prisma"

export default async function Home() {
    const jobs = await prisma.jobs.findMany({
        orderBy: { id: "desc" }
    });

    return (

        <section>
            <h1>Latest Jobs</h1>
            {jobs.length === 0 ? (
                <p>No jobs yet</p>
            ) : (
                <ul className="flex flex-wrap m-2">
                    {jobs.map((job) => (<li key={job.id} className="bg-foreground border border-accent m-2 rounded-xl p-3 text-lg text-white w-50 h-50 " >
                        <h2 className="font-bold text-yellow-300 pb-1">{job.title}</h2>
                        <p>{job.description}</p>
                        <p className="text-gray-400">KES {job.salary?.toLocaleString()}</p>
                    </li>))}
                </ul>
            )
            }
        </section>
    )
}
