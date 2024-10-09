"use client";

import React, {
  useCallback,
  useEffect,
  useMemo,
  useState,
  type HTMLAttributes,
} from "react";
import { useSearchParams } from "next/navigation";
import { appts, siteConfig } from "~/app";
import { Link } from "~/core/link";
import { Loader2, MailIcon } from "lucide-react";
import {
  signIn,
  SignInResponse,
  signOut,
  useSession,
  type ClientSafeProvider,
} from "next-auth/react";
import { useTranslations } from "next-intl";
import { FaGoogle } from "react-icons/fa";
import { cnBase } from "tailwind-variants";

import { typography } from "~/server/text";
import { catchAuthError, cls, cn } from "~/server/utils";
import { IAccount, IUser } from "~/data/routers/handlers/users";
import { useToast } from "~/hooks/use-toast-2";
import { SignInForm } from "~/forms/sign-in-form";
import { SignUpForm } from "~/forms/sign-up-form";
import { Button, buttonVariants } from "~/islands/primitives/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "~/islands/primitives/card";
import { Separator } from "~/islands/primitives/separator";
import { Shell } from "~/islands/wrappers/shell-variants";

type AuthPageContentProps = HTMLAttributes<HTMLDivElement> & {
  providers?: Record<string, ClientSafeProvider> | null;
  accounts: IAccount[];
  user?: IUser | null;
  isRegPage: boolean;
};

// todo: move what possible to separate server-
// todo: component and include this one there.

