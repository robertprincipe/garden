import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSession } from "next-auth/react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { addInteractionAction } from "~/server/actions/interactions";
import { catchError } from "~/server/utils";
import { Interaction, interactionSchema } from "~/data/validations/interaction";
import { Icons } from "~/islands/icons";
import { Button } from "~/islands/primitives/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "~/islands/primitives/form";
import { Textarea } from "~/islands/primitives/textarea";

type Inputs = z.infer<typeof interactionSchema>;

type AddInteractionFormProps = {
  chapterId: string;
  courseId: string;
  setComments: React.Dispatch<React.SetStateAction<Interaction[] | undefined>>;
};

export function AddInteractionForm({
  chapterId,
  courseId,
  setComments,
}: AddInteractionFormProps) {
  const { data: session } = useSession();
  // transition
  const [isPending, startTransition] = React.useTransition();
  const form = useForm<Inputs>({
    resolver: zodResolver(interactionSchema),
    defaultValues: {
      content: "",
    },
  });

  async function onSubmit(data: Inputs) {
    startTransition(async () => {
      const { result, error } = await addInteractionAction({
        ...data,
        userId: session?.userId ?? "",
        chapterId,
        courseId,
      });

      if (error) {
        catchError(error);
        return;
      }
      setComments((comments) => [result, ...(comments ?? [])]);
      form.reset();
      toast("Comentario agregado");
    });
  }

  return (
    <Form {...form}>
      <form
        className="my-2"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormControl>
                <Textarea
                  placeholder="Type store description here."
                  rows={3}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end mt-2">
          <Button type="submit" size="sm" disabled={isPending}>
            {isPending ? (
              <Icons.spinner className="animate-spin text-base" />
            ) : (
              <Icons.send className="text-base" />
            )}
            Comentar
          </Button>
        </div>
      </form>
    </Form>
  );
}
