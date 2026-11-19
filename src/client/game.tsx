import './index.css';

import { useCallback, useEffect, useState } from 'react';
import type { JSX } from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { showShareSheet, showToast } from '@devvit/web/client';

import type { InitResponse, SubmitResponse } from '../shared/api';
import { bloomsFor } from '../shared/puzzle';
import { betterThanPercent } from '../shared/stats';
import { BalconyScene } from './scene';
import { Head, Meter, PlantCard, Proof, Rule, ScoreLine, StatsView, dayLabel } from './ui';

type View = 'game' | 'end' | 'stats';

const EndCard = ({ init, placement, result, countdown, onShare, onStats }: {
  init: InitResponse;
  placement: number[];
  result: SubmitResponse | null;
  countdown: string;
  onShare: () => void;
  onStats: () => void;
}): JSX.Element => {
  const blooms = result?.blooms ?? init.bestToday ?? 0;
  const streak = result?.streak ?? init.streak;
  const stats = result?.stats ?? init.stats;
  const better = result?.betterThan ?? betterThanPercent(stats.hist, blooms);
  const comment = `Daily Balcony #${init.balcony.number} — ${blooms}/18 blooms, ${streak}-day streak.`;
  return (
    <>
      <div className="scene">
        <BalconyScene balcony={init.balcony} placement={placement} held={null} hover={null} preview={0} onPlantSlot={() => undefined} onHover={() => undefined} />
      </div>
      <div className="side">
        <div>
          <div className="eyebrow">Balcony #{init.balcony.number} · final</div>
          <ScoreLine count={blooms} preview={0} label="" />
          <Meter count={blooms} preview={0} />
        </div>
        <p className="kv">More blooms than <b>{better}%</b> of today's balconies · median <b>{stats.median}</b></p>
        <div className="streakCard"><b style={{ fontSize: 15 }}>{streak}-day streak</b><span className="kv">best <b>{Math.max(blooms, init.bestToday ?? 0)}</b></span></div>
        <div className="note">Comment preview · <b>{comment}</b></div>
        <div className="bottom">
          <button className="cta" onClick={onShare}>Share in the comments</button>
          <button className="btn2" onClick={onStats}>See today's balconies</button>
          <div className="proof">Next balcony in <b>{countdown}</b></div>
        </div>
      </div>
    </>
  );
};

