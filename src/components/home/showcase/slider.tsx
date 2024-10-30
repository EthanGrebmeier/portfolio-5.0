"use client";
import React, { forwardRef } from "react";
import { motion } from "framer-motion";
import ButtonIcon from "~/components/button-icon";
import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";

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
  (
    {
      children,
      onHover,
      onMouseLeave,
      direction,
      handleNextSlide,
      handlePreviousSlide,
      isPlaying,
      togglePlay,
    },
    ref,
  ) => {
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
        // onPan={(e, info) => {
        //   if (info.delta.x > 0) {
        //     handlePreviousSlide();
        //   } else if (info.delta.x < 0) {
        //     handleNextSlide();
        //   }
        // }}
      >
        {children}
        <div className="absolute bottom-4 left-4 z-10 flex gap-2 text-4xl text-white sm:bottom-8 sm:left-8">
          <ButtonIcon Icon={ArrowLeft} onClick={handlePreviousSlide} />
          <ButtonIcon
            Icon={Pause}
            IconTwo={Play}
            showIconTwo={!isPlaying}
            onClick={togglePlay}
          />
          <ButtonIcon Icon={ArrowRight} onClick={handleNextSlide}>
            next
          </ButtonIcon>
        </div>
      </motion.div>
    );
  },
);

ShowcaseSlider.displayName = "ShowcaseItem";

export default ShowcaseSlider;
