import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, GIF, and WebP are allowed." },
        { status: 400 }
      );
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 5MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Url = `data:${file.type};base64,${buffer.toString("base64")}`;

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.replace(/\s+/g, "");
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.replace(/\s+/g, "");
    
    if (supabaseUrl && supabaseKey && supabaseUrl.startsWith("http")) {
      try {
        const supabase = createClient(supabaseUrl, supabaseKey);
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
        const filename = `${Date.now()}-${sanitizedName}`;

        const { data, error } = await supabase.storage
          .from("ad-images")
          .upload(filename, buffer, {
            contentType: file.type,
            upsert: false,
          });

        if (!error) {
          const { data: publicUrlData } = supabase.storage
            .from("ad-images")
            .getPublicUrl(filename);
          return NextResponse.json({ url: publicUrlData.publicUrl });
        } else {
          console.warn("Supabase storage upload returned error, falling back to base64:", error.message);
        }
      } catch (err) {
        console.warn("Supabase storage client exception, falling back to base64:", err);
      }
    }

    // Reliable fallback to base64 data URI
    return NextResponse.json({ url: base64Url });
  } catch (error) {
    console.error("Upload handler exception:", error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}
