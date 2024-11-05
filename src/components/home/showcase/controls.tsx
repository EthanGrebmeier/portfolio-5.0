import { ArrowLeft, ArrowRight, Pause, Play } from "lucide-react";
import React from "react";
import ButtonIcon from "~/components/button-icon";

type Controls = {
  handlePreviousSlide: () => void;
  handleNextSlide: () => void;
  togglePlay: () => void;

  isPlaying: boolean;
};

const Controls = ({
  handlePreviousSlide,
  handleNextSlide,
  togglePlay,
  isPlaying,
}: Controls) => {
  return (
    <div className="absolute bottom-4 left-4 z-10 flex gap-2 text-4xl text-white sm:bottom-8 sm:left-8">
      <ButtonIcon Icon={ArrowLeft} onClick={handlePreviousSlide} />
      <ButtonIcon
        Icon={Pause}
        IconTwo={Play}
        showIconTwo={!isPlaying}
        onClick={togglePlay}
      />
      <ButtonIcon Icon={ArrowRight} onClick={handleNextSlide} />
    </div>
  );
};

export default Controls;
