"use client";

import { motion, easeInOut, useAnimate } from "motion/react";
import type { RefObject } from "react";

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
  const variationRange = isMobile ? 40 : 80;
  const xVariation = (Math.random() - 0.5) * variationRange;
  const yVariation = (Math.random() - 0.5) * variationRange * 3;

  return {
    x: baseX + xVariation,
    y: baseY + yVariation,
    rotate: (Math.random() - 0.5) * (isMobile ? 8 : 12), // Reduced rotation on mobile
  };
};

type DraggableItemProps = {
  children: React.ReactNode;
  index: number;
  containerRef: RefObject<HTMLDivElement>;
  centerX: number;
  bottomY: number;
};

export const DraggableItem = ({
  children,
  index,
  containerRef,
  centerX,
  bottomY,
}: DraggableItemProps) => {
  const [scope, animate] = useAnimate();
  const initialPosition = getInitialPosition(index);
  const itemVariants = {
    hidden: {
      scale: 0.95,
      x: centerX,
      y: bottomY,
      rotate: 0,
      transition: {
        duration: 0.3,
        ease: easeInOut,
      },
    },
    visible: {
      scale: 0.95,
      x: initialPosition.x + centerX,
      y: window.innerHeight * 0.38 + initialPosition.y,
      rotate: initialPosition.rotate,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 30,
        duration: 1,
      },
    },
  } as const;

  return (
    <motion.div
      ref={scope}
      onClick={() => {
        animate(
          scope.current,
          {
            x: centerX,
            y: bottomY,
          },
          {
            duration: 0.3,
            ease: easeInOut,
          },
        );
      }}
      variants={itemVariants}
      drag
      dragConstraints={containerRef}
      dragElastic={0.6}
      dragTransition={{ bounceStiffness: 300, bounceDamping: 20 }}
      whileHover={{ scale: 0.98, transition: { duration: 0.1 } }}
      whileDrag={{
        scale: 1.02,
        rotate: 0,
        transition: { duration: 0.2 },
      }}
      className="pointer-events-auto absolute cursor-grab active:cursor-grabbing"
    >
      {children}
    </motion.div>
  );
};
