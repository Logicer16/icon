/* eslint-disable @typescript-eslint/naming-convention */
import {
  description,
  startupBackgroundColour,
  themeColour,
  title
} from "./const.ts";
import type {SvelteKitPWAOptions} from "@vite-pwa/sveltekit/*";

const startUrl = "/";

export const webmanifest: SvelteKitPWAOptions["manifest"] = {
  background_color: startupBackgroundColour,
  description: description,
  icons: [
    {
      purpose: "any",
      sizes: "16x16",
      src: "favicon/16x16.png",
      type: "image/png"
    },
    {
      purpose: "maskable",
      sizes: "16x16",
      src: "favicon/maskable-favicon/16x16.png",
      type: "image/png"
    },
    {
      purpose: "any",
      sizes: "32x32",
      src: "favicon/32x32.png",
      type: "image/png"
    },
    {
      purpose: "any",
      sizes: "48x48",
      src: "favicon/48x48.png",
      type: "image/png"
    },
    {
      purpose: "maskable",
      sizes: "48x48",
      src: "favicon/maskable-favicon/48x48.png",
      type: "image/png"
    },
    {
      purpose: "any",
      sizes: "64x64",
      src: "favicon/64x64.png",
      type: "image/png"
    },
    {
      purpose: "maskable",
      sizes: "64x64",
      src: "favicon/maskable-favicon/64x64.png",
      type: "image/png"
    },
    {
      purpose: "any",
      sizes: "80x80",
      src: "favicon/80x80.png",
      type: "image/png"
    },
    {
      purpose: "maskable",
      sizes: "80x80",
      src: "favicon/maskable-favicon/80x80.png",
      type: "image/png"
    },
    {
      purpose: "any",
      sizes: "128x128",
      src: "favicon/128x128.png",
      type: "image/png"
    },
    {
      purpose: "maskable",
      sizes: "128x128",
      src: "favicon/maskable-favicon/128x128.png",
      type: "image/png"
    },
    {
      purpose: "any",
      sizes: "192x192",
      src: "favicon/192x192.png",
      type: "image/png"
    },
    {
      purpose: "maskable",
      sizes: "192x192",
      src: "favicon/maskable-favicon/192x192.png",
      type: "image/png"
    },
    {
      purpose: "any",
      sizes: "256x256",
      src: "favicon/256x256.png",
      type: "image/png"
    },
    {
      purpose: "maskable",
      sizes: "256x256",
      src: "favicon/maskable-favicon/256x256.png",
      type: "image/png"
    },
    {
      purpose: "any",
      sizes: "384x384",
      src: "favicon/384x384.png",
      type: "image/png"
    },
    {
      purpose: "maskable",
      sizes: "384x384",
      src: "favicon/maskable-favicon/384x384.png",
      type: "image/png"
    },
    {
      purpose: "any",
      sizes: "512x512",
      src: "favicon/512x512.png",
      type: "image/png"
    },
    {
      purpose: "maskable",
      sizes: "512x512",
      src: "favicon/maskable-favicon/512x512.png",
      type: "image/png"
    },
    {
      purpose: "any",
      sizes: "1024x1024",
      src: "favicon/favicon.png",
      type: "image/png"
    },
    {
      purpose: "maskable",
      sizes: "1024x1024",
      src: "favicon/maskable-favicon/1024x1024.png",
      type: "image/png"
    }
  ],
  id: startUrl,
  name: title,
  short_name: "Logicer Icon",
  start_url: startUrl,
  theme_color: themeColour
};
