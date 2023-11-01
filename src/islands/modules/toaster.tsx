"use client";

import { useTheme } from "next-themes";
import { Toaster } from "sonner";

const ToasterConfig = () => {
  const { resolvedTheme } = useTheme();
  return (
    <Toaster
      position="bottom-right"
      richColors
      // className="w-full"
      // expand
      // toastOptions={{ className: "w-full" }}
      closeButton
      theme={resolvedTheme ? (resolvedTheme as "light" | "dark") : "light"}
    />
  );
};

export default ToasterConfig;
