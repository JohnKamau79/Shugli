import { PrismaClient } from "@/src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";


const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function createClient() {
    const connectionString = process.env.DATABASE_URL
    if (!connectionString) {
        throw new Error("DATABASE_URL not set")
    }
    return new PrismaClient({ adapter: new PrismaPg({ connectionString }) })

}

export const prisma = globalForPrisma.prisma ?? createClient();

if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = prisma;
}

// const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL as string })
// const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }
// export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter })
// if (process.env.NODE_ENV !== "production") {
//     globalForPrisma.prisma = prisma
// }