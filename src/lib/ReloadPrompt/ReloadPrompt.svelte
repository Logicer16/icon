<script lang="ts">
  import "./ReloadPrompt.scss";
  import {ServiceWorkerMessageTypes} from "$lib/ServiceWorker/messages";
  import {useRegisterSW} from "virtual:pwa-register/svelte";

  const {needRefresh, updateServiceWorker, offlineReady} = useRegisterSW({
    onRegisterError(error) {
      console.error(`Could not register service worker with error: ${error}`);
    },
    onRegisteredSW(swScriptUrl, registration) {
      if (registration === undefined) return;
      navigator.serviceWorker.controller?.postMessage({
        type: ServiceWorkerMessageTypes.coepCredentialless,
        value: "chrome" in window || "netscape" in window
      });

      // Check for updates
      setInterval(() => {
        console.log("Checking for sw update");
        registration.update().catch((error) => {
          console.error(
            `Could not register service worker with error: ${error}`
          );
        });
      }, 60000 /* 1m */);

      console.log(
        `Successfully registered service worker at url: ${swScriptUrl}, for scope: ${registration.scope}`
      );

      // If the registration is active, but it's not controlling the page
      if (registration.active && navigator.serviceWorker.controller === null) {
        refresh().catch((error) => {
          throw error;
        });
      }
    }
  });

  function close(): void {
    offlineReady.set(false);
    needRefresh.set(false);
  }

  async function refresh(): Promise<void> {
    return updateServiceWorker(true);
  }

  $: toast = $offlineReady || $needRefresh;
</script>

{#if toast}
  <div class="pwa-toast" role="alert">
    <div class="message">
      {#if $offlineReady}
        <span>App ready to work offline</span>
      {:else}
        <span>New content available, click on reload button to update.</span>
      {/if}
    </div>
    {#if $needRefresh}
      <button on:click="{refresh}">Reload</button>
    {/if}
    <button on:click="{close}"> Close </button>
  </div>
{/if}
