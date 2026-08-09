"use client";

import { motion } from "framer-motion";

interface Building {
  x: number;
  width: number;
  height: number;
  mansard?: boolean;
  chimney?: boolean;
}

const BACK_ROW: Building[] = [
  { x: -40, width: 160, height: 210 },
  { x: 100, width: 120, height: 160, mansard: true },
  { x: 210, width: 150, height: 240 },
  { x: 350, width: 110, height: 180, mansard: true },
  { x: 450, width: 170, height: 260 },
  { x: 610, width: 130, height: 190 },
  { x: 730, width: 160, height: 230, mansard: true },
  { x: 880, width: 120, height: 170 },
  { x: 990, width: 150, height: 250 },
  { x: 1130, width: 140, height: 195, mansard: true },
  { x: 1260, width: 170, height: 235 },
  { x: 1400, width: 120, height: 175 },
];

const FRONT_ROW: Building[] = [
  { x: -30, width: 190, height: 130, mansard: true, chimney: true },
  { x: 150, width: 140, height: 95 },
  { x: 280, width: 170, height: 150, mansard: true, chimney: true },
  { x: 430, width: 130, height: 105 },
  { x: 550, width: 190, height: 140, mansard: true },
  { x: 720, width: 150, height: 100, chimney: true },
  { x: 850, width: 200, height: 160, mansard: true, chimney: true },
  { x: 1030, width: 140, height: 110 },
  { x: 1150, width: 180, height: 145, mansard: true, chimney: true },
  { x: 1310, width: 160, height: 115 },
];

const STARS = Array.from({ length: 24 }, (_, i) => ({
  cx: (i * 137) % 1440,
  cy: (i * 61) % 230,
  r: 1 + (i % 3),
  delay: (i % 6) * 0.4,
}));

function BuildingShape({ b, color, y }: { b: Building; color: string; y: number }) {
  const top = y - b.height;
  const roofH = b.mansard ? 22 : 0;
  return (
    <g>
      <rect x={b.x} y={top + roofH} width={b.width} height={b.height - roofH} fill={color} />
      {b.mansard && (
        <polygon
          points={`${b.x - 6},${top + roofH} ${b.x + b.width + 6},${top + roofH} ${b.x + b.width - 14},${top} ${b.x + 14},${top}`}
          fill={color}
        />
      )}
      {b.chimney && (
        <rect x={b.x + b.width * 0.72} y={top - 22} width={12} height={26} fill={color} />
      )}
    </g>
  );
}

export function ParisRooftopScene({ className = "" }: { className?: string }) {
  return (
    <div className={`dusk-sky relative w-full h-full overflow-hidden ${className}`}>
      <svg
        viewBox="0 0 1440 640"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 w-full h-full"
        aria-hidden
      >
        {STARS.map((s, i) => (
          <circle
            key={i}
            cx={s.cx}
            cy={s.cy}
            r={s.r}
            fill="#FFF3D6"
            className="animate-twinkle"
            style={{ animationDelay: `${s.delay}s` }}
          />
        ))}

        <motion.g
          initial={{ x: -12, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
        >
          <path
            d="M 210,150 Q 225,145 240,150 L 236,158 Q 225,154 214,158 Z"
            fill="#1A1310"
            opacity={0.7}
          />
          <path
            d="M 320,190 Q 335,185 350,190 L 346,198 Q 335,194 324,198 Z"
            fill="#1A1310"
            opacity={0.55}
          />
        </motion.g>

        {/* Eiffel Tower silhouette */}
        <path
          d="M980,640 L1005,480 L1020,480 L1000,380 L1013,380 L998,300 L1010,300 L996,230
             L1006,230 L1000,190 L994,230 L1004,230 L990,300 L1002,300 L987,380 L1000,380
             L980,480 L995,480 L1020,640 Z"
          fill="#1A1310"
        />
        <rect x="997" y="182" width="6" height="14" fill="#1A1310" />
        <circle cx="1000" cy="180" r="3.5" fill="#FFDFA0" className="animate-flicker" />

        {BACK_ROW.map((b, i) => (
          <BuildingShape key={`back-${i}`} b={b} color="#4A3A5C" y={520} />
        ))}

        {BACK_ROW.flatMap((b, i) =>
          [0.3, 0.6].map((f, j) => (
            <rect
              key={`bw-${i}-${j}`}
              x={b.x + b.width * f}
              y={520 - b.height * 0.5}
              width={7}
              height={9}
              fill="#7A6B95"
              opacity={0.5}
            />
          ))
        )}

        {FRONT_ROW.map((b, i) => (
          <BuildingShape key={`front-${i}`} b={b} color="#1A1310" y={640} />
        ))}

        {FRONT_ROW.flatMap((b, i) =>
          [0.22, 0.5, 0.78].map((f, j) => {
            const flicker = (i + j) % 4 === 0;
            return (
              <rect
                key={`fw-${i}-${j}`}
                x={b.x + b.width * f}
                y={640 - b.height * 0.55}
                width={9}
                height={12}
                rx={1}
                fill="#FFD98A"
                className={flicker ? "animate-flicker" : ""}
                style={{ animationDelay: `${(i * 0.3 + j * 0.5) % 3}s` }}
              />
            );
          })
        )}
      </svg>
    </div>
  );
}
