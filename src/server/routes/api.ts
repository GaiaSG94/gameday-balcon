import { Hono } from 'hono';
import type { Context } from 'hono';
import { context, reddit } from '@devvit/web/server';

import type { ErrorResponse, InitResponse, SubmitRequest, SubmitResponse } from '../../shared/api';
import {
  dayKeyUTC,
  generateBalcony,
  isValidPlacement,
  publicView,
  scorePlacement,
} from '../../shared/puzzle';
import { betterThanPercent, summarize } from '../../shared/stats';
import { activeStreak, distribution, lastAnswer, playedToday, recordResult } from '../core/store';

const api = new Hono();

const GOOD_DAY = 15;

const fail = (c: Context, message: string): Response =>
  c.json<ErrorResponse>({ status: 'error', message }, 400);

const currentUser = async (): Promise<string> => (await reddit.getCurrentUsername()) ?? 'anonymous';

const handleInit = async (c: Context): Promise<Response> => {
  if (!context.postId) return fail(c, 'postId is required');
  try {
    const day = dayKeyUTC();
    const username = await currentUser();
    const balcony = generateBalcony(day);
    const [best, streak, dist, answer] = await Promise.all([
      playedToday(username, day),
      activeStreak(username, day),
      distribution(day),
      lastAnswer(username, day, balcony),
    ]);
    return c.json<InitResponse>({
      type: 'init',
      day,
      username,
      streak,
      solvedToday: best !== null,
      bestToday: best,
      lastAnswer: answer ? [...answer] : null,
      startedAt: Date.now(),
      stats: summarize(dist),
      balcony: publicView(balcony),
    });
  } catch (err) {
    return fail(c, `init failed: ${err instanceof Error ? err.message : 'unknown error'}`);
  }
};

const handleSubmit = async (c: Context): Promise<Response> => {
  if (!context.postId) return fail(c, 'postId is required');
  let body: SubmitRequest;
  try {
    body = await c.req.json<SubmitRequest>();
  } catch {
    return fail(c, 'invalid payload');
  }
  const day = dayKeyUTC();
  const balcony = generateBalcony(day);
  if (!isValidPlacement(balcony, body.answer)) {
    return fail(c, 'Place all six plants in distinct spots.');
  }
  try {
    const username = await currentUser();
    const score = scorePlacement(balcony, body.answer);
    const previous = await playedToday(username, day);
    const firstTry = previous === null;
    const streak = firstTry
      ? score.blooms >= GOOD_DAY
        ? (await activeStreak(username, day)) + 1
        : 0
      : await activeStreak(username, day);
    if (firstTry) {
      await recordResult(username, day, score.blooms, streak, body.answer);
    }
    const dist = await distribution(day);
    return c.json<SubmitResponse>({
      type: 'submit',
      blooms: score.blooms,
      perPlant: score.perPlant,
      goodDay: score.blooms >= GOOD_DAY,
      streak,
      bestToday: firstTry ? score.blooms : previous,
      betterThan: betterThanPercent(dist, score.blooms),
      stats: summarize(dist),
      firstTry,
    });
  } catch (err) {
    return fail(c, `submit failed: ${err instanceof Error ? err.message : 'unknown error'}`);
  }
};

api.get('/init', handleInit);
api.post('/submit', handleSubmit);

export { api };
