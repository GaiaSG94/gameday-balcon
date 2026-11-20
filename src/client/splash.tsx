import './index.css';

import { context, requestExpandedMode } from '@devvit/web/client';
import type { JSX } from 'react';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

import { dayKeyUTC, generateBalcony } from '../shared/puzzle';
import { BalconyScene, PlantIcon } from './scene';
import { Head, Need } from './ui';

const Splash = (): JSX.Element => {
  const balcony = generateBalcony(dayKeyUTC());
  return (
    <div className="page">
      <div className="post">
        <div className="game">
          <Head number={balcony.number} day={balcony.day} streak={0} />
          <div className="colColumns">
            <div className="scene">
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
            <aside className="side">
              <div>
                <div className="eyebrow">Daily balcony #{balcony.number}</div>
                <h2>Today's balcony is ready.</h2>
                <p className="sub">Six plants, eight spots, one sunny afternoon. Same balcony for everyone today.</p>
              </div>
              <div className="kv">Today's plants</div>
              <div className="tray">
                {balcony.plants.map((plant) => (
                  <div key={plant.name} className="card">
                    <PlantIcon plant={plant} />
                    <span>
                      <span className="name" style={{ display: 'block' }}>{plant.name}</span>
                      <Need sun={plant.sun} water={plant.water} />
                    </span>
                  </div>
                ))}
              </div>
              <div className="bottom">
                <button
                  className="cta"
                  onClick={(event) => requestExpandedMode(event.nativeEvent, 'game')}
                >
                  {context.username ? `Plant today's balcony, ${context.username}` : "Plant today's balcony"}
                </button>
                <p className="proof">One round a day · streaks kept for every player</p>
              </div>
            </aside>
          </div>
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
