"use client";

import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { catchError } from "~/server/utils";
import { db } from "~/data/db/client";
import { units } from "~/data/db/schema";
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

const moduleSchema = z.object({
  name: z.string().min(3, "Al menos 3 caracteres"),
  position: z.number().positive().optional(),
  active: z.boolean(),
});

type Inputs = z.infer<typeof moduleSchema>;

const AddModuleForm = ({ courseId }: { courseId: number }) => {
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<Inputs>({
    resolver: zodResolver(moduleSchema),
    defaultValues: {
      name: "",
    },
  });

  async function onSubmit(data: Inputs) {
    startTransition(async () => {
      // try {
      //   await db.insert(units).values({ courseId, title: "Untitled Module" });
      // } catch (error) {
      //   catchError(error);
      // }
    });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
        className="flex flex-col rounded-md gap-y-1 px-4 py-2"
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

export default AddModuleForm;
