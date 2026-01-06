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

const Card = ({ card, index, numCards, style, isOpen: _isOpen, onOpen }: CardProps) => {
  const isMobile = useIsMobile();
  const isDesktop = !isMobile;
  const [isHovered, setIsHovered] = useState(false);
  const centerY = "-50%";
  const rightOffset = index * 20; // px
  const upOffset = index * -16; // px

  // Helper to build translateY and translateX
  const getTranslateY = (base: string, offset = 0) =>
    `translateY(calc(${base} + ${index > 0 ? `${index * -20 + offset + upOffset}px` : `${offset + upOffset}px`}))`;
  const getTranslateX = () => `translateX(calc(-50% + ${rightOffset}px))`;

  // Initial, Animate, and Hover transforms
  const initialTransform = `${getTranslateY(centerY)} ${getTranslateX()}`;
  const hoverTransform =
    index > 0
      ? getTranslateY(centerY, -12) + ` ${getTranslateX()} `
      : initialTransform;

  const contents = card.contents ?? [];

  const cardContent = (
    <motion.div
      key={card.id}
      onMouseEnter={() => isDesktop && setIsHovered(true)}
      onMouseLeave={() => isDesktop && setIsHovered(false)}
      style={style}
      initial={{
        left: "50%",
        top: "50%",
        transform: initialTransform,
        zIndex: numCards - index,
      }}
      animate={{
        left: "50%",
        transform: isHovered ? hoverTransform : initialTransform,
        zIndex: numCards - index,
        scale: isHovered ? 1.02 : 1,
      }}
      whileTap={{
        scale: 1.02,
        transform: hoverTransform,
      }}
      transition={{
        type: "spring",
        stiffness: 300,
        damping: 30,
        duration: 0.3,
      }}
      className="perspective-dramatic absolute aspect-[4/3] h-auto w-4/5 max-w-[450px] cursor-pointer touch-none overflow-visible"
    >
        {/* Back of folder */}
        <div className="absolute inset-0 translate-x-[4px] translate-y-[-4px] rounded-xl border-2 border-blue-700 bg-blue-300">
          <div
            style={{
              left: "8px",
            }}
            className="absolute top-px flex -translate-y-full items-center gap-1 rounded-t-lg border-2 border-b-0 border-blue-700 bg-blue-300 px-2"
          >
            <p className="select-none text-lg font-bold text-blue-700">
              {card.title}
            </p>
            <card.Icon size={16} className="text-blue-700" />
          </div>
        </div>
        {/* Arc items - rendered BETWEEN back and front so front covers bottom half */}
        {isDesktop && (
          <div 
            className="pointer-events-none absolute z-[1] top-0"
            style={{ left: "calc(50% + 2px)", transform: "translateX(-50%)" }} // +2px to center with folder visual (back has translate-x-[4px])
          >
            {contents.map((item, itemIndex) => {
              const pos = getArcPosition(itemIndex, contents.length);
              return (
                <motion.div
                  key={item.id}
                  className="absolute"
                  style={{
                    left: 0,
                    top: 0,
                  }}
                  initial={false}
                  animate={
                    isHovered
                      ? {
                          x: `calc(-50% + ${pos.x}px)`,
                          y: pos.y,
                          opacity: 1,
                          rotate: pos.rotate,
                        }
                      : {
                          x: "-50%",
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
              );
            })}
          </div>
        )}
        {/* Front of folder - rendered after items so it covers their bottom half */}
        <div className="relative z-[2] h-full w-full rounded-xl border-2 border-blue-700 bg-blue-200">
          <div className="relative flex h-full w-full p-4"></div>
        </div>
        {index === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="pointer-events-none absolute left-1/2 top-full -translate-x-1/2 translate-y-4 text-center text-lg font-medium text-gray-400"
          >
            {isMobile ? "Tap a folder to open" : "Hover to preview, click to visit"}
          </motion.p>
        )}
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
