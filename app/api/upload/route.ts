import { NextResponse } from "next/server";

import cloudinary from "@/lib/cloudinary";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const file = String(body.file ?? "").trim();
    const type = String(body.type ?? "look").trim().toLowerCase();

    if (!file) {
      return NextResponse.json({ error: "Missing image payload" }, { status: 400 });
    }

    const cloudName =
      process.env.CLOUDINARY_CLOUD_NAME ?? process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

    if (
      !cloudName ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json(
        { error: "Cloudinary is not configured. Add CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET." },
        { status: 503 }
      );
    }

    const folderMap: Record<string, string> = {
      beauty: "dionbaci/beauty",
      look: "dionbaci/looks",
      receipt: "dionbaci/receipts",
    };

    const folder = folderMap[type] ?? "dionbaci/looks";

    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: "auto",
    });

    return NextResponse.json({ secure_url: result.secure_url });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json({ error: "Unable to upload image" }, { status: 500 });
  }
}
