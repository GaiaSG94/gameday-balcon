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
  soil: '#5a4336',
  rain: '#8fb3c6',
  ink: '#12161c',
  ink2: '#6b7178',
  paper: '#ffffff',
  line: '#e7e3da',
  pine: '#17594c',
  rail: '#2b3138',
  railTop: '#3d444c',
  railEnd: '#1b1f24',
  floor: '#f1ece4',
  wall: '#ece6dc',
  wall2: '#e1d9cc',
  edge1: '#e4ddd1',
  edge2: '#d8cfc1',
  joint: '#e5ded2',
  shadow: 'rgba(20,40,25,.16)',
};

const U = 52;
const OX = 104;
const OY = 226;
const C30 = 0.866;
const SHADOW_DIR: readonly [number, number] = [-0.27, 0.95];

const project = (x: number, y: number, z = 0): [number, number] => [
  OX + (x - y) * C30 * U,
  OY + (x + y) * 0.5 * U - z * U,
];

const RAIL_COLUMNS: ReadonlyArray<readonly [number, number, number]> = [
  [0.5, 0, 1.05],
  [1.5, 0, 1.05],
  [2.5, 0, 1.05],
  [3.5, 0, 1.05],
];

const FLOOR_COLUMNS: ReadonlyArray<readonly [number, number, number]> = [
  [0.5, 1.35, 0],
  [1.5, 1.35, 0],
  [2.5, 1.35, 0],
  [3.5, 1.35, 0],
];

export const slotIso = (slot: SlotView): readonly [number, number, number] =>
  slot.place === 'rail' ? (RAIL_COLUMNS[slot.index % 4] ?? RAIL_COLUMNS[0]!) : (FLOOR_COLUMNS[slot.index % 4] ?? FLOOR_COLUMNS[0]!);

