import { Product, ProductReview } from "@/types/store";

export const MOCK_REVIEWS: ProductReview[] = [
  {
    id: "rev-1",
    author: "Sneha R.",
    isVerified: true,
    rating: 5,
    date: "2 days ago",
    title: "Life saver for plantar fasciitis!",
    content:
      "I have flat feet and these socks are the only thing that actually helps with the pain. Wearing them every single day now after my hospital shifts.",
    colorPurchased: "Midnight Black",
    image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80",
    likes: 42,
  },
  {
    id: "rev-2",
    author: "Dr. Priyamvada T.",
    isVerified: true,
    rating: 5,
    date: "1 week ago",
    title: "Orthopedic surgeon approved",
    content:
      "I bought it for my mom who is facing foot pain from many months, even we consulted doctors no solution was found then I bought this amazing socks which relieved pain... Thank you Mytipe team.",
    colorPurchased: "Charcoal Grey",
    image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=600&auto=format&fit=crop&q=80",
    likes: 88,
  },
  {
    id: "rev-3",
    author: "Dinesh Mathur",
    isVerified: true,
    rating: 5,
    date: "2 weeks ago",
    title: "Relieved my bunion stiffness completely",
    content:
      "This is an excellent product. It frees and relaxing foot pain and most importantly toe numbness. It will take around 2-3 nights to see the results. The swelling in my feet is reduced and in the first 1 hr wear it will be pain and 8 hours it feels more energetic.",
    colorPurchased: "Sky Blue",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&auto=format&fit=crop&q=80",
    likes: 54,
  },
  {
    id: "rev-4",
    author: "Rohit M.",
    isVerified: true,
    rating: 5,
    date: "3 weeks ago",
    title: "Awesome for running recovery",
    content:
      "Bought for my mother. She says the knee pain has reduced significantly. Will buy more for the rest of our family.",
    colorPurchased: "Multi Colour",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=600&auto=format&fit=crop&q=80",
    likes: 31,
  },
  {
    id: "rev-5",
    author: "Ananya Gupta",
    isVerified: true,
    rating: 5,
    date: "1 month ago",
    title: "So cozy and therapeutic!",
    content:
      "After standing on my feet all day in the clinic, slipping these on gives immediate relief. The toe separation dividers feel gentle yet very effective.",
    colorPurchased: "Rose Pink",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&auto=format&fit=crop&q=80",
    likes: 19,
  },
  {
    id: "rev-6",
    author: "Vikram S.",
    isVerified: true,
    rating: 5,
    date: "1 month ago",
    title: "Amazing quality & fast delivery",
    content:
      "Received in 24 hours in Delhi. High quality plush cotton knit. The toe separators do not pinch and are comfortable even while sleeping.",
    colorPurchased: "Olive Green",
    likes: 15,
  }
];

export const MOCK_BUNDLE_TIERS = [
  {
    id: "tier-1",
    pairs: 1,
    title: "Buy 1 Pair",
    badge: "Standard",
    isPopular: false,
    pricePerPair: 999,
    totalPrice: 999,
    compareAtPrice: 1649,
    discountPercentage: 39,
    savings: 650,
  },
  {
    id: "tier-2",
    pairs: 2,
    title: "Buy 2 Pairs",
    badge: "MOST POPULAR",
    isPopular: true,
    pricePerPair: 749,
    totalPrice: 1499,
    compareAtPrice: 3298,
    discountPercentage: 55,
    savings: 1799,
  },
  {
    id: "tier-3",
    pairs: 3,
    title: "Buy 3 Pairs",
    badge: "BEST VALUE",
    isPopular: false,
    pricePerPair: 666,
    totalPrice: 1999,
    compareAtPrice: 4947,
    discountPercentage: 60,
    savings: 2948,
  },
];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "prod-1001",
    handle: "grey-foot-alignment-socks",
    title: "Grey Foot Alignment Socks",
    subtitle: "Original Anatomical Toe Separator & Pain Relief Socks",
    description:
      "The Mytipe Foot Alignment Socks are specifically designed with plush separator dividers to gently stretch, separate, and realign your toes. Relieve foot pain, bunions, plantar fasciitis, hammer toes, and general soreness from standing or walking all day.",
    availableForSale: true,
    priceRange: {
      minVariantPrice: { amount: "999.00", currencyCode: "INR" },
      maxVariantPrice: { amount: "1999.00", currencyCode: "INR" },
    },
    compareAtPriceRange: {
      minVariantPrice: { amount: "1649.00", currencyCode: "INR" },
      maxVariantPrice: { amount: "4947.00", currencyCode: "INR" },
    },
    featuredImage: {
      url: "https://images.unsplash.com/photo-1582965372486-6644f772e38c?w=800&auto=format&fit=crop&q=80",
      altText: "Mytipe Grey Foot Alignment Socks",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1582965372486-6644f772e38c?w=800&auto=format&fit=crop&q=80",
        altText: "Grey Foot Alignment Socks on feet",
      },
      {
        url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80",
        altText: "Grey Alignment Socks toe separator close-up",
      },
      {
        url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80",
        altText: "Lifestyle relaxing at home with Mytipe socks",
      },
      {
        url: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=800&auto=format&fit=crop&q=80",
        altText: "Comfortable toe stretch demonstration",
      },
    ],
    options: [
      {
        id: "opt-color",
        name: "Color",
        values: ["Charcoal Grey", "Midnight Black", "Sky Blue", "Multi Colour", "Olive Green", "Rose Pink"],
      },
      {
        id: "opt-size",
        name: "Size",
        values: ["Free Size (Fits All)"],
      },
    ],
    variants: [
      {
        id: "var-2001",
        title: "Charcoal Grey / Free Size",
        availableForSale: true,
        selectedOptions: [
          { name: "Color", value: "Charcoal Grey" },
          { name: "Size", value: "Free Size (Fits All)" },
        ],
        price: { amount: "999.00", currencyCode: "INR" },
        compareAtPrice: { amount: "1649.00", currencyCode: "INR" },
        image: {
          url: "https://images.unsplash.com/photo-1582965372486-6644f772e38c?w=800&auto=format&fit=crop&q=80",
          altText: "Charcoal Grey Socks",
        },
      },
      {
        id: "var-2002",
        title: "Midnight Black / Free Size",
        availableForSale: true,
        selectedOptions: [
          { name: "Color", value: "Midnight Black" },
          { name: "Size", value: "Free Size (Fits All)" },
        ],
        price: { amount: "999.00", currencyCode: "INR" },
        compareAtPrice: { amount: "1649.00", currencyCode: "INR" },
        image: {
          url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
          altText: "Midnight Black Socks",
        },
      },
      {
        id: "var-2003",
        title: "Sky Blue / Free Size",
        availableForSale: true,
        selectedOptions: [
          { name: "Color", value: "Sky Blue" },
          { name: "Size", value: "Free Size (Fits All)" },
        ],
        price: { amount: "999.00", currencyCode: "INR" },
        compareAtPrice: { amount: "1649.00", currencyCode: "INR" },
        image: {
          url: "https://images.unsplash.com/photo-1582965372486-6644f772e38c?w=800&auto=format&fit=crop&q=80",
          altText: "Sky Blue Socks",
        },
      },
      {
        id: "var-2004",
        title: "Multi Colour / Free Size",
        availableForSale: true,
        selectedOptions: [
          { name: "Color", value: "Multi Colour" },
          { name: "Size", value: "Free Size (Fits All)" },
        ],
        price: { amount: "999.00", currencyCode: "INR" },
        compareAtPrice: { amount: "1649.00", currencyCode: "INR" },
        image: {
          url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=80",
          altText: "Multi Colour Socks",
        },
      },
    ],
    tags: ["best-seller", "foot-pain", "toe-alignment", "socks", "featured"],
    collections: ["best-sellers", "foot-pain", "all-socks"],
    rating: {
      average: 4.9,
      count: 2702,
    },
    bundles: MOCK_BUNDLE_TIERS,
    highlights: [
      "Natural non-invasive alignment for crooked and crowded toes",
      "Instant relief from Plantar Fasciitis, Bunions & Heel Spurs",
      "Increases micro-circulation & reduces fluid retention swelling",
      "Plush 90% combed cotton blend with breathable stretch",
      "Wear while resting, watching TV, reading, or sleeping",
    ],
    painReliefPoints: [
      {
        title: "Plantar Fasciitis",
        description: "Gently elongates the plantar fascia ligament to eliminate morning heel stabbing pain.",
        icon: "bone",
      },
      {
        title: "Bunions (Hallux Valgus)",
        description: "Re-aligns the big toe into its natural axis, reducing friction and painful joint inflammation.",
        icon: "sparkles",
      },
      {
        title: "Hammer & Claw Toes",
        description: "Strengthens toe flexor tendons while correcting curling and overlapping deformities.",
        icon: "shield",
      },
      {
        title: "Heel & Arch Ache",
        description: "Evenly redistributes plantar pressure across all five metatarsal arches.",
        icon: "heart-pulse",
      },
      {
        title: "Poor Circulation",
        description: "Opens interdigital capillary pathways to warm cold feet and relieve numbness.",
        icon: "activity",
      },
      {
        title: "Knee & Hip Misalignment",
        description: "Correcting your foot stance restores kinetic chain balance all the way up to your lower back.",
        icon: "check-circle",
      },
    ],
    clinicalStats: [
      {
        percentage: "91%",
        label: "Pain Relief",
        description: "Reported noticeable foot & heel pain reduction within 7 consecutive days of usage.",
      },
      {
        percentage: "95%",
        label: "Toe Flexibility",
        description: "Observed increased toe spacing and decreased morning stiffness.",
      },
      {
        percentage: "98%",
        label: "Satisfaction Rate",
        description: "Would enthusiastically recommend Mytipe to friends and family members.",
      },
    ],
    faq: [
      {
        question: "How long should I wear them each day?",
        answer:
          "Start with 15-20 minutes while relaxing or watching TV. As your feet adapt and muscles relax, you can gradually increase time to 1-2 hours or wear them overnight while sleeping.",
      },
      {
        question: "Can I walk around with these socks on?",
        answer:
          "Mytipe socks are designed primarily for resting, relaxing, sitting, or sleeping. Light walking around the house is fine, but they are not intended for wearing inside shoes.",
      },
      {
        question: "What size should I choose?",
        answer:
          "Our socks feature an ergonomic ultra-stretch blend that fits all foot sizes comfortably (EU 35 - 45 / UK 3 - 11 / US 4 - 12 for both men and women).",
      },
      {
        question: "How do I wash and care for them?",
        answer:
          "Machine wash or hand wash in cold water on gentle cycle. Air dry flat to maintain the plush elasticity of the toe dividers.",
      },
      {
        question: "Is Cash on Delivery (COD) available?",
        answer:
          "Yes! We offer 100% Free Cash on Delivery (COD) and fast shipping across India with dispatch within 24 hours.",
      },
    ],
  },
  {
    id: "prod-1002",
    handle: "black-foot-alignment-socks",
    title: "Black Foot Alignment Socks",
    subtitle: "Classic Obsidian Edition • Deep Therapeutic Compression",
    description:
      "Our best-selling Black edition foot alignment socks combine sleek minimalism with deep therapeutic toe separation. Features premium cushioned separators that release pressure from the balls of your feet.",
    availableForSale: true,
    priceRange: {
      minVariantPrice: { amount: "999.00", currencyCode: "INR" },
      maxVariantPrice: { amount: "1999.00", currencyCode: "INR" },
    },
    compareAtPriceRange: {
      minVariantPrice: { amount: "1649.00", currencyCode: "INR" },
      maxVariantPrice: { amount: "4947.00", currencyCode: "INR" },
    },
    featuredImage: {
      url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
      altText: "Black Foot Alignment Socks",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
        altText: "Black Foot Alignment Socks top view",
      },
      {
        url: "https://images.unsplash.com/photo-1582965372486-6644f772e38c?w=800&auto=format&fit=crop&q=80",
        altText: "Black Foot Alignment Socks side profile",
      },
    ],
    options: [
      {
        id: "opt-color-black",
        name: "Color",
        values: ["Midnight Black"],
      },
      {
        id: "opt-size-black",
        name: "Size",
        values: ["Free Size (Fits All)"],
      },
    ],
    variants: [
      {
        id: "var-2005",
        title: "Midnight Black / Free Size",
        availableForSale: true,
        selectedOptions: [
          { name: "Color", value: "Midnight Black" },
          { name: "Size", value: "Free Size (Fits All)" },
        ],
        price: { amount: "999.00", currencyCode: "INR" },
        compareAtPrice: { amount: "1649.00", currencyCode: "INR" },
        image: {
          url: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?w=800&auto=format&fit=crop&q=80",
          altText: "Midnight Black",
        },
      },
    ],
    tags: ["best-seller", "foot-pain", "knee-pain", "featured"],
    collections: ["best-sellers", "foot-pain", "all-socks"],
    rating: {
      average: 5.0,
      count: 3195,
    },
    bundles: MOCK_BUNDLE_TIERS,
    highlights: [
      "Signature midnight black colorway - stain resistant & ultra chic",
      "Clinically engineered toe separator columns",
      "Immediate relief after long hours in tight shoes or heels",
    ],
  },
  {
    id: "prod-1003",
    handle: "blue-foot-alignment-socks",
    title: "Blue Foot Alignment Socks",
    subtitle: "Sky Wave Edition • Vibrant Cool Comfort",
    description:
      "Vibrant sky-blue foot alignment socks crafted from ultra-soft combed cotton. Gentle spacing relieves bunion pressure, improves toe mobility, and calms tired arches after active days.",
    availableForSale: true,
    priceRange: {
      minVariantPrice: { amount: "999.00", currencyCode: "INR" },
      maxVariantPrice: { amount: "1999.00", currencyCode: "INR" },
    },
    compareAtPriceRange: {
      minVariantPrice: { amount: "1649.00", currencyCode: "INR" },
      maxVariantPrice: { amount: "4947.00", currencyCode: "INR" },
    },
    featuredImage: {
      url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
      altText: "Blue Foot Alignment Socks",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
        altText: "Blue Foot Alignment Socks",
      },
    ],
    options: [
      {
        id: "opt-color-blue",
        name: "Color",
        values: ["Sky Blue"],
      },
      {
        id: "opt-size-blue",
        name: "Size",
        values: ["Free Size (Fits All)"],
      },
    ],
    variants: [
      {
        id: "var-2006",
        title: "Sky Blue / Free Size",
        availableForSale: true,
        selectedOptions: [
          { name: "Color", value: "Sky Blue" },
          { name: "Size", value: "Free Size (Fits All)" },
        ],
        price: { amount: "999.00", currencyCode: "INR" },
        compareAtPrice: { amount: "1649.00", currencyCode: "INR" },
        image: {
          url: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&auto=format&fit=crop&q=80",
          altText: "Sky Blue",
        },
      },
    ],
    tags: ["new-arrivals", "foot-pain", "ankle-pain", "featured"],
    collections: ["new-arrivals", "foot-pain", "all-socks"],
    rating: {
      average: 4.9,
      count: 2212,
    },
    bundles: MOCK_BUNDLE_TIERS,
    highlights: [
      "Breathable and cooling cotton yarn structure",
      "Ergonomic open-toe front allows natural temperature control",
      "Gentle spacing encourages blood flow",
    ],
  },
  {
    id: "prod-1004",
    handle: "multi-colour-foot-alignment-socks",
    title: "Multi Colour Foot Alignment Socks",
    subtitle: "Rainbow Fusion Edition • Joyful Therapy",
    description:
      "Brighten your recovery routine with our vibrant Multi-Colour Foot Alignment Socks. Features multi-hued toe separators with soothing cotton weave for maximum comfort.",
    availableForSale: true,
    priceRange: {
      minVariantPrice: { amount: "999.00", currencyCode: "INR" },
      maxVariantPrice: { amount: "1999.00", currencyCode: "INR" },
    },
    compareAtPriceRange: {
      minVariantPrice: { amount: "1649.00", currencyCode: "INR" },
      maxVariantPrice: { amount: "4947.00", currencyCode: "INR" },
    },
    featuredImage: {
      url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=80",
      altText: "Multi Colour Foot Alignment Socks",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=80",
        altText: "Multi Colour Foot Alignment Socks",
      },
    ],
    options: [
      {
        id: "opt-color-multi",
        name: "Color",
        values: ["Multi Colour"],
      },
      {
        id: "opt-size-multi",
        name: "Size",
        values: ["Free Size (Fits All)"],
      },
    ],
    variants: [
      {
        id: "var-2007",
        title: "Multi Colour / Free Size",
        availableForSale: true,
        selectedOptions: [
          { name: "Color", value: "Multi Colour" },
          { name: "Size", value: "Free Size (Fits All)" },
        ],
        price: { amount: "999.00", currencyCode: "INR" },
        compareAtPrice: { amount: "1649.00", currencyCode: "INR" },
        image: {
          url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=80",
          altText: "Multi Colour",
        },
      },
    ],
    tags: ["best-seller", "new-arrivals", "foot-pain", "body-pain", "featured"],
    collections: ["best-sellers", "new-arrivals", "all-socks"],
    rating: {
      average: 5.0,
      count: 2905,
    },
    bundles: MOCK_BUNDLE_TIERS,
    highlights: [
      "Playful rainbow toe dividers with individual pressure calibration",
      "Reduces foot fatigue after workouts and sports",
      "Soft brushed interior prevents friction",
    ],
  },
  {
    id: "prod-1005",
    handle: "olive-green-foot-alignment-socks",
    title: "Olive Green Foot Alignment Socks",
    subtitle: "Earthy Comfort • Organic Botanical Vibe",
    description:
      "Serene olive green alignment socks designed to ground your daily wellness routine. Therapeutic toe spacing releases pent-up tension along the plantar fascia.",
    availableForSale: true,
    priceRange: {
      minVariantPrice: { amount: "999.00", currencyCode: "INR" },
      maxVariantPrice: { amount: "1999.00", currencyCode: "INR" },
    },
    compareAtPriceRange: {
      minVariantPrice: { amount: "1649.00", currencyCode: "INR" },
      maxVariantPrice: { amount: "4947.00", currencyCode: "INR" },
    },
    featuredImage: {
      url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80",
      altText: "Olive Green Foot Alignment Socks",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80",
        altText: "Olive Green Foot Alignment Socks",
      },
    ],
    options: [
      {
        id: "opt-color-olive",
        name: "Color",
        values: ["Olive Green"],
      },
      {
        id: "opt-size-olive",
        name: "Size",
        values: ["Free Size (Fits All)"],
      },
    ],
    variants: [
      {
        id: "var-2008",
        title: "Olive Green / Free Size",
        availableForSale: true,
        selectedOptions: [
          { name: "Color", value: "Olive Green" },
          { name: "Size", value: "Free Size (Fits All)" },
        ],
        price: { amount: "999.00", currencyCode: "INR" },
        compareAtPrice: { amount: "1649.00", currencyCode: "INR" },
        image: {
          url: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=800&auto=format&fit=crop&q=80",
          altText: "Olive Green",
        },
      },
    ],
    tags: ["new-arrivals", "foot-pain", "knee-pain"],
    collections: ["new-arrivals", "knee-pain", "all-socks"],
    rating: {
      average: 4.9,
      count: 1840,
    },
    bundles: MOCK_BUNDLE_TIERS,
    highlights: [
      "Natural earthy tone with high aesthetic appeal",
      "Soft padded toe separators relieve joint pressure",
      "Helps improve body posture and gait",
    ],
  },
  {
    id: "prod-1006",
    handle: "rose-pink-foot-alignment-socks",
    title: "Rose Pink Foot Alignment Socks",
    subtitle: "Blush Wellness • Delicate Softness",
    description:
      "Indulge your tired feet in gentle rose pink alignment comfort. Perfectly calibrated dividers restore proper natural spacing between tight, congested toes.",
    availableForSale: true,
    priceRange: {
      minVariantPrice: { amount: "999.00", currencyCode: "INR" },
      maxVariantPrice: { amount: "1999.00", currencyCode: "INR" },
    },
    compareAtPriceRange: {
      minVariantPrice: { amount: "1649.00", currencyCode: "INR" },
      maxVariantPrice: { amount: "4947.00", currencyCode: "INR" },
    },
    featuredImage: {
      url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80",
      altText: "Rose Pink Foot Alignment Socks",
    },
    images: [
      {
        url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80",
        altText: "Rose Pink Foot Alignment Socks",
      },
    ],
    options: [
      {
        id: "opt-color-pink",
        name: "Color",
        values: ["Rose Pink"],
      },
      {
        id: "opt-size-pink",
        name: "Size",
        values: ["Free Size (Fits All)"],
      },
    ],
    variants: [
      {
        id: "var-2009",
        title: "Rose Pink / Free Size",
        availableForSale: true,
        selectedOptions: [
          { name: "Color", value: "Rose Pink" },
          { name: "Size", value: "Free Size (Fits All)" },
        ],
        price: { amount: "999.00", currencyCode: "INR" },
        compareAtPrice: { amount: "1649.00", currencyCode: "INR" },
        image: {
          url: "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80",
          altText: "Rose Pink",
        },
      },
    ],
    tags: ["new-arrivals", "foot-pain", "ankle-pain"],
    collections: ["new-arrivals", "ankle-pain", "all-socks"],
    rating: {
      average: 4.9,
      count: 1520,
    },
    bundles: MOCK_BUNDLE_TIERS,
    highlights: [
      "Ultra-soft blush weave that feels gentle on sensitive skin",
      "Helps prevent overlapping toes and corns",
      "Easy slip-on fit for home relaxation",
    ],
  },
];

import {
  getAllProducts as getDbProducts,
  getProductByHandle as getDbProductByHandle,
} from "@/server/db/products";

export function getProductByHandle(handle: string): Product | undefined {
  return getDbProductByHandle(handle) || MOCK_PRODUCTS.find((p) => p.handle === handle);
}

export function getAllProducts(): Product[] {
  const dbProducts = getDbProducts();
  return dbProducts.length > 0 ? dbProducts : MOCK_PRODUCTS;
}

export function getFeaturedProducts(tag?: string): Product[] {
  const all = getAllProducts();
  if (!tag) return all;
  return all.filter((p) => p.tags.includes(tag) || p.collections?.includes(tag));
}

