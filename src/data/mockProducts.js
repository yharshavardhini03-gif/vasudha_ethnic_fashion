export const MOCK_PRODUCTS = [
  {
    id: "VE001",
    name: "Royal Orange & Lavender Silk Half Saree",
    slug: "royal-orange-lavender-silk-half-saree",
    category: "Sarees",
    subCategory: "Half Sarees",
    price: 3899,
    originalPrice: 5999,
    rating: 4.9,
    reviewCount: 48,
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    tag: "Exclusive Weave",
    fabric: "Silk",
    color: "Orange & Lavender",
    colorHex: "#EA580C",
    colors: ["Orange", "Lavender", "Gold"],
    sizes: ["Free Size"],
    variants: [
      { size: "Free Size", color: "Orange & Lavender", stock: 6 },
      { size: "Free Size", color: "Gold", stock: 3 }
    ],
    stock: 9,
    sku: "VE-HS-001",
    images: [
      "/half-saree-orange.jpg",
      "/half-saree-kalamkari.jpg"
    ],
    description: "An authentic Vasudha half saree featuring a radiant pleated lavender zari skirt with rich golden border, complemented by a vibrant orange silk drape and designer embroidered blouse piece.",
    details: [
      "Authentic Vasudha handloom pure silk weave",
      "Heavy zari temple border with check grid brocade",
      "Includes embellished unstitched blouse fabric",
      "Kakinada flagship boutique edition",
      "Less is more, except when it comes to sarees"
    ],
    care: [
      "Dry clean only",
      "Wrap in breathable muslin cover",
      "Iron on low silk heat with protective cloth"
    ],
    delivery: {
      time: "3–5 days",
      shippingCharge: 99,
      freeThreshold: 999,
      returnAvailable: true,
      returnPeriod: "7 days"
    },
    published: true,
    createdAt: "2026-09-18",
    occasions: ["Half Saree Function", "Weddings", "Festive Celebrations", "Grand Poojas"]
  },
  {
    id: "VE002",
    name: "Crimson Tiered Valentine's Festive Dress",
    slug: "crimson-tiered-valentines-festive-dress",
    category: "Dresses",
    subCategory: "Western & Festive Dresses",
    price: 2499,
    originalPrice: 3499,
    rating: 4.8,
    reviewCount: 36,
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    tag: "Valentine's Top Pick",
    fabric: "Georgette",
    color: "Crimson Red",
    colorHex: "#991B1B",
    colors: ["Crimson Red", "Wine"],
    sizes: ["XS", "S", "M", "L", "XL"],
    variants: [
      { size: "XS", color: "Crimson Red", stock: 3 },
      { size: "S", color: "Crimson Red", stock: 5 },
      { size: "M", color: "Crimson Red", stock: 6 },
      { size: "L", color: "Crimson Red", stock: 4 },
      { size: "XL", color: "Crimson Red", stock: 2 }
    ],
    stock: 20,
    sku: "VE-DRS-002",
    images: [
      "/crimson-tier-dress.jpg"
    ],
    description: "Make a memorable statement in this flowy crimson tiered boutique dress from Vasudha. Featuring shoulder tie straps, subtle polka self-embroidery, and tiered layers designed for festive romance and modern gatherings.",
    details: [
      "Multi-tiered cascading maxi silhouette",
      "Adjustable shoulder tie-up straps",
      "Breathable lightweight georgette with soft lining",
      "Love starts with the right look — Vasudha Top Pick"
    ],
    care: [
      "Gentle hand wash or dry clean",
      "Line dry in shade",
      "Low temperature steam iron"
    ],
    delivery: {
      time: "3–5 days",
      shippingCharge: 99,
      freeThreshold: 999,
      returnAvailable: true,
      returnPeriod: "7 days"
    },
    published: true,
    createdAt: "2026-09-18",
    occasions: ["Valentine Celebrations", "Evening Soiree", "Casual Luxury", "Festive Dinners"]
  },
  {
    id: "VE003",
    name: "Breathable Cotton Churidar & Kurti Suit",
    slug: "breathable-cotton-churidar-kurti-suit",
    category: "Kurtis",
    subCategory: "Churidar Sets",
    price: 1999,
    originalPrice: 2899,
    rating: 4.7,
    reviewCount: 29,
    isNew: false,
    isBestSeller: true,
    isFeatured: true,
    tag: "Breathable Cotton",
    fabric: "Cotton",
    color: "Coral Rust",
    colorHex: "#C2410C",
    colors: ["Coral Rust", "Ivory"],
    sizes: ["S", "M", "L", "XL"],
    variants: [
      { size: "S", color: "Coral Rust", stock: 4 },
      { size: "M", color: "Coral Rust", stock: 6 },
      { size: "L", color: "Coral Rust", stock: 5 },
      { size: "XL", color: "Coral Rust", stock: 3 }
    ],
    stock: 18,
    sku: "VE-CHU-003",
    images: [
      "/cotton-churidar-rust.jpg"
    ],
    description: "Effortless elegance in pure breathable cotton. Features an intricately embroidered yoke neckline with zardozi threadwork, tailored fitted churidar bottoms, and a lightweight floral artisan dupatta.",
    details: [
      "100% fine breathable cotton weave",
      "Intricate floral yoke hand-embroidery",
      "Matching gathered churidar with stretch comfort",
      "Includes full-length floral botanical dupatta"
    ],
    care: ["Gentle machine or hand wash", "Iron while damp for crisp finish"],
    delivery: {
      time: "3–5 days",
      shippingCharge: 99,
      freeThreshold: 999,
      returnAvailable: true,
      returnPeriod: "7 days"
    },
    published: true,
    createdAt: "2026-09-18",
    occasions: ["Daily Elegance", "Workwear", "Festive Gatherings", "Poojas"]
  },
  {
    id: "VE004",
    name: "Royal Gulabi Handcrafted Wedding Lehenga",
    slug: "royal-gulabi-handcrafted-wedding-lehenga",
    category: "Lehengas",
    subCategory: "Bridal Collection",
    price: 8499,
    originalPrice: 12999,
    rating: 5.0,
    reviewCount: 42,
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    tag: "Wedding Collection",
    fabric: "Silk",
    color: "Gulabi Pink",
    colorHex: "#DB2777",
    colors: ["Gulabi Pink", "Magenta"],
    sizes: ["S", "M", "L"],
    variants: [
      { size: "S", color: "Gulabi Pink", stock: 2 },
      { size: "M", color: "Gulabi Pink", stock: 4 },
      { size: "L", color: "Gulabi Pink", stock: 2 }
    ],
    stock: 8,
    sku: "VE-WED-004",
    images: [
      "/hero-main.jpg",
      "/bridal-lehenga-pastel.jpg"
    ],
    description: "A signature masterpiece from the Vasudha Wedding Collection. Crafted in luscious royal gulabi pink with full all-over floral silver and gold threadwork, paired with a sheer embellished veil dupatta.",
    details: [
      "Massive 5.5m circular flare with internal can-can structure",
      "All-over floral mandala embroidery and sequin embellishments",
      "Tailored sweetheart blouse with sheer embroidered sleeves",
      "Vasudha Bright & Beautiful Wedding Collection Edition"
    ],
    care: ["Specialist dry cleaning only", "Store in keepsake preservation box"],
    delivery: {
      time: "3–5 days",
      shippingCharge: 99,
      freeThreshold: 999,
      returnAvailable: true,
      returnPeriod: "7 days"
    },
    published: true,
    createdAt: "2026-09-18",
    occasions: ["Wedding Bride", "Sangeet Night", "Reception", "Engagement"]
  },
  {
    id: "VE005",
    name: "Heritage Kalamkari Border Half Saree Duo",
    slug: "heritage-kalamkari-border-half-saree-duo",
    category: "Sarees",
    subCategory: "Exclusive Half Sarees",
    price: 4499,
    originalPrice: 6299,
    rating: 4.9,
    reviewCount: 38,
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    tag: "The Art of Tradition",
    fabric: "Silk",
    color: "Rani Pink & Antique Olive",
    colorHex: "#BE185D",
    colors: ["Rani Pink", "Antique Olive"],
    sizes: ["Free Size"],
    variants: [
      { size: "Free Size", color: "Rani Pink", stock: 5 },
      { size: "Free Size", color: "Antique Olive", stock: 4 }
    ],
    stock: 9,
    sku: "VE-HS-005",
    images: [
      "/half-saree-kalamkari.jpg",
      "/half-saree-orange.jpg"
    ],
    description: "A tribute to timeless Indian heritage. Features a pleated brocade silk lehenga skirt with magnificent golden zari borders, styled with an authentic Kalamkari printed pallu drape and waist belt.",
    details: [
      "Traditional South Indian half saree with Kalamkari storytelling border",
      "Rich brocade pleating in dual color options (Pink & Olive)",
      "Includes ornate waist kamarbandh styling & unstitched blouse",
      "The art of tradition, always in style — Vasudha Exclusive"
    ],
    care: ["Dry clean only", "Store in clean cotton cloth", "Low heat iron"],
    delivery: {
      time: "3–5 days",
      shippingCharge: 99,
      freeThreshold: 999,
      returnAvailable: true,
      returnPeriod: "7 days"
    },
    published: true,
    createdAt: "2026-09-18",
    occasions: ["Festive Receptions", "Half Saree Ceremony", "Temple Events", "Weddings"]
  },
  {
    id: "VE006",
    name: "Pastel Sky Blue Handcrafted Bridal Lehanga",
    slug: "pastel-sky-blue-handcrafted-bridal-lehanga",
    category: "Lehengas",
    subCategory: "Bridal Lehengas",
    price: 9999,
    originalPrice: 14999,
    rating: 5.0,
    reviewCount: 33,
    isNew: true,
    isBestSeller: true,
    isFeatured: true,
    tag: "Be The Best Bride",
    fabric: "Silk",
    color: "Sky Blue",
    colorHex: "#38BDF8",
    colors: ["Sky Blue", "Mint Aqua"],
    sizes: ["XS", "S", "M", "L", "XL"],
    variants: [
      { size: "XS", color: "Sky Blue", stock: 2 },
      { size: "S", color: "Sky Blue", stock: 3 },
      { size: "M", color: "Sky Blue", stock: 4 },
      { size: "L", color: "Sky Blue", stock: 2 }
    ],
    stock: 11,
    sku: "VE-LHG-006",
    images: [
      "/bridal-lehenga-pastel.jpg",
      "/hero-main.jpg"
    ],
    description: "Ethereal pastel sky blue bridal lehanga with intricate silver and champagne zari filigree. Designed with a peacock motif embroidered blouse and a delicate sheer net veil for the contemporary royal bride.",
    details: [
      "Intricate hand-embroidered peacock & floral zari detailing",
      "Full circular flare with heavy scalloped hemline",
      "Includes sheer matching bridal veil dupatta and structured blouse",
      "Be the best bride that you can be — Vasudha Atelier"
    ],
    care: ["Specialist dry clean only", "Keep away from moisture & harsh perfumes"],
    delivery: {
      time: "3–5 days",
      shippingCharge: 99,
      freeThreshold: 999,
      returnAvailable: true,
      returnPeriod: "7 days"
    },
    published: true,
    createdAt: "2026-09-18",
    occasions: ["Bridal Day", "Grand Reception", "Engagement", "Sangeet"]
  }
];

export const ALL_CATEGORIES = ["All", "Sarees", "Kurtis", "Dresses", "Lehengas", "Ethnic Sets", "Tops", "New Arrivals"];

export const ALL_FABRICS = [
  "Cotton",
  "Silk",
  "Georgette",
  "Chiffon",
  "Linen",
  "Rayon",
  "Other"
];

export const ALL_SIZES = ["XS", "S", "M", "L", "XL", "XXL", "Free Size"];

export const DEFAULT_COLORS = [
  { name: "Green", hex: "#0C3B10" },
  { name: "Gold", hex: "#DBAB7D" },
  { name: "Blue", hex: "#1E3A8A" },
  { name: "Pink", hex: "#EC4899" },
  { name: "Red", hex: "#DC2626" },
  { name: "Black", hex: "#111827" },
  { name: "Maroon", hex: "#881337" },
  { name: "Ivory", hex: "#F3ECE2" }
];
