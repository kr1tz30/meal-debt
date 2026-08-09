"use client";

const POTS = [
  { x: 90, size: 34, drop: 18 },
  { x: 230, size: 26, drop: 30 },
  { x: 360, size: 40, drop: 14 },
  { x: 520, size: 28, drop: 26 },
  { x: 680, size: 36, drop: 16 },
  { x: 840, size: 24, drop: 32 },
  { x: 980, size: 38, drop: 12 },
  { x: 1130, size: 28, drop: 24 },
  { x: 1280, size: 34, drop: 18 },
];

const LIGHTS = Array.from({ length: 18 }, (_, i) => ({
  x: 40 + i * 82,
  y: Math.round((40 + Math.sin(i * 0.9) * 14) * 100) / 100,
  delay: (i % 5) * 0.5,
}));

interface KitchenInteriorProps {
  className?: string;
  floorHeightClass?: string;
  children?: React.ReactNode;
}

export function KitchenInterior({
  className = "",
  floorHeightClass = "h-[34%]",
  children,
}: KitchenInteriorProps) {
  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #241309 0%, #3A2113 55%, #4A2A16 100%)",
        }}
      />

      <svg viewBox="0 0 1440 200" preserveAspectRatio="none" className="absolute top-0 left-0 w-full h-[42%]" aria-hidden>
        <path d="M0,10 Q720,60 1440,10" stroke="#6B4A2E" strokeWidth="3" fill="none" />
        {LIGHTS.map((l, i) => (
          <circle
            key={i}
            cx={l.x}
            cy={l.y}
            r={4}
            fill="#FFDA8C"
            className="animate-twinkle"
            style={{ animationDelay: `${l.delay}s` }}
          />
        ))}

        {POTS.map((p, i) => (
          <g key={i}>
            <line x1={p.x} y1={10} x2={p.x} y2={10 + p.drop} stroke="#3A2113" strokeWidth={2} />
            <circle cx={p.x} cy={22 + p.drop} r={p.size / 2} fill="#B8703E" stroke="#7A4A28" strokeWidth={2} />
            <rect x={p.x - p.size / 2 - 6} y={20 + p.drop} width={8} height={4} rx={2} fill="#7A4A28" />
          </g>
        ))}
      </svg>

      <div className={`checker-floor absolute bottom-0 left-0 w-full ${floorHeightClass}`} />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 50% at 50% 55%, rgba(255,190,120,0.16) 0%, rgba(0,0,0,0) 70%)",
        }}
      />

      {children && <div className="relative z-10 w-full h-full">{children}</div>}
    </div>
  );
}
