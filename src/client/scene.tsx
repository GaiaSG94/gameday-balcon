import type { JSX } from 'react';

import type { Plant, PublicBalcony } from '../shared/puzzle';
import { bloomsFor } from '../shared/puzzle';

type SlotView = PublicBalcony['slots'][number];
type PlantView = PublicBalcony['plants'][number];

const C = {
  sage: '#8fae96',
  sageDark: '#5f8a72',
  sun: '#f2b84b',
  terra: '#c46a4a',
  terraDark: '#a9563a',
  rain: '#8fb3c6',
  ink: '#12161c',
  ink2: '#6b7178',
  paper: '#ffffff',
  rail: '#2b3138',
  floor: '#f1ece4',
  shadow: 'rgba(20,40,25,.16)',
  pine: '#17594c',
};

const COLUMNS = [72, 158, 244, 330];

export const slotX = (slot: SlotView): number => COLUMNS[slot.index % 4] ?? 72;
export const slotBase = (slot: SlotView): number => (slot.place === 'rail' ? 176 : 286);

const SunArc = ({ dayNumber }: { dayNumber: number }): JSX.Element => {
  const arc = (t: number): [number, number] => {
    const angle = Math.PI * (1 - t);
    return [200 + 172 * Math.cos(angle), 150 - 122 * Math.sin(angle)];
  };
  const ticks: JSX.Element[] = [];
  for (let hour = 7; hour <= 19; hour++) {
    const [x, y] = arc((hour - 7) / 12);
    ticks.push(<circle key={hour} cx={x} cy={y} r={hour % 3 === 0 ? 2.2 : 1.2} fill={C.ink2} opacity={0.5} />);
    if (hour === 9 || hour === 13 || hour === 17) {
      const label = hour > 12 ? `${hour - 12} pm` : `${hour} am`;
      ticks.push(
        <text key={`${hour}-label`} x={x + (x < 200 ? -6 : 6)} y={y - 8} fontSize="9" textAnchor="middle" fill={C.ink2}>
          {label}
        </text>
      );
    }
  }
  const [sx, sy] = arc((dayNumber % 12) / 12);
  return (
    <g>
      <circle cx={sx} cy={sy} r="24" fill={C.sun} opacity="0.22" />
      <path d="M28 150 A172 122 0 0 1 372 150" fill="none" stroke={C.sun} strokeWidth="2.5" strokeDasharray="1 6" strokeLinecap="round" />
      {ticks}
      <circle cx={sx} cy={sy} r="12" fill={C.sun} />
    </g>
  );
};

const Foliage = ({ kind, x, y }: { kind: Plant['kind']; x: number; y: number }): JSX.Element => {
  if (kind === 'spike') {
    return (
      <g>
        {[-2, -1, 0, 1, 2].map((i) => (
          <g key={i}>
            <line x1={x + i * 3} y1={y} x2={x + i * 7} y2={y - (30 - Math.abs(i) * 6)} stroke={C.sageDark} strokeWidth="2" />
            <ellipse cx={x + i * 7} cy={y - (33 - Math.abs(i) * 6)} rx="2.6" ry="6" fill={C.sage} />
          </g>
        ))}
      </g>
    );
  }
  if (kind === 'round' || kind === 'heart') {
    return (
      <g>
        <circle cx={x - 9} cy={y - 10} r="10" fill={C.sageDark} />
        <circle cx={x + 9} cy={y - 12} r="10" fill={C.sage} />
        <circle cx={x} cy={y - 22} r="11" fill={kind === 'heart' ? C.sageDark : C.sage} />
      </g>
    );
  }
  if (kind === 'frond') {
    return (
      <g>
        {[-26, -12, 12, 26].map((d) => (
          <path key={d} d={`M${x} ${y} Q${x + d * 0.4} ${y - 26} ${x + d} ${y - 30}`} stroke={d < 0 ? C.sageDark : C.sage} strokeWidth="4" fill="none" strokeLinecap="round" />
        ))}
      </g>
    );
  }
  if (kind === 'pair') {
    return (
      <g>
        <line x1={x} y1={y} x2={x} y2={y - 34} stroke={C.sageDark} strokeWidth="2" />
        {[8, 18, 28].map((d, i) => (
          <g key={d}>
            <ellipse cx={x - 6} cy={y - d} rx="7" ry="4" fill={i % 2 ? C.sage : C.sageDark} transform={`rotate(-25 ${x - 6} ${y - d})`} />
            <ellipse cx={x + 6} cy={y - d} rx="7" ry="4" fill={i % 2 ? C.sageDark : C.sage} transform={`rotate(25 ${x + 6} ${y - d})`} />
          </g>
        ))}
      </g>
    );
  }
  return (
    <g>
      {[-32, 0, 32].map((r, i) => (
        <ellipse key={r} cx={x} cy={y - 15} rx="9" ry="15" fill={i === 1 ? C.sage : C.sageDark} transform={`rotate(${r} ${x} ${y})`} />
      ))}
    </g>
  );
};