const polyPoints = (points: ReadonlyArray<readonly [number, number, number]>): string =>
  points
    .map((p) => project(...p))
    .map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`)
    .join(' ');

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
  if (kind === 'round') {
    return (
      <g>
        <circle cx={x - 9} cy={y - 10} r="10" fill={C.sageDark} />
        <circle cx={x + 9} cy={y - 12} r="10" fill={C.sage} />
        <circle cx={x} cy={y - 22} r="11" fill={C.sage} />
      </g>
    );
  }
  if (kind === 'heart') {
    return (
      <g>
        <circle cx={x - 8} cy={y - 10} r="9" fill={C.sageDark} />
        <circle cx={x + 8} cy={y - 10} r="9" fill={C.sageDark} />
        <circle cx={x} cy={y - 20} r="10" fill={C.sage} />
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

const Drops = ({ count, x, y }: { count: number; x: number; y: number }): JSX.Element => (
  <g>
    {[0, 1, 2].map((i) => (
      <path key={i} d={`M${x + i * 8} ${y - 5} q3 4 0 6 q-3 -2 0 -6z`} fill={i < count ? C.rain : 'none'} stroke={C.rain} strokeWidth="0.8" />
    ))}
  </g>
);

const FlatPot = ({ plant }: { plant: PlantView }): JSX.Element => {
  const base = 24;
  const top = base - 24;
  return (
    <g>
      <path d={`M${-14} ${top} L${14} ${top} L${10} ${base} L${-10} ${base}Z`} fill={C.terra} />
      <rect x={-17} y={top - 5} width="34" height="7" rx="2" fill={C.terraDark} />
      <Foliage kind={plant.kind} x={0} y={top - 5} />
    </g>
  );
};

export const PlantIcon = ({ plant }: { plant: PlantView }): JSX.Element => (
  <svg viewBox="-24 -48 48 74" aria-hidden="true">
    <FlatPot plant={plant} />
  </svg>
);

const IsoPot = ({ plant, x, y, z, count, ghost, onClick }: {
  plant: PlantView;
  x: number;
  y: number;
  z: number;
  count: number;
  ghost?: boolean;
  onClick?: () => void;
}): JSX.Element => {
  const [px, py] = project(x, y, z);
  const [sx, sy] = project(x + SHADOW_DIR[0] * 0.32, y + SHADOW_DIR[1] * 0.32, z);
  return (
    <g opacity={ghost ? 0.6 : 1} onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'default' }}>
      <title>{`${plant.name}: ${count} of 3 blooms`}</title>
      {!ghost && <ellipse cx={sx} cy={sy} rx="24" ry="7" fill={C.shadow} transform={`rotate(-18 ${sx} ${sy})`} />}
      <path d={`M${px - 13} ${py - 26} L${px + 13} ${py - 26} L${px + 10} ${py} L${px - 10} ${py}Z`} fill={C.terra} />
      <ellipse cx={px} cy={py} rx="10" ry="3.5" fill={C.terra} />
      <path d={`M${px + 4} ${py - 25} L${px + 13} ${py - 26} L${px + 10} ${py} L${px + 5} ${py + 1}Z`} fill={C.terraDark} opacity="0.35" />
      <ellipse cx={px} cy={py - 27} rx="15" ry="5" fill={C.terraDark} />
      <ellipse cx={px} cy={py - 27.5} rx="12" ry="3.6" fill={C.soil} />
      <Foliage kind={plant.kind} x={px} y={py - 28} />
      <BloomMarks x={px} y={py - 28} count={count} />
    </g>
  );
};

const IsoSlotTile = ({ slot, onClick, onHover }: { slot: SlotView; onClick: () => void; onHover: (index: number | null) => void }): JSX.Element => {
  const [x, y, z] = slotIso(slot);
  const r = 0.32;
  const q = z > 0 ? 0.11 : r;
  const [px, py] = project(x, y, z);
  return (
    <g onClick={onClick} onMouseEnter={() => onHover(slot.index)} onMouseLeave={() => onHover(null)} style={{ cursor: 'pointer' }}>
      <title>{`${slot.id}: ${slot.sun} hours of sun, ${slot.water} drops`}</title>
      <polygon
        points={polyPoints([
          [x - r, y - q, z],
          [x + r, y - q, z],
          [x + r, y + q, z],
          [x - r, y + q, z],
        ])}
        fill={C.paper}
        fillOpacity="0.85"
        stroke={C.ink2}
        strokeOpacity="0.45"
        strokeDasharray="3 3"
      />
      <rect x={px - 21} y={py - 44} width="42" height="30" rx="6" fill="#fff" stroke={C.line} />
      <circle cx={px - 9} cy={py - 33} r="4" fill={C.sun} />
      <text x={px - 2} y={py - 29} fontSize="12" fontWeight="600" fill={C.ink}>
        {slot.sun}h
      </text>
      <Drops count={slot.water} x={px - 10} y={py - 17} />
    </g>
  );
};

const IsoSunArc = ({ dayNumber }: { dayNumber: number }): JSX.Element => {
  const arcPoint = (t: number): [number, number, number] => [2 + 2.7 * Math.cos(Math.PI * (1 - t)), -1.5, 1.7 + 2.2 * Math.sin(Math.PI * (1 - t))];
  const path = Array.from({ length: 41 }, (_, i) => {
    const [x, y] = project(...arcPoint(i / 40));
    return `${i ? 'L' : 'M'}${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join('');
  const ticks: JSX.Element[] = [];
  for (let hour = 7; hour <= 19; hour++) {
    const [x, y] = project(...arcPoint((hour - 7) / 12));
    ticks.push(<circle key={hour} cx={x} cy={y} r={hour % 3 === 0 ? 2.2 : 1.2} fill={C.ink2} opacity={0.5} />);
    if (hour === 9 || hour === 13 || hour === 17) {
      const label = hour > 12 ? `${hour - 12} pm` : `${hour} am`;
      ticks.push(
        <text key={`${hour}-label`} x={x} y={y - 9} fontSize="9" textAnchor="middle" fill={C.ink2}>
          {label}
        </text>
      );
    }
  }
  const [sx, sy] = project(...arcPoint((dayNumber % 12) / 12));
  return (
    <g>
      <circle cx={sx} cy={sy} r="24" fill={C.sun} opacity="0.22" />
      <path d={path} fill="none" stroke={C.ink2} strokeOpacity="0.45" strokeWidth="1" strokeDasharray="2 4" />
      {ticks}
      <circle cx={sx} cy={sy} r="12" fill={C.sun} />
    </g>
  );
};

