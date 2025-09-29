import { z } from "zod";

const systemSchema = z.object({
  name: z.string(),
  power: z.number(),
  enabled: z.boolean(),
});

export const configSchema = z.object({
  ship: z.object({
    name: z.string(),
    tonnage: z.number(),
  }),
  basicSystems: z.object({
    power: z.number(),
    enabled: z.boolean(),
  }),
  batteries: z.object({
    count: z.number(),
    capacity: z.number(),
    inUse: z.number(),
  }),
  powerPlant: z.object({
    maxPower: z.number(),
    overload: z.boolean(),
    criticalHits: z.number(),
  }),
  mDrive: z.object({
    maxThrust: z.number(),
    currentThrust: z.number(),
  }),
  jDrive: z.object({
    power: z.number(),
    enabled: z.boolean(),
  }),
  sensors: z.array(systemSchema),
  weapons: z.array(systemSchema),
  other: z.array(systemSchema),
});
