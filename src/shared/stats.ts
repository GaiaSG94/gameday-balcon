export type CommunityStats = {
  players: number;
  median: number;
  hist: Record<string, number>;
};

const counts = (histogram: Readonly<Record<string, string | number>>): Array<[number, number]> =>
  Object.entries(histogram)
    .map(([key, value]) => [Number(key), Number(value)] as [number, number])
    .filter(([score, count]) => Number.isFinite(score) && Number.isFinite(count) && count > 0)
    .sort((a, b) => a[0] - b[0]);

export const summarize = (histogram: Readonly<Record<string, string | number>>): CommunityStats => {
  const rows = counts(histogram);
  const players = rows.reduce((sum, [, count]) => sum + count, 0);
  const hist = Object.fromEntries(rows);
  if (players === 0) return { players: 0, median: 0, hist };
  let cumulative = 0;
  for (const [score, count] of rows) {
    cumulative += count;
    if (cumulative * 2 >= players) return { players, median: score, hist };
  }
  return { players, median: rows[rows.length - 1]?.[0] ?? 0, hist };
};

export const betterThanPercent = (
  histogram: Readonly<Record<string, string | number>>,
  mine: number
): number => {
  const rows = counts(histogram);
  const total = rows.reduce((sum, [, count]) => sum + count, 0);
  if (total === 0) return 0;
  const below = rows.filter(([score]) => score < mine).reduce((sum, [, count]) => sum + count, 0);
  return Math.min(100, Math.floor((below / total) * 100));
};
