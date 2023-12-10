/**
 * @file Manage the vips instance.
 */

import {assets} from "$app/paths";
import type VipsType from "wasm-vips";

/**
 * Inject the script to load vips into the webpage if it is cross origin isolated.
 * @param scriptSource The path of the script.
 */
async function injectScript(scriptSource: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = scriptSource;
    script.addEventListener("load", (): void => {
      resolve();
    });
    script.addEventListener("error", reject);

    document.head.append(script);
  });
}

// eslint-disable-next-line @typescript-eslint/naming-convention
declare const Vips: typeof VipsType;

export let vips: typeof Vips | undefined;
if (!import.meta.env.SSR && window.crossOriginIsolated) {
  await injectScript(`${assets}/vips/vips.js`)
    .then(async () => {
      return Vips({
        dynamicLibraries: ["vips-heif.wasm", "vips-jxl.wasm", "vips-resvg.wasm"]
      });
    })
    .then((newVips) => {
      vips = newVips;
    });
}
