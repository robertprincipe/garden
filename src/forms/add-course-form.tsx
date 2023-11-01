"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateReactHelpers } from "@uploadthing/react/hooks";
import { FileWithPreview } from "~/types";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

import { addCourseAction } from "~/server/actions/course";
import { catchError, isArrayOfFile, isFile } from "~/server/utils";
import { courseSchema } from "~/data/validations/course";
import { DropImage } from "~/islands/drop-image";
import { DroppableImage } from "~/islands/droppable-image";
import { FileDialog } from "~/islands/file-dialog";
import { Icons } from "~/islands/icons";
import { Button } from "~/islands/primitives/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  UncontrolledFormMessage,
} from "~/islands/primitives/form";
import { Input } from "~/islands/primitives/input";
import { Textarea } from "~/islands/primitives/textarea";
import { OurFileRouter } from "~/app/(api)/api/uploadthing/core";

interface IAddCourseFormProps {
  userId: string;
}

type Inputs = z.infer<typeof courseSchema>;

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

export function AddCourseForm({ userId }: IAddCourseFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const [files, setFiles] = React.useState<FileWithPreview | null>(null);

  const { isUploading, startUpload } = useUploadThing("productImage");

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      excerpt: "",
    },
  });

  async function onSubmit(data: Inputs) {
    startTransition(async () => {
      try {
        const images = isFile(data.thumbnail)
          ? await startUpload([data.thumbnail]).then((res) => {
              const formattedImages = res?.map((image) => ({
                id: image.key,
                name: image.key.split("_")[1] ?? image.key,
                url: image.url,
              }));
              if (formattedImages?.[0]) {
                return formattedImages[0];
              }
              return null;
            })
          : null;
        await addCourseAction({
          ...data,
          userId,
          thumbnail: images,
          handle: data.title.toLowerCase().replace(/\s/g, "-"),
        });

        form.reset();
        toast.success("Store added successfully.");
        router.push("/dashboard/courses");
        router.refresh(); // Workaround for the inconsistency of cache revalidation
      } catch (err) {
        catchError(err);
      }
    });
  }

  return (
    <Form {...form}>
      <form
        className="grid w-full max-w-xl gap-5"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormItem className="flex w-full flex-col gap-1.5">
          <FormLabel>Imagen principal</FormLabel>
          {/* {files?.length ? (
            <div className="flex items-center gap-2">
              {files.map((file, i) => (
                <Zoom key={i}>
                  <Image
                    src={file.preview}
                    alt={file.name}
                    className="h-20 w-20 shrink-0 rounded-md object-cover object-center"
                    width={80}
                    height={80}
                  />
                </Zoom>
              ))}
            </div>
          ) : null} */}
          <FormControl>
            <DroppableImage
              setValue={form.setValue}
              name="thumbnail"
              maxSize={1024 * 1024 * 4}
              // file={file}
              // setFile={setFile}
              // isUploading={isUploading}
              // disabled={isPending}
            />
          </FormControl>
          <UncontrolledFormMessage
            message={form.formState.errors.description?.message}
          />
        </FormItem>
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Type store name here." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Extracto de la descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type store description here."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button className="w-fit" disabled={isPending}>
          {isPending && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Add Store
          <span className="sr-only">Add Store</span>
        </Button>
      </form>
    </Form>
  );
}
