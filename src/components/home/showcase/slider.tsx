"use client";
import React, { forwardRef } from "react";
import { motion } from "framer-motion";

type ShowcaseItemProps = {
  children: React.ReactNode;
  onHover?: () => void;
  onMouseLeave?: () => void;
  direction: number;
  handleNextSlide: () => void;
  handlePreviousSlide: () => void;
  isPlaying: boolean;
  togglePlay: () => void;
};

const variants = {
  initial: (direction: number) => ({
    opacity: 0,
    x: `${direction * 110}%`,
    filter: "blur(4px)",
  }),
  animate: {
    opacity: 1,
    x: 0,
    filter: "blur(0px)",
  },
  exit: (direction: number) => ({
    opacity: 0,
    x: `${direction * -110}%`,
    filter: "blur(4px)",
  }),
};

const ShowcaseSlider = forwardRef<HTMLDivElement, ShowcaseItemProps>(
  ({ children, onHover, onMouseLeave, direction }, ref) => {
    return (
      <motion.div
        ref={ref}
        className="relative h-full w-full overflow-x-hidden overflow-y-visible rounded-3xl shadow-xl"
        initial="initial"
        animate="animate"
        exit="exit"
        custom={direction}
        variants={variants}
        transition={{ duration: 0.8, type: "spring", bounce: 0 }}
        onMouseEnter={onHover}
        onMouseLeave={onMouseLeave}
      >
        {children}
      </motion.div>
    );
  },
);

ShowcaseSlider.displayName = "ShowcaseItem";

export default ShowcaseSlider;
