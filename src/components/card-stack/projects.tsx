import {
  ImagesIcon,
  ListCheckIcon,
  ScrollIcon,
  type LucideProps,
  FolderOpen,
  Palette,
  Image,
  Download,
  ShoppingCart,
  CreditCard,
  ListChecks,
} from "lucide-react";

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

export const cards: CardType[] = [
  {
    id: 1,
    title: "Dither",
    description: "Give your images a retro look.",
    Icon: ImagesIcon,
    contents: [
      {
        id: "dither-1",
        content: (
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-blue-100 p-2">
              <Palette className="text-blue-700" size={24} />
            </div>
            <div>
              <h3 className="font-serif text-xl text-blue-700">
                Color Palette
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Customize your color schemes with our intuitive palette editor
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "dither-2",
        content: (
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-blue-100 p-2">
              <Image className="text-blue-700" size={24} />
            </div>
            <div>
              <h3 className="font-serif text-xl text-blue-700">
                Image Processing
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Apply dithering effects with real-time preview
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "dither-3",
        content: (
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-blue-100 p-2">
              <Download className="text-blue-700" size={24} />
            </div>
            <div>
              <h3 className="font-serif text-xl text-blue-700">
                Export Options
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Save your work in multiple formats
              </p>
            </div>
          </div>
        ),
      },
    ],
  },
  {
    id: 0,
    title: "Fillaneed",
    description: "Create your dream wishlist.",
    Icon: ScrollIcon,
    contents: [
      {
        id: "fill-1",
        content: (
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-blue-100 p-2">
              <ShoppingCart className="text-blue-700" size={24} />
            </div>
            <div>
              <h3 className="font-serif text-xl text-blue-700">
                Wishlist Manager
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Organize and prioritize your shopping lists
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "fill-2",
        content: (
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-blue-100 p-2">
              <CreditCard className="text-blue-700" size={24} />
            </div>
            <div>
              <h3 className="font-serif text-xl text-blue-700">
                Price Tracking
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Monitor prices and get notified of deals
              </p>
            </div>
          </div>
        ),
      },
      {
        id: "fill-3",
        content: (
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-blue-100 p-2">
              <ListChecks className="text-blue-700" size={24} />
            </div>
            <div>
              <h3 className="font-serif text-xl text-blue-700">
                Shopping Assistant
              </h3>
              <p className="mt-1 text-sm text-gray-500">
                Get personalized recommendations
              </p>
            </div>
          </div>
        ),
      },
    ],
  },
];
