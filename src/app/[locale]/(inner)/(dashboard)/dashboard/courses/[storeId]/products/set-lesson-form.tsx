"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Icon } from "@iconify/react";
import { FileWithPreview } from "~/types";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { DropVideo } from "~/islands/drop-video";
import { Button } from "~/islands/primitives/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/islands/primitives/form";
import { Input } from "~/islands/primitives/input";
import { Switch } from "~/islands/primitives/switch";

const lessonSchema = z.object({
  name: z.string().min(3, "Al menos 3 caracteres"),
  position: z.number().positive().optional(),
  active: z.boolean(),
  video: z.unknown().refine((val) => {
    if (val instanceof File) {
      return true;
    }
    return false;
  }),
});

type Inputs = z.infer<typeof lessonSchema>;

const SetLessonForm = () => {
  const [file, setFile] = React.useState<FileWithPreview | null>(null);

  const [isPending, startTransition] = React.useTransition();

  const form = useForm<Inputs>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(data: Inputs) {
    startTransition(async () => {});
  }
  return (
    <Form {...form}>
      <form
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
        className="flex flex-col gap-y-1 px-4 py-2"
      >
        <FormField
          control={form.control}
          name="name"
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

        <FormItem>
          <FormLabel>Video</FormLabel>
          <FormControl>
            <DropVideo
              setValue={form.setValue}
              name="video"
              file={file}
              setFile={setFile}
            />
          </FormControl>
          <FormMessage />
        </FormItem>

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

        <div className="flex justify-end">
          <Button className="">Guardar</Button>
        </div>
      </form>
    </Form>
  );
};

export default SetLessonForm;
