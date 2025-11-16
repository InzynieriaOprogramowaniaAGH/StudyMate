export const runtime = "nodejs";

import { NextResponse } from "next/server";
import sharp from "sharp";
import fsPromises from "fs/promises";
import path from "path";
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { id: true, image: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), "public", "uploads", "profile-photos");
    await fsPromises.mkdir(uploadDir, { recursive: true });

    const filename = `profile-${user.id}-${Date.now()}.webp`;
    const filePath = path.join(uploadDir, filename);
    const fileUrl = `/uploads/profile-photos/${filename}`;

    if (user.image) {
      const storedPath = user.image.startsWith("/")
        ? user.image.slice(1)
        : user.image;

      const oldPath = path.join(process.cwd(), "public", storedPath);

      const resolvedOld = path.resolve(oldPath);
      const resolvedUploadDir = path.resolve(uploadDir);

      if (resolvedOld.startsWith(resolvedUploadDir)) {
        try {
          await fsPromises.unlink(resolvedOld);
          console.log("Deleted old profile image:", resolvedOld);
        } catch (err: any) {
          if (err.code !== "ENOENT") console.error("Error deleting old image:", err);
        }
      }
    }

    await sharp(buffer)
      .resize(512, 512, { fit: "cover" })
      .webp({ quality: 80 })
      .toFile(filePath);

    const updatedUser = await prisma.user.update({
      where: { email: session.user.email },
      data: { image: fileUrl },
    });

    return NextResponse.json({ url: fileUrl, user: updatedUser });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
