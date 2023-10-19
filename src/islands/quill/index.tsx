"use client";

import "react-quill/dist/quill.snow.css";
import "quill-image-uploader/dist/quill.imageUploader.min.css";

import * as React from "react";
import BlotFormatter from "quill-blot-formatter";
import QuillImageDropAndPaste from "quill-image-drop-and-paste";
import ImageUploader from "quill-image-uploader";
import ReactQuill, { Quill } from "react-quill";

import { ImageFormat } from "./image-format";
import { modules } from "./modules";
import Toolbar from "./toolbar";

Quill.register("modules/blotFormatter", BlotFormatter);
Quill.register("modules/imageDropAndPaste", QuillImageDropAndPaste);
Quill.register("modules/imageUploader", ImageUploader);
Quill.register(ImageFormat, true);

type IQuillEditorProps = {
  onChange?: (value: string) => void;
  value?: string;
  placeholder?: string;
  className?: string;
  defaultValue?: string;
};

const QuillEditor = ({ onChange, value, placeholder }: IQuillEditorProps) => {
  const editorRef = React.useRef<ReactQuill>(null);
  const memorizedModules = React.useMemo(() => modules(editorRef), []);

  return (
    <div>
      <Toolbar />
      <ReactQuill
        theme="snow"
        className="relative rounded-md"
        modules={memorizedModules}
        onChange={(value: string) => {
          onChange?.(value);
        }}
        value={value}
        placeholder={placeholder}
        ref={editorRef}
      />
    </div>
  );
};

export default QuillEditor;
