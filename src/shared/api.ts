import type { CommunityStats } from './stats';
import type { PublicBalcony } from './puzzle';

export type ErrorResponse = {
  status: 'error';
  message: string;
};

export type InitResponse = {
  type: 'init';
  day: string;
  username: string;
  streak: number;
  solvedToday: boolean;
  bestToday: number | null;
  lastAnswer: number[] | null;
  startedAt: number;
  stats: CommunityStats;
  balcony: PublicBalcony;
};

export type SubmitRequest = {
  answer?: unknown;
  elapsedSeconds?: number;
};

export type SubmitResponse = {
  type: 'submit';
  blooms: number;
  perPlant: number[];
  goodDay: boolean;
  streak: number;
  bestToday: number | null;
  betterThan: number;
  stats: CommunityStats;
  firstTry: boolean;
};
