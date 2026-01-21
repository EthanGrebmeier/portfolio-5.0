"use client";
import React, { useMemo } from "react";
import ButtonLink from "../button-link";
import { LinkIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import Image from "next/image";

type BlogTitleProps = {
  title: string;
  link: {
    href: string;
    text: string;
  };
};

const BlogTitle = ({ title, link }: BlogTitleProps) => {
  const [hasScrolled, setHasScrolled] = React.useState(false);

  useMemo(() => {
    if (typeof window === "undefined") return;
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <motion.div className="sticky top-0 z-10 mb-2 flex w-full items-center gap-2 border-b border-blue-700 bg-background pb-2 pt-8">
      <AnimatePresence mode="popLayout">
        {hasScrolled && (
          <Link href={"/"}>
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.3, type: "spring", bounce: 0 }}
            >
              <Image
                src="/images/smileanimated.gif"
                alt="Smiling animation"
                width={50}
                height={50}
              />
            </motion.div>
          </Link>
        )}
      </AnimatePresence>
      <motion.div
        layout
        className="flex w-full items-center justify-between gap-2"
      >
        <h1 className="text-3xl tracking-tight sm:text-4xl text-blue-700 font-serif">{title}</h1>
        <ButtonLink
          color="blue"
          className="flex items-center gap-2 border border-transparent hover:border-blue-700"
          href={link.href}
        >
          {link.text}
          <LinkIcon size={18} />
        </ButtonLink>
      </motion.div>
    </motion.div>
  );
};

export default BlogTitle;
