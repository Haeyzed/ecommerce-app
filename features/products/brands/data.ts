import type { Brand } from "./types"

export const brandsData: Brand[] = [
  {
    id: "1",
    name: "Acme",
    slug: "acme",
    short_description: "Quality products for everyone.",
    is_active: true,
    active_status: "active",
  },
  {
    id: "2",
    name: "Beta Brands",
    slug: "beta-brands",
    short_description: "Innovation in every item.",
    is_active: false,
    active_status: "inactive",
  },
  {
    id: "3",
    name: "Gamma Co",
    slug: "gamma-co",
    short_description: "Premium selection.",
    is_active: true,
    active_status: "active",
  },
  {
    id: "4",
    name: "Delta Goods",
    slug: "delta-goods",
    short_description: null,
    is_active: true,
    active_status: "active",
  },
]
