import { useFieldArray, useFormContext } from "react-hook-form";

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
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/islands/primitives/form";
import { Input } from "~/islands/primitives/input";

export function ArrayForm() {
  const form = useFormContext();
  const goals = useFieldArray({
    name: "goals" as const,
  });

  const prerequisites = useFieldArray({
    name: "prerequisites" as const,
  });
  return (
    <Card as="section" id="update-store" aria-labelledby="update-store-heading">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Precios y promociones</CardTitle>
        <CardDescription>Crea tus cupones aquí</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-2">
        <FormItem>
          <FormLabel>Requisito</FormLabel>
          <FormControl>
            <>
              {prerequisites.fields.map((prerequisite, index) => (
                <FormField
                  control={form.control}
                  key={index}
                  name={`prerequisites.${index}`}
                  render={({ field }) => (
                    <div className="relative">
                      <Input placeholder="Type store name here." {...field} />
                      <Button
                        type="button"
                        className="absolute right-0 top-1/2 -translate-y-1/2"
                        size="icon"
                        variant={"destructive"}
                        onClick={() => prerequisites.remove(index)}
                      >
                        <Icons.trash className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                />
              ))}
            </>
          </FormControl>
          <FormMessage />
        </FormItem>

        <Button
          type="button"
          className="whitespace-nowrap mt-2 w-fit"
          size="sm"
          onClick={() => prerequisites.append("")}
        >
          Add Prerequisite
        </Button>

        <FormItem>
          <FormLabel>Metas</FormLabel>
          <FormControl>
            <>
              {goals.fields.map((prerequisite, index) => (
                <FormField
                  control={form.control}
                  key={index}
                  name={`goals.${index}`}
                  render={({ field }) => (
                    <div className="relative">
                      <Input placeholder="Type store name here." {...field} />
                      <Button
                        type="button"
                        className="absolute right-0 top-1/2 -translate-y-1/2"
                        size="icon"
                        variant={"destructive"}
                        onClick={() => goals.remove(index)}
                      >
                        <Icons.trash className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                />
              ))}
            </>
          </FormControl>
          <FormMessage />
        </FormItem>
        <Button
          type="button"
          className="whitespace-nowrap mt-2 w-fit"
          size="sm"
          onClick={() => goals.append("")}
        >
          Add Goal
        </Button>
      </CardContent>
    </Card>
  );
}
