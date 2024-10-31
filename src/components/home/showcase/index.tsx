"use client";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import FullscreenColumn from "../fullscreen-column";
import { DURATION } from "./consts";
import Fillaneed from "./items/fillaneed";
import Dither from "./items/dither";
import { AnimatePresence } from "framer-motion";
import ShowcaseSlider from "./slider";
import { motion } from "framer-motion";

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

  const resetInterval = useCallback(() => {
    if (!isPlaying) {
      return;
    }

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setCurrentItem((currentItem + 1) % items.length);
    }, DURATION);
  }, [currentItem, isPlaying]);

  const handleNextSlide = useCallback(() => {
    setDirection(1);
    setCurrentItem((currentItem + 1 + items.length) % items.length);
  }, [currentItem]);

  const handlePreviousSlide = useCallback(() => {
    setDirection(-1);
    setCurrentItem((currentItem + items.length - 1) % items.length);
  }, [currentItem]);

  const content = useMemo(() => {
    return items[currentItem];
  }, [currentItem]);

  const togglePlay = useCallback(() => {
    setIsPlaying((isPlaying) => !isPlaying);
  }, []);

  return (
    <FullscreenColumn className="relative w-full overflow-hidden rounded-3xl">
      <motion.div
        className="h-full w-full"
        initial={{ opacity: 0, filter: "blur(4px)" }}
        animate={{ opacity: 1, filter: "blur(0px)" }}
        transition={{ duration: 0.6, delay: 0.8, ease: "linear" }}
      >
        <AnimatePresence custom={direction} initial={false} mode="popLayout">
          <ShowcaseSlider
            onHover={stopInterval}
            onMouseLeave={resetInterval}
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
      </motion.div>
    </FullscreenColumn>
  );
};

export default Showcase;
