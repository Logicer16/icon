<script lang="ts">
  import {getToastStore, type ToastSettings} from "@skeletonlabs/skeleton";
  import {page} from "$app/stores";
  import {
    registerUpdateHandlers,
    reloadServiceWorker
  } from "$lib/ServiceWorker/client";
  import {idIsExcluded} from "$lib/ServiceWorker/excluded";

  const toastStore = getToastStore();
  const toastSettings: ToastSettings = {
    action: {
      label: "Reload",
      response: reload
    },
    autohide: false,
    message: "New content is available. Reload now to update."
  };

  let alreadyTriggered = false;

  /**
   * Reload the service worker.
   */
  function reload(): void {
    reloadServiceWorker().catch((error: unknown) => {
      throw error;
    });
  }

  registerUpdateHandlers({
    reload: () => {
      window.location.reload();
    },
    updateReady: () => {
      if (alreadyTriggered) return;
      if (!idIsExcluded($page.route.id)) toastStore.trigger(toastSettings);
      alreadyTriggered = true;
    }
  });
</script>
