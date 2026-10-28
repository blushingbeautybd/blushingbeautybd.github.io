/* =========================================================
   Blushing Beauty — DEFAULT shop settings and products
   ---------------------------------------------------------
   Easiest way to change anything: open admin.html.

   - Cloud mode (Supabase set in cloud-config.js): admin saves
     go live for every customer. This file is only the backup
     the site falls back to if the cloud can't be reached.
   - Local mode: admin lets you download a new copy of this
     file. Replace this file with it and re-upload the site.

   price: number  -> shown on the site, can be added to cart
   price: null    -> shows "Ask price" and opens WhatsApp
   ========================================================= */

window.SHOP = {
  name: "Blushing Beauty",
  whatsapp: "8801684287215",          // country code + number, no "+" or spaces
  phoneDisplay: "+880 1684-287215",
  phoneTel: "+8801684287215",
  facebookUrl: "",                    // e.g. "https://www.facebook.com/yourpage" (leave "" to hide)
  messengerUrl: "",                   // e.g. "https://m.me/yourpage"          (leave "" to hide)
  address: {
    bn: "আরাবাড়ি মাদ্রাসা রোড, কোনাপাড়া, যাত্রাবাড়ী, ঢাকা ১২২৯",
    en: "Arabari Madrasah Road, Konapara, Jatrabari, Dhaka 1229"
  },
  mapQuery: "Konapara, Jatrabari, Dhaka 1229",
  delivery: [
    { id: "inside",  label: { bn: "ঢাকার ভিতরে",  en: "Inside Dhaka"  }, fee: 80  },
    { id: "outside", label: { bn: "ঢাকার বাইরে", en: "Outside Dhaka" }, fee: 130 }
  ],
  braSizes: ["32", "34", "36", "38", "40"],
  instagramUrl: "",
  tiktokUrl: "",
  youtubeUrl: "",
  defaultLang: "en",                  // "en" or "bn": language a first-time visitor sees

  /* Hero slides. image: wide photo with the product on the right side.
     imageMobile (optional): tall photo for phones, product at the bottom,
     plain soft area at the top for the text.
     No image -> the slide shows photos of the products in `collage` category. */
  banners: [
    {
      id: "b1", image: "images/hero-1.jpg", imageMobile: "images/hero-1-mobile.jpg", collage: "",
      label: { en: "Premium Lingerie & Beauty Essentials", bn: "প্রিমিয়াম লঞ্জেরি ও বিউটি" },
      title: { en: "Blushing Beauty", bn: "Blushing Beauty" },
      script: "Comfort That Hugs You Back",
      sub: { en: "Soft \u2022 Breathable \u2022 Premium Quality", bn: "নরম \u2022 আরামদায়ক \u2022 প্রিমিয়াম কোয়ালিটি" },
      aside: "Because You Deserve the Best",
      cta: { en: "Shop Now", bn: "এখনই কিনুন" }, link: "#shop"
    },
    {
      id: "b2", image: "", collage: "combo",
      label: { en: "Combo Offers", bn: "কম্বো অফার" },
      title: { en: "Buy More, Save More", bn: "বেশি নিন, কম দিন" },
      script: "Love in Every Piece",
      sub: { en: "Take a few pieces together and pay less for each one", bn: "একসাথে কয়েক পিস নিলে প্রতি পিসের দাম কমে যায়" },
      aside: "",
      cta: { en: "See Offers", bn: "অফার দেখুন" }, link: "cat:combo"
    },
    {
      id: "b3", image: "", collage: "night",
      label: { en: "Nightwear", bn: "নাইট ড্রেস" },
      title: { en: "Satin Nights", bn: "সাটিন নাইট ড্রেস" },
      script: "Sweet Dreams, Pretty You",
      sub: { en: "Soft satin sets for restful nights", bn: "আরামের ঘুমের জন্য নরম সাটিন সেট" },
      aside: "",
      cta: { en: "Shop Nightwear", bn: "নাইট ড্রেস দেখুন" }, link: "cat:night"
    }
  ],

  /* Real customer reviews only (add them from admin.html). Empty = section hidden. */
  reviews: []
};