const IsoFloor = (): JSX.Element => {
  const joints: JSX.Element[] = [];
  for (let i = 1; i < 4; i++) {
    const [ax, ay] = project(i, 0);
    const [ex, ey] = project(i, 2);
    joints.push(<line key={`j${i}`} x1={ax} y1={ay} x2={ex} y2={ey} stroke={C.joint} />);
  }
  const [mx, my] = project(0, 1);
  const [mx2, my2] = project(4, 1);
  const barShadows: JSX.Element[] = [];
  for (let b = 0.125; b < 4; b += 0.25) {
    const [ax, ay] = project(b, 0);
    const [ex, ey] = project(b + SHADOW_DIR[0], SHADOW_DIR[1]);
    barShadows.push(<line key={b} x1={ax} y1={ay} x2={ex} y2={ey} stroke={C.shadow} strokeWidth="3" />);
  }
  return (
    <g>
      <polygon points={polyPoints([[0, 0, 0], [4, 0, 0], [4, 2, 0], [0, 2, 0]])} fill={C.floor} />
      <polygon points={polyPoints([[4, 0, 0], [4, 2, 0], [4, 2, -0.14], [4, 0, -0.14]])} fill={C.edge1} />
      <polygon points={polyPoints([[0, 2, 0], [4, 2, 0], [4, 2, -0.14], [0, 2, -0.14]])} fill={C.edge2} />
      {joints}
      <line x1={mx} y1={my} x2={mx2} y2={my2} stroke={C.joint} />
      {barShadows}
      <polygon
        points={polyPoints([
          [SHADOW_DIR[0] * 0.9 + 0.05, SHADOW_DIR[1] * 0.9, 0],
          [4 + SHADOW_DIR[0] * 0.9, SHADOW_DIR[1] * 0.9, 0],
          [4 + SHADOW_DIR[0], SHADOW_DIR[1] + 0.12, 0],
          [0.05 + SHADOW_DIR[0], SHADOW_DIR[1] + 0.12, 0],
        ])}
        fill={C.shadow}
      />
    </g>
  );
};

const IsoWallAndRail = (): JSX.Element => {
  const railBars: JSX.Element[] = [];
  for (let b = 0.125; b < 4; b += 0.25) {
    const [ax, ay] = project(b, 0, 0);
    const [ex, ey] = project(b, 0, 1);
    railBars.push(<line key={b} x1={ax} y1={ay} x2={ex} y2={ey} stroke={C.rail} strokeWidth="1.3" />);
  }
  return (
    <g>
      <polygon points={polyPoints([[0, 0, 0], [0, 2, 0], [0, 2, 1.9], [0, 0, 1.9]])} fill={C.wall} stroke={C.wall2} />
      <polygon points={polyPoints([[0, 0.75, 0], [0, 1.45, 0], [0, 1.45, 1.45], [0, 0.75, 1.45]])} fill={C.wall2} />
      <polygon points={polyPoints([[0, 0, 1.9], [0, 2, 1.9], [-0.12, 2, 1.9], [-0.12, 0, 1.9]])} fill={C.wall2} />
      {railBars}
      <polygon points={polyPoints([[0, -0.12, 1.05], [4, -0.12, 1.05], [4, 0.12, 1.05], [0, 0.12, 1.05]])} fill={C.railTop} />
      <polygon points={polyPoints([[0, 0.12, 1.05], [4, 0.12, 1.05], [4, 0.12, 0.99], [0, 0.12, 0.99]])} fill={C.rail} />
      <polygon points={polyPoints([[4, -0.12, 1.05], [4, 0.12, 1.05], [4, 0.12, 0.99], [4, -0.12, 0.99]])} fill={C.railEnd} />
    </g>
  );
};

