import { type Metadata } from "next";

import { getCoursesAction } from "~/server/actions/course";
import { getProductsAction } from "~/server/actions/product";
import { getStoresAction } from "~/server/actions/store";
import { products } from "~/data/db/schema";
import { fullURL } from "~/data/meta/builder";
import { Courses } from "~/islands/courses";
import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "~/islands/navigation/page-header";
import { Badge, badgeVariants } from "~/islands/primitives/badge";
import { Shell } from "~/islands/wrappers/shell-variants";

export const metadata: Metadata = {
  metadataBase: fullURL(),
  title: "Products",
  description: "Buy products from our stores",
};

interface ProductsPageProps {
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

export default async function ProductsPage({
  searchParams,
}: ProductsPageProps) {
  const { page, per_page, sort, categories, price_range, store_page } =
    searchParams ?? {};

  // Products transaction
  const limit = typeof per_page === "string" ? parseInt(per_page) : 8;
  const offset = typeof page === "string" ? (parseInt(page) - 1) * limit : 0;

  const coursesTransaction = await getCoursesAction({
    limit,
    offset,
    sort: typeof sort === "string" ? sort : null,
    price_range: typeof price_range === "string" ? price_range : null,
  });

  const pageCount = Math.ceil(coursesTransaction.total / limit);

  // Stores transaction
  const storesLimit = 25;
  const storesOffset =
    typeof store_page === "string"
      ? (parseInt(store_page) - 1) * storesLimit
      : 0;

  const storesTransaction = await getStoresAction({
    limit: storesLimit,
    offset: storesOffset,
    sort: "productCount.desc",
  });

  const storePageCount = Math.ceil(storesTransaction.total / storesLimit);

  return (
    <Shell>
      <PageHeader
        id="products-page-header"
        aria-labelledby="products-page-header-heading"
      >
        <PageHeaderHeading size="sm">Courses</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Buy products from our stores
        </PageHeaderDescription>
      </PageHeader>
      <div className="grid lg:grid-cols-7 gap-6">
        <div className="lg:col-span-2">
          <h3 className="font-heading mb-3 text-xl">Buscar</h3>
          <div className="relative mx-auto">
            <input
              type="text"
              id="search"
              className="block bg-card rounded-xl px-2.5 pb-2.5 pt-5 w-full text-sm text-foreground border-2 border-border appearance-none focus:border-primary focus:outline-none focus:ring-0 peer"
              autoComplete="off"
              placeholder=" "
            />
            <label
              htmlFor="search"
              className="absolute text-sm text-muted-foreground duration-300 transform -translate-y-4 scale-75 top-4 z-10 origin-[0] left-2.5 peer-focus:text-primary peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-4"
            >
              Buscar...
            </label>
          </div>
          <div>
            <h3 className="font-heading my-3 text-xl">Categorias</h3>
            <div className="flex gap-2 flex-wrap">
              <button
                className={badgeVariants({
                  variant: "outline",
                  className:
                    "hover:bg-primary hover:text-primary-foreground hover:border-primary",
                })}
              >
                Ventas
              </button>
              <button
                className={badgeVariants({
                  variant: "outline",
                  className:
                    "hover:bg-primary hover:text-primary-foreground hover:border-primary",
                })}
              >
                Programación
              </button>
              <button
                className={badgeVariants({
                  variant: "outline",
                  className:
                    "hover:bg-primary hover:text-primary-foreground hover:border-primary",
                })}
              >
                Desarrollo personal
              </button>
              <button
                className={badgeVariants({
                  variant: "outline",
                  className:
                    "hover:bg-primary hover:text-primary-foreground hover:border-primary",
                })}
              >
                SaaS
              </button>
              <button
                className={badgeVariants({
                  variant: "outline",
                  className:
                    "hover:bg-primary hover:text-primary-foreground hover:border-primary",
                })}
              >
                Business
              </button>
            </div>
          </div>
        </div>
        <Courses
          id="products-page-products"
          aria-labelledby="products-page-products-heading"
          products={coursesTransaction.items}
          pageCount={pageCount}
          categories={Object.values(products.category.enumValues)}
          stores={storesTransaction.items}
          storePageCount={storePageCount}
        />
      </div>
    </Shell>
  );
}
