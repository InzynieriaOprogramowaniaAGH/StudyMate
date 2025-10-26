import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // ----- USERS -----
  const passwordHash = await bcrypt.hash("password123", 10);

  const user1 = await prisma.user.upsert({
    where: { email: "alice@example.com" },
    update: {},
    create: {
      name: "Alice Johnson",
      email: "alice@example.com",
      password: passwordHash,
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "bob@example.com" },
    update: {},
    create: {
      name: "Bob Smith",
      email: "bob@example.com",
      password: passwordHash,
    },
  });

  console.log("✅ Users created:", { user1: user1.email, user2: user2.email });

  // ----- NOTES -----
  const note1 = await prisma.note.create({
    data: {
      title: "Photosynthesis Overview",
      content:
        "Photosynthesis is the process by which green plants convert light energy into chemical energy. It involves chlorophyll and occurs in chloroplasts.",
      userId: user1.id,
    },
  });

  const note2 = await prisma.note.create({
    data: {
      title: "Newton's Laws of Motion",
      content:
        "Newton's First Law: An object in motion stays in motion unless acted upon by an external force.",
      userId: user2.id,
    },
  });

  console.log("📝 Notes added");

  // ----- FLASHCARDS -----
  await prisma.flashcard.createMany({
    data: [
      {
        front: "What is the main pigment in photosynthesis?",
        back: "Chlorophyll",
        userId: user1.id,
      },
      {
        front: "Newton's Third Law states?",
        back: "For every action, there is an equal and opposite reaction.",
        userId: user2.id,
      },
    ],
  });

  console.log("🎴 Flashcards added");

  // ----- QUIZZES -----
  await prisma.quiz.createMany({
  data: [
    {
      title: "Photosynthesis Quiz",
      score: 85,
      userId: user1.id,
    },
    {
      title: "Physics Fundamentals Quiz",
      score: 90,
      userId: user2.id,
    },
  ],
});


  console.log("🧠 Quizzes added");

  // ----- PROGRESS -----
  await prisma.progress.createMany({
  data: [
    {
      userId: user1.id,
      quizzesTaken: 3,
      flashcardsReviewed: 15,
    },
    {
      userId: user2.id,
      quizzesTaken: 1,
      flashcardsReviewed: 10,
    },
  ],
});


  console.log("📈 Progress records added");

  console.log("✅ Seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
