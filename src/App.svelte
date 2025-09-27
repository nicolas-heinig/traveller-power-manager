<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { IconCode, IconAdjustmentsBolt } from "@tabler/icons-svelte";

  import config from "./config.json";
  import Section from "./Section.svelte";
  import SystemCard from "./SystemCard.svelte";
  import GameStateModal from "./GameStateModal.svelte";
  import PlantControlPanel from "./PlantControlPanel.svelte";

  interface System {
    name: string;
    power: number;
    enabled: boolean;
  }

  const savedConfig = localStorage.getItem("gameState");

  const initialConfig = savedConfig ? JSON.parse(savedConfig) : config;
  if (!savedConfig) {
    localStorage.setItem("gameState", JSON.stringify(config));
  }

  let systems = $state(initialConfig);

  let maxPower: number = $derived(
    systems.powerPlant.overload
      ? systems.powerPlant.maxPower * 1.1
      : systems.powerPlant.maxPower,
  );

  let totalPower = $derived(() => {
    let result = 0;

    if (systems.basicSystems.enabled) {
      result += systems.basicSystems.power;
    } else {
      result += systems.basicSystems.power / 2;
    }

    result += systems.mDrive.currentPower;

    if (systems.jDrive.enabled) {
      result += systems.jDrive.power;
    }

    systems.sensors.forEach((sensor: System) => {
      if (sensor.enabled) {
        result += sensor.power;
      }
    });

    systems.weapons.forEach((weapon: System) => {
      if (weapon.enabled) {
        result += weapon.power;
      }
    });

    systems.other.forEach((system: System) => {
      if (system.enabled) {
        result += system.power;
      }
    });

    return result;
  });

  let isOverPowered = $derived(totalPower() > maxPower);

  const toggleSystem = (system: System) => (system.enabled = !system.enabled);

  const mDriveTicks = Array.from(
    { length: Math.floor(systems.mDrive.maxPower / 20) + 1 },
    (_, i) => i * 20,
  );

  const saveGameState = () => {
    localStorage.setItem("gameState", JSON.stringify(systems));

    console.log("Saved gamestate!");
  };

  let interval: number;
  onMount(() => {
    interval = setInterval(saveGameState, 5000);
  });

  onDestroy(() => {
    clearInterval(interval);
  });

  let isGameStateModalOpen = $state(false);
  const openGameStateModal = () => (isGameStateModalOpen = true);

  let isPlantControlPanelOpen = $state(false);
  const openPlantControlModal = () => (isPlantControlPanelOpen = true);
</script>

<main class="max-w-md mx-auto">
  <GameStateModal bind:isGameStateModalOpen bind:systems />
  <PlantControlPanel bind:isPlantControlPanelOpen bind:systems />

  <div
    class="sticky top-0 z-10 bg-base-100 border-b-2 border-base-300 mb-4 shadow-b-md"
  >
    <div class="flex items-center justify-between px-4 py-2">
      <button
        class="btn btn-ghost btn-sm"
        aria-label="Open Game State Editor"
        onclick={openGameStateModal}
      >
        <IconCode />
      </button>

      <h1 class="text-3xl font-bold text-center">
        {systems.shipName}
      </h1>

      <button
        class="btn btn-ghost btn-sm"
        aria-label="Open Power Controls"
        onclick={openPlantControlModal}
      >
        <IconAdjustmentsBolt />
      </button>
    </div>

    <h2
      class="text-2xl font-bold text-center mb-4"
      class:text-error={isOverPowered}
      class:text-primary={!isOverPowered}
      class:text-accent={!isOverPowered && systems.powerPlant.overload}
      class:mb-2={isOverPowered}
      class:mb-4={!isOverPowered}
    >
      {totalPower()} / {maxPower}
    </h2>

    {#if isOverPowered}
      <p class="text-center text-error font-semibold mb-4">
        ⚠️ Power over maximum! Systems unstable!
      </p>
    {/if}
  </div>
  <div class="p-4">
    <Section header="Basic Systems">
      <SystemCard
        name={"Non essential Systems"}
        enabled={systems.basicSystems.enabled}
        power={systems.basicSystems.power / 2}
        onChange={() => toggleSystem(systems.basicSystems)}
      />
    </Section>

    <Section header="Drives">
      <div class="card card-sm shadow-lg bg-base-200">
        <div class="p-4">
          <h2 class="font-bold">M-Drive</h2>

          <input
            type="range"
            min="0"
            max={systems.mDrive.maxPower}
            step="20"
            bind:value={systems.mDrive.currentPower}
            class="mt-2 range range-primary"
          />

          <div class="flex justify-between px-3 mt-2 text-xs">
            {#each mDriveTicks as val}
              <span>{val}</span>
            {/each}
          </div>
        </div>
      </div>

      <SystemCard
        name={"J-Drive"}
        enabled={systems.jDrive.enabled}
        power={systems.jDrive.power}
        onChange={() => toggleSystem(systems.jDrive)}
      />
    </Section>

    <Section header="Sensors">
      {#each systems.sensors as sensor}
        <SystemCard
          name={sensor.name}
          enabled={sensor.enabled}
          power={sensor.power}
          onChange={() => toggleSystem(sensor)}
        />
      {/each}
    </Section>

    <Section header="Weapons">
      {#each systems.weapons as weapon}
        <SystemCard
          name={weapon.name}
          enabled={weapon.enabled}
          power={weapon.power}
          onChange={() => toggleSystem(weapon)}
        />
      {/each}
    </Section>

    <Section header="Other Systems">
      {#each systems.other as system}
        <SystemCard
          name={system.name}
          enabled={system.enabled}
          power={system.power}
          onChange={() => toggleSystem(system)}
        />
      {/each}
    </Section>
  </div>
</main>
