<script lang="ts">
  /* eslint-disable unicorn/filename-case */
  import type {SVGData} from "$lib/svgManipulator/svgManipulator";

  export let svg: SVGData | undefined;
</script>

{#if svg !== undefined}
  {@html svg}
{/if}
