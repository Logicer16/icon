import {assets} from "$app/paths";
import type VipsType from "wasm-vips";

async function injectScript(scriptSrc: string): Promise<void> {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.src = scriptSrc;
    script.onload = (): void => {
      resolve();
    };
    script.onerror = reject;

    document.head.appendChild(script);
  });
}

// eslint-disable-next-line @typescript-eslint/naming-convention
declare const Vips: typeof VipsType;

export let vips: typeof Vips | undefined;
if (!import.meta.env.SSR && window.crossOriginIsolated) {
  injectScript(`${assets}/vips/vips.js`)
    .then(async () => {
      return Vips({
        dynamicLibraries: ["vips-heif.wasm", "vips-jxl.wasm", "vips-resvg.wasm"]
      });
    })
    .then((newVips) => {
      vips = newVips;
    })
    .catch((error) => {
      throw error;
    });
}
