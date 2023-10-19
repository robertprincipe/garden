"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateReactHelpers } from "@uploadthing/react/hooks";
import { FileWithPreview } from "~/types";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

import {
  deleteCourseAction,
  updateCourseAction,
} from "~/server/actions/course";
import { catchError, isArrayOfFile, isFile } from "~/server/utils";
import { Course } from "~/data/db/schema";
import { courseSchema } from "~/data/validations/course";
import { DropImage } from "~/islands/drop-image";
import { FileDialog } from "~/islands/file-dialog";
import { Icons } from "~/islands/icons";
import { Button } from "~/islands/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/islands/primitives/card";
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
import { Switch } from "~/islands/primitives/switch";
import { Textarea } from "~/islands/primitives/textarea";
import LoadingEditor from "~/islands/quill/loading-editor";
import { OurFileRouter } from "~/app/(api)/api/uploadthing/core";

const TextEditor = dynamic(() => import("~/islands/quill"), {
  ssr: false,
  loading: () => <LoadingEditor />,
});

interface IUpdateCourseFormProps {
  course: Course;
}

type Inputs = z.infer<typeof courseSchema>;

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

async function getBlob(url: string) {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Network response was not ok");
  const blob = await res.blob();
  return blob;
}

function createFileFromBlob(blob: Blob, image: { name: string; url: string }) {
  const file = new File([blob], image.name, { type: blob.type });
  return Object.assign(file, { preview: image.url });
}

export function UpdateCourseForm({ course }: IUpdateCourseFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  const [file, setFile] = React.useState<FileWithPreview | null>(null);

  React.useEffect(() => {
    const image = course.thumbnail;
    if (course && image) {
      getBlob(image.url).then((blob) => {
        const fileWithPreview = createFileFromBlob(blob, image);
        setFile(fileWithPreview);
      });
    }
  }, [course]);

  const { isUploading, startUpload } = useUploadThing("productImage");

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: course.title,
      excerpt: course.excerpt || "",
      description: course.description || "",
      price: course.price,
      compareAtPrice: course.compareAtPrice,
      handle: course.handle,
      published: course.published,
    },
  });

  async function onSubmit(data: Inputs) {
    console.log(data.thumbnail);
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

        await updateCourseAction({
          ...data,
          id: course.id,
          thumbnail: images ?? course.thumbnail,
        });

        form.reset();
        toast.success("Course updated successfully.");
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
        className="grid w-full lg:grid-cols-3 gap-4 items-start"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <Card
          as="section"
          id="update-store"
          aria-labelledby="update-store-heading"
          className="w-full lg:col-span-2"
        >
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Update your store</CardTitle>
            <CardDescription>
              Update your store name and description, or delete it
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormItem className="flex w-full flex-col gap-1.5">
              <FormLabel>Imagen principal</FormLabel>
              <FormControl>
                <DropImage
                  setValue={form.setValue}
                  name="thumbnail"
                  maxSize={1024 * 1024 * 4}
                  file={file}
                  setFile={setFile}
                  isUploading={isUploading}
                  disabled={isPending}
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
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <TextEditor
                      placeholder="Descripción"
                      value={field.value}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <Card
          as="section"
          id="update-store"
          aria-labelledby="update-store-heading"
          className="w-full lg:col-span-1"
        >
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl">Precios y promociones</CardTitle>
            <CardDescription>Crea tus cupones aquí</CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="published"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between">
                  <div className="space-y-0.5">
                    <FormLabel>Visualización</FormLabel>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
        </Card>
        <div className="flex md:ml-4 gap-x-2">
          <Button className="whitespace-nowrap" disabled={isPending}>
            {isPending && (
              <Icons.spinner
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Update Course
            <span className="sr-only">Update Course</span>
          </Button>

          <Button
            className="whitespace-nowrap"
            variant="destructive"
            onClick={() => {
              startTransition(async () => {
                await deleteCourseAction({
                  id: course.id,
                });
                router.push(`/dashboard/courses`);
              });
            }}
            disabled={isPending}
          >
            {isPending && (
              <Icons.spinner
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Delete Product
            <span className="sr-only">Delete product</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
