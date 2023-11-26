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
    Toast
  } from "@skeletonlabs/skeleton";
  import {description, serviceWorkerName, themeColour, title} from "$lib/const";
  import {idIsExcluded} from "$lib/ServiceWorker/excluded";
  import {page} from "$app/stores";
  import {pwaInfo} from "virtual:pwa-info";
  import {storePopup} from "@skeletonlabs/skeleton";

  storePopup.set({arrow, autoUpdate, computePosition, flip, offset, shift});

  initializeStores();

  const serviceWorkerPath = `/${serviceWorkerName}.js`;
  const scriptType = process.env.NODE_ENV !== "production" ? "module" : "";

  $: webManifest = pwaInfo ? pwaInfo.webManifest.linkTag : "";
</script>

<svelte:head>
  {@html webManifest}
  <title>{title}</title>
  <meta name="description" content="{description}" />
  <meta name="theme-color" content="{themeColour}" />
  <script
    src="{serviceWorkerPath}"
    defer
    async
    type="{scriptType}"
    data-should-auto-reload="{!idIsExcluded($page.route.id)}"></script>
  {@html `<` +
    `script>${autoModeWatcher.toString()} autoModeWatcher();</script>`}
</svelte:head>

<main>
  <slot />
</main>

<Toast
  position="br"
  buttonDismiss="btn-icon btn-icon-sm variant-filled"
  buttonAction="btn btn-sm variant-filled" />

{#await import("$lib/ReloadPrompt/ReloadPrompt.svelte") then { default: ReloadPrompt }}
  <ReloadPrompt></ReloadPrompt>
{/await}
