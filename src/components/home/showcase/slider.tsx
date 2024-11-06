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

const swipeConfidenceThreshold = 10000;
const swipePower = (offset: number, velocity: number) => {
  return Math.abs(offset) * velocity;
};

const ShowcaseSlider = forwardRef<HTMLDivElement, ShowcaseItemProps>(
  (
    {
      children,
      onHover,
      onMouseLeave,
      direction,
      handleNextSlide,
      handlePreviousSlide,
    },
    ref,
  ) => {
    return (
      <motion.div
        ref={ref}
        className="h-full w-full p-4 sm:p-8 lg:p-0"
        initial="initial"
        animate="animate"
        exit="exit"
        custom={direction}
        variants={variants}
        transition={{ duration: 0.8, type: "spring", bounce: 0 }}
        onMouseEnter={onHover}
        onMouseLeave={onMouseLeave}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={1}
        drag="x"
        onDragEnd={(e, { offset, velocity }) => {
          const swipe = swipePower(offset.x, velocity.x);

          if (swipe < -swipeConfidenceThreshold) {
            handleNextSlide();
          } else if (swipe > swipeConfidenceThreshold) {
            handlePreviousSlide();
          }
        }}
      >
        <div className="relative h-full w-full overflow-x-hidden overflow-y-visible rounded-3xl">
          {children}
        </div>
      </motion.div>
    );
  },
);

ShowcaseSlider.displayName = "ShowcaseItem";

export default ShowcaseSlider;
