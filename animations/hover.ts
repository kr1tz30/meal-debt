export const cardHover = {
  y: -6,
  scale: 1.02,
  rotate: -0.5,
  transition: { type: "spring" as const, stiffness: 300, damping: 20 },
};

export const cardTap = {
  scale: 0.98,
  transition: { duration: 0.1 },
};

export const buttonHover = {
  y: -2,
  transition: { type: "spring" as const, stiffness: 400, damping: 18 },
};

export const buttonTap = {
  scale: 0.96,
  transition: { duration: 0.1 },
};

export const floatIdle = {
  y: [0, -10, 0],
  rotate: [0, 1.5, 0],
  transition: { duration: 5, repeat: Infinity, ease: "easeInOut" as const },
};
