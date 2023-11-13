<script lang="ts">
  import FileSaver from "file-saver";
  import {ProgressRadial} from "@skeletonlabs/skeleton";
  import {vips} from "$lib/vips/vips";

  const value = undefined;

  async function run(): Promise<void> {
    if (vips === undefined) return;
    const svg = await (await fetch("/favicon/favicon.svg")).arrayBuffer();
    console.log(svg);
    const png = vips.Image.svgloadBuffer(svg).writeToBuffer(".png");
    const blob = new Blob([png]);
    FileSaver(blob, "icon.png");
  }
</script>

<div class="container mx-auto p-8 space-y-8">
  <h1 class="h1">Image Conversion Test</h1>
  <ProgressRadial
    {value}
    stroke="{100}"
    meter="stroke-primary-500"
    track="stroke-primary-500/30"
    strokeLinecap="{'round'}">{value}%</ProgressRadial>

  <button type="button" class="btn variant-soft">ico</button>
  <button type="button" class="btn variant-soft" on:click="{run}">png</button>
  <button type="button" class="btn variant-soft">jpeg</button>
  <button type="button" class="btn variant-soft">svg</button>
  <button type="button" class="btn variant-soft">icns</button>

  <!-- bad -->
  <!-- <RangeSlider
    name="range-slider"
    bind:slid
    max="{25}"
    step="{1}"
    accent="accent-surface-900 dark:accent-surface-500"
    ticked>Label</RangeSlider> -->
</div>
