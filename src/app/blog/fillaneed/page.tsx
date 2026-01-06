import { KeyRound, Palette, Sparkles, Wrench } from "lucide-react";
import Image from "next/image";
import React from "react";
import Badge from "~/components/badge";
import BlogTitle from "~/components/blog/title";

const BlogPage = () => {
  return (
    <div className="blog relative w-full font-sans">
      <div>
        <BlogTitle
          title="Fillaneed"
          link={{ href: "https://fillaneed.xyz", text: "fillaneed.xyz" }}
        />

        {/* Hero Section */}
        <section className="border-b border-blue-700 pb-12">
          <p className="mb-6 mt-4 text-lg italic text-blue-700">
            A wishlist app that gets out of your way
          </p>
          <div className="mb-8 flex flex-col gap-2">
            <div className="xs:h-[440px] relative h-[600px] w-full overflow-hidden rounded-xl border border-blue-700">
              <Image
                priority
                fill
                src="/images/fillaneed/apartment.png"
                alt="Fillaneed wishlist for an apartment"
                className="xs:block hidden h-full w-full object-cover"
              />
              <Image
                priority
                fill
                src="/images/fillaneed/apartmentmobile.png"
                alt="Fillaneed wishlist for an apartment"
                className="xs:hidden block h-full w-full object-cover"
              />
            </div>
            <p className="text-sm italic text-blue-700">
              A Fillaneed wishlist I made for my own apartment.
            </p>
          </div>
          <div className="flex flex-col gap-4">
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
          </div>
        </section>

        {/* Design Philosophy Section */}
        <section className="mt-12 pb-12">
          <h2 className="mb-8 font-serif text-3xl text-blue-700">The Look</h2>
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
          <h2 className="mb-8 font-serif text-3xl text-blue-700">
            Getting Items In Had to Be Instant
          </h2>
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
          <video
            autoPlay
            loop
            muted
            playsInline
            className="xs:block hidden h-auto w-full rounded-xl border border-blue-700 object-cover"
            src="/images/fillaneed/product-add.mp4"
          />
          <video
            autoPlay
            loop
            muted
            playsInline
            className="xs:hidden block h-auto w-full rounded-xl border border-blue-700 object-cover"
            src="/images/fillaneed/product-add-mobile.mp4"
          />
        </section>

        {/* Features Section */}
        <section className="mt-12">
          <div className="flex flex-col gap-12  pb-16">
            <Badge className="bg-blue-700 text-white" Icon={KeyRound}>
              The Features
            </Badge>
            <div className="flex flex-col gap-20">
              {/* Keep It a Secret Mode */}
              <div className="grid gap-4 md:grid-cols-[2fr_1fr] md:gap-14">
                <div className="relative aspect-[6/4] w-full overflow-hidden rounded-xl border border-blue-700">
                  <Image
                    className="object-cover"
                    fill
                    src="/images/fillaneed/secret.png"
                    alt="Fillaneed keep it a secret mode"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-serif text-3xl">Keep It a Secret Mode</h3>
                  <p>
                    Share your list with friends and family. They can claim
                    items without you seeing which ones they picked. Everyone
                    coordinates, nobody spoils the surprise.
                  </p>
                </div>
              </div>

              {/* Gift Receipts */}
              <div className="grid gap-4 md:grid-cols-[1fr_2fr] md:gap-14">
                <div className="relative aspect-[6/4] w-full overflow-hidden rounded-xl border border-blue-700 md:order-2">
                  <Image
                    className="object-cover"
                    fill
                    src="/images/fillaneed/receipt.gif"
                    alt="Fillaneed gift receipts feature"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-serif text-3xl">Gift Receipts</h3>
                  <p>
                    Check items off as you receive them. There&apos;s a little
                    receipt animation that I&apos;m unreasonably attached to.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default BlogPage;
