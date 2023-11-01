import * as React from "react";
import { Icon } from "~/components/icon";
import Cropper, { type ReactCropperElement } from "react-cropper";
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

import "cropperjs/dist/cropper.css";

import Image from "next/image";
import { createId } from "@paralleldrive/cuid2";
import { twMerge } from "tailwind-merge";

import { cn, formatBytes, formatFileSize, isFile } from "~/server/utils";
import { Button } from "~/islands/primitives/button";

import { Dialog, DialogContent, DialogHeader } from "./primitives/dialog";

// FIXME Your proposed upload exceeds the maximum allowed size, this should trigger toast.error too

interface IDroppableImageProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends React.HTMLAttributes<HTMLDivElement> {
  name: TName;
  setValue: UseFormSetValue<TFieldValues>;
  accept?: Accept;
  maxSize?: number;
  value?: File | string | null | undefined;
  isUploading?: boolean;
  disabled?: boolean;
}

const ERROR_MESSAGES = {
  fileTooLarge(maxSize: number) {
    return `The file is too large. Max size is ${formatFileSize(maxSize)}.`;
  },
  fileInvalidType() {
    return "Invalid file type.";
  },
  tooManyFiles(maxFiles: number) {
    return `You can only add ${maxFiles} file(s).`;
  },
  fileNotSupported() {
    return "The file is not supported.";
  },
};

const variants = {
  base: "ring-offset-background focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 border-muted-foreground/25 hover:bg-muted/25 group relative grid h-48 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed px-5 py-2.5 text-center transition",
  image:
    "border-0 p-0 min-h-0 min-w-0 relative shadow-md bg-slate-200 dark:bg-slate-900 rounded-md",
  active: "border-2",
  disabled:
    "bg-gray-200 border-gray-300 cursor-default pointer-events-none bg-opacity-30 dark:bg-gray-700",
  accept: "border-blue-500 bg-blue-500 bg-opacity-10",
  reject: "border-red-700 bg-red-700 bg-opacity-10",
};

export function DroppableImage<TFieldValues extends FieldValues>({
  name,
  setValue,
  accept = {
    "image/*": [],
  },
  value,
  maxSize = 1,
  isUploading = false,
  disabled = false,
  className,
  ...props
}: IDroppableImageProps<TFieldValues>) {
  const [file, setFile] = React.useState<File | string | null | undefined>(
    value,
  );

  const onDrop = React.useCallback(
    (acceptedFiles: FileWithPath[], rejectedFiles: FileRejection[]) => {
      acceptedFiles.forEach((file) => {
        const fileWithPreview = Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
        setFile(fileWithPreview);
      });
    },
    [maxSize, setFile],
  );

  // Register files to react-hook-form
  React.useEffect(() => {
    // if (!(typeof file === "string"))
    setValue(name, file as PathValue<TFieldValues, Path<TFieldValues>>);
  }, [file]);

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    fileRejections,
    isFocused,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept,
    maxSize,
    disabled,
  });

  // Revoke preview url when component unmounts
  React.useEffect(() => {
    return () => {
      if (typeof file === "string") URL.revokeObjectURL(file);
    };
  }, []);

  const errorMessage = React.useMemo(() => {
    if (fileRejections[0]) {
      const { errors } = fileRejections[0];
      if (errors[0]?.code === "file-too-large") {
        return ERROR_MESSAGES.fileTooLarge(maxSize ?? 0);
      }
      if (errors[0]?.code === "file-invalid-type") {
        return ERROR_MESSAGES.fileInvalidType();
      }
      return ERROR_MESSAGES.fileNotSupported();
    }
    return undefined;
  }, [fileRejections, maxSize]);

  const dropZoneClassName = React.useMemo(
    () =>
      twMerge(
        variants.base,
        isFocused && variants.active,
        disabled && variants.disabled,
        file && variants.image,
        (isDragReject ?? fileRejections[0]) && variants.reject,
        isDragAccept && variants.accept,
        className,
      ).trim(),
    [
      isFocused,
      file,
      fileRejections,
      isDragAccept,
      isDragReject,
      disabled,
      className,
    ],
  );

  return (
    <div className="">
      <p className="text-muted-foreground absolute left-5 top-4 text-sm font-medium">
        Upload your images
      </p>

      {file ? (
        <CropperCard file={file} setFile={setFile} />
      ) : (
        <>
          <div {...getRootProps()} className={dropZoneClassName} {...props}>
            <input {...getInputProps()} />
            {isUploading ? (
              <div className="group grid w-full place-items-center gap-1 sm:px-10">
                <Icon
                  icon="ph:cloud-arrow-up"
                  className="text-muted-foreground h-9 w-9 animate-pulse"
                  aria-hidden="true"
                />
              </div>
            ) : isDragActive ? (
              <div className="text-muted-foreground grid place-items-center gap-2 sm:px-5">
                <Icon
                  icon="ph:cloud-arrow-up"
                  className={cn("h-8 w-8", isDragActive && "animate-bounce")}
                  aria-hidden="true"
                />
                <p className="text-sm font-medium">Drop the file here</p>
              </div>
            ) : (
              <div className="grid place-items-center gap-1 sm:px-5">
                <Icon
                  icon="ph:cloud-arrow-up"
                  className="text-muted-foreground h-8 w-8"
                  aria-hidden="true"
                />
                <p className="text-muted-foreground mt-2 text-sm font-medium">
                  Drag {`'n'`} drop file here, or click to select file
                </p>
                <p className="text-sm text-slate-500">
                  Please upload file with size less than {formatBytes(maxSize)}
                </p>
              </div>
            )}
          </div>
          <div className="mt-1 text-xs text-red-500">{errorMessage}</div>
        </>
      )}
    </div>
  );
}

