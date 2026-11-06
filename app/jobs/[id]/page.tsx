import ApplyButton from "@/app/components/ApplyButton";
import { prisma } from "@/src/lib/db/prisma";
import { notFound } from "next/navigation";

export default async function JobPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    const jobId = Number(id);

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


    if (!Number.isInteger(jobId)) notFound();

    const job = await prisma.jobs.findUnique({
        where: { id: jobId },
        include: {
            city: {
                select: {
                    name: true,
                }
            }
        }
    });

    if (!job) notFound();

    return (

        <main>
            <div className="bg-primary text-primary-foreground p-2 pt-15 pb-10">
                <div className="flex justify-between items-center">
                    <div className="flex gap-2 ">
                        <span className="border-3 border-primary-foreground/40 w-14 h-14 flex items-center justify-center rounded-lg text-2xl font-bold font-logo text-primary-foreground">{job.company?.charAt(0)}</span>
                        <div className="flex flex-col">
                            <p className="text-2xl font-bold">{job.company}</p>
                            <p className="font-semibold text-lg text-primary-foreground/70">{job.city.name}</p>
                        </div>
                    </div>
                </div>

                <div className="">
                    <h3 className="text-3xl font-semibold mt-2">{job.title}</h3>
                    <div className="flex items-center gap-10 pt-3 text-primary font-semibold">
                        <span className="bg-primary-foreground px-3 rounded-2xl">{job.jobType}</span>
                        <span className="bg-primary-foreground px-3 rounded-2xl">{job.duration.replace('_', '-')}</span>
                    </div>
                    <div className="flex justify-between items-center mt-10 mb-2">
                        <p className="text-primary-foreground font-bold text-2xl">Salary: <span className="text-background/60">Ksh {job.salary?.toLocaleString()}</span></p>
                        <span className="text-sm">POSTED: <span className="font-semibold text-primary-foreground/50">{formatDate(job.createdAt)}</span></span>
                    </div>
                </div>
            </div>

            <div className="m-10">
                <h2 className="text-center text-3xl font-semibold text-primary">Job Description</h2>
                <ol className="list-disc font-semibold mt-7 text-lg">
                    <li>{job.description}</li>
                </ol>
                <div>

                </div>
                <ApplyButton jobId={job.id} />

                <div className="mt-20">
                    <h2 className="text-primary text-3xl font-extrabold ml-2">Related Jobs</h2>
                    
                </div>
            </div>
        </main>
    )

}