/* Blushing Beauty — shop: hero slider, collections, products, wishlist, cart, WhatsApp ordering, language */
(function () {
  "use strict";

  var SHOP, PRODUCTS = [], CATS = [];
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- text ---------- */
  var T = {
    en: {
      skip: "Skip to products",
      "nav.home": "Home", "nav.shop": "Shop", "nav.offers": "Offers", "nav.about": "About Us", "nav.contact": "Contact", "nav.all": "All Products",
      "feat.t1": "Home Delivery", "feat.s1": "Across Bangladesh",
      "feat.t2": "Cash on Delivery", "feat.s2": "Pay when you receive",
      "feat.t3": "Premium Quality", "feat.s3": "Carefully selected",
      "feat.t4": "Comfort Fit", "feat.s4": "All day comfort",
      "feat.t5": "Customer Support", "feat.s5": "Always here on WhatsApp",
      "feat.t6": "Size Help", "feat.s6": "We'll find your fit",
      "cats.eyebrow": "Shop by Category", "cats.title": "Explore Our Collections", "cats.shop": "Shop Now", "cats.count": "{n} products",
      "offers.eyebrow": "Best Deals", "offers.title": "Combo Offers", "offers.sub": "Take a few pieces together and pay less for each one.",
      "shop.eyebrow": "Shop All", "shop.title": "Our Collection",
      "shop.sub": "Tap a product to choose your size. No price shown? Tap \"Ask Price\" and we'll reply on WhatsApp.",
      "shop.search": "Search products", "shop.searchPh": "Search, e.g. lace, combo, satin", "shop.sort": "Sort",
      "sort.default": "Featured", "sort.low": "Price: low to high", "sort.high": "Price: high to low",
      "shop.count": "{n} products", "shop.none": "No products match this search.", "shop.clear": "Show all products",
      "cat.all": "All",
      "about.eyebrow": "About Blushing Beauty", "about.title": "More Than Just Lingerie",
      "about.p1": "Blushing Beauty is your trusted destination for premium quality bras, panties and lingerie. We believe every woman deserves comfort, confidence and beauty in every moment.",
      "about.p2": "We are an online lingerie shop based in Jatrabari, Dhaka, delivering across Bangladesh. Browse our bras, panties, sets and nightwear here, order on WhatsApp, and pay when your parcel arrives. Not sure about your size? Message us and we'll help you find the right fit.",
      "about.f1": "Premium Quality", "about.f2": "Comfort Fit", "about.f3": "Elegant Designs", "about.f4": "Women Empowerment",
      "about.cta": "Our Story", "about.ctaLess": "Show less",
      "rev.title": "What Our Customers Say",
      "size.eyebrow": "Find Your Fit", "size.title": "Size Guide",
      "size.p1": "Wrap a measuring tape snugly around your ribcage, just under the bust. That's your underbust measurement.",
      "size.p2": "Then measure around the fullest part of your bust. The difference between the two gives your cup size.",
      "size.help": "Not sure? Send us your measurements on WhatsApp and we'll tell you your size.",
      "size.ask": "Ask about sizes on WhatsApp",
      "size.bandCap": "Bra size", "size.under": "Underbust (inches)", "size.band": "Size",
      "size.cupCap": "Cup size", "size.diff": "Difference", "size.cup": "Cup",
      "size.d1": "About 1 inch", "size.d2": "About 2 inches", "size.d3": "About 3 inches", "size.d4": "About 4 inches",
      "how.eyebrow": "Easy Ordering", "how.title": "How to Order",
      "how.s1t": "Pick what you love", "how.s1": "Tap a product, choose size and quantity, and add it to your cart.",
      "how.s2t": "Add your address", "how.s2": "Open the cart and fill in your name, phone number and delivery address.",
      "how.s3t": "Send on WhatsApp", "how.s3": "Your order arrives on our WhatsApp. We confirm it and ship, and you pay when it reaches you.",
      "faq.eyebrow": "Questions", "faq.title": "Frequently Asked",
      "faq.q1": "How much is delivery?", "faq.a1": "৳{in} inside Dhaka and ৳{out} outside Dhaka.",
      "faq.q2": "How do I pay?", "faq.a2": "Pay the delivery person when your parcel arrives (cash on delivery).",
      "faq.q3": "Which sizes do you have?", "faq.a3": "Bra sizes start at {size}. Check the size guide above, or ask us on WhatsApp.",
      "faq.q4": "Why do some products have no price?", "faq.a4": "Their stock and colours change often. Tap \"Ask Price\" to get the current price and stock on WhatsApp.",
      "faq.q5": "What happens after I order?", "faq.a5": "We confirm your order on WhatsApp, then send your parcel.",
      "contact.eyebrow": "Get in Touch", "contact.title": "Contact Us", "contact.always": "Always open", "contact.wa": "Message us on WhatsApp",
      "foot.links": "Quick Links", "foot.size": "Size Guide", "foot.follow": "Follow Us", "foot.rights": "All rights reserved.",
      "cart.title": "Your Cart", "cart.view": "View cart",
      "cart.empty": "Your cart is empty.", "cart.emptyGo": "Start shopping",
      "cart.barText": "{n} items, {t}",
      "cart.subtotal": "Products", "cart.delivery": "Delivery", "cart.total": "Total",
      "cart.area": "Where should we deliver?",
      "cart.name": "Your name", "cart.phone": "Mobile number", "cart.address": "Full address",
      "cart.addressPh": "House, road, area, thana, district",
      "cart.note": "Note (optional)", "cart.notePh": "Colour preference or anything else",
      "cart.send": "Send order on WhatsApp",
      "cart.fine": "WhatsApp opens with your full order already written. Just tap Send.",
      "cart.remove": "Remove",
      "err.name": "Enter your name.", "err.phone": "Enter an 11-digit mobile number, like 01712345678.", "err.address": "Enter your full delivery address.",
      "pd.option": "Pack", "pd.size": "Size", "pd.qty": "Quantity", "pd.color": "Colour / Design",
      "pd.note": "Colour or design preference (optional)", "pd.notePh": "e.g. black and pink", "pd.noteOnly": "Note (optional)", "pd.noteOnlyPh": "Anything we should know", "pd.notePackPh": "e.g. 2nd piece in another colour",
      "pd.add": "Add to Cart", "pd.buy": "Buy Now",
      "pd.ask": "Ask price on WhatsApp", "pd.askNote": "Price and stock for this item are shared on WhatsApp.",
      "pd.soldNote": "This item is sold out right now. Message us to find out when it's back.",
      "pd.soldAsk": "Ask when it's back",
      "pd.pickSize": "Choose a size first.", "pd.pickColor": "Choose a colour first.", "card.colors": "{n} colours", "pd.sizeHelp": "Size guide",
      "pd.trustDel": "৳{in} inside Dhaka, ৳{out} outside", "pd.trustCod": "Cash on delivery", "pd.trustHelp": "Help with sizing",
      "card.add": "Add to Cart", "card.ask": "Ask Price", "card.askPrice": "Ask for price", "card.sold": "Sold out",
      "badge.new": "New", "badge.hot": "Hot", "badge.offer": "Offer", "badge.sold": "Sold out",
      "wish.title": "Your Wishlist", "wish.empty": "Tap the heart on any product to save it here.", "wish.view": "View", "wish.remove": "Remove",
      "wish.add": "Add to wishlist", "wish.added": "Saved to wishlist", "wish.removed": "Removed from wishlist",
      "toast.added": "Added to cart", "toast.removed": "Removed from cart",
      "qty.minus": "Decrease", "qty.plus": "Increase",
      "preview.flag": "Preview: showing admin changes that aren't published yet",
      "wa.hello": "Hello Blushing Beauty, I'd like to know about your products.",
      "wa.ask": "Hello Blushing Beauty, I'd like the price and stock for \"{p}\".",
      "wa.stock": "Hello Blushing Beauty, when will \"{p}\" be back in stock?",
      "wa.size": "Hello Blushing Beauty, I'd like help finding my size."
    },
    bn: {
      skip: "পণ্যে যান",
      "nav.home": "হোম", "nav.shop": "শপ", "nav.offers": "অফার", "nav.about": "আমাদের কথা", "nav.contact": "যোগাযোগ", "nav.all": "সব পণ্য",
      "feat.t1": "হোম ডেলিভারি", "feat.s1": "সারা বাংলাদেশে",
      "feat.t2": "ক্যাশ অন ডেলিভারি", "feat.s2": "পণ্য হাতে পেয়ে টাকা",
      "feat.t3": "প্রিমিয়াম কোয়ালিটি", "feat.s3": "বাছাই করা কালেকশন",
      "feat.t4": "আরামদায়ক ফিট", "feat.s4": "সারাদিনের আরাম",
      "feat.t5": "কাস্টমার সাপোর্ট", "feat.s5": "WhatsApp এ সবসময়",
      "feat.t6": "সাইজ সাহায্য", "feat.s6": "সঠিক মাপ খুঁজে দিই",
      "cats.eyebrow": "ক্যাটাগরি", "cats.title": "আমাদের কালেকশন দেখুন", "cats.shop": "এখনই দেখুন", "cats.count": "{n}টি পণ্য",
      "offers.eyebrow": "সেরা অফার", "offers.title": "কম্বো অফার", "offers.sub": "একসাথে কয়েক পিস নিলে প্রতি পিসের দাম কমে যায়।",
      "shop.eyebrow": "সব পণ্য", "shop.title": "পুরো কালেকশন",
      "shop.sub": "পছন্দের পণ্যে চাপ দিয়ে সাইজ বেছে নিন। দাম লেখা না থাকলে \"দাম জানুন\" চাপলেই WhatsApp এ জেনে নিতে পারবেন।",
      "shop.search": "পণ্য খুঁজুন", "shop.searchPh": "পণ্য খুঁজুন, যেমন: লেস, কম্বো, সাটিন", "shop.sort": "সাজান",
      "sort.default": "আমাদের পছন্দ", "sort.low": "দাম: কম থেকে বেশি", "sort.high": "দাম: বেশি থেকে কম",
      "shop.count": "{n}টি পণ্য", "shop.none": "এই খোঁজে কোনো পণ্য পাওয়া যায়নি।", "shop.clear": "সব পণ্য দেখুন",
      "cat.all": "সব",
      "about.eyebrow": "Blushing Beauty সম্পর্কে", "about.title": "শুধু লঞ্জেরি নয়, আরও বেশি কিছু",
      "about.p1": "প্রিমিয়াম কোয়ালিটির ব্রা, প্যান্টি আর লঞ্জেরির জন্য Blushing Beauty আপনার ভরসার জায়গা। আমরা বিশ্বাস করি, প্রতিটি নারী প্রতিটি মুহূর্তে আরাম, আত্মবিশ্বাস আর সৌন্দর্য পাওয়ার যোগ্য।",
      "about.p2": "আমরা ঢাকার যাত্রাবাড়ী থেকে সারা বাংলাদেশে ডেলিভারি দিই। এখানে আমাদের ব্রা, প্যান্টি, সেট আর নাইট ড্রেস দেখুন, WhatsApp এ অর্ডার করুন, আর পণ্য হাতে পেয়ে টাকা দিন। সাইজ নিয়ে নিশ্চিত না হলে মেসেজ করুন, আমরা সঠিক মাপ খুঁজে দেব।",
      "about.f1": "প্রিমিয়াম কোয়ালিটি", "about.f2": "আরামদায়ক ফিট", "about.f3": "সুন্দর ডিজাইন", "about.f4": "নারীর আত্মবিশ্বাস",
      "about.cta": "আমাদের গল্প", "about.ctaLess": "কম দেখুন",
      "rev.title": "কাস্টমাররা যা বলছেন",
      "size.eyebrow": "সঠিক মাপ", "size.title": "সাইজ গাইড",
      "size.p1": "একটা মাপার ফিতা নিন। বুকের ঠিক নিচে, শরীরের চারপাশে ফিতা সমানভাবে ঘুরিয়ে মাপ নিন। এটাই আপনার নিচের মাপ।",
      "size.p2": "এরপর বুকের সবচেয়ে উঁচু জায়গায় মাপ নিন। দুই মাপের পার্থক্য থেকে কাপ সাইজ বের হবে।",
      "size.help": "মাপ নিয়ে নিশ্চিত না হলে আমাদের WhatsApp এ মাপটা পাঠিয়ে দিন, আমরা সাইজ বলে দেব।",
      "size.ask": "WhatsApp এ সাইজ জিজ্ঞেস করুন",
      "size.bandCap": "ব্রা সাইজ", "size.under": "বুকের নিচের মাপ (ইঞ্চি)", "size.band": "সাইজ",
      "size.cupCap": "কাপ সাইজ", "size.diff": "দুই মাপের পার্থক্য", "size.cup": "কাপ",
      "size.d1": "প্রায় ১ ইঞ্চি", "size.d2": "প্রায় ২ ইঞ্চি", "size.d3": "প্রায় ৩ ইঞ্চি", "size.d4": "প্রায় ৪ ইঞ্চি",
      "how.eyebrow": "সহজ অর্ডার", "how.title": "কিভাবে অর্ডার করবেন",
      "how.s1t": "পছন্দ করুন", "how.s1": "পণ্যে চাপ দিন, সাইজ আর পরিমাণ বেছে কার্টে যোগ করুন।",
      "how.s2t": "ঠিকানা দিন", "how.s2": "কার্ট খুলে নাম, ফোন নম্বর আর ডেলিভারির ঠিকানা লিখুন।",
      "how.s3t": "WhatsApp এ পাঠান", "how.s3": "অর্ডারটা WhatsApp এ চলে আসবে। আমরা কনফার্ম করে পণ্য পাঠিয়ে দেব, টাকা দেবেন পণ্য হাতে পেয়ে।",
      "faq.eyebrow": "প্রশ্ন", "faq.title": "সাধারণ প্রশ্ন",
      "faq.q1": "ডেলিভারি চার্জ কত?", "faq.a1": "ঢাকার ভিতরে {in} টাকা, ঢাকার বাইরে {out} টাকা।",
      "faq.q2": "টাকা কিভাবে দেব?", "faq.a2": "পণ্য হাতে পেয়ে ডেলিভারি ম্যানকে টাকা দেবেন (ক্যাশ অন ডেলিভারি)।",
      "faq.q3": "কোন সাইজগুলো পাওয়া যায়?", "faq.a3": "ব্রা সাইজ {size} থেকে শুরু। নিজের মাপ জানতে উপরের সাইজ গাইড দেখুন, বা WhatsApp এ জিজ্ঞেস করুন।",
      "faq.q4": "কিছু পণ্যে দাম লেখা নেই কেন?", "faq.a4": "এগুলোর স্টক আর কালার প্রায়ই বদলায়। \"দাম জানুন\" চাপলে WhatsApp এ সরাসরি দাম আর স্টক জেনে নিতে পারবেন।",
      "faq.q5": "অর্ডার করার পর কী হবে?", "faq.a5": "আমরা WhatsApp এ আপনার অর্ডার কনফার্ম করব, তারপর পণ্য পাঠিয়ে দেব।",
      "contact.eyebrow": "যোগাযোগ", "contact.title": "যোগাযোগ করুন", "contact.always": "সবসময় খোলা", "contact.wa": "WhatsApp এ মেসেজ করুন",
      "foot.links": "দরকারি লিংক", "foot.size": "সাইজ গাইড", "foot.follow": "ফলো করুন", "foot.rights": "সর্বস্বত্ব সংরক্ষিত।",
      "cart.title": "আপনার কার্ট", "cart.view": "কার্ট দেখুন",
      "cart.empty": "কার্ট এখনো খালি।", "cart.emptyGo": "কেনাকাটা শুরু করুন",
      "cart.barText": "{n}টি পণ্য, {t}",
      "cart.subtotal": "পণ্যের দাম", "cart.delivery": "ডেলিভারি চার্জ", "cart.total": "মোট",
      "cart.area": "ডেলিভারি কোথায়?",
      "cart.name": "আপনার নাম", "cart.phone": "মোবাইল নম্বর", "cart.address": "পুরো ঠিকানা",
      "cart.addressPh": "বাসা, রোড, এলাকা, থানা, জেলা",
      "cart.note": "নোট (ঐচ্ছিক)", "cart.notePh": "কালার পছন্দ বা অন্য কিছু",
      "cart.send": "WhatsApp এ অর্ডার পাঠান",
      "cart.fine": "বাটন চাপলে WhatsApp খুলবে, অর্ডারের সব তথ্য লেখা থাকবে। শুধু Send চাপুন।",
      "cart.remove": "সরিয়ে দিন",
      "err.name": "আপনার নাম লিখুন।", "err.phone": "১১ সংখ্যার মোবাইল নম্বর লিখুন, যেমন 01712345678।", "err.address": "ডেলিভারির পুরো ঠিকানা লিখুন।",
      "pd.option": "প্যাক", "pd.size": "সাইজ", "pd.qty": "পরিমাণ", "pd.color": "রং / ডিজাইন",
      "pd.note": "কালার বা ডিজাইন পছন্দ (ঐচ্ছিক)", "pd.notePh": "যেমন: কালো আর পিংক", "pd.noteOnly": "নোট (ঐচ্ছিক)", "pd.noteOnlyPh": "আর কিছু জানাতে চাইলে লিখুন", "pd.notePackPh": "যেমন: ২য় পিসটা অন্য রঙে চাই",
      "pd.add": "কার্টে যোগ করুন", "pd.buy": "এখনই কিনুন",
      "pd.ask": "WhatsApp এ দাম জানুন", "pd.askNote": "এই পণ্যের দাম ও স্টক WhatsApp এ জানিয়ে দেওয়া হয়।",
      "pd.soldNote": "এই পণ্যটি এখন স্টকে নেই। আবার কবে আসবে জানতে WhatsApp করুন।",
      "pd.soldAsk": "স্টক কবে আসবে জানুন",
      "pd.pickSize": "আগে একটা সাইজ বেছে নিন।", "pd.pickColor": "আগে একটা রং বেছে নিন।", "card.colors": "{n}টি রং", "pd.sizeHelp": "সাইজ গাইড",
      "pd.trustDel": "ঢাকায় ৳{in}, বাইরে ৳{out}", "pd.trustCod": "ক্যাশ অন ডেলিভারি", "pd.trustHelp": "সাইজ নিয়ে সাহায্য",
      "card.add": "কার্টে যোগ করুন", "card.ask": "দাম জানুন", "card.askPrice": "দাম জানতে মেসেজ করুন", "card.sold": "স্টক শেষ",
      "badge.new": "নতুন", "badge.hot": "হট", "badge.offer": "অফার", "badge.sold": "স্টক শেষ",
      "wish.title": "আপনার পছন্দের তালিকা", "wish.empty": "যেকোনো পণ্যের হার্ট চিহ্নে চাপ দিলে এখানে জমা থাকবে।", "wish.view": "দেখুন", "wish.remove": "সরিয়ে দিন",
      "wish.add": "পছন্দের তালিকায় রাখুন", "wish.added": "পছন্দের তালিকায় রাখা হয়েছে", "wish.removed": "পছন্দের তালিকা থেকে সরানো হয়েছে",
      "toast.added": "কার্টে যোগ হয়েছে", "toast.removed": "কার্ট থেকে সরানো হয়েছে",
      "qty.minus": "কমান", "qty.plus": "বাড়ান",
      "preview.flag": "প্রিভিউ: অ্যাডমিনের না-পাবলিশ করা পরিবর্তন দেখাচ্ছে",
      "wa.hello": "হ্যালো Blushing Beauty, আমি কিছু পণ্য সম্পর্কে জানতে চাই।",
      "wa.ask": "হ্যালো Blushing Beauty, \"{p}\" এর দাম ও স্টক জানতে চাই।",
      "wa.stock": "হ্যালো Blushing Beauty, \"{p}\" আবার কবে স্টকে আসবে?",
      "wa.size": "হ্যালো Blushing Beauty, আমার সঠিক সাইজ জানতে সাহায্য চাই।"
    }
  };

  /* ---------- icons ---------- */
  var ICON = {
    bra: '<svg viewBox="0 0 32 32"><path d="M5 9c0 6 2 11 6 11s5-3 5-5c0 2 1 5 5 5s6-5 6-11"/><path d="M5 9c3 4 7 6 11 6s8-2 11-6M10 6l1 5M22 6l-1 5"/></svg>',
    panty: '<svg viewBox="0 0 32 32"><path d="M4 9h24l-2 6c-3 1-6 4-7 8h-6c-1-4-4-7-7-8z"/><path d="M4 12h24"/></svg>',
    set: '<svg viewBox="0 0 32 32"><path d="M9 4v6M23 4v6M8 10c0 3 1 6 4 6s4-2 4-4c0 2 1 4 4 4s4-3 4-6c-2 2-5 3-8 3s-6-1-8-3Z"/><path d="M8 19h16l-1.5 4c-2 .7-4 2.5-4.5 5h-4c-.5-2.5-2.5-4.3-4.5-5z"/></svg>',
    dress: '<svg viewBox="0 0 32 32"><path d="M12 3v5M20 3v5M12 8h8l-1.5 6L24 28H8l5.5-14z"/><path d="M13.5 14h5"/></svg>',
    gift: '<svg viewBox="0 0 32 32"><rect x="5" y="12" width="22" height="15" rx="1.5"/><path d="M4 12h24M16 12v15M16 12c-3-5-8-6-8-2s8 2 8 2Zm0 0c3-5 8-6 8-2s-8 2-8 2Z"/></svg>',
    bow: '<svg viewBox="0 0 32 32"><path d="M16 15c-3-5-9-8-11-5s1 9 11 5Zm0 0c3-5 9-8 11-5s-1 9-11 5Zm0 0-4 11m4-11 4 11"/><circle cx="16" cy="15" r="1.8"/></svg>',
    arrowCircle: '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="9"/><path d="M8.5 12h7m-3-3 3 3-3 3"/></svg>',
    arrow: '<svg viewBox="0 0 24 24"><path d="M5 12h14m-5-5 5 5-5 5"/></svg>',
    heart: '<svg viewBox="0 0 24 24"><path d="M12 20s-7.5-4.6-7.5-10.2A4.3 4.3 0 0 1 12 7.2a4.3 4.3 0 0 1 7.5 2.6C19.5 15.4 12 20 12 20Z"/></svg>',
    star: '<svg viewBox="0 0 24 24"><path d="m12 3 2.7 5.6 6.1.9-4.4 4.3 1 6.1L12 17l-5.4 2.9 1-6.1-4.4-4.3 6.1-.9z"/></svg>',
    pin: '<svg viewBox="0 0 24 24"><path d="M12 21s-7-6.2-7-11.5a7 7 0 0 1 14 0C19 14.8 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.5"/></svg>',
    fb: '<svg viewBox="0 0 24 24"><path d="M14.5 8H17V4.5h-2.5C12 4.5 10.5 6 10.5 8.6V11H8v3.5h2.5V21H14v-6.5h2.6l.4-3.5h-3V9.1c0-.7.3-1.1.5-1.1Z"/></svg>',
    ig: '<svg viewBox="0 0 24 24"><rect x="4" y="4" width="16" height="16" rx="4.5"/><circle cx="12" cy="12" r="3.6"/><circle cx="16.8" cy="7.2" r=".9"/></svg>',
    yt: '<svg viewBox="0 0 24 24"><rect x="3" y="6" width="18" height="12" rx="4"/><path d="m10.5 9.5 4 2.5-4 2.5z"/></svg>',
    tt: '<svg viewBox="0 0 24 24"><path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5M14 4c.4 2.6 2.2 4.3 5 4.5"/></svg>',
    wa: '<svg viewBox="0 0 24 24"><path d="M12 3a9 9 0 0 0-7.8 13.5L3 21l4.6-1.2A9 9 0 1 0 12 3Z"/><path d="M9 8.5c.5 3 2.5 5.4 6 6.5"/></svg>'
  };

  /* ---------- helpers ---------- */
  var BN_DIGITS = "০১২৩৪৫৬৭৮৯";
  function toBn(s) { return String(s).replace(/[0-9]/g, function (d) { return BN_DIGITS[d]; }); }
  function toEn(s) { return String(s).replace(/[০-৯]/g, function (d) { return BN_DIGITS.indexOf(d); }); }
  function digits(s) { return state.lang === "bn" ? toBn(s) : toEn(s); }
  function money(n) { return "৳" + digits(Number(n).toLocaleString("en-IN")); }
  function moneyBn(n) { return toBn(Number(n).toLocaleString("en-IN")) + " টাকা"; }
  function t(key, vars) {
    var s = (T[state.lang] && T[state.lang][key]);
    if (s == null) s = T.en[key];
    if (s == null) s = key;
    if (vars) Object.keys(vars).forEach(function (k) { s = s.split("{" + k + "}").join(vars[k]); });
    return s;
  }
  function L(obj) { return obj ? (obj[state.lang] || obj.en || obj.bn || "") : ""; }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) { return Array.prototype.slice.call((root || document).querySelectorAll(sel)); }
  var store = BB.ls;
  function waLink(text) { return "https://wa.me/" + SHOP.whatsapp + "?text=" + encodeURIComponent(text); }
  function openWa(text) { window.open(waLink(text), "_blank", "noopener"); }
  function findProduct(id) { for (var i = 0; i < PRODUCTS.length; i++) if (PRODUCTS[i].id === id) return PRODUCTS[i]; return null; }
  function minPrice(p) {
    var ps = p.options.map(function (o) { return o.price; }).filter(function (x) { return x != null; });
    return ps.length ? Math.min.apply(null, ps) : null;
  }
  function shownPrice(p) { return p.options[0].price != null ? p.options[0].price : minPrice(p); }
  function sizesOf(p) { return p.sizes === "bra" ? SHOP.braSizes : (Array.isArray(p.sizes) ? p.sizes : null); }
  function canOrder(p) { return p.inStock && minPrice(p) != null; }
  // "Combo Offers" also lists every product sold in packs (e.g. 1 piece / 3 pieces)
  function isPack(p) { return p.options.filter(function (o) { return o.price != null; }).length > 1; }
  function inCat(p, id) { return p.cat === id || (id === "combo" && isPack(p)); }
  function colorsOf(p) { return p.colors && p.colors.length ? p.colors : null; }
  var SWATCH = { black: "#1E1A1C", white: "#F8F5F0", pink: "#EE8DB1", maroon: "#6B1A2E", red: "#C62233", blue: "#3E5FA6",
    olive: "#7C7A3E", nude: "#E3BC9C", green: "#9DBBA2", "bottle green": "#14523A", purple: "#7B4BA0", brown: "#7A4A32", peach: "#F4B08A" };
  function swatch(c) { return SWATCH[String(c.en || "").trim().toLowerCase()] || ""; }
  function sameColor(a, b) { return (!a && !b) || (a && b && a.bn === b.bn); }
  function catOf(id) { return CATS.filter(function (x) { return x.id === id; })[0]; }
  function catLabel(id) { var c = catOf(id); return c ? L(c.label) : ""; }
  function nameBn(p) { return p.name.bn || p.name.en; }
  // absolute url: a relative url inside a CSS variable would resolve against the stylesheet folder
  function cssUrl(src) {
    var abs = String(src);
    try { abs = new URL(abs, document.baseURI).href; } catch (e) {}
    return 'url("' + abs.replace(/["\\\n]/g, encodeURIComponent) + '")';
  }

  /* ---------- state ---------- */
  var savedLang = store("bb_lang");
  var state = {
    lang: savedLang === "bn" || savedLang === "en" ? savedLang : "en",
    cat: "all", q: "", sort: "default",
    cart: Array.isArray(store("bb_cart")) ? store("bb_cart") : [],
    wish: Array.isArray(store("bb_wish")) ? store("bb_wish") : [],
    area: store("bb_area") || "inside",
    form: store("bb_form") || { name: "", phone: "", address: "", note: "" },
    ready: false
  };

  function useData(data) {
    SHOP = data.settings;
    PRODUCTS = data.products.filter(function (p) { return p.active; });
    CATS = data.settings.categories;
    if (!savedLang) state.lang = SHOP.defaultLang || "en";
    if (!SHOP.delivery.some(function (d) { return d.id === state.area; })) state.area = SHOP.delivery[0].id;
    state.cart = state.cart.filter(function (l) {
      var p = findProduct(l.pid); if (!p || !p.inStock) return false;
      var o = p.options.filter(function (x) { return x.id === l.oid; })[0];
      return o && o.price != null;
    });
    state.wish = state.wish.filter(function (id) { return !!findProduct(id); });
    store("bb_cart", state.cart); store("bb_wish", state.wish);
    if (state.cat !== "all" && !catOf(state.cat)) state.cat = "all";
    state.ready = true;
  }

  function textVars() {
    var d = SHOP ? SHOP.delivery : [];
    return {
      "in": digits(d[0] ? d[0].fee : ""), out: digits(d[1] ? d[1].fee : ""),
      size: digits(SHOP && SHOP.braSizes[0] ? SHOP.braSizes[0] : "32")
    };
  }

  /* ---------- apply language + render everything ---------- */
  function applyLang() {
    var v = textVars();
    document.documentElement.lang = state.lang;
    $all("[data-i18n]").forEach(function (el) {
      var key = el.getAttribute("data-i18n");
      if (key === "faq.a1" && !state.ready) return;
      el.textContent = t(key, v);
    });
    $all("[data-i18n-ph]").forEach(function (el) { el.placeholder = t(el.getAttribute("data-i18n-ph")); });
    $all(".num").forEach(function (el) { el.textContent = digits(el.textContent); });
    $all(".lang button").forEach(function (b) { b.setAttribute("aria-pressed", String(b.dataset.lang === state.lang)); });
    $("#year").textContent = digits(new Date().getFullYear());
    $("#storyBtn span").textContent = t($("#aboutMore").hidden ? "about.cta" : "about.ctaLess");
    if (!state.ready) return;
    $all(".js-addr").forEach(function (el) { el.textContent = L(SHOP.address); });
    renderHero(); renderDrop(); renderTiles(); renderOffers(); renderChips(); renderGrid(); renderReviews(); renderSocials();
    renderCounts();
    if ($("#cartDialog").open) renderCart();
    if ($("#wishDialog").open) renderWish();
    if ($("#productDialog").open && currentPd) renderPd(currentPd.pid, true);
  }

  /* ---------- hero slider ---------- */
  var H = { i: 0, n: 0, timer: null, hold: false };

  function collageList(b) {
    if (!b.collage) return [];
    var list = PRODUCTS.filter(function (p) { return inCat(p, b.collage) && p.images.length; });
    list.sort(function (a, c) { return (canOrder(a) ? 0 : 1) - (canOrder(c) ? 0 : 1); });
    return list.slice(0, 3);
  }
  function linkAttrs(link) {
    if (/^cat:/.test(link)) return 'href="#shop" data-goto-cat="' + esc(link.slice(4)) + '"';
    return 'href="' + esc(link && link.charAt(0) === "#" ? link : "#shop") + '"';
  }

  function renderHero() {
    var banners = SHOP.banners.filter(function (b) { return b.image || collageList(b).length; });
    var hero = $("#hero");
    hero.hidden = !banners.length;
    if (!banners.length) { stopAuto(); return; }
    H.n = banners.length;
    if (H.i >= H.n) H.i = 0;
    $("#slides").innerHTML = banners.map(function (b, i) {
      var tag = i === 0 ? "h1" : "h2";
      var col = b.image ? [] : collageList(b);
      return '<div class="slide' + (b.image ? "" : " is-collage") + '" role="group" aria-roledescription="slide" data-slide="' + i + '">' +
        '<div class="slide-media' + (b.image && b.imageMobile ? " has-m" : "") + '"' + (b.image ? ' data-bg="' + esc(b.image) + '"' : "") + (b.image && b.imageMobile ? ' data-bgm="' + esc(b.imageMobile) + '"' : "") + '></div>' +
        (col.length ? '<div class="collage n' + col.length + '">' + col.map(function (p) {
          return '<button type="button" class="collage-card" data-open="' + esc(p.id) + '" aria-label="' + esc(L(p.name)) + '"><img src="' + esc(p.images[0]) + '" alt=""></button>';
        }).join("") + '</div>' : "") +
        '<div class="wrap slide-inner"><div class="slide-copy">' +
          (L(b.label) ? '<p class="eyebrow">' + esc(L(b.label)) + '</p>' : "") +
          '<' + tag + ' class="slide-title">' + esc(L(b.title)) + '</' + tag + '>' +
          (b.script ? '<p class="slide-script">' + esc(b.script) + ' <span class="heart">♡</span></p>' : "") +
          (L(b.sub) ? '<p class="slide-sub">' + esc(L(b.sub)) + '</p>' : "") +
          (L(b.cta) ? '<a class="btn btn-berry" ' + linkAttrs(b.link) + '><span>' + esc(L(b.cta)) + '</span>' + ICON.arrow + '</a>' : "") +
        '</div>' +
        (b.aside ? '<p class="slide-aside" aria-hidden="true">' + esc(b.aside) + ' <span class="heart">♡</span></p>' : "") +
        '</div></div>';
    }).join("");
    $all("#slides [data-bg]").forEach(function (el) {
      el.style.setProperty("--img", cssUrl(el.getAttribute("data-bg")));
      if (el.hasAttribute("data-bgm")) el.style.setProperty("--img-m", cssUrl(el.getAttribute("data-bgm")));
    });
    $("#heroDots").innerHTML = H.n > 1 ? banners.map(function (_, i) {
      return '<button type="button" data-dot="' + i + '" aria-label="' + (i + 1) + '"></button>';
    }).join("") : "";
    $("#heroPrev").hidden = $("#heroNext").hidden = H.n < 2;
    showSlide(H.i);
    startAuto();
  }

  function showSlide(i) {
    H.i = (i + H.n) % H.n;
    $all("#slides .slide").forEach(function (s, k) {
      var on = k === H.i;
      s.classList.toggle("is-active", on);
      s.setAttribute("aria-hidden", String(!on));
      $all("a, button", s).forEach(function (x) { x.tabIndex = on ? 0 : -1; });
    });
    $all("#heroDots button").forEach(function (d, k) { d.setAttribute("aria-current", k === H.i ? "true" : "false"); });
  }
  function startAuto() {
    stopAuto();
    if (reduceMotion || H.n < 2) return;
    H.timer = setInterval(function () { if (!H.hold && !document.hidden) showSlide(H.i + 1); }, 6500);
  }
  function stopAuto() { if (H.timer) clearInterval(H.timer); H.timer = null; }

  function initHero() {
    var hero = $("#hero");
    $("#heroPrev").addEventListener("click", function () { showSlide(H.i - 1); startAuto(); });
    $("#heroNext").addEventListener("click", function () { showSlide(H.i + 1); startAuto(); });
    hero.addEventListener("pointerenter", function (e) { if (e.pointerType === "mouse") H.hold = true; });
    hero.addEventListener("pointerleave", function () { H.hold = false; });
    hero.addEventListener("focusin", function () { H.hold = true; });
    hero.addEventListener("focusout", function () { H.hold = false; });
    var sx = null, sy = null;
    hero.addEventListener("pointerdown", function (e) { sx = e.clientX; sy = e.clientY; });
    hero.addEventListener("pointerup", function (e) {
      if (sx == null) return;
      var dx = e.clientX - sx, dy = e.clientY - sy; sx = null;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4) { showSlide(H.i + (dx < 0 ? 1 : -1)); startAuto(); }
    });
  }

  /* ---------- header: dropdown, mobile drawer, scrollspy ---------- */
  function renderDrop() {
    $("#shopDrop").innerHTML = '<a href="#shop" data-goto-cat="all">' + t("nav.all") + '</a>' + CATS.map(function (c) {
      var n = PRODUCTS.filter(function (p) { return inCat(p, c.id); }).length;
      if (!n) return "";
      return '<a href="#shop" data-goto-cat="' + esc(c.id) + '"><span class="drop-ico">' + (ICON[c.icon] || ICON.bow) + '</span>' + esc(L(c.label)) + '<small>' + digits(n) + '</small></a>';
    }).join("");
  }
  function closeNav() {
    $("#mainNav").classList.remove("open"); $("#navScrim").hidden = true;
    $("#menuBtn").setAttribute("aria-expanded", "false"); document.body.classList.remove("nav-open");
  }
  function openNav() {
    $("#mainNav").classList.add("open"); $("#navScrim").hidden = false;
    $("#menuBtn").setAttribute("aria-expanded", "true"); document.body.classList.add("nav-open");
  }
  function initSpy() {
    if (!("IntersectionObserver" in window)) return;
    var links = $all("[data-spy]");
    var targets = { top: $("#hero"), offers: $("#offers"), about: $("#about"), contact: $("#contact") };
    var visible = {};
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (en) { visible[en.target.dataset.spyId] = en.isIntersecting; });
      var cur = ["contact", "about", "offers", "top"].filter(function (k) { return visible[k]; })[0] || "";
      links.forEach(function (a) { a.classList.toggle("is-active", a.dataset.spy === cur); });
    }, { rootMargin: "-45% 0px -50% 0px" });
    Object.keys(targets).forEach(function (k) { if (targets[k]) { targets[k].dataset.spyId = k; io.observe(targets[k]); } });
    $("[data-spy='top']").classList.add("is-active");
  }

  /* ---------- collections ---------- */
  function renderTiles() {
    var html = CATS.map(function (c) {
      var list = PRODUCTS.filter(function (p) { return inCat(p, c.id); });
      if (!list.length) return "";
      var img = c.image || ((list.filter(function (p) { return p.images.length; })[0] || {}).images || ["images/logo.webp"])[0];
      return '<button type="button" class="cat-tile" data-goto-cat="' + esc(c.id) + '">' +
        '<img src="' + esc(img) + '" alt="" loading="lazy">' +
        '<span class="cat-info"><span class="cat-ico">' + (ICON[c.icon] || ICON.bow) + '</span>' +
          '<span class="cat-txt"><b>' + esc(L(c.label)) + '</b><span class="cat-shop">' + t("cats.shop") + ICON.arrowCircle + '</span></span></span>' +
        '<span class="cat-go">' + ICON.arrowCircle + '</span></button>';
    }).join("");
    $("#catTiles").innerHTML = html;
    $("#categories").hidden = !html;
  }

  /* ---------- product cards ---------- */
  function badgeHtml(p) {
    if (!p.inStock) return '<span class="badge badge-sold">' + t("badge.sold") + '</span>';
    return p.badge ? '<span class="badge badge-' + p.badge + '">' + t("badge." + p.badge) + '</span>' : "";
  }
  function priceHtml(p) {
    if (!p.inStock) return '<p class="pc-price is-muted">' + t("card.sold") + '</p>';
    var sp = shownPrice(p);
    if (sp == null) return '<p class="pc-price is-muted">' + t("card.askPrice") + '</p>';
    var o = p.options[0];
    return '<p class="pc-price">' + money(sp) + (o.oldPrice && o.price != null ? ' <s>' + money(o.oldPrice) + '</s>' : "") + '</p>';
  }
  function isWished(id) { return state.wish.indexOf(id) >= 0; }
  function wishBtn(p, cls) {
    var on = isWished(p.id);
    return '<button type="button" class="wish-btn ' + (cls || "") + (on ? " is-on" : "") + '" data-wish="' + esc(p.id) + '" aria-pressed="' + on + '" aria-label="' + esc(t("wish.add")) + '">' + ICON.heart + '</button>';
  }
  function cardHtml(p) {
    var btn = !p.inStock
      ? '<button type="button" class="btn btn-outline btn-sm" data-stock="' + esc(p.id) + '">' + t("pd.soldAsk") + '</button>'
      : minPrice(p) == null
        ? '<button type="button" class="btn btn-outline btn-sm" data-ask="' + esc(p.id) + '">' + t("card.ask") + '</button>'
        : '<button type="button" class="btn btn-berry btn-sm" data-open="' + esc(p.id) + '">' + t("card.add") + '</button>';
    return '<article class="pcard' + (p.inStock ? "" : " is-sold") + '">' +
      '<div class="pc-media">' +
        '<button type="button" class="pc-img" data-open="' + esc(p.id) + '" aria-label="' + esc(L(p.name)) + '">' +
          '<img src="' + esc(p.images[0] || "images/logo.webp") + '" alt="" loading="lazy">' +
          (p.images[1] ? '<img class="img-alt" src="' + esc(p.images[1]) + '" alt="" loading="lazy">' : "") +
        '</button>' + badgeHtml(p) + wishBtn(p) +
      '</div>' +
      '<div class="pc-body">' +
        '<p class="pc-cat">' + esc(catLabel(p.cat)) + '</p>' +
        '<h3 class="pc-name"><button type="button" data-open="' + esc(p.id) + '">' + esc(L(p.name)) + '</button></h3>' +
        priceHtml(p) +
        colorDots(p) +
        (L(p.note) ? '<p class="pc-note">' + esc(L(p.note)) + '</p>' : "") +
        btn +
      '</div></article>';
  }

  function colorDots(p) {
    var cs = colorsOf(p); if (!cs) return "";
    var dots = cs.map(swatch).filter(Boolean).slice(0, 6);
    return '<p class="pc-colors">' + dots.map(function (c) { return '<i style="--c:' + c + '"></i>'; }).join("") +
      '<span>' + t("card.colors", { n: digits(cs.length) }) + '</span></p>';
  }

  function renderOffers() {
    var list = PRODUCTS.filter(function (p) { return p.featured; });
    $("#offers").hidden = !list.length;
    $("#offerRail").innerHTML = list.map(cardHtml).join("");
    updateRailArrows($("#offerRail"));
  }

  function renderChips() {
    var all = [{ id: "all", label: { bn: T.bn["cat.all"], en: T.en["cat.all"] } }].concat(CATS);
    $("#chips").innerHTML = all.map(function (c) {
      var count = c.id === "all" ? PRODUCTS.length : PRODUCTS.filter(function (p) { return inCat(p, c.id); }).length;
      if (!count) return "";
      return '<button type="button" role="tab" class="chip" data-cat="' + esc(c.id) + '" aria-selected="' + (state.cat === c.id) + '">' +
        esc(L(c.label)) + ' <span class="chip-n">' + digits(count) + '</span></button>';
    }).join("");
  }

  function matches(p, q) {
    if (!q) return true;
    var hay = [p.name.bn, p.name.en, p.note.bn, p.note.en, p.desc.bn, p.desc.en, catLabel(p.cat)].join(" ").toLowerCase();
    return q.toLowerCase().split(/\s+/).filter(Boolean).every(function (w) { return hay.indexOf(w) >= 0; });
  }
  function filtered() {
    var list = PRODUCTS.filter(function (p) { return (state.cat === "all" || inCat(p, state.cat)) && matches(p, state.q); });
    if (state.sort !== "default") {
      var dir = state.sort === "low" ? 1 : -1;
      list = list.slice().sort(function (a, b) {
        var pa = shownPrice(a), pb = shownPrice(b);
        if (pa == null && pb == null) return 0;
        if (pa == null) return 1;
        if (pb == null) return -1;
        return (pa - pb) * dir;
      });
    }
    return list.filter(function (p) { return p.inStock; }).concat(list.filter(function (p) { return !p.inStock; }));
  }
  function renderGrid() {
    var list = filtered();
    $("#resultCount").textContent = state.q || state.cat !== "all" ? t("shop.count", { n: digits(list.length) }) : "";
    $("#grid").innerHTML = list.length ? list.map(cardHtml).join("")
      : '<div class="empty"><p>' + t("shop.none") + '</p><button type="button" class="btn btn-outline btn-sm" id="clearSearch">' + t("shop.clear") + '</button></div>';
  }
  function renderSkeleton() {
    var sk = "";
    for (var i = 0; i < 8; i++) sk += '<div class="pcard sk" aria-hidden="true"><div class="sk-img"></div><div class="pc-body"><div class="sk-line short"></div><div class="sk-line"></div><div class="sk-line short"></div><div class="sk-btn"></div></div></div>';
    $("#grid").innerHTML = sk;
  }

  /* ---------- rails (offers, reviews) ---------- */
  function updateRailArrows(rail) {
    var wrap = rail.closest(".rail-wrap"); if (!wrap) return;
    var more = rail.scrollWidth > rail.clientWidth + 4;
    $all(".rail-arrow", wrap).forEach(function (b) { b.hidden = !more; });
  }

  /* ---------- reviews (real reviews from admin) ---------- */
  function renderReviews() {
    var list = SHOP.reviews || [];
    $("#reviews").hidden = !list.length;
    $("#revRail").innerHTML = list.map(function (r) {
      var text = L(r.text);
      var initials = r.name.split(/\s+/).map(function (w) { return w.charAt(0); }).join("").slice(0, 2).toUpperCase();
      var stars = "";
      for (var i = 1; i <= 5; i++) stars += '<span class="' + (i <= r.rating ? "on" : "") + '">' + ICON.star + '</span>';
      return '<figure class="rev-card">' +
        (r.photo ? '<img class="rev-av" src="' + esc(r.photo) + '" alt="">' : '<span class="rev-av rev-initials" aria-hidden="true">' + esc(initials) + '</span>') +
        '<div><figcaption class="rev-name">' + esc(r.name) + '</figcaption>' +
        '<div class="rev-stars" aria-label="' + r.rating + '/5">' + stars + '</div>' +
        '<blockquote>"' + esc(text) + '"</blockquote>' +
        (r.location ? '<p class="rev-loc">' + ICON.pin + esc(r.location) + '</p>' : "") +
        '</div></figure>';
    }).join("");
    updateRailArrows($("#revRail"));
  }

  /* ---------- footer socials ---------- */
  function renderSocials() {
    var items = [
      ["fb", SHOP.facebookUrl, "Facebook"], ["ig", SHOP.instagramUrl, "Instagram"],
      ["yt", SHOP.youtubeUrl, "YouTube"], ["tt", SHOP.tiktokUrl, "TikTok"],
      ["wa", "https://wa.me/" + SHOP.whatsapp, "WhatsApp"]
    ].filter(function (x) { return x[1]; });
    $("#socials").innerHTML = items.map(function (x) {
      return '<a href="' + esc(x[1]) + '" target="_blank" rel="noopener" aria-label="' + x[2] + '">' + ICON[x[0]] + '</a>';
    }).join("");
  }

  /* ---------- wishlist ---------- */
  function toggleWish(id) {
    var i = state.wish.indexOf(id);
    if (i >= 0) state.wish.splice(i, 1); else state.wish.unshift(id);
    store("bb_wish", state.wish);
    var on = isWished(id);
    $all('[data-wish="' + CSS.escape(id) + '"]').forEach(function (b) { b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", String(on)); });
    renderCounts();
    if ($("#wishDialog").open) renderWish();
    toast(t(on ? "wish.added" : "wish.removed"));
  }
  function renderWish() {
    var list = state.wish.map(findProduct).filter(Boolean);
    $("#wishBody").innerHTML = !list.length
      ? '<div class="drawer-empty">' + ICON.heart + '<p>' + t("wish.empty") + '</p></div>'
      : '<ul class="lines" role="list">' + list.map(function (p) {
          return '<li class="line">' +
            '<img src="' + esc(p.images[0] || "images/logo.webp") + '" alt="">' +
            '<div class="line-main"><p class="line-name">' + esc(L(p.name)) + '</p>' + priceHtml(p) +
            '<div class="line-actions"><button type="button" class="btn btn-berry btn-xs" data-open="' + esc(p.id) + '" data-close-wish>' + t("wish.view") + '</button>' +
            '<button type="button" class="line-remove" data-wish="' + esc(p.id) + '">' + t("wish.remove") + '</button></div></div></li>';
        }).join("") + '</ul>';
  }

  /* ---------- product dialog ---------- */
  var currentPd = null;
  function renderPd(pid, keep) {
    var p = findProduct(pid); if (!p) return;
    if (!keep || !currentPd || currentPd.pid !== pid) {
      var firstPriced = p.options.filter(function (o) { return o.price != null; })[0] || p.options[0];
      currentPd = { pid: pid, oid: firstPriced.id, size: null, color: null, qty: 1, note: "", img: 0 };
    }
    var s = currentPd;
    var imgs = p.images.length ? p.images : ["images/logo.webp"];
    if (s.img >= imgs.length) s.img = 0;
    var opt = p.options.filter(function (o) { return o.id === s.oid; })[0] || p.options[0];
    var sizes = sizesOf(p);
    var orderable = p.inStock && opt.price != null;

    var gallery = '<div class="pd-gallery"><div class="pd-main"><div class="pd-slides" id="pdSlides">' +
      imgs.map(function (src, i) { return '<div class="pd-slide"><img src="' + esc(src) + '" alt="' + (i === 0 ? esc(L(p.name)) : "") + '"></div>'; }).join("") +
      '</div>' + badgeHtml(p) +
      (imgs.length > 1 ? '<div class="pd-dots" aria-hidden="true">' + imgs.map(function (_, i) { return '<span' + (i === s.img ? ' class="on"' : "") + '></span>'; }).join("") + '</div>' : "") +
      '</div>' +
      (imgs.length > 1 ? '<div class="pd-thumbs">' + imgs.map(function (src, i) {
        return '<button type="button" class="pd-thumb" data-img="' + i + '" aria-pressed="' + (i === s.img) + '"><img src="' + esc(src) + '" alt=""></button>';
      }).join("") + '</div>' : "") + '</div>';

    var priceRow = !p.inStock
      ? '<p class="pd-note-box">' + t("pd.soldNote") + '</p>'
      : opt.price == null
        ? '<p class="pd-note-box">' + t("pd.askNote") + '</p>'
        : '<p class="pd-price">' + money(opt.price) + (opt.oldPrice ? ' <s>' + money(opt.oldPrice) + '</s>' : "") + '</p>';

    var optRow = p.options.length > 1 && p.inStock
      ? '<fieldset class="pd-field"><legend>' + t("pd.option") + '</legend><div class="seg">' +
        p.options.map(function (o) {
          return '<button type="button" class="seg-btn" data-oid="' + esc(o.id) + '" aria-pressed="' + (o.id === opt.id) + '">' +
            esc(L(o.label)) + (o.price != null ? ' <span>' + money(o.price) + '</span>' : "") + '</button>';
        }).join("") + '</div></fieldset>' : "";

    var colors = colorsOf(p);
    var colorRow = (orderable && colors)
      ? '<fieldset class="pd-field"><legend>' + t("pd.color") + '</legend><div class="seg seg-color">' +
        colors.map(function (c, i) {
          var sw = swatch(c);
          return '<button type="button" class="seg-btn" data-color="' + i + '" aria-pressed="' + sameColor(c, s.color) + '">' +
            (sw ? '<i class="sw" style="--c:' + sw + '"></i>' : "") + esc(L(c)) + '</button>';
        }).join("") + '</div><p class="pd-err" id="pdErrColor" role="alert"></p></fieldset>' : "";

    var sizeRow = (orderable && sizes)
      ? '<fieldset class="pd-field"><legend>' + t("pd.size") +
        ' <a href="#size" class="pd-sizehelp" data-close-pd>' + t("pd.sizeHelp") + '</a></legend><div class="seg seg-size">' +
        sizes.map(function (z) {
          return '<button type="button" class="seg-btn" data-size="' + esc(z) + '" aria-pressed="' + (z === s.size) + '">' + esc(digits(z)) + '</button>';
        }).join("") + '</div><p class="pd-err" id="pdErr" role="alert"></p></fieldset>' : "";

    var qtyRow = orderable
      ? '<div class="pd-field pd-row"><span class="pd-label">' + t("pd.qty") + '</span>' +
        '<div class="qty"><button type="button" data-qty="-1" aria-label="' + t("qty.minus") + '">−</button><output>' + digits(s.qty) + '</output>' +
        '<button type="button" data-qty="1" aria-label="' + t("qty.plus") + '">+</button></div></div>' +
        '<label class="pd-field"><span class="pd-label">' + t(colors ? "pd.noteOnly" : "pd.note") + '</span>' +
        '<input type="text" id="pdNote" maxlength="80" placeholder="' + esc(t(colors ? (isPack(p) ? "pd.notePackPh" : "pd.noteOnlyPh") : "pd.notePh")) + '" value="' + esc(s.note) + '"></label>'
      : "";

    var actions = !p.inStock
      ? '<div class="pd-actions"><button type="button" class="btn btn-berry" data-stock="' + esc(p.id) + '">' + t("pd.soldAsk") + '</button></div>'
      : !orderable
        ? '<div class="pd-actions"><button type="button" class="btn btn-berry" data-ask="' + esc(p.id) + '">' + t("pd.ask") + '</button></div>'
        : '<div class="pd-actions"><button type="button" class="btn btn-berry" id="pdAdd">' + t("pd.add") + '</button>' +
          '<button type="button" class="btn btn-outline" id="pdBuy">' + t("pd.buy") + '</button></div>';

    var v = textVars();
    var trust = '<ul class="pd-trust" role="list">' +
      '<li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M2.5 7h11v9h-11zM13.5 10h4l3 3v3h-7"/><circle cx="6.5" cy="17.5" r="1.7"/><circle cx="17" cy="17.5" r="1.7"/></svg>' + t("pd.trustDel", v) + '</li>' +
      '<li><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="6.5" width="18" height="11" rx="2"/><circle cx="12" cy="12" r="2.6"/></svg>' + t("pd.trustCod") + '</li>' +
      '<li><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 5h16v11H9l-5 4z"/></svg><a href="#" data-wa-size>' + t("pd.trustHelp") + '</a></li>' +
      '</ul>';

    $("#pdBody").innerHTML = gallery +
      '<div class="pd-info"><div class="pd-top"><p class="pd-cat">' + esc(catLabel(p.cat)) + '</p>' + wishBtn(p, "pd-wish") + '</div>' +
      '<h2 id="pdName">' + esc(L(p.name)) + '</h2>' + priceRow +
      (L(p.desc) ? '<p class="pd-desc">' + esc(L(p.desc)) + '</p>' : "") + optRow + colorRow + sizeRow + qtyRow + actions + trust + '</div>';

    var slides = $("#pdSlides");
    if (slides) {
      slides.scrollLeft = s.img * slides.clientWidth;
      slides.addEventListener("scroll", function () {
        var i = Math.round(slides.scrollLeft / Math.max(1, slides.clientWidth));
        if (!currentPd || i === currentPd.img) return;
        currentPd.img = i;
        $all(".pd-thumb", $("#pdBody")).forEach(function (b, k) { b.setAttribute("aria-pressed", String(k === i)); });
        $all(".pd-dots span", $("#pdBody")).forEach(function (d, k) { d.classList.toggle("on", k === i); });
      }, { passive: true });
    }
  }
  function openPd(pid) {
    if (!findProduct(pid)) return;
    renderPd(pid);
    var d = $("#productDialog");
    if (!d.open) d.showModal();
    d.scrollTop = 0;
  }
  function pdLine() {
    var p = findProduct(currentPd.pid);
    if (colorsOf(p) && !currentPd.color) {
      var ec = $("#pdErrColor"); if (ec) ec.textContent = t("pd.pickColor");
      var fc = $(".seg-color .seg-btn"); if (fc) fc.focus();
      return null;
    }
    if (sizesOf(p) && !currentPd.size) {
      var e = $("#pdErr"); if (e) e.textContent = t("pd.pickSize");
      var first = $(".seg-size .seg-btn"); if (first) first.focus();
      return null;
    }
    var note = ($("#pdNote") || {}).value || "";
    return { pid: p.id, oid: currentPd.oid, size: currentPd.size, color: currentPd.color, qty: currentPd.qty, note: note.trim() };
  }
  function addLine(line) {
    var same = state.cart.filter(function (l) {
      return l.pid === line.pid && l.oid === line.oid && l.size === line.size && sameColor(l.color, line.color) && l.note === line.note;
    })[0];
    if (same) same.qty = Math.min(20, same.qty + line.qty); else state.cart.push(line);
    saveCart();
  }

  /* ---------- cart ---------- */
  function lineInfo(l) {
    var p = findProduct(l.pid);
    var o = p.options.filter(function (x) { return x.id === l.oid; })[0];
    return { p: p, o: o, total: o.price * l.qty };
  }
  function subtotal() { return state.cart.reduce(function (s, l) { return s + lineInfo(l).total; }, 0); }
  function itemCount() { return state.cart.reduce(function (s, l) { return s + l.qty; }, 0); }
  function area() { return SHOP.delivery.filter(function (d) { return d.id === state.area; })[0] || SHOP.delivery[0]; }
  function saveCart() { store("bb_cart", state.cart); renderCounts(); }

  function renderCounts() {
    var n = itemCount();
    $("#cartCount").textContent = digits(n);
    $("#cartCount").classList.toggle("has", n > 0);
    $("#wishCount").textContent = digits(state.wish.length);
    $("#wishCount").classList.toggle("has", state.wish.length > 0);
    $("#cartBar").hidden = n === 0;
    $("#cartBarText").textContent = t("cart.barText", { n: digits(n), t: money(subtotal()) });
  }

  function renderCart() {
    var body = $("#cartBody");
    if (!state.cart.length) {
      body.innerHTML = '<div class="drawer-empty"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5.5 8h13l-1 12h-11l-1-12Z"/><path d="M9 8V6.5a3 3 0 0 1 6 0V8"/></svg><p>' + t("cart.empty") + '</p>' +
        '<a href="#shop" class="btn btn-berry" data-close-cart>' + t("cart.emptyGo") + '</a></div>';
      return;
    }
    var lines = state.cart.map(function (l, i) {
      var info = lineInfo(l);
      var meta = [];
      if (info.p.options.length > 1) meta.push(L(info.o.label));
      if (l.color) meta.push(L(l.color));
      if (l.size) meta.push(t("pd.size") + " " + digits(l.size));
      if (l.note) meta.push(l.note);
      return '<li class="line">' +
        '<img src="' + esc(info.p.images[0] || "images/logo.webp") + '" alt="">' +
        '<div class="line-main"><p class="line-name">' + esc(L(info.p.name)) + '</p>' +
          (meta.length ? '<p class="line-meta">' + esc(meta.join(", ")) + '</p>' : "") +
          '<div class="line-row"><div class="qty qty-sm">' +
            '<button type="button" data-lq="' + i + '" data-d="-1" aria-label="' + t("qty.minus") + '">−</button><output>' + digits(l.qty) + '</output>' +
            '<button type="button" data-lq="' + i + '" data-d="1" aria-label="' + t("qty.plus") + '">+</button></div>' +
            '<span class="line-total">' + money(info.total) + '</span></div>' +
          '<button type="button" class="line-remove" data-rm="' + i + '">' + t("cart.remove") + '</button>' +
        '</div></li>';
    }).join("");
    var areas = SHOP.delivery.map(function (d) {
      return '<label class="area"><input type="radio" name="area" value="' + esc(d.id) + '"' + (d.id === state.area ? " checked" : "") + '>' +
        '<span>' + esc(L(d.label)) + '</span><b>' + money(d.fee) + '</b></label>';
    }).join("");
    var f = state.form;
    body.innerHTML =
      '<ul class="lines" role="list">' + lines + '</ul>' +
      '<form class="checkout" id="checkout" novalidate>' +
        '<fieldset class="areas"><legend>' + t("cart.area") + '</legend>' + areas + '</fieldset>' +
        '<label><span>' + t("cart.name") + '</span><input name="name" autocomplete="name" value="' + esc(f.name) + '" required></label>' +
        '<label><span>' + t("cart.phone") + '</span><input name="phone" type="tel" inputmode="numeric" autocomplete="tel" placeholder="01XXXXXXXXX" value="' + esc(f.phone) + '" required></label>' +
        '<label><span>' + t("cart.address") + '</span><textarea name="address" rows="2" autocomplete="street-address" placeholder="' + esc(t("cart.addressPh")) + '" required>' + esc(f.address) + '</textarea></label>' +
        '<label><span>' + t("cart.note") + '</span><input name="note" placeholder="' + esc(t("cart.notePh")) + '" value="' + esc(f.note) + '"></label>' +
        '<p class="form-err" id="formErr" role="alert"></p>' +
        '<dl class="sum">' +
          '<div><dt>' + t("cart.subtotal") + '</dt><dd>' + money(subtotal()) + '</dd></div>' +
          '<div><dt>' + t("cart.delivery") + '</dt><dd>' + money(area().fee) + '</dd></div>' +
          '<div class="sum-total"><dt>' + t("cart.total") + '</dt><dd>' + money(subtotal() + area().fee) + '</dd></div>' +
        '</dl>' +
        '<button type="submit" class="btn btn-berry btn-block">' + t("cart.send") + '</button>' +
        '<p class="fine">' + t("cart.fine") + '</p>' +
      '</form>';
  }
  function openCart() { renderCart(); var d = $("#cartDialog"); if (!d.open) d.showModal(); }
  function openWishDlg() { renderWish(); var d = $("#wishDialog"); if (!d.open) d.showModal(); }

  function orderId() {
    var d = new Date();
    var p = function (n) { return (n < 10 ? "0" : "") + n; };
    return "BB" + p(d.getDate()) + p(d.getMonth() + 1) + "-" + Math.floor(1000 + Math.random() * 9000);
  }
  // the order message is always written in Bangla for the shop
  function lineText(l, i) {
    var info = lineInfo(l);
    var parts = [nameBn(info.p)];
    if (info.p.options.length > 1) parts.push(info.o.label.bn || info.o.label.en);
    if (l.color) parts.push("রং " + (l.color.bn || l.color.en));
    if (l.size) parts.push("সাইজ " + toBn(l.size));
    var s = toBn(i + 1) + ") " + parts.join(", ") + "\n   পরিমাণ " + toBn(l.qty) + " × " + moneyBn(info.o.price) + " = " + moneyBn(info.total);
    if (l.note) s += "\n   নোট: " + l.note;
    return s;
  }
  function orderMessage(form) {
    var sub = subtotal(), a = area();
    return [
      "নতুন অর্ডার (ওয়েবসাইট থেকে)",
      "অর্ডার নং: " + orderId(),
      "",
      state.cart.map(lineText).join("\n"),
      "",
      "পণ্যের দাম: " + moneyBn(sub),
      "ডেলিভারি (" + (a.label.bn || a.label.en) + "): " + moneyBn(a.fee),
      "মোট: " + moneyBn(sub + a.fee),
      "",
      "নাম: " + form.name,
      "মোবাইল: " + form.phone,
      "ঠিকানা: " + form.address
    ].concat(form.note ? ["নোট: " + form.note] : []).join("\n");
  }
  function readForm(f) {
    return { name: f.name.value.trim(), phone: toEn(f.phone.value).replace(/[\s-]/g, "").trim(), address: f.address.value.trim(), note: f.note.value.trim() };
  }
  function validPhone(ph) { return /^(\+?880)?01[3-9]\d{8}$/.test(ph); }
  function keepForm() {
    var f = $("#checkout"); if (!f) return;
    state.form = readForm(f); state.form.phone = f.phone.value; store("bb_form", state.form);
  }

  /* ---------- toast ---------- */
  var toastTimer;
  function toast(msg) {
    var el = $("#toast"); el.textContent = msg; el.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.classList.remove("show"); }, 2200);
  }

  function gotoCat(id) {
    state.cat = id || "all"; state.q = ""; $("#search").value = "";
    renderChips(); renderGrid();
    closeNav();
    $("#shopDropBtn").setAttribute("aria-expanded", "false"); $(".nav-drop").classList.remove("open");
    $("#shop").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
  }

  /* ---------- events ---------- */
  document.addEventListener("click", function (e) {
    var el;
    if (!state.ready && e.target.closest("[data-open],[data-ask],[data-stock],.js-wa,#cartOpen,#wishOpen,[data-wish]")) { e.preventDefault(); return; }
    if ((el = e.target.closest("[data-wish]"))) { e.preventDefault(); toggleWish(el.dataset.wish); return; }
    if ((el = e.target.closest("[data-open]"))) {
      e.preventDefault();
      if (el.hasAttribute("data-close-wish")) $("#wishDialog").close();
      openPd(el.dataset.open); return;
    }
    if ((el = e.target.closest("[data-ask]"))) { e.preventDefault(); openWa(t("wa.ask", { p: nameBn(findProduct(el.dataset.ask)) })); return; }
    if ((el = e.target.closest("[data-stock]"))) { e.preventDefault(); openWa(t("wa.stock", { p: nameBn(findProduct(el.dataset.stock)) })); return; }
    if (e.target.closest("[data-wa-size]")) { e.preventDefault(); openWa(t("wa.size")); return; }
    if ((el = e.target.closest(".js-wa"))) { e.preventDefault(); openWa(t("wa.hello")); return; }
    if ((el = e.target.closest("[data-goto-cat]"))) { e.preventDefault(); gotoCat(el.dataset.gotoCat); return; }
    if ((el = e.target.closest("[data-cat]"))) { state.cat = el.dataset.cat; renderChips(); renderGrid(); return; }
    if ((el = e.target.closest("[data-lang]"))) { state.lang = el.dataset.lang; savedLang = state.lang; store("bb_lang", state.lang); applyLang(); return; }
    if ((el = e.target.closest("[data-dot]"))) { showSlide(+el.dataset.dot); startAuto(); return; }
    if ((el = e.target.closest("[data-rail]"))) {
      var rail = $(".rail", el.closest(".rail-wrap"));
      rail.scrollBy({ left: (+el.dataset.rail) * rail.clientWidth * 0.8, behavior: reduceMotion ? "auto" : "smooth" });
      return;
    }
    if (e.target.closest("#clearSearch")) { state.q = ""; state.cat = "all"; $("#search").value = ""; renderChips(); renderGrid(); return; }
    if (e.target.closest("#searchBtn")) {
      closeNav();
      $("#shop").scrollIntoView({ behavior: reduceMotion ? "auto" : "smooth" });
      setTimeout(function () { $("#search").focus({ preventScroll: true }); }, reduceMotion ? 0 : 450);
      return;
    }
    if (e.target.closest("#storyBtn")) {
      var more = $("#aboutMore"); more.hidden = !more.hidden;
      $("#storyBtn").setAttribute("aria-expanded", String(!more.hidden));
      $("#storyBtn span").textContent = t(more.hidden ? "about.cta" : "about.ctaLess");
      return;
    }

    if (currentPd && e.target.closest("#productDialog")) {
      var keepNote = function () { currentPd.note = ($("#pdNote") || {}).value || currentPd.note; };
      if ((el = e.target.closest("[data-oid]"))) { keepNote(); currentPd.oid = el.dataset.oid; renderPd(currentPd.pid, true); return; }
      if ((el = e.target.closest("[data-size]"))) { keepNote(); currentPd.size = el.dataset.size; renderPd(currentPd.pid, true); return; }
      if ((el = e.target.closest("[data-color]"))) {
        keepNote();
        var pc = colorsOf(findProduct(currentPd.pid)) || [];
        var cc = pc[+el.dataset.color]; currentPd.color = cc ? { bn: cc.bn, en: cc.en } : null;
        renderPd(currentPd.pid, true); return;
      }
      if ((el = e.target.closest("[data-img]"))) {
        var sl = $("#pdSlides"); if (sl) sl.scrollTo({ left: (+el.dataset.img) * sl.clientWidth, behavior: reduceMotion ? "auto" : "smooth" });
        return;
      }
      if ((el = e.target.closest("[data-qty]"))) {
        currentPd.qty = Math.max(1, Math.min(20, currentPd.qty + (+el.dataset.qty)));
        $("#productDialog .qty output").textContent = digits(currentPd.qty); return;
      }
      if (e.target.closest("#pdAdd")) { var line = pdLine(); if (!line) return; addLine(line); $("#productDialog").close(); toast(t("toast.added")); return; }
      if (e.target.closest("#pdBuy")) { var l2 = pdLine(); if (!l2) return; addLine(l2); $("#productDialog").close(); openCart(); return; }
      if (e.target.closest("[data-close-pd]")) { $("#productDialog").close(); return; }
    }

    if (e.target.closest("#cartOpen") || e.target.closest("#cartBar")) { openCart(); return; }
    if (e.target.closest("#wishOpen")) { openWishDlg(); return; }
    if ((el = e.target.closest("[data-lq]"))) {
      var ln = state.cart[+el.dataset.lq];
      ln.qty = Math.max(1, Math.min(20, ln.qty + (+el.dataset.d)));
      saveCart(); keepForm(); renderCart(); return;
    }
    if ((el = e.target.closest("[data-rm]"))) { state.cart.splice(+el.dataset.rm, 1); saveCart(); keepForm(); renderCart(); toast(t("toast.removed")); return; }
    if (e.target.closest("[data-close-cart]")) { $("#cartDialog").close(); return; }

    if (e.target.closest("#menuBtn")) { openNav(); return; }
    if (e.target.closest("#navClose") || e.target.closest("#navScrim")) { closeNav(); return; }
    if (e.target.closest("#shopDropBtn")) {
      var dd = $(".nav-drop"), open = !dd.classList.contains("open");
      dd.classList.toggle("open", open); $("#shopDropBtn").setAttribute("aria-expanded", String(open)); return;
    }
    if (e.target.closest("#mainNav a")) { closeNav(); }
    if (!e.target.closest(".nav-drop")) { $(".nav-drop").classList.remove("open"); $("#shopDropBtn").setAttribute("aria-expanded", "false"); }

    if (e.target.tagName === "DIALOG") e.target.close();
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape") { closeNav(); $(".nav-drop").classList.remove("open"); }
  });
  document.addEventListener("change", function (e) {
    if (e.target.name === "area") { state.area = e.target.value; store("bb_area", state.area); keepForm(); renderCart(); }
    if (e.target.id === "sort") { state.sort = e.target.value; renderGrid(); }
  });
  var searchTimer;
  document.addEventListener("input", function (e) {
    if (e.target.closest("#checkout")) keepForm();
    if (e.target.id === "pdNote" && currentPd) currentPd.note = e.target.value;
    if (e.target.id === "search") {
      clearTimeout(searchTimer);
      var v = e.target.value;
      searchTimer = setTimeout(function () { state.q = v.trim(); renderGrid(); }, 120);
    }
  });
  document.addEventListener("submit", function (e) {
    if (e.target.id !== "checkout") return;
    e.preventDefault();
    var f = e.target, data = readForm(f), err = $("#formErr");
    var bad = !data.name ? ["name", "err.name"] : !validPhone(data.phone) ? ["phone", "err.phone"] : !data.address ? ["address", "err.address"] : null;
    $all("input, textarea", f).forEach(function (i) { i.removeAttribute("aria-invalid"); });
    if (bad) { err.textContent = t(bad[1]); f[bad[0]].setAttribute("aria-invalid", "true"); f[bad[0]].focus(); return; }
    err.textContent = "";
    keepForm();
    openWa(orderMessage(data));
  });
  $("#productDialog").addEventListener("close", function () { currentPd = null; });
  window.addEventListener("resize", function () { $all(".rail").forEach(updateRailArrows); });

  /* ---------- boot ---------- */
  function applyShopInfo() {
    $all(".js-phone").forEach(function (a) { a.href = "tel:" + SHOP.phoneTel; a.textContent = SHOP.phoneDisplay; });
    var map = $("#mapFrame");
    var src = "https://maps.google.com/maps?q=" + encodeURIComponent(SHOP.mapQuery || L(SHOP.address)) + "&z=15&output=embed";
    if (map.getAttribute("src") !== src) map.setAttribute("src", src);
  }
  function boot(data, source) {
    useData(data);
    applyShopInfo();
    $("#previewFlag").hidden = source !== "preview";
    applyLang();
  }

  initHero();
  initSpy();
  applyLang();
  renderSkeleton();
  BB.loadForStore(function (fresh) { boot(fresh, "cloud"); })
    .then(function (res) { boot(res.data, res.source); })
    .catch(function () { boot(BB.normalize(null), "defaults"); });
})();
