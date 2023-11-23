<script lang="ts">
  import type {SVGData} from "$lib/svgManipulator";

  export let svg: SVGData | undefined;
</script>

{#if svg !== undefined}
  {@html svg}
{/if}
