"use client";

import * as React from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { BarChart, Filter, MousePointerClick, Users } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/islands/primitives/accordion";
import { buttonVariants } from "~/islands/primitives/button";

const featureList = [
  {
    key: "analytics",
    title: "Analytics that matter",
    icon: <BarChart className="h-5 w-5 text-stone-400" />,
    description:
      "Get insights into your users, their devices, and their locations.",
    cta: (
      <Link
        href="https://demo.loglib.io"
        target="_blank"
        className={buttonVariants()}
      >
        View demo
      </Link>
    ),
    demo: "https://www.loglib.io/assets/features/analytics.mp4",
    thumbnail: "https://www.loglib.io//assets/features/analytics.png",
  },
  {
    key: "filters",
    title: "Advanced Filters",
    icon: <Filter className="h-5 w-5 text-stone-400" />,
    description:
      "Combine multiple filters to create advanced filters for your data.",
    cta: (
      <Link
        href="/dashboard"
        target="_blank"
        rel="noreferrer"
        className={buttonVariants()}
      >
        Add Your Website
      </Link>
    ),
    demo: "https://www.loglib.io/assets/features/filters.mp4",
  },
  {
    key: "events",
    title: "Custom Events",
    icon: <MousePointerClick className="h-5 w-5 text-stone-400" />,
    description:
      "Track custom events on your website and filter by them in your dashboard",
    cta: null,
    demo: "https://www.loglib.io/assets/features/events.mp4",
  },
  {
    key: "team",
    title: "Collaborate with your team",
    icon: <Users className="h-5 w-5 text-stone-400" />,
    description:
      "With Loglib, you can invite your teammates to collaborate on your websites.",
    cta: (
      <a
        href="https://loglib.io/dashboard"
        target="_blank"
        rel="noreferrer"
        className={buttonVariants()}
      >
        Invite your teammates
      </a>
    ),
    demo: "https://www.loglib.io/assets/features/teams.mp4",
  },
];

const Features = () => {
  const [activeFeature, setActiveFeature] = React.useState(0);
  return (
    <div id="features">
      {featureList.map(({ key, demo }) => (
        // preload videos
        <link key={key} rel="preload" as="video" href={demo} />
      ))}
      <div className="pb-10">
        <div className="my-10  w-full overflow-hidden text-muted-foreground rounded-xl border relative bg-card shadow-[inset_10px_-50px_94px_0_rgb(112, 128, 144, 0.2)] backdrop-blur h-max">
          <div className="grid grid-cols-1 gap-10 p-5 lg:grid-cols-3">
            <Accordion
              type="single"
              defaultValue="analytics"
              onValueChange={(e) => {
                setActiveFeature(featureList.findIndex(({ key }) => key === e));
              }}
            >
              {featureList.map(({ key, title, icon, description, cta }) => (
                <AccordionItem key={key} value={key}>
                  <AccordionTrigger>
                    <div className="flex items-center space-x-3 p-3">
                      {icon}
                      <h3 className="text-base font-semibold">{title}</h3>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="p-3">
                      <p className="mb-4 text-sm">{description}</p>
                      {cta}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
            <div className="lg:col-span-2">
              <AnimatePresence mode="wait">
                {featureList.map((feature, index) => {
                  if (index === activeFeature) {
                    return (
                      <motion.div
                        key={feature.title}
                        initial={{
                          y: 10,
                          opacity: 0,
                        }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{
                          y: -10,
                          opacity: 0,
                        }}
                        transition={{
                          duration: 0.15,
                          stiffness: 300,
                          damping: 30,
                        }}
                        className="relative min-h-[200px] w-full overflow-hidden flex h-full items-center justify-center px-6 rounded-md lg:w-[700px]"
                      >
                        {/* <div className=" absolute top-0 w-full h-full bg-gradient-to-tr from-stone-900 to-stone-900  blur-2xl scale-125 "></div> */}
                        <video
                          autoPlay
                          muted
                          loop
                          width={700}
                          height={400}
                          className=" rounded-md"
                          poster={feature.thumbnail}
                        >
                          <source
                            src={feature.demo}
                            type="video/mp4"
                            className=" rounded-md"
                          />
                          Your browser does not support the video tag.
                        </video>
                      </motion.div>
                    );
                  }
                })}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Features;
