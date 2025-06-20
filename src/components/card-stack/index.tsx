"use client";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect } from "react";
import Card from "./card";
import { type LucideProps } from "lucide-react";
import { cards } from "./projects";
import { OpenFolder } from "./open-folder";

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
};

const CardStack = () => {
  const [order, setOrder] = useState<number[]>(() =>
    cards.map((card) => card.id),
  );
  const [openCardId, setOpenCardId] = useState<number | null>(null);

  const handleSelect = (selectedId: number) => {
    setOrder((currentIds) => [
      selectedId,
      ...currentIds.filter((id) => id !== selectedId),
    ]);
  };

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
        {order.map((id, index) => {
          const card = cards.find((c) => c.id === id);
          if (!card) return null;

          return (
            <Card
              numCards={order.length}
              key={id}
              card={card}
              index={index}
              isOpen={openCardId === id}
              onOpen={() => handleOpenCard(id)}
            />
          );
        })}
      </motion.div>
      <AnimatePresence>
        {openCardId !== null &&
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
