/**
 * @file Manage the vips instance.
 */

import type VipsType from "wasm-vips";
import {assets} from "$app/paths";

// eslint-disable-next-line @typescript-eslint/naming-convention
declare const Vips: typeof VipsType;

export let vips: typeof Vips | undefined;
if (!import.meta.env.SSR && window.crossOriginIsolated) {
  // This must be async and cannot be awaited as it would otherwise block page load.
  import(`${assets}/vips/vips-es6.js`)
    .then(async (module: {default: typeof import("wasm-vips")}) => {
      return module.default({
        dynamicLibraries: ["vips-heif.wasm", "vips-jxl.wasm", "vips-resvg.wasm"]
      });
    })
    .then((newVips) => {
      vips = newVips;
    })
    // eslint-disable-next-line unicorn/prefer-top-level-await
    .catch((error: unknown) => {
      throw error;
    });
}

export type {default as Vips} from "wasm-vips";
