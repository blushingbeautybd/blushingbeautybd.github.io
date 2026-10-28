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
      title: { en: "Night Dresses", bn: "নাইট ড্রেস" },
      script: "Sweet Dreams, Pretty You",
      sub: { en: "Satin sets and comfy T-shirt sets for restful nights", bn: "আরামের ঘুমের জন্য সাটিন আর টি-শার্ট সেট" },
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
    id: "bra-seamless", cat: "bra", featured: true, badge: "hot",
    images: ["images/fb-seamless-bra.jpg", "images/seamless-bra.jpg"],
    name: { bn: "চায়না সিমলেস ব্রা", en: "China Seamless Bra" },
    desc: { bn: "ওয়্যার ছাড়া নরম সিমলেস ব্রা, সারাদিন আরামে পরা যায়। আমাদের মোস্ট ভাইরাল ব্রা।", en: "A soft, wire-free seamless bra you can wear comfortably all day. Our most viral bra." },
    note: { bn: "মোস্ট ভাইরাল • ২ পিস ১০৯৯ টাকা", en: "Most viral • 2 pieces for ৳1,099" },
    options: [
      { id: "1pc", label: { bn: "১ পিস", en: "Single piece" }, price: 599 },
      { id: "2pc", label: { bn: "২ পিস", en: "2 pieces" }, price: 1099 }
    ],
    sizes: ["32", "34", "36", "38", "40", "42", "44"],
    colors: [{ bn: "ব্লু", en: "Blue" }, { bn: "অলিভ", en: "Olive" }, { bn: "ব্ল্যাক", en: "Black" }, { bn: "ন্যুড", en: "Nude" }]
  },
  {
    id: "bra-premium-lace", cat: "bra", featured: true, badge: "offer",
    images: ["images/maroon-padded-bra.jpg", "images/fb-premium-lace-bra.jpg"],
    name: { bn: "প্রিমিয়াম লেস ব্রা", en: "Premium Lace Bra" },
    desc: { bn: "প্রিমিয়াম কোয়ালিটির লেস ব্রা। রেগুলার দাম ৫৯৯ টাকা, অফারে ৪৯৯ টাকা। স্টক সীমিত।", en: "Premium quality lace bra. Regular price ৳599, now ৳499 on offer. Limited stock." },
    note: { bn: "অফার ৩১ অক্টোবর পর্যন্ত • লিমিটেড স্টক", en: "Offer till 31 October • Limited stock" },
    options: [{ id: "1pc", label: { bn: "১ পিস", en: "Single piece" }, price: 499, oldPrice: 599 }],
    sizes: "bra",
    colors: [{ bn: "গ্রিন", en: "Green" }, { bn: "মেরুন", en: "Maroon" }]
  },
  {
    id: "combo-999", cat: "combo", featured: true, badge: "offer",
    images: ["images/fb-combo-999.jpg"],
    name: { bn: "৩ ব্রা + ২ প্যান্টি ফ্রি", en: "3 Bras + 2 Free Panties" },
    desc: { bn: "৯৯৯ টাকার কম্বো অফার: ৩টা ব্রা নিলে সাথে ২টা প্যান্টি একদম ফ্রি। পছন্দের রং নোটে লিখে দিন।", en: "Combo offer for ৳999: take 3 bras and get 2 panties free. Write the colours you like in the note." },
    note: { bn: "৩টা ব্রা কিনলে ২টা প্যান্টি ফ্রি", en: "Buy 3 bras, get 2 panties free" },
    options: [{ id: "combo", label: { bn: "কম্বো", en: "Combo" }, price: 999 }],
    sizes: "bra"
  },
  {
    id: "bra-padded", cat: "bra", featured: true,
    images: ["images/fb-padded-bra.jpg", "images/fb-gorgeous-lace-bra.jpg", "images/padded-combo-495.jpg", "images/white-black-combo.jpg"],
    name: { bn: "প্যাডেড লেস ব্রা", en: "Padded Lace Bra" },
    desc: { bn: "নরম কাপড়ের ফুল প্যাডেড ব্রা, উপরে সুন্দর লেসের কাজ। একসাথে ৩ পিস নিলে মাত্র ৪৯৫ টাকা।", en: "Fully padded bra in soft fabric with pretty lace on top. Take 3 pieces together for just ৳495." },
    note: { bn: "৩ পিস কম্বো ৪৯৫ টাকা", en: "3-piece combo ৳495" },
    options: [
      { id: "1pc", label: { bn: "১ পিস", en: "Single piece" }, price: 165 },
      { id: "3pc", label: { bn: "৩ পিস কম্বো", en: "3-piece combo" }, price: 495 }
    ],
    sizes: ["32", "34", "36", "38", "40", "42"],
    colors: [{ bn: "কালো", en: "Black" }, { bn: "সাদা", en: "White" }, { bn: "গোলাপি", en: "Pink" }, { bn: "মেরুন", en: "Maroon" }, { bn: "লাল", en: "Red" }]
  },
  {
    id: "set-pink-pushup", cat: "set",
    images: ["images/pink-lace-set.jpg"],
    name: { bn: "পিংক লেস পুশ-আপ ব্রা + প্যান্টি", en: "Pink Lace Push-up Bra + Panty" },
    desc: { bn: "পিংক লেসের পুশ-আপ ব্রা আর ম্যাচিং প্যান্টির সেট।", en: "Pink lace push-up bra with a matching panty." },
    note: { bn: "১ ব্রা + ১ প্যান্টি", en: "1 bra + 1 panty" },
    options: [{ id: "set", label: { bn: "সেট", en: "Set" }, price: 350 }],
    sizes: "bra"
  },
  {
    id: "night-4pc", cat: "night", featured: false,
    images: ["images/night-dress-navy.jpg", "images/night-dress-ivory.jpg", "images/fb-night-dress-4pc.jpg"],
    name: { bn: "৪ পিস নাইট ড্রেস সেট", en: "4-Piece Night Dress Set" },
    desc: { bn: "৪ পিসের সাটিন নাইট ড্রেস সেট। নিজের জন্য বা উপহার দেওয়ার জন্য খুব সুন্দর।", en: "A 4-piece satin night dress set. Lovely for yourself or as a gift." },
    note: { bn: "উপহারের জন্য সুন্দর", en: "A lovely gift" },
    options: [{ id: "set", label: { bn: "সেট", en: "Set" }, price: 1790 }],
    sizes: null
  },
  {
    id: "bra-premium-quality", cat: "bra", featured: true,
    images: ["images/fb-premium-quality-bra.jpg"],
    name: { bn: "প্রিমিয়াম কোয়ালিটি ব্রা", en: "Premium Quality Bra" },
    desc: { bn: "প্রিমিয়াম কোয়ালিটির লেস ব্রা, তিনটা রঙে। ৩ পিস একসাথে নিলে ৫৭০ টাকা।", en: "Premium quality lace bra in three colours. Take 3 pieces together for ৳570." },
    note: { bn: "৩ পিস কম্বো ৫৭০ টাকা", en: "3-piece combo ৳570" },
    options: [
      { id: "1pc", label: { bn: "১ পিস", en: "Single piece" }, price: 190 },
      { id: "3pc", label: { bn: "৩ পিস কম্বো", en: "3-piece combo" }, price: 570 }
    ],
    sizes: "bra",
    colors: [{ bn: "পিংক", en: "Pink" }, { bn: "সাদা", en: "White" }, { bn: "বোতল গ্রিন", en: "Bottle Green" }]
  },
  {
    id: "set-red", cat: "set", featured: true, badge: "hot",
    images: ["images/fb-red-combo-set.jpg"],
    name: { bn: "রেড কম্বো সেট", en: "Red Combo Set" },
    desc: { bn: "লাল সাটিন আর লেসের ব্রা ও প্যান্টির সেট। স্টক সীমিত।", en: "Red satin and lace bra with matching panty. Limited stock." },
    note: { bn: "ব্রা + প্যান্টি • লিমিটেড স্টক", en: "Bra + panty • Limited stock" },
    options: [{ id: "set", label: { bn: "সেট", en: "Set" }, price: 399 }],
    sizes: "bra"
  },
  {
    id: "panty-lace", cat: "panty",
    images: ["images/red-lace-panty.jpg", "images/fb-lace-panty.jpg"],
    name: { bn: "লেস প্যান্টি", en: "Lace Panty" },
    desc: { bn: "নরম লেসের সুন্দর প্যান্টি।", en: "A pretty panty in soft lace." },
    note: { bn: "", en: "" },
    options: [{ id: "1pc", label: { bn: "১ পিস", en: "Single piece" }, price: 139 }],
    sizes: null
  },
  {
    id: "bra-china-imported", cat: "bra",
    images: ["images/fb-china-imported-bra.jpg"],
    name: { bn: "চায়না ইম্পোর্টেড ব্রা", en: "China Imported Bra" },
    desc: { bn: "অরিজিনাল চায়না ইম্পোর্টেড ব্রা, অনেক রঙে।", en: "Original China-imported bra in many colours." },
    note: { bn: "অরিজিনাল চায়না ইম্পোর্টেড", en: "Original China import" },
    options: [{ id: "1pc", label: { bn: "১ পিস", en: "Single piece" }, price: 599 }],
    sizes: ["M", "L", "XL", "XXL"]
  },
  {
    id: "bra-printed-lace", cat: "bra", featured: true,
    images: ["images/fb-printed-lace-bra.jpg", "images/peach-cotton-combo.jpg"],
    name: { bn: "সুতির প্রিন্টেড লেস ব্রা", en: "Cotton Printed Lace Bra" },
    desc: { bn: "সুতির কাপড়ে প্রিন্ট আর লেসের কাজ। প্রতি পিস ১৪৫ টাকা, ৪ পিসের কম্বো ৫৮০ টাকা।", en: "Cotton bra with print and lace detail. ৳145 a piece, or a 4-piece combo for ৳580." },
    note: { bn: "৪ পিস কম্বো ৫৮০ টাকা", en: "4-piece combo ৳580" },
    options: [
      { id: "1pc", label: { bn: "১ পিস", en: "Single piece" }, price: 145 },
      { id: "4pc", label: { bn: "৪ পিস কম্বো", en: "4-piece combo" }, price: 580 }
    ],
    sizes: "bra"
  },
  {
    id: "panty-thong", cat: "panty", featured: true,
    images: ["images/fb-thong-panty.jpg"],
    name: { bn: "থং প্যান্টি", en: "Thong Panty" },
    desc: { bn: "নানা রং আর ডিজাইনের থং প্যান্টি। বেশি নিলে দাম কম।", en: "Thong panties in many colours and designs. Buy more, pay less." },
    note: { bn: "৩ পিস ৪০০ • ৫ পিস ৬০০ টাকা", en: "3 for ৳400 • 5 for ৳600" },
    options: [
      { id: "1pc", label: { bn: "১ পিস", en: "Single piece" }, price: 120 },
      { id: "3pc", label: { bn: "৩ পিস", en: "3 pieces" }, price: 400 },
      { id: "5pc", label: { bn: "৫ পিস", en: "5 pieces" }, price: 600 }
    ],
    sizes: null
  },
  {
    id: "bra-cotton-plain", cat: "bra", badge: "offer",
    images: ["images/fb-cotton-plain-bra.jpg"],
    name: { bn: "সুতির প্লেইন ব্রা", en: "Cotton Plain Bra" },
    desc: { bn: "সুতির কাজ করা প্লেইন ব্রা, প্রতিদিন পরার জন্য আরামদায়ক। অফারে প্রতি পিস মাত্র ৯৯ টাকা।", en: "Plain cotton bra with stitched detail, comfy for everyday wear. Only ৳99 a piece on offer." },
    note: { bn: "অফার: প্রতি পিস ৯৯ টাকা", en: "Offer: ৳99 a piece" },
    options: [{ id: "1pc", label: { bn: "১ পিস", en: "Single piece" }, price: 99 }],
    sizes: "bra"
  },
  {
    id: "set-nude", cat: "set",
    images: ["images/fb-nude-combo-set.jpg"],
    name: { bn: "ন্যুড কালার কম্বো সেট", en: "Nude Combo Set" },
    desc: { bn: "ন্যুড কালারের প্যাডেড ব্রা আর ম্যাচিং প্যান্টি।", en: "Nude padded bra with a matching panty." },
    note: { bn: "১ ব্রা + ১ প্যান্টি", en: "1 bra + 1 panty" },
    options: [{ id: "set", label: { bn: "সেট", en: "Set" }, price: 350 }],
    sizes: "bra"
  },
  {
    id: "night-tshirt", cat: "night", badge: "offer",
    images: ["images/fb-tshirt-night-dress.jpg"],
    name: { bn: "টি-শার্ট প্যান্ট নাইট ড্রেস", en: "T-shirt & Pants Night Dress" },
    desc: { bn: "টি-শার্ট আর প্যান্টের আরামদায়ক নাইট ড্রেস।", en: "A comfy night dress with a T-shirt and pants." },
    note: { bn: "টি-শার্ট + প্যান্ট • অফার দাম", en: "T-shirt + pants • Offer price" },
    options: [{ id: "set", label: { bn: "সেট", en: "Set" }, price: 1099 }],
    sizes: null
  },
  {
    id: "bra-mom", cat: "bra",
    images: ["images/fb-mom-bra.jpg"],
    name: { bn: "চাইনিজ টি-শার্ট মম ব্রা", en: "T-shirt Mom Bra (Feeding)" },
    desc: { bn: "সামনে বোতাম থাকায় সহজে ফিডিং করানো যায়। নতুন মায়েদের জন্য আরামদায়ক ব্রা।", en: "Front buttons make feeding easy. A comfortable bra for new mothers." },
    note: { bn: "ফিডিং ব্রা • সামনে বোতাম", en: "Feeding bra • Front buttons" },
    options: [{ id: "1pc", label: { bn: "১ পিস", en: "Single piece" }, price: 599 }],
    sizes: "bra"
  },
  {
    id: "bra-printed", cat: "bra",
    images: ["images/fb-printed-bra.jpg", "images/heart-print-combo.jpg"],
    name: { bn: "প্রিমিয়াম প্রিন্টেড ব্রা", en: "Premium Printed Bra" },
    desc: { bn: "সুন্দর প্রিন্টের নরম ব্রা, চারটা ডিজাইনে। স্টক সীমিত।", en: "Soft bra in pretty prints, in four designs. Limited stock." },
    note: { bn: "স্টক সীমিত", en: "Limited stock" },
    options: [{ id: "1pc", label: { bn: "১ পিস", en: "Single piece" }, price: 110 }],
    sizes: "bra",
    colors: [{ bn: "পার্পল-চেরি", en: "Purple Cherry" }, { bn: "মিষ্টি-রোজ", en: "Sweet Rose" }, { bn: "ব্ল্যাক-লাভ", en: "Black Love" }, { bn: "খয়েরি-সাদা চেক", en: "Brown-White Check" }]
  },
  {
    id: "set-pink-printed", cat: "set", badge: "offer",
    images: ["images/fb-pink-printed-set.jpg"],
    name: { bn: "প্রিন্টেড পিংক ব্রা-প্যান্টি সেট", en: "Pink Printed Bra & Panty Set" },
    desc: { bn: "পিংক প্রিন্টের ব্রা আর প্যান্টির সেট, অফার দামে।", en: "Pink printed bra and panty set at an offer price." },
    note: { bn: "অফার দাম", en: "Offer price" },
    options: [{ id: "set", label: { bn: "সেট", en: "Set" }, price: 220 }],
    sizes: "bra"
  },
  {
    id: "panty-designer", cat: "panty",
    images: ["images/fb-designer-panty.jpg"],
    name: { bn: "ডিজাইনের প্যান্টি", en: "Designer Panty" },
    desc: { bn: "চেক, প্রিন্ট আর প্লেইন নানা ডিজাইনের প্যান্টি।", en: "Panties in checks, prints and plain designs." },
    note: { bn: "৫ পিস ৬০০ টাকা", en: "5 pieces ৳600" },
    options: [
      { id: "1pc", label: { bn: "১ পিস", en: "Single piece" }, price: 120 },
      { id: "5pc", label: { bn: "৫ পিস", en: "5 pieces" }, price: 600 }
    ],
    sizes: null
  },
  {
    id: "set-bikini", cat: "set", badge: "offer",
    images: ["images/fb-bikini.jpg"],
    name: { bn: "বিকিনি", en: "Bikini" },
    desc: { bn: "সাটিন আর লেসের বিকিনি সেট, অফার দামে।", en: "Satin and lace bikini set at an offer price." },
    note: { bn: "অফার দাম", en: "Offer price" },
    options: [{ id: "set", label: { bn: "সেট", en: "Set" }, price: 250 }],
    sizes: null
  }
];