const Game = (): JSX.Element => {
  const [init, setInit] = useState<InitResponse | null>(null);
  const [placement, setPlacement] = useState<number[]>([]);
  const [held, setHeld] = useState<number | null>(null);
  const [hover, setHover] = useState<number | null>(null);
  const [result, setResult] = useState<SubmitResponse | null>(null);
  const [view, setView] = useState<View>('game');
  const [error, setError] = useState<string | null>(null);
  const [seconds, setSeconds] = useState(0);
  const [now, setNow] = useState(0);

  const load = useCallback(async () => {
    try {
      const response = await fetch('/api/init');
      const data: InitResponse & { status?: string; message?: string } = await response.json();
      if (data.status === 'error') throw new Error(data.message ?? 'load failed');
      setInit(data);
      setPlacement(data.lastAnswer ?? data.balcony.plants.map(() => -1));
      setView(data.solvedToday ? 'end' : 'game');
      setSeconds(0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'load failed');
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds((value) => value + 1);
      setNow(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const pickSlot = (slotIndex: number): void => {
    if (!init || result || init.solvedToday) return;
    const next = [...placement];
    if (held !== null) {
      const previous = next.indexOf(slotIndex);
      const origin = next[held] ?? -1;
      if (previous >= 0 && previous !== held) next[previous] = origin;
      next[held] = slotIndex;
      setHeld(null);
    } else {
      const occupant = next.indexOf(slotIndex);
      if (occupant >= 0) next[occupant] = -1;
    }
    setPlacement(next);
    setHover(null);
  };

  const check = async (): Promise<void> => {
    if (!init || !placement.every((slot) => slot >= 0)) return;
    try {
      const response = await fetch('/api/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ answer: placement, elapsedSeconds: seconds }),
      });
      const data: SubmitResponse & { status?: string; message?: string } = await response.json();
      if (data.status === 'error') throw new Error(data.message ?? 'submit failed');
      setResult(data);
      setView('end');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'submit failed';
      setError(message);
      showToast(message);
    }
  };

  const share = async (): Promise<void> => {
    if (!init) return;
    const blooms = result?.blooms ?? init.bestToday ?? 0;
    const streak = result?.streak ?? init.streak;
    const text = `Daily Balcony #${init.balcony.number} — ${blooms}/18 blooms, ${streak}-day streak.`;
    try {
      await navigator.clipboard.writeText(text);
      showToast('Copied — paste it in the comments');
    } catch {
      await showShareSheet({ text, title: 'My balcony' });
    }
  };

  if (error && !init) {
    return <div className="page"><div className="post">{error}</div></div>;
  }
  if (!init) {
    return <div className="page"><div className="post"><p className="kv">Opening today's balcony…</p></div></div>;
  }

  const placed = placement.filter((slot) => slot >= 0).length;
  const got = placement.reduce((sum, slotIndex, plantIndex) => {
    const plant = init.balcony.plants[plantIndex];
    const slot = init.balcony.slots[slotIndex];
    return plant && slot ? sum + bloomsFor(plant, slot) : sum;
  }, 0);
  const heldPlant = held === null ? null : init.balcony.plants[held];
  const hoverSlot = hover === null ? null : init.balcony.slots[hover];
  const preview = heldPlant && hoverSlot && held !== null && placement[held] === -1
    ? bloomsFor(heldPlant, hoverSlot)
    : 0;
  const nextMidnight = (Math.ceil(now / 86400000) * 86400000) - now;
  const countdown = `${String(Math.floor(nextMidnight / 3600000)).padStart(2, '0')}h ${String(Math.floor((nextMidnight % 3600000) / 60000)).padStart(2, '0')}m`;

  return (
    <div className="page">
      <div className="post">
        <div className="postHead"><span className="avatar" /> <b>r/BalconDaily</b> · {dayLabel(init.day)}</div>
        <div className="game">
          <Head number={init.balcony.number} day={init.day} streak={result?.streak ?? init.streak} />
          {view === 'stats' ? (
            <StatsView stats={result?.stats ?? init.stats} mine={result?.blooms ?? init.bestToday} onBack={() => setView('end')} />
          ) : view === 'end' ? (
            <EndCard init={init} placement={placement} result={result} countdown={countdown} onShare={() => void share()} onStats={() => setView('stats')} />
          ) : (
            <div className="colColumns">
              <div className="scene" onMouseLeave={() => setHover(null)}>
                <BalconyScene
                  balcony={init.balcony}
                  placement={placement}
                  held={held}
                  hover={hover}
                  preview={preview}
                  onPlantSlot={pickSlot}
                  onHover={setHover}                />
              </div>
              <aside className="side">
                <Rule />
                <div className="tray">
                  {init.balcony.plants.map((plant) => (
                    <PlantCard
                      key={plant.name}
                      plant={plant}
                      state={held === plant.index ? 'held' : placement[plant.index] !== -1 ? 'placed' : 'free'}
                      onClick={() => { if (!init.solvedToday) setHeld(held === plant.index ? null : plant.index); }}
                    />
                  ))}
                </div>
                <div className="bottom">
                  <ScoreLine count={got} preview={preview} label="" />
                  <Meter count={got} preview={preview} />
                  <button className="cta" disabled={placed < 6} onClick={() => void check()}>
                    {placed < 6 ? `Place ${6 - placed} more plants` : 'Check the balcony'}
                  </button>
                  {error && <p className="warn">{error}</p>}
                  <Proof stats={init.stats} />
                </div>
              </aside>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Game />
  </StrictMode>
);