const BLOOM_SPOTS: ReadonlyArray<readonly [number, number]> = [
  [-11, -30],
  [0, -38],
  [11, -30],
];

const BloomMarks = ({ x, y, count }: { x: number; y: number; count: number }): JSX.Element => (
  <g>
    {BLOOM_SPOTS.map(([dx, dy], i) =>
      i < count ? (
        <circle key={i} cx={x + dx} cy={y + dy} r="4.6" fill={C.sun} stroke={C.terra} strokeWidth="1.4" />
      ) : (
        <circle key={i} cx={x + dx} cy={y + dy} r="4" fill="none" stroke={C.ink2} strokeOpacity="0.35" strokeDasharray="2 2" />
      )
    )}
  </g>
);

const Pot = ({ plant, x, base, count, ghost, shift, onClick }: { plant: PlantView; x: number; base: number; count: number; ghost?: boolean; shift?: number; onClick?: () => void }): JSX.Element => {
  const top = base - 24 + (shift ?? 0);
  return (
    <g opacity={ghost ? 0.6 : 1} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <title>{`${plant.name}: ${count} of 3 blooms`}</title>
      {!ghost && <ellipse cx={x - 16} cy={base + 1} rx="22" ry="4" fill={C.shadow} />}
      <path d={`M${x - 14} ${top} L${x + 14} ${top} L${x + 10} ${base + (shift ?? 0)} L${x - 10} ${base + (shift ?? 0)}Z`} fill={C.terra} />
      <rect x={x - 17} y={top - 5} width="34" height="7" rx="2" fill={C.terraDark} />
      <Foliage kind={plant.kind} x={x} y={top - 5} />
      <BloomMarks x={x} y={top - 5} count={count} />
    </g>
  );
};

