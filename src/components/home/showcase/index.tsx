"use client";
import React from "react";
import Fillaneed from "./items/fillaneed";
import Dither from "./items/dither";
import { motion } from "motion/react";

const items = [<Fillaneed key="fillaneed" />, <Dither key="dither" />];

const Showcase = () => {
  return (
    <motion.div
      className="relative flex w-full flex-1 flex-col gap-8 overflow-hidden rounded-3xl py-8"
      initial={{ opacity: 0, filter: "blur(4px)" }}
      animate={{ opacity: 1, filter: "blur(0px)" }}
      transition={{ duration: 0.6, delay: 1.4, ease: "linear" }}
    >
      {items.map((item, idx) => (
        <div
          key={idx}
          className="relative overflow-hidden rounded-3xl bg-white shadow-lg"
        >
          {item}
        </div>
      ))}
    </motion.div>
  );
};

export default Showcase;
