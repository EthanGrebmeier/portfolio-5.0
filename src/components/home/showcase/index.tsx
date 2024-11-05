"use client";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { DURATION } from "./consts";
import Fillaneed from "./items/fillaneed";
import Dither from "./items/dither";
import { AnimatePresence } from "framer-motion";
import ShowcaseSlider from "./slider";
import { motion } from "framer-motion";
import Controls from "./controls";

const items = [<Fillaneed key="fillaneed" />, <Dither key="dither" />];

const Showcase = () => {
  const [currentItem, setCurrentItem] = React.useState(0);
  const [direction, setDirection] = React.useState(1);
  const [isPlaying, setIsPlaying] = React.useState(true);

  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!isPlaying) {
      return;
    }
    intervalRef.current = setInterval(() => {
      setCurrentItem((currentItem + 1) % items.length);
    }, DURATION);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [currentItem, isPlaying]);

  const stopInterval = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  }, []);

  const onMouseLeave = useCallback(() => {
    if (!isPlaying) {
      return;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setDirection(1);
      setCurrentItem(currentItem + 1);
    }, DURATION);
  }, [currentItem, isPlaying]);

  const handleNextSlide = useCallback(() => {
    setDirection(1);
    setCurrentItem(currentItem + 1);
  }, [currentItem]);

  const handlePreviousSlide = useCallback(() => {
    setDirection(-1);
    setCurrentItem(currentItem - 1);
  }, [currentItem]);

  const togglePlay = useCallback(() => {
    setIsPlaying((isPlaying) => !isPlaying);
  }, []);

  const absolutePage = useMemo(() => {
    return (currentItem + items.length) % items.length;
  }, [currentItem]);

  const content = useMemo(() => {
    return items[Math.abs(absolutePage)];
  }, [absolutePage]);
  return (
    <motion.div
      className="w-full flex-1 overflow-hidden rounded-3xl"
      initial={{ opacity: 0, filter: "blur(4px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      onMouseEnter={stopInterval}
      onMouseLeave={onMouseLeave}
      transition={{ duration: 0.6, delay: 1.4, ease: "linear" }}
    >
      <AnimatePresence mode="popLayout" custom={direction} initial={false}>
        <ShowcaseSlider
          key={currentItem}
          direction={direction}
          handleNextSlide={handleNextSlide}
          handlePreviousSlide={handlePreviousSlide}
          isPlaying={isPlaying}
          togglePlay={togglePlay}
        >
          {content}
        </ShowcaseSlider>
      </AnimatePresence>
      <Controls
        handleNextSlide={handleNextSlide}
        handlePreviousSlide={handlePreviousSlide}
        isPlaying={isPlaying}
        togglePlay={togglePlay}
      />
    </motion.div>
  );
};

export default Showcase;
