export const runtime = "nodejs";

import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  console.log("Upload API running (Node.js)");

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const userId = formData.get("userId") as string;

    if (!file || !userId) {
      console.warn(" Missing file or userId");
      return NextResponse.json({ error: "Missing file or userId" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadDir = path.join(process.cwd(), "public/uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
      console.log("Created upload directory:", uploadDir);
    }

    const filename = `profile-${Date.now()}.webp`;
    const filePath = path.join(uploadDir, filename);
    const fileUrl = `/uploads/${filename}`;

    console.log("Saving new image to:", filePath);

    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { image: true },
    });

    if (existingUser?.image) {
      const oldImagePath = path.join(process.cwd(), "public", existingUser.image);
      console.log("Checking old image path:", oldImagePath);

      try {
        if (fs.existsSync(oldImagePath)) {
          fs.unlinkSync(oldImagePath);
          console.log("Deleted old avatar:", oldImagePath);
        } else {
          console.log("Old image file not found:", oldImagePath);
        }
      } catch (deleteErr) {
        console.error(" Error deleting old image:", deleteErr);
      }
    } else {
      console.log("No previous user image found.");
    }

    fs.writeFileSync(filePath, buffer);

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { image: fileUrl },
    });

    console.log("Upload successful for user:", userId);
    return NextResponse.json({ url: fileUrl, user: updatedUser });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
