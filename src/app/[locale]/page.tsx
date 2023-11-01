/**
 * `app/[locale]/page.tsx` is the UI (User Interface) for the /{locale} URL. Learn more here:
 * @see https://nextjs.org/docs/app/building-your-application/routing/pages-and-layouts#pages
 */

import Image from "next/image";
import {
  heroHeader,
  REPOSITORY_NAME,
  REPOSITORY_OWNER,
  REPOSITORY_URL,
  siteConfig,
} from "~/app";
import { desc, eq, sql } from "drizzle-orm";
import { Download, Store } from "lucide-react";
import Link from "next-intl/link";
import { FaDiscord } from "react-icons/fa";
import { Balancer } from "react-wrap-balancer";

import { productCategories } from "~/server/config/products";
import { typography } from "~/server/text";
import { cn } from "~/server/utils";
import { db } from "~/data/db/client";
import { products, stores } from "~/data/db/schema";
import { seo } from "~/data/meta";
import { Icons } from "~/islands/icons";
import { ProductCard } from "~/islands/modules/cards/product-card";
import { StoreCard } from "~/islands/modules/cards/store-card";
import { AspectRatio } from "~/islands/primitives/aspect-ratio";
import { Badge } from "~/islands/primitives/badge";
import { buttonVariants } from "~/islands/primitives/button";
import CommonSection from "~/islands/sections/common-section";
import FeaturesSection from "~/islands/sections/features-section";
import GeneralShell from "~/islands/wrappers/general-shell";
import { Shell } from "~/islands/wrappers/shell-variants";

import Features from "./features";

export const dynamic = "force-dynamic";

/**
 * Here you can override the metadata
 * from layout for this specific page
 */
export const metadata = seo({
  title: `Home – ${siteConfig.name}`,
});

