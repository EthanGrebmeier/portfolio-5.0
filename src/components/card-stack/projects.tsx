import {
  ImagesIcon,
  ScrollIcon,
  type LucideProps,
} from "lucide-react";
import Image from "next/image";


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

export const cards: CardType[] = [
  {
    id: 0,
    title: "Fillaneed",
    description: "Create your dream wishlist.",
    Icon: ScrollIcon,
    link: {
      href: "https://fillaneed.xyz",
      label: "Check It Out",
    },
    contents: [
      {
        id: "fill-4",
        content: (
          <div className="relative aspect-[391/502] w-[120px] overflow-hidden rounded-md">
            <Image
              src="/images/fillaneed-item-one.png"
              alt="A fillaneed product"
              fill
              className="pointer-events-none select-none object-cover"
            />
          </div>
        ),
      },
      {
        id: "fill-5",
        content: (
          <div className="relative aspect-[268/92] w-[95px] overflow-hidden rounded-xl">
            <Image
              src="/images/fillaneed-date.png"
              alt="Fillaneed keep it a secret mode"
              fill
              className="pointer-events-none select-none object-cover"
            />
          </div>
        ),
      },
      {
        id: "fill-6",
        content: (
          <div className="relative aspect-[2900/2140] w-[170px] overflow-hidden rounded-md">
            <Image
              src="/images/fillaneed/fillaneed-wishlist-view.png"
              alt="A fillaneed wishlist view"
              fill
              className="pointer-events-none select-none object-cover"
            />
          </div>
        ),
      },
    ],
  },
  {
    id: 1,
    title: "Dither",
    description: "Give your images a retro look.",
    Icon: ImagesIcon,
    link: {
      href: "/dither",
      label: "Check It Out",
    },
    contents: [
      {
        id: "dither-4",
        content: (
          <div className="overflow-hidden rounded-lg border-2 border-white bg-blue-100">
            <Image
              src="/images/ditherjapan.png"
              alt="Dither"
              width={125}
              height={189}
              unoptimized
              className="pointer-events-none select-none "
            />
          </div>
        ),
      },
      {
        id: "dither-3",
        content: (
          <div className="overflow-hidden rounded-lg border-2 border-white bg-blue-100">
            <Image
              src="/images/blueflower.png"
              alt="Dither"
              width={125}
              height={167}
              unoptimized
              className="pointer-events-none select-none "
            />
          </div>
        ),
      },
    ],
  },
];
