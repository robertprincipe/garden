"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { generateReactHelpers } from "@uploadthing/react/hooks";
import { FileWithPreview, StoredVideo } from "~/types";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

import {
  deleteChapterAction,
  updateChapterAction,
} from "~/server/actions/course";
import { catchError, isFile, slugify } from "~/server/utils";
import { Chapter, chapterSchema } from "~/data/validations/course";
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

interface UpdateChapterFormProps {
  chapter: Chapter;
}

type Inputs = z.infer<typeof chapterSchema>;

const { useUploadThing } = generateReactHelpers<OurFileRouter>();

export function UpdateChapterForm({ chapter }: UpdateChapterFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  const [files, setFiles] = React.useState<FileWithPreview | null>(null);
  const [provider, setProvider] = React.useState(
    chapter.video?.provider ?? "html5",
  );

  const { isUploading, startUpload } = useUploadThing("productImage");

  // react-hook-form
  const form = useForm<Inputs>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      title: chapter.title,
      summary: chapter.summary ?? "",
      video: chapter.video?.id,
      handle: chapter.handle,
      length: chapter.length,
      active: true,
    },
  });

  async function onSubmit(data: Inputs) {
    let video: StoredVideo = {
      id: typeof data.video === "string" ? data.video : "",
      provider,
    };
    startTransition(async () => {
      try {
        if (provider === "html5" && isFile(data.video)) {
          video = await startUpload([data.video]).then((res) => {
            const formattedImages = res?.map((image) => ({
              id: image.key,
              // name: image.key.split("_")[1] ?? image.key,
              provider: "html5" as "html5" | "youtube" | "vimeo",
              // url: image.url,
            }));
            if (formattedImages?.[0]) {
              return formattedImages[0];
            }
            return {
              id: "",
              provider: "html5" as "html5" | "youtube" | "vimeo",
            };
          });
        }
        await updateChapterAction({
          ...data,
          unitId: chapter.unitId,
          handle: slugify(data.title),
          id: chapter.id,
          video,
        });

        form.reset();
        toast.success("Chapter update successfully.");
        // router.push(`/dashboard/courses/${courseId}/units/`);
        router.refresh(); // Workaround for the inconsistency of cache revalidation
      } catch (err) {
        catchError(err);
      }
    });
  }

  const changeProvider = (provider: "html5" | "youtube" | "vimeo") => {
    setProvider(provider);
    form.setValue("video", "");
  };

  async function deleteChapter() {
    startTransition(async () => {
      const error = await deleteChapterAction({ id: chapter.id });

      if (error) {
        toast.error("Error deleting chapter.");
      } else {
        toast.success("Chapter deleted successfully.");
        router.push(`/dashboard/courses/`);
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
                onClick={() => changeProvider("html5")}
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
                onClick={() => changeProvider("youtube")}
              >
                <Icon icon="logos:youtube" />
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
                onClick={() => changeProvider("vimeo")}
              >
                <Icon icon="logos:vimeo" />
              </Button>
            </div>
          </FormControl>
        </FormItem>
        {provider === "html5" ? (
          <FormItem className="flex w-full flex-col gap-1.5">
            <FormControl>
              <DropVideo
                setValue={form.setValue}
                name="video"
                maxSize={1024 * 1024 * 4}
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
        <div className="flex items-center gap-2">
          <Button className="w-fit" disabled={isPending}>
            {isPending && (
              <Icons.spinner
                className="h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Update Chapter
            <span className="sr-only">Update Chapter</span>
          </Button>

          <Button
            className="w-fit"
            type="button"
            onClick={() => deleteChapter()}
            variant={"destructive"}
            disabled={isPending}
          >
            {isPending && (
              <Icons.spinner
                className="h-4 w-4 animate-spin"
                aria-hidden="true"
              />
            )}
            Delete Chapter
            <span className="sr-only">Delete Chapter</span>
          </Button>
        </div>
      </form>
    </Form>
  );
}
