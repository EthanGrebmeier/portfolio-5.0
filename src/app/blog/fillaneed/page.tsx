import { KeyRound } from "lucide-react";
import React from "react";
import Badge from "~/components/badge";
import BlogTitle from "~/components/blog/title";
import { BlogFeatureGrid, type BlogFeature } from "~/components/blog/feature-grid";
import { BlogHero } from "~/components/blog/hero-section";
import { BlogMedia, type BlogMediaDefinition } from "~/components/blog/media";

const heroMedia: BlogMediaDefinition = {
  type: "image",
  alt: "Fillaneed wishlist for an apartment",
  desktop: {
    src: "/images/fillaneed/apartment.png",
    priority: true,
  },
  mobile: {
    src: "/images/fillaneed/apartmentmobile.png",
    priority: true,
  },
  containerClassName: "xs:h-[440px] h-[600px]",
};

const features: BlogFeature[] = [
  {
    title: "Keep It a Secret Mode",
    description: (
      <>
        <p>
          Share your list with friends and family. They can claim items without
          you seeing which ones they picked. Everyone coordinates, nobody spoils
          the surprise.
        </p>
      </>
    ),
    media: {
      type: "image",
      alt: "Fillaneed keep it a secret mode",
      desktop: {
        src: "/images/fillaneed/secret.png",
      },
      containerClassName: "aspect-[6/4]",
    },
  },
  {
    title: "Gift Receipts",
    imagePosition: "right",
    description: (
      <>
        <p>
          Check items off as you receive them. There&apos;s a little receipt
          animation that I&apos;m unreasonably attached to.
        </p>
      </>
    ),
    media: {
      type: "image",
      alt: "Fillaneed gift receipts feature",
      desktop: {
        src: "/images/fillaneed/receipt.gif",
      },
      containerClassName: "aspect-[6/4]",
    },
  },
];

const addItemsVideo: BlogMediaDefinition = {
  type: "video",
  alt: "Fillaneed product add flow",
  desktop: {
    src: "/images/fillaneed/product-add.mp4",
  },
  mobile: {
    src: "/images/fillaneed/product-add-mobile.mp4",
  },
  containerClassName: "h-auto",
};

const BlogPage = () => {
  return (
    <div className="blog relative w-full font-sans">
      <div>
        <BlogTitle
          title="Fillaneed"
          link={{ href: "https://fillaneed.xyz", text: "fillaneed.xyz" }}
        />

        <BlogHero
          tagline="A wishlist app that gets out of your way"
          caption="A Fillaneed wishlist I made for my own apartment."
          media={heroMedia}
          content={
            <>
              <p>
                I forget things. Specifically, I forget every cool thing I see
                online the moment someone asks me what I want for my birthday. By
                December, my brain is a wasteland of half-remembered product pages
                and vague ideas about &quot;maybe a nice lamp?&quot;
              </p>
              <p>
                Fillaneed started as a weekend project to solve this exact
                problem. It turned into something bigger.
              </p>
            </>
          }
        />

        {/* Design Philosophy Section */}
        <section className="mt-12 pb-12">
          <h2 className="mb-8">The Look</h2>
          <div className="flex flex-col gap-4">
            <p>
              Most wishlist apps look like database interfaces. Rows of text,
              grey backgrounds, purely functional. I wanted mine to have
              personality. Bright greens, bold contrasts, the kind of color
              palette that makes you want to poke around.
            </p>
            <p>
              I spent a lot of time on small motion details—how cards slide when
              you interact with them, the bounce on button presses, the way
              selections feel weighty. These things don&apos;t make the app more
              useful in a measurable way, but they make it more enjoyable to
              use.
            </p>
          </div>
        </section>

        {/* Adding Items Section */}
        <section className="mt-12 border-b border-blue-700 pb-12">
          <h2 className="mb-8">Getting Items In Had to Be Instant</h2>
          <div className="mb-8 flex flex-col gap-4">
            <p>
              Early versions had a full form: name, price, link, image upload,
              notes field. I used it for about three days before I started
              ignoring it. Too much friction. If I see something I want while
              scrolling at midnight, I need to capture it in under five seconds
              or I won&apos;t bother.
            </p>
            <p>
              I tried a couple variations—fewer fields, smarter defaults—before
              landing on URL paste. Drop in a product link, we pull the data
              automatically. Title, image, price. Done. Two seconds, max.
            </p>
          </div>
          <BlogMedia media={addItemsVideo} />
        </section>

        <BlogFeatureGrid
          className="mt-12"
          badge={
            <Badge className="bg-blue-700 text-white" Icon={KeyRound}>
              The Features
            </Badge>
          }
          features={features}
        />
      </div>
    </div>
  );
};

export default BlogPage;
