"use client";

import { motion, useReducedMotion } from "framer-motion";
import { testimonials } from "@/lib/site";

export function HomeTestimonials() {
  const reduceMotion = useReducedMotion();

  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
        <h2 className="font-serif text-3xl tracking-tight text-ink sm:text-4xl">
          What clients say
        </h2>

        <ul className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {testimonials.map((item, index) => (
            <motion.li
              key={item.quote.slice(0, 32)}
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{
                duration: 0.55,
                delay: reduceMotion ? 0 : index * 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <blockquote className="border-t border-gold/60 pt-6">
                <p className="text-sm leading-relaxed text-muted sm:text-[15px]">
                  &ldquo;{item.quote}&rdquo;
                </p>
              </blockquote>
            </motion.li>
          ))}
        </ul>
      </div>
    </section>
  );
}
