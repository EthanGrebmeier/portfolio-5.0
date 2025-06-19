"use client";

import React from "react";
import { motion } from "motion/react";
import { cn } from "~/helpers/cn";

type TimerProps = {
  progress: number;
  className: string;
};

const Timer = ({ progress, className }: TimerProps) => {
  return (
    <div className="font-bold text-white">
      {progress}
      <svg id="progress" width="100" height="100" viewBox="0 0 100 100">
        <circle
          cx="50"
          cy="50"
          r="30"
          pathLength="1"
          className={cn("opacity-40", className)}
          style={{
            strokeDashoffset: 0,
            strokeWidth: 1,
            fill: "none",
          }}
        />
        <motion.circle
          cx="50"
          cy="50"
          r="30"
          pathLength="1"
          stroke="red"
          // className={className}
          style={{ pathLength: progress, fill: "none" }}
          transition={{ duration: 1, type: "linear", bounce: 0 }}
        />
      </svg>
    </div>
  );
};

export default Timer;
