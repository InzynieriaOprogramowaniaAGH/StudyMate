import { NextResponse } from "next/server";
import sharp from "sharp";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;
  if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `profile-${Date.now()}.webp`;
  const uploadDir = path.join(process.cwd(), "public", "uploads", "profile-photos");

  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

  const filePath = path.join(uploadDir, fileName);

  await sharp(buffer)
    .resize(512, 512, { fit: "cover" })
    .webp({ quality: 80 })
    .toFile(filePath);

  const publicURL = `/uploads/profile-photos/${fileName}`;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // ✅ Update `image` field, not avatarUrl
  await prisma.user.update({
    where: { email: session.user.email },
    data: { image: publicURL },
  });

  return NextResponse.json({ url: publicURL });
}
