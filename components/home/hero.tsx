"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "@/lib/site";

const HERO_IMAGE = "/images/work/rustic-kitchen.png";

export function HomeHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-ink pt-16 sm:pt-20">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-5 py-10 sm:px-8 sm:py-12 lg:flex-row lg:items-center lg:gap-14 lg:py-14">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="shrink-0"
        >
          <Image
            src={HERO_IMAGE}
            alt="Renovated kitchen with marble island and wood beams"
            width={436}
            height={653}
            priority
            className="h-auto w-full max-w-[436px]"
          />
        </motion.div>

        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-lg text-center lg:text-left"
        >
          <h1 className="font-serif text-3xl leading-[1.12] tracking-tight text-gold sm:text-4xl lg:text-5xl">
            {siteConfig.tagline}
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">
            Thirty years of landmark renovation — preserving the character of
            Brooklyn brownstones while delivering meticulous craft.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3 lg:justify-start">
            <Link
              href="/contact"
              className="bg-gold px-5 py-3 text-sm text-ink transition-colors hover:bg-gold-deep hover:text-paper"
            >
              Get a Quote
            </Link>
            <Link
              href="/projects"
              className="border border-gold px-5 py-3 text-sm text-white transition-colors hover:bg-gold/10"
            >
              View Projects
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
