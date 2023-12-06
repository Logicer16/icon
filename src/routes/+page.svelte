<script lang="ts">
  import {derived, writable, type Writable} from "svelte/store";
  import {processSvg, type SVGData} from "$lib/svgManipulator/svgManipulator";
  import {themeColour, title} from "$lib/const";
  import ColourPicker from "$lib/ColourPicker/ColourPicker.svelte";
  import Download from "$lib/Download/Download.svelte";
  import SvgPreview from "$lib/SVGPreview/SVGPreview.svelte";

  let fillColour: Writable<string> = writable(themeColour);
  let backgroundColour: Writable<string> | undefined = writable(themeColour);

  let svg = derived(
    [fillColour],
    ([$fillColour], set: (value: SVGData) => void) => {
      set(processSvg({fillColour: $fillColour}));
    }
  );
</script>

<div class="container mx-auto space-y-8 p-8">
  <h1 class="h1">{title}</h1>
  <div class="w-80">
    <SvgPreview svg="{$svg}"></SvgPreview>
  </div>
  <ColourPicker bind:colour="{fillColour}" id="fill" displayName="Fill"
  ></ColourPicker>
  <ColourPicker
    bind:colour="{backgroundColour}"
    id="background"
    displayName="Background"></ColourPicker>
  <Download svg="{$svg}"></Download>
</div>
