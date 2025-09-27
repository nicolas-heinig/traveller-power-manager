<script lang="ts">
  import { onMount, onDestroy } from "svelte";
  import { IconCode, IconAdjustmentsBolt } from "@tabler/icons-svelte";

  import Section from "./Section.svelte";
  import SystemCard from "./SystemCard.svelte";
  import GameStateModal from "./GameStateModal.svelte";
  import PlantControlPanel from "./PlantControlPanel.svelte";

  interface System {
    name: string;
    power: number;
    enabled: boolean;
  }

  let { initialSystems } = $props();

  let systems = $state(initialSystems);

  let maxPower = $derived(() => {
    const { powerPlant } = systems;
    let { maxPower, criticalHits, overload } = powerPlant;

    // Map critical hit count to multipliers
    const multipliers: Record<number, number> = {
      1: 0.9,
      2: 0.9,
      3: 0.5,
    };

    let result =
      criticalHits >= 4 ? 0 : maxPower * (multipliers[criticalHits] ?? 1);

    if (overload) {
      result *= 1.1;
    }

    return Math.round(result);
  });

  let totalPower = $derived(() => {
    const { basicSystems, mDrive, jDrive, ship, sensors, weapons, other } =
      systems;

    const basePower = basicSystems.enabled
      ? basicSystems.power
      : basicSystems.power / 2;

    const thrustPower = mDrive.currentThrust * (ship.tonnage * 0.1);

    const jumpPower = jDrive.enabled ? jDrive.power : 0;

    const systemGroups = [sensors, weapons, other];

    const groupPower = systemGroups
      .flat()
      .filter((sys) => sys.enabled)
      .reduce((sum, sys) => sum + sys.power, 0);

    return basePower + thrustPower + jumpPower + groupPower;
  });

  let isOverPowered = $derived(totalPower() > maxPower());
  const mDriveTicks = $derived(
    Array.from(
      { length: Math.floor(systems.mDrive.maxThrust) + 1 },
      (_, i) => i * systems.ship.tonnage * 0.1,
    ),
  );

  const toggleSystem = (system: System) => (system.enabled = !system.enabled);

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
        {systems.ship.name}
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
      {totalPower()} / {maxPower()}
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
            max={systems.mDrive.maxThrust}
            bind:value={systems.mDrive.currentThrust}
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
