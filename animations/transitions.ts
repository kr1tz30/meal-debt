import { Variants } from "framer-motion";

export const spring = { type: "spring", stiffness: 260, damping: 24 } as const;
export const softSpring = { type: "spring", stiffness: 180, damping: 22 } as const;

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
};

export const slideUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
};

export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.92 },
  visible: { opacity: 1, scale: 1, transition: spring },
};

export const springReveal: Variants = {
  hidden: { opacity: 0, y: 40, scale: 0.9, rotate: -2 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    rotate: 0,
    transition: { ...spring, delay: i * 0.08 },
  }),
};

export const cardExplosion: Variants = {
  hidden: { opacity: 0, scale: 0.4, x: 0, y: 0 },
  visible: (custom: { angle: number; delay: number }) => ({
    opacity: 1,
    scale: 1,
    x: 0,
    y: 0,
    transition: { ...spring, delay: custom.delay },
  }),
};

export const staggerContainer: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};
