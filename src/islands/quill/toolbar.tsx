"use client";

import { useState } from "react";
import { Icon } from "@iconify/react";

import useClickOutside from "~/hooks/use-click-outside";

const Toolbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const moreOptionsRef = useClickOutside(() => setIsOpen(false));

  return (
    <div
      className="ql-snow !rounded-t-lg bg-muted dark:bg-border !border-b-0"
      id="toolbar"
    >
      <span className="ql-formats">
        <select className="ql-header" defaultValue={""}>
          <option value="">Normal</option>
          <option value="2">Heading 2</option>
          <option value="3">Heading 3</option>
          {/* <option value="4">Heading 4</option> */}
        </select>
      </span>
      <span className="ql-formats">
        <button type="button" className="ql-bold"></button>
        <button type="button" className="ql-italic"></button>
        <button type="button" className="ql-underline"></button>
        <button type="button" className="ql-strike"></button>
      </span>
      <span className="ql-formats">
        <select className="ql-color" />
        <select className="ql-background" />
        <button type="button" className="ql-blockquote"></button>
        <select className="ql-align" />
      </span>
      <span className="ql-formats">
        <button type="button" className="ql-link"></button>
        <button type="button" className="ql-image"></button>
      </span>
      <div className="relative float-right" ref={moreOptionsRef}>
        <button onClick={() => setIsOpen(!isOpen)}>
          <Icon icon="ph:dots-three-vertical-bold" className="text-2xl" />
        </button>
        <div className="absolute right-0 z-10 inline-flex top-10">
          <div
            className={`overflow-hidden transition-all duration-300 ease-out ${
              isOpen ? "w-[158px]" : "w-0"
            }`}
          >
            <span className="flex px-2 py-1 bg-muted border dark:border-border rounded-lg">
              <button
                type="button"
                className="cursor-pointer ql-list"
                value="ordered"
              ></button>
              <button
                type="button"
                className="cursor-pointer ql-list"
                value="bullet"
              ></button>
              <button
                type="button"
                className="cursor-pointer ql-indent"
                value="-1"
              ></button>
              <button
                type="button"
                className="cursor-pointer ql-indent"
                value="+1"
              ></button>
              <button
                type="button"
                className="cursor-pointer ql-clean"
              ></button>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Toolbar;
