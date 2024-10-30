import React from "react";

import { Hammer } from "lucide-react";
import background from "~/../public/images/fillaneed-hero.avif";
import ShowcaseItem from "../item";

const Fillaneed = () => {
  return (
    <ShowcaseItem
      theme="green"
      title="Fillaneed"
      subtitle="Create your dream wishlist."
      badge={{
        icon: Hammer,
        text: "Project",
      }}
      link={{
        href: "https://fillaneed.xyz",
        text: "Get Started",
      }}
      backgroundImage={{
        src: background,
        alt: "woman laying in grass",
      }}
    />
  );
};

export default Fillaneed;
