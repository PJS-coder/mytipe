export interface FAQItem {
  question: string;
  answer: string;
}

export const NORMAL_SOCKS_FAQS: FAQItem[] = [
  {
    question: "Can I wear these socks all day with regular shoes and sneakers?",
    answer:
      "Yes, absolutely! Unlike therapeutic alignment socks, Mytipe everyday socks are engineered specifically for full-day wear inside formal shoes, running sneakers, gym footwear, and casual loafers without bunching or friction.",
  },
  {
    question: "Do these socks slip down inside shoes while walking or working out?",
    answer:
      "No. Each pair features a reinforced Y-stitched heel pocket, elastic arch compression band, and anti-slip ribbed cuffs that hug your feet snugly to ensure they stay firmly in place all day.",
  },
  {
    question: "How breathable are they for sweaty feet or long workdays?",
    answer:
      "Crafted from 100% premium combed cotton with targeted micro-mesh ventilation channels, they actively wick away moisture and allow continuous air circulation to keep your feet cool, fresh, and dry.",
  },
  {
    question: "Will they shrink or lose their elasticity after washing?",
    answer:
      "No. Our premium combed cotton and elastane blend is pre-shrunk and durable. Simply machine wash in cold water on a gentle cycle and air dry or tumble dry low to maintain their shape wash after wash.",
  },
  {
    question: "What shoe sizes do these socks fit?",
    answer:
      "Our flexible 4-way stretch knit comfortably fits men and women from UK/India shoe sizes 6 to 11.",
  },
];

export const MEDICINE_SOCKS_FAQS: FAQItem[] = [
  {
    question: "What makes Mytipe Medicine & Health Socks different from normal socks?",
    answer:
      "Our Health Socks feature an ultra-gentle, non-binding top cuff that never pinches or leaves deep marks, smooth seamless toe stitching to prevent friction blisters, and antimicrobial yarn for maximum skin protection.",
  },
  {
    question: "Are these socks suitable for diabetic patients and swollen feet/edema?",
    answer:
      "Yes. They are medically inspired to support healthy blood flow without constricting circulation, making them ideal for diabetes care, swollen ankles, edema, varicose veins, and sensitive neuropathy feet.",
  },
  {
    question: "Can I wear these medicine socks all day inside regular shoes?",
    answer:
      "Yes! They are designed for all-day daily wear at home, in the office, or for walking. The cushioned terry footbed absorbs ground impact and shields sensitive pressure points.",
  },
  {
    question: "How do these socks prevent foot infections and bad odor?",
    answer:
      "The breathable combed cotton is treated with natural antimicrobial actives that actively inhibit bacterial growth, preventing odor, fungal buildup, and moisture accumulation.",
  },
  {
    question: "How should I wash and care for Health Socks?",
    answer:
      "Machine wash on a gentle cycle or hand wash in cold/lukewarm water with mild detergent. Avoid bleach and high-heat drying to preserve the therapeutic non-constricting elasticity.",
  },
];

export const ALIGNMENT_SOCKS_FAQS: FAQItem[] = [
  {
    question: "How long should I wear Mytipe Alignment Socks each day?",
    answer:
      "Start with 15–30 minutes per day while resting or sitting. As your toes and foot muscles naturally adjust, gradually increase wear time to 1–2 hours or overnight while sleeping.",
  },
  {
    question: "Can I wear these alignment socks inside regular shoes?",
    answer:
      "No. These therapeutic toe-separator socks are designed with padded toe dividers to gently stretch and realign your toes. They are intended for barefoot use at home while resting, relaxing on the couch, sleeping, or during yoga.",
  },
  {
    question: "How do these socks help relieve bunions, plantar fasciitis, and foot pain?",
    answer:
      "The soft cushioned dividers gently separate overlapping toes, decompressing joint stress, stretching tight tendons, and restoring natural arch alignment to relieve heel, arch, and ball-of-foot pressure.",
  },
  {
    question: "Will it feel uncomfortable when I first start wearing them?",
    answer:
      "It is normal to feel a gentle stretching sensation initially as compressed toes adjust. If it feels too tight, wear them for just 10–15 minutes at first and build up duration gradually.",
  },
  {
    question: "How should I wash and care for my alignment socks?",
    answer:
      "Hand wash or machine wash in cold water on a delicate cycle using mild detergent. Air dry flat in shade to keep the plush toe separators in optimal shape.",
  },
];

