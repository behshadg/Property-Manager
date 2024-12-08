import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { UTApi } from "uploadthing/server";

const utapi = new UTApi();

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const formData = await req.formData();
    const files = formData.getAll('files');

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files provided" }, { status: 400 });
    }

    const uploadPromises = files.map(async (file) => {
      if (!(file instanceof Blob)) {
        throw new Error("Invalid file format");
      }
      return utapi.uploadFiles([file]);
    });

    const uploadResults = await Promise.all(uploadPromises);
    const urls = uploadResults
      .flat()
      .filter(result => result.data)
      .map(result => result.data.url);

    return NextResponse.json({ urls });

  } catch (error) {
    console.error("[UPLOAD_ERROR]", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Upload failed" }, 
      { status: 500 }
    );
  }
}