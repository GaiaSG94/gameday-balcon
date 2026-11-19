# BALCON

A daily resource game for Reddit, built on [Devvit Web](https://developers.reddit.com/).

Six plants, one balcony, and a sun that moves all day.

## How to play

1. Pick a plant, then tap a square of the balcony.
2. Every pot needs enough sun and water to bloom.
3. Tap Check the balcony: all six blooming is a perfect day.

One round per day, the same for everyone; streaks stored per user in Redis.

## Stack

- React 19 + Tailwind 4 + Vite (client inside a Reddit post)
- Hono server on Devvit (`/api/init`, `/api/submit`), Redis persistence
- Deterministic daily generation (UTC seed), unit-tested

## Development

```bash
npm install
npm run dev
npm test
npm run test:types
npm run lint
npm run build
```

## Submission (Reddit's Game of the Day Hackathon)

- App listing: `developers.reddit.com/apps/gameday-balcon` (private until judging ends)
- Demo post: public test subreddit, post running the game
