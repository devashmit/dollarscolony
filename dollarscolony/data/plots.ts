export interface PlotCollection {
  id: string
  name: string
  subtitle: string
  sizeRange: string
  idealFor: string
  description: string
  featured: boolean
  badge?: string
}

export const plotCollections: PlotCollection[] = [
  {
    id: "lifestyle",
    name: "Lifestyle Collection",
    subtitle: "Start Your Coastal Story",
    sizeRange: "2000 - 3000 Sq.Ft.",
    idealFor: "First-time buyers & holiday home seekers",
    description:
      "Thoughtfully sized plots for those beginning their coastal villa journey. Available primarily in Blocks D and E, these plots are ideal for compact, well-designed homes with private gardens and full community access.",
    featured: false,
  },
  {
    id: "premium",
    name: "Premium Collection",
    subtitle: "The Signature of Choice",
    sizeRange: "3500 Sq.Ft.",
    idealFor: "Families seeking generous space & privacy",
    description:
      "Our most sought-after collection. Premium-sized plots found across Blocks A, B, and C with ample room for a grand villa, manicured grounds, and the coastal lifestyle you deserve.",
    featured: true,
    badge: "Most Popular",
  },
  {
    id: "signature",
    name: "Signature Collection",
    subtitle: "Where Land Meets Legacy",
    sizeRange: "3500+ Sq.Ft.",
    idealFor: "Discerning buyers & legacy investors",
    description:
      "The pinnacle of Dollars Colony. Signature plots located in prime positions within Blocks A, B, and C offer maximum land area, absolute privacy, and the ultimate canvas for your dream coastal estate.",
    featured: false,
  },
]
