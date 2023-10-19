import { type Metadata } from "next";
import dynamic from "next/dynamic";

import { getUnitsAction } from "~/server/actions/course";
import { Button, buttonVariants } from "~/islands/primitives/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "~/islands/primitives/dialog";
import { Input } from "~/islands/primitives/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/islands/primitives/select";

import AddModuleForm from "./add-module-form";
import Heading from "./heading";

export const metadata: Metadata = {
  title: "Products",
  description: "Manage your products",
};

interface ProductsPageProps {
  params: {
    storeId: string;
  };
  searchParams: {
    [key: string]: string | string[] | undefined;
  };
}

const CourseOutline = dynamic(() => import("./course-outline"), {
  ssr: false,
  loading: () => (
    <div className="space-y-3">
      <div className="overflow-hidden rounded-lg">
        <div className="flex h-10 animate-pulse items-center justify-between overflow-hidden border-x border-t border-x-zinc-100 border-t-zinc-100 bg-zinc-100 p-2 dark:border-x-zinc-900 dark:border-t-zinc-900 dark:bg-zinc-900" />
        <div className="flex h-10 w-full animate-pulse items-center justify-between bg-zinc-700 p-2" />
        <div className="flex h-10 w-full animate-pulse items-center justify-between bg-zinc-700 p-2" />
        <div className="flex h-10 w-full animate-pulse items-center justify-between bg-zinc-700 p-2" />
      </div>
      <div className="overflow-hidden rounded-lg">
        <div className="flex h-10 animate-pulse items-center justify-between overflow-hidden border-x border-t border-x-zinc-100 border-t-zinc-100 bg-zinc-100 p-2 dark:border-x-zinc-900 dark:border-t-zinc-900 dark:bg-zinc-900" />
        <div className="flex h-10 w-full animate-pulse items-center justify-between bg-zinc-700 p-2" />
        <div className="flex h-10 w-full animate-pulse items-center justify-between bg-zinc-700 p-2" />
        <div className="flex h-10 w-full animate-pulse items-center justify-between bg-zinc-700 p-2" />
      </div>
    </div>
  ),
});

export default async function ProductsPage({
  params: { storeId },
}: ProductsPageProps) {
  const course = await getUnitsAction({ courseId: Number(storeId) });
  return (
    <div className="space-y-2.5">
      <section className="">
        <Heading />
        <div className="grid lg:grid-cols-3 items-start gap-6">
          <div className="lg:col-span-2 space-y-2">
            {course.items?.length ? (
              <CourseOutline units={course.items} />
            ) : null}

            <Dialog>
              <DialogTrigger className={buttonVariants({ variant: "default" })}>
                Crear modulo
              </DialogTrigger>
              <DialogContent className="sm:max-w-[480px]">
                <AddModuleForm courseId={Number(storeId)} />
              </DialogContent>
            </Dialog>
          </div>
          <div className="space-y-6">
            <article className="overflow-hidden rounded-lg border bg-card border-border">
              <div className="p-4">
                <h3 className="font-semibold">
                  Super course React.js, Python y Postgres
                </h3>
                <p className="my-2 font-light">La descripción del curso</p>
                <div className="my-1 flex items-center space-x-2 text-sm">
                  {/* <Icon icon="ph-users-duotone" className="text-xl" /> */}
                  <span>0 Miembros</span>
                </div>
                <a
                  // className="bg-spring-green-400 block w-full rounded-lg py-2 text-center font-semibold text-white"
                  className={buttonVariants({
                    className: "w-full",
                  })}
                  href="#"
                >
                  Ver curso
                </a>
              </div>
            </article>
            <article className="rounded-lg border bg-card p-3 border-border">
              <h3 className="font-semibold">Price</h3>
              <div>
                <div className="relative mb-2 mt-6 rounded-md shadow-sm">
                  <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                    <span className="text-zinc-500 sm:text-sm">$</span>
                  </div>
                  <Input
                    type="text"
                    name="price"
                    id="price"
                    className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-zinc-950 ring-1 ring-inset ring-zinc-300 placeholder:text-zinc-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder="0.00"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center">
                    <label htmlFor="currency" className="sr-only">
                      Curr
                    </label>
                    <Select
                      name="currency"
                      //
                    >
                      <SelectTrigger className="w-[120px]">
                        <SelectValue placeholder="Currency" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="CAD">CAD</SelectItem>
                        <SelectItem value="EUR">EUR</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
              <Button type="button" className="w-full">
                Crear descuento
              </Button>
              <span className="mt-2 block text-sm font-light">
                Puedes cambiarlo cuando quieras
              </span>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
