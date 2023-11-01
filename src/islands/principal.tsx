import { Icon } from "~/components/icon";

import { Chapter } from "~/data/validations/course";
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

import { Interactions } from "./interactions";

export function Principal({
  chapter,
  courseId,
}: {
  chapter: Chapter;
  courseId: string;
}) {
  return (
    <div className="lg:col-span-5">
      <VideoPlayer
        provider={chapter.video!.provider}
        videoId={chapter.video!.id}
      />
      <div className="px-4 py-3">
        <div className="my-2 flex flex-col justify-between md:flex-row md:items-center">
          <div>
            <h2 className="text-xl font-semibold xl:text-2xl">
              {chapter.title}
            </h2>
            <p className="text-blue-marguerite-900">{chapter.summary}</p>
          </div>
          <div className="my-2 flex items-center justify-between space-x-2 md:justify-normal">
            <div className="flex space-x-1 text-sm font-semibold text-zinc-600">
              <span>Chapters</span>
              <div>
                <span>3</span>
                <span>/</span>
                <span>10</span>
              </div>
            </div>
            <div>
              <button
                type="button"
                className="rounded-l-full border border-blue-marguerite-500 py-1 pl-2 pr-1 text-blue-marguerite-500"
              >
                <Icon icon="ph:caret-left-bold" className="text-2xl" />
              </button>
              <button
                type="button"
                className="rounded-r-full border border-blue-marguerite-500 bg-blue-marguerite-500 py-1 pl-1 pr-2"
              >
                <Icon icon="ph:caret-right-bold" className="text-2xl" />
              </button>
            </div>
          </div>
        </div>
        <div className="mt-2">
          <Tabs defaultValue="overview">
            <TabsList>
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger className="lg:hidden block" value="outline">
                Temario
              </TabsTrigger>
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
            <TabsContent value="outline" className="-mx-3 lg:hidden block">
              <Accordion type="single">
                <AccordionItem className="px-3" value="module-2">
                  <AccordionTrigger>Cripto experto</AccordionTrigger>
                  <AccordionContent className="-mx-3">
                    <div className="[&>button]:border-b [&>button]:border-b-border [&>button:last-child]:border-b-0">
                      <button className="text-sm font-medium hover:bg-card/80 px-3 py-2 flex justify-between items-center w-full">
                        <div className="flex gap-x-1 items-center">
                          <Icon
                            icon="ph:play-circle-bold"
                            className="text-2xl"
                          />
                          <span>Instalaciones</span>
                        </div>
                        <span className="text-xs">3:12 min</span>
                      </button>
                      <button className="text-sm font-medium hover:bg-card/80 px-3 py-2 flex justify-between items-center w-full">
                        <div className="flex gap-x-1 items-center">
                          <Icon
                            icon="ph:play-circle-bold"
                            className="text-2xl"
                          />
                          <span>Instalaciones</span>
                        </div>
                        <span className="text-xs">3:12 min</span>
                      </button>
                      <button className="text-sm font-medium hover:bg-card/80 px-3 py-2 flex justify-between items-center w-full">
                        <div className="flex gap-x-1 items-center">
                          <Icon
                            icon="ph:play-circle-bold"
                            className="text-2xl"
                          />
                          <span>Instalaciones</span>
                        </div>
                        <span className="text-xs">3:12 min</span>
                      </button>
                      <button className="text-sm font-medium hover:bg-card/80 px-3 py-2 flex justify-between items-center w-full">
                        <div className="flex gap-x-1 items-center">
                          <Icon
                            icon="ph:play-circle-bold"
                            className="text-2xl"
                          />
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
                <Icon icon="ph:cloud-arrow-down-duotone" className="text-2xl" />
              </div>
            </TabsContent>
            <TabsContent value="comments">
              <h3 className="my-3 text-xl font-bold">Discussion</h3>

              <Interactions chapterId={chapter.id} courseId={courseId} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
