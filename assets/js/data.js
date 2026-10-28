/* Blushing Beauty — data layer shared by the shop (app.js) and admin (admin.js)
   Cloud mode: Supabase table "site_content" (rows "products" and "settings")
   Local mode: defaults from config.js, admin drafts in this browser only      */
(function () {
  "use strict";

  var SUPA_CDN = "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2.45.4";
  var TABLE = "site_content";
  var BUCKET = "product-images";
  var CACHE_KEY = "bb_cloud_cache_v1";
  var DRAFT_KEY = "bb_admin_draft_v1";

  var CLOUD = window.CLOUD || {};
  var cloudOn = !!(CLOUD.supabaseUrl && CLOUD.supabaseAnonKey);
  var client = null, clientP = null;

  function clone(x) { return JSON.parse(JSON.stringify(x)); }
  function ls(key, val) {
    try {
      if (val === undefined) return JSON.parse(localStorage.getItem(key));
      if (val === null) { localStorage.removeItem(key); return null; }
      localStorage.setItem(key, JSON.stringify(val));
      return val;
    } catch (e) { return null; }
  }
  function bl(o, fallback) {
    if (typeof o === "string") return { bn: o, en: "" };
    o = o || {};
    return { bn: String(o.bn || fallback || ""), en: String(o.en || "") };
  }
  function num(v) {
    if (v === "" || v === null || v === undefined) return null;
    var n = Number(String(v).replace(/[০-৯]/g, function (d) { return "০১২৩৪৫৬৭৮৯".indexOf(d); }));
    return isFinite(n) && n >= 0 ? Math.round(n) : null;
  }
  function uid(prefix) { return (prefix || "p") + Date.now().toString(36) + Math.random().toString(36).slice(2, 6); }

  /* ---------- schema ---------- */
  function defaults() {
    var s = clone(window.SHOP || {});
    s.categories = clone((window.CATEGORIES || []).filter(function (c) { return c.id !== "all"; }));
    return { settings: s, products: clone(window.PRODUCTS || []) };
  }

  function normOption(o, j) {
    o = o || {};
    var price = num(o.price);
    var old = num(o.oldPrice);
    return { id: String(o.id || ("o" + j)), label: bl(o.label), price: price, oldPrice: old && price != null && old > price ? old : null };
  }

  function normProduct(p, i) {
    p = p || {};
    var opts = Array.isArray(p.options) && p.options.length ? p.options : [{ id: "1pc", label: { bn: "১ পিস", en: "Single piece" }, price: null }];
    var sizes = p.sizes === "bra" ? "bra"
      : (Array.isArray(p.sizes) ? p.sizes.map(function (z) { return String(z).trim(); }).filter(Boolean) : null);
    return {
      id: String(p.id || uid("p" + (i || 0))),
      cat: String(p.cat || "bra"),
      images: Array.isArray(p.images) ? p.images.filter(Boolean).map(String) : [],
      name: bl(p.name), desc: bl(p.desc), note: bl(p.note),
      options: opts.map(normOption),
      sizes: sizes && sizes.length ? sizes : (sizes === "bra" ? "bra" : null),
      featured: !!p.featured,
      active: p.active !== false,
      inStock: p.inStock !== false,
      badge: ["new", "hot", "offer"].indexOf(p.badge) >= 0 ? p.badge : ""
    };
  }

  var ICONS = ["bra", "panty", "set", "dress", "gift", "bow"];
  function normBanner(b, i) {
    b = b || {};
    return {
      id: String(b.id || ("b" + i + Date.now().toString(36))),
      image: String(b.image || ""), imageMobile: String(b.imageMobile || ""), collage: String(b.collage || ""),
      label: bl(b.label), title: bl(b.title), sub: bl(b.sub), cta: bl(b.cta),
      script: String(b.script || ""), aside: String(b.aside || ""),
      link: String(b.link || "#shop")
    };
  }
  function normReview(r, i) {
    r = r || {};
    var rating = Math.round(Number(r.rating) || 5);
    return {
      id: String(r.id || ("r" + i + Date.now().toString(36))),
      name: String(r.name || "").trim(), location: String(r.location || "").trim(),
      text: bl(r.text), rating: Math.max(1, Math.min(5, rating)), photo: String(r.photo || "")
    };
  }

  function normSettings(s, d) {
    s = Object.assign({}, d, s || {});
    var dd = d.delivery || [];
    var del = Array.isArray(s.delivery) && s.delivery.length ? s.delivery : dd;
    s.delivery = dd.map(function (base, i) {
      var cur = del.filter(function (x) { return x && x.id === base.id; })[0] || del[i] || base;
      var fee = num(cur.fee);
      return { id: base.id, label: bl(cur.label && cur.label.bn ? cur.label : base.label), fee: fee == null ? base.fee : fee };
    });
    var defCats = {};
    (d.categories || []).forEach(function (c) { defCats[c.id] = c; });
    s.categories = (Array.isArray(s.categories) && s.categories.length ? s.categories : d.categories)
      .filter(function (c) { return c && c.id && c.id !== "all"; })
      .map(function (c) {
        var base = defCats[c.id] || {};
        var icon = c.icon || base.icon || "bow";
        return {
          id: String(c.id), label: bl(c.label),
          image: String(c.image != null ? c.image : (base.image || "")),
          icon: ICONS.indexOf(icon) >= 0 ? icon : "bow"
        };
      });
    s.banners = (Array.isArray(s.banners) ? s.banners : (d.banners || [])).map(normBanner);
    s.reviews = (Array.isArray(s.reviews) ? s.reviews : (d.reviews || [])).map(normReview).filter(function (r) { return r.name && (r.text.bn || r.text.en); });
    s.instagramUrl = String(s.instagramUrl || "");
    s.tiktokUrl = String(s.tiktokUrl || "");
    s.youtubeUrl = String(s.youtubeUrl || "");
    s.defaultLang = s.defaultLang === "bn" ? "bn" : "en";
    s.braSizes = (Array.isArray(s.braSizes) && s.braSizes.length ? s.braSizes : d.braSizes || ["32", "34", "36", "38", "40"]).map(String);
    s.address = bl(s.address);
    s.whatsapp = String(s.whatsapp || "").replace(/[^\d]/g, "");
    s.phoneTel = s.phoneTel || ("+" + s.whatsapp);
    s.phoneDisplay = s.phoneDisplay || s.phoneTel;
    s.facebookUrl = String(s.facebookUrl || "");
    s.messengerUrl = String(s.messengerUrl || "");
    return s;
  }

  function normalize(data) {
    var d = defaults();
    data = data || {};
    var products = Array.isArray(data.products) ? data.products : d.products;
    return { settings: normSettings(data.settings, d.settings), products: products.map(normProduct) };
  }

  /* ---------- supabase ---------- */
  function loadScript(src) {
    return new Promise(function (resolve, reject) {
      var s = document.createElement("script");
      s.src = src; s.async = true;
      s.onload = resolve; s.onerror = function () { reject(new Error("Could not load " + src)); };
      document.head.appendChild(s);
    });
  }
  function getClient() {
    if (!cloudOn) return Promise.reject(new Error("cloud-off"));
    if (client) return Promise.resolve(client);
    if (!clientP) {
      clientP = (window.supabase ? Promise.resolve() : loadScript(SUPA_CDN)).then(function () {
        client = window.supabase.createClient(CLOUD.supabaseUrl, CLOUD.supabaseAnonKey);
        return client;
      });
      clientP.catch(function () { clientP = null; });
    }
    return clientP;
  }
  function withTimeout(p, ms) {
    return Promise.race([p, new Promise(function (_, rej) { setTimeout(function () { rej(new Error("timeout")); }, ms); })]);
  }
  function fetchCloud() {
    return getClient().then(function (c) {
      return c.from(TABLE).select("key,value").in("key", ["products", "settings"]);
    }).then(function (res) {
      if (res.error) throw res.error;
      var out = {};
      (res.data || []).forEach(function (r) { out[r.key] = r.value; });
      return out;
    });
  }

  /* ---------- shop ---------- */
  // Resolves fast with the best data available. If newer cloud data shows up
  // after a cached render, onFresh(data) is called.
  function loadForStore(onFresh) {
    if (/[?&]preview=1\b/.test(location.search)) {
      var draft = ls(DRAFT_KEY);
      if (draft) return Promise.resolve({ data: normalize(draft), source: "preview" });
    }
    if (!cloudOn) return Promise.resolve({ data: normalize(null), source: "defaults" });

    var cache = ls(CACHE_KEY);
    var fresh = withTimeout(fetchCloud(), 7000).then(function (raw) {
      var has = raw.products || raw.settings;
      if (has) ls(CACHE_KEY, raw);
      return normalize(has ? raw : null);
    });
    if (cache) {
      var cached = normalize(cache);
      fresh.then(function (d) {
        if (onFresh && JSON.stringify(d) !== JSON.stringify(cached)) onFresh(d);
      }).catch(function () {});
      return Promise.resolve({ data: cached, source: "cache" });
    }
    return fresh.then(function (d) { return { data: d, source: "cloud" }; })
      .catch(function () { return { data: normalize(null), source: "defaults" }; });
  }

  /* ---------- admin ---------- */
  function loadForAdmin() {
    if (!cloudOn) {
      var draft = ls(DRAFT_KEY);
      return Promise.resolve({ data: normalize(draft), source: draft ? "draft" : "defaults" });
    }
    return fetchCloud().then(function (raw) {
      var has = raw.products || raw.settings;
      return { data: normalize(has ? raw : null), source: has ? "cloud" : "defaults" };
    });
  }
  function saveDraft(data) { return ls(DRAFT_KEY, data); }
  function clearDraft() { return ls(DRAFT_KEY, null); }

  function publish(data) {
    var clean = normalize(data);
    return getClient().then(function (c) {
      var now = new Date().toISOString();
      return c.from(TABLE).upsert([
        { key: "products", value: clean.products, updated_at: now },
        { key: "settings", value: clean.settings, updated_at: now }
      ], { onConflict: "key" });
    }).then(function (res) {
      if (res && res.error) throw res.error;
      ls(CACHE_KEY, { products: clean.products, settings: clean.settings });
      return clean;
    });
  }

  function uploadImage(blob) {
    return getClient().then(function (c) {
      var path = "products/" + uid("img") + ".jpg";
      return c.storage.from(BUCKET).upload(path, blob, { contentType: "image/jpeg", cacheControl: "31536000", upsert: false })
        .then(function (res) {
          if (res.error) throw res.error;
          return c.storage.from(BUCKET).getPublicUrl(path).data.publicUrl;
        });
    });
  }

  function signIn(email, password) {
    return getClient().then(function (c) { return c.auth.signInWithPassword({ email: email, password: password }); })
      .then(function (res) { if (res.error) throw res.error; return res.data.session; });
  }
  function getSession() {
    return getClient().then(function (c) { return c.auth.getSession(); })
      .then(function (res) { return res && res.data ? res.data.session : null; });
  }
  function signOut() { return getClient().then(function (c) { return c.auth.signOut(); }); }

  /* ---------- config.js export (local mode) ---------- */
  function configFile(data) {
    var d = normalize(data);
    var s = clone(d.settings);
    var cats = s.categories; delete s.categories;
    return [
      "/* Blushing Beauty — shop settings and products",
      "   Exported from admin.html on " + new Date().toISOString().slice(0, 16).replace("T", " "),
      "   Replace assets/js/config.js with this file and upload the site again. */",
      "",
      "window.SHOP = " + JSON.stringify(s, null, 2) + ";",
      "",
      "window.CATEGORIES = " + JSON.stringify(cats, null, 2) + ";",
      "",
      "window.PRODUCTS = " + JSON.stringify(d.products, null, 2) + ";",
      ""
    ].join("\n");
  }

  window.BB = {
    cloudOn: cloudOn,
    clone: clone, ls: ls, num: num, uid: uid, bl: bl,
    defaults: defaults, normalize: normalize, normProduct: normProduct, normBanner: normBanner, normReview: normReview, ICONS: ICONS,
    loadForStore: loadForStore, loadForAdmin: loadForAdmin,
    saveDraft: saveDraft, clearDraft: clearDraft, publish: publish, uploadImage: uploadImage,
    signIn: signIn, getSession: getSession, signOut: signOut,
    configFile: configFile
  };
})();
