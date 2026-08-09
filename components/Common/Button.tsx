"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";
import clsx from "clsx";
import { buttonHover, buttonTap } from "@/animations/hover";

interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  variant?: "primary" | "secondary" | "ghost";
  size?: "md" | "lg";
  icon?: ReactNode;
  iconPosition?: "left" | "right";
  disabled?: boolean;
  type?: "button" | "submit";
  className?: string;
  "aria-label"?: string;
}

export function Button({
  children,
  onClick,
  variant = "primary",
  size = "md",
  icon,
  iconPosition = "right",
  disabled,
  type = "button",
  className,
  ...rest
}: ButtonProps) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-btn font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/50 disabled:opacity-50 disabled:pointer-events-none";

  const variants: Record<string, string> = {
    primary: "bg-accent text-white shadow-card hover:bg-[#F0592A]",
    secondary: "bg-white text-ink border border-ink/10 shadow-soft hover:border-ink/20",
    ghost: "bg-transparent text-ink hover:bg-ink/[0.04]",
  };

  const sizes: Record<string, string> = {
    md: "px-6 py-3 text-[15px]",
    lg: "px-8 py-4 text-[17px]",
  };

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      whileHover={disabled ? undefined : buttonHover}
      whileTap={disabled ? undefined : buttonTap}
      className={clsx(base, variants[variant], sizes[size], className)}
      {...rest}
    >
      {icon && iconPosition === "left" && icon}
      {children}
      {icon && iconPosition === "right" && icon}
    </motion.button>
  );
}
