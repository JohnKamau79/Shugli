# Shugli

A jobs marketplace where employers post jobs and applicants and workers find them.
Shugli is a platform connecting employers with trusted local service providers (Blue Collar) as well as White Collar suited individuals in Kenya.

## Stack

- Next.js (App Router)
- TypeScript
- PostgreSQL (local)
- Prisma 7 with the `@prisma/adapter-pg` driver adapter
- `bcryptjs` for password hashing
- `jose` for sessions (signed JWT in an `httpOnly` cookie)
- Prisma Studio to view and edit data
- Postman to test POST routes

## Steps

### 1. Create the project

```bash
npx create-next-app@latest shugli
cd shugli
```

### 2. Install Prisma

```bash
# Dev dependencies
npm install prisma@7 tsx @types/pg --save-dev

# Runtime dependencies
npm install @prisma/client @prisma/adapter-pg pg dotenv
```

### 3. Initialise Prisma

```bash
# Creates prisma/schema.prisma, prisma.config.ts and .env
npx prisma init --datasource-provider postgresql --output ../src/generated/prisma
```

Set the connection string in `.env`:

```env
DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/shugli"
```

### 4. Schema and migrations

Write the models in `prisma/schema.prisma`, then:

```bash
# Tidy the schema
npx prisma format

# Create the tables and generate the client
npx prisma migrate dev --name init

# Run again when models change (new name each time)
npx prisma migrate dev --name add_models

# Regenerate the client
npx prisma generate

# Check migrations are up to date
npx prisma migrate status

# seed data to table
npx prisma db seed

# View and edit data in the browser
npx prisma studio
```

### 5. Reset the database (destructive)

```bash
# Drops all data and reapplies migrations. Test data only.
npx prisma migrate reset
```

### 6. Shared Prisma client

Create `lib/prisma.ts`. It builds one `PrismaClient` and saves it on `globalThis` in development, so hot reloads don't open new database connections.

### 7. Signup

```bash
npm install bcryptjs
npm install -D @types/bcryptjs
```

Create `app/api/signup/route.ts`. It validates input, blocks the `Admin` role, hashes the password, and creates the user.

### 8. Login

Create `app/api/login/route.ts`. It finds the user by email and checks the password with `bcrypt.compare`.

### 9. Sessions

