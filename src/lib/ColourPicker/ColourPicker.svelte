<script lang="ts">
  import {contrastBWColorCSS} from "$lib/contrast";

  export let colour = "#000000";
  export let id = "";
  export let displayName: string = id;

  let textColor = contrastBWColorCSS(colour);
</script>

<div class="flex space-x-2 place-self-center">
  <div
    class=" rounded-full px-5 py-[9px]"
    style="background-color: {colour}; color: {$textColor}">
    {displayName}
  </div>
  <!-- This will throw an error regarding the format of the hex colour on page load. This has no real effect as it cannot occur. -->
  <input
    class="input border-4"
    type="color"
    name="{id}"
    id="color-picker-{id}"
    style="border-color: {$textColor}; transition: border-color 0s;"
    bind:value="{colour}"
    style:border-style="solid" />
</div>
