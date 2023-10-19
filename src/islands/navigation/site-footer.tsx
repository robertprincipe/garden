"use client";

import { Icon } from "@iconify/react";

import { Shell } from "~/islands/wrappers/shell-variants";

export function SiteFooter() {
  return (
    <footer className="mx-auto border-t py-6 shadow border-t-border">
      <Shell className="flex items-stretch flex-col-reverse gap-y-5 md:flex-row md:justify-between">
        <div className="flex flex-col justify-between md:max-w-sm">
          <div className="flex h-full items-center justify-between md:flex-col md:items-start">
            <h2 className="flex items-center space-x-2 text-2xl font-bold md:text-3xl">
              <Icon icon="ph:potted-plant-duotone" className="text-3xl" />
              <span className="text-lg font-bold">Garden</span>
            </h2>
            <div className="flex items-center space-x-2 md:mb-8">
              <Icon icon="ph:facebook-logo-duotone" className="text-2xl" />
              <Icon icon="ph:twitter-logo-duotone" className="text-2xl" />
              <Icon icon="ph:instagram-logo-duotone" className="text-2xl" />
            </div>
          </div>
          <div className="flex flex-col gap-8">
            <div className="text-muted-foreground">
              <p className="mb-2 text-xs font-light">
                © 2023 Attentive, a product of Attentive Mobile, Inc.
              </p>
              <p className="text-xs font-light">
                221 River Street, Suite 9047, Hoboken, NJ, 07030
                <a href="mailto:info@attentive.com">info@attentive.com</a>
              </p>
            </div>
            <ul className="flex flex-wrap gap-x-4 gap-y-1 text-sm">
              <li>Sitemap</li>
              <li>Security</li>
              <li>Privacy Policy</li>
              <li>Cookie Notice</li>
              <li>California Notice</li>
              <li>Terms of Use</li>
              <li>Content Policy</li>
            </ul>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:flex">
          <div className="space-y-4">
            <div className="space-y-1.5">
              <h3 className="font-medium">Products</h3>
              <ul className="text-sm gap-y-1.5 grid">
                <li className="text-muted-foreground transition-colors hover:text-foreground">
                  Why Attentive
                </li>
              </ul>
            </div>
            <div className="space-y-1.5">
              <h3 className="font-medium">Email</h3>
              <ul className="text-sm gap-y-1.5 grid">
                <li className="text-muted-foreground transition-colors hover:text-foreground">
                  Email
                </li>
              </ul>
            </div>
            <div className="space-y-1.5">
              <h3 className="font-medium">List Management</h3>
              <ul className="text-sm gap-y-1.5 grid">
                <li className="text-muted-foreground transition-colors hover:text-foreground">
                  Growth
                </li>
                <li className="text-muted-foreground transition-colors hover:text-foreground">
                  Audience Manager
                </li>
                <li className="text-muted-foreground transition-colors hover:text-foreground">
                  Analytics
                </li>
                <li className="text-muted-foreground transition-colors hover:text-foreground">
                  Attentive AI™
                </li>
                <li className="text-muted-foreground transition-colors hover:text-foreground">
                  Marketplace
                </li>
                <li className="text-muted-foreground transition-colors hover:text-foreground">
                  Compliance
                </li>
                <li className="text-muted-foreground transition-colors hover:text-foreground">
                  Client Strategy
                </li>
              </ul>
            </div>
          </div>
          <div>
            <div className="space-y-1.5">
              <h3 className="font-medium">Resources</h3>
              <ul className="text-sm gap-y-1.5 grid">
                <li className="text-muted-foreground transition-colors hover:text-foreground">
                  Blog
                </li>
                <li className="text-muted-foreground transition-colors hover:text-foreground">
                  Texts We Love
                </li>
                <li className="text-muted-foreground transition-colors hover:text-foreground">
                  Guides
                </li>
                <li className="text-muted-foreground transition-colors hover:text-foreground">
                  Webinars
                </li>
                <li className="text-muted-foreground transition-colors hover:text-foreground">
                  Case Studies
                </li>
                <li className="text-muted-foreground transition-colors hover:text-foreground">
                  Help Center
                </li>
                <li className="text-muted-foreground transition-colors hover:text-foreground">
                  Revenue Calculator
                </li>
              </ul>
            </div>
          </div>
          <div>
            <div className="space-y-1.5">
              <h3 className="font-medium">Partners</h3>
              <ul className="text-sm gap-y-1.5 grid">
                <li className="text-muted-foreground transition-colors hover:text-foreground">
                  Partner With Attentive
                </li>
                <li className="text-muted-foreground transition-colors hover:text-foreground">
                  Browse Partners
                </li>
              </ul>
            </div>
          </div>
        </div>
      </Shell>
    </footer>
  );
}
