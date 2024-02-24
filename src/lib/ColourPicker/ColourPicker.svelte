<script lang="ts">
  import {contrastBWColorCSS} from "$lib/contrast";

  export let colour = "#000000";
  export let id = "";
  export let displayName: string = id;

  $: textColor = contrastBWColorCSS(colour);
</script>

<div class="flex space-x-2 place-self-center">
  <div
    style:background-color="{colour}"
    style:color="{$textColor}"
    class=" rounded-full px-5 py-[9px]">
    {displayName}
  </div>
  <!-- This will throw an error regarding the format of the hex colour on page load. This has no real effect as it cannot occur. -->
  <input
    id="color-picker-{id}"
    name="{id}"
    style:border-color="{$textColor}"
    style:transition="border-color 0s"
    style:border-style="solid"
    class="input border-4"
    type="color"
    bind:value="{colour}" />
</div>
