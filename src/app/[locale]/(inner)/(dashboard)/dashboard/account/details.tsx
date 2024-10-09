"use client";

import { siteConfig } from "~/app";
import { Link } from "~/core/link";
import { signOut, useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { cnBase } from "tailwind-variants";

import { typography } from "~/server/text";
import { cn } from "~/server/utils";
import { IAccount, IUser } from "~/data/routers/handlers/users";
import { Button, buttonVariants } from "~/islands/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "~/islands/primitives/card";
import { Separator } from "~/islands/primitives/separator";
import { Shell } from "~/islands/wrappers/shell-variants";

export function AccountDetails({
  user,
  accounts,
}: {
  user?: IUser | null;
  accounts: IAccount[];
}) {
  const t = useTranslations();
  const { data: session } = useSession();
  const userDetails = [
    {
      key: "Sign-in Email",
      value: session?.user?.email,
    },
    {
      key: "First Service",
      value: user?.provider,
    },
    {
      key: "Linked Services",
      value: accounts.map((account) => account.provider).join(", "),
    },
  ];
  const handleSignOut = async () => {
    if (session) await signOut({ callbackUrl: "/sign-in" });
  };
  return (
    <Shell
      className={
        "flex flex-col max-w-xl justify-center -mt-14 container lg:max-w-none lg:grid-cols-2 lg:px-0 sm:max-w-lg self-center min-h-screen items-center"
      }
    >
      <Card>
        <CardHeader className="flex flex-row justify-between border-b items-baseline px-4">
          <Link
            className="z-20 flex items-center dark:text-zinc-200 text-zinc-800 font-heading bg-transparent text-lg font-medium transition-colors hover:bg-accent lg:hover:bg-primary-foreground/10 hover:underline"
            href="/"
          >
            {siteConfig.name}
          </Link>

          <CardDescription
            className={cnBase(
              typography.p,
              "mb-2 font-bold flex flex-col text-base space-y-2 text-center",
            )}
          >
            Manage Your Accounts
          </CardDescription>
        </CardHeader>

        <CardContent className="lg:p-8 container top-1/2 col-span-1 flex items-center md:static md:top-0 md:col-span-2 md:flex md:translate-y-0 lg:col-span-1">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6">
            <div className="flex gap-8 flex-col mx-auto mb-4 content-center">
              <p className="mx-auto mt-4 !block leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                {t("auth-pages-content.description")}
              </p>

              <div className="self-center">
                <Separator className="mt-2 mb-8" />
                <div className="flex flex-col gap-2 mb-4">
                  {userDetails.map((detail) => (
                    <div key={detail.key} className="grid grid-cols-2">
                      <span className="font-semibold">{detail.key}</span>
                      <span>{detail.value}</span>
                    </div>
                  ))}
                </div>
                <Separator className="my-8" />
                <Link
                  href="/dashboard/stores"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "mr-2 px-3",
                  )}
                >
                  🪪 Dashboard
                </Link>
                <Link
                  href="/"
                  className={cn(
                    buttonVariants({ variant: "default" }),
                    "mr-2 px-3",
                  )}
                >
                  🏠 Home Page
                </Link>
                <Button
                  variant="outline"
                  className="p-4 rounded-md shadow-md font-medium"
                  onClick={handleSignOut}
                >
                  🔐 {t("auth-pages-content.sign-out")}
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Shell>
  );
}