```bash
npm install jose

# Generate a secret and add it to .env as SESSION_SECRET="..."
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Create `lib/session.ts` with `createSession`, `getSession` and `deleteSession`. Call `createSession` in the login route.

### 10. Logout

Create `app/api/logout/route.ts` (POST) that calls `deleteSession()`.

## Run

```bash
npm run dev
```

## API

Routes that change data need a logged-in user. The user always comes from the session, never from the request body.

### Cities

- `GET /api/cities`: list all cities
- `POST /api/cities`: add a city (duplicate names return 409)
- `PATCH /api/cities/[id]`: rename a city
- `DELETE /api/cities/[id]`: delete a city

### Categories

- `GET /api/categories`: list all categories
- `POST /api/categories`: add a category
- `PATCH /api/categories/[id]`: rename a category
- `DELETE /api/categories/[id]`: delete a category

### Skills

- `GET /api/skills`: list all skills
- `POST /api/skills`: add a skill
- `PATCH /api/skills/[id]`: rename a skill
- `DELETE /api/skills/[id]`: delete a skill

### Jobs

- `GET /api/jobs`: list jobs, newest first, expired ones hidden. Optional filters: `?cityId=`, `?categoryId=`, `?jobType=`. Public.
- `POST /api/jobs`: post a job. Employers only.
- `PATCH /api/jobs/[id]`: edit a job. Only the employer who posted it.
- `DELETE /api/jobs/[id]`: delete a job and its applications. Only the employer who posted it.

### Worker profile

Each user has at most one profile, so these routes use the session and take no id.

- `GET /api/worker-profile`: get your own profile
- `POST /api/worker-profile`: create your profile
- `PATCH /api/worker-profile`: update your profile
- `DELETE /api/worker-profile`: delete your profile

### Applications

- `POST /api/jobs/[id]/apply`: apply to a job (no body needed). You can't apply to your own job, to an expired job, or twice to the same job.
- `GET /api/applications`: list your own applications, with job details
- `GET /api/jobs/[id]/applications`: list applicants for a job. Only the employer who posted it.
- `PATCH /api/applications/[id]`: set the status to `Shortlisted` or `Rejected`. Only the employer who owns the job.

Applicants cannot delete their applications for now.

### Status codes

- `401`: not logged in
- `403`: logged in but not allowed
- `404`: not found
- `409`: duplicate (already exists or already applied)

## Icons

```bash
npm install lucide-react
```

## Phone Numbers

```bash
npm i react-phone-number-impact
```

### Raw data

# workerProfile

[
{ "headline": "Experienced carpenter", "bio": "I build furniture and roof frames.", "yoe": 6, "categoryId": 2 },
{ "headline": "Self-taught web developer", "bio": "I build small business websites.", "yoe": 2, "categoryId": 5 }
]

# job

[
{ "title": "Shop Cashier", "jobType": "Onsite", "description": "Handle payments and serve customers", "cityId": 1, "categoryId": 1, "salary": 25000 },
{ "title": "Site Carpenter", "jobType": "Onsite", "description": "Build and fit wooden frames", "cityId": 3, "categoryId": 2, "salary": 35000 },
{ "title": "Junior Web Developer", "jobType": "Remote", "description": "Build and maintain web pages", "cityId": 1, "categoryId": 5, "salary": 60000 },
{ "title": "Delivery Driver", "jobType": "Hybrid", "description": "Deliver orders around town", "cityId": 4, "categoryId": 4 }
]

# user

[
{ "firstName": "Wanjiku", "lastName": "Kamau", "email": "wanjiku@test.com", "phone": "0711000001", "password": "password123", "gender": "Female", "role": "Employer", "cityId": 1 },
{ "firstName": "Otieno", "lastName": "Odhiambo", "email": "otieno@test.com", "phone": "0711000002", "password": "password123", "gender": "Male", "role": "Employer", "cityId": 3 },
{ "firstName": "Amina", "lastName": "Hassan", "email": "amina@test.com", "phone": "0711000003", "password": "password123", "gender": "Female", "role": "Applicant", "cityId": 2 },
{ "firstName": "Brian", "lastName": "Mutua", "email": "brian@test.com", "phone": "0711000004", "password": "password123", "gender": "Male", "role": "Worker", "cityId": 1 },
{ "firstName": "Faith", "lastName": "Chebet", "email": "faith@test.com", "phone": "0711000005", "password": "password123", "gender": "Other", "role": "Worker", "cityId": 5 }
]

# skills

[{ "name": "Customer service" }, { "name": "Carpentry" }, { "name": "Cooking" }, { "name": "Driving" }, { "name": "JavaScript" }]

# category

[{ "name": "Retail" }, { "name": "Construction" }, { "name": "Hospitality" }, { "name": "Transport" }, { "name": "IT" }]

# cities

[{ "name": "Nairobi" }, { "name": "Mombasa" }, { "name": "Kisumu" }, { "name": "Nakuru" }, { "name": "Eldoret" }]

# workExperience

{
"jobTitle": "Software Developer Intern",
"company": "SoftClans Technologies Limited",
"doEntry": "2026-01-05",
"doExit": "2026-10-30",
"cityId": 1,
"skills": ["Laravel", "PostgreSQL", "Git"],
"achievements": ["Built a product registration module", "Fixed workflow bugs"]
},

{
"jobTitle": "Data Engineer",
"company": "Twiga Foods",
"doEntry": "2019-09-02",
"doExit": "2021-01-29",
"cityId": 1,
"skills": ["Python", "SQL", "Apache Airflow", "ETL Pipelines", "Data Modeling"],
"achievements": [
"Built ETL pipelines that processed supplier data from 12 sources into one warehouse",
"Scheduled and monitored daily jobs with Airflow, reaching 99% on-time runs",
"Optimized slow SQL queries, reducing report generation from 20 minutes to 3"
]
}

{
"jobTitle": "Full Stack Developer",
"company": "Andela",
"doEntry": "2023-07-10",
"doExit": "2024-12-20",
"cityId": 1,
"skills": ["React", "Next.js", "TypeScript", "Prisma", "Tailwind CSS"],
"achievements": [
"Built a client dashboard with role-based access control",
"Migrated a legacy PHP frontend to Next.js, cutting page load time by 55%",
"Mentored two junior developers through code reviews"
]
}

{
"jobTitle": "Backend Developer",
"company": "Safaricom PLC",
"doEntry": "2021-02-01",
"doExit": "2023-06-30",
"cityId": 1,
"skills": ["Node.js", "PostgreSQL", "REST APIs", "Docker", "Redis"],
"achievements": [
"Reduced API response time by 40% by adding Redis caching",
"Designed a payment reconciliation service handling 50,000 transactions daily",
"Wrote unit and integration tests that raised coverage from 45% to 85%"
]
}

{
"jobTitle": "Data Engineer",
"company": "Twiga Foods",
"doEntry": "2019-09-02",
"doExit": "2021-01-29",
"cityId": 1,
"skills": ["Python", "SQL", "Apache Airflow", "ETL Pipelines", "Data Modeling", "PostgreSQL", "Pandas"],
"achievements": [
"Built ETL pipelines in Python and Airflow that pulled supplier, pricing and delivery data from 12 sources (APIs, CSV exports and spreadsheets) into one PostgreSQL warehouse, replacing a manual process that took two analysts a full day each week",
"Scheduled and monitored more than 40 daily Airflow jobs with retry logic and failure alerts, reaching 99% on-time completion",
"Optimized slow SQL queries using indexes and query rewrites, reducing the weekly sales report from 20 minutes to 3 minutes",
"Designed a star-schema data model for orders and deliveries, which let the analytics team build self-service dashboards without engineering help",
"Added data validation checks (null counts, duplicate detection, range checks) that caught about 200 bad records per week before they reached reports"
]
}

{
"jobTitle": "Full Stack Developer",
"company": "Andela",
"doEntry": "2023-07-10",
"doExit": "2024-12-20",
"cityId": 1,
"skills": ["React", "Next.js", "TypeScript", "Prisma", "PostgreSQL", "Tailwind CSS", "GitHub Actions"],
"achievements": [
"Built a client analytics dashboard in Next.js and TypeScript with role-based access control for admins, managers and viewers, serving about 1,200 monthly active users",
"Migrated a legacy PHP frontend to Next.js with server-side rendering, cutting average page load time from 4.2 seconds to 1.9 seconds (a 55% improvement) and improving the Lighthouse performance score from 52 to 91",
"Modeled the database in Prisma with 14 related tables and wrote migrations that were applied to production with zero downtime",
"Set up a GitHub Actions pipeline that ran linting, type checks and tests on every pull request, reducing failed deployments by 60%",
"Mentored two junior developers through weekly code reviews and pairing sessions, and both were promoted to mid-level within a year"
]
}

{
"jobTitle": "Backend Developer",
"company": "Safaricom PLC",
"doEntry": "2021-02-01",
"doExit": "2023-06-30",
"cityId": 1,
"skills": ["Node.js", "Express", "PostgreSQL", "Redis", "Docker", "REST APIs", "Jest"],
"achievements": [
"Designed and built a payment reconciliation service in Node.js and PostgreSQL that matched about 50,000 mobile money transactions daily against bank statements, cutting manual finance review from 6 hours to 45 minutes",
"Introduced Redis caching for the most-requested customer balance endpoints, lowering average API response time from 850 ms to 510 ms (a 40% drop) and reducing database load during peak hours",
"Refactored a 3,000-line monolithic controller into separate service and repository layers, which made new features faster to add and cut regression bugs by roughly 30% over two quarters",
"Wrote unit and integration tests with Jest that raised coverage from 45% to 85%, and added them to the CI pipeline so failing tests blocked merges",
"Containerized three services with Docker, shortening new developer setup from two days to under two hours"
]
}

# Work Experience

{
"institute": "University of Nairobi",
"course": "Bachelor of Science in Computer Science",
"level": "Doctorate_PHD",
"doEntry": "2015-09-07",
"doExit": "2019-12-13"
}

{
"institute": "Strathmore University",
"course": "Diploma in Business Information Technology",
"level": "Masters_MSc_MA",
"doEntry": "2013-01-14",
"doExit": "2015-06-26"
}

{
"institute": "Jomo Kenyatta University of Agriculture and Technology",
"course": "Master of Science in Software Engineering",
"level": " Bachelors_BSc_BA",
"doEntry": "2020-09-01",
"doExit": "2022-11-25"
}
