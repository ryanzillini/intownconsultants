import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

const hexClip =
  "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)";

const work = [
  {
    title: "Kitchens",
    image: "/images/work/white-kitchen.png",
    alt: "Bright galley kitchen with white cabinets and patterned tile",
  },
  {
    title: "Brownstones",
    image: "/images/work/brick-building.png",
    alt: "Classic brick brownstone exterior",
  },
  {
    title: "Baths",
    image: "/images/work/white-tile-bathroom.png",
    alt: "Bathroom with white subway tile and modern vanity",
  },
  {
    title: "Outdoors",
    image: "/images/work/backyard.png",
    alt: "Backyard patio with illuminated steps and masonry",
  },
  {
    title: "Interiors",
    image: "/images/work/finished-basement.png",
    alt: "Finished basement with exposed beams and leather seating",
  },
] as const;

export function HomeServices() {
  return (
    <section className="bg-paper">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-serif text-3xl tracking-tight text-ink sm:text-4xl">
            Final results
          </h2>
          <Link
            href="/services"
            className="text-sm text-gold-deep underline-offset-4 transition-colors hover:text-gold hover:underline"
          >
            All services
          </Link>
        </div>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 md:hidden">
          {work.map((item) => (
            <li key={item.title} className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={item.image}
                alt={item.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </li>
          ))}
        </ul>

        <ul className="mx-auto mt-14 hidden max-w-3xl grid-cols-6 md:grid">
          {work.map((item, index) => (
            <li
              key={item.title}
              className={cn(
                "relative col-span-2 aspect-square",
                index === 3 && "col-start-2",
                index === 4 && "col-start-4",
              )}
              style={{
                marginTop: index >= 3 ? "-18%" : undefined,
              }}
            >
              <div
                className="absolute inset-[6%] overflow-hidden bg-ink"
                style={{ clipPath: hexClip }}
              >
                <Image
                  src={item.image}
                  alt={item.alt}
                  fill
                  sizes="280px"
                  className="object-cover"
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
