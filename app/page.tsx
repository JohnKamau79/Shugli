import { prisma } from "@/src/lib/db/prisma"
import Link from "next/link";
import { ArrowRight, CheckCircle, ChevronRight, MoveRight } from "lucide-react";


export default async function Home() {
    const jobs = await prisma.jobs.findMany({
        orderBy: { id: "desc" }
    });

    const categories = await prisma.category.findMany({
        orderBy: { id: "desc" }
    });

    return (
        <main className="px-2">
            <section className="h-screen bg-[url('/background.jpg')] bg-center bg-cover">
                <div className="backdrop-blur-3xl h-screen w-full flex flex-col items-center justify-center">
                    <h1 className="font-extrabold text-6xl font-logo text-primary">Find Your Next Opportunity Today!</h1>
                    <p className="font-semibold text-xl mt-2">Welcome to Shugli. Where we connect you to your future job and give you a platform to showcase a job for hire.</p>
                    <div className="flex flex-wrap font-semibold font-logo gap-4 justify-center items-center">
                        <span className="bg-primary text-primary-foreground p-1 px-2 rounded-2xl mt-6 mb-2 flex gap-2">Verified jobs <CheckCircle /></span>
                        <span className="bg-primary text-primary-foreground p-1 px-2 rounded-2xl mt-6 mb-2 flex gap-2">Updated daily <CheckCircle /></span>
                        <span className="bg-primary text-primary-foreground p-1 px-2 rounded-2xl mt-6 mb-2 flex gap-2">Built for Kenya <CheckCircle /></span>
                    </div>
                    <div className="flex flex-wrap justify-center gap-10 mt-7 text-2xl font-semibold text-accent-foreground">
                        <Link href={'/app/jobs'} className="text-accent bg-accent-foreground p-3 rounded-2xl px-10 shadow-3xl transition-all duration-300 hover:bg-accent hover:text-accent-foreground border-2 border-accent">Find your job</Link>
                        <Link href={'../app/auth/LoginPage'} className="bg-accent p-3 rounded-2xl px-10 shadow-3xl duration-300 hover:bg-accent-foreground hover:text-accent">Get started</Link>
                    </div>
                </div>
            </section>

            <section className="h-screen flex justify-center items-center bg-primary text-primary-foreground">
                <table className="bg-foreground/30">
                    <tr className="flex text-3xl font-logo">
                        <td className="flex flex-col items-center justify-center gap-3 border border-accent/15 w-1/2 p-3 px-40 text-center">Total Employers <span>899+</span></td>
                        <td className="flex flex-col items-center justify-center gap-3 border border-accent/15 w-1/2 p-3 px-40 text-center">Total Jobs <span>899+</span></td>
                    </tr>

                    <tr className="flex text-3xl font-logo">
                        <td className="flex flex-col items-center justify-center gap-3 border border-accent/15 w-1/2 p-3 px-40 text-center">Active Jobs <span>899+</span></td>
                        <td className="flex flex-col items-center justify-center gap-3 border border-accent/15 w-1/2 p-3 px-40 text-center">Total Users <span>899+</span></td>
                    </tr>
                </table>
            </section>


            <section className="h-screen">
                <h1 className="text-center text-4xl font-extrabold mt-6 text-primary">Popular Job Categories</h1>
                {categories.length === 0 ? (<p>No categories yet</p>) :
                    (
                        <ul className="flex flex-wrap items-cent">
                            {categories.map((category) => (
                                <li key={category.id} className="flex gap-3 border border-primary/50 text-accent transition-all duration-300 hover:bg-primary/40 m-1 rounded-xl p-5 min-w-85 text-xl font-semibold "><Link href={'../app/jobs'}>{category.name} <ArrowRight /></Link></li>
                            ))}
                        </ul>
                    )
                }
            </section>


            <section className="h-screen">
                <h1 className="text-center text-4xl font-extrabold mt-6 text-primary">Latest Jobs</h1>
            </section>

            <section className="h-screen">
                <h1 className="text-center text-4xl font-extrabold mt-6 text-primary">Featured Jobs</h1>
            </section>

            <section className="h-screen">
                <h1 className="text-center text-4xl font-extrabold mt-6 text-primary">Platform Pricing</h1>
            </section>

            <section className="h-screen">
                <h1 className="text-center text-4xl font-extrabold mt-6 text-primary">User Reviews</h1>
            </section>


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

        </main>
    )
}
