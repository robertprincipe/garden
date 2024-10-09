"use server";

import { UTApi } from "uploadthing/server";

export async function deleteFileAction(input: { id: string }) {
  const utapi = new UTApi();
  const ok = await utapi.deleteFiles(input.id);

  if (!ok) {
    throw new Error("Internal Error");
  }
}