export const CARE_KITS_FAQS: FAQItem[] = [
  {
    question: "What comes inside this Mytipe Care Kit?",
    answer:
      "Each kit combines our top-rated therapeutic socks, everyday breathable socks, and our natural botanical Foot & Shoe Deo for a complete 360° daily foot wellness routine.",
  },
  {
    question: "How do I incorporate the kit into my daily routine?",
    answer:
      "Wear the everyday socks during work or gym, spray the botanical Deo on feet and inside shoes for 24-hr freshness, and wear the therapeutic socks at night while resting to decompress tired feet.",
  },
  {
    question: "Can I gift this care kit to friends or family?",
    answer:
      "Absolutely! Every kit is packaged in premium gift-ready unboxing packaging, making it a thoughtful health and wellness gift for parents, athletes, or anyone on their feet all day.",
  },
];

export const DEO_FAQS: FAQItem[] = [
  {
    question: "How does MYTIPE Foot & Shoe Deo eliminate bad odour?",
    answer:
      "It kills odour-causing bacteria directly at the source using natural Neem and Tea Tree actives, rather than just masking the smell with artificial scents.",
  },
  {
    question: "Can I spray it directly on my feet and inside my shoes?",
    answer:
      "Yes! The gentle, non-irritating formula is 100% skin and footwear lining safe. Spray evenly across your feet, toes, and inside your shoes or sneakers.",
  },
  {
    question: "What natural key ingredients give it odour-removing power?",
    answer:
      "It is formulated with 4 potent natural botanical actives: Neem (kills odour-causing bacteria & prevents fungal growth), Tea Tree (fights germs and sweat), Lemongrass (neutralizes bad smell), and Peppermint (cools feet and adds instant freshness).",
  },
  {
    question: "Is this suitable for everyday hygiene?",
    answer:
      "Absolutely! Use daily before putting on shoes or after work/workout for 24-hour freshness.",
  },
];

/**
 * Returns the exact tailored FAQ list for any product based on its category
 * (Deo, Medicine/Health, Alignment, Care Kit, or Normal Everyday socks).
 */
export function getProductFaqs(product: {
  handle?: string;
  title?: string;
  collections?: string[];
  faq?: FAQItem[];
}): FAQItem[] {
  const h = (product.handle || "").toLowerCase();
  const t = (product.title || "").toLowerCase();
  const c = (product.collections || []).map((x) => x.toLowerCase());

  // 1. Foot & Shoe Deo
  if (h.includes("deo") || t.includes("deo")) {
    return DEO_FAQS;
  }

  // 2. Alignment / Toe-separator Socks
  if (
    h.includes("alignment") ||
    t.includes("alignment") ||
    h.includes("pain-relief") ||
    t.includes("pain relief")
  ) {
    return ALIGNMENT_SOCKS_FAQS;
  }

  // 3. Medicine / Health / Diabetic Socks
  if (
    h.includes("health") ||
    t.includes("health") ||
    c.includes("diabetic-socks") ||
    t.includes("diabetic") ||
    h.includes("diabetic")
  ) {
    return MEDICINE_SOCKS_FAQS;
  }

  // 4. Care Kits & Gift Bundles
  if (
    c.includes("mytipe-foot-care-kits") ||
    h.includes("kit") ||
    t.includes("kit") ||
    h.includes("gift-box") ||
    t.includes("gift box")
  ) {
    return CARE_KITS_FAQS;
  }

  // 5. Normal / Everyday / Office / Gym / Ankle / Low-Cut Socks
  return NORMAL_SOCKS_FAQS;
}

