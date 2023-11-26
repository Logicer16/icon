<script lang="ts">
  import {
    getToastStore,
    Toast,
    type ToastSettings
  } from "@skeletonlabs/skeleton";
  import {
    registerReloadHandler,
    reloadServiceWorker
  } from "$lib/ServiceWorker/client";
  import {idIsExcluded} from "$lib/ServiceWorker/excluded";
  import {page} from "$app/stores";

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

  function reload(): void {
    reloadServiceWorker().catch((error) => {
      throw error;
    });
  }

  registerReloadHandler(
    () => {
      window.location.reload();
    },
    () => {
      if (alreadyTriggered) return;
      if (!idIsExcluded($page.route.id)) toastStore.trigger(toastSettings);
      alreadyTriggered = true;
    }
  );
</script>

<Toast
  position="br"
  buttonDismiss="btn-icon btn-icon-sm variant-filled"
  buttonAction="btn btn-sm variant-filled" />
