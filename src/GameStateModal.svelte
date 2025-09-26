<script lang="ts">
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
      <h3 class="text-lg font-bold">Enter the game state here:</h3>

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
