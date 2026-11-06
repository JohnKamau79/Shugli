import formatDate from "@/lib/utils/format"
import { prisma } from "@/src/lib/db/prisma"
import { ArrowRightIcon } from "lucide-react"
import Link from "next/link"

export default async function Jobs() {
    const jobs = await prisma.jobs.findMany({
        include: {
            city: {
                select: {
                    name: true,
                },
            },
            category: {
                select: {
                    name: true,
                }
            },
        },
        orderBy: {
            id: "desc"
        }
    })

    return (
        <main>
            <div>
                <h1>Find You Job Here.</h1>
                <p>Search Box</p>
                <p>Categories/duration/jobtype/salary range filters</p>
            </div>
            <div className="pt-10 pl-2">
                {jobs.length === 0 ? (<p>No jobs available in this category!</p>) :
                    (
                        <ul className="flex flex-wrap">
                            {jobs.map((job) => (
                                <li key={job.id} className="bg-primary/30 p-3 mr-3 my-2 pr-5 rounded-lg transition-all duration-300 hover:bg-primary/40 w-full sm:w-[48%] lg:w-[31%] xl:w-[23%] group">
                                    <Link href={`/jobs/${job.id}`}>
                                        <div className="flex justify-between items-center">
                                            <div className="flex gap-2 ">
                                                <span className="border-3 border-primary/40 w-12 h-12 flex items-center justify-center rounded-lg text-xl font-bold font-logo text-primary">{job.company?.charAt(0)}</span>
                                                <div className="flex flex-col">
                                                    <p className="text-xl font-bold">{job.company}</p>
                                                    <p className="font-semibold text-primary/70">{job.city.name}</p>
                                                </div>
                                            </div>
                                            <ArrowRightIcon className="text-primary transition-all duration-300 group-hover:scale-150" />
                                        </div>

                                        <div className="">
                                            <h3 className="text-2xl font-semibold mt-2">{job.title}</h3>
                                            <div className="flex items-center gap-10 pt-1">
                                                <span className="bg-primary/90 px-3 text-primary-foreground text-sm rounded-2xl">{job.jobType}</span>
                                                <span className="bg-primary/90 px-3 text-primary-foreground text-sm rounded-2xl">{job.duration.replace('_', '-')}</span>
                                            </div>
                                            <div className="flex justify-between items-center mt-6 mb-2">
                                                {job.salary && <p className="text-primary font-bold text-xl">Ksh {job.salary?.toLocaleString()}</p>}

                                                <span className="font-semibold text-foreground/50">{formatDate(job.createdAt)}</span>
                                            </div>
                                        </div>
                                    </Link>


                                </li>
                            ))}
                        </ul>
                    )}
            </div>
        </main>

    )
}