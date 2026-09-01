import { Product } from "./types";

export const PRODUCTS: Product[] = [
  {
    id: "aud-01",
    name: "Fieldstone Open-Back Headphones",
    price: 189,
    category: "audio",
    description:
      "Walnut ear cups with an open-back driver tuned for a wide, airy soundstage. Great for long listening sessions at a desk.",
    image:
      "https://images.unsplash.com/photo-1518444065439-e933c06ce9cd?w=600&q=80",
  },
  {
    id: "aud-02",
    name: "Companion Bluetooth Speaker",
    price: 79,
    category: "audio",
    description:
      "Pocket-sized speaker with 12 hours of battery and a fabric shell that survives the beach, the shower, and everything between.",
    image:
      "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=600&q=80",
  },
  {
    id: "aud-03",
    name: "Vinyl Turntable, Belt Drive",
    price: 249,
    category: "audio",
    description:
      "A no-fuss belt-drive turntable with a built-in preamp, so it plugs straight into any powered speaker.",
    image:
      "https://images.unsplash.com/photo-1461360370896-922624d12aa1?w=600&q=80",
  },
  {
    id: "kit-01",
    name: "Cast Iron Skillet, 10-inch",
    price: 45,
    category: "kitchen",
    description:
      "Pre-seasoned and ready for the stovetop or oven. Gets better with every meal you cook in it.",
    image:
      "https://images.unsplash.com/photo-1585837575652-267c041d77d4?w=600&q=80",
  },
  {
    id: "kit-02",
    name: "Pour-Over Coffee Set",
    price: 58,
    category: "kitchen",
    description:
      "Borosilicate glass carafe with a reusable stainless filter — no paper filters to restock.",
    image:
      "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&q=80",
  },
  {
    id: "kit-03",
    name: "Ceramic Knife Block Set",
    price: 96,
    category: "kitchen",
    description:
      "Five kitchen knives with ceramic blades that hold an edge far longer than steel, plus a matching oak block.",
    image:
      "https://images.unsplash.com/photo-1593618998160-e34014e67546?w=600&q=80",
  },
  {
    id: "kit-04",
    name: "Enamel Dutch Oven, 5.5 qt",
    price: 129,
    category: "kitchen",
    description:
      "Heavy-bottomed enamel pot for braises, stews, and no-knead bread. Oven safe to 500°F.",
    image:
      "https://images.unsplash.com/photo-1585515320310-259814833e62?w=600&q=80",
  },
  {
    id: "out-01",
    name: "Insulated Trail Bottle, 32oz",
    price: 34,
    category: "outdoors",
    description:
      "Keeps cold drinks cold for 24 hours and hot drinks hot for 12. Wide mouth fits standard ice cubes.",
    image:
      "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=600&q=80",
  },
  {
    id: "out-02",
    name: "3-Season Backpacking Tent",
    price: 219,
    category: "outdoors",
    description:
      "A 2-person freestanding tent that packs down to the size of a loaf of bread. Full-coverage rainfly included.",
    image:
      "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=600&q=80",
  },
  {
    id: "out-03",
    name: "Merino Wool Trail Socks (3-pack)",
    price: 28,
    category: "outdoors",
    description:
      "Cushioned merino blend that regulates temperature and resists odor on multi-day trips.",
    image:
      "https://images.unsplash.com/photo-1544441893-675973e31985?w=600&q=80",
  },
  {
    id: "desk-01",
    name: "Walnut Desk Organizer",
    price: 52,
    category: "desk",
    description:
      "Solid walnut tray with slots for pens, cards, and a phone stand cut at reading angle.",
    image:
      "https://images.unsplash.com/photo-1518481612222-68bbe828ecd1?w=600&q=80",
  },
  {
    id: "desk-02",
    name: "Mechanical Keyboard, Low-Profile",
    price: 139,
    category: "desk",
    description:
      "Hot-swappable switches in a compact 75% layout, with a milled aluminum frame that won't flex.",
    image:
      "https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&q=80",
  },
];

export function getProductById(id: string): Product | undefined {
  return PRODUCTS.find((p) => p.id === id);
}
