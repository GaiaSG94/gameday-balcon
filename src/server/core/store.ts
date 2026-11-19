import { redis } from '@devvit/web/server';
import { isValidPlacement, type Balcony, type Placement } from '../../shared/puzzle';

const DAY_MS = 86400000;

const previousDay = (day: string): string => new Date(Date.parse(day) - DAY_MS).toISOString().slice(0, 10);

export const activeStreak = async (username: string, day: string): Promise<number> => {
  const [raw, lastDay] = await Promise.all([
    redis.get(`streak:${username}`),
    redis.get(`lastday:${username}`),
  ]);
  const streak = Number.parseInt(raw ?? '0', 10) || 0;
  if (lastDay !== day && lastDay !== previousDay(day)) return 0;
  return streak;
};

export const playedToday = async (username: string, day: string): Promise<number | null> => {
  const raw = await redis.get(`played:${username}:${day}`);
  if (raw === null || raw === undefined) return null;
  const score = Number.parseInt(raw, 10);
  return Number.isFinite(score) ? score : null;
};

export const lastAnswer = async (username: string, day: string, balcony: Balcony): Promise<Placement | null> => {
  const raw = await redis.get(`pick:${username}:${day}`);
  if (!raw) return null;
  try {
    const parsed: unknown = JSON.parse(raw);
    return isValidPlacement(balcony, parsed) ? parsed : null;
  } catch {
    return null;
  }
};

export const recordResult = async (
  username: string,
  day: string,
  blooms: number,
  streak: number,
  answer: Placement
): Promise<void> => {
  const ttl = 40 * 24 * 60 * 60;
  await Promise.all([
    redis.set(`played:${username}:${day}`, String(blooms)),
    redis.set(`pick:${username}:${day}`, JSON.stringify(answer)),
    redis.set(`streak:${username}`, String(streak)),
    redis.set(`lastday:${username}`, day),
    redis.incrBy(`players:${day}`, 1),
    redis.hIncrBy(`dist:${day}`, String(blooms), 1),
    redis.expire(`players:${day}`, ttl),
    redis.expire(`dist:${day}`, ttl),
    redis.expire(`pick:${username}:${day}`, ttl),
  ]);
};

export const distribution = async (day: string): Promise<Record<string, string>> =>
  redis.hGetAll(`dist:${day}`);
