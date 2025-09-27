import { z } from "zod";

const systemSchema = z.object({
  name: z.string(),
  power: z.number(),
  enabled: z.boolean(),
});

export const configSchema = z.object({
  shipName: z.string(),
  basicSystems: z.object({
    power: z.number(),
    enabled: z.boolean(),
  }),
  powerPlant: z.object({
    maxPower: z.number(),
    overload: z.boolean(),
    criticalHits: z.number(),
  }),
  mDrive: z.object({
    maxPower: z.number(),
    currentPower: z.number(),
  }),
  jDrive: z.object({
    power: z.number(),
    enabled: z.boolean(),
  }),
  sensors: z.array(systemSchema),
  weapons: z.array(systemSchema),
  other: z.array(systemSchema),
});