/* icon: bra, panty, set, dress, gift, bow */
window.CATEGORIES = [
  { id: "bra",    icon: "bra",   image: "images/cat-bras.jpg",      label: { bn: "ব্রা",            en: "Bras" } },
  { id: "panty",  icon: "panty", image: "images/cat-panties.jpg",   label: { bn: "প্যান্টি",         en: "Panties" } },
  { id: "set",    icon: "set",   image: "images/cat-sets.jpg",      label: { bn: "লঞ্জেরি সেট",      en: "Lingerie Sets" } },
  { id: "night",  icon: "dress", image: "images/cat-nightwear.jpg", label: { bn: "নাইট ড্রেস",      en: "Nightwear" } },
  { id: "combo",  icon: "gift",  image: "images/cat-gift.jpg",      label: { bn: "কম্বো অফার",      en: "Combo Offers" } },
  { id: "beauty", icon: "bow",   image: "images/cat-beauty.jpg",    label: { bn: "বিউটি কেয়ার",     en: "Beauty Care" } }
];

window.PRODUCTS = [
  {
    id: "combo-3-padded",
    cat: "combo",
    featured: true,
    badge: "hot",
    images: ["images/white-black-combo.jpg", "images/padded-combo-495.jpg"],
    name: { bn: "৩ পিস প্যাডেড ব্রা কম্বো", en: "3-piece padded bra combo" },
    desc: {
      bn: "প্যাডেড ব্রা, সাইজ ৩২ থেকে। তিন পিস একসাথে নিলে ৪৯৫ টাকা, এক পিস নিলেও মাত্র ১৬৫ টাকা।",
      en: "Padded bras from size 32. Take all three for ৳495, or a single piece for ৳165."
    },
    note: { bn: "প্রতি পিস ১৬৫ টাকা", en: "৳165 per piece" },
    options: [
      { id: "3pc", label: { bn: "৩ পিস কম্বো", en: "3-piece combo" }, price: 495 },
      { id: "1pc", label: { bn: "১ পিস",       en: "Single piece" },  price: 165 }
    ],
    sizes: "bra"
  },
  {
    id: "combo-4-rose",
    cat: "combo",
    featured: true,
    images: ["images/rose-print-combo.jpg"],
    name: { bn: "৪ পিস রোজ প্রিন্ট ব্রা কম্বো", en: "4-piece rose print bra combo" },
    desc: {
      bn: "রোজ প্রিন্টের ব্রা, ৪ পিসের কম্বো মাত্র ৪৮০ টাকা। প্রতি পিস পড়ছে ১২০ টাকা।",
      en: "Rose print bras. A 4-piece combo for ৳480, which is ৳120 per piece."
    },
    note: { bn: "প্রতি পিস ১২০ টাকা", en: "৳120 per piece" },
    options: [
      { id: "4pc", label: { bn: "৪ পিস কম্বো", en: "4-piece combo" }, price: 480 },
      { id: "1pc", label: { bn: "১ পিস",       en: "Single piece" },  price: 120 }
    ],
    sizes: "bra"
  },
  {
    id: "combo-4-floral",
    cat: "combo",
    featured: true,
    images: ["images/peach-cotton-combo.jpg"],
    name: { bn: "৪ পিস ফ্লোরাল প্রিন্ট ব্রা কম্বো", en: "4-piece floral print bra combo" },
    desc: {
      bn: "ছোট ফুলের প্রিন্টের ব্রা, ৪ পিসের কম্বো ৫৮০ টাকা। প্রতি পিস ১৪৫ টাকা।",
      en: "Bras with a small floral print. A 4-piece combo for ৳580, ৳145 per piece."
    },
    note: { bn: "প্রতি পিস ১৪৫ টাকা", en: "৳145 per piece" },
    options: [
      { id: "4pc", label: { bn: "৪ পিস কম্বো", en: "4-piece combo" }, price: 580 },
      { id: "1pc", label: { bn: "১ পিস",       en: "Single piece" },  price: 145 }
    ],
    sizes: "bra"
  },
  {
    id: "set-black-lace",
    cat: "set",
    featured: true,
    images: ["images/black-lace-set.jpg"],
    name: { bn: "ব্ল্যাক লেস ব্রা + প্যান্টি সেট", en: "Black lace bra + panty set" },
    desc: {
      bn: "লেস ডিজাইনের ব্রা আর প্রিন্টেড প্যান্টি, পুরো সেট মাত্র ৩৫০ টাকা।",
      en: "A lace bra with a printed panty. The full set is ৳350."
    },
    note: { bn: "পুরো সেট", en: "Full set" },
    options: [{ id: "set", label: { bn: "সেট", en: "Set" }, price: 350 }],
    sizes: "bra"
  },
  {
    id: "set-pink-lace",
    cat: "set",
    images: ["images/pink-lace-set.jpg"],
    name: { bn: "পিংক লেস ব্রা + প্যান্টি সেট", en: "Pink lace bra + panty set" },
    desc: {
      bn: "পিংক কালারের লেস ব্রা আর প্যান্টির কম্বো, মাত্র ৩৫০ টাকা।",
      en: "A pink lace bra and matching panty, ৳350 for the pair."
    },
    note: { bn: "পুরো সেট", en: "Full set" },
    options: [{ id: "set", label: { bn: "সেট", en: "Set" }, price: 350 }],
    sizes: "bra"
  },
  {
    id: "bra-like-me",
    cat: "bra",
    badge: "offer",
    images: ["images/like-me-bra-99.jpg"],
    name: { bn: "লাইক মি ব্রা", en: "Like Me bra" },
    desc: {
      bn: "অফার প্রাইস, প্রতি পিস মাত্র ৯৯ টাকা।",
      en: "Offer price: ৳99 per piece."
    },
    note: { bn: "অফার প্রাইস", en: "Offer price" },
    options: [{ id: "1pc", label: { bn: "১ পিস", en: "Single piece" }, price: 99 }],
    sizes: "bra"
  },
  {
    id: "bra-printed",
    cat: "bra",
    images: ["images/heart-print-combo.jpg"],
    name: { bn: "প্রিমিয়াম প্রিন্টেড ব্রা", en: "Premium printed bra" },
    desc: {
      bn: "প্রিমিয়াম প্রিন্টেড ব্রা কালেকশন, প্রতি পিস ১১০ টাকা। কয়েকটি ডিজাইনে পাওয়া যাচ্ছে।",
      en: "Premium printed bra collection at ৳110 per piece, in several prints."
    },
    note: { bn: "কয়েকটি প্রিন্টে", en: "Several prints" },
    options: [{ id: "1pc", label: { bn: "১ পিস", en: "Single piece" }, price: 110 }],
    sizes: "bra"
  },
  {
    id: "bra-padded-premium",
    cat: "bra",
    badge: "offer",
    images: ["images/maroon-padded-bra.jpg"],
    name: { bn: "প্রিমিয়াম প্যাডেড ব্রা", en: "Premium padded bra" },
    desc: {
      bn: "রেগুলার প্রাইস ৫৯৯ টাকা, এখন অফারে মাত্র ৪৯৯ টাকা।",
      en: "Regular price ৳599, now ৳499 on offer."
    },
    note: { bn: "অফারে ১০০ টাকা কম", en: "৳100 off" },
    options: [{ id: "1pc", label: { bn: "১ পিস", en: "Single piece" }, price: 499, oldPrice: 599 }],
    sizes: "bra"
  },
  {
    id: "bra-china-seamless",
    cat: "bra",
    images: ["images/seamless-bra.jpg"],
    name: { bn: "চায়না ইম্পোর্টেড সিমলেস ব্রা", en: "China imported seamless bra" },
    desc: {
      bn: "চায়না ইম্পোর্টেড সফট ব্রা, ১ পিস ৫৯৯ টাকা।",
      en: "Soft China imported bra, ৳599 per piece."
    },
    note: { bn: "চায়না ইম্পোর্টেড", en: "China imported" },
    options: [{ id: "1pc", label: { bn: "১ পিস", en: "Single piece" }, price: 599 }],
    sizes: "bra"
  },
  {
    id: "bra-china-original",
    cat: "bra",
    images: ["images/china-imported-bra.jpg"],
    name: { bn: "অরিজিনাল চায়না ইম্পোর্টেড ব্রা", en: "Original China imported bra" },
    desc: {
      bn: "অনেকগুলো কালারে পাওয়া যাচ্ছে, স্টক সীমিত। দাম ও কালার জানতে মেসেজ করুন।",
      en: "Available in many colours, limited stock. Message us for price and colours."
    },
    note: { bn: "স্টক সীমিত", en: "Limited stock" },
    options: [{ id: "1pc", label: { bn: "১ পিস", en: "Single piece" }, price: null }],
    sizes: "bra"
  },
  {
    id: "bra-mom",
    cat: "bra",
    images: ["images/mom-bra.jpg"],
    name: { bn: "মম / ফিডিং ব্রা", en: "Mom / feeding bra" },
    desc: {
      bn: "চায়না ইম্পোর্টেড মম ব্রা, যাকে ফিডিং ব্রা-ও বলা হয়। দাম ও কালার জানতে মেসেজ করুন।",
      en: "China imported mom bra, also called a feeding bra. Message us for price and colours."
    },
    note: { bn: "চায়না ইম্পোর্টেড", en: "China imported" },
    options: [{ id: "1pc", label: { bn: "১ পিস", en: "Single piece" }, price: null }],
    sizes: "bra"
  },
  {
    id: "bra-sports",
    cat: "bra",
    images: ["images/sports-bra.jpg"],
    name: { bn: "স্পোর্টস ব্রা", en: "Sports bra" },
    desc: {
      bn: "চায়না ইম্পোর্টেড স্পোর্টস ব্রা। দাম ও সাইজ জানতে মেসেজ করুন।",
      en: "China imported sports bra. Message us for price and sizes."
    },
    note: { bn: "চায়না ইম্পোর্টেড", en: "China imported" },
    options: [{ id: "1pc", label: { bn: "১ পিস", en: "Single piece" }, price: null }],
    sizes: "bra"
  },
  {
    id: "bra-pink-lace",
    cat: "bra",
    images: ["images/pink-lace-bra.jpg"],
    name: { bn: "পিংক লেস ব্রা", en: "Pink lace bra" },
    desc: {
      bn: "নরম পিংক লেসের ব্রা। দাম ও সাইজ জানতে মেসেজ করুন।",
      en: "Soft pink lace bra. Message us for price and sizes."
    },
    note: { bn: "লেস ডিজাইন", en: "Lace" },
    options: [{ id: "1pc", label: { bn: "১ পিস", en: "Single piece" }, price: null }],
    sizes: "bra"
  },
  {
    id: "panty-red-lace",
    cat: "panty",
    images: ["images/red-lace-panty.jpg"],
    name: { bn: "রেড লেস প্যান্টি", en: "Red lace panty" },
    desc: {
      bn: "লেসের প্যান্টি, ১ পিস মাত্র ১৩৯ টাকা।",
      en: "Lace panty, ৳139 per piece."
    },
    note: { bn: "লেস ডিজাইন", en: "Lace" },
    options: [{ id: "1pc", label: { bn: "১ পিস", en: "Single piece" }, price: 139 }],
    sizes: null
  },
  {
    id: "night-navy",
    cat: "night",
    images: ["images/night-dress-navy.jpg"],
    name: { bn: "সাটিন নাইট ড্রেস সেট (নেভি)", en: "Satin nightwear set (navy)" },
    desc: {
      bn: "সুন্দর সাটিন নাইট ড্রেস সেট। দাম ও সাইজ জানতে মেসেজ করুন।",
      en: "A satin nightwear set. Message us for price and sizes."
    },
    note: { bn: "সাটিন", en: "Satin" },
    options: [{ id: "set", label: { bn: "সেট", en: "Set" }, price: null }],
    sizes: null
  },
  {
    id: "night-ivory",
    cat: "night",
    images: ["images/night-dress-ivory.jpg"],
    name: { bn: "সাটিন নাইট ড্রেস সেট (আইভরি)", en: "Satin nightwear set (ivory)" },
    desc: {
      bn: "সুন্দর সাটিন নাইট ড্রেস সেট। দাম ও সাইজ জানতে মেসেজ করুন।",
      en: "A satin nightwear set. Message us for price and sizes."
    },
    note: { bn: "সাটিন", en: "Satin" },
    options: [{ id: "set", label: { bn: "সেট", en: "Set" }, price: null }],
    sizes: null
  },
  {
    id: "cream-yogurt",
    cat: "beauty",
    images: ["images/yogurt-cream.jpg"],
    name: { bn: "ম্যাজিক হোয়াইট ইয়োগার্ট মিল্ক আন্ডারআর্ম ক্রিম", en: "Magic White Yogurt Milk underarm cream" },
    desc: {
      bn: "আন্ডারআর্মের যত্নে ৭ ইন ১ ফর্মুলার ক্রিম, পিংক কালারের সহজে ব্যবহারযোগ্য প্যাকেজিং। স্টক ও দাম জানতে মেসেজ করুন।",
      en: "A 7-in-1 underarm care cream in an easy-to-use pink tube. Message us for price and stock."
    },
    note: { bn: "৭ ইন ১", en: "7 in 1" },
    options: [{ id: "1pc", label: { bn: "১ পিস", en: "Single piece" }, price: null }],
    sizes: null
  }
];
