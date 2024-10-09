"use client";

import "/node_modules/flag-icons/css/flag-icons.min.css";

import { useSearchParams } from "next/navigation";
import { localeLabels, locales } from "~/i18n/locales";
import { usePathname, useRouter } from "~/navigation";
import { useLocale, useTranslations } from "next-intl";

import { useIsClient } from "~/hooks/use-is-client";
import { Button, type ButtonProps } from "~/islands/primitives/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/islands/primitives/dropdown";

type LocalizationMainSwitcherProps = ButtonProps & {
  iconClassName?: string;
  className?: string;
};

export default function LocalizationMainSwitcher({
  iconClassName = "mr-2",
  className,
  ...props
}: LocalizationMainSwitcherProps) {
  const t = useTranslations("LanguageSwitch");
  const client = useIsClient();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const locale = useLocale();

  if (!client)
    return (
      <Button
        disabled
        aria-label="Language Switcher"
        className="border rounded-md"
        variant="ghost"
        {...props}
      >
        <span className="hidden sm:block">
          <LocaleFlagIcon locale={locale} />
        </span>
      </Button>
    );

  const handleClick = (locale: string) => {
    router.replace(`${pathname}?${searchParams}`, {
      locale,
    });
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild className="outline-none">
          <Button variant="outline">
            {/* <span className="hidden md:block">
              <span className="flex">
                <LocaleFlagIcon locale={locale} />
                {localeLabels[locale as keyof typeof localeLabels]}
              </span>
            </span> */}
            <span className="flex items-center justify-center">
              <LocaleFlagIcon locale={locale} />
            </span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuLabel className="font-medium text-sm text-center py-1">
            {t("choose-language")}
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup
            value={locale}
            onValueChange={(val) => handleClick(val)}
          >
            {locales.map((locale: string) => (
              <DropdownMenuRadioItem
                key={locale}
                value={locale}
                className="flex"
              >
                <LocaleFlagIcon locale={locale} />
                <span className="ml-2">
                  {localeLabels[locale as keyof typeof localeLabels]}
                </span>
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

/** @see https://github.com/blefnk/garden/pull/3/commits */

type LocaleFlagIconProps = { locale: string };

function LocaleFlagIcon({ locale }: LocaleFlagIconProps) {
  if (locale === "en") {
    return <span aria-hidden="true" className="fi fi-gb" />;
  } else if (locale === "uk") {
    return <span aria-hidden="true" className="fi fi-ua" />;
  } else if (locale === "pl") {
    return (
      <span
        aria-hidden="true"
        className="border border-zinc-200 border-b-0 dark:border-none fi fi-pl"
      />
    );
  }
  return <span aria-hidden="true" className={`fi fi-${locale}`} />;
}
