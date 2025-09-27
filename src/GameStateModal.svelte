<script lang="ts">
  import { IconClipboard } from "@tabler/icons-svelte";

  let { isGameStateModalOpen = $bindable(), systems = $bindable() } = $props();

  let buffer = $state(JSON.stringify(systems, null, 2));

  // Sync buffer when systems changes
  $effect(() => {
    buffer = JSON.stringify(systems, null, 2);
  });

  const save = () => {
    try {
      systems = JSON.parse(buffer); // update parent via bind
      isGameStateModalOpen = false;
    } catch (err) {
      alert("Invalid JSON");
    }
  };
</script>

{#if isGameStateModalOpen}
  <dialog class="modal modal-open modal-bottom sm:modal-middle">
    <div class="modal-box">
      <div class="flex mb-8">
        <h3 class="text-lg font-bold">Copy current state:</h3>

        <button
          class="btn btn-ghost btn-sm ml-auto"
          onclick={() => {
            navigator.clipboard.writeText(buffer);
          }}><IconClipboard /></button
        >
      </div>

      <h3 class="text-lg font-bold mb-4">Enter the game state here:</h3>

      <textarea
        class="textarea textarea-bordered w-full h-80 font-mono text-sm"
        bind:value={buffer}
      ></textarea>

      <div class="modal-action">
        <button class="btn" onclick={() => (isGameStateModalOpen = false)}
          >Cancel</button
        >
        <button class="btn btn-primary" onclick={save}>Save</button>
      </div>
    </div>
  </dialog>
{/if}
