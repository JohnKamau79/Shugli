This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.


## Install Prisma ORM

```bash
# 1. Dev dependencies
npm install prisma tsx @types/pg --save-dev
# or 
npm install prisma@7 tsx @types/pg --save-dev

# 2. Runtime dependencies
npm install @prisma/client @prisma/adapter-pg pg dotenv

# 3. Initialise Prisma (no --db, since your database is local)
npx prisma init --datasource-provider postgresql --output ../src/generated/prisma

# 4. Connection string
In .env, set DATABASE_URL to postgresql://user:password@localhost:5432/shugli, with your own PostgreSQL username and password.
```
When it’s done you should have prisma/schema.prisma, prisma.config.ts, and .env in your project.

```bash
npx prisma format ():tidies the file. It should print no errors.
npx prisma migrate dev --name init ():creates the User table in your shugli database and generates the Prisma client into src/generated/prisma.
npx prisma migrate dev --name add_models (): creates new models
npx prisma studio (): opens a browser view where you should see an empty User table.
npx prisma migrate reset. (): This drops everything in the database, which is fine if there’s only test data.
```