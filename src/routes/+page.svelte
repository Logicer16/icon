<script lang="ts">
  import {derived, writable, type Writable} from "svelte/store";
  import {processSvg, type SVGData} from "$lib/svgManipulator/svgManipulator";
  import {themeColour, title} from "$lib/const";
  import {contrastCSSColor} from "$lib/contrast";
  import Download from "$lib/Download/Download.svelte";
  import SvgPreview from "$lib/SVGPreview/SVGPreview.svelte";

  let fillColour: Writable<string> | undefined = writable(themeColour);

  let svg = derived(
    [fillColour],
    ([$fillColour], set: (value: SVGData) => void) => {
      set(processSvg({fillColour: $fillColour}));
    }
  );

  let textColor = contrastCSSColor(fillColour);
</script>

<div class="container mx-auto space-y-8 p-8">
  <h1 class="h1">{title}</h1>
  <div class="w-80">
    <SvgPreview svg="{$svg}"></SvgPreview>
  </div>
  {#if $fillColour !== ""}
    <div class="inline-flex space-x-2 place-self-center">
      <div
        class=" rounded-full px-5 py-[9px]"
        style="background-color: {$fillColour}; color: {$textColor}">
        Fill
      </div>
      <!-- This will throw an error regarding the format of the hex colour on page load. This has no real effect as it cannot occur. -->
      <!-- border-solid is applied in app.postcss -->
      <input
        class="input border-4 border-solid"
        type="color"
        name="fill"
        id="color-picker-fill"
        style="border-color: {$textColor}; transition: border-color 0s;"
        bind:value="{$fillColour}" />
    </div>
  {/if}
  <Download svg="{$svg}"></Download>
</div>
