"use server";

import { eq } from "drizzle-orm";

import { db } from "~/data/db/client";
import { chapters } from "~/data/db/schema";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/islands/primitives/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "~/islands/primitives/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "~/islands/primitives/tabs";
import VideoPlayer from "~/islands/video-player";

export async function Arc({ chapterId }: { chapterId: string }) {
  const currentChapter = await db.query.chapters.findFirst({
    where: eq(chapters.id, chapterId),
  });

  if (!currentChapter) return null;
  return (
    <div className="lg:col-span-5">
      <VideoPlayer
        provider={"youtube"}
        videoId={"https://youtu.be/FKGpf1Bb6mo?si=3kp4pPries1rlqaQ"}
      />
      <div className="px-4 py-3">
        <div className="my-2 flex flex-col justify-between md:flex-row md:items-center">
          <div className="my-2 flex items-center justify-between space-x-2 md:justify-normal">
            <div className="flex space-x-1 text-sm font-semibold text-zinc-600">
              <span>Chapters</span>
              <div>
                <span>3</span>
                <span>/</span>
                <span>10</span>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-2">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="outline">Temario</TabsTrigger>
              <TabsTrigger value="resources">Resources</TabsTrigger>
              <TabsTrigger value="comments">Comments</TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <h3 className="text-xl font-semibold md:text-2xl">
                    Description
                  </h3>
                  <p className="text-sm">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Optio, minus quae praesentium deleniti similique tenetur et
                    magnam. Obcaecati, ipsam rerum nobis excepturi sapiente
                    quibusdam expedita nostrum veritatis cum repellat suscipit
                    tempore labore officia architecto voluptates omnis ab
                    perferendis assumenda repellendus, voluptatibus dignissimos
                    distinctio dolor asperiores! Adipisci expedita inventore
                    perspiciatis enim.
                  </p>
                </div>
                <div className="md:col-span-1">
                  <Card>
                    <CardHeader className="text-lg font-bold">
                      About instructor
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center space-x-2">
                        <img
                          src="https://ideogram.ai/api/images/direct/GrOwbTcZRbWJaZ0p5kG4NA"
                          alt=""
                          className="h-16 w-16 rounded-full"
                        />
                        <div>
                          <h4 className="font-bold">Ghost Ed</h4>
                          <p className="text-sm font-semibold text-zinc-500">
                            COO at home
                          </p>
                        </div>
                      </div>
                      <CardDescription>
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Tenetur adipisci rem non enim dolor illo
                        exercitationem
                      </CardDescription>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="outline" className="-mx-3">
              <Accordion type="single">
                <AccordionItem className="px-3" value="module-2">
                  <AccordionTrigger>Cripto experto</AccordionTrigger>
                  <AccordionContent className="-mx-3">
                    <div className="[&>button]:border-b [&>button]:border-b-border [&>button:last-child]:border-b-0">
                      <button className="text-sm font-medium hover:bg-card/80 px-3 py-2 flex justify-between items-center w-full">
                        <div className="flex gap-x-1 items-center">
                          <span>Instalaciones</span>
                        </div>
                        <span className="text-xs">3:12 min</span>
                      </button>
                      <button className="text-sm font-medium hover:bg-card/80 px-3 py-2 flex justify-between items-center w-full">
                        <div className="flex gap-x-1 items-center">
                          <span>Instalaciones</span>
                        </div>
                        <span className="text-xs">3:12 min</span>
                      </button>
                      <button className="text-sm font-medium hover:bg-card/80 px-3 py-2 flex justify-between items-center w-full">
                        <div className="flex gap-x-1 items-center">
                          <span>Instalaciones</span>
                        </div>
                        <span className="text-xs">3:12 min</span>
                      </button>
                      <button className="text-sm font-medium hover:bg-card/80 px-3 py-2 flex justify-between items-center w-full">
                        <div className="flex gap-x-1 items-center">
                          <span>Instalaciones</span>
                        </div>
                        <span className="text-xs">3:12 min</span>
                      </button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </TabsContent>
            <TabsContent value="resources">
              <div className="flex items-center justify-between">
                <span>Descarga</span>
              </div>
            </TabsContent>
            <TabsContent value="comments">
              <div>
                <h3 className="my-3 text-xl font-bold">Discussion</h3>
                <div className="divide-y divide-zinc-200">
                  <div>
                    <article className="py-2">
                      <div className="flex items-center space-x-2">
                        <img
                          src="https://ideogram.ai/api/images/direct/eRAyjyoRSlKi0iHoc4Sebw"
                          alt=""
                          className="h-10 w-10 rounded-full"
                        />
                        <span className="font-semibold text-card-foreground">
                          Robin Sherbasky
                        </span>
                      </div>
                      <p className="my-2 text-sm font-medium text-muted-foreground">
                        Lorem ipsum dolor sit, amet consectetur adipisicing
                        elit. Quas alias modi quidem quis architecto,
                        perspiciatis adipisci. Natus laborum tempore ullam iusto
                        eaque temporibus deserunt quas, saepe cum quae eveniet
                        exercitationem.
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <button
                          type="button"
                          className="flex items-center space-x-1"
                        >
                          <span>Reply</span>
                        </button>
                        <span>&bull;</span>
                        <p>Show replies</p>
                      </div>
                    </article>

                    <article className="ml-6 border-l border-l-border py-2 pl-4">
                      <div className="flex items-center space-x-2">
                        <img
                          src="https://ideogram.ai/api/images/direct/eRAyjyoRSlKi0iHoc4Sebw"
                          alt=""
                          className="h-10 w-10 rounded-full"
                        />
                        <span className="font-semibold text-card-foreground">
                          Robin Sherbasky
                        </span>
                      </div>
                      <p className="my-2 text-sm font-medium text-muted-foreground">
                        Lorem, ipsum dolor sit amet consectetur adipisicing
                        elit. Eaque, impedit!
                      </p>
                      <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                        <button
                          type="button"
                          className="flex items-center space-x-1"
                        >
                          {/* <Icon
                            icon="ph:share-fat-duotone"
                            className="text-lg"
                          /> */}
                          <span>Reply</span>
                        </button>
                      </div>
                    </article>
                  </div>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