interface ICropperCardProps {
  file: File | string;
  setFile: React.Dispatch<
    React.SetStateAction<File | string | null | undefined>
  >;
}

function CropperCard({ file, setFile }: ICropperCardProps) {
  const [open, setOpen] = React.useState(false);
  const imageUrl = React.useMemo(() => {
    console.log("file", file);
    if (typeof file === "string") {
      return file;
    }

    return URL.createObjectURL(file);
  }, [file]);

  const [cropData, setCropData] = React.useState<string | null>(null);

  return (
    <div className="relative flex flex-col gap-2">
      <Image
        src={cropData ? cropData : imageUrl}
        alt={"file.name"}
        className="shrink-0 rounded-md w-full h-auto"
        width="0"
        height="0"
        sizes="100vw"
        loading="lazy"

        // blurDataURL=""
      />
      <div className="flex items-center gap-2 absolute right-2 top-2">
        <Button
          type="button"
          size="icon"
          onClick={() => setOpen(true)}
          className="h-7 w-7"
        >
          <Icon icon="ph:crop" className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Crop image</span>
        </Button>

        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="h-7 w-7"
          onClick={() => {
            if (!file) return;
            console.log("file", "null");

            setFile(null);
          }}
        >
          <Icon icon="ph:x" className="h-4 w-4" aria-hidden="true" />
          <span className="sr-only">Remove file</span>
        </Button>
      </div>
      {/* {isFile(file) && ( */}
      <CropperImage
        file={file}
        open={open}
        setOpen={setOpen}
        imageUrl={imageUrl}
        setFile={setFile}
        cropData={cropData}
        setCropData={setCropData}
      />
      {/* )} */}
    </div>
  );
}

type ICropperImageProps = {
  file: File | string;
  imageUrl: string;
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setFile: React.Dispatch<
    React.SetStateAction<File | string | null | undefined>
  >;
  cropData: string | null;
  setCropData: React.Dispatch<React.SetStateAction<string | null>>;
};

function CropperImage({
  file,
  imageUrl,
  cropData,
  setCropData,
  open,
  setOpen,
  setFile,
}: ICropperImageProps) {
  const cropperRef = React.useRef<ReactCropperElement>(null);

  const onCrop = React.useCallback(() => {
    if (!file || !cropperRef.current) return;

    const croppedCanvas = cropperRef.current?.cropper.getCroppedCanvas();
    setCropData(croppedCanvas.toDataURL());

    croppedCanvas.toBlob((blob) => {
      if (!blob) {
        console.error("Blob creation failed");
        return;
      }
      const fileName = `${createId()}.${blob.type.split("/")[1]}`;
      const croppedImage = new File([blob], fileName, {
        type: blob.type,
        lastModified: Date.now(),
      });

      setFile(croppedImage);
    });
  }, [file, setFile]);

  React.useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Enter") {
        onCrop();
        setOpen(false);
      }
    }
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [onCrop]);

  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogContent>
        <DialogHeader>
          {/* <p className="text-muted-foreground absolute left-5 top-4 text-sm font-medium"> */}
          Crop image
          {/* </p> */}
        </DialogHeader>
        <div className="grid place-items-center space-y-5">
          <Cropper
            ref={cropperRef}
            className="h-[450px] w-[450px] object-cover"
            zoomTo={0.5}
            initialAspectRatio={16 / 9}
            preview=".img-preview"
            src={imageUrl}
            viewMode={1}
            minCropBoxHeight={16}
            minCropBoxWidth={9}
            background={false}
            responsive={true}
            autoCropArea={1}
            checkOrientation={false} // https://github.com/fengyuanchen/cropperjs/issues/671
            guides={true}
          />
          <div className="flex items-center justify-center space-x-2">
            <Button
              aria-label="Crop image"
              type="button"
              size="sm"
              className="h-8"
              onClick={() => {
                onCrop();
                setOpen(false);
              }}
            >
              <Icon
                icon="ph:crop"
                className="mr-2 h-4 w-4"
                aria-hidden="true"
              />
              Crop Image
            </Button>
            <Button
              aria-label="Reset crop"
              type="button"
              variant="outline"
              size="sm"
              className="h-8"
              onClick={() => {
                cropperRef.current?.cropper.reset();
                setCropData(null);
              }}
            >
              <Icon
                icon="ph:arrow-counter-clockwise"
                className="mr-2 h-4 w-4"
                aria-hidden="true"
              />
              Reset Crop
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