const Drops = ({ count, x, y }: { count: number; x: number; y: number }): JSX.Element => (
  <g>
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M${x + i * 8} ${y - 5} q3 4 0 6 q-3 -2 0 -6z`} fill={i < count ? C.rain : 'none'} stroke={C.rain} strokeWidth="0.8" />
    ))}
  </g>
);

const SlotMarker = ({ slot, onClick, onHover }: { slot: SlotView; onClick: () => void; onHover: (index: number | null) => void }): JSX.Element => {
  const x = slotX(slot);
  const base = slotBase(slot);
  return (
    <g
      onClick={onClick}
      onMouseEnter={() => onHover(slot.index)}
      onMouseLeave={() => onHover(null)}
      style={{ cursor: 'pointer' }}
    >
      <title>{`${slot.id}: ${slot.sun} hours of sun, ${slot.water} drops`}</title>
      <rect x={x - 22} y={base - 48} width="44" height="46" rx="10" fill={C.paper} fillOpacity="0.75" stroke={C.ink2} strokeOpacity="0.35" strokeDasharray="3 3" />
      <circle cx={x - 9} cy={base - 32} r="4" fill={C.sun} />
      <text x={x - 2} y={base - 28} fontSize="12" fontWeight="700" fill={C.ink}>{slot.sun}h</text>
      <Drops count={slot.water} x={x - 11} y={base - 12} />
    </g>
  );
};

const LEAVES: ReadonlyArray<[number, number, number, number, number, string]> = [
  [40, 620, 130, 30, 0, '#c4dcb6'], [180, 640, 150, -20, 0, '#93c08c'],
  [330, 650, 110, 20, 0, '#c4dcb6'], [520, 630, 160, -10, 0, '#93c08c'],
  [660, 640, 130, 15, 0, '#c4dcb6'], [20, 500, 120, 35, 0, '#93c08c'],
  [55, 400, 110, 40, 0, '#5c9a6c'], [25, 300, 100, 30, 0, '#5c9a6c'],
  [680, 490, 120, -35, 0, '#93c08c'], [650, 390, 110, -40, 0, '#5c9a6c'],
  [700, 290, 100, -30, 0, '#5c9a6c'], [80, 600, 90, 25, 0, '#2f7352'],
  [210, 660, 100, -15, 0, '#2f7352'], [420, 640, 90, 10, 0, '#2f7352'],
  [600, 660, 100, -20, 0, '#2f7352'], [120, 640, 80, 30, 0, '#1d5641'],
  [370, 670, 90, -10, 0, '#1d5641'], [550, 650, 80, 20, 0, '#1d5641'],
  [190, 40, 70, 180, 0, '#5c9a6c'], [260, 20, 60, 190, 0, '#93c08c'],
  [320, 35, 65, 170, 0, '#5c9a6c'],
];

const Leaves = (): JSX.Element => (
  <div className="leaves">
    <svg viewBox="0 0 708 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <ellipse cx="120" cy="640" rx="260" ry="150" fill="#c4dcb6" />
      <ellipse cx="560" cy="660" rx="300" ry="160" fill="#c4dcb6" />
      {LEAVES.map(([x, y, length, angle, , color], i) => (
        <g key={i} transform={`translate(${x} ${y}) rotate(${angle})`}>
          <path d={`M0 0 Q18 ${-length * 0.45} 0 ${-length} Q-18 ${-length * 0.45} 0 0Z`} fill={color} />
          <path d={`M0 0 L0 ${-length * 0.88}`} stroke="rgba(255,255,255,.16)" strokeWidth="1.2" />
        </g>
      ))}
    </svg>
  </div>
);

type SceneProps = {
  balcony: PublicBalcony;
  placement: readonly number[];
  held: number | null;
  hover: number | null;
  preview: number;
  onPlantSlot: (slotIndex: number) => void;
  onHover: (slotIndex: number | null) => void;
};

export const BalconyScene = ({ balcony, placement, held, hover, preview, onPlantSlot, onHover }: SceneProps): JSX.Element => {
  const occupied = new Set(placement.filter((value) => value >= 0));
  const hoveredSlot = hover === null ? null : balcony.slots[hover];
  const heldPlant = held === null ? null : balcony.plants[held];
  return (
    <div style={{ position: 'relative' }}>
      <Leaves />
      <svg viewBox="0 0 400 304" role="img" aria-label="Balcony with the sun path">
        <SunArc dayNumber={balcony.number} />
        {[28, 49, 70, 91, 112, 133, 154, 175, 196, 217, 238, 259, 280, 301, 322, 343, 364].map((x) => (
          <line key={x} x1={x} y1="186" x2={x} y2="262" stroke="#d8cbbb" strokeWidth="3" />
        ))}
        <rect x="14" y="176" width="372" height="10" rx="3" fill={C.rail} />
        <rect x="0" y="262" width="400" height="42" fill={C.floor} />
        <line x1="0" y1="262" x2="400" y2="262" stroke="#e2d4c1" />
        {balcony.slots.filter((slot) => !occupied.has(slot.index)).map((slot) => (
          <SlotMarker key={slot.id} slot={slot} onClick={() => onPlantSlot(slot.index)} onHover={onHover} />
        ))}
        {balcony.plants.map((plant) => {
          const slotIndex = placement[plant.index] ?? -1;
          const slot = balcony.slots[slotIndex];
          if (!slot) return null;
          return (
            <Pot
              key={plant.name}
              plant={plant}
              x={slotX(slot)}
              base={slotBase(slot)}
              count={bloomsFor(plant, slot)}
              onClick={() => onPlantSlot(slot.index)}
            />
          );
        })}
        {heldPlant && hoveredSlot && (
          <Pot plant={heldPlant} x={slotX(hoveredSlot)} base={slotBase(hoveredSlot) - 6} count={preview} ghost shift={0} />
        )}
        {heldPlant && hoveredSlot && (
          <rect x={slotX(hoveredSlot) - 26} y={slotBase(hoveredSlot) - 70} width="52" height="72" rx="12" fill="none" stroke={C.pine} strokeWidth="2" strokeDasharray="5 4" />
        )}
      </svg>
    </div>
  );
};

export const PlantIcon = ({ plant }: { plant: PlantView }): JSX.Element => (
  <svg viewBox="-24 -48 48 74" aria-hidden="true">
    <Pot plant={plant} x={0} base={24} count={0} />
  </svg>
);
