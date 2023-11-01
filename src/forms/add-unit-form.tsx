import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { addUnitAction } from "~/server/actions/course";
import { catchError } from "~/server/utils";
import { unitSchema } from "~/data/validations/course";
import { Icons } from "~/islands/icons";
import { Button, buttonVariants } from "~/islands/primitives/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/islands/primitives/dialog";
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

import { Mention } from "./mention";

type Inputs = z.infer<typeof unitSchema>;

export function AddUnitForm({
  courseId,
  setUnits,
}: {
  courseId: string;
  setUnits: React.Dispatch<React.SetStateAction<any[]>>;
}) {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);
  const [isPending, startTransition] = React.useTransition();

  const form = useForm<Inputs>({
    resolver: zodResolver(unitSchema),
  });

  async function onSubmit(data: Inputs) {
    startTransition(async () => {
      try {
        const unit = await addUnitAction({ ...data, courseId });
        setOpen(false);
        router.refresh();
        setUnits((prev) => [...prev, unit]);
        form.reset();
        toast.success("Unidad creada correctamente.");
      } catch (error) {
        catchError(error);
      }
    });
  }
  return (
    <Dialog open={open} onOpenChange={() => setOpen(!open)}>
      <DialogTrigger className={buttonVariants()} onClick={() => setOpen(true)}>
        Crear modulo
      </DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <Form {...form}>
          <form
            onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
            className="flex flex-col rounded-md gap-y-4 px-4 py-2"
          >
            <h3 className="font-semibold text-lg">Crear nueva unidad</h3>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Titulo</FormLabel>
                  <FormControl>
                    <Input placeholder="Escribe un titulo aquí." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Mention
              users={[
                {
                  id: 1,
                  name: "Juan",
                },
                {
                  id: 2,
                  name: "Pedro",
                },
                {
                  id: 3,
                  name: "Maria",
                },
              ]}
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
              <Button className="whitespace-nowrap" disabled={isPending}>
                {isPending && (
                  <Icons.spinner
                    className="mr-2 h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                Guardar
                <span className="sr-only">Guardar</span>
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
