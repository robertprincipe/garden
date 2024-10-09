import * as React from "react";
import { type FileWithPreview } from "~/types";
import {
  useDropzone,
  type Accept,
  type FileRejection,
  type FileWithPath,
} from "react-dropzone";
import type {
  FieldPath,
  FieldValues,
  Path,
  PathValue,
  UseFormSetValue,
} from "react-hook-form";
import { toast } from "sonner";

import { cn } from "~/server/utils";
import { Icons } from "~/islands/icons";
import { Button } from "~/islands/primitives/button";

// FIXME Your proposed upload exceeds the maximum allowed size, this should trigger toast.error too

interface IDropVideoProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends React.HTMLAttributes<HTMLDivElement> {
  name: TName;
  setValue: UseFormSetValue<TFieldValues>;
  accept?: Accept;
  maxFiles?: number;
  maxSize?: number;
  file: FileWithPreview | null;
  setFile: React.Dispatch<React.SetStateAction<FileWithPreview | null>>;
  isUploading?: boolean;
  disabled?: boolean;
}

export function DropVideo<TFieldValues extends FieldValues>({
  name,
  setValue,
  accept = {
    "video/*": [],
  },
  file,
  maxFiles = 1,
  maxSize = 10000000,
  setFile,
  isUploading = false,
  disabled = false,
  className,
  ...props
}: IDropVideoProps<TFieldValues>) {
  const onDrop = React.useCallback(
    (acceptedFiles: FileWithPath[], rejectedFiles: FileRejection[]) => {
      // biome-ignore lint/complexity/noForEach: <explanation>
      acceptedFiles.forEach((file) => {
        const fileWithPreview = Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
        setFile(fileWithPreview);
      });

      if (rejectedFiles.length > 0) {
        // biome-ignore lint/complexity/noForEach: <explanation>
        rejectedFiles.forEach(({ errors }) => {
          if (errors[0]?.code === "file-too-large") {
            toast.error(
              `File is too large. Max size is ${maxSize / 1024 / 1024} MB`,
            );
            return;
          }
          errors[0]?.message && toast.error(errors[0].message);
        });
      }
    },

    [setFile],
  );

  // Register files to react-hook-form
  React.useEffect(() => {
    setValue(name, file as PathValue<TFieldValues, Path<TFieldValues>>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
  });

  // Revoke preview url when component unmounts
  React.useEffect(() => {
    return () => {
      if (!file) return;
      URL.revokeObjectURL(file.preview);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      {file ? (
        // biome-ignore lint/a11y/useMediaCaption: <explanation>
        <video
          src={file.preview}
          controls
          className="h-48 aspect-video w-full"
        />
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "group relative grid h-48 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25",
            "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            isDragActive && "border-muted-foreground/50",
            disabled && "pointer-events-none opacity-60",
            className,
          )}
          {...props}
        >
          <input {...getInputProps()} />
          {isUploading ? (
            <div className="group grid w-full place-items-center gap-1 sm:px-10">
              <Icons.upload
                className="h-9 w-9 animate-pulse text-muted-foreground"
                aria-hidden="true"
              />
            </div>
          ) : isDragActive ? (
            <div className="grid place-items-center gap-2 text-muted-foreground sm:px-5">
              <Icons.upload
                className={cn("h-8 w-8", isDragActive && "animate-bounce")}
                aria-hidden="true"
              />
              <p className="text-base font-medium">Drop the file here</p>
            </div>
          ) : (
            <div className="grid place-items-center gap-1 sm:px-5">
              <Icons.upload
                className="h-8 w-8 text-muted-foreground"
                aria-hidden="true"
              />
              <p className="mt-2 text-base font-medium text-muted-foreground">
                Drag {`'n'`} drop file here, or click to select file
              </p>
              <p className="text-sm text-slate-500">
                Please upload file with size less than
              </p>
            </div>
          )}
        </div>
      )}
      {file ? (
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="mt-2.5 w-full"
          onClick={() => setFile(null)}
        >
          <Icons.trash className="mr-2 h-4 w-4" aria-hidden="true" />
          Remove
          <span className="sr-only">Remove</span>
        </Button>
      ) : null}
    </div>
  );
}