export default async function HomePage() {
  const someProducts = await db
    .select({
      id: products.id,
      name: products.name,
      images: products.images,
      category: products.category,
      price: products.price,
      stripeAccountId: products.stripeAccountId,
    })
    .from(products)
    .limit(8)
    .orderBy(desc(products.createdAt))
    .leftJoin(stores, eq(products.storeId, stores.id))
    .groupBy(products.id)
    .orderBy(desc(products.stripeAccountId), desc(products.createdAt));

  const someStores = await db
    .select({
      id: stores.id,
      name: stores.name,
      description: stores.description,
      stripeAccountId: stores.stripeAccountId,
    })
    .from(stores)
    .limit(4)
    .leftJoin(products, eq(products.storeId, stores.id))
    .groupBy(stores.id)
    .orderBy(desc(stores.stripeAccountId), desc(sql<number>`count(*)`));

  return (
    <Shell className="container gap-12">
      <section className="mx-auto flex w-full flex-col items-start md:items-center gap-4 pb-4 pt-2 md:pb-8 md:pt-6 lg:py-10 md:flex-row">
        <div>
          <h1 className="text-3xl font-heading leading-tight tracking-tighter md:text-4xl lg:text-5xl lg:leading-[1.1]">
            <Balancer>
              Level up with the largest{" "}
              <span className="text-transparent bg-gradient-to-r from-blue-500 via-purple-600 to-green-500 bg-clip-text">
                AI & ML community
              </span>
            </Balancer>
          </h1>

          <p className="my-4 md:max-w-md text-muted-foreground">
            <Balancer>
              Join over 15M+ machine learners to share, stress test, and stay
              up-to-date on all the latest ML techniques and technologies.
              Discover a huge repository of community-published models, data &
              code for your next project.
            </Balancer>
          </p>
          <div className="flex lg:flex-row flex-col gap-2">
            <a
              className={buttonVariants({
                className: "gap-x-1 rounded-full",
              })}
              // inline-flex gap-x-0.5 rounded-full border border-blue-marguerite-900 px-3 py-2 text-sm font-bold text-blue-marguerite-900
              href="/"
            >
              <img
                src="https://www.kaggle.com/static/images/google-signin/g-logo.svg"
                alt=""
              />
              <span>Register with Google</span>
            </a>
            <a
              className={buttonVariants({
                className: "gap-x-1 rounded-full",
                variant: "outline",
              })}
              href="/"
            >
              Register with Email
            </a>
          </div>
        </div>
        <img
          src="https://th.bing.com/th/id/OIG.r60DZfZwcXkuC9moyeTt?pid=ImgGn"
          alt=""
          className="block md:w-1/2"
        />
      </section>

      <Features />

      <section
        id="featured-products"
        aria-labelledby="featured-products-heading"
        className="space-y-6 py-12"
      >
        <div className="flex items-center">
          <h2 className="flex-1 text-2xl font-heading sm:text-3xl">
            Featured products
          </h2>
          <Link aria-label="Products" href="/products">
            <div
              className={cn(
                buttonVariants({
                  size: "sm",
                }),
              )}
            >
              View all
            </div>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {someProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      <section
        id="create-a-store-banner"
        aria-labelledby="create-a-store-banner-heading"
        className="grid place-items-center gap-6 rounded-lg border bg-card px-6 py-16 text-center text-card-foreground shadow-sm"
      >
        <div className="text-2xl font-medium sm:text-3xl">
          Do you want to sell your products on our website?
        </div>
        <Link href="/sign-in">
          <div className={cn(buttonVariants())}>
            Create a store
            <span className="sr-only">Create a store</span>
          </div>
        </Link>
      </section>

      <section
        id="featured-stores"
        aria-labelledby="featured-stores-heading"
        className="space-y-6 pt-6 pb-12"
      >
        <div className="flex items-center">
          <h2 className="flex-1 text-2xl font-heading sm:text-3xl">
            Featured stores
          </h2>
          <Link aria-label="Stores" href="/stores">
            <div
              className={cn(
                buttonVariants({
                  size: "sm",
                }),
              )}
            >
              View all
            </div>
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {someStores.map((store) => (
            <StoreCard
              key={store.id}
              store={store}
              href={`/products?store_ids=${store.id}`}
            />
          ))}
        </div>
      </section>

      <section className=" w-full bg-card">
        {/* <Background /> */}
        <div className="border-y border-border py-16 md:py-20 relative">
          <div
            className=" bg-[#303a75]  border-t border-red-400 transition-all duration-500 w-full absolute bottom-0 blur-md"
            id="border"
          ></div>
          <div className="max-w-screen-lg px-6 mx-auto grid lg:grid-cols-2 gap-12">
            <div className="flex flex-col items-center md:items-start text-center md:text-left order-2 md:order-none">
              <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-card-foreground">
                Repurpose Your Data
              </h2>
              <p className="text-base font-normal tracking-normal max-w-lg mt-4 leading-7">
                <span className="text-muted-foreground text-medium">
                  One of the reasons loglib was created was because we
                  couldn&apos;t find a decent option that allowed us to
                  repurpose the data they collected at the time. So we developed
                  an embeddable one where you can grab your own data from your
                  database, but if you use the hosted version, either
                  self-deployed or on loglib.io, you lose that ability, so we
                  made sure you can access it through api just like it&apos;s in
                  your database.
                </span>{" "}
              </p>
              <Link
                href="/docs/api"
                className={buttonVariants({
                  className: "mt-6",
                  variant: "outline",
                })}
              >
                See API docs
                <svg
                  stroke="currentColor"
                  fill="currentColor"
                  strokeWidth="0"
                  viewBox="0 0 20 20"
                  className="relative transition–all duration-200 left-0.5 group-focus:left-1 group-hover:left-1 w-4 h-4 ml-1"
                  height="1em"
                  width="1em"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  ></path>
                </svg>
              </Link>
            </div>
            <div className="relative aspect-square mx-auto order-1 md:order-none">
              <div className="absolute inset-0 blur-2xl scale-110 rounded-full animate-spin-slow bg-gradient-to-tl from-card to-accent-foreground opacity-40"></div>
              <div className="p-px bg-gradient-to-t from-stone-800/60 to-stone-700/60 rounded-3xl overflow backdrop-blur-sm">
                <div className="bg-black/30 grid place-items-center p-7 md:p-12 rounded-3xl ">
                  <svg
                    width="71"
                    height="71"
                    viewBox="0 0 71 71"
                    fill="none"
                    className="h-20 md:h-32 w-20 md:w-32 fill-stone-300"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M35.5 65.0834C31.4076 65.0834 27.5618 64.3064 23.9625 62.7522C20.3632 61.1981 17.2323 59.0908 14.5698 56.4303C11.9073 53.7678 9.79993 50.6369 8.24779 47.0376C6.69565 43.4383 5.9186 39.5924 5.91663 35.5001C5.91663 31.4077 6.69368 27.5619 8.24779 23.9626C9.8019 20.3633 11.9092 17.2324 14.5698 14.5699C17.2323 11.9074 20.3632 9.80005 23.9625 8.24792C27.5618 6.69578 31.4076 5.91872 35.5 5.91675C39.5923 5.91675 43.4382 6.6938 47.0375 8.24792C50.6368 9.80203 53.7677 11.9093 56.4302 14.5699C59.0927 17.2324 61.201 20.3633 62.7551 23.9626C64.3092 27.5619 65.0853 31.4077 65.0833 35.5001V59.1667C65.0833 60.7938 64.5035 62.1872 63.3438 63.3469C62.1841 64.5065 60.7917 65.0854 59.1666 65.0834H35.5ZM35.5 59.1667C42.1069 59.1667 47.7031 56.874 52.2885 52.2886C56.8739 47.7032 59.1666 42.107 59.1666 35.5001C59.1666 28.8931 56.8739 23.297 52.2885 18.7115C47.7031 14.1261 42.1069 11.8334 35.5 11.8334C28.893 11.8334 23.2968 14.1261 18.7114 18.7115C14.126 23.297 11.8333 28.8931 11.8333 35.5001C11.8333 36.6341 11.9073 37.7435 12.0552 38.8282C12.2031 39.9129 12.425 40.973 12.7208 42.0084L21.7437 32.9855C21.9902 32.739 22.2861 32.5417 22.6312 32.3938C22.9763 32.2459 23.3461 32.1473 23.7406 32.098C24.0857 32.098 24.4309 32.1601 24.776 32.2844C25.1211 32.4086 25.4416 32.593 25.7375 32.8376L33.4291 39.272L43.1177 29.5834H41.4166C40.5784 29.5834 39.8753 29.2994 39.3073 28.7314C38.7393 28.1634 38.4563 27.4613 38.4583 26.6251C38.4583 25.7869 38.7423 25.0838 39.3103 24.5158C39.8783 23.9478 40.5804 23.6648 41.4166 23.6667H50.2916C51.1298 23.6667 51.8329 23.9507 52.4009 24.5187C52.9689 25.0867 53.2519 25.7889 53.25 26.6251V35.5001C53.25 36.3383 52.966 37.0414 52.398 37.6094C51.83 38.1774 51.1278 38.4604 50.2916 38.4584C49.4534 38.4584 48.7503 38.1744 48.1823 37.6064C47.6143 37.0384 47.3313 36.3363 47.3333 35.5001V33.799L35.6479 45.4105C35.4013 45.657 35.1055 45.8542 34.7604 46.0022C34.4152 46.1501 34.0701 46.224 33.725 46.224C33.3305 46.2733 32.9607 46.2359 32.6156 46.1116C32.2704 45.9874 31.95 45.803 31.6541 45.5584L24.0364 39.0501L15.3093 47.7772C17.3802 51.1792 20.1787 53.9285 23.7051 56.025C27.2314 58.1215 31.163 59.1687 35.5 59.1667ZM57.6875 60.6459C58.5257 60.6459 59.2287 60.3619 59.7967 59.7939C60.3647 59.2259 60.6478 58.5238 60.6458 57.6876C60.6458 56.8494 60.3618 56.1463 59.7938 55.5783C59.2258 55.0103 58.5237 54.7273 57.6875 54.7292C56.8493 54.7292 56.1462 55.0132 55.5782 55.5812C55.0102 56.1492 54.7272 56.8514 54.7291 57.6876C54.7291 58.5258 55.0131 59.2289 55.5811 59.7969C56.1491 60.3649 56.8512 60.6479 57.6875 60.6459Z"
                      fill="#DDDDDD"
                      className="fill-black/80 dark:fill-[#DDDDDD]"
                    ></path>
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section
        id="categories"
        aria-labelledby="categories-heading"
        className="space-y-6 py-2"
      >
        <div className="mx-auto flex flex-col items-center space-y-4 text-center">
          <h2 className="text-3xl font-heading leading-[1.1] sm:text-3xl md:text-5xl">
            Categories
          </h2>
          <Balancer className="leading-normal text-muted-foreground sm:text-lg sm:leading-7">
            Explore our categories and find the best products for you
          </Balancer>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {productCategories.map((category) => (
            <Link
              aria-label={`Go to ${category.title}`}
              key={category.title}
              href={`/categories/${category.title}`}
            >
              <div className="group relative overflow-hidden rounded-md">
                <AspectRatio ratio={4 / 5}>
                  <div className="absolute inset-0 z-10 bg-zinc-900/60 transition-colors group-hover:bg-zinc-800/70" />
                  {/* todo: fix strange src fetching error when changing screen size */}
                  <Image
                    src={category.image}
                    alt={category.title}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                    priority
                  />
                </AspectRatio>
                <div className="absolute inset-0 z-20 flex items-center flex-col justify-center">
                  <h3 className="text-3xl font-medium capitalize text-zinc-100 md:text-2xl">
                    {category.title}
                  </h3>
                  <p className="text-muted-foreground text-sm">3 cursos</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* <OssRepoSection githubStars={githubStars} /> */}
      <FeaturesSection />
      {/* <CommonSection /> */}
    </Shell>
  );
}

// [💡 INTERESTING THINGS SECTION 💡]

/**
 * !📄 "HOW TO USE TRPC-BASED COMPONENTS"
 *
 * ?1️⃣ Import the component and forse cache:
 * import { serverClient } from "~/islands/wrappers/trpc/server-client";
 * import TodoList from "~/islands/features/todo-list";
 * export const dynamic = "force-dynamic";
 *
 * ?2️⃣ Place this in your component before return:
 * const todos = await serverClient.getTodos();
 *
 * ?3️⃣ Use this inside the component:
 * <TodoList initialTodos={todos} />
 *
 * @see https://youtu.be/qCLV0Iaq9zU?t=996
 */

/**
 * !📄 "HOW TO GENERATE METADATA USING NEXT-INTL (CURRENTLY UNSTABLE)"
 *
 * ?1️⃣ Import the next things:
 * import { type Metadata } from "next";
 * import { LocaleLayoutParams } from "~/types";
 * import { getTranslator } from "next-intl/server";
 *
 * ?2️⃣ Use the next function:
 * export async function generateMetadata({
 *   params,
 * }: LocaleLayoutParams): Promise<Metadata> {
 *   const t = await getTranslator(params.locale, "landing");
 *   return {
 *     description: t("subtitle"),
 *   };
 * }
 *
 * @see https://next-intl-docs.vercel.app/docs/environments/metadata-route-handlers
 */

/**
 * !📄 "HOW TO GET AUTH-SESSION IN SERVER-COMPONENT"
 *
 * ?1️⃣ Import:
 * import { getServerSession } from "next-auth";
 * import { authOptions } from "~/server/auth";
 *
 * ?2️⃣ Add variables inside the component:
 * const session = await getServerSession(authOptions());
 *
 * ?2️⃣ Use code example inside the component:
 * <div>
 *   getServerSession Result
 *   {session?.user?.name ? (
 *     <div>{session?.user?.name}</div>
 *   ) : (
 *     <div>Not logged in</div>
 *   )}
 * </div>
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */

/**
 * !📄 "HOW TO GET AUTH-SESSION IN CLIENT-COMPONENT"
 *
 * ?1️⃣ Import:
 * import { getServerSession } from "next-auth";
 *
 * ?2️⃣ Add hook and vars inside the component:
 * const { data: session } = useSession();
 * const name = `${session?.user?.name ?? ""}`;
 *
 * ?2️⃣ Use code example inside the component:
 * <div>
 *   useSession User Name
 *   {name ? (
 *     <div>{name}</div>
 *   ) : (
 *     <div>Not logged in</div>
 *   )}
 * </div>
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
