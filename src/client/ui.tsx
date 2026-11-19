import type { JSX } from 'react';

import type { PublicBalcony } from '../shared/puzzle';
import type { CommunityStats } from '../shared/stats';
import { PlantIcon } from './scene';

export const dayLabel = (day: string): string => {
  const date = new Date(`${day}T00:00:00.000Z`);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' });
};

export const Head = ({ number, day, streak }: { number: number; day: string; streak: number }): JSX.Element => (
  <div className="head">
    <span className="word"><span className="sunDot" />Balcon</span>
    <span className="pill">Day {number} · {dayLabel(day)}</span>
    {streak > 0 && <span className="pill streak">{streak}-day streak</span>}
  </div>
);

export const Need = ({ sun, water }: { sun: number; water: number }): JSX.Element => (
  <span className="need">
    <span className="dot" />{sun}h
    <span className="drops">
      {[0, 1, 2].map((i) => <i key={i} className={i < water ? '' : 'off'} />)}
    </span>
  </span>
);

export const PlantCard = ({ plant, state, onClick }: { plant: PublicBalcony['plants'][number]; state: 'free' | 'held' | 'placed'; onClick: () => void }): JSX.Element => (
  <button className={`card ${state === 'held' ? 'held' : state === 'placed' ? 'placed' : ''}`} onClick={onClick}>
    {state === 'held' && <span className="tag">Placing</span>}
    <PlantIcon plant={plant} />
    <span>
      <span className="name" style={{ display: 'block' }}>{plant.name}</span>
      <Need sun={plant.sun} water={plant.water} />
    </span>
  </button>
);

export const Meter = ({ count, preview }: { count: number; preview: number }): JSX.Element => (
  <div className="meter" aria-label={`${count} of 18 blooms`}>
    {Array.from({ length: 18 }, (_, i) => (
      <i key={i} className={i < count ? 'on' : i < count + preview ? 'pre' : ''} />
    ))}
  </div>
);

export const Proof = ({ stats }: { stats: CommunityStats }): JSX.Element => (
  <div className="proof">
    <b>{stats.players.toLocaleString('en-US')}</b> balconies planted today · median <b>{stats.median}</b> blooms
  </div>
);

export const Rule = (): JSX.Element => (
  <div>
    <div className="eyebrow">Today's rule</div>
    <h2>Give each plant the sun it needs.</h2>
    <p className="sub">Six plants, eight spots. Match the hours of sun and the water.</p>
  </div>
);

export const ScoreLine = ({ count, preview, label }: { count: number; preview: number; label: string }): JSX.Element => (
  <div className="score">
    <span className="big">{count}</span>
    <span className="of">/ 18 blooms</span>
    {preview > 0 && <span className="plus">+{preview} if placed here</span>}
    {label && <span className="of">{label}</span>}
  </div>
);

export const StatsView = ({ stats, mine, onBack }: { stats: CommunityStats; mine: number | null; onBack: () => void }): JSX.Element => {
  const max = Math.max(1, ...Object.values(stats.hist));
  return (
    <div className="side" style={{ margin: '14px' }}>
      <div>
        <div className="eyebrow">Today's balconies</div>
        <h2>Bloom distribution</h2>
        <p className="sub">{stats.players.toLocaleString('en-US')} balconies · median {stats.median} / 18</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(19,1fr)', gap: 4, height: 220, alignItems: 'end' }}>
        {Array.from({ length: 19 }, (_, i) => {
          const value = stats.hist[String(i)] ?? 0;
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', height: '100%' }}>
              <div style={{ width: '100%', height: Math.max(2, (value / max) * 190), background: mine === i ? '#17594c' : '#ebe6dd', borderRadius: '4px 4px 0 0' }} />
              <span style={{ fontSize: 10, color: mine === i ? '#17594c' : '#6b7178' }}>{i}</span>
            </div>
          );
        })}
      </div>
      <button className="btn2" onClick={onBack}>Back to my balcony</button>
    </div>
  );
};
