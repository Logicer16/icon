<script lang="ts">
  import "../app.postcss";
  import {description, themeColour, title} from "$lib/const";
  import {pwaInfo} from "virtual:pwa-info";

  $: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : "";
</script>

<svelte:head>
  {@html webManifest}
  <title>{title}</title>
  <meta name="description" content="{description}" />
  <meta name="theme-color" content="{themeColour}" />
</svelte:head>

<main>
  <slot />
</main>

<!-- {#await import("$lib/ReloadPrompt/ReloadPrompt.svelte") then { default: ReloadPrompt }}
  <ReloadPrompt></ReloadPrompt>
{/await} -->
