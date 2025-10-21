# 🧠 StudyMate

Full-stack web application built with **Next.js**, **TailwindCSS**, **NextAuth**, **Prisma**, **PostgreSQL**, and **OpenAI API**.  
The goal of this setup is to provide a complete modern development stack for rapid prototyping and scalable production-ready apps.

---

## 🚀 Tech Stack

| Category | Technology |
|-----------|-------------|
| Frontend | Next.js 14 (App Router) |
| Styling | TailwindCSS 3.4.14 |
| Authentication | NextAuth.js |
| ORM | Prisma |
| Database | PostgreSQL (via Docker) |
| API | Next.js API Routes |
| AI Integration | OpenAI API |

---

## ⚙️ Project Setup — Step by Step
```bash
1️⃣ Create Next.js project

npx create-next-app@latest studymate
cd studymate

Options selected during setup:
✅ TypeScript → Yes

❌ ESLint → Yes

✅ TailwindCSS → Yes

✅ App Router → Yes

❌ Import alias → @/*

2️⃣ Install TailwindCSS (version 3.4.14)

npm install -D tailwindcss@3.4.14 postcss autoprefixer
npx tailwindcss init -p

Edit src/app/globals.css:
@tailwind base;
@tailwind components;
@tailwind utilities;

3️⃣ Initialize Prisma and PostgreSQL

Install dependencies:
npm install prisma @prisma/client
npx prisma init


In .env.local:
DATABASE_URL="postgresql://postgres:password@localhost:5432/mydb?schema=public"

Prisma schema (prisma/schema.prisma):

generator client {
  provider = "prisma-client-js"
}
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String   @id @default(cuid())
  name          String?
  email         String?  @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
}

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  user              User    @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

Run migration:
npx prisma migrate dev --name init


4️⃣ Setup Docker with PostgreSQL + pgAdmin
Create docker-compose.yml in project root:

version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: postgres_local
    restart: always
    ports:
      - "5432:5432"
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
      POSTGRES_DB: mydb
    volumes:
      - postgres_data:/var/lib/postgresql/data

  pgadmin:
    image: dpage/pgadmin4
    container_name: pgadmin_local
    restart: always
    ports:
      - "5050:80"
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@admin.com
      PGADMIN_DEFAULT_PASSWORD: admin
    depends_on:
      - postgres

volumes:
  postgres_data:


Run database stack:
docker-compose up -d

5️⃣ Configure NextAuth
Install:
npm install next-auth

Create /src/app/api/auth/[...nextauth]/route.ts:

import NextAuth from "next-auth"
import GitHubProvider from "next-auth/providers/github"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "@/lib/prisma"

const handler = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
})

export { handler as GET, handler as POST }


Create /src/lib/prisma.ts:

import { PrismaClient } from "@prisma/client"
export const prisma = globalThis.prisma || new PrismaClient()
if (process.env.NODE_ENV !== "production") globalThis.prisma = prisma


Add to .env.local:
NEXTAUTH_SECRET=supersecretstring


6️⃣ Add OpenAI API integration
Install:

npm install openai
Create /src/app/api/generate/route.ts:

import OpenAI from "openai"
import { NextResponse } from "next/server"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
})

export async function POST(req: Request) {
  const { prompt } = await req.json()
  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [{ role: "user", content: prompt }],
  })
  return NextResponse.json({
    response: completion.choices[0].message.content,
  })
}


Add to .env.local:
OPENAI_API_KEY=sk-...


7️⃣ Add convenience scripts
Install helper tools:

npm install --save-dev concurrently wait-on
Update package.json:

"scripts": {
  "dev": "next dev",
  "docker:up": "docker-compose up -d",
  "docker:down": "docker-compose down",
  "dev:stack": "concurrently \"npm run docker:up\" \"wait-on tcp:5432 && npm run dev\""
}


Now you can launch the entire stack (Next.js + PostgreSQL + pgAdmin) with:
npm run dev:stack

8️⃣ Test Prisma connection

npx prisma studio
Opens a local database UI at http://localhost:5555.

✅ Access Points
Service	URL
Next.js app	http://localhost:3000
pgAdmin	        http://localhost:5050
PostgreSQL	localhost:5432
Prisma Studio	http://localhost:5555

🧪 Example API Test
You can test your AI endpoint:

curl -X POST http://localhost:3000/api/generate \
-H "Content-Type: application/json" \
-d '{"prompt":"Write a haiku about code"}'


🧱 Summary
This setup provides a modern, production-ready environment for building web apps with authentication, database persistence, and AI capabilities — all locally containerized and fully scriptable.

🧰 Quick Commands
Action	Command
Start database	npm run docker:up
Stop database	npm run docker:down
Start full stack	npm run dev:stack
Run only Next.js	npm run dev
Open Prisma Studio	npx prisma studio

```