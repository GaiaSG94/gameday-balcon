import assert from 'node:assert/strict';
import { test } from 'node:test';

import { betterThanPercent, summarize } from './stats.ts';

test('histogramme vide', () => {
  assert.deepEqual(summarize({}), { players: 0, median: 0, hist: {} });
  assert.equal(betterThanPercent({}, 12), 0);
});

test('median et joueurs', () => {
  const hist = { '10': '2', '12': '3', '16': '4' };
  assert.deepEqual(summarize(hist), { players: 9, median: 12, hist: { 10: 2, 12: 3, 16: 4 } });
  assert.equal(betterThanPercent(hist, 12), 22);
  assert.equal(betterThanPercent(hist, 16), 55);
});

test('median paire et score maximal', () => {
  assert.deepEqual(summarize({ '5': '1', '15': '1' }), { players: 2, median: 5, hist: { 5: 1, 15: 1 } });
  assert.equal(betterThanPercent({ '5': '1', '15': '1' }, 18), 100);
});
