"use client";

import * as React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "~/core/link";
import { signIn, SignInResponse } from "next-auth/react";
import { useForm } from "react-hook-form";
import { type z } from "zod";

import { catchAuthError, catchError } from "~/server/utils";
import { authSchema } from "~/data/validations/auth";
import { userAuthSchema } from "~/data/validations/user";
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

type FormData = z.infer<typeof userAuthSchema>;

export function SignInForm() {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = React.useTransition();

  const { toast } = useToast();

  // react-hook-form
  const form = useForm<z.infer<typeof userAuthSchema>>({
    resolver: zodResolver(userAuthSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(data: FormData) {
    startTransition(async () => {
      let signInResult: SignInResponse | undefined;

      if (isPending) {
        return;
      }

      try {
        signInResult = await signIn("credentials", {
          email: data.email.trim().toLowerCase(),
          password: data.password,
          callbackUrl: searchParams?.get("from") ?? "/",
        });
      } catch (err) {
        console.error(err);
      }

      if (!signInResult?.ok || signInResult.error) {
        toast({
          ...catchAuthError(signInResult?.error),
          variant: "destructive",
        });
      }

      toast({
        title: "Check your email",
        description:
          "We sent you a login link. Be sure to check your spam too.",
      });
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
          Sign in
          <span className="sr-only">Sign in</span>
        </Button>

        <Link
          aria-label="Reset password"
          href="/sign-in/reset-password"
          className="text-sm text-primary underline-offset-4 transition-colors hover:underline"
        >
          Reset password
        </Link>
      </form>
    </Form>
  );
}
