/**
 * @file The tailwind configuration.
 */
import {join} from "node:path";
import {skeleton} from "@skeletonlabs/tw-plugin";
import forms from "@tailwindcss/forms";
import type {Config} from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    join(
      // This file is being interpreted as a module.
      // eslint-disable-next-line unicorn/prefer-module
      require.resolve("@skeletonlabs/skeleton"),
      "../**/*.{html,js,svelte,ts}"
    )
  ],
  darkMode: "class",
  plugins: [
    forms,
    // Append the Skeleton plugin after other plugins
    skeleton({
      themes: {
        preset: ["skeleton"]
      }
    })
  ],
  theme: {
    extend: {}
  }
};

export default config;
