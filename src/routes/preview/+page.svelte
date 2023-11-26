<script lang="ts">
  import "./style.postcss";
  import {derived, readable, type Readable} from "svelte/store";
  import {
    processSvg,
    type SVGData,
    type SVGProcessParameters
  } from "$lib/svgManipulator/svgManipulator";
  import {browser} from "$app/environment";
  import SvgPreview from "$lib/SVGPreview/SVGPreview.svelte";

  function parseHash(hash: string): SVGProcessParameters {
    if (!hash.startsWith("#")) return {};
    const parameters: unknown = JSON.parse(decodeURIComponent(hash.slice(1)));
    if (typeof parameters !== "object" || parameters === null) return {};
    return parameters;
  }

  function initSVGParameters(): Readable<SVGProcessParameters> {
    if (!browser) return readable({});
    return readable(parseHash(window.location.hash), (set) => {
      window.addEventListener("hashchange", () => {
        set(parseHash(window.location.hash));
      });
      set(parseHash(window.location.hash));
    });
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const SVGParameters = initSVGParameters();

  let svg = derived(
    [SVGParameters],
    ([$SVGParameters], set: (value: SVGData) => void) => {
      set(processSvg($SVGParameters));
    }
  );
</script>

<div class="w-full">
  {#if browser}
    <SvgPreview svg="{$svg}"></SvgPreview>
  {/if}
</div>
