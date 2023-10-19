import { utapi } from "uploadthing/server";

export const DELETE = async (image: string) => {
  await utapi.deleteFiles(image);
};
