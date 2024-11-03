import { KeyRound, LinkIcon, Scroll } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Badge from "~/components/badge";
import BlogTitle from "~/components/blog/title";
import ButtonLink from "~/components/button-link";

const BlogPage = () => {
  return (
    <div className="blog relative w-full font-sans">
      <div>
        <BlogTitle
          title="Fillaneed"
          link={{ href: "https://fillaneed.xyz", text: "fillaneed.xyz" }}
        />
        <section className="border-b border-blue-700 pb-12">
          <div className="mb-8 mt-4 flex flex-col gap-2">
            <div className="relative h-[440px] w-full overflow-hidden rounded-xl">
              <Image
                fill
                src="/images/fillaneed/apartment.png"
                alt="Fillaneed"
                className="h-full w-full object-cover"
              />
            </div>
            <p className="text-sm italic text-blue-700">
              A Fillaneed wishlist that I made for my own apartment.
            </p>
          </div>
          <div className="flex flex-col gap-2">
            <p>
              Whenever a birthday or holiday comes around, I scramble to figure
              out exactly what I want to ask for from friends and family. I have
              this problem where every time that I see something cool that I may
              want to get, the idea of it is immediately ejected from my brain.
            </p>
            <span className="mt-2 block">
              <p className="inline">
                Seeing this as a challenge for myself, I immediately got to work
                ideating, designing and prototyping a small wishlist builder
                that would eventually scope-creep itself into a full fledged
                wishlist/registry/whatever-kind-of-list-you-want builder called
                fillaneed
              </p>
              <span className="mx-1 inline-block rounded-sm border border-black bg-green-400 p-[1px]">
                {" "}
                <Scroll size={14} />{" "}
              </span>
            </span>
          </div>
        </section>
        <section className="mt-12 w-fit">
          <div className="flex flex-col gap-12 border-b border-blue-700 pb-16">
            <Badge className="bg-blue-700 text-white" Icon={KeyRound}>
              Key Features
            </Badge>
            <div className="flex flex-col gap-20">
              <div className="grid gap-4 md:grid-cols-[2fr_1fr] md:gap-14">
                <div className="relative aspect-[6/4] w-full overflow-hidden rounded-xl border border-blue-700">
                  <Image
                    className="object-cover"
                    fill
                    src="/images/fillaneed/secret.png"
                    alt="fillaneed keep it a secret mode"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-serif text-3xl">Keep it a secret mode</h3>
                  <p className="italic">Fillaneed&apos;s secret sauce</p>
                  <p>
                    Keep it a secret mode allows friends and family to select
                    products from your wishlist without you knowing what
                    you&apos;re getting.
                  </p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-[1fr_2fr] md:gap-14">
                <div className="relative aspect-[6/4] w-full overflow-hidden rounded-xl border border-blue-700 md:order-2">
                  <Image
                    className="object-cover"
                    fill
                    src="/images/fillaneed/autofill.gif"
                    alt="fillaneed keep it a secret mode"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <h3 className="font-serif text-3xl">Product Autofill</h3>
                  <p className="">
                    It needed to be as easy as possible to add products to your
                    wishlist.
                  </p>
                  <p className="">
                    Product autofill allows you to quickly add products to your
                    wishlist by typing in the URL of the product. We scrape the
                    product data from the URL and add it to your wishlist.
                  </p>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-[2fr_1fr] md:gap-14">
                <div className="relative aspect-[6/4] w-full overflow-hidden rounded-xl border border-blue-700">
                  <Image
                    className="object-cover"
                    fill
                    src="/images/fillaneed/receipt.gif"
                    alt="fillaneed keep it a secret mode"
                  />
                </div>
                <div className="flex flex-col gap-2 text-end">
                  <h3 className="font-serif text-3xl">Gift Receipts</h3>
                  <p className="">The most exciting part!</p>
                  <p className="">
                    Easily clear out products from your wishlist as you receive
                    them.
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
