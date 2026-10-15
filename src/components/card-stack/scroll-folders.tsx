"use client";

import { useEffect, useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { ArrowDown, ArrowUpRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { cn } from "~/helpers/cn";
import { cards } from "./projects";
import styles from "./scroll-folders.module.css";

const STEP = 1.5;

/** A reversible sequence with smooth wheel input and native touch scrolling. */
export default function ScrollFolders({ className }: { className?: string }) {
  const rootRef = useRef<HTMLElement>(null);
  const jumpRef = useRef<((index: number, immediate?: boolean) => void) | null>(
    null,
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const updateCue = () => {
      if (window.scrollY <= 64) return;
      root.dataset.scrolled = "true";
      window.removeEventListener("scroll", updateCue);
    };
    window.addEventListener("scroll", updateCue, { passive: true });
    updateCue();
    return () => window.removeEventListener("scroll", updateCue);
  }, []);

  useLayoutEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const root = rootRef.current;
    if (!root) return;
    const media = gsap.matchMedia();

    media.add(
      "(prefers-reduced-motion: no-preference) and (min-height: 560px)",
      () => {
        const stage = root.querySelector<HTMLElement>("[data-stage]")!;
        const folders = gsap.utils.toArray<HTMLElement>("[data-folder]", root);
        const tabs = gsap.utils.toArray<HTMLButtonElement>(
          "[data-project-tab]",
          root,
        );
        root.dataset.enhanced = "true";

        let active = -1;
        const select = (index: number) => {
          if (active === index) return;
          active = index;
          folders.forEach((folder, i) => {
            folder.inert = i !== index;
            folder.setAttribute("aria-hidden", String(i !== index));
            tabs[i]?.setAttribute("aria-pressed", String(i === index));
          });
        };

        folders.forEach((folder, i) => {
          gsap.set(folder, {
            y: -i * 22,
            x: i * 10,
            rotation: i * 2.5,
            scale: 1 - i * 0.04,
            zIndex: folders.length - i,
          });
          gsap.set(folder.querySelector("[data-flap]"), {
            rotationX: -2,
            transformPerspective: 1600,
          });
          gsap.set(folder.querySelector("[data-paper]"), { opacity: 0, y: 12 });
          gsap.set(folder.querySelectorAll("[data-preview]"), {
            y: 80,
            opacity: 0,
            scale: 0.9,
          });
          gsap.set(folder.querySelector("[data-details]"), { opacity: 0 });
        });

        const timeline = gsap.timeline({
          defaults: { ease: "none" },
          onUpdate: () =>
            select(
              Math.min(
                cards.length - 1,
                Math.floor((timeline.time() + 0.001) / STEP),
              ),
            ),
          scrollTrigger: {
            trigger: stage,
            start: "top top",
            end: () =>
              `+=${Math.round(window.innerHeight * cards.length * 0.9)}`,
            pin: true,
            scrub: true,
            invalidateOnRefresh: true,
          },
        });

        folders.forEach((folder, i) => {
          const start = i * STEP;
          const flap = folder.querySelector("[data-flap]");
          const paper = folder.querySelector("[data-paper]");
          const previews = folder.querySelectorAll("[data-preview]");
          const details = folder.querySelector("[data-details]");
          timeline.addLabel(`project-${i}`, start + 0.6);
          timeline.to(
            folder,
            { x: 0, y: 0, rotation: 0, scale: 1, duration: 0.35 },
            start,
          );
          timeline.to(flap, { rotationX: -24, duration: 0.35 }, start);
          timeline.to(paper, { opacity: 1, y: 0, duration: 0.3 }, start);
          timeline.to(
            previews,
            { y: 0, opacity: 1, scale: 1, stagger: 0.045, duration: 0.3 },
            start + 0.08,
          );
          timeline.to(details, { opacity: 1, duration: 0.2 }, start + 0.2);
          // An actual hold in the timeline gives each project reading/clicking time.
          timeline.to({}, { duration: 0.5 }, start + 0.5);
          if (i < folders.length - 1) {
            timeline.to(
              previews,
              { y: 80, opacity: 0, duration: 0.2 },
              start + 1,
            );
            timeline.to(flap, { rotationX: -2, duration: 0.2 }, start + 1);
            timeline.to(details, { opacity: 0, duration: 0.15 }, start + 1.15);
            timeline.to(
              folder,
              {
                y: () => window.innerHeight * 0.85,
                rotation: -6,
                opacity: 0,
                duration: 0.3,
              },
              start + 1.2,
            );
          }
        });
        select(0);

        // One frame loop for scrolling and animation, rather than two competing RAFs.
        // This instance exists only on this page while the pinned experience is enabled.
        const lenis = new Lenis({
          autoRaf: false,
          smoothWheel: true,
          syncTouch: false,
          lerp: 0.1,
          anchors: true,
          stopInertiaOnNavigate: true,
        });
        const tick = (seconds: number) => lenis.raf(seconds * 1000);
        const updateScroll = () => ScrollTrigger.update();
        const resizeScroll = () => lenis.resize();
        lenis.on("scroll", updateScroll);
        gsap.ticker.add(tick);
        ScrollTrigger.addEventListener("refresh", resizeScroll);
        lenis.resize();

        jumpRef.current = (index, immediate = false) => {
          const trigger = timeline.scrollTrigger;
          if (!trigger) return;
          const progress =
            (timeline.labels[`project-${index}`] ?? 0) / timeline.duration();
          lenis.scrollTo(
            trigger.start + progress * (trigger.end - trigger.start),
            { immediate },
          );
        };

        // Refresh after images and fonts have settled, without leaking after unmount.
        let alive = true;
        void document.fonts.ready.then(() => {
          if (alive) ScrollTrigger.refresh();
        });
        return () => {
          alive = false;
          jumpRef.current = null;
          gsap.ticker.remove(tick);
          ScrollTrigger.removeEventListener("refresh", resizeScroll);
          lenis.off("scroll", updateScroll);
          lenis.destroy();
          delete root.dataset.enhanced;
          folders.forEach((folder) => {
            folder.inert = false;
            folder.removeAttribute("aria-hidden");
          });
          tabs.forEach((tab) => tab.removeAttribute("aria-pressed"));
        };
      },
    );
    root.dataset.ready = "true";
    return () => {
      delete root.dataset.ready;
      media.revert();
    };
  }, []);

  return (
    <section
      ref={rootRef}
      className={cn(styles.section, className)}
      aria-label="Personal projects"
    >
      <span data-scroll-cue className={styles.scrollIndicator} aria-hidden="true">
        <span className={styles.scrollDot} />
      </span>
      <div data-stage className={styles.stage}>
        <div className={styles.viewport}>
          <div className={styles.toolbar}>
            <a href="#after-projects">
              Skip projects <ArrowDown size={14} />
            </a>
          </div>
          <div className={styles.scene}>
            {cards.map((card, index) => (
              <article
                key={card.id}
                data-folder
                className={styles.folder}
                aria-labelledby={`folder-title-${card.id}`}
              >
                <div className={styles.back}>
                  <h2 id={`folder-title-${card.id}`} className={styles.tab}>
                    {card.title}
                  </h2>
                </div>
                <div data-paper className={styles.paper} aria-hidden="true" />
                <div className={styles.previews} aria-hidden="true">
                  {card.contents?.map((item, itemIndex, items) => (
                    <div
                      key={item.id}
                      className={styles.previewPosition}
                      style={{
                        left: `${items.length === 1 ? 50 : 18 + itemIndex * (64 / (items.length - 1))}%`,
                        transform: `translateX(-50%) rotate(${(itemIndex - (items.length - 1) / 2) * 6}deg)`,
                      }}
                    >
                      <div data-preview className={styles.preview}>
                        {item.content}
                      </div>
                    </div>
                  ))}
                </div>
                <div data-flap className={styles.flap} aria-hidden="true" />
                <div data-details className={styles.details}>
                  <p>{card.description}</p>
                  <Link
                    href={card.link.href}
                    className={styles.visit}
                    onFocus={(event) => {
                      if (event.currentTarget.matches(":focus-visible"))
                        jumpRef.current?.(index, true);
                    }}
                  >
                    Explore {card.title} <ArrowUpRight size={18} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
          <nav className={styles.navigation} aria-label="Choose a project">
            {cards.map((card, index) => (
              <button
                key={card.id}
                data-project-tab
                type="button"
                onClick={() => jumpRef.current?.(index)}
              >
                <span>0{index + 1}</span> {card.title}
              </button>
            ))}
          </nav>
        </div>
      </div>
      <div id="after-projects" tabIndex={-1} />
    </section>
  );
}
