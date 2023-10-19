"use client";

import { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import { BlockNoteView, useBlockNote } from "@blocknote/react";
import { useTheme } from "next-themes";

import "@blocknote/core/style.css";

import { generateReactHelpers } from "@uploadthing/react/hooks";

const { useUploadThing } = generateReactHelpers();

interface EditorProps {
  onChange: (value: string) => void;
  initialContent?: string;
  editable?: boolean;
}

const Editor = ({ onChange, initialContent, editable }: EditorProps) => {
  const { resolvedTheme } = useTheme();
  const { isUploading, startUpload } = useUploadThing("productImage");

  const handleUpload = async (file: File) => {
    const images = await startUpload([file]).then((res) => {
      const formattedImages = res?.map((image) => ({
        id: image.key,
        name: image.key.split("_")[1] ?? image.key,
        url: image.url,
      }));
      return formattedImages ?? null;
    });

    return images?.[0]?.url ?? "";
  };

  const editor: BlockNoteEditor = useBlockNote({
    editable,
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
    onEditorContentChange: (editor) => {
      onChange(JSON.stringify(editor.topLevelBlocks, null, 2));
    },
    uploadFile: handleUpload,
  });

  return (
    <div>
      <BlockNoteView
        editor={editor}
        theme={resolvedTheme === "dark" ? "dark" : "light"}
      />
    </div>
  );
};

export default Editor;
