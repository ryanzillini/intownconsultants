export const siteConfig = {
  name: "Intown Consultants Inc.",
  shortName: "Intown Consultants",
  tagline: "Your vision is our goal",
  description:
    "NYC-based, fully licensed and insured construction company specializing in residential renovations, historic brownstones, and landmark properties.",
  phone: "718-836-3400",
  phoneLabel: "Office",
  phoneCell: "347-885-6700",
  phoneCellLabel: "Lucio cell",
  email: "Intownconsultants@gmail.com",
  address: "6921 8th Avenue, Brooklyn, NY 10468",
  domain: "intowninc.com",
  nav: [
    { href: "/", label: "Home" },
    { href: "/services", label: "Services" },
    { href: "/projects", label: "Projects" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact" },
  ],
} as const;

export const aboutCopy = {
  heading: "About Us",
  body: "Based in NYC, we are a fully licensed and insured construction company specializing in residential renovations. Our company is built on the expertise of our skilled workers, who bring more than 30 years of hands-on experience to every single job. We handle everything from full-gut remodels to kitchen and bathroom updates. We also specialize in historic brownstones and landmark properties, as well as professional masonry and stucco work. We are dedicated to delivering reliable, high-quality craftsmanship that brings your vision to life.",
} as const;

export const homeownerService = {
  heading: "Homeowner Service",
  body: "We offer expert homeowner pre-buying inspections and advice — including specialized chimney and sewer inspections — to identify structural flaws before you commit. Whether you are buying, investing, or planning a renovation, we help you see the building clearly.",
} as const;

export const servicesPage = {
  intro:
    "Landmark renovation is our specialty. Exterior masonry, interiors, and homeowner inspections round out a full-service practice across Brooklyn.",
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
  capabilities: [
    {
      title: "Regulatory & DOB",
      body: "In-house architectural and engineering expertise for complex approvals, DOB violations, and landmark buildings — so your project stays compliant from start to finish.",
    },
    {
      title: "Homeowner Inspections",
      body: "Pre-buying inspections and advice for homeowners and investors, including chimney and sewer inspections that surface structural flaws before they become surprises.",
    },
  ],
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

export function telHref(phone: string) {
  return `tel:${phone.replace(/\D/g, "")}`;
}
