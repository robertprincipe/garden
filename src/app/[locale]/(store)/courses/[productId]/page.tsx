import { type Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { Icon } from "~/components/icon";
import { and, desc, eq, not } from "drizzle-orm";
import Link from "next-intl/link";

import { getRandomPatternStyle } from "~/server/pattern";
import { formatPrice, toTitleCase } from "~/server/utils";
import { db } from "~/data/db/client";
import { courses, products, stores } from "~/data/db/schema";
import { fullURL } from "~/data/meta/builder";
import { AddToCartForm } from "~/forms/add-to-cart-form";
import { ProductCard } from "~/islands/modules/cards/product-card";
import { Breadcrumbs } from "~/islands/navigation/pagination/breadcrumbs";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/islands/primitives/accordion";
import { AspectRatio } from "~/islands/primitives/aspect-ratio";
import { Button } from "~/islands/primitives/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/islands/primitives/dialog";
import { Separator } from "~/islands/primitives/separator";
import { ProductImageCarousel } from "~/islands/product-carousel";
import VideoPlayer from "~/islands/video-player";
import { Shell } from "~/islands/wrappers/shell-variants";

export const metadata: Metadata = {
  metadataBase: fullURL(),
  title: "Product",
  description: "Product description",
};

interface ProductPageProps {
  params: {
    productId: string;
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const productId = params.productId;

  const product = await db.query.courses.findFirst({
    where: eq(courses.handle, productId),
  });

  if (!product) {
    notFound();
  }

  return (
    <Shell>
      {/* <Breadcrumbs
        segments={[
          {
            title: "Products",
            href: "/products",
          },
          {
            title: product.title,
            href: `/product/${product.handle}`,
          },
        ]}
      /> */}

      <div className="mb-6 flex flex-col-reverse lg:flex-row items-start gap-x-8 gap-y-2">
        <div className="lg:w-2/3 w-full">
          {/* <div className="flex items-center space-x-1 text-muted-foreground">
            <Icon icon="ph:squares-four-fill" />
            <span>Desarrollo personal</span>
          </div> */}
          <h1 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl">
            {product.title}
          </h1>
          <p className="leading-normal text-muted-foreground text-lg my-3 sm:leading-8">
            {product.excerpt}
          </p>
          <div className="flex flex-col md:flex-row gap-2 md:items-center justify-between">
            <div className="flex items-center justify-start space-x-3 rounded-xl">
              <div className="flex h-12 w-12 flex-col items-center justify-center rounded-full ">
                <img
                  src="https://cdn.leonardo.ai/users/6b2d9018-eb4a-4862-8b38-84b3724e63de/generations/7cd683f5-de3c-4cb2-bed1-dbcf3ff8858b/variations/Default_A_Tshirt_Prints_woodland_forest_rushing_river_sunset_c_1_7cd683f5-de3c-4cb2-bed1-dbcf3ff8858b_1.jpg?w=512"
                  alt=""
                  className="h-[54px] w-[54px] rounded-full"
                />
              </div>

              <div className="">
                <h4 className="font-semibold">Alpha Code</h4>
                <span className="text-sm text-heavy-metal-600">@ac/dc</span>
              </div>
            </div>

            <div className="flex gap-x-2 gap-y-1 text-heavy-metal-600">
              <div className="flex items-center space-x-1 text-sm font-medium">
                <Icon icon="ph:calendar-blank-duotone" className="text-lg" />
                <span>Updated June 2023</span>
              </div>
              <div className="flex items-center space-x-1 text-sm font-medium">
                <Icon icon="ph:translate-duotone" className="text-lg" />
                <span>Español</span>
              </div>
            </div>
          </div>

          <div className="my-6 flex items-start sm:items-center gap-3 sm:flex-row flex-col">
            <Button className="flex flex-col items-center px-12 py-2" size="lg">
              <span>Inscribirse ahora</span>
              <span className="text-sm font-light">27 de Julio</span>
            </Button>
            <p className="text-center text-sm font-light text-heavy-metal-700">
              Garantía de reembolso de 14 días.
            </p>
          </div>
          <div className="mb-6 grid sm:grid-cols-2 gap-4 md:grid-cols-3">
            <div className="rounded-lg bg-card p-3">
              <Icon
                icon="ph:clock-clockwise-duotone"
                className="text-5xl text-primary"
              />
              <p className="mt-3 flex justify-end text-heavy-metal-600">
                1h de contenido
              </p>
            </div>
            <div className="rounded-lg bg-card p-3">
              <Icon
                icon="ph:barbell-duotone"
                className="text-5xl text-primary"
              />
              <p className="mt-3 flex justify-end text-heavy-metal-600">
                2h de practica
              </p>
            </div>
            <div className="sm:col-span-2 rounded-lg bg-card p-3 md:col-span-1">
              <Icon
                icon="ph:package-duotone"
                className="text-5xl text-primary"
              />
              <p className="mt-3 flex justify-end text-heavy-metal-600">
                10 recursos
              </p>
            </div>
          </div>

          <div className="mt-5">
            <h3 className="mb-4 text-2xl font-bold">Metas</h3>
            <ul className="space-y-2 text-heavy-metal-700 md:columns-2">
              <li className="flex items-center space-x-1.5">
                <Icon icon="ph:target-bold" className="text-xl" />{" "}
                <span>Ganar mucho dinero</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Icon icon="ph:target-bold" className="text-xl" />
                <span>Poder hablar facilmente con las personas</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <Icon icon="ph:target-bold" className="text-xl" />
                <span>Siempre verme confiado</span>
              </li>
            </ul>
          </div>
          <div className="prose prose-zinc mt-3 max-w-none dark:prose-invert">
            <h2>Curso de Prompt Engineer</h2>
            <p>
              Este curso te enseñará cómo construir modelos de lenguaje que
              puedan generar texto, traducir idiomas, escribir diferentes tipos
              de contenido creativo y responder a tus preguntas de forma
              informativa. Aprenderás los fundamentos de la inteligencia.
            </p>
          </div>
          <div className="mb-6">
            <h3 className="mb-4 mt-6 text-2xl font-bold">Temario del curso</h3>
            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="description">
                <AccordionTrigger>Description</AccordionTrigger>
                <AccordionContent>
                  {product.description ??
                    "No description is available for this product."}
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>
        </div>
        <article className="lg:sticky lg:w-1/3 inset-x-0 w-full lg:top-24 overflow-hidden lg:rounded-xl lg:bg-card">
          <Dialog>
            <DialogTrigger asChild>
              <div className="relative">
                {product.thumbnail ? (
                  <AspectRatio ratio={16 / 9}>
                    <div
                      className="h-full w-full"
                      style={
                        product.thumbnail
                          ? {
                              backgroundImage: `url(${product.thumbnail.url})`,
                              backgroundPosition: "center",
                              backgroundSize: "cover",
                              backgroundRepeat: "no-repeat",
                            }
                          : getRandomPatternStyle(String(product.id))
                      }
                    />
                  </AspectRatio>
                ) : null}

                <div className="absolute inset-0 flex cursor-pointer items-center justify-center transition duration-300 ease-linear group-hover:bg-primary/10">
                  <Icon
                    icon="ph:play-circle-duotone"
                    className="text-6xl text-primary group-hover:text-white"
                  />
                </div>
              </div>
            </DialogTrigger>
            <DialogContent>
              <h2 className="mb-2 text-xl font-semibold">Preview al curso</h2>
              <VideoPlayer
                provider="youtube"
                videoId="https://youtu.be/SpfIwlAYaKk?si=xLFy0i_Wtb5D4A4a"
              />
            </DialogContent>
          </Dialog>

          <div className="p-3 hidden lg:block">
            <div className="mb-2 flex items-center justify-between">
              <div className="flex items-center space-x-1">
                <div className="text-2xl font-semibold">
                  {formatPrice(product.price)}
                </div>
                <div className="text-light text-xl font-semibold text-muted-foreground line-through">
                  {formatPrice(product.compareAtPrice)}
                </div>
              </div>
              <span className="rounded-md bg-secondary text-secondary-foreground text-sm px-2.5 py-1 font-medium">
                40% off
              </span>
            </div>
            <div className="flex items-center justify-between space-x-2">
              <div className="font-medium text-secondary-foreground">
                420 estudiantes
              </div>
              <div className="flex items-center space-x-1">
                <div className="text-lg font-bold">4.7</div>
                <Icon
                  icon="ph:star-fill"
                  className="text-2xl text-yellow-300"
                />
              </div>
            </div>
          </div>
        </article>
      </div>
    </Shell>
  );
}
