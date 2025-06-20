"use client";
import React, { useLayoutEffect } from "react";

import { Button } from "../ui/button";
import { AnimatePresence, motion, MotionConfig } from "motion/react";
import { useOnClickOutside } from "usehooks-ts";
import { CheckCircleIcon, LoaderCircleIcon, XIcon } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { cn } from "~/helpers/cn";

const Contact = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const contactRef = React.useRef<HTMLDivElement>(null);
  const [content, setContent] = React.useState("");
  const areaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleClose = () => {
    setIsOpen(false);
    setContent("");
    mutation.reset();
  };

  useOnClickOutside(contactRef, handleClose);

  const mutation = useMutation({
    mutationFn: async () => {
      await fetch("/contact", {
        method: "POST",
        body: JSON.stringify({
          body: content,
        }),
      });
    },
    onSuccess: () => {
      setTimeout(() => {
        handleClose();
      }, 1300);
    },
  });

  useLayoutEffect(() => {
    if (isOpen) {
      contactRef.current?.scrollIntoView({ behavior: "smooth" });
      areaRef.current?.focus();
    }
  }, [isOpen]);

  return (
    <div className="relative flex w-full items-center justify-between gap-2">
      <div className="flex flex-col gap-2">
        <p className="font-serif text-xl text-blue-700"> Want to chat? </p>
        <Button className="w-fit" onClick={() => setIsOpen(true)}>
          Get in touch
        </Button>
      </div>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={contactRef}
            className="absolute bottom-0 left-0 right-0 z-[100]"
          >
            <motion.div
              initial={{ width: 0, height: 0, opacity: 0, filter: "blur(4px)" }}
              animate={{
                width: 320,
                height: 240,
                opacity: 1,
                filter: "blur(0px)",
              }}
              exit={{ width: 0, height: 0, opacity: 0, filter: "blur(4px)" }}
              transition={{ duration: 0.3, type: "spring", bounce: 0 }}
            >
              <div className="relative flex h-full w-full flex-col gap-2 overflow-hidden rounded-xl border bg-background text-blue-700">
                <button
                  className="absolute right-2 top-3 z-10"
                  onClick={handleClose}
                >
                  <XIcon size={20} />
                </button>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    mutation.mutate();
                  }}
                  className="relative flex flex-1 flex-col gap-4 p-2"
                >
                  <div className="px-1">
                    <motion.h2
                      className="font-serif text-xl"
                      exit={{
                        opacity: 0,
                      }}
                      layoutId="cta"
                    >
                      {" "}
                      Get in touch{" "}
                    </motion.h2>
                    <p className="text-black">
                      All submissions go directly to my inbox
                    </p>
                  </div>
                  <textarea
                    className="h-full flex-1 resize-none rounded-lg border p-2 font-serif text-black"
                    autoFocus
                    required
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    ref={areaRef}
                  />
                  <div className="flex w-full gap-12">
                    <Button
                      disabled={
                        mutation.status === "success" ||
                        mutation.status === "pending"
                      }
                      className={cn("flex-1 overflow-hidden")}
                    >
                      <MotionConfig
                        transition={{
                          duration: 0.2,
                          type: "spring",
                          bounce: 0,
                        }}
                      >
                        <AnimatePresence mode="wait">
                          {mutation.status === "success" ? (
                            <motion.span
                              key="success"
                              className="flex items-center gap-2"
                              initial={{
                                opacity: 0,
                                y: 40,
                                filter: "blur(4px)",
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                                filter: "blur(0px)",
                              }}
                              exit={{ opacity: 0, y: 40, filter: "blur(4px)" }}
                            >
                              Submitted
                              <CheckCircleIcon size={12} />
                            </motion.span>
                          ) : mutation.status === "pending" ? (
                            <motion.span
                              key="pending"
                              className="flex items-center gap-2"
                              initial={{
                                opacity: 0,
                                y: 40,
                                filter: "blur(4px)",
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                                filter: "blur(0px)",
                              }}
                              exit={{ opacity: 0, y: 40, filter: "blur(4px)" }}
                            >
                              Submitting
                              <LoaderCircleIcon
                                className="animate-spin"
                                size={12}
                              />
                            </motion.span>
                          ) : (
                            <motion.span
                              key="default"
                              className="flex items-center gap-2"
                              initial={{
                                opacity: 0,
                                y: 40,
                                filter: "blur(4px)",
                              }}
                              animate={{
                                opacity: 1,
                                y: 0,
                                filter: "blur(0px)",
                              }}
                              exit={{ opacity: 0, y: 40, filter: "blur(4px)" }}
                            >
                              Submit
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </MotionConfig>
                    </Button>
                  </div>
                </form>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Contact;
