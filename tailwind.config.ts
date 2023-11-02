import {Config} from "tailwindcss";
import {join} from "path";
import {skeleton} from "@skeletonlabs/tw-plugin";

const config: Config = {
  content: [
    "./src/**/*.{html,js,svelte,ts}",
    join(
      require.resolve("@skeletonlabs/skeleton"),
      "../**/*.{html,js,svelte,ts}"
    )
  ],
  darkMode: "class",
  plugins: [
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
