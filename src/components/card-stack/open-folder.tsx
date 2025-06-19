"use client";

import { motion, easeInOut } from "motion/react";
import { useRef } from "react";
import type { CardType } from "./projects";

const FOLDER_ANIMATION_DURATION = 0.4; // Total time for folder to open (0.3s initial + 0.5s open)

const backVariants = {
  initial: { y: 150, rotateY: 0, scale: 1, x: 0 },
  closed: {
    y: 16,
    rotateY: 0,
    scale: 1,
    x: 0,
    transition: { duration: 0.3, ease: easeInOut },
  },
  open: {
    y: 16,
    rotateY: 10,
    scale: 1.01,
    x: 0,
    transition: { duration: 0.4, ease: easeInOut, delay: 0.1 },
  },
  exit: {
    y: 150,
    rotateY: 0,
    scale: 1,
    x: 0,
    transition: { duration: 0.3, ease: easeInOut },
  },
};

const frontVariants = {
  initial: { y: 150, rotateX: 0 },
  closed: {
    y: 40,
    rotateX: 0,
    transition: { duration: 0.3, ease: easeInOut },
  },
  open: {
    y: 40,
    rotateX: -5,
    transition: { duration: 0.5, ease: easeInOut },
  },
  exit: {
    y: 150,
    rotateX: 0,
    transition: { duration: 0.3, ease: easeInOut },
  },
};

// Get initial position within folder with slight overflow
const getInitialPosition = (index: number) => {
  // Make padding responsive to screen size
  const padding = Math.min(100, window.innerWidth * 0.1);
  const screenWidth = window.innerWidth - padding;
  const screenHeight = window.innerHeight - padding;

  // Determine if we're on a mobile device
  const isMobile = window.innerWidth < 768;

  // Adjust quadrant size for mobile
  const quadrantWidth = screenWidth / (isMobile ? 1.5 : 2);
  const quadrantHeight = screenHeight / (isMobile ? 1.5 : 2);

  // On mobile, we'll use a more compact 2x2 grid centered in the middle
  const quadrant = index % 4;

  // Calculate base position with reduced spread on mobile
  const spreadFactor = isMobile ? 0.6 : 1;
  const baseX =
    ((quadrant % 2) * quadrantWidth - screenWidth / 4) * spreadFactor;
  const baseY =
    (Math.floor(quadrant / 2) * quadrantHeight - screenHeight / 3) *
    spreadFactor;

  // Add smaller random variations on mobile
  const variationRange = isMobile ? 10 : 20;
  const xVariation = (Math.random() - 0.5) * variationRange;
  const yVariation = (Math.random() - 0.5) * variationRange;

  return {
    x: baseX + xVariation,
    y: baseY + yVariation,
    rotate: (Math.random() - 0.5) * (isMobile ? 4 : 8), // Reduced rotation on mobile
  };
};

type OpenFolderProps = {
  card: CardType;
  onClose: () => void;
};

export const OpenFolder = ({ card, onClose }: OpenFolderProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contents = card.contents ?? [];

  // Calculate folder position for exit animation
  const isMobile = window.innerWidth < 768;
  const cardWidth = Math.min(400, window.innerWidth * (isMobile ? 0.9 : 0.8));

  // Calculate the exact center position at the bottom of the screen
  const centerX = window.innerWidth / 2 - cardWidth / 2;
  const bottomY = window.innerHeight + 250; // Align with folder bottom

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black/50"
        onClick={onClose}
      />
      <div className="perspective-dramatic pointer-events-none fixed inset-0 z-[51] flex items-center justify-center">
        {/* Back of folder */}
        <motion.div
          variants={backVariants}
          initial="initial"
          animate={["closed", "open"]}
          whileHover="initial"
          exit="exit"
          className="absolute bottom-0 h-[120px] origin-bottom rounded-xl border-2 border-blue-700 bg-blue-300"
          style={{ width: `min(90vw, max(33.333vw, 380px))` }}
        >
          <div className="absolute left-2 top-0 flex -translate-y-full items-center gap-1 rounded-t-lg border-2 border-blue-700 bg-blue-200 px-1">
            <p className="select-none text-lg font-bold text-blue-700">
              {card.title}
            </p>
            <card.Icon size={16} className="text-blue-700" />
          </div>
        </motion.div>
        {/* Draggable items */}
        <motion.div
          ref={containerRef}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="pointer-events-none absolute inset-0"
        >
          <div className="relative h-full w-full">
            {contents.map((item, index) => {
              const initialPosition = getInitialPosition(index);
              return (
                <motion.div
                  key={item.id}
                  drag
                  dragConstraints={containerRef}
                  dragElastic={0.6}
                  dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
                  initial={{
                    scale: 0.95,
                    x: centerX,
                    y: bottomY,
                    rotate: 0,
                  }}
                  animate={{
                    scale: 0.95,
                    x: initialPosition.x + centerX,
                    y: window.innerHeight * 0.38 + initialPosition.y,
                    rotate: initialPosition.rotate,
                    transition: {
                      type: "spring",
                      stiffness: 150,
                      damping: 30,
                      delay: FOLDER_ANIMATION_DURATION + index * 0.08,
                      duration: 1,
                    },
                  }}
                  exit={{
                    scale: 0.95,
                    x: centerX,
                    y: bottomY,
                    rotate: 0,
                    transition: {
                      duration: 0.3,
                      ease: "easeInOut",
                    },
                  }}
                  whileHover={{ scale: 0.98 }}
                  whileDrag={{
                    scale: 1.02,
                    rotate: 0,
                    transition: { duration: 0.2 },
                  }}
                  className="pointer-events-auto absolute cursor-grab rounded-lg border-2 border-blue-700 bg-white p-4 active:cursor-grabbing"
                  style={{
                    width: "min(400px, 80vw)",
                  }}
                >
                  {item.content}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
        {/* Front of folder */}
        <motion.div
          variants={frontVariants}
          initial="initial"
          animate={["closed", "open"]}
          whileHover="initial"
          exit="exit"
          className="absolute bottom-0 h-[120px] origin-bottom rounded-xl border-2 border-blue-700 bg-blue-200 shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]"
          style={{ width: `min(90vw, max(33.333vw, 380px))` }}
        >
          <div className="relative h-full w-full p-3"></div>
        </motion.div>
      </div>
    </>
  );
};
