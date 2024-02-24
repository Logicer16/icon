<script lang="ts">
  import type {SVGData} from "$lib/svgManipulator/svgManipulator";

  export let svg: SVGData | undefined;
</script>

{#if svg !== undefined}
  <!-- Generate programmatically and should be sanitised. -->
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html svg}
{/if}
