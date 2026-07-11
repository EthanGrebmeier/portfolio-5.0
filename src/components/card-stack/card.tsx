"use client";

import React, { useState } from "react";
import { motion } from "motion/react";
import type { CardType } from ".";
import { useIsMobile } from "~/hooks/useMediaQuery";
import Link from "next/link";

type CardProps = {
  card: CardType;
  index: number;
  numCards: number;
  style?: React.CSSProperties;
  isOpen?: boolean;
  onOpen?: () => void;
};

// Calculate arc position for an item - spread horizontally, peeking ~50% out of top
const getArcPosition = (itemIndex: number, totalItems: number) => {
  // Horizontal spread centered above folder - negative x is left, positive x is right
  const spreadWidth = 220;
  const xOffset = totalItems > 1 
    ? (itemIndex / (totalItems - 1)) * spreadWidth - spreadWidth / 2
    : 0;
  
  // Slight arc curve - items in middle peek up slightly more
  const normalizedIndex = totalItems > 1 ? itemIndex / (totalItems - 1) : 0.5;
  const arcHeight = Math.sin(normalizedIndex * Math.PI) * 4;
  
  return {
    x: xOffset,
    y: -150 - arcHeight, // ~50% of a scaled item peeking out
    rotate: (itemIndex - (totalItems - 1) / 2) * 3,
  };
};

const Card = ({
  card,
  index,
  numCards,
  style,
  isOpen: _isOpen,
  onOpen,
}: CardProps) => {
  const isMobile = useIsMobile();
  const isDesktop = !isMobile;
  const [isHovered, setIsHovered] = useState(false);
  const distanceFromCenter = index - (numCards - 1) / 2;
  const horizontalStep = isMobile ? 12 : 20;
  const verticalStep = isMobile ? 24 : 36;
  const xOffset = distanceFromCenter * horizontalStep;
  const yOffset = distanceFromCenter * -verticalStep;
  const getTransform = (lift = 0) =>
    `translate(calc(-50% + ${xOffset}px), calc(-50% + ${yOffset + lift}px))`;
  const initialTransform = getTransform();
  const hoverTransform = getTransform(-12);

  const contents = card.contents ?? [];

  const folderScale = isHovered ? 1.02 : 1;

  const cardContent = (
    <motion.div
      key={card.id}
      onMouseEnter={() => isDesktop && setIsHovered(true)}
      onMouseLeave={() => isDesktop && setIsHovered(false)}
      style={style}
      initial={{
        transform: initialTransform,
        zIndex: numCards - index,
      }}
      animate={{
        transform: isHovered ? hoverTransform : initialTransform,
        zIndex: numCards - index,
      }}
      whileTap={{
        transform: hoverTransform,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.3,
      }}
      className="absolute left-1/2 top-1/2 aspect-[4/3] h-auto w-[calc(100%-2.5rem)] max-w-[360px] cursor-pointer touch-none overflow-visible md:w-full md:max-w-[420px]"
    >
        {/* Back of folder — scale only the faces so pop-out images stay crisp */}
        <div className="absolute inset-0 translate-x-[3px] translate-y-[-3px]">
          <motion.div
            className="absolute inset-0 origin-center rounded-xl border border-blue-500 bg-blue-400"
            animate={{ scale: folderScale }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div
              style={{
                left: "8px",
              }}
              className="absolute top-0.5 flex -translate-y-full items-center gap-1 rounded-t-lg border border-b-2 border-blue-400 bg-blue-300 px-2"
            >
              <p className="select-none text-lg font-medium text-blue-700">
                {card.title}
              </p>
            </div>
          </motion.div>
        </div>
        {/* Arc items - rendered BETWEEN back and front so front covers bottom half */}
        {isDesktop && (
          <div 
            className="pointer-events-none absolute z-[1] top-0"
            style={{ left: "calc(50% + 2px)" }} // +2px to center with folder visual (back has translate-x-[3px])
          >
            {contents.map((item, itemIndex) => {
              const pos = getArcPosition(itemIndex, contents.length);
              return (
                // Static centering wrapper so Motion only animates pixel x/y (avoids subpixel blur from % calc)
                <div
                  key={item.id}
                  className="absolute left-0 top-0 -translate-x-1/2"
                >
                  <motion.div
                    className="[backface-visibility:hidden] will-change-transform"
                    initial={false}
                    animate={
                      isHovered
                        ? {
                            x: pos.x,
                            y: pos.y,
                            opacity: 1,
                            rotate: pos.rotate,
                          }
                        : {
                            x: 0,
                            y: 60,
                            opacity: 0,
                            rotate: 0,
                          }
                    }
                    transition={{
                      type: "spring",
                      stiffness: 200,
                      damping: 20,
                      delay: isHovered ? itemIndex * 0.04 : 0,
                    }}
                  >
                    <div className="min-w-max">
                      {item.content}
                    </div>
                  </motion.div>
                </div>
              );
            })}
          </div>
        )}
        {/* Front of folder - rendered after items so it covers their bottom half */}
        <motion.div
          className="relative z-[2] h-full w-full origin-center rounded-xl border border-blue-400 bg-blue-300 shadow-sm"
          animate={{ scale: folderScale }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
        </motion.div>

    </motion.div>
  );

  if (isMobile) {
    return (
      <button
        type="button"
        onClick={onOpen}
        className="contents"
      >
        {cardContent}
      </button>
    );
  }

  return (
    <Link
      href={card.link.href}
      className="contents"
    >
      {cardContent}
    </Link>
  );
};

export default Card;
