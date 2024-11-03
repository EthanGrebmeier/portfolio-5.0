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
      links={[
        {
          href: "https://fillaneed.xyz",
          text: "Get Started",
        },
        {
          href: "/blog/fillaneed",
          text: "Read Case Study",
        },
      ]}
      backgroundImage={{
        src: background,
        alt: "woman laying in grass",
      }}
    />
  );
};

export default Fillaneed;
