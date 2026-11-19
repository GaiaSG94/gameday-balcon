import './index.css';

import { context, requestExpandedMode } from '@devvit/web/client';
import type { JSX } from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { dayKeyUTC, generateBalcony } from '../shared/puzzle';
import { BalconyScene } from './scene';

const Splash = (): JSX.Element => {
  const balcony = generateBalcony(dayKeyUTC());
  return (
    <div className="page">
      <div className="post" style={{ padding: 0, overflow: 'hidden' }}>
        <div className="splash">
          <div className="word" style={{ fontSize: 22 }}><span className="sunDot" />Balcon</div>
          <p className="eyebrow">Daily balcony #{balcony.number}</p>
          <h2>Six plants, one sunny afternoon.</h2>
          <p className="sub">Give each plant the sun it needs. Same balcony for everyone today, fresh every day.</p>
          <div style={{ width: '100%', maxWidth: 420 }}>
            <BalconyScene
              balcony={balcony}
              placement={balcony.plants.map(() => -1)}
              held={null}
              hover={null}
              preview={0}
              onPlantSlot={() => undefined}
              onHover={() => undefined}
            />
          </div>
          <button
            className="cta"
            onClick={(event) => requestExpandedMode(event.nativeEvent, 'game')}
          >
            {context.username ? `Plant today's balcony, ${context.username}` : "Plant today's balcony"}
          </button>
          <p className="proof">One round a day · streaks kept for every player</p>
        </div>
      </div>
    </div>
  );
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Splash />
  </StrictMode>
);
