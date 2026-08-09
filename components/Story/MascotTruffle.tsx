"use client";

import { motion } from "framer-motion";

interface MascotTruffleProps {
  size?: number;
  waving?: boolean;
  className?: string;
}

export function MascotTruffle({ size = 180, waving = true, className = "" }: MascotTruffleProps) {
  return (
    <motion.div
      className={className}
      style={{ width: size, height: size }}
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 200 220" width={size} height={size}>
        {/* tail */}
        <path
          d="M136,168 Q170,172 166,138 Q163,116 146,118"
          stroke="#C9972E"
          strokeWidth="5"
          fill="none"
          strokeLinecap="round"
        />

        {/* feet */}
        <ellipse cx="82" cy="197" rx="15" ry="8" fill="#C9A876" />
        <ellipse cx="118" cy="197" rx="15" ry="8" fill="#C9A876" />

        {/* resting arm (behind body) */}
        <path
          d="M64,138 Q46,150 48,172"
          stroke="#E6C99A"
          strokeWidth="13"
          fill="none"
          strokeLinecap="round"
        />
        <circle cx="48" cy="176" r="8" fill="#EAD1A3" />

        {/* body */}
        <ellipse cx="100" cy="152" rx="44" ry="45" fill="#E6C99A" />

        {/* apron bib */}
        <path
          d="M78,120 Q100,113 122,120 L128,124 L118,186 Q100,193 82,186 L72,124 Z"
          fill="#A3382B"
        />
        <path d="M86,120 Q100,150 114,120" stroke="#8C2C21" strokeWidth="1.5" fill="none" opacity={0.5} />
        <rect x="88" y="160" width="24" height="17" rx="3" fill="#8C2C21" opacity={0.85} />
        {/* neck strap */}
        <path d="M84,120 Q100,104 116,120" stroke="#A3382B" strokeWidth="7" fill="none" strokeLinecap="round" />

        {/* waving arm (in front) */}
        <motion.g
          style={{ transformOrigin: "138px 136px" }}
          animate={waving ? { rotate: [0, 24, 4, 24, 0] } : { rotate: 4 }}
          transition={{ duration: 1.6, repeat: waving ? Infinity : 0, repeatDelay: 1.2 }}
        >
          <path
            d="M138,136 Q160,128 166,102"
            stroke="#E6C99A"
            strokeWidth="13"
            fill="none"
            strokeLinecap="round"
          />
          <circle cx="167" cy="97" r="9" fill="#EAD1A3" />
        </motion.g>

        {/* ears (behind head) */}
        <circle cx="66" cy="46" r="19" fill="#D9B98A" />
        <circle cx="134" cy="46" r="19" fill="#D9B98A" />
        <circle cx="66" cy="46" r="10" fill="#F1DCC4" />
        <circle cx="134" cy="46" r="10" fill="#F1DCC4" />

        {/* head */}
        <circle cx="100" cy="80" r="41" fill="#EAD1A3" />

        {/* whiskers */}
        <g stroke="#B8703E" strokeWidth="1.6" strokeLinecap="round">
          <path d="M84,93 L60,88" />
          <path d="M84,99 L60,100" />
          <path d="M116,93 L140,88" />
          <path d="M116,99 L140,100" />
        </g>

        {/* snout */}
        <ellipse cx="100" cy="96" rx="17" ry="13" fill="#F6E7CC" />
        <ellipse cx="100" cy="88" rx="4.5" ry="3.5" fill="#5B3A22" />
        <path d="M92,101 Q100,107 108,101" stroke="#5B3A22" strokeWidth="2" fill="none" strokeLinecap="round" />

        {/* eyes (blink) */}
        <motion.g
          animate={{ scaleY: [1, 1, 0.1, 1, 1] }}
          transition={{ duration: 3.2, repeat: Infinity, times: [0, 0.9, 0.94, 0.98, 1] }}
          style={{ transformOrigin: "100px 74px" }}
        >
          <circle cx="82" cy="74" r="6" fill="#2C1B10" />
          <circle cx="118" cy="74" r="6" fill="#2C1B10" />
          <circle cx="84" cy="72" r="1.8" fill="white" />
          <circle cx="120" cy="72" r="1.8" fill="white" />
        </motion.g>

        {/* chef hat */}
        <rect x="66" y="36" width="68" height="15" rx="7.5" fill="#FFFDF8" stroke="#E9DCC0" strokeWidth="1.5" />
        <circle cx="78" cy="30" r="16" fill="#FFFDF8" stroke="#E9DCC0" strokeWidth="1.5" />
        <circle cx="100" cy="22" r="19" fill="#FFFDF8" stroke="#E9DCC0" strokeWidth="1.5" />
        <circle cx="123" cy="30" r="16" fill="#FFFDF8" stroke="#E9DCC0" strokeWidth="1.5" />
      </svg>
    </motion.div>
  );
}
