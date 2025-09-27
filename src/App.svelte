<script lang="ts">
  import { IconClipboard } from "@tabler/icons-svelte";

  import defaultConfig from "./defaultConfig.json";
  import { configSchema } from "./configSchema.ts";
  import Interface from "./Interface.svelte";

  const savedConfig = localStorage.getItem("gameState");

  const initialConfig = savedConfig ? JSON.parse(savedConfig) : defaultConfig;

  if (!savedConfig) {
    localStorage.setItem("gameState", JSON.stringify(defaultConfig));
  }

  let isConfigValid = true;

  const result = configSchema.safeParse(initialConfig);
  if (!result.success) {
    isConfigValid = false;
  }
</script>

<div>
  {#if isConfigValid}
    <Interface initialSystems={initialConfig} />
  {:else}
    <div class="hero max-w-md mx-auto">
      <div class="hero-content text-center">
        <div class="max-w-md">
          <h1 class="text-2xl font-bold">
            The saved configuration is invalid.
          </h1>
          <p class="py-6">
            That happens when we change the configuration schema. Don't worry,
            you can reset to the default configuration after copying your
            current state.
          </p>
          <p class="mb-6">
            After resetting, you can open the game state editor (top-left
            button) insert your fixed configuration.
          </p>

          <button
            class="btn btn-primary"
            onclick={() => {
              navigator.clipboard.writeText(
                JSON.stringify(initialConfig, null, 2),
              );
            }}
            >Copy your current config<IconClipboard />
          </button>

          <button
            class="btn btn-error"
            onclick={() => {
              localStorage.setItem("gameState", JSON.stringify(defaultConfig));
              location.reload();
            }}>Reset</button
          >
        </div>
      </div>
    </div>
  {/if}
</div>
