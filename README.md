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


## Iconc
```bash
npm install lucide-react
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

