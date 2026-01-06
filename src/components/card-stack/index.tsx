"use client";
import { motion, AnimatePresence } from "motion/react";
import { useState } from "react";
import Card from "./card";
import { type LucideProps } from "lucide-react";
import { cards } from "./projects";
import { OpenFolder } from "./open-folder";
import { useIsMobile } from "~/hooks/useMediaQuery";

export type CardContentItem = {
  id: string;
  content: React.ReactNode;
};

export type CardType = {
  id: number;
  title: string;
  description: string;
  Icon: (props: LucideProps) => React.ReactNode;
  style?: React.CSSProperties;
  contents?: CardContentItem[];
  link: {
    href: string;
    label: string;
  };
};

const CardStack = () => {
  const isMobile = useIsMobile();

  const [openCardId, setOpenCardId] = useState<number | null>(null);
  const handleOpenCard = (id: number) => {
    setOpenCardId(id);
  };

  const handleCloseCard = () => {
    setOpenCardId(null);
  };

  return (
    <>
      <motion.div
        style={{
          x: -(cards.length - 1) * 10,
          y: (cards.length - 1) * 18,
        }}
        className="relative flex h-full flex-1 flex-col gap-4"
        initial="initial"
        whileHover="hover"
      >
        {cards.map((card, index) => {
          return <Card key={card.id} card={card} index={index} numCards={cards.length} isOpen={openCardId === card.id} onOpen={() => handleOpenCard(card.id)} />;
        })}
      </motion.div>
      {/* Only show full-screen modal on mobile */}
      <AnimatePresence>
        {isMobile &&
          openCardId !== null &&
          (() => {
            const openCard = cards.find((card) => card.id === openCardId);
            if (!openCard) return null;
            return <OpenFolder card={openCard} onClose={handleCloseCard} />;
          })()}
      </AnimatePresence>
    </>
  );
};

export default CardStack;
