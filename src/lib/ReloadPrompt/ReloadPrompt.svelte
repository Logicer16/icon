<script lang="ts">
  import "./ReloadPrompt.scss";
  import {
    registerReloadHandler,
    reloadServiceWorker
  } from "$lib/ServiceWorker/client";
  import {writable} from "svelte/store";

  let needRefresh = writable(false);
  let needRefreshDismissed = writable(false);

  function close(): void {
    needRefresh.set(false);
    needRefreshDismissed.set(true);
  }

  async function refresh(): Promise<void> {
    return reloadServiceWorker();
  }

  registerReloadHandler(
    () => {
      window.location.reload();
    },
    () => {
      needRefresh.set(true);
    }
  );
  $: showToast = $needRefresh && !$needRefreshDismissed;
</script>

{#if showToast}
  <div class="pwa-toast" role="alert">
    <div class="message">
      <span>New content available, reload now to update.</span>
    </div>
    <button on:click="{refresh}">Reload</button>
    <button on:click="{close}"> Close </button>
  </div>
{/if}
