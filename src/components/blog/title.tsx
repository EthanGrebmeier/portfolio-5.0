"use client";
import React, { useMemo } from "react";
import ButtonLink from "../button-link";
import { LinkIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
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

  const handleScroll = () => {
    if (window.scrollY > 40) {
      setHasScrolled(true);
    } else {
      setHasScrolled(false);
    }
  };

  useMemo(() => {
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
        <h1 className="tracking-tight">{title}</h1>
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
