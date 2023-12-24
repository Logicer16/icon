<script lang="ts">
  import {themeColour, title} from "$lib/const";
  import ColourPicker from "$lib/ColourPicker/ColourPicker.svelte";
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
  <ColourPicker bind:colour="{fillColour}" id="fill" displayName="Fill"
  ></ColourPicker>
  <ColourPicker
    bind:colour="{backgroundColour}"
    id="background"
    displayName="Background"></ColourPicker>
  <Download {svg}></Download>
</div>
