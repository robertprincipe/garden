"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateReactHelpers } from "@uploadthing/react/hooks";
import { FileWithPreview, StoredVideo } from "~/types";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

import { addChapterAction, addCourseAction } from "~/server/actions/course";
import { catchError, isFile, slugify } from "~/server/utils";
import { chapterSchema, courseSchema } from "~/data/validations/course";
import { DropVideo } from "~/islands/drop-video";
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
import { Switch } from "~/islands/primitives/switch";
import { Textarea } from "~/islands/primitives/textarea";
import { OurFileRouter } from "~/app/(api)/api/uploadthing/core";

interface IAddChapterFormProps {
  unitId: string;
  courseId: string;
}

type Inputs = z.infer<typeof chapterSchema>;

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

export function AddChapterForm({ unitId, courseId }: IAddChapterFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const [files, setFiles] = React.useState<FileWithPreview | null>(null);
  const [provider, setProvider] = React.useState("html5");

  const { isUploading, startUpload } = useUploadThing("productImage");

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      title: "",
      summary: "",
      length: "",
      video: "",
      active: true,
    },
  });

  async function onSubmit(data: Inputs) {
    let video: StoredVideo | null;
    startTransition(async () => {
      try {
        if (provider === "html5") {
          video = isFile(data.video)
            ? await startUpload([data.video]).then((res) => {
                const formattedImages = res?.map((image) => ({
                  id: image.key,
                  // name: image.key.split("_")[1] ?? image.key,
                  provider: "html5",
                  // url: image.url,
                }));
                if (formattedImages?.[0]) {
                  return formattedImages[0];
                }
                return null;
              })
            : null;
        } else {
          video = {
            id: typeof data.video === "string" ? data.video : "",
            provider: provider as "youtube" | "vimeo" | "html5",
          };
        }
        await addChapterAction({
          ...data,
          unitId,
          video,
          courseId,
          handle: slugify(data.title),
        });

        toast.success("Chapter added successfully.");
        router.push(`/dashboard/courses/${courseId}/units/`);
        // router.refresh(); // Workaround for the inconsistency of cache revalidation
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
        <FormItem className="flex w-full flex-col gap-1.5">
          <FormLabel>Video</FormLabel>
          <FormControl>
            <div className="flex gap-x-1">
              <Button
                type="button"
                size={"sm"}
                variant={"outline"}
                className={`${
                  provider === "html5"
                    ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground border-primary"
                    : ""
                }`}
                onClick={() => setProvider("html5")}
              >
                Subir video
              </Button>
              <Button
                type="button"
                size={"sm"}
                variant={"outline"}
                className={`${
                  provider === "youtube"
                    ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground border-primary"
                    : ""
                }`}
                onClick={() => setProvider("youtube")}
              >
                Youtube
              </Button>
              <Button
                type="button"
                size={"sm"}
                variant={"outline"}
                className={`${
                  provider === "vimeo"
                    ? "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground border-primary"
                    : ""
                }`}
                onClick={() => setProvider("vimeo")}
              >
                Video
              </Button>
            </div>
          </FormControl>
        </FormItem>
        {provider === "html5" ? (
          <FormItem className="flex w-full flex-col gap-1.5">
            <FormLabel>Video</FormLabel>
            <FormControl>
              <DropVideo
                setValue={form.setValue}
                name="video"
                // maxSize={1024 * 1024 * 4}
                file={files}
                setFile={setFiles}
                isUploading={isUploading}
                disabled={isPending}
              />
            </FormControl>
            <UncontrolledFormMessage
              message={form.formState.errors.video?.message}
            />
          </FormItem>
        ) : (
          <FormField
            control={form.control}
            name="video"
            render={({ field }) => (
              <FormItem>
                <FormLabel>
                  Ingresar url de <span className="capitalize">{provider}</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Type store description here."
                    {...field}
                    value={field.value || ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Resumen del video</FormLabel>
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
          name="length"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Duración del capitulo</FormLabel>
              <FormControl>
                <Input
                  placeholder="Ingrese una duración en minutos"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="active"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <div className="flex items-center gap-x-1">
                  <FormLabel>Activo</FormLabel>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </div>
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
          Add Chapter
          <span className="sr-only">Add Chapter</span>
        </Button>
      </form>
    </Form>
  );
}
