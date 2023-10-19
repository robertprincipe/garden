import { ImageData } from "quill-image-drop-and-paste";

import { uploadImage } from "./services";

export const modules = (ref: any) => {
  return {
    toolbar: {
      container: "#toolbar",
    },
    blotFormatter: {
      overlay: {
        style: { border: "2px dashed #5b60f1" },
      },
      align: {
        icons: {
          left: `
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M2 2h2v20H2z"></path><rect x="6" y="13" width="16" height="6" rx="1"></rect><rect x="6" y="5" width="12" height="6" rx="1"></rect></svg>
              `,
          center: `
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M19 13h-6v-2h4a1 1 0 0 0 1-1V6a1 1 0 0 0-1-1h-4V2h-2v3H7a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h4v2H5a1 1 0 0 0-1 1v4a1 1 0 0 0 1 1h6v3h2v-3h6a1 1 0 0 0 1-1v-4a1 1 0 0 0-1-1z"></path></svg>
              `,
          right: `
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"><path d="M20 2h2v20h-2z"></path><rect x="2" y="13" width="16" height="6" rx="1"></rect><rect x="6" y="5" width="12" height="6" rx="1"></rect></svg>
              `,
        },
        toolbar: {
          buttonStyle: {
            backgroundColor: "#5b60f1",
            border: "none",
            margin: "0 1px",
          },
          svgStyle: {
            border: "1px solid #5b60f1",
            backgroundColor: "#5b60f1",
            padding: "2px",
            color: "#FFF",
            fill: "currentColor",
          },
        },
      },
      resize: {
        handleStyle: {
          backgroundColor: "#5b60f1",
          border: "1px solid #5b60f1",
          opacity: "0.5",
        },
      },
    },
    imageDropAndPaste: {
      handler: async (_imageDataUrl: any, _type: any, imageData: ImageData) => {
        try {
          const miniImageData = await imageData.minify({
            quality: 0.8,
          });
          if (miniImageData instanceof ImageData) {
            const file = miniImageData?.toFile();
            if (!file) return;
            const url = await uploadImage(file);
            const editor = ref.current?.getEditor();
            const selection = editor?.getSelection();
            if (editor && selection) {
              editor.insertEmbed(selection.index, "image", url);
            }
          }
        } catch (error) {
          console.error("No se pudo subir la imagen");
        }
      },
    },
    imageUploader: {
      upload: async (f: File) => await uploadImage(f),
    },
  };
};