const BalconyShell = (): JSX.Element => (
  <g>
    <IsoFloor />
    <IsoWallAndRail />
  </g>
);

const LEAVES: ReadonlyArray<[number, number, number, number, string]> = [
  [40, 620, 130, 30, '#c4dcb6'], [180, 640, 150, -20, '#93c08c'],
  [330, 650, 110, 20, '#c4dcb6'], [520, 630, 160, -10, '#93c08c'],
  [660, 640, 130, 15, '#c4dcb6'], [20, 500, 120, 35, '#93c08c'],
  [55, 400, 110, 40, '#5c9a6c'], [25, 300, 100, 30, '#5c9a6c'],
  [680, 490, 120, -35, '#93c08c'], [650, 390, 110, -40, '#5c9a6c'],
  [700, 290, 100, -30, '#5c9a6c'], [80, 600, 90, 25, '#2f7352'],
  [210, 660, 100, -15, '#2f7352'], [420, 640, 90, 10, '#2f7352'],
  [600, 660, 100, -20, '#2f7352'], [120, 640, 80, 30, '#1d5641'],
  [370, 670, 90, -10, '#1d5641'], [550, 650, 80, 20, '#1d5641'],
  [190, 40, 70, 180, '#5c9a6c'], [260, 20, 60, 190, '#93c08c'],
  [320, 35, 65, 170, '#5c9a6c'],
];

const Leaves = (): JSX.Element => (
  <div className="leaves">
    <svg viewBox="0 0 708 600" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <ellipse cx="120" cy="640" rx="260" ry="150" fill="#c4dcb6" />
      <ellipse cx="560" cy="660" rx="300" ry="160" fill="#c4dcb6" />
      {LEAVES.map(([x, y, length, angle, color], i) => (
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
  const heldIso = heldPlant && hoveredSlot ? slotIso(hoveredSlot) : null;
  return (
    <div style={{ position: 'relative' }}>
      <Leaves />
      <svg viewBox="0 0 400 398" role="img" aria-label="Isometric balcony with the sun path">
        <IsoSunArc dayNumber={balcony.number} />
        <BalconyShell />
        {balcony.slots
          .filter((slot) => !occupied.has(slot.index) && !(held !== null && hoveredSlot && slot.index === hoveredSlot.index))
          .map((slot) => (
            <IsoSlotTile key={slot.id} slot={slot} onClick={() => onPlantSlot(slot.index)} onHover={onHover} />
          ))}
        {balcony.plants.map((plant) => {
          const slotIndex = placement[plant.index] ?? -1;
          const slot = balcony.slots[slotIndex];
          if (!slot) return null;
          const [x, y, z] = slotIso(slot);
          return (
            <IsoPot
              key={plant.name}
              plant={plant}
              x={x}
              y={y}
              z={z}
              count={bloomsFor(plant, slot)}
              onClick={() => onPlantSlot(slot.index)}
            />
          );
        })}
        {heldPlant && hoveredSlot && heldIso && (() => {
          const [px, py] = project(...heldIso);
          return (
            <g>
              <rect x={px - 26} y={py - 84} width="52" height="84" rx="10" fill="none" stroke={C.pine} strokeWidth="1.5" strokeDasharray="4 3" />
              <IsoPot plant={heldPlant} x={heldIso[0]} y={heldIso[1]} z={heldIso[2] + 0.12} count={preview} ghost />
              {preview > 0 && (
                <g>
                  <rect x={px + 8} y={py - 96} width="30" height="18" rx="5" fill={C.pine} />
                  <text x={px + 23} y={py - 83} fontSize="11" fontWeight="600" fill="#fff" textAnchor="middle">
                    +{preview}
                  </text>
                </g>
              )}
            </g>
          );
        })()}
      </svg>
    </div>
  );
};
