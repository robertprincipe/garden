"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type z } from "zod";

import { signUpAction } from "~/server/actions/user";
import { catchError } from "~/server/utils";
import { User } from "~/data/db/schema";
import { authSchema, signUpSchema } from "~/data/validations/auth";
import { useToast } from "~/hooks/use-toast-2";
import { Icons } from "~/islands/icons";
import { PasswordInput } from "~/islands/password-input";
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

type FormData = z.infer<typeof signUpSchema>;

export function SignUpForm() {
  const router = useRouter();
  const [isPending, startTransition] = React.useTransition();

  // react-hook-form
  const form = useForm<FormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  function onSubmit(data: FormData) {
    startTransition(async () => {
      try {
        await signUpAction(data);
        toast("We sent you a login link. Be sure to check your spam too");
      } catch (error) {
        catchError(error);
      }
    });
  }

  return (
    <Form {...form}>
      <form
        className="grid gap-4"
        onSubmit={(...args) => void form.handleSubmit(onSubmit)(...args)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Mari Villalobos" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <PasswordInput placeholder="**********" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button disabled={isPending}>
          {isPending && (
            <Icons.spinner
              className="mr-2 h-4 w-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Continue
          <span className="sr-only">Continue to email verification page</span>
        </Button>
      </form>
    </Form>
  );
}
