"use client";

import * as React from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type Option } from "~/types";
import Link from "next-intl/link";

import { getRandomPatternStyle } from "~/server/pattern";
import { Course, type Product, type Store } from "~/data/db/schema";
import { useDebounce } from "~/hooks/use-debounce";
import { ProductCard } from "~/islands/modules/cards/product-card";
import { PaginationButton } from "~/islands/navigation/pagination/pagination-button";

import { CourseCard } from "./modules/cards/course-card";
import { AspectRatio } from "./primitives/aspect-ratio";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./primitives/card";

interface ProductsProps extends React.HTMLAttributes<HTMLDivElement> {
  products: Course[];
  pageCount: number;
  category?: Product["category"];
  categories?: Product["category"][];
  stores?: Pick<Store, "id" | "name">[];
  storePageCount?: number;
}

export function Courses({
  products,
  pageCount,
  category,
  categories,
  stores,
  storePageCount,
  ...props
}: ProductsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = React.useTransition();

  // Search params
  const page = searchParams?.get("page") ?? "1";
  const per_page = searchParams?.get("per_page") ?? "8";
  const sort = searchParams?.get("sort") ?? "createdAt.desc";
  const store_ids = searchParams?.get("store_ids");

  // Create query string
  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams],
  );

  // Price filter
  const [priceRange, setPriceRange] = React.useState<[number, number]>([
    0, 500,
  ]);
  const debouncedPrice = useDebounce(priceRange, 500);

  React.useEffect(() => {
    const [min, max] = debouncedPrice;
    startTransition(() => {
      router.push(
        `${pathname}?${createQueryString({
          price_range: `${min}-${max}`,
        })}`,
        {
          scroll: false,
        },
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedPrice]);

  // Category filter
  const [selectedCategories, setSelectedCategories] = React.useState<
    Option[] | null
  >(null);

  React.useEffect(() => {
    startTransition(() => {
      router.push(
        `${pathname}?${createQueryString({
          categories: selectedCategories?.length
            ? // Join categories with a dot to make search params prettier
              selectedCategories.map((c) => c.value).join(".")
            : null,
        })}`,
        {
          scroll: false,
        },
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories]);

  // Subcategory filter
  const [selectedSubcategories, setSelectedSubcategories] = React.useState<
    Option[] | null
  >(null);

  React.useEffect(() => {
    startTransition(() => {
      router.push(
        `${pathname}?${createQueryString({
          subcategories: selectedSubcategories?.length
            ? selectedSubcategories.map((s) => s.value).join(".")
            : null,
        })}`,
        {
          scroll: false,
        },
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubcategories]);

  // Store filter
  const [storeIds, setStoreIds] = React.useState<number[] | null>(
    store_ids?.split(".").map(Number) ?? null,
  );

  React.useEffect(() => {
    startTransition(() => {
      router.push(
        `${pathname}?${createQueryString({
          store_ids: storeIds?.length ? storeIds.join(".") : null,
        })}`,
        {
          scroll: false,
        },
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storeIds]);

  return (
    <section className="flex flex-col space-y-6 lg:col-span-2" {...props}>
      {!isPending && !products.length ? (
        <div className="mx-auto flex max-w-xs flex-col space-y-1.5">
          <h1 className="text-center text-2xl font-bold">No products found</h1>
          <p className="text-center text-muted-foreground">
            Try changing your filters, or check back later for new products
          </p>
        </div>
      ) : null}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:col-span-3">
        {products.map((course) => (
          <Link
            key={course.id}
            aria-label={course.title}
            href={`/courses/${course.handle}`}
          >
            <Card className="h-full overflow-hidden">
              <AspectRatio ratio={21 / 9}>
                <div className="absolute inset-0 bg-gradient-to-t from-transparent to-zinc-950/20" />

                <div
                  className="h-full rounded-t-md"
                  style={
                    course.thumbnail
                      ? {
                          backgroundImage: `url(${course.thumbnail.url})`,
                          backgroundPosition: "center",
                          backgroundSize: "cover",
                          backgroundRepeat: "no-repeat",
                        }
                      : getRandomPatternStyle(String(course.id))
                  }
                />
              </AspectRatio>
              <CardHeader>
                <CardTitle className="line-clamp-1 text-lg">
                  {course.title}
                </CardTitle>
                {course.excerpt ? (
                  <CardDescription className="line-clamp-2">
                    {course.excerpt}
                  </CardDescription>
                ) : null}
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
      {products.length ? (
        <PaginationButton
          pageCount={pageCount}
          page={page}
          per_page={per_page}
          sort={sort}
          createQueryString={createQueryString}
          router={router}
          pathname={pathname}
          isPending={isPending}
          startTransition={startTransition}
        />
      ) : null}
    </section>
  );
}