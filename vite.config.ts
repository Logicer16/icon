import {defineConfig} from "vite";
import {purgeCss} from "vite-plugin-tailwind-purgecss";
import {sveltekit} from "@sveltejs/kit/vite";
import {SvelteKitPWA} from "@vite-pwa/sveltekit";
import {webmanifest} from "./src/lib/webmanifest.js";

export default defineConfig({
  plugins: [
    sveltekit(),
    SvelteKitPWA({
      devOptions: {
        enabled: true,
        type: "module"
      },
      filename: "service-worker.ts",
      manifest: webmanifest,
      minify: true,
      srcDir: "src",
      strategies: "injectManifest"
    }),
    purgeCss()
  ]
});
