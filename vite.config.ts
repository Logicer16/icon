/**
 * @file The vite configuration.
 */
import {defineConfig, normalizePath} from "vite";
import {dirname} from "path";
import {fileURLToPath} from "node:url";
import {nodePolyfills} from "vite-plugin-node-polyfills";
import process from "process";
import {purgeCss} from "vite-plugin-tailwind-purgecss";
import {serviceWorkerName} from "./src/lib/const.js";
import {sveltekit} from "@sveltejs/kit/vite";
import {SvelteKitPWA} from "@vite-pwa/sveltekit";
import topLevelAwait from "vite-plugin-top-level-await";
import {viteStaticCopy} from "vite-plugin-static-copy";
import {webmanifest} from "./src/lib/ServiceWorker/webmanifest.js";

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

const vipsPath = normalizePath(
  dirname(fileURLToPath(import.meta.resolve("wasm-vips")))
);

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
      filename: `${serviceWorkerName}.ts`,
      injectManifest: {
        globPatterns: [`client/**/*.{${extensions}}`],
        maximumFileSizeToCacheInBytes: 8 * Math.pow(1000, 2)
      },
      injectRegister: null,
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
