import {defineConfig} from "vite";
import {dirname} from "path";
import {nodePolyfills} from "vite-plugin-node-polyfills";
import {purgeCss} from "vite-plugin-tailwind-purgecss";
import {sveltekit} from "@sveltejs/kit/vite";
import {SvelteKitPWA} from "@vite-pwa/sveltekit";
import topLevelAwait from "vite-plugin-top-level-await";
import {viteStaticCopy} from "vite-plugin-static-copy";
import {webmanifest} from "./src/lib/webmanifest.js";

const extensions = [
  "js",
  "css",
  "html",
  "ico",
  "png",
  "svg",
  "wasm",
  "webmanifest",
  "json"
].join(",");

const vipsPath = dirname(new URL(import.meta.resolve("wasm-vips")).pathname);

export default defineConfig({
  // For service worker:
  define: {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    "process.env.NODE_ENV":
      process.env.NODE_ENV === "production" ? '"production"' : '"development"'
  },
  plugins: [
    sveltekit(),
    SvelteKitPWA({
      devOptions: {
        enabled: true,
        type: "module"
      },
      filename: "service-worker.ts",
      injectManifest: {
        globPatterns: [`client/**/*.{${extensions}}`],
        maximumFileSizeToCacheInBytes: 8 * Math.pow(1000, 2)
      },
      manifest: webmanifest,
      minify: true,
      srcDir: "src",
      strategies: "injectManifest"
    }),
    topLevelAwait(),
    nodePolyfills(),
    viteStaticCopy({
      targets: [
        {
          dest: "vips",
          src: `${vipsPath}/vips{{,-es6}{,.worker}.js,*.wasm}`
        }
      ]
    }),
    purgeCss()
  ]
});
