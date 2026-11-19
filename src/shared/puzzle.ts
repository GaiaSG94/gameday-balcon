export type Slot = {
  index: number;
  id: string;
  place: 'rail' | 'floor';
  sun: number;
  water: number;
};

export type Plant = {
  index: number;
  name: string;
  kind: 'spike' | 'round' | 'frond' | 'pair' | 'broad' | 'heart';
  sun: number;
  water: number;
};

export type Balcony = {
  day: string;
  number: number;
  slots: Slot[];
  plants: Plant[];
};

export type Placement = readonly number[];

export type Score = {
  blooms: number;
  perPlant: number[];
};

const PLANT_SHAPES: ReadonlyArray<Pick<Plant, 'name' | 'kind'>> = [
  { name: 'Lavender', kind: 'spike' },
  { name: 'Geranium', kind: 'round' },
  { name: 'Fern', kind: 'frond' },
  { name: 'Mint', kind: 'pair' },
  { name: 'Basil', kind: 'broad' },
  { name: 'Begonia', kind: 'heart' },
];

export const dayKeyUTC = (now: Date = new Date()): string => now.toISOString().slice(0, 10);

export const dailySeed = (day: string): number => {
  let hash = 2166136261;
  const input = 'balcon:' + day;
  for (let i = 0; i < input.length; i++) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
};

export const mulberry32 = (seed: number): (() => number) => {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

const shuffled = <T>(items: readonly T[], rand: () => number): T[] => {
  const out = [...items];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const a = out[i];
    const b = out[j];
    if (a === undefined || b === undefined) continue;
    out[i] = b;
    out[j] = a;
  }
  return out;
};

const makeSlots = (rand: () => number): Slot[] => {
  const railSun = shuffled([5, 6, 7, 8], rand);
  const railWater = shuffled([1, 2, 2, 3], rand);
  const floorPairs = shuffled(
    [
      [2, 3],
      [2, 3],
      [3, 1],
      [4, 2],
    ],
    rand
  );
  const slots: Slot[] = [];
  for (let i = 0; i < 4; i++) {
    slots.push({
      index: i,
      id: `T${i + 1}`,
      place: 'rail',
      sun: railSun[i] ?? 5,
      water: railWater[i] ?? 1,
    });
  }
  for (let i = 0; i < 4; i++) {
    const pair = floorPairs[i] ?? [2, 3];
    slots.push({
      index: i + 4,
      id: `F${i + 1}`,
      place: 'floor',
      sun: pair[0] ?? 2,
      water: pair[1] ?? 3,
    });
  }
  return slots;
};

const makePlants = (slots: readonly Slot[], rand: () => number): Plant[] => {
  const twins = slots.filter((slot) => slot.sun === 2 && slot.water === 3);
  const others = shuffled(
    slots.filter((slot) => !(slot.sun === 2 && slot.water === 3)),
    rand
  );
  const chosen = shuffled([...twins, ...others.slice(0, 4)], rand);
  return PLANT_SHAPES.map((shape, index) => {
    const need = chosen[index];
    const sun = need?.sun ?? 2;
    const bumped = sun < 8 && index === 0 ? sun + 1 : sun;
    return { index, name: shape.name, kind: shape.kind, sun: bumped, water: need?.water ?? 1 };
  });
};

export const generateBalcony = (day: string): Balcony => {
  const rand = mulberry32(dailySeed(day));
  const slots = makeSlots(rand);
  const start = Date.parse(`${day}T00:00:00.000Z`);
  const epoch = Date.parse('2026-01-01T00:00:00.000Z');
  const number = Math.floor((start - epoch) / 86400000) + 1;
  return { day, number, slots, plants: makePlants(slots, rand) };
};

export const bloomsFor = (plant: Plant, slot: Slot): number =>
  Math.max(0, 3 - Math.abs(plant.sun - slot.sun) - Math.abs(plant.water - slot.water));

export const scorePlacement = (balcony: Balcony, answer: Placement): Score => {
  const perPlant = balcony.plants.map((plant) => {
    const slot = balcony.slots[answer[plant.index] ?? -1];
    return slot ? bloomsFor(plant, slot) : 0;
  });
  return { blooms: perPlant.reduce((sum, value) => sum + value, 0), perPlant };
};

export const isValidPlacement = (balcony: Balcony, answer: unknown): answer is Placement => {
  if (!Array.isArray(answer) || answer.length !== balcony.plants.length) return false;
  if (!answer.every((value) => Number.isInteger(value) && value >= 0 && value < balcony.slots.length)) {
    return false;
  }
  return new Set(answer).size === answer.length;
};

export const optimalPlacement = (balcony: Balcony): Score => {
  let best = 0;
  const slots = balcony.slots;
  const plants = balcony.plants;
  const walk = (plantIndex: number, used: Set<number>, total: number): void => {
    const plant = plants[plantIndex];
    if (!plant) {
      best = Math.max(best, total);
      return;
    }
    for (const slot of slots) {
      if (used.has(slot.index)) continue;
      used.add(slot.index);
      walk(plantIndex + 1, used, total + bloomsFor(plant, slot));
      used.delete(slot.index);
    }
  };
  walk(0, new Set(), 0);
  return { blooms: best, perPlant: [] };
};

export type PublicBalcony = {
  day: string;
  number: number;
  slots: ReadonlyArray<{ index: number; id: string; place: 'rail' | 'floor'; sun: number; water: number }>;
  plants: ReadonlyArray<{ index: number; name: string; kind: Plant['kind']; sun: number; water: number }>;
};

export const publicView = (balcony: Balcony): PublicBalcony => ({
  day: balcony.day,
  number: balcony.number,
  slots: balcony.slots.map(({ index, id, place, sun, water }) => ({ index, id, place, sun, water })),
  plants: balcony.plants.map(({ index, name, kind, sun, water }) => ({ index, name, kind, sun, water })),
});
