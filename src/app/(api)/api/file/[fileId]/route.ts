import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { UTApi } from "uploadthing/server";

import { authOptions } from "~/server/auth";

export async function DELETE(
  req: Request,
  { params }: { params: { fileId: string } },
) {
  try {
    const session = await getServerSession(authOptions());

    // If you throw, the user will not be able to upload
    if (!session?.userId) throw new Error("Unauthorized");
    // if (!session) throw new Error("Unauthorized");
    params.fileId;

    const utapi = new UTApi();

    const ok = await utapi.deleteFiles(params.fileId);

    if (!ok) {
      return new NextResponse("Internal Error", { status: 500 });
    }

    return NextResponse.json({
      message: "Attachment deleted",
    });
  } catch (error) {
    console.log("ATTACHMENT_ID", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
