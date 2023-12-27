<script lang="ts">
  import "../app.postcss";
  import {
    arrow,
    autoUpdate,
    computePosition,
    flip,
    offset,
    shift
  } from "@floating-ui/dom";
  import {
    autoModeWatcher,
    initializeStores,
    storePopup,
    Toast
  } from "@skeletonlabs/skeleton";
  import {description, serviceWorkerName, themeColour, title} from "$lib/const";
  import {idIsExcluded} from "$lib/ServiceWorker/excluded";
  import {page} from "$app/stores";
  // eslint-disable-next-line import/no-unresolved
  import {pwaInfo} from "virtual:pwa-info";

  storePopup.set({arrow, autoUpdate, computePosition, flip, offset, shift});

  initializeStores();

  const serviceWorkerPath = `/${serviceWorkerName}.js`;
  const scriptType = process.env.NODE_ENV === "development" ? "module" : "";
  const autoModeWatcherTag =
    `<` +
    `script>${autoModeWatcher.toString()} autoModeWatcher();</script` +
    `>`;

  $: idAllowed = !idIsExcluded($page.route.id);
</script>

<svelte:head>
  <!-- Static content generated at build-time -->
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html pwaInfo?.webManifest.linkTag}
  <title>{title}</title>
  <meta name="description" content="{description}" />
  <meta name="theme-color" content="{themeColour}" />
  {#if idAllowed}
    <!-- Skeleton defaults to dark theme. -->
    <meta name="color-scheme" content="dark light" />
  {/if}
  <script
    async
    data-should-auto-reload="{idAllowed}"
    defer
    src="{serviceWorkerPath}"
    type="{scriptType}">
  </script>
  <!-- Static content generated at build-time -->
  <!-- eslint-disable-next-line svelte/no-at-html-tags -->
  {@html autoModeWatcherTag}
</svelte:head>

<main>
  <slot />
</main>

<Toast
  buttonAction="btn btn-sm variant-filled"
  buttonDismiss="btn-icon btn-icon-sm variant-filled"
  position="br" />

{#await import("$lib/ReloadPrompt/ReloadPrompt.svelte") then { default: ReloadPrompt }}
  <ReloadPrompt></ReloadPrompt>
{/await}
