export const siteConfig = {
  name: "Intown Consultants Inc.",
  shortName: "Intown Consultants",
  tagline: "Landmark brownstone renovation across Brooklyn",
  description:
    "Brooklyn general contractor specializing in landmark and brownstone renovation — Downtown Brooklyn, Williamsburg, Carroll Gardens, and beyond.",
  phone: "(718) 000-0000",
  email: "info@intowninc.com",
  address: "6921 8th Avenue, Brooklyn, NY",
  domain: "intowninc.com",
  nav: [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/projects", label: "Projects" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
} as const;

export const servicesPage = {
  intro:
    "Landmark renovation is our specialty. Exterior masonry and interior remodeling round out a full-service practice across Brooklyn.",
  niche: {
    heading: "Our Niche",
    items: [
      {
        title: "Landmark Renovation",
        body: "Landmarks come with many challenges and regulations which differ from your typical renovation. Lucio's 30+ years of experience with landmark renovations provides our team with utmost confidence in tackling any job related to Landmark renovation.",
      },
      {
        title: "Brownstones",
        body: "The brownstone style home is notorious in Brooklyn and NYC. Our team specializes in brownstone renovation. We ensure a quality renovation while emphasizing the preservation of the historical architecture that makes a brownstone a brownstone.",
      },
    ],
  },
  offerings: [
    {
      id: "outdoor",
      title: "Outdoor Remodeling",
      body: "Our masonry work speaks for itself. Nothing makes the outside of your home as beautiful as good brick work.",
      image: "/images/services/outdoor-masonry.jpg",
      width: 1214,
      height: 442,
      alt: "Before and after of outdoor masonry — rebuilt stone steps, brick wall, and integrated lighting",
    },
    {
      id: "interior",
      title: "Interior Remodeling",
      body: "From unfinished basements to finished living space, we remodel interiors to the same standard as the rest of the house — clean, durable, and built around how you live.",
      image: "/images/services/interior-before-after.jpg",
      width: 2400,
      height: 938,
      alt: "Before and after of a basement interior remodel — unfinished space finished into a livable suite",
    },
  ],
} as const;

export const testimonials = [
  {
    quote:
      "We loved Intown Consultants. Lucio was there every step of the way and the workers did an amazing job. They were so quiet sometimes we forgot that they were there. Even with demo going on, everyday the place was spotless. Without a doubt, I would recommend Intown. They will definitely be hired for more projects in the future.",
  },
  {
    quote:
      "Lucio and his crew were a pleasure to work with! Expert craftsmen! Absolutely reliable from start to finish! They were consummate professionals and we look forward to working with them again in the future!",
  },
  {
    quote:
      "We are very pleased with the work that we had done by Intown Consultants! Lucio and his crew are very professional, conscientious and courteous. With an eye to detail, they transformed our space and gave our home a new beginning. I would recommend them.",
  },
] as const;
