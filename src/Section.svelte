<script lang="ts">
  let { header, children } = $props();
</script>

<div>
  <h3 class="text-xl font-bold mb-2">{header}</h3>
  <div class="space-y-4 mb-4">
    {@render children()}
  </div>
</div>
