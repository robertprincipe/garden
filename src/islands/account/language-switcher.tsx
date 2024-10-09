"use client";

import { HTMLAttributes, type FC } from "react";
import { Link } from "~/core/link";
import { locales } from "~/i18n/locales";
import { usePathname } from "~/navigation";
import clsx from "clsx";
import { useLocale } from "next-intl";

export const LanguageSwitcher: FC<
  Omit<HTMLAttributes<HTMLElement>, "children">
> = (props) => {
  const pathname = usePathname();
  const currentLocale = useLocale();

  return (
    <nav {...props}>
      <ul className="flex gap-4">
        {locales.map((locale) => (
          <li key={locale}>
            <Link
              href={pathname}
              className={clsx("hover:underline", {
                "font-bold": currentLocale === locale,
              })}
            >
              {locale.toUpperCase()}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};
