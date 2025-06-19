"use client";
import { motion, type Variants } from "motion/react";
import { type ReactNode } from "react";

import { cn } from "~/lib/utils";

interface TactileButtonProps {
  onClick?: () => void;
  children: string;
  icon?: ReactNode;
  className?: string;
  buttonClassName?: string;
  disabled?: boolean;
}

const TactileButton = ({
  onClick,
  children,
  icon,
  disabled,
  className = "bg-blue-500",
  buttonClassName,
}: TactileButtonProps) => {
  const buttonVariants: Variants = {
    initial: {
      y: -10,
    },
    hover: {
      y: -5,
    },
    tap: {
      y: 0,
    },
  };
  return (
    <button
      className={cn(`mb-2 w-fit rounded-full bg-black p-0`, buttonClassName)}
      onClick={onClick}
      disabled={disabled}
    >
      <motion.div
        initial="initial"
        whileHover="hover"
        whileTap="tap"
        variants={buttonVariants}
        className={cn(
          "flex w-fit items-center gap-4 rounded-l-full rounded-r-full border-4 border-black px-4 py-1",
          className,
        )}
      >
        {children}
        {icon ? icon : null}
      </motion.div>
    </button>
  );
};

export default TactileButton;
