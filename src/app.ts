/**
 * To reduce the number of config files, we aim to combine everything into a single file.
 * Materials about @satisfies: https://youtu.be/49gHWuepxxE, https://youtu.be/G1RtAmI0-vc
 */

import { MainMenuItem, type FooterItem } from "~/types";

import { ContentSection, HeroHeader } from "~/server/config/appts";
import { networks } from "~/server/config/socials";

export const appts = {
  name: "Garden",
  social: networks({
    youtube: "@bleverse_com",
    discord: "Pb8uKbwpsJ",
    facebook: "groups/bleverse",
    twitter: "blefnk",
    github: "blefnk",
  }),
  // currently not recommended to use debug
  debug: false,
};

export default appts;

export type articles = {
  type?: "blog_news" | "blog_only" | "news_only" | undefined;
  articles_provider?: "default" | "contentlayer" | undefined;
};

export type SiteConfig = typeof siteConfig;

const links = {
  twitter: "https://x.com/blefnk",
  github: "https://github.com/blefnk/garden",
  githubAccount: "https://github.com/blefnk",
  discord: "https://discord.gg/Pb8uKbwpsJ",
  facebook: "https://facebook.com/groups/bleverse",
};

export const contactConfig = {
  email: "blefnk@gmail.com",
};

export const REPOSITORY_OWNER = "blefnk";
export const REPOSITORY_NAME = "garden";
export const REPOSITORY_URL = `https://github.com/${REPOSITORY_OWNER}/${REPOSITORY_NAME}`;
export const baseUrl = "https://garden.bleverse.com";

export const BASE_URL =
  process.env.NODE_ENV === "production" ? baseUrl : "http://localhost:3000";
export const BRAND_NAME = "garden";
export const BRAND_DESCRIPTION =
  "Next.js 13 free store and dashboard template. It helps you build great eCommerce and SaaS apps faster than ever. Get it now!";

export const OWNER_ROLE = "owner";
export const ADMIN_ROLE = "admin";
export const MEMBER_ROLE = "member";

export const TRIAL_LENGTH_IN_DAYS = 7;
export const ROLES = [OWNER_ROLE, ADMIN_ROLE, MEMBER_ROLE] as const;

export const settings = {
  internationalizationEnabled: true,
  themeToggleEnabled: true,
};

export const siteConfig = {
  name: "Garden",
  shortName: "Garden",
  author: "Robert",
  description:
    "NextJS 13 free starter: store, landing, dashboard. It helps you build great eCommerce and SaaS apps faster than ever. Get it!",
  company: {
    name: "make",
    link: "https://make.com.pe",
    email: "robert@make.com.pe",
    twitter: "@adastra_36",
  },
  handles: {
    twitter: "@adastra_36",
  },
  keywords: [
    "SaaS",
    "IndieHacker",
    "Nextjs",
    "Lemon Squeezy",
    "Open Source",
    "PostgreSQL",
    "Tailwind Css",
  ],
  url: {
    base: baseUrl,
    author: REPOSITORY_OWNER,
  },
  ogImage: `${baseUrl}/og-image.png`,
  mainNav: [
    {
      title: "Lobby",
      items: [
        {
          title: "Products",
          href: "/products",
          description: "All the products we have to offer.",
          items: [],
        },
        {
          title: "Build a Look",
          href: "/custom/clothing",
          description: "Build your own custom clothes.",
          items: [],
        },
        {
          title: "Blog",
          href: "/blog",
          description: "Read our latest blog posts.",
          items: [],
        },
      ],
    },
    {
      title: "Courses",
      href: "/courses",
    },
  ] satisfies MainMenuItem[],
  links,
  footerNav: [
    {
      title: "Bleverse",
      items: [
        {
          title: "Community",
          href: "https://bleverse.com",
          external: true,
        },
        {
          title: "MF Piano",
          href: "https://mfpiano.org",
          external: true,
        },
        {
          title: "Peresfer",
          href: "https://peresfer.com",
          external: true,
        },
        {
          title: "garden",
          href: "https://garden.bleverse.com",
          external: true,
        },
      ],
    },
    {
      title: "Help",
      items: [
        {
          title: "Contact",
          href: "/contact",
          external: false,
        },
        {
          title: "Privacy",
          href: "/privacy",
          external: false,
        },
        {
          title: "Terms",
          href: "/terms",
          external: false,
        },
        {
          title: "About",
          href: "/about",
          external: false,
        },
      ],
    },
    {
      title: "Social",
      items: [
        {
          title: "Facebook",
          href: links.facebook,
          external: true,
        },
        {
          title: "Discord",
          href: links.discord,
          external: true,
        },
        {
          title: "Twitter",
          href: links.twitter,
          external: true,
        },
        {
          title: "Github",
          href: links.githubAccount,
          external: true,
        },
      ],
    },
    {
      title: "Github",
      items: [
        {
          title: "Nomaders",
          href: "https://github.com/blefnk/nomaders",
          external: true,
        },
        {
          title: "Reliverse",
          href: "https://github.com/blefnk/reliverse",
          external: true,
        },
        {
          title: "garden",
          href: "https://github.com/blefnk/garden",
          external: true,
        },
        {
          title: "Utilities",
          href: "https://github.com/blefnk/utils",
          external: true,
        },
      ],
    },
  ] satisfies FooterItem[],
};

export const heroHeader: HeroHeader = {
  header1: `Next.js 13 Store & Dashboard Template`,
  header2: `Build Great eCommerce and SaaS Faster`,
  subheader: `shadcn/ui, Link, App Router, TypeScript, T3, Stripe, NextAuth.js, Tailwind,
  Drizzle, Zod, RSC, SWC, tRPC, NextAuth, Server Actions, Lucide Icons,
  etc.`,
};

export const featureCards: ContentSection = {
  header: `Powered by`,
  subheader: `What Makes garden Possible`,
  content: [
    {
      text: `Next.js`,
      subtext: `The React Framework`,
    },
    {
      text: `shadcn/ui`,
      subtext: `Beautifully Designed Components`,
    },
    {
      text: `Vercel`,
      subtext: `Develop. Preview. Ship.`,
    },
  ],
};

export const features: ContentSection = {
  header: `Features`,
  subheader: `Why You Need to Download garden`,
  content: [
    {
      text: `SEO Optimized`,
      subtext: `Improved website visibility on search engines`,
    },
    {
      text: `Highly Performant`,
      subtext: `Fast loading times and smooth performance`,
    },
    {
      text: `Easy Customization`,
      subtext: `Change your content and layout with little effort`,
    },
  ],
};
