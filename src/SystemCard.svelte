<script lang="ts">
  let { name, enabled, power, onChange } = $props();
</script>

<div class="space-y-4 mb-2">
  <div class="card card-sm shadow-lg bg-base-200">
    <div class="p-4 items-center flex">
      <h2 class="font-bold">{name}</h2>

      <div class="badge badge-ghost ml-auto">{power}</div>

      <input
        type="checkbox"
        bind:checked={enabled}
        class="toggle toggle-primary"
        onchange={onChange}
      />
    </div>
  </div>
</div>
