<script lang="ts">
  let { isPlantControlPanelOpen = $bindable(), systems = $bindable() } =
    $props();

  let overload = $state(systems.powerPlant.overload);

  let uncheckedCount = $derived(4 - systems.powerPlant.criticalHits);

  const save = () => {
    systems.powerPlant.overload = overload;
    systems.powerPlant.criticalHits = document.querySelectorAll(
      "input.checkbox[type=checkbox]:checked",
    ).length;
    isPlantControlPanelOpen = false;
  };
</script>

{#if isPlantControlPanelOpen}
  <dialog class="modal modal-open modal-bottom sm:modal-middle">
    <div class="modal-box p-4">
      <div class="flex mb-8">
        <h3 class="font-bold">Overload:</h3>

        <input
          type="checkbox"
          bind:checked={overload}
          class="toggle toggle-primary ml-auto"
        />
      </div>

      <div class="flex mb-8">
        <h3 class="font-bold mr-auto">Critical Hits:</h3>

        {#each Array(systems.powerPlant.criticalHits)}
          <input
            type="checkbox"
            class="checkbox checkbox-error ml-4"
            checked={true}
          />
        {/each}

        {#each Array(uncheckedCount)}
          <input
            type="checkbox"
            class="checkbox checkbox-error ml-4"
            checked={false}
          />
        {/each}
      </div>

      <div class="modal-action">
        <button class="btn" onclick={() => (isPlantControlPanelOpen = false)}
          >Cancel</button
        >

        <button class="btn btn-primary" onclick={save}>Save</button>
      </div>
    </div>
  </dialog>
{/if}
