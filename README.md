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
