"use client";

import { motion, useReducedMotion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export function HomeNiche() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-plaster">
      <div className="mx-auto grid max-w-6xl gap-10 px-5 py-20 sm:px-8 md:grid-cols-[1fr_1.2fr] md:gap-16 md:py-28">
        <motion.p
          variants={fadeUp}
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-serif text-3xl leading-tight tracking-tight text-iron sm:text-4xl"
        >
          Built for Brooklyn&apos;s landmarks
        </motion.p>
        <motion.div
          variants={fadeUp}
          initial={reduceMotion ? false : "hidden"}
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
          className="space-y-5 text-base leading-relaxed text-iron-muted sm:text-lg"
        >
          <p>
            Landmarks come with challenges and regulations that differ from a
            typical renovation. Lucio&apos;s 30+ years of landmark experience
            gives our team the confidence to take on work that protects
            historical architecture — and still delivers a home that works for
            how you live.
          </p>
          <p>
            From brownstone façades in Carroll Gardens to interiors in
            Williamsburg and Downtown Brooklyn, we specialize in quality
            renovation that preserves what makes these buildings worth keeping.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
