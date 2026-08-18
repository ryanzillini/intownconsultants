import Image from "next/image";
import Link from "next/link";

const services = [
  {
    title: "Landmark Renovation",
    body: "Navigating regulations and craft with equal care — our specialty for over three decades.",
    image:
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    alt: "Restored historic home interior",
  },
  {
    title: "Brownstones",
    body: "Quality renovation that emphasizes the preservation of the architecture that makes a brownstone a brownstone.",
    image:
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=1200&q=80",
    alt: "Brownstone exterior with stoop",
  },
  {
    title: "Full-Service Contracting",
    body: "Interior remodeling, exterior masonry, HVAC, and waterproofing — one team for the whole job.",
    image:
      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    alt: "Architectural renovation detail",
  },
] as const;

export function HomeServices() {
  return (
    <section className="bg-limestone-light">
      <div className="mx-auto max-w-6xl px-5 py-20 sm:px-8 md:py-28">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="font-serif text-3xl tracking-tight text-iron sm:text-4xl">
            What we do
          </h2>
          <Link
            href="/services"
            className="text-sm text-brownstone underline-offset-4 transition-colors hover:text-brownstone-deep hover:underline"
          >
            All services
          </Link>
        </div>

        <ul className="mt-12 grid gap-10 md:grid-cols-3 md:gap-8">
          {services.map((service) => (
            <li key={service.title} className="group">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={service.image}
                  alt={service.alt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
              </div>
              <h3 className="mt-5 font-serif text-xl text-iron">
                {service.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-iron-muted">
                {service.body}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