export default function AuthPageContent({
  accounts,
  className,
  isRegPage = true,
  providers,
  user,
  ...props
}: AuthPageContentProps) {
  const t = useTranslations();
  const isAuthenticated = !!user;
  const { data: session } = useSession();
  const [isProviderLoading, setProviderLoading] = useState(false);

  const searchParams = useSearchParams();
  const { toast } = useToast();

  const credentialsProvider = useMemo(
    () => providers?.credentials,
    [providers],
  );
  const oauthProviders = useMemo(
    () =>
      Object.values(providers ?? {}).filter(
        (provider) => provider.type === "oauth",
      ),
    [providers],
  );

  /**
   * If this page loads with an error query
   * parameter, display the error message.
   */
  useEffect(() => {
    if (searchParams?.get("error")) {
      toast({
        ...catchAuthError(searchParams?.get("error")),
        variant: "destructive",
      });
    }
  }, [searchParams, toast]);

  /**
   * todo: Handle the form submission.
   */

  const handleSignIn = (provider: string) => {
    signIn(provider);
  };

  const handleSignOut = async () => {
    if (session) await signOut({ callbackUrl: "/sign-in" });
  };

  const providersConfig = [
    {
      id: "google",
      name: "Google",
      Component: <FaGoogle size={20} />,
    },
  ];

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

  /**
   * @see https://github.com/rexfordessilfie/next-auth-account-linking/tree/app-router
   */
  const linkedProviders = accounts.map((account) => account.provider);

  if (appts.debug) {
    console.log("[appts.debug]: Does user visits a sign up page?", isRegPage);
  }

  return (
    <Shell
      className={cls(
        "flex flex-col max-w-xl justify-center container lg:grid-cols-2 lg:px-0 sm:max-w-lg self-center min-h-screen items-center",
        isAuthenticated ? "lg:max-w-5xl" : "lg:max-w-lg",
        className,
      )}
      {...props}
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
            {isAuthenticated
              ? "Manage Your Accounts"
              : isRegPage
                ? `${t("RegisterForm.title")}`
                : `${t("LoginForm.title")}`}
          </CardDescription>
        </CardHeader>

        <CardContent className="lg:p-8 container top-1/2 col-span-1 flex items-center md:static md:top-0 md:col-span-2 md:flex md:translate-y-0 lg:col-span-1">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6">
            <div className="flex gap-8 flex-col mx-auto mb-4 content-center">
              {!isAuthenticated && (
                <>
                  <div>
                    <div className="space-y-4">
                      <p className="mx-auto mt-4 lg:mt-0 !block leading-normal text-muted-foreground sm:leading-7">
                        {isRegPage && (
                          <>
                            {t("RegisterForm.description")}{" "}
                            {t("RegisterForm.have-account")}{" "}
                            <Link
                              href="/sign-in"
                              className="px-0 text-muted-foreground underline underline-offset-4 hover:text-primary"
                            >
                              {t("RegisterForm.signin")}
                            </Link>
                          </>
                        )}
                        {!isRegPage && (
                          <>
                            {t("LoginForm.description")}{" "}
                            {t("LoginForm.no-account")}{" "}
                            <Link
                              href="/sign-up"
                              className="px-0 text-muted-foreground underline underline-offset-4 hover:text-primary"
                            >
                              {t("LoginForm.signup")}
                            </Link>
                          </>
                        )}
                      </p>

                      {credentialsProvider ? (
                        <>
                          {isRegPage ? <SignUpForm /> : <SignInForm />}

                          {oauthProviders.length ? (
                            <div className="relative">
                              <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                              </div>
                              <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-card px-2 text-muted-foreground">
                                  {isAuthenticated
                                    ? `${t("auth.other-options")}`
                                    : isRegPage
                                      ? `${t("RegisterForm.other-options")}`
                                      : `${t("LoginForm.other-options")}`}
                                </span>
                              </div>
                            </div>
                          ) : (
                            <></>
                          )}
                        </>
                      ) : (
                        <></>
                      )}
                    </div>
                  </div>
                </>
              )}

              {isAuthenticated && (
                <>
                  <p className="mx-auto mt-4 !block leading-normal text-muted-foreground sm:text-lg sm:leading-7">
                    {t("auth-pages-content.description")}
                  </p>
                </>
              )}

              <div className="flex space-y-2 flex-1 gap-4 flex-col items-center w-full">
                {providersConfig.map((provider) => {
                  const isLinked = linkedProviders.includes(provider.id);
                  return (
                    <div
                      key={provider.id}
                      className="w-full flex justify-center flex-row gap-2 items-baseline"
                    >
                      {isLinked && (
                        <span className="text-xs h-fit flex justify-center items-center px-2 py-2 bg-green-500 rounded-full"></span>
                      )}
                      <Button
                        variant="outline"
                        type="button"
                        disabled={isProviderLoading || isLinked}
                        onClick={() => {
                          if (!isLinked) {
                            setProviderLoading(true);
                            handleSignIn(provider.id);
                          } else return null;
                        }}
                        className={`transition duration-400 flex-1 text-lg px-4 py-5 shadow-md font-medium flex gap-1 items-center bg-muted text-accent-foreground hover:text-muted-foreground ${
                          isProviderLoading ? "animate-opacity" : ""
                        } ${isLinked ? "opacity-50 cursor-not-allowed" : ""}`}
                      >
                        {isProviderLoading ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            {provider.Component && provider.Component}
                            {t("LoginForm.wait")}
                          </>
                        ) : (
                          <>
                            {provider.Component && provider.Component}
                            {/* <img
                              src="https://www.kaggle.com/static/images/google-signin/g-logo.svg"
                              alt=""
                            /> */}
                            <span className="font-semibold">
                              {provider.name}
                            </span>
                          </>
                        )}
                      </Button>
                    </div>
                  );
                })}
              </div>

              {isAuthenticated && (
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
                  <div className="grid gap-2">
                    <Link
                      href="/dashboard/stores"
                      className={cn(
                        buttonVariants({ variant: "default" }),
                        "px-3",
                      )}
                    >
                      🪪 Dashboard
                    </Link>
                    <Link
                      href="/"
                      className={cn(
                        buttonVariants({ variant: "outline" }),
                        "px-3",
                      )}
                    >
                      🏠 Home Page
                    </Link>
                    <Button
                      variant="destructive"
                      disabled={isProviderLoading}
                      className="p-4 rounded-md shadow-md font-medium"
                      onClick={handleSignOut}
                    >
                      {isProviderLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                          {t("LoginForm.wait")}
                        </>
                      ) : (
                        <>🔐 {t("auth-pages-content.sign-out")}</>
                      )}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </CardContent>

        <CardFooter className="pl-8 text-sm justify-center items-baseline flex space-x-1 text-muted-foreground border-t">
          <h2 className="mt-8">
            By using the buttons above, you agree with{" "}
            <span>
              <Link
                href="/terms"
                className="text-muted-foreground font-semibold hover:underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>
            </span>
            <span className="mx-1">and</span>
            <span>
              <Link
                href="/privacy"
                className="text-muted-foreground font-semibold hover:underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </span>
          </h2>
        </CardFooter>
      </Card>
    </Shell>
  );
}
