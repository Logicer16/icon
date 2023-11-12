<script lang="ts">
  import "../app.postcss";
  import {description, serviceWorkerName, themeColour, title} from "$lib/const";
  import {pwaInfo} from "virtual:pwa-info";

  const serviceWorkerPath = `/${serviceWorkerName}.js`;
  const scriptType = process.env.NODE_ENV !== "production" ? "module" : "";

  $: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : "";
</script>

<svelte:head>
  {@html webManifest}
  <title>{title}</title>
  <meta name="description" content="{description}" />
  <meta name="theme-color" content="{themeColour}" />
  <script src="{serviceWorkerPath}" defer async type="{scriptType}"></script>
</svelte:head>

<main>
  <slot />
</main>

{#await import("$lib/ReloadPrompt/ReloadPrompt.svelte") then { default: ReloadPrompt }}
  <ReloadPrompt></ReloadPrompt>
{/await}
