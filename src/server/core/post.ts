import { reddit } from '@devvit/web/server';
import { dayKeyUTC, generateBalcony } from '../../shared/puzzle';

export const createPost = async (): Promise<{ id: string }> => {
  const day = dayKeyUTC();
  const number = generateBalcony(day).number;
  const post = await reddit.submitCustomPost({
    title: `Daily Balcony #${number} — six plants, one sunny afternoon`,
  });
  return { id: post.id };
};
