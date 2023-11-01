"use client";

import * as React from "react";
import Image from "next/image";
import { Icon } from "~/components/icon";
import Cropper, { type ReactCropperElement } from "react-cropper";

import { createFileFromBlob, getBlob } from "~/server/utils";
import { Button } from "~/islands/primitives/button";

import { Dialog, DialogContent, DialogHeader } from "./primitives/dialog";

interface ICropperCardProps {
  file: File | string;
  setFile: React.Dispatch<
    React.SetStateAction<File | string | null | undefined>
  >;
}

function isFile(file: unknown): file is File {
  return file instanceof File;
}

export function CropperCard({ file, setFile }: ICropperCardProps) {
  const [open, setOpen] = React.useState(false);
  const imageUrl = React.useMemo(() => {
    if (typeof file === "string") {
      return file;
    }

    return URL.createObjectURL(file);
  }, [file]);

  const [cropData, setCropData] = React.useState<string | null>(null);

  const urlToFile = () => {
    if (typeof file === "string") {
      getBlob(imageUrl).then((blob) => {
        const file = createFileFromBlob(blob, imageUrl);
        setFile(file);
      });
    }
    setOpen(true);
  };

  return (
    <div className="relative flex flex-col gap-2">
      {/* <img

        className="h-auto w-full shrink-0 rounded-md"
      /> */}
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
          <p className="text-muted-foreground line-clamp-1 max-w-[160px] truncate text-sm font-medium">
            {isFile(file) ? file.name : imageUrl}
          </p>
          <p className="text-xs text-slate-500">
            {isFile(file)
              ? `${(file.size / 1024 / 1024).toFixed(2)}MB`
              : "Uploaded"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => urlToFile()}
            className="h-7 w-7"
          >
            <Icon icon="ph:crop" className="h-4 w-4" aria-hidden="true" />
            <span className="sr-only">Crop image</span>
          </Button>

          <Button
            type="button"
            variant="outline"
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
      </div>
      {/* {isFile(file) && ( */}
      <CropperImage
        file={file}
        open={open}
        setOpen={setOpen}
        imageUrl={imageUrl}
        setFile={setFile}
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
  setCropData: React.Dispatch<React.SetStateAction<string | null>>;
};

function CropperImage({
  file,
  imageUrl,
  setCropData,
  open,
  setOpen,
  setFile,
}: ICropperImageProps) {
  const cropperRef = React.useRef<ReactCropperElement>(null);

  const onCrop = React.useCallback(() => {
    if (!file || !cropperRef.current) return;

    if (!isFile(file)) return;

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
