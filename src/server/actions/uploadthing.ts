"use server";

import { utapi } from "uploadthing/server";

export async function deleteFileAction(input: { id: string }) {
  const ok = await utapi.deleteFiles(input.id);

  if (!ok) {
    throw new Error("Internal Error");
  }
}
