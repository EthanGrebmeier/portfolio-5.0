import {
  ImagesIcon,
  ListCheckIcon,
  ScrollIcon,
  type LucideProps,
  FolderOpen,
  Palette,
  ImageIcon,
  Download,
  ShoppingCart,
  CreditCard,
  ListChecks,
  ArrowRightIcon,
  CpuIcon,
  LockIcon,
} from "lucide-react";
import Image from "next/image";
import { ItemWrapper } from "./item-wrapper";
import Link from "next/link";

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
        id: "fill-1",
        content: (
          <ItemWrapper className="flex items-start gap-4">
            <div className="rounded-lg bg-blue-100 p-2">
              <ShoppingCart className="text-blue-700" size={24} />
            </div>
            <div>
              <h3 className="font-serif text-xl text-blue-700">
                Wishlist Manager
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Fillaneed allows you to create and manage your wishlists and
                share them with friends and family.
              </p>
            </div>
          </ItemWrapper>
        ),
      },
      {
        id: "fill-2",
        content: (
          <ItemWrapper className="flex items-start gap-4">
            <div className="rounded-lg bg-blue-100 p-2">
              <CpuIcon className="text-blue-700" size={24} />
            </div>
            <div>
              <h3 className="font-serif text-xl text-blue-700">Tech Stack</h3>
              <p className="mt-1 text-sm text-gray-500">
                Fillaneed is built with Next.js, Tailwind CSS, and PostgreSQL.
              </p>
            </div>
          </ItemWrapper>
        ),
      },
      {
        id: "fill-3",
        content: (
          <ItemWrapper className="flex items-start gap-4">
            <div className="rounded-lg bg-blue-100 p-2">
              <LockIcon className="text-blue-700" size={24} />
            </div>
            <div>
              <h3 className="font-serif text-xl text-blue-700">
                Keep It a Secret
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Fillaneed allows you to keep purchased items a secret to
                yourself, but visible to other shared members.
              </p>
              <p className="mt-1 text-sm text-gray-500">
                This prevents spoilers, but makes it easy for friends and family
                to avoid buying the same thing.
              </p>
            </div>
          </ItemWrapper>
        ),
      },
      {
        id: "fill-4",
        content: (
          <div className="relative aspect-[391/502] w-[240px] overflow-hidden rounded-md">
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
          <div className="relative aspect-[268/92] w-[190px] scale-75 overflow-hidden rounded-xl">
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
          <div className="relative aspect-[2900/2140] w-[340px] overflow-hidden rounded-md">
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
          <div className="relative h-48 w-48 overflow-hidden rounded-lg border-2 border-white bg-blue-100">
            <Image
              src="/images/ditherjapan.png"
              alt="Dither"
              fill
              className="pointer-events-none select-none object-cover"
            />
          </div>
        ),
      },
      {
        id: "dither-1",
        content: (
          <ItemWrapper className="flex items-start gap-4">
            <div className="w-fit rounded-lg bg-blue-100 p-2">
              <Palette className="text-blue-700" size={24} />
            </div>
            <div>
              <h3 className="font-serif text-xl text-blue-700">
                Color Palette
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Customize your color schemes with an intuitive palette editor
              </p>
            </div>
          </ItemWrapper>
        ),
      },

      {
        id: "dither-2",
        content: (
          <ItemWrapper className="flex items-start gap-4">
            <div className="w-fit rounded-lg bg-blue-100 p-2">
              <ImageIcon className="text-blue-700" size={24} />
            </div>
            <div>
              <h3 className="font-serif text-xl text-blue-700">
                Image Processing
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Apply dithering effects with a real-time preview
              </p>
            </div>
          </ItemWrapper>
        ),
      },
      {
        id: "dither-3",
        content: (
          <div className="relative h-48 w-48 overflow-hidden rounded-lg border-2 border-white bg-blue-100">
            <Image
              src="/images/blueflower.png"
              alt="Dither"
              fill
              className="pointer-events-none select-none object-cover"
            />
          </div>
        ),
      },
    ],
  },
];
