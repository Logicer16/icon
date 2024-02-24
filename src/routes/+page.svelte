<script lang="ts">
  import ColourPicker from "$lib/ColourPicker/ColourPicker.svelte";
  import {themeColour, title} from "$lib/const";
  import Download from "$lib/Download/Download.svelte";
  import {processSvg} from "$lib/svgManipulator/svgManipulator";
  import SvgPreview from "$lib/SVGPreview/SVGPreview.svelte";

  let fillColour: string = themeColour;
  let backgroundColour: string = themeColour;

  $: svg = processSvg({fillColour});
</script>

<div class="container mx-auto space-y-8 p-8">
  <h1 class="h1">{title}</h1>
  <div class="w-80">
    <SvgPreview {svg}></SvgPreview>
  </div>
  <ColourPicker id="fill" displayName="Fill" bind:colour="{fillColour}"
  ></ColourPicker>
  <ColourPicker
    id="background"
    displayName="Background"
    bind:colour="{backgroundColour}"></ColourPicker>
  <Download {svg}></Download>
</div>
