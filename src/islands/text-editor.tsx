"use client";

import React, { useLayoutEffect, useRef } from "react";
import Quill from "quill";

import "quill/dist/quill.snow.css";

type ITextEditorProps = {
  className?: string;
  placeholder?: string;
  defaultValue?: string;
  value?: string;
  onChange: (value?: string) => void;
  getEditor?: any;
};

const TextEditor = ({
  className,
  placeholder,
  defaultValue,
  // we're not really feeding new value to quill instance on each render because it's too
  // expensive, but we're still accepting 'value' prop as alias for defaultValue because
  // other components like <Form.Field> feed their children with data via the 'value' prop
  value: alsoDefaultValue,
  onChange,
  getEditor,
}: ITextEditorProps) => {
  const $editorContRef = useRef<HTMLDivElement>(null);
  const $editorRef = useRef<Quill>(null);
  const initialValueRef = useRef(defaultValue || alsoDefaultValue || "");

  useLayoutEffect(() => {
    let quill = new Quill($editorRef.current, { placeholder, ...quillConfig });

    const insertInitialValue = () => {
      quill.clipboard.dangerouslyPasteHTML(0, initialValueRef.current);
      quill.blur();
    };
    const handleContentsChange = () => {
      onChange(getHTMLValue());
    };
    const getHTMLValue = () =>
      $editorContRef.current?.querySelector(".ql-editor")?.innerHTML;

    insertInitialValue();
    getEditor({ getValue: getHTMLValue });

    quill.on("text-change", handleContentsChange);
    return () => {
      quill.off("text-change", handleContentsChange);
      quill = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={className} ref={$editorContRef}>
      <div ref={$editorRef} />
    </div>
  );
};

const quillConfig = {
  theme: "snow",
  modules: {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      ["blockquote", "code-block"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      ["clean"],
    ],
  },
};

export default TextEditor;
