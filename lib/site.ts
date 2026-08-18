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
