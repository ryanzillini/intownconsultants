"use client";

import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion } from "framer-motion";
import { siteConfig } from "@/lib/site";

const HERO_IMAGE =
  "https://images.unsplash.com/photo-1572120360610-d971b9d776b8?auto=format&fit=crop&w=2400&q=80";

export function HomeHero() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="relative min-h-[100svh] overflow-hidden">
      <motion.div
        className="absolute inset-0"
        initial={reduceMotion ? false : { scale: 1.06 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
      >
        <Image
          src={HERO_IMAGE}
          alt="Brooklyn brownstone streetscape"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      </motion.div>

      <div
        className="absolute inset-0 bg-gradient-to-t from-iron/75 via-iron/35 to-iron/20"
        aria-hidden
      />

      <div className="relative mx-auto flex min-h-[100svh] max-w-6xl flex-col justify-end px-5 pb-16 pt-28 sm:px-8 sm:pb-20">
        <motion.div
          initial={reduceMotion ? false : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-2xl text-plaster"
        >
          <p className="font-serif text-4xl leading-[1.05] tracking-tight sm:text-5xl md:text-6xl">
            Intown Consultants
          </p>
          <h1 className="mt-5 max-w-xl text-lg leading-snug text-plaster/90 sm:text-xl">
            {siteConfig.tagline}
          </h1>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-plaster/75 sm:text-base">
            Thirty years of landmark renovation — preserving the character of
            Brooklyn brownstones while delivering meticulous craft.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="bg-plaster px-5 py-3 text-sm text-iron transition-colors hover:bg-limestone-light"
            >
              Get a Quote
            </Link>
            <Link
              href="/projects"
              className="border border-plaster/50 px-5 py-3 text-sm text-plaster transition-colors hover:border-plaster hover:bg-plaster/10"
            >
              View Projects
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
