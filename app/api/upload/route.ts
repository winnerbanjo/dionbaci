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

    if (
      !process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME ||
      !process.env.CLOUDINARY_API_KEY ||
      !process.env.CLOUDINARY_API_SECRET
    ) {
      return NextResponse.json({ error: "Cloudinary is not configured" }, { status: 503 });
    }

    const folder = type === "beauty" ? "dionbaci/beauty" : "dionbaci/looks";

    const result = await cloudinary.uploader.upload(file, {
      folder,
      resource_type: "image",
    });

    return NextResponse.json({ secure_url: result.secure_url });
  } catch (error) {
    console.error("UPLOAD ERROR:", error);
    return NextResponse.json({ error: "Unable to upload image" }, { status: 500 });
  }
}
