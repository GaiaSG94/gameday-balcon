import assert from 'node:assert/strict';
import { test } from 'node:test';

import {
  bloomsFor,
  dailySeed,
  generateBalcony,
  isValidPlacement,
  optimalPlacement,
  publicView,
  scorePlacement,
} from './puzzle.ts';

const DAYS: string[] = [];
for (let i = 0; i < 365; i++) {
  DAYS.push(new Date(Date.UTC(2026, 0, 1 + i)).toISOString().slice(0, 10));
}

const optimalCount = (balcony) => {
  let best = -1;
  let count = 0;
  const walk = (index, used, total) => {
    const plant = balcony.plants[index];
    if (!plant) {
      if (total > best) {
        best = total;
        count = 1;
      } else if (total === best) {
        count++;
      }
      return;
    }
    for (const slot of balcony.slots) {
      if (used.has(slot.index)) continue;
      used.add(slot.index);
      walk(index + 1, used, total + bloomsFor(plant, slot));
      used.delete(slot.index);
    }
  };
  walk(0, new Set(), 0);
  return { best, count };
};

test('seed deterministe et differencie', () => {
  assert.equal(dailySeed('2026-12-09'), dailySeed('2026-12-09'));
  assert.notEqual(dailySeed('2026-12-09'), dailySeed('2026-12-10'));
});

test('le balcon du jour est deterministe sur 365 jours', () => {
  for (const day of DAYS) {
    assert.deepEqual(generateBalcony(day), generateBalcony(day), day);
  }
});

test('structure : 8 emplacements, 6 plantes, deux emplacements jumeaux', () => {
  for (const day of DAYS) {
    const balcony = generateBalcony(day);
    assert.equal(balcony.slots.length, 8, day);
    assert.equal(balcony.plants.length, 6, day);
    assert.equal(new Set(balcony.slots.map((slot) => slot.id)).size, 8, day);
    assert.equal(balcony.slots.filter((slot) => slot.sun === 2 && slot.water === 3).length, 2, day);
    assert.ok(balcony.plants.every((plant) => plant.sun >= 2 && plant.sun <= 9), day);
    assert.ok(balcony.plants.every((plant) => plant.water >= 1 && plant.water <= 3), day);
  }
});

test('score : 0 a 18, apercu coherent avec le calcul serveur', () => {
  const balcony = generateBalcony('2026-12-09');
  const empty = scorePlacement(balcony, []);
  assert.equal(empty.blooms, 0);
  const answer = [0, 1, 2, 3, 4, 5];
  const score = scorePlacement(balcony, answer);
  assert.equal(score.perPlant.length, 6);
  assert.ok(score.blooms >= 0 && score.blooms <= 18);
  assert.equal(
    score.blooms,
    score.perPlant.reduce((sum, value) => sum + value, 0)
  );
  const plant = balcony.plants[0];
  const slot = balcony.slots[0];
  if (plant && slot) assert.equal(bloomsFor(plant, slot), Math.max(0, 3 - Math.abs(plant.sun - slot.sun) - Math.abs(plant.water - slot.water)));
});

test('reponses invalides rejetees', () => {
  const balcony = generateBalcony('2026-12-09');
  assert.ok(!isValidPlacement(balcony, [0, 1, 2, 3, 4]));
  assert.ok(!isValidPlacement(balcony, [0, 1, 2, 3, 4, 8]));
  assert.ok(!isValidPlacement(balcony, [0, 1, 2, 3, 4, 4]));
  assert.ok(!isValidPlacement(balcony, [0, 1, 2, 3, 4, '5']));
  assert.ok(isValidPlacement(balcony, [0, 1, 2, 3, 4, 5]));
});

test('optimum >= 17 et plusieurs placements optimaux chaque jour', () => {
  for (const day of DAYS) {
    const balcony = generateBalcony(day);
    const optimum = optimalPlacement(balcony).blooms;
    const counted = optimalCount(balcony);
    assert.ok(optimum >= 17, `${day}: ${optimum}`);
    assert.equal(counted.best, optimum, day);
    assert.ok(counted.count >= 2, `${day}: ${counted.count}`);
  }
});

test('la vue publique ne contient aucune solution', () => {
  const balcony = generateBalcony('2026-12-09');
  const view = publicView(balcony);
  const json = JSON.stringify(view);
  assert.ok(!json.includes('answer'));
  assert.ok(!json.includes('solution'));
  assert.ok(!json.includes('optimal'));
  assert.equal(view.plants.length, 6);
  assert.equal(view.slots.length, 8);
});
