import { ourFileRouter } from "~/app/(api)/api/uploadthing/core";

export const uploadImage = async (img: File): Promise<any> => {
  if (img.type.startsWith("image/")) {
    const formData = new FormData();
    formData.append("image", img);
    try {
      // const data = await API.post<{ url: string }>(
      //     `/products/images`,
      //     formData
      // );

      return "data.url";
    } catch (error) {
      throw new Error("No se pudo subir la imagen");
    }
  } else {
    throw new Error("Formato del archivo no es una imagen");
  }
};
