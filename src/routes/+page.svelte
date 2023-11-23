<script lang="ts">
  import {derived, writable, type Writable} from "svelte/store";
  import {processSvg, type SVGData} from "$lib/svgManipulator";
  import {themeColour, title} from "$lib/const";
  import Download from "$lib/Download/Download.svelte";
  import {onMount} from "svelte";
  import SvgPreview from "$lib/SVGPreview/SVGPreview.svelte";

  let fillColour: Writable<string> | undefined = writable(themeColour);

  let rawSvg = writable<string>();
  onMount(() => {
    fetch("/favicon/favicon.svg")
      .then(async (response) => {
        return response.text();
      })
      .then((contents) => {
        rawSvg.set(contents);
      })
      .catch((error) => {
        throw error;
      });
  });

  let svg = derived(
    [rawSvg, fillColour],
    ([$rawSvg, $fillColour], set: (value: SVGData) => void) => {
      set(processSvg($rawSvg, {fillColour: $fillColour}));
    }
  );
</script>

<div class="container mx-auto space-y-8 p-8">
  <h1 class="h1">{title}</h1>
  <div class="w-80">
    <SvgPreview svg="{$svg}"></SvgPreview>
  </div>
  {#if $fillColour !== ""}
    <!-- This will throw an error regarding the format of the hex colour on page load. This has no real effect as it cannot occur. -->
    <input type="color" name="fill" bind:value="{$fillColour}" />
  {/if}
  <Download svg="{$svg}"></Download>
</div>
