/* Blushing Beauty — admin panel */
(function () {
  "use strict";

  var W = null;          // working copy { settings, products }
  var savedSnap = "";    // JSON of the last published (cloud) or deployed (local) state
  var view = { tab: "products", q: "", filter: "all" };
  var ed = null;         // product being edited (copy)
  var edIsNew = false;
  var busy = false;

  /* ---------- helpers ---------- */
  var BN = "০১২৩৪৫৬৭৮৯";
  function bn(n) { return String(n).replace(/[0-9]/g, function (d) { return BN[d]; }); }
  function $(s, r) { return (r || document).querySelector(s); }
  function $all(s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function minPrice(p) {
    var ps = p.options.map(function (o) { return o.price; }).filter(function (x) { return x != null; });
    return ps.length ? Math.min.apply(null, ps) : null;
  }
  function catName(id) { var c = W.settings.categories.filter(function (x) { return x.id === id; })[0]; return c ? c.label.bn : "ক্যাটাগরি নেই"; }
  function findIdx(id) { for (var i = 0; i < W.products.length; i++) if (W.products[i].id === id) return i; return -1; }

  var toastTimer;
  function toast(msg, long) {
    var el = $("#toast"); el.textContent = msg; el.classList.add("show");
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.classList.remove("show"); }, long ? 4200 : 2400);
  }

  function confirmBox(text, yesLabel) {
    return new Promise(function (resolve) {
      var d = $("#confirmDlg");
      $("#confirmText").textContent = text;
      $("#confirmYes").textContent = yesLabel || "হ্যাঁ";
      function done(v) { $("#confirmYes").onclick = null; $("#confirmNo").onclick = null; d.close(); resolve(v); }
      $("#confirmYes").onclick = function () { done(true); };
      $("#confirmNo").onclick = function () { done(false); };
      d.showModal();
    });
  }

  function download(name, text, type) {
    var blob = new Blob([text], { type: type || "text/plain" });
    var a = document.createElement("a");
    a.href = URL.createObjectURL(blob); a.download = name;
    document.body.appendChild(a); a.click();
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove(); }, 500);
  }

  /* ---------- views ---------- */
  function show(id) {
    ["loginView", "loadView", "appView"].forEach(function (v) { $("#" + v).hidden = v !== id; });
  }
  function setMode() {
    var pill = $("#modePill");
    var isGh = BB.backend === "github";
    pill.className = "mode-pill " + (BB.cloudOn ? "is-cloud" : "is-local");
    pill.textContent = isGh ? "লাইভ: GitHub" : BB.cloudOn ? "ক্লাউড: লাইভ সেভ" : "লোকাল মোড";
    $("#localNote").hidden = BB.cloudOn;
    $("#publishBtn").textContent = BB.cloudOn ? "পাবলিশ করুন" : "config.js ডাউনলোড";
    $("#cloudStatus").innerHTML = isGh
      ? "<b>GitHub এ কানেক্টেড।</b> পাবলিশ করলে ১-২ মিনিটের মধ্যে সাইটে দেখাবে। Supabase সেটআপের দরকার নেই।"
      : BB.cloudOn
      ? "<b>কানেক্টেড।</b> পাবলিশ করলে সাথে সাথে সাইটে দেখাবে।"
      : "<b>এখনো কানেক্ট করা হয়নি।</b> নিচের ধাপগুলো একবার করলেই হবে (ফ্রি)।";
    $("#emailLogin").hidden = isGh;
    $("#tokenLogin").hidden = !isGh;
  }

  /* ---------- dirty tracking ---------- */
  function changeCount() {
    if (!savedSnap) return 0;
    var s = JSON.parse(savedSnap), n = 0, map = {}, ids = {};
    s.products.forEach(function (p) { map[p.id] = JSON.stringify(p); });
    W.products.forEach(function (p) { ids[p.id] = 1; if (map[p.id] !== JSON.stringify(p)) n++; });
    s.products.forEach(function (p) { if (!ids[p.id]) n++; });
    if (!n && s.products.map(function (p) { return p.id; }).join() !== W.products.map(function (p) { return p.id; }).join()) n++;
    if (JSON.stringify(s.settings) !== JSON.stringify(W.settings)) n++;
    return n;
  }
  function touch() {
    BB.saveDraft(W);
    renderSaveBar();
  }
  function markSaved() { savedSnap = JSON.stringify(W); renderSaveBar(); }
  function renderSaveBar() {
    var n = changeCount();
    $("#saveBar").hidden = n === 0;
    document.body.classList.toggle("has-savebar", n > 0);
    $("#saveText").textContent = BB.cloudOn
      ? bn(n) + "টি পরিবর্তন এখনো পাবলিশ হয়নি"
      : bn(n) + "টি পরিবর্তন এই ব্রাউজারে সেভ আছে। লাইভ করতে config.js আপলোড করুন।";
  }

  /* ---------- products list ---------- */
  var FILTERS = [
    { id: "all", label: "সব", test: function () { return true; } },
    { id: "noprice", label: "দাম নেই", test: function (p) { return minPrice(p) == null; } },
    { id: "sold", label: "স্টক শেষ", test: function (p) { return !p.inStock; } },
    { id: "hidden", label: "লুকানো", test: function (p) { return !p.active; } },
    { id: "featured", label: "কম্বো অফারে", test: function (p) { return p.featured; } }
  ];
  function renderFilters() {
    $("#aFilters").innerHTML = FILTERS.map(function (f) {
      var n = W.products.filter(f.test).length;
      if (f.id !== "all" && !n && view.filter !== f.id) return "";
      return '<button type="button" role="tab" class="chip" data-filter="' + f.id + '" aria-selected="' + (view.filter === f.id) + '">' +
        f.label + ' <span class="chip-n">' + bn(n) + '</span></button>';
    }).join("");
    $("#countAll").textContent = bn(W.products.length);
  }

  function rowHtml(p) {
    var i = findIdx(p.id);
    var pills = [];
    if (minPrice(p) == null) pills.push('<span class="pill pill-warn">দাম নেই</span>');
    if (!p.inStock) pills.push('<span class="pill pill-sold">স্টক শেষ</span>');
    if (!p.active) pills.push('<span class="pill pill-off">লুকানো</span>');
    if (p.featured) pills.push('<span class="pill pill-gold">কম্বো অফারে</span>');
    if (p.badge) pills.push('<span class="pill">' + { "new": "নতুন", hot: "হট", offer: "অফার" }[p.badge] + '</span>');

    var price = p.options.length === 1
      ? '<label class="qp"><span class="qp-cur">৳</span><span class="sr">দাম</span>' +
        '<input type="text" inputmode="numeric" data-qp="' + esc(p.id) + '" value="' + (p.options[0].price == null ? "" : p.options[0].price) + '" placeholder="দাম জানুন"></label>'
      : '<button type="button" class="qp-multi" data-edit="' + esc(p.id) + '">' + bn(p.options.length) + 'টি প্যাক' +
        (minPrice(p) != null ? '<small>৳' + bn(minPrice(p)) + ' থেকে</small>' : '<small>দাম নেই</small>') + '</button>';

    return '<li class="a-row' + (p.active ? "" : " is-off") + (p.inStock ? "" : " is-sold") + '" data-row="' + esc(p.id) + '">' +
      '<button type="button" class="a-thumb" data-edit="' + esc(p.id) + '" aria-label="এডিট: ' + esc(p.name.bn) + '">' +
        (p.images[0] ? '<img src="' + esc(BB.displaySrc(p.images[0])) + '" alt="" loading="lazy">' : '<span>ছবি নেই</span>') + '</button>' +
      '<div class="a-info"><p class="a-name">' + esc(p.name.bn || "(নাম নেই)") + '</p>' +
        '<p class="a-meta"><span>' + esc(catName(p.cat)) + '</span>' + pills.join("") + '</p></div>' +
      '<div class="a-price">' + price + '</div>' +
      '<div class="a-actions">' +
        '<button type="button" class="a-ic" data-move="-1" data-id="' + esc(p.id) + '" aria-label="উপরে নিন"' + (i === 0 ? " disabled" : "") + '><svg viewBox="0 0 24 24"><path d="m6 15 6-6 6 6"/></svg></button>' +
        '<button type="button" class="a-ic" data-move="1" data-id="' + esc(p.id) + '" aria-label="নিচে নিন"' + (i === W.products.length - 1 ? " disabled" : "") + '><svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></button>' +
        '<button type="button" class="a-ic' + (p.inStock ? "" : " is-on") + '" data-stock="' + esc(p.id) + '" title="' + (p.inStock ? "স্টক শেষ করুন" : "স্টকে আনুন") + '" aria-label="' + (p.inStock ? "স্টক শেষ করুন" : "স্টকে আনুন") + '"><svg viewBox="0 0 24 24"><path d="M4 8l8-4 8 4v8l-8 4-8-4z"/><path d="M4 8l8 4 8-4M12 12v8"/>' + (p.inStock ? "" : '<path d="M3 3l18 18"/>') + '</svg></button>' +
        '<button type="button" class="a-ic' + (p.active ? "" : " is-on") + '" data-active="' + esc(p.id) + '" title="' + (p.active ? "সাইট থেকে লুকান" : "সাইটে দেখান") + '" aria-label="' + (p.active ? "সাইট থেকে লুকান" : "সাইটে দেখান") + '"><svg viewBox="0 0 24 24">' +
          (p.active ? '<path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z"/><circle cx="12" cy="12" r="2.6"/>' : '<path d="M3 3l18 18M10.6 6.1A10 10 0 0 1 12 6c6.5 0 10 6 10 6a17 17 0 0 1-3 3.5M6.3 7.4A16 16 0 0 0 2 12s3.5 6 10 6a9.6 9.6 0 0 0 4-.8"/>') +
        '</svg></button>' +
        '<button type="button" class="btn btn-line btn-sm" data-edit="' + esc(p.id) + '">এডিট</button>' +
      '</div></li>';
  }

  function renderList() {
    renderFilters();
    var f = FILTERS.filter(function (x) { return x.id === view.filter; })[0] || FILTERS[0];
    var q = view.q.toLowerCase();
    var list = W.products.filter(function (p) {
      if (!f.test(p)) return false;
      if (!q) return true;
      return (p.name.bn + " " + p.name.en + " " + catName(p.cat)).toLowerCase().indexOf(q) >= 0;
    });
    $("#aList").innerHTML = list.length ? list.map(rowHtml).join("")
      : '<li class="a-empty">এখানে কোনো পণ্য নেই।' + (view.filter !== "all" || q ? ' <button type="button" class="btn btn-ghost btn-sm" data-filter="all" id="clearFilter">সব দেখুন</button>' : "") + '</li>';
  }

  function rerenderRow(id) {
    var li = $('[data-row="' + CSS.escape(id) + '"]');
    var p = W.products[findIdx(id)];
    if (!li || !p) return renderList();
    var tmp = document.createElement("ul"); tmp.innerHTML = rowHtml(p);
    li.replaceWith(tmp.firstChild);
    renderFilters();
  }

  /* ---------- editor ---------- */
  function blankProduct() {
    return BB.normProduct({
      id: BB.uid("p"), cat: (W.settings.categories[0] || {}).id || "bra",
      name: { bn: "", en: "" },
      options: [{ id: "1pc", label: { bn: "১ পিস", en: "Single piece" }, price: null }],
      sizes: "bra", images: []
    });
  }

  function sizeMode(p) { return p.sizes === "bra" ? "bra" : Array.isArray(p.sizes) ? "custom" : "none"; }

  function renderEditor() {
    var p = ed;
    var cats = W.settings.categories.map(function (c) {
      return '<option value="' + esc(c.id) + '"' + (c.id === p.cat ? " selected" : "") + '>' + esc(c.label.bn) + '</option>';
    }).join("");
    if (!W.settings.categories.some(function (c) { return c.id === p.cat; })) cats = '<option value="' + esc(p.cat) + '" selected>(ক্যাটাগরি নেই)</option>' + cats;

    var imgs = p.images.map(function (src, i) {
      return '<div class="ed-img' + (i === 0 ? " is-main" : "") + '">' +
        '<img src="' + esc(BB.displaySrc(src)) + '" alt="">' +
        (i === 0 ? '<span class="ed-img-main">মূল ছবি</span>' : '<button type="button" class="ed-img-btn" data-img-main="' + i + '">মূল করুন</button>') +
        '<button type="button" class="ed-img-x" data-img-del="' + i + '" aria-label="ছবি মুছুন"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
        '</div>';
    }).join("");

    var opts = p.options.map(function (o, i) {
      return '<div class="ed-opt" data-oi="' + i + '">' +
        '<label class="a-field"><span>প্যাকের নাম</span><input data-o="label.bn" value="' + esc(o.label.bn) + '" placeholder="যেমন: ১ পিস, ৩ পিস কম্বো"></label>' +
        '<label class="a-field"><span>English</span><input data-o="label.en" value="' + esc(o.label.en) + '" placeholder="e.g. Single piece"></label>' +
        '<label class="a-field ed-money"><span>দাম (৳)</span><input data-o="price" inputmode="numeric" value="' + (o.price == null ? "" : o.price) + '" placeholder="খালি = দাম জানুন"></label>' +
        '<label class="a-field ed-money"><span>আগের দাম</span><input data-o="oldPrice" inputmode="numeric" value="' + (o.oldPrice == null ? "" : o.oldPrice) + '" placeholder="ঐচ্ছিক"></label>' +
        (p.options.length > 1 ? '<button type="button" class="a-ic ed-opt-x" data-opt-del="' + i + '" aria-label="প্যাক মুছুন"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' : "") +
        '</div>';
    }).join("");

    var sm = sizeMode(p);
    $("#edTitle").textContent = edIsNew ? "নতুন পণ্য" : "পণ্য এডিট";
    $("#edDelete").hidden = edIsNew;
    $("#edBody").innerHTML =
      '<section class="ed-sec"><h3>ছবি</h3>' +
        '<div class="ed-imgs" id="edImgs">' + imgs +
          '<label class="ed-add"><input type="file" id="edFile" accept="image/*" multiple hidden>' +
            '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg><span>ছবি যোগ করুন</span></label>' +
        '</div>' +
        '<p class="a-muted ed-tip">বর্গাকার ছবি সবচেয়ে ভালো দেখায়। বড় ছবি আপনা থেকেই ছোট হয়ে যাবে।</p>' +
      '</section>' +

      '<section class="ed-sec"><h3>নাম ও বিবরণ</h3>' +
        '<div class="ed-2">' +
          '<label class="a-field"><span>নাম (বাংলা) *</span><input name="name_bn" value="' + esc(p.name.bn) + '" required placeholder="যেমন: পিংক লেস ব্রা"></label>' +
          '<label class="a-field"><span>Name (English)</span><input name="name_en" value="' + esc(p.name.en) + '" placeholder="e.g. Pink lace bra"></label>' +
        '</div>' +
        '<label class="a-field"><span>ক্যাটাগরি</span><select name="cat">' + cats + '</select></label>' +
        '<div class="ed-2">' +
          '<label class="a-field"><span>ছোট লাইন (কার্ডে দেখাবে)</span><input name="note_bn" value="' + esc(p.note.bn) + '" placeholder="যেমন: প্রতি পিস ১৬৫ টাকা"></label>' +
          '<label class="a-field"><span>Short line (English)</span><input name="note_en" value="' + esc(p.note.en) + '"></label>' +
        '</div>' +
        '<div class="ed-2">' +
          '<label class="a-field"><span>বিবরণ (বাংলা)</span><textarea name="desc_bn" rows="3">' + esc(p.desc.bn) + '</textarea></label>' +
          '<label class="a-field"><span>Description (English)</span><textarea name="desc_en" rows="3">' + esc(p.desc.en) + '</textarea></label>' +
        '</div>' +
      '</section>' +

      '<section class="ed-sec"><h3>দাম ও প্যাক</h3>' +
        '<p class="a-muted">দামের ঘর খালি রাখলে সাইটে "দাম জানুন" দেখাবে আর কাস্টমার WhatsApp এ দাম জিজ্ঞেস করবে।</p>' +
        '<div id="edOpts">' + opts + '</div>' +
        '<button type="button" class="btn btn-ghost btn-sm" id="edAddOpt">আরেকটা প্যাক যোগ করুন</button>' +
      '</section>' +

      '<section class="ed-sec"><h3>সাইজ</h3>' +
        '<div class="ed-radios">' +
          '<label><input type="radio" name="sizemode" value="bra"' + (sm === "bra" ? " checked" : "") + '> ব্রা সাইজ (' + bn(W.settings.braSizes.join(", ")) + ')</label>' +
          '<label><input type="radio" name="sizemode" value="custom"' + (sm === "custom" ? " checked" : "") + '> নিজের সাইজ লিস্ট</label>' +
          '<label><input type="radio" name="sizemode" value="none"' + (sm === "none" ? " checked" : "") + '> সাইজ লাগবে না</label>' +
        '</div>' +
        '<label class="a-field" id="customSizes"' + (sm === "custom" ? "" : " hidden") + '><span>সাইজগুলো কমা দিয়ে লিখুন</span>' +
          '<input name="sizes_custom" value="' + esc(sm === "custom" ? p.sizes.join(", ") : "") + '" placeholder="M, L, XL, XXL"></label>' +
      '</section>' +

      '<section class="ed-sec"><h3>রং / ডিজাইন</h3>' +
        '<p class="a-muted">কাস্টমার অর্ডারের সময় এখান থেকে রং বেছে নেবে। কমা দিয়ে লিখুন। রং না থাকলে খালি রাখুন।</p>' +
        '<div class="ed-2">' +
          '<label class="a-field"><span>রং (বাংলা)</span><input name="colors_bn" value="' + esc((p.colors || []).map(function (c) { return c.bn; }).join(", ")) + '" placeholder="যেমন: কালো, সাদা, মেরুন"></label>' +
          '<label class="a-field"><span>Colours (English)</span><input name="colors_en" value="' + esc((p.colors || []).map(function (c) { return c.en; }).join(", ")) + '" placeholder="e.g. Black, White, Maroon"></label>' +
        '</div>' +
      '</section>' +

      '<section class="ed-sec"><h3>দেখানো</h3>' +
        '<label class="a-field"><span>ব্যাজ</span><select name="badge">' +
          '<option value=""' + (!p.badge ? " selected" : "") + '>কোনো ব্যাজ নেই</option>' +
          '<option value="new"' + (p.badge === "new" ? " selected" : "") + '>নতুন</option>' +
          '<option value="hot"' + (p.badge === "hot" ? " selected" : "") + '>হট</option>' +
          '<option value="offer"' + (p.badge === "offer" ? " selected" : "") + '>অফার</option>' +
        '</select></label>' +
        '<div class="ed-switches">' +
          switchHtml("inStock", "স্টকে আছে", p.inStock) +
          switchHtml("active", "সাইটে দেখান", p.active) +
          switchHtml("featured", "কম্বো অফার সেকশনে দেখান", p.featured) +
        '</div>' +
      '</section>' +
      '<p class="form-err" id="edErr" role="alert"></p>';
  }

  function switchHtml(name, label, on) {
    return '<label class="switch"><input type="checkbox" name="' + name + '"' + (on ? " checked" : "") + '><span class="switch-ui" aria-hidden="true"></span><span>' + label + '</span></label>';
  }

  // copy form fields into `ed` (so re-renders keep typed values)
  function readEditor() {
    var f = $("#edForm");
    if (!f.name_bn) return;
    ed.name = { bn: f.name_bn.value.trim(), en: f.name_en.value.trim() };
    ed.note = { bn: f.note_bn.value.trim(), en: f.note_en.value.trim() };
    ed.desc = { bn: f.desc_bn.value.trim(), en: f.desc_en.value.trim() };
    ed.cat = f.cat.value;
    ed.badge = f.badge.value;
    ed.inStock = f.inStock.checked; ed.active = f.active.checked; ed.featured = f.featured.checked;
    var mode = (f.querySelector('input[name="sizemode"]:checked') || {}).value || "none";
    ed.sizes = mode === "bra" ? "bra" : mode === "custom"
      ? f.sizes_custom.value.split(/[,，]/).map(function (s) { return s.trim(); }).filter(Boolean)
      : null;
    var cbn = f.colors_bn.value.split(/[,，]/).map(function (s) { return s.trim(); }).filter(Boolean);
    var cen = f.colors_en.value.split(/[,，]/).map(function (s) { return s.trim(); });
    ed.colors = cbn.map(function (c, i) { return { bn: c, en: cen[i] || c }; });
    $all(".ed-opt", f).forEach(function (row) {
      var o = ed.options[+row.dataset.oi];
      o.label = { bn: row.querySelector('[data-o="label.bn"]').value.trim(), en: row.querySelector('[data-o="label.en"]').value.trim() };
      o.price = BB.num(row.querySelector('[data-o="price"]').value);
      o.oldPrice = BB.num(row.querySelector('[data-o="oldPrice"]').value);
    });
  }

  function openEditor(id) {
    edIsNew = !id;
    ed = id ? BB.clone(W.products[findIdx(id)]) : blankProduct();
    renderEditor();
    var d = $("#editor");
    if (!d.open) d.showModal();
    $(".ed-body").scrollTop = 0;
    if (edIsNew) setTimeout(function () { var n = $("#edForm").name_bn; if (n) n.focus(); }, 50);
  }

  function closeEditor() { $("#editor").close(); ed = null; }

  function saveEditor() {
    readEditor();
    var err = $("#edErr");
    if (!ed.name.bn) { err.textContent = "পণ্যের বাংলা নাম লিখুন।"; $("#edForm").name_bn.focus(); return; }
    if (Array.isArray(ed.sizes) && !ed.sizes.length) ed.sizes = null;
    ed.options.forEach(function (o, i) {
      if (!o.label.bn) o.label.bn = ed.options.length === 1 ? "১ পিস" : "প্যাক " + bn(i + 1);
      if (!o.id) o.id = "o" + i;
    });
    var clean = BB.normProduct(ed);
    if (edIsNew) W.products.unshift(clean);
    else W.products[findIdx(clean.id)] = clean;
    closeEditor();
    touch();
    renderList();
    toast(edIsNew ? "নতুন পণ্য যোগ হয়েছে। পাবলিশ করতে ভুলবেন না।" : "পরিবর্তন রাখা হয়েছে। পাবলিশ করতে ভুলবেন না।");
  }

  /* ---------- images ---------- */
  function processImage(file, size, quality, fit) {
    return new Promise(function (resolve, reject) {
      var url = URL.createObjectURL(file);
      var img = new Image();
      img.onload = function () {
        var s = Math.min(img.naturalWidth, img.naturalHeight);
        var c = document.createElement("canvas");
        var ctx = c.getContext("2d");
        if (fit) {
          var k = Math.min(1, size / img.naturalWidth);
          c.width = Math.round(img.naturalWidth * k); c.height = Math.round(img.naturalHeight * k);
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, 0, 0, c.width, c.height);
        } else {
          c.width = c.height = Math.min(size, s);
          ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height);
          ctx.imageSmoothingQuality = "high";
          ctx.drawImage(img, (img.naturalWidth - s) / 2, (img.naturalHeight - s) / 2, s, s, 0, 0, c.width, c.height);
        }
        URL.revokeObjectURL(url);
        if (BB.backend === "supabase") c.toBlob(function (b) { b ? resolve(b) : reject(new Error("ছবি প্রসেস করা যায়নি")); }, "image/jpeg", quality);
        else resolve(c.toDataURL("image/jpeg", quality));
      };
      img.onerror = function () { URL.revokeObjectURL(url); reject(new Error("এই ফাইলটা ছবি হিসেবে খোলা যায়নি")); };
      img.src = url;
    });
  }

  // one image -> url (cloud) or data url (local)
  function imageSrc(file, size, quality, fit) {
    if (!file || !/^image\//.test(file.type)) return Promise.reject(new Error("এটা ছবির ফাইল না"));
    return processImage(file, size, quality, fit).then(function (out) { return BB.backend === "supabase" ? BB.uploadImage(out) : out; });
  }

  function addImages(files) {
    files = Array.prototype.slice.call(files || []).filter(function (f) { return /^image\//.test(f.type); });
    if (!files.length) return;
    readEditor();
    var holder = $("#edImgs");
    var add = holder.querySelector(".ed-add");
    var pending = files.map(function () {
      var el = document.createElement("div"); el.className = "ed-img is-loading"; el.innerHTML = '<span class="a-spinner"></span>';
      holder.insertBefore(el, add); return el;
    });
    var chain = Promise.resolve();
    files.forEach(function (file, i) {
      chain = chain.then(function () {
        return processImage(file, BB.cloudOn ? 900 : 720, BB.cloudOn ? 0.86 : 0.8)
          .then(function (out) { return BB.backend === "supabase" ? BB.uploadImage(out) : out; })
          .then(function (src) { if (ed) ed.images.push(src); })
          .catch(function (e) { toast("ছবি যোগ হয়নি: " + (e && e.message ? e.message : "অজানা সমস্যা"), true); })
          .then(function () { pending[i].remove(); });
      });
    });
    chain.then(function () { if (ed) renderEditor(); });
  }

  /* ---------- settings ---------- */
  function renderSettings() {
    var s = W.settings;
    var cats = s.categories.map(function (c, i) {
      var used = W.products.filter(function (p) { return p.cat === c.id; }).length;
      return '<div class="cat-row" data-ci="' + i + '">' +
        '<label class="cat-img" title="ক্যাটাগরির ছবি বদলান">' + (c.image ? '<img src="' + esc(BB.displaySrc(c.image)) + '" alt="">' : '<span>ছবি</span>') +
          '<input type="file" accept="image/*" data-cat-img="' + i + '" hidden></label>' +
        '<select data-cat-icon="' + i + '" aria-label="আইকন">' + BB.ICONS.map(function (ic) {
          return '<option value="' + ic + '"' + (ic === c.icon ? " selected" : "") + '>' + ICON_NAMES[ic] + '</option>';
        }).join("") + '</select>' +
        '<input data-c="bn" value="' + esc(c.label.bn) + '" aria-label="ক্যাটাগরির নাম (বাংলা)" placeholder="বাংলা নাম">' +
        '<input data-c="en" value="' + esc(c.label.en) + '" aria-label="Category name (English)" placeholder="English">' +
        '<span class="cat-n">' + bn(used) + 'টি পণ্য</span>' +
        '<button type="button" class="a-ic" data-cat-del="' + i + '" aria-label="ক্যাটাগরি মুছুন"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
        '</div>';
    }).join("");
    $("#settingsForm").innerHTML =
      '<h2>দোকানের তথ্য</h2>' +
      '<div class="ed-2">' +
        '<label class="a-field"><span>WhatsApp নম্বর (অর্ডার এখানে আসবে)</span><input name="whatsapp" inputmode="numeric" value="' + esc(s.whatsapp) + '" placeholder="8801XXXXXXXXX"><small>দেশের কোড সহ, + বা স্পেস ছাড়া। যেমন 8801684287215</small></label>' +
        '<label class="a-field"><span>ফোন (সাইটে যেভাবে দেখাবে)</span><input name="phoneDisplay" value="' + esc(s.phoneDisplay) + '"></label>' +
      '</div>' +
      '<label class="a-field"><span>সাইটের ডিফল্ট ভাষা</span><select name="defaultLang">' +
        '<option value="en"' + (s.defaultLang === "en" ? " selected" : "") + '>English</option>' +
        '<option value="bn"' + (s.defaultLang === "bn" ? " selected" : "") + '>বাংলা</option></select>' +
        '<small>নতুন কাস্টমার প্রথমবার যে ভাষায় সাইট দেখবে। কাস্টমার চাইলে উপর থেকে বদলাতে পারবে।</small></label>' +
      '<h2>সোশ্যাল লিংক</h2>' +
      '<p class="a-muted">যেগুলো খালি থাকবে, ফুটারে সেগুলোর আইকন দেখাবে না।</p>' +
      '<div class="ed-2">' +
        '<label class="a-field"><span>Facebook পেজ</span><input name="facebookUrl" type="url" value="' + esc(s.facebookUrl) + '" placeholder="https://www.facebook.com/..."></label>' +
        '<label class="a-field"><span>Instagram</span><input name="instagramUrl" type="url" value="' + esc(s.instagramUrl) + '" placeholder="https://www.instagram.com/..."></label>' +
        '<label class="a-field"><span>TikTok</span><input name="tiktokUrl" type="url" value="' + esc(s.tiktokUrl) + '" placeholder="https://www.tiktok.com/@..."></label>' +
        '<label class="a-field"><span>YouTube</span><input name="youtubeUrl" type="url" value="' + esc(s.youtubeUrl) + '" placeholder="https://www.youtube.com/@..."></label>' +
      '</div>' +
      '<div class="ed-2">' +
        '<label class="a-field"><span>ঠিকানা (বাংলা)</span><input name="address_bn" value="' + esc(s.address.bn) + '"></label>' +
        '<label class="a-field"><span>Address (English)</span><input name="address_en" value="' + esc(s.address.en) + '"></label>' +
      '</div>' +

      '<h2>ডেলিভারি চার্জ</h2>' +
      '<div class="ed-2">' + s.delivery.map(function (d, i) {
        return '<label class="a-field ed-money"><span>' + esc(d.label.bn) + ' (৳)</span><input data-fee="' + i + '" inputmode="numeric" value="' + d.fee + '"></label>';
      }).join("") + '</div>' +

      '<h2>ব্রা সাইজ</h2>' +
      '<label class="a-field"><span>সাইজগুলো কমা দিয়ে লিখুন</span><input name="braSizes" value="' + esc(s.braSizes.join(", ")) + '"></label>' +

      '<h2>ক্যাটাগরি</h2>' +
      '<p class="a-muted">ছবিতে চাপ দিয়ে হোমপেজের ক্যাটাগরি টাইলের ছবি বদলান। চওড়া ছবি (৪:৩) সবচেয়ে ভালো দেখায়।</p>' +
      '<div class="cats" id="cats">' + cats + '</div>' +
      '<button type="button" class="btn btn-ghost btn-sm" id="addCat">নতুন ক্যাটাগরি</button>';
  }

  function readSettings(e) {
    var f = $("#settingsForm"), s = W.settings, t = e && e.target;
    if (!t) return;
    if (t.name === "whatsapp") s.whatsapp = t.value.replace(/[^\d]/g, "");
    if (t.name === "phoneDisplay") { s.phoneDisplay = t.value.trim(); }
    if (t.name === "facebookUrl") s.facebookUrl = t.value.trim();
    if (t.name === "instagramUrl") s.instagramUrl = t.value.trim();
    if (t.name === "tiktokUrl") s.tiktokUrl = t.value.trim();
    if (t.name === "youtubeUrl") s.youtubeUrl = t.value.trim();
    if (t.name === "defaultLang") s.defaultLang = t.value === "bn" ? "bn" : "en";
    if (t.dataset.catIcon != null) s.categories[+t.dataset.catIcon].icon = t.value;
    if (t.name === "address_bn") s.address.bn = t.value.trim();
    if (t.name === "address_en") s.address.en = t.value.trim();
    if (t.dataset.fee != null) { var v = BB.num(t.value); if (v != null) s.delivery[+t.dataset.fee].fee = v; }
    if (t.name === "braSizes") s.braSizes = t.value.split(/[,，]/).map(function (x) { return x.trim(); }).filter(Boolean);
    if (t.dataset.c) {
      var row = t.closest(".cat-row"); var c = s.categories[+row.dataset.ci];
      c.label[t.dataset.c] = t.value.trim();
    }
    if (s.whatsapp) s.phoneTel = "+" + s.whatsapp;
    if (!s.braSizes.length) s.braSizes = ["32", "34", "36", "38", "40"];
    touch();
  }

  /* ---------- homepage: hero slides + reviews ---------- */
  var ICON_NAMES = { bra: "ব্রা", panty: "প্যান্টি", set: "সেট", dress: "ড্রেস", gift: "গিফট বক্স", bow: "ফিতা (বো)" };
  function linkOptions(cur) {
    var opts = [["#shop", "পুরো কালেকশন"], ["#offers", "কম্বো অফার সেকশন"], ["#categories", "ক্যাটাগরি সেকশন"]]
      .concat(W.settings.categories.map(function (c) { return ["cat:" + c.id, "ক্যাটাগরি: " + (c.label.bn || c.label.en)]; }));
    return opts.map(function (o) { return '<option value="' + esc(o[0]) + '"' + (o[0] === cur ? " selected" : "") + '>' + esc(o[1]) + '</option>'; }).join("");
  }
  function catOptions(cur, emptyLabel) {
    return '<option value="">' + emptyLabel + '</option>' + W.settings.categories.map(function (c) {
      return '<option value="' + esc(c.id) + '"' + (c.id === cur ? " selected" : "") + '>' + esc(c.label.bn || c.label.en) + '</option>';
    }).join("");
  }
  function bf(i, key, label, val, ph) {
    return '<label class="a-field"><span>' + label + '</span><input data-b="' + i + '" data-bf="' + key + '" value="' + esc(val) + '"' + (ph ? ' placeholder="' + esc(ph) + '"' : "") + '></label>';
  }
  function rf(i, key, label, val, ph, area) {
    return '<label class="a-field"><span>' + label + '</span>' + (area
      ? '<textarea data-r="' + i + '" data-rf="' + key + '" rows="3"' + (ph ? ' placeholder="' + esc(ph) + '"' : "") + '>' + esc(val) + '</textarea>'
      : '<input data-r="' + i + '" data-rf="' + key + '" value="' + esc(val) + '"' + (ph ? ' placeholder="' + esc(ph) + '"' : "") + '>') + '</label>';
  }
  function renderHome() {
    var s = W.settings;
    var slides = s.banners.map(function (b, i) {
      return '<div class="hb-card">' +
        '<div class="hb-top"><b>স্লাইড ' + bn(i + 1) + '</b><span class="hb-acts">' +
          '<button type="button" class="a-ic" data-bmove="-1" data-bi="' + i + '" aria-label="আগে নিন"' + (i === 0 ? " disabled" : "") + '><svg viewBox="0 0 24 24"><path d="m6 15 6-6 6 6"/></svg></button>' +
          '<button type="button" class="a-ic" data-bmove="1" data-bi="' + i + '" aria-label="পরে নিন"' + (i === s.banners.length - 1 ? " disabled" : "") + '><svg viewBox="0 0 24 24"><path d="m6 9 6 6 6-6"/></svg></button>' +
          '<button type="button" class="a-ic" data-bdel="' + i + '" aria-label="স্লাইড মুছুন"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
        '</span></div>' +
        '<div class="hb-img">' + (b.image ? '<img src="' + esc(BB.displaySrc(b.image)) + '" alt="">' : '<span>ছবি নেই। নিচে বাছাই করা ক্যাটাগরির পণ্যের ছবি দেখাবে।</span>') + '</div>' +
        '<div class="a-btnrow">' +
          '<label class="btn btn-ghost btn-sm a-filebtn">' + (b.image ? "ছবি বদলান" : "ছবি দিন") + '<input type="file" accept="image/*" data-banner-img="' + i + '" hidden></label>' +
          (b.image ? '<button type="button" class="btn btn-line btn-sm" data-bimg-del="' + i + '">ছবি সরান</button>' : "") +
        '</div>' +
        (b.image ? '<div class="hb-mobile">' +
          '<div class="hb-mimg">' + (b.imageMobile ? '<img src="' + esc(BB.displaySrc(b.imageMobile)) + '" alt="">' : '<span>নেই</span>') + '</div>' +
          '<div><p><b>মোবাইলের ছবি (ঐচ্ছিক)</b></p><p class="a-muted">ফোনে লেখা উপরে বসে, পণ্য নিচে দেখায়। লম্বা ছবি দিন (যেমন ৮০০×১২৫০), পণ্য নিচের দিকে আর উপরের অংশ ফাঁকা। না দিলে বড় ছবিটাই নিচে বসিয়ে দেখানো হবে।</p>' +
          '<div class="a-btnrow"><label class="btn btn-ghost btn-sm a-filebtn">' + (b.imageMobile ? "বদলান" : "ছবি দিন") + '<input type="file" accept="image/*" data-banner-mimg="' + i + '" hidden></label>' +
          (b.imageMobile ? '<button type="button" class="btn btn-line btn-sm" data-bmimg-del="' + i + '">সরান</button>' : "") +
          '</div></div></div>' : "") +
        '<div class="ed-2">' +
          bf(i, "label.bn", "ছোট লাইন (বাংলা)", b.label.bn, "যেমন: প্রিমিয়াম লঞ্জেরি") + bf(i, "label.en", "Small line (English)", b.label.en, "PREMIUM LINGERIE") +
          bf(i, "title.bn", "শিরোনাম (বাংলা)", b.title.bn) + bf(i, "title.en", "Title (English)", b.title.en) +
          bf(i, "sub.bn", "নিচের লাইন (বাংলা)", b.sub.bn) + bf(i, "sub.en", "Sub line (English)", b.sub.en) +
          bf(i, "cta.bn", "বাটনের লেখা (বাংলা)", b.cta.bn, "এখনই কিনুন") + bf(i, "cta.en", "Button (English)", b.cta.en, "Shop Now") +
          bf(i, "script", "হাতের লেখার লাইন (English)", b.script, "Comfort That Hugs You Back") + bf(i, "aside", "ডান পাশের লেখা (English, ঐচ্ছিক)", b.aside, "Because You Deserve the Best") +
          '<label class="a-field"><span>বাটন চাপলে যাবে</span><select data-b="' + i + '" data-bf="link">' + linkOptions(b.link) + '</select></label>' +
          '<label class="a-field"><span>ছবি না থাকলে কোন ক্যাটাগরির পণ্য দেখাবে</span><select data-b="' + i + '" data-bf="collage">' + catOptions(b.collage, "কোনোটা না") + '</select></label>' +
        '</div></div>';
    }).join("");

    var revs = s.reviews.map(function (r, i) {
      return '<div class="hb-card rv-card">' +
        '<div class="hb-top"><b>রিভিউ ' + bn(i + 1) + '</b><span class="hb-acts">' +
          '<button type="button" class="a-ic" data-rdel="' + i + '" aria-label="রিভিউ মুছুন"><svg viewBox="0 0 24 24"><path d="M6 6l12 12M18 6 6 18"/></svg></button></span></div>' +
        '<div class="rv-row"><label class="rv-photo" title="কাস্টমারের ছবি (ঐচ্ছিক)">' + (r.photo ? '<img src="' + esc(BB.displaySrc(r.photo)) + '" alt="">' : '<span>ছবি</span>') +
          '<input type="file" accept="image/*" data-rev-img="' + i + '" hidden></label>' +
          '<div class="ed-2 rv-fields">' + rf(i, "name", "নাম *", r.name) + rf(i, "location", "জায়গা", r.location, "যেমন: ঢাকা") +
          '<label class="a-field"><span>রেটিং</span><select data-r="' + i + '" data-rf="rating">' + [5, 4, 3, 2, 1].map(function (n) {
            return '<option value="' + n + '"' + (n === r.rating ? " selected" : "") + '>' + "★★★★★".slice(0, n) + '</option>';
          }).join("") + '</select></label></div></div>' +
        '<div class="ed-2">' + rf(i, "text.bn", "রিভিউ (বাংলা)", r.text.bn, "", true) + rf(i, "text.en", "Review (English)", r.text.en, "", true) + '</div>' +
        '</div>';
    }).join("");

    $("#homePanel").innerHTML =
      '<div class="a-card a-form">' +
        '<h2>উপরের বড় ব্যানার (স্লাইড)</h2>' +
        '<p class="a-muted">চওড়া ছবি দিন (যেমন ১৬০০×৪০০), পণ্য ছবির ডান দিকে থাকলে সবচেয়ে সুন্দর দেখায়। বাম দিকে লেখা বসবে।</p>' +
        '<div class="hb-list">' + (slides || '<p class="a-muted">কোনো স্লাইড নেই।</p>') + '</div>' +
        '<button type="button" class="btn btn-ghost btn-sm" id="addBanner">নতুন স্লাইড</button>' +
      '</div>' +
      '<div class="a-card a-form">' +
        '<h2>কাস্টমার রিভিউ</h2>' +
        '<p class="a-note">শুধু আসল কাস্টমারের রিভিউ দিন, যেমন Facebook কমেন্ট বা WhatsApp মেসেজ থেকে, কাস্টমারের অনুমতি নিয়ে। বানানো রিভিউ দিলে কাস্টমারের বিশ্বাস নষ্ট হয়। কোনো রিভিউ না থাকলে সাইটে এই সেকশন দেখাবে না।</p>' +
        '<div class="hb-list">' + revs + '</div>' +
        '<button type="button" class="btn btn-ghost btn-sm" id="addReview">নতুন রিভিউ</button>' +
      '</div>';
  }
  function setPath(obj, path, val) {
    var k = path.split("."); if (k.length === 2) obj[k[0]][k[1]] = val; else obj[k[0]] = val;
  }

  /* ---------- publish ---------- */
  function publish() {
    if (busy) return;
    if (!BB.cloudOn) {
      download("config.js", BB.configFile(W), "text/javascript");
      toast("config.js ডাউনলোড হয়েছে। হোস্টিং এ assets/js/config.js ফাইলটা এটা দিয়ে বদলে দিন।", true);
      return;
    }
    busy = true;
    var btn = $("#publishBtn"); btn.disabled = true; btn.textContent = "পাবলিশ হচ্ছে…";
    BB.publish(W).then(function (clean) {
      W = clean; markSaved(); BB.saveDraft(W); renderAll();
      toast(BB.backend === "github" ? "পাবলিশ হয়েছে। ১-২ মিনিটের মধ্যে সাইটে দেখাবে।" : "পাবলিশ হয়েছে। সাইটে এখন নতুন তথ্য দেখাবে।", true);
    }).catch(function (e) {
      var msg = (e && (e.message || e.error_description)) || "";
      if (BB.backend === "github") {
        if (e && e.status === 401) toast("পাবলিশ হয়নি: টোকেনের মেয়াদ শেষ বা ভুল। লগআউট করে নতুন টোকেন দিয়ে লগইন করুন।", true);
        else if (e && (e.status === 403 || e.status === 404)) toast("পাবলিশ হয়নি: এই টোকেনে লেখার অনুমতি নেই (Contents: Read and write লাগবে)।", true);
        else toast("পাবলিশ হয়নি: " + (msg || "ইন্টারনেট সংযোগ দেখুন"), true);
        return;
      }
      if (/jwt|auth|401|403|row-level|permission/i.test(msg)) toast("পাবলিশ হয়নি: লগইনের মেয়াদ শেষ বা অনুমতি নেই। আবার লগইন করুন।", true);
      else toast("পাবলিশ হয়নি: " + (msg || "ইন্টারনেট সংযোগ দেখুন") , true);
    }).then(function () {
      busy = false; btn.disabled = false; btn.textContent = "পাবলিশ করুন";
    });
  }

  function discard() {
    confirmBox(BB.cloudOn ? "পাবলিশ না করা সব পরিবর্তন বাতিল হবে। ঠিক আছে?" : "এই ব্রাউজারের সব পরিবর্তন মুছে config.js এর অবস্থায় ফিরে যাবে। ঠিক আছে?", "বাতিল করুন")
      .then(function (yes) {
        if (!yes) return;
        W = JSON.parse(savedSnap);
        if (BB.cloudOn) BB.saveDraft(W); else BB.clearDraft();
        renderAll(); toast("পরিবর্তন বাতিল হয়েছে");
      });
  }

  /* ---------- render all ---------- */
  function renderAll() {
    renderList();
    renderSettings();
    renderHome();
    renderSaveBar();
    $all(".a-tabs [data-tab]").forEach(function (b) { b.setAttribute("aria-selected", String(b.dataset.tab === view.tab)); });
    $all(".a-panel").forEach(function (p) { p.hidden = p.dataset.panel !== view.tab; });
  }

  /* ---------- events ---------- */
  document.addEventListener("click", function (e) {
    var el;
    if ((el = e.target.closest("[data-tab]"))) { view.tab = el.dataset.tab; renderAll(); return; }
    if ((el = e.target.closest("[data-filter]"))) { view.filter = el.dataset.filter; if (el.id === "clearFilter") { view.q = ""; $("#aSearch").value = ""; } renderList(); return; }
    if (e.target.closest("#addProduct")) { openEditor(null); return; }

    if (!e.target.closest("#editor")) {
      if ((el = e.target.closest("[data-edit]"))) { openEditor(el.dataset.edit); return; }
      if ((el = e.target.closest("[data-move]"))) {
        var i = findIdx(el.dataset.id), j = i + (+el.dataset.move);
        if (i < 0 || j < 0 || j >= W.products.length) return;
        var tmp = W.products[i]; W.products[i] = W.products[j]; W.products[j] = tmp;
        touch(); renderList();
        var again = $('[data-row="' + CSS.escape(tmp.id) + '"] [data-move="' + el.dataset.move + '"]'); if (again && !again.disabled) again.focus();
        return;
      }
      if ((el = e.target.closest("[data-stock]"))) { var p1 = W.products[findIdx(el.dataset.stock)]; p1.inStock = !p1.inStock; touch(); rerenderRow(p1.id); toast(p1.inStock ? "স্টকে আছে" : "স্টক শেষ করা হয়েছে"); return; }
      if ((el = e.target.closest("[data-active]"))) { var p2 = W.products[findIdx(el.dataset.active)]; p2.active = !p2.active; touch(); rerenderRow(p2.id); toast(p2.active ? "সাইটে দেখাবে" : "সাইট থেকে লুকানো হয়েছে"); return; }
    }

    // editor
    if (ed && e.target.closest("#editor")) {
      if (e.target.closest("[data-ed-close]")) { closeEditor(); return; }
      if ((el = e.target.closest("[data-img-del]"))) { readEditor(); ed.images.splice(+el.dataset.imgDel, 1); renderEditor(); return; }
      if ((el = e.target.closest("[data-img-main]"))) { readEditor(); var k = +el.dataset.imgMain; var im = ed.images.splice(k, 1)[0]; ed.images.unshift(im); renderEditor(); return; }
      if (e.target.closest("#edAddOpt")) {
        readEditor();
        ed.options.push({ id: "o" + Date.now().toString(36), label: { bn: "", en: "" }, price: null, oldPrice: null });
        renderEditor();
        var rows = $all(".ed-opt"); var last = rows[rows.length - 1]; if (last) last.querySelector("input").focus();
        return;
      }
      if ((el = e.target.closest("[data-opt-del]"))) { readEditor(); ed.options.splice(+el.dataset.optDel, 1); renderEditor(); return; }
      if (e.target.closest("#edDelete")) {
        var name = ed.name.bn || "এই পণ্য";
        confirmBox("\"" + name + "\" পুরোপুরি মুছে ফেলবেন?", "মুছে ফেলুন").then(function (yes) {
          if (!yes) return;
          var idx = findIdx(ed.id); if (idx >= 0) W.products.splice(idx, 1);
          closeEditor(); touch(); renderList(); toast("পণ্য মুছে ফেলা হয়েছে");
        });
        return;
      }
    }

    // homepage
    if (e.target.closest("#addBanner")) {
      W.settings.banners.push(BB.normBanner({ cta: { bn: "এখনই কিনুন", en: "Shop Now" }, link: "#shop" }, W.settings.banners.length));
      touch(); renderHome(); return;
    }
    if ((el = e.target.closest("[data-bmove]"))) {
      var bi = +el.dataset.bi, bj = bi + (+el.dataset.bmove), arr = W.settings.banners;
      if (bj < 0 || bj >= arr.length) return;
      var tb = arr[bi]; arr[bi] = arr[bj]; arr[bj] = tb; touch(); renderHome(); return;
    }
    if ((el = e.target.closest("[data-bdel]"))) {
      var di = +el.dataset.bdel;
      confirmBox("স্লাইড " + bn(di + 1) + " মুছে ফেলবেন?", "মুছে ফেলুন").then(function (y) { if (!y) return; W.settings.banners.splice(di, 1); touch(); renderHome(); });
      return;
    }
    if ((el = e.target.closest("[data-bimg-del]"))) { W.settings.banners[+el.dataset.bimgDel].image = ""; W.settings.banners[+el.dataset.bimgDel].imageMobile = ""; touch(); renderHome(); return; }
    if ((el = e.target.closest("[data-bmimg-del]"))) { W.settings.banners[+el.dataset.bmimgDel].imageMobile = ""; touch(); renderHome(); return; }
    if (e.target.closest("#addReview")) {
      W.settings.reviews.push({ id: BB.uid("r"), name: "", location: "", text: { bn: "", en: "" }, rating: 5, photo: "" });
      touch(); renderHome();
      var names = $all('[data-rf="name"]'); if (names.length) names[names.length - 1].focus();
      return;
    }
    if ((el = e.target.closest("[data-rdel]"))) {
      var ri = +el.dataset.rdel;
      confirmBox("এই রিভিউ মুছে ফেলবেন?", "মুছে ফেলুন").then(function (y) { if (!y) return; W.settings.reviews.splice(ri, 1); touch(); renderHome(); });
      return;
    }

    // settings
    if (e.target.closest("#addCat")) {
      W.settings.categories.push({ id: BB.uid("c"), label: { bn: "", en: "" }, image: "", icon: "bow" });
      touch(); renderSettings();
      var inputs = $all('#cats [data-c="bn"]'); inputs[inputs.length - 1].focus();
      return;
    }
    if ((el = e.target.closest("[data-cat-del]"))) {
      var ci = +el.dataset.catDel, cat = W.settings.categories[ci];
      var used = W.products.filter(function (p) { return p.cat === cat.id; }).length;
      if (W.settings.categories.length === 1) { toast("অন্তত একটা ক্যাটাগরি রাখতে হবে"); return; }
      confirmBox(used ? "\"" + (cat.label.bn || "এই ক্যাটাগরি") + "\" মুছলে এর " + bn(used) + "টি পণ্য প্রথম ক্যাটাগরিতে চলে যাবে। মুছবেন?" : "\"" + (cat.label.bn || "এই ক্যাটাগরি") + "\" মুছে ফেলবেন?", "মুছে ফেলুন")
        .then(function (yes) {
          if (!yes) return;
          W.settings.categories.splice(ci, 1);
          var first = W.settings.categories[0].id;
          W.products.forEach(function (p) { if (p.cat === cat.id) p.cat = first; });
          touch(); renderSettings(); renderList();
        });
      return;
    }

    if (e.target.closest("#publishBtn")) { publish(); return; }
    if (e.target.closest("#discardBtn")) { discard(); return; }
    if (e.target.closest("#exportJson")) { download("blushing-beauty-backup-" + new Date().toISOString().slice(0, 10) + ".json", JSON.stringify(W, null, 2), "application/json"); return; }
    if (e.target.closest("#exportConfig")) { download("config.js", BB.configFile(W), "text/javascript"); toast("config.js ডাউনলোড হয়েছে"); return; }
    if (e.target.closest("#resetDefaults")) {
      confirmBox("সব পণ্য আর সেটিংস config.js ফাইলের অবস্থায় ফিরে যাবে। ঠিক আছে?", "ফিরে যান").then(function (yes) {
        if (!yes) return; W = BB.normalize(null); touch(); renderAll(); toast("config.js এর পণ্যগুলো লোড হয়েছে। রাখতে চাইলে পাবলিশ করুন।", true);
      });
      return;
    }
    if (e.target.closest("#logoutBtn")) {
      var go = function () { BB.signOut().catch(function () {}).then(function () { location.reload(); }); };
      if (changeCount()) confirmBox("পাবলিশ না করা পরিবর্তন আছে। তবুও লগআউট করবেন?", "লগআউট").then(function (y) { if (y) go(); });
      else go();
      return;
    }
    if (e.target.closest("#retryBtn")) { boot(); return; }
    if (e.target.tagName === "DIALOG" && e.target.id === "confirmDlg") { $("#confirmNo").click(); }
  });

  // quick price edit in the list
  document.addEventListener("input", function (e) {
    var t = e.target;
    if (t.dataset && t.dataset.qp) {
      var p = W.products[findIdx(t.dataset.qp)];
      p.options[0].price = BB.num(t.value);
      if (p.options[0].oldPrice != null && (p.options[0].price == null || p.options[0].oldPrice <= p.options[0].price)) p.options[0].oldPrice = null;
      touch();
      return;
    }
    if (t.id === "aSearch") { view.q = t.value.trim(); renderList(); return; }
    if (t.closest && t.closest("#settingsForm")) { readSettings(e); return; }
    if (t.dataset && t.dataset.bf) { setPath(W.settings.banners[+t.dataset.b], t.dataset.bf, t.value); touch(); return; }
    if (t.dataset && t.dataset.rf) {
      setPath(W.settings.reviews[+t.dataset.r], t.dataset.rf, t.dataset.rf === "rating" ? +t.value : t.value);
      touch(); return;
    }
  });
  document.addEventListener("change", function (e) {
    var t = e.target;
    if (t.dataset && t.dataset.qp) { rerenderRow(t.dataset.qp); return; }
    if (t.id === "edFile") { addImages(t.files); t.value = ""; return; }
    if (t.dataset && (t.dataset.bannerImg || t.dataset.bannerMimg || t.dataset.catImg || t.dataset.revImg) && t.files && t.files[0]) {
      var file = t.files[0], holder = t.closest(".hb-card, .cat-row");
      if (holder) holder.classList.add("is-busy");
      var job = t.dataset.bannerMimg ? imageSrc(file, BB.cloudOn ? 900 : 800, BB.cloudOn ? 0.85 : 0.8, true).then(function (src) { W.settings.banners[+t.dataset.bannerMimg].imageMobile = src; renderHome(); })
        : t.dataset.bannerImg ? imageSrc(file, BB.cloudOn ? 1800 : 1500, BB.cloudOn ? 0.85 : 0.78, true).then(function (src) { W.settings.banners[+t.dataset.bannerImg].image = src; renderHome(); })
        : t.dataset.catImg ? imageSrc(file, 900, 0.84, true).then(function (src) { W.settings.categories[+t.dataset.catImg].image = src; renderSettings(); })
        : imageSrc(file, 240, 0.85, false).then(function (src) { W.settings.reviews[+t.dataset.revImg].photo = src; renderHome(); });
      job.then(function () { touch(); toast("ছবি যোগ হয়েছে। পাবলিশ করতে ভুলবেন না।"); })
        .catch(function (err) { toast("ছবি যোগ হয়নি: " + ((err && err.message) || "অজানা সমস্যা"), true); })
        .then(function () { if (holder) holder.classList.remove("is-busy"); });
      t.value = "";
      return;
    }
    if (t.name === "sizemode") { $("#customSizes").hidden = t.value !== "custom"; if (t.value === "custom") $("#edForm").sizes_custom.focus(); return; }
    if (t.id === "importJson" && t.files[0]) {
      var r = new FileReader();
      r.onload = function () {
        try {
          var data = JSON.parse(r.result);
          if (!data || !Array.isArray(data.products)) throw new Error("bad");
          confirmBox("ব্যাকআপের " + bn(data.products.length) + "টি পণ্য দিয়ে এখনকার সব কিছু বদলে যাবে। ঠিক আছে?", "ফিরিয়ে আনুন").then(function (yes) {
            if (!yes) return; W = BB.normalize(data); touch(); renderAll(); toast("ব্যাকআপ লোড হয়েছে। রাখতে চাইলে পাবলিশ করুন।", true);
          });
        } catch (err) { toast("এই ফাইলটা Blushing Beauty এর ব্যাকআপ না।", true); }
      };
      r.readAsText(t.files[0]); t.value = "";
    }
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Enter" && e.target.dataset && e.target.dataset.qp) { e.preventDefault(); e.target.blur(); }
  });

  $("#edForm").addEventListener("submit", function (e) { e.preventDefault(); saveEditor(); });
  $("#editor").addEventListener("cancel", function () { ed = null; });
  // drag & drop images onto the editor
  $("#editor").addEventListener("dragover", function (e) { if (ed) { e.preventDefault(); } });
  $("#editor").addEventListener("drop", function (e) { if (ed && e.dataTransfer.files.length) { e.preventDefault(); addImages(e.dataTransfer.files); } });

  window.addEventListener("beforeunload", function (e) {
    if (BB.cloudOn && W && changeCount()) { e.preventDefault(); e.returnValue = ""; }
  });

  $("#loginForm").addEventListener("submit", function (e) {
    e.preventDefault();
    var f = e.target, err = $("#loginErr"), btn = $("#loginBtn");
    var isGh = BB.backend === "github";
    if (isGh && !f.token.value.trim()) { err.textContent = "টোকেনটা পেস্ট করুন।"; return; }
    if (!isGh && (!f.email.value || !f.password.value)) { err.textContent = "ইমেইল আর পাসওয়ার্ড দুটোই লিখুন।"; return; }
    btn.disabled = true; btn.textContent = "লগইন হচ্ছে…"; err.textContent = "";
    (isGh ? BB.signInToken(f.token.value) : BB.signIn(f.email.value.trim(), f.password.value)).then(function () { f.reset(); startApp(); })
      .catch(function (e2) {
        var m = (e2 && e2.message) || "";
        if (isGh) {
          err.textContent = e2 && e2.status === 401 ? "টোকেনটা ভুল বা মেয়াদ শেষ।"
            : e2 && (e2.status === 403 || e2.status === 404) ? "এই টোকেনে " + BB.github.owner + "/" + BB.github.repo + " রিপোতে অ্যাক্সেস নেই।"
            : "লগইন হয়নি: " + (m || "ইন্টারনেট সংযোগ দেখুন");
          return;
        }
        err.textContent = /invalid/i.test(m) ? "ইমেইল বা পাসওয়ার্ড ভুল।" : "লগইন হয়নি: " + (m || "ইন্টারনেট সংযোগ দেখুন");
      })
      .then(function () { btn.disabled = false; btn.textContent = "লগইন করুন"; });
  });

  /* ---------- boot ---------- */
  function startApp() {
    show("loadView"); $("#loadText").textContent = "ডেটা লোড হচ্ছে…"; $("#retryBtn").hidden = true;
    $("#logoutBtn").hidden = !BB.cloudOn;
    BB.loadForAdmin().then(function (res) {
      if (BB.cloudOn) {
        W = res.data; markSaved(); BB.saveDraft(W);
        if (res.source === "defaults" && BB.backend !== "github") toast("ক্লাউডে এখনো কিছু নেই। config.js এর পণ্যগুলো দেখানো হচ্ছে, একবার পাবলিশ করলেই ক্লাউডে উঠে যাবে।", true);
      } else {
        savedSnap = JSON.stringify(BB.normalize(null));   // what's deployed in config.js
        W = res.data;
      }
      show("appView");
      renderAll();
    }).catch(function (e) {
      $("#loadText").textContent = "ডেটা লোড করা যায়নি: " + ((e && e.message) || "ইন্টারনেট সংযোগ দেখুন");
      $("#retryBtn").hidden = false;
    });
  }

  function boot() {
    setMode();
    if (!BB.cloudOn) { startApp(); return; }
    show("loadView"); $("#loadText").textContent = "সংযোগ হচ্ছে…"; $("#retryBtn").hidden = true;
    BB.getSession().then(function (s) { if (s) startApp(); else show("loginView"); })
      .catch(function (e) {
        $("#loadText").textContent = "সংযোগ হয়নি: " + ((e && e.message) || "ইন্টারনেট সংযোগ দেখুন");
        $("#retryBtn").hidden = false;
      });
  }
  boot();
})();
