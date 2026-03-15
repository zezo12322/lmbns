# Life Makers - Beni Suef Branch OS

An MVP implementation of the comprehensive branch operating system and public website for the "Sonnaa Al Hayah / Life Makers - Beni Suef" branch.

## Features Built
- **Public Portal (Arabic/RTL)**: Hero landing page, Volunteer application form, Beneficiary Request Assistance form.
- **Authentication**: Secure role-based login using NextAuth.js (Auth.js v5 beta) with credentials provider.
- **Internal Dashboard**: Metrics overview including total cases, intake requests, and volunteers.
- **Case Management Core**: Intake requests listing and detailed view. Includes a "Convert to Case" processor that normalizes data into Person, Household, and Case entities. Table list view for the unified Cases pipeline.
- **Volunteer CRM**: Administration table to view volunteer profiles and count of applications submitted.
- **Programs & Projects**: Admin dashboard for listing and mapping development programs.
- **Branch Settings**: CMS capabilities mapping Branch display names, addresses, phones, and donation channels to the database for dynamic updates.

## Technical Stack
- **Framework**: Next.js (App Router)
- **Language**: TypeScript
- **Database ORM**: Prisma
- **Database**: PostgreSQL (Locally accessible via standard port or Docker Compose)
- **Styling**: Tailwind CSS & shadcn/ui
- **Auth**: Auth.js (NextAuth beta)

## Quick Start (Local Setup)

### 1. Database Setup
Ensure PostgreSQL is running on your machine.
If you have Docker installed, you can spin up the DB using:
```bash
docker-compose up -d
```

### 2. Environment Variables
Copy the `.env.example` into `.env` and adjust the PostgreSQL connection string.
```bash
cp .env.example .env
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Database Schema & Seeding
This will push the Prisma schema to your database and generate the Prisma Client, avoiding Prisma version mismatches with Next.js 15:
```bash
npx prisma db push
npx prisma generate
```

Seed the initial Branch and Demo User data:
```bash
npx tsx prisma/seed.ts
```

### 5. Start Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

## Demo Credentials
After running the seed script, you can log in to the dashboard (`/login`) using the following demo account:
- **Email**: `admin@bns.life`
- **Password**: `password123`
- **Role**: `SUPER_ADMIN`

## Assumptions Made
- Email / Password was utilized for MVP since SSO credentials were not provided.
- Next.js 16/15 compatibility was ensured by maintaining a strict Prisma v5 version explicitly, bypassing breaking connection string changes in Prisma 7.
- A "Convert to Case" shortcut algorithm was used for Beneficiary Intakes to auto-generate the associated Person and Household records for the sake of the MVP workflow demonstration.
- The `shadowcn/ui` button component was modified manually to a generic utility layer so that Server Components remain safe avoiding React Context boundary errors on `asChild`.
