import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { deleteUnitAction, updateUnitAction } from "~/server/actions/course";
import { catchError } from "~/server/utils";
import { Unit, unitSchema } from "~/data/validations/course";
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

type Inputs = z.infer<typeof unitSchema>;

export function UpdateUnitForm({
  unit,
  setEditUnit,
  onUpdate,
  onDelete: onDeleteUnit,
}: {
  unit: Unit;
  setEditUnit: any;
  onUpdate: (unit: any) => void;
  onDelete: (unitId: string) => void;
}) {
  const [isPending, startTransition] = React.useTransition();



  const form = useForm<Inputs>({
    resolver: zodResolver(unitSchema),
    defaultValues: {
      title: unit.title,
      active: unit.active,
    },
  });

  async function onSubmit(data: Inputs) {
    startTransition(async () => {
      const error = await updateUnitAction({ ...data, id: unit.id });
      if (error) {
        catchError(error);
        return;
      }
      onUpdate({ ...data, id: unit.id });
      toast("Unidad actualizada correctamente.");
      setEditUnit(null);
    });
  }

  async function onDelete() {
    startTransition(async () => {
      const error = await deleteUnitAction({ id: unit.id });
      if (error) {
        catchError(error);
        return;
      }
      onDeleteUnit(unit.id);
      toast("Unidad eliminada correctamente.");
      setEditUnit(null);
    });
  }

  return (
    <Dialog open={!!unit} onOpenChange={() => setEditUnit(null)}>
      <DialogContent className="max-w-md">
        <Form {...form}>
          <form
            onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
            className="flex flex-col rounded-md gap-y-4 px-4 py-2"
          >
            <h3 className="font-semibold text-lg">Actulizar unidad</h3>
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

            <div className="flex justify-end gap-2">
              <Button
                className="whitespace-nowrap"
                variant={"destructive"}
                type="button"
                onClick={() => onDelete()}
                disabled={isPending}
              >
                {isPending && (
                  <Icons.spinner
                    className="mr-2 h-4 w-4 animate-spin"
                    aria-hidden="true"
                  />
                )}
                Eliminar
                <span className="sr-only">Eliminar</span>
              </Button>
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
