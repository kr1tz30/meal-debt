import { useEffect, useRef, useState } from "react";
import { animate } from "framer-motion";

export function useCounter(target: number, duration = 1.2, decimals = 0): number {
  const [value, setValue] = useState(0);
  const prevTarget = useRef(0);

  useEffect(() => {
    const controls = animate(prevTarget.current, target, {
      duration,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setValue(Number(v.toFixed(decimals))),
    });
    prevTarget.current = target;
    return () => controls.stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, duration, decimals]);

  return value;
}
