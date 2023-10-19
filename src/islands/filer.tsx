import * as React from "react";
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
import { toast } from "sonner";

import "cropperjs/dist/cropper.css";

import Image from "next/image";

import { cn, formatBytes } from "~/server/utils";
import { Icons } from "~/islands/icons";
import { Button } from "~/islands/primitives/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/islands/primitives/dialog";

// FIXME Your proposed upload exceeds the maximum allowed size, this should trigger toast.error too

interface IFilerProps<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>,
> extends React.HTMLAttributes<HTMLDivElement> {
  name: TName;
  setValue: UseFormSetValue<TFieldValues>;
  accept?: Accept;
  maxSize?: number;
  file: File | string | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  isUploading?: boolean;
  disabled?: boolean;
}

export function Filer<TFieldValues extends FieldValues>({
  name,
  setValue,
  accept = {
    "image/*": [],
  },
  file,
  maxSize = 1,
  setFile,
  isUploading = false,
  disabled = false,
  className,
  ...props
}: IFilerProps<TFieldValues>) {
  const onDrop = React.useCallback(
    (acceptedFiles: FileWithPath[], rejectedFiles: FileRejection[]) => {
      acceptedFiles.forEach((file) => {
        const fileWithPreview = Object.assign(file, {
          preview: URL.createObjectURL(file),
        });
        setFile(fileWithPreview);
      });

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ errors }) => {
          if (errors[0]?.code === "file-too-large") {
            toast.error(
              `File is too large. Max size is ${formatBytes(maxSize)}`,
            );
            return;
          }
          errors[0]?.message && toast.error(errors[0].message);
        });
      }
    },

    [maxSize, setFile],
  );

  // Register files to react-hook-form
  React.useEffect(() => {
    setValue(name, file as PathValue<TFieldValues, Path<TFieldValues>>);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
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

  return (
    <div className="">
      <p className="text-muted-foreground absolute left-5 top-4 text-base font-medium">
        Upload your images
      </p>

      {file ? (
        <CropperCard file={file} setFile={setFile} />
      ) : (
        <div
          {...getRootProps()}
          className={cn(
            "border-muted-foreground/25 hover:bg-muted/25 group relative grid h-48 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed px-5 py-2.5 text-center transition",
            "ring-offset-background focus-visible:ring-ring focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2",
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
            <div className="text-muted-foreground grid place-items-center gap-2 sm:px-5">
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
              <p className="text-muted-foreground mt-2 text-base font-medium">
                Drag {`'n'`} drop file here, or click to select file
              </p>
              <p className="text-sm text-slate-500">
                Please upload file with size less than {formatBytes(maxSize)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface ICropperCardProps {
  file: File | string;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
}

function CropperCard({ file, setFile }: ICropperCardProps) {
  const imageUrl = React.useMemo(() => {
    if (typeof file === "string") {
      return file;
    }

    return URL.createObjectURL(file);
  }, [file]);

  const [cropData, setCropData] = React.useState<string | null>(null);

  const [isOpen, setIsOpen] = React.useState(false);

  const urlToFile = () => {
    if (typeof file === "string") {
      getBlob(imageUrl).then((blob) => {
        const file = createFileFromBlob(blob, imageUrl);

        setFile(file);
      });
    }

    setIsOpen(true);
  };

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
      />
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <p className="text-muted-foreground line-clamp-1 max-w-[40px] truncate text-sm font-medium">
            {file instanceof File ? file.name : imageUrl}
          </p>
          <p className="text-xs text-slate-500">
            {file instanceof File
              ? `${(file.size / 1024 / 1024).toFixed(2)}MB`
              : "Uploaded"}
          </p>
        </div>

        <div className="flex items-center gap-2 px-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => urlToFile()}
          >
            <Icons.crop className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Crop image</span>
          </Button>

          <Button
            type="button"
            variant="outline"
            size="icon"
            className="h-7 w-7"
            onClick={() => {
              if (!file) return;
              setFile(null);
            }}
          >
            <Icons.close className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Remove file</span>
          </Button>
        </div>
      </div>
      {file instanceof File && file.type.startsWith("image/") && (
        <CropperImage
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          file={file}
          imageUrl={imageUrl}
          setFile={setFile}
          setCropData={setCropData}
        />
      )}
    </div>
  );
}

type ICropperImageProps = {
  file: File;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  imageUrl: string;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
  setCropData: React.Dispatch<React.SetStateAction<string | null>>;
};

async function getBlob(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Network response was not ok");
  const blob = await res.blob();
  return blob;
}

function createFileFromBlob(blob: Blob, url: string) {
  const file = new File([blob], url, {
    type: blob.type,
  });
  return file;
}

function CropperImage({
  file,
  isOpen,
  setIsOpen,
  imageUrl,
  setCropData,
  setFile,
}: ICropperImageProps) {
  const cropperRef = React.useRef<ReactCropperElement>(null);

  const onCrop = React.useCallback(() => {
    if (!file || !cropperRef.current) return;

    if (!(file instanceof File)) return;

    const croppedCanvas = cropperRef.current?.cropper.getCroppedCanvas();
    setCropData(croppedCanvas.toDataURL());

    croppedCanvas.toBlob((blob) => {
      if (!blob) {
        console.error("Blob creation failed");
        return;
      }
      const croppedImage = new File([blob], file.name, {
        type: file.type,
        lastModified: Date.now(),
      });

      const croppedFileWithPathAndPreview = Object.assign(croppedImage, {
        preview: URL.createObjectURL(croppedImage),
        path: file.name,
      }) satisfies File;

      setFile(croppedFileWithPathAndPreview);
    });
  }, [file, setFile]);

  React.useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Enter") {
        onCrop();
      }
    }
    document.addEventListener("keydown", handleKeydown);
    return () => document.removeEventListener("keydown", handleKeydown);
  }, [onCrop]);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent>
        <p className="text-muted-foreground absolute left-5 top-4 text-base font-medium">
          Crop image
        </p>
        <div className="mt-8 grid place-items-center space-y-5">
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
              }}
            >
              <Icons.crop className="h-4 w-4" aria-hidden="true" />
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
              <Icons.reset className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
              Reset Crop
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
