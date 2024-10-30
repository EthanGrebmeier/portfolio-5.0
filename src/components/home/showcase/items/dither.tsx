import React from "react";

import { Shapes } from "lucide-react";

import background from "~/../public/images/blueflower.png";
import ShowcaseItem from "../item";

const Dither = () => {
  return (
    <ShowcaseItem
      title="Dither"
      subtitle="Give your images a retro look."
      badge={{ icon: Shapes, text: "Toy" }}
      link={{ href: "/dither", text: "Check it out" }}
      backgroundImage={{
        src: background,
        alt: "The Mona Lisa with a blue dither effect",
      }}
      overlay={{ className: "bg-gray-600/40", showOverlay: true }}
    />
  );
};

export default Dither;
