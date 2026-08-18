"use client";

import { motion, useReducedMotion } from "framer-motion";
import { aboutCopy } from "@/lib/site";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function HomeNiche() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-ink">
      <div className="mx-auto max-w-6xl px-5 pb-16 sm:px-8 md:pb-24">
        <motion.h2
          variants={fadeUp}
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-3xl leading-tight tracking-tight text-gold sm:text-4xl"
        >
          {aboutCopy.heading}
        </motion.h2>
        <motion.p
          variants={fadeUp}
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="mt-5 max-w-3xl text-base leading-relaxed text-white/80 sm:mt-6 sm:text-lg"
        >
          {aboutCopy.body}
        </motion.p>
      </div>
    </section>
  );
}
