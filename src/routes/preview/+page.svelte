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

  /**
   * Parse the url hash into parameters for the svg.
   * @param hash The contents of the url hash.
   * @returns The parameters for the svg.
   */
  function parseHash(hash: string): SVGProcessParameters {
    if (!hash.startsWith("#")) return {};
    const parameters: unknown = JSON.parse(decodeURIComponent(hash.slice(1)));
    if (typeof parameters !== "object" || parameters === null) return {};
    return parameters;
  }

  /**
   * Gets a store containing svg parameters which change according to the url hash.
   * @returns A svelte store containing the parameters.
   */
  function getSVGParameterStore(): Readable<SVGProcessParameters> {
    if (!browser) return readable({});
    return readable(parseHash(window.location.hash), (set) => {
      window.addEventListener("hashchange", () => {
        set(parseHash(window.location.hash));
      });
      set(parseHash(window.location.hash));
    });
  }

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const SVGParameters = getSVGParameterStore();

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
