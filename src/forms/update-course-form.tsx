"use client";

import * as React from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateReactHelpers } from "@uploadthing/react/hooks";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

import {
  deleteCourseAction,
  updateCourseAction,
} from "~/server/actions/course";
import { deleteFileAction } from "~/server/actions/uploadthing";
// import { deleteFileAction } from "~/server/actions/uploadthing";
import { catchError, isFile } from "~/server/utils";
import { Course } from "~/data/db/schema";
import { courseSchema } from "~/data/validations/course";
import { DroppableImage } from "~/islands/droppable-image";
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

import { ArrayForm } from "./array-form";

const TextEditor = dynamic(() => import("~/islands/quill"), {
  ssr: false,
  loading: () => <LoadingEditor />,
});

interface IUpdateCourseFormProps {
  course: Course;
}

type Inputs = z.infer<typeof courseSchema>;

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

export function UpdateCourseForm({ course }: IUpdateCourseFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();
  // isPending deleting
  const [isPendingDeleting, startTransitionDeleting] = React.useTransition();

  const { startUpload } = useUploadThing("productImage");

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: course.title,
      excerpt: course.excerpt || "",
      description: course.description || "",
      price: course.price,
      prerequisites: course.prerequisites ?? [],
      goals: course.goals ?? [],
      compareAtPrice: course.compareAtPrice,
      handle: course.handle,
      published: course.published,
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

        if (data.thumbnail === null || images) {
          if (course.thumbnail) {
            deleteFileAction({ id: course.thumbnail.id });
          }
          // await fetch(`/api/uploadthing/${course.thumbnail!.id}`, {
          //   method: "DELETE",
          // });
        }

        await updateCourseAction({
          ...data,
          id: course.id,
          userId: course.userId,
          handle: data.title.toLowerCase().replace(/\s/g, "-"),
          thumbnail:
            typeof data.thumbnail === "string"
              ? course.thumbnail
              : images
              ? images
              : null,
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
        <div className="className=w-full lg:col-span-2 grid gap-4">
          <Card
            as="section"
            id="update-store"
            aria-labelledby="update-store-heading"
          >
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Actualiza tu curso</CardTitle>
              <CardDescription>
                Refina los detalles de tu curso aquí.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <FormItem className="flex w-full flex-col gap-1.5">
                <FormLabel>Imagen principal</FormLabel>
                <FormControl>
                  <DroppableImage
                    setValue={form.setValue}
                    name="thumbnail"
                    value={course.thumbnail?.url}
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
                    <FormLabel>Title</FormLabel>
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

          <ArrayForm />
        </div>
        <div className="w-full lg:col-span-1 grid gap-4">
          <Card
            as="section"
            id="update-store"
            aria-labelledby="update-store-heading"
          >
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Estado del curso</CardTitle>
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
          <Card>
            <CardHeader className="space-y-1">
              <CardTitle className="text-2xl">Precios y promociones</CardTitle>
              <CardDescription>Cambia el precio cuando quieras</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-2">
              <FormField
                control={form.control}
                name="goals"
                render={({ field }) => (
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio</FormLabel>
                        <FormControl>
                          <div className="relative mb-2 mt-6 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <span className="text-zinc-500 sm:text-sm">
                                $
                              </span>
                            </div>
                            <Input
                              className="block w-full py-1.5 pl-7"
                              placeholder="0.00"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              />
              <FormField
                control={form.control}
                name="goals"
                render={({ field }) => (
                  <FormField
                    control={form.control}
                    name="compareAtPrice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Precio de comparación</FormLabel>
                        <FormControl>
                          <div className="relative mb-2 mt-6 rounded-md shadow-sm">
                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                              <span className="text-zinc-500 sm:text-sm">
                                $
                              </span>
                            </div>
                            <Input
                              className="block w-full py-1.5 pl-7"
                              placeholder="0.00"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
              />
              <span className="mt-2 block text-sm font-light">
                Puedes cambiarlo cuando quieras
              </span>
            </CardContent>
          </Card>
        </div>
        <div className="flex md:ml-4 gap-x-2">
          <Button
            className="whitespace-nowrap"
            disabled={isPending || isPendingDeleting}
          >
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
              startTransitionDeleting(async () => {
                await deleteCourseAction({
                  id: course.id,
                });
                toast.success("Course deleted successfully.");
                router.push(`/dashboard/courses`);
              });
            }}
            disabled={isPending || isPendingDeleting}
          >
            {isPendingDeleting && (
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
