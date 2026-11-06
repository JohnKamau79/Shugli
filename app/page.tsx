import { prisma } from "@/src/lib/db/prisma"
import Link from "next/link";
import { ArrowRight, CheckCircle, ChevronRight, MoveRight } from "lucide-react";
import LatestJobs from "./components/LatestJobs";
import PlatformPricing from "./components/PlatformPricing";


export default async function Home() {
    const stats = [
        { value: "899", label: "Total Employers" },
        { value: "899", label: "Total Jobs" },
        { value: "899", label: "Active Jobs" },
        { value: "899", label: "Total Users" },
    ];
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

            <section className="bg-primary px-6 py-28 text-primary-foreground">
                <div className="mx-auto grid max-w-6xl grid-cols-2 gap-y-16 md:grid-cols-4 md:divide-x md:divide-primary-foreground/20">
                    {stats.map((stat) => (
                        <div key={stat.label} className="flex flex-col items-center gap-4 px-8 text-center">
                            <span className="font-logo text-6xl font-bold">
                                {stat.value}
                                <span className="text-accent">+</span>
                            </span>
                            <span className="text-sm uppercase tracking-wide text-primary-foreground/70">
                                {stat.label}
                            </span>
                        </div>
                    ))}
                </div>
            </section>

            {/* CATEGORIES */}
            <section className="mx-auto max-w-6xl px-6 py-24">
                <h2 className="text-center font-heading text-4xl font-extrabold text-primary">
                    Popular job categories
                </h2>
                <p className="mt-3 text-center text-foreground/70">
                    Browse jobs by the kind of work you do
                </p>

                {categories.length === 0 ? (
                    <p className="mt-12 text-center text-foreground/70">No categories yet</p>
                ) : (
                    <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                        {categories.map((category) => (
                            <li key={category.id}>
                                <Link
                                    href={`/categories/${category.id}`}
                                    className="group flex h-20 items-center justify-between gap-3 rounded-2xl border border-border bg-primary/20 p-6 text-xl font-semibold text-primary transition-all duration-300 hover:-translate-y-1 hover:bg-primary hover:text-primary-foreground hover:shadow-lg"
                                >
                                    <span className="min-w-0 wrap-break-word line-clamp-2">{category.name}</span>
                                    <ArrowRight className="shrink-0 transition-transform duration-300 group-hover:translate-x-1" />
                                </Link>
                            </li>
                        ))}
                    </ul>
                )}
            </section>
                
                <LatestJobs className="bg-background/10" />

                <PlatformPricing />


            <section className="">
                <h2 className="text-center font-heading text-4xl font-extrabold text-primary">User Reviews</h2>
            </section>

        </main>
    )
}
