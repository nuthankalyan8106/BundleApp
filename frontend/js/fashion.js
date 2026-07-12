// ─────────────────────────────────────────────────────────────
//  BundleBasket — Fashion Module
//  Namespace: window.Fashion
//  Handles: landing → list → detail navigation,
//           product card rendering, live price calculation
// ─────────────────────────────────────────────────────────────

const Fashion = (() => {

  // ── State ──────────────────────────────────────────────────
  let _activeCategoryId = null;   // 'formal' | 'casual' | 'premium'
  let _activeBundleId   = null;   // e.g. 'formal-1'
  let _checkedProducts  = {};     // { productId: true/false }

  // ── Helpers ────────────────────────────────────────────────
  function fmt(n) {
    return '₹' + Math.round(n).toLocaleString('en-IN');
  }

  function el(id) {
    return document.getElementById(id);
  }

  function setInnerHTML(id, html) {
    const node = el(id);
    if (node) node.innerHTML = html;
  }

  function setText(id, text) {
    const node = el(id);
    if (node) node.textContent = text;
  }

  function setStyle(id, prop, val) {
    const node = el(id);
    if (node) node.style[prop] = val;
  }

  // Arrow icon SVG (reused in buttons)
  const ARROW_RIGHT = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M5 12h14M12 5l7 7-7 7"/></svg>`;

  const ARROW_LEFT = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
    <path d="M19 12H5M12 5l-7 7 7 7"/></svg>`;

  // ── Page Navigation ────────────────────────────────────────
  function showLanding() {
    showPage('fashion-landing');
    renderFashionLanding();
  }

  function showList(categoryId) {
    _activeCategoryId = categoryId;
    renderBundleList(categoryId);
    showPage('fashion-list');
  }

  function showDetail(bundleId) {
    _activeBundleId = bundleId;
    renderBundleDetail(bundleId);
    showPage('fashion-detail');
  }

  // ── RENDER: Fashion Landing ────────────────────────────────
  function renderFashionLanding() {
    const grid = el('fsh-categories-grid');
    if (!grid) return;

    grid.innerHTML = FASHION_CATEGORIES.map(cat => `
      <div class="fsh-cat-card" onclick="Fashion.showList('${cat.id}')"
           role="button" aria-label="Explore ${cat.title}">
        <div class="fsh-cat-card-img"
             style="background-image:url('${cat.image}')"></div>
        <div class="fsh-cat-card-overlay"
             style="background:${cat.gradient}"></div>
        <div class="fsh-cat-card-body">
          <div class="fsh-cat-card-eyebrow">${cat.subtitle}</div>
          <h3>${cat.title}</h3>
          <p>${cat.description}</p>
          <button class="fsh-cat-btn" tabindex="-1">
            Explore Bundles ${ARROW_RIGHT}
          </button>
        </div>
      </div>
    `).join('');
  }

  // ── RENDER: Bundle List ────────────────────────────────────
  function renderBundleList(categoryId) {
    const cat     = FASHION_CATEGORIES.find(c => c.id === categoryId);
    const bundles = FASHION_BUNDLES[categoryId] || [];
    if (!cat) return;

    // Fill hero
    setStyle('fsh-list-hero-bg', 'backgroundImage', `url('${cat.image}')`);
    setText('fsh-list-hero-badge-text', cat.title);
    setText('fsh-list-hero-title', cat.title);
    setText('fsh-list-hero-desc', cat.description);

    // Count heading
    setText('fsh-list-count-heading', 'Curated Bundles');
    setText('fsh-list-count-sub',
      `${bundles.length} bundle${bundles.length !== 1 ? 's' : ''} — each professionally styled`);

    // Render cards
    const grid = el('fsh-bundles-grid');
    if (!grid) return;

    grid.innerHTML = bundles.map(bundle => {
      const tagHTML = bundle.tags.slice(0, 3).map(t =>
        `<span class="fsh-bundle-tag">${t}</span>`).join('');
      const productCount = bundle.products.length;

      return `
        <div class="fsh-bundle-card"
             onclick="Fashion.showDetail('${bundle.id}')"
             role="button" aria-label="View ${bundle.title}">
          <div class="fsh-bundle-card-img-wrap">
            <img
              class="fsh-bundle-card-img"
              src="${bundle.image}"
              alt="${bundle.title}"
              loading="lazy"
              onerror="this.parentNode.innerHTML='<div class=\\'fsh-bundle-card-img-fallback\\'>${cat.icon}</div>'"
            />
          </div>
          <div class="fsh-bundle-card-body">
            <div class="fsh-bundle-tags">${tagHTML}</div>
            <div class="fsh-bundle-card-title">${bundle.title}</div>
            <div class="fsh-bundle-card-desc">${bundle.description}</div>
            <div class="fsh-bundle-card-footer">
              <div class="fsh-bundle-items-count">
                <strong>${productCount}</strong> curated pieces
              </div>
              <button class="fsh-view-btn" tabindex="-1">
                View Bundle ${ARROW_RIGHT}
              </button>
            </div>
          </div>
        </div>`;
    }).join('');
  }

  // ── RENDER: Bundle Detail ──────────────────────────────────
  function renderBundleDetail(bundleId) {
    // Find bundle across all categories
    let bundle = null;
    let cat    = null;
    for (const [catId, bundles] of Object.entries(FASHION_BUNDLES)) {
      const found = bundles.find(b => b.id === bundleId);
      if (found) {
        bundle = found;
        cat    = FASHION_CATEGORIES.find(c => c.id === catId);
        break;
      }
    }
    if (!bundle || !cat) return;

    // ── Hero ──
    setStyle('fsh-detail-hero-bg', 'backgroundImage', `url('${bundle.image}')`);
    setText('fsh-detail-badge-text', cat.title);
    setText('fsh-detail-title', bundle.title);
    setText('fsh-detail-desc', bundle.description);

    // Back button label
    const backBtn = el('fsh-detail-back-btn');
    if (backBtn) {
      backBtn.onclick = () => Fashion.showList(cat.id);
      el('fsh-detail-back-label').textContent = cat.title;
    }

    // Tags
    setInnerHTML('fsh-detail-tags-row',
      bundle.tags.map(t => `<span class="fsh-detail-tag">${t}</span>`).join(''));

    // ── Outfit flow ──
    setInnerHTML('fsh-outfit-steps', bundle.products.map((p, i) => {
      const isLast = i === bundle.products.length - 1;
      return `
        <div class="fsh-outfit-step">
          <div class="fsh-outfit-step-icon">${p.icon}</div>
          <span class="fsh-outfit-step-label">${p.name}</span>
          <span class="fsh-outfit-step-brand">${p.brand}</span>
        </div>
        ${!isLast ? '<div class="fsh-outfit-step-connector"></div>' : ''}
      `;
    }).join(''));

    // ── Products ──
    setText('fsh-included-count', `${bundle.products.length} items`);

    // Init checked state — all checked by default
    _checkedProducts = {};
    bundle.products.forEach(p => { _checkedProducts[p.id] = true; });

    setInnerHTML('fsh-products-list', bundle.products.map(p => {
      const pills = [];
      if (p.color) pills.push(`<span class="fsh-product-pill">🎨 ${p.color}</span>`);
      if (p.size)  pills.push(`<span class="fsh-product-pill">📏 Size ${p.size}</span>`);
      pills.push(`<span class="fsh-product-pill">${p.category}</span>`);

      return `
        <div class="fsh-product-card" id="fsh-card-${p.id}">
          <input
            type="checkbox"
            class="fsh-product-checkbox"
            id="fsh-chk-${p.id}"
            checked
            onchange="Fashion.onProductToggle('${bundleId}', '${p.id}', this.checked)"
            aria-label="Include ${p.name}"
          />
          <div class="fsh-product-img-wrap">
            <img
              class="fsh-product-img"
              src="${p.image}"
              alt="${p.name}"
              loading="lazy"
              onerror="this.style.display='none';this.parentNode.innerHTML+='<div style=\\"display:flex;align-items:center;justify-content:center;height:100%;font-size:2rem;\\">${p.icon}</div>'"
            />
          </div>
          <div class="fsh-product-info">
            <div class="fsh-product-name">${p.name}</div>
            <div class="fsh-product-brand">${p.brand}</div>
            <div class="fsh-product-meta">${pills.join('')}</div>
          </div>
          <div class="fsh-product-price-col">
            <div class="fsh-product-price">${fmt(p.price)}</div>
            <a
              class="fsh-product-link"
              href="${p.link}"
              target="_blank"
              rel="noopener noreferrer"
              onclick="event.stopPropagation()"
            >View Product ${ARROW_RIGHT}</a>
          </div>
        </div>`;
    }).join(''));

    // Initialise sidebar
    updatePriceSidebar(bundleId);
  }

  // ── Product Toggle Handler ─────────────────────────────────
  function onProductToggle(bundleId, productId, isChecked) {
    _checkedProducts[productId] = isChecked;

    // Dim/undim card
    const card = el(`fsh-card-${productId}`);
    if (card) {
      card.classList.toggle('fsh-unchecked', !isChecked);
    }

    updatePriceSidebar(bundleId);
  }

  // ── Live Price Calculation ────────────────────────────────
  function updatePriceSidebar(bundleId) {
    // Find bundle
    let bundle = null;
    for (const bundles of Object.values(FASHION_BUNDLES)) {
      const found = bundles.find(b => b.id === bundleId);
      if (found) { bundle = found; break; }
    }
    if (!bundle) return;

    const selectedProducts = bundle.products.filter(
      p => _checkedProducts[p.id] !== false
    );
    const totalCount   = bundle.products.length;
    const selectedCount = selectedProducts.length;

    const subtotal = selectedProducts.reduce((sum, p) => sum + p.price, 0);

    // Discount applies only if ≥ 2 items selected; scales down proportionally
    const discountPct = selectedCount >= 2 ? bundle.discount : 0;
    const savings     = Math.round(subtotal * discountPct / 100);
    const finalPrice  = subtotal - savings;

    // Update DOM
    setText('fsh-price-subtotal', fmt(subtotal));
    setText('fsh-price-savings',  fmt(savings));
    setText('fsh-price-total-num', Math.round(finalPrice).toLocaleString('en-IN'));

    const discountBadge = el('fsh-price-discount-badge');
    if (discountBadge) {
      discountBadge.textContent = discountPct > 0
        ? `${discountPct}% off`
        : 'No discount (select 2+ items)';
      discountBadge.style.background = discountPct > 0 ? '' : '#fef3c7';
      discountBadge.style.color      = discountPct > 0 ? '' : '#92400e';
    }

    setText('fsh-price-items-note',
      `${selectedCount} of ${totalCount} item${totalCount !== 1 ? 's' : ''} selected`);

    // Zero-items warning
    const warning = el('fsh-price-zero-warning');
    if (warning) {
      warning.classList.toggle('visible', selectedCount === 0);
    }
  }

  // ── Utility actions wired to hero buttons ─────────────────
  function customizeBundle() {
    // Scroll to product list so user can start unchecking
    const list = el('fsh-products-list');
    if (list) {
      list.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // Subtle flash on the stylist note
      const note = list.previousElementSibling?.previousElementSibling;
      if (note) {
        note.style.transition = 'box-shadow 0.3s';
        note.style.boxShadow  = '0 0 0 3px rgba(29,78,216,0.25)';
        setTimeout(() => { note.style.boxShadow = ''; }, 1200);
      }
    } else {
      showToast('Scroll down to customise your bundle.');
    }
  }

  function saveBundle() {
    const bundle = _findActiveBundle();
    if (bundle) showToast(`♡ "${bundle.title}" saved!`);
  }

  function _findActiveBundle() {
    if (!_activeBundleId) return null;
    for (const bundles of Object.values(FASHION_BUNDLES)) {
      const found = bundles.find(b => b.id === _activeBundleId);
      if (found) return found;
    }
    return null;
  }

  // ── RENDER: Home Page Fashion Spotlight ───────────────────
  // Shows a selection of fashion bundles on the home page
  // (one from each category) with compact cards.
  function renderHomeSpotlight() {
    const grid = el('fsh-home-grid');
    if (!grid) return;

    // Pick featured bundles: first from each category
    const featured = [];
    for (const cat of FASHION_CATEGORIES) {
      const bundles = FASHION_BUNDLES[cat.id] || [];
      // Take first 2 from each category for a nice mix
      bundles.slice(0, 2).forEach(b => featured.push({ bundle: b, cat }));
    }

    const ARROW = `<svg width="11" height="11" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M5 12h14M12 5l7 7-7 7"/></svg>`;

    grid.innerHTML = featured.map(({ bundle, cat }) => `
      <div class="fsh-home-card"
           onclick="Fashion.showDetail('${bundle.id}')"
           role="button"
           aria-label="View ${bundle.title}">
        <div class="fsh-home-card-img-wrap">
          <img
            class="fsh-home-card-img"
            src="${bundle.image}"
            alt="${bundle.title}"
            loading="lazy"
            onerror="this.style.display='none';this.parentNode.style.background='linear-gradient(135deg,rgba(29,78,216,0.08),rgba(249,115,22,0.08))';this.parentNode.innerHTML+='<div style=\\"display:flex;align-items:center;justify-content:center;height:100%;font-size:3rem;\\">${cat.icon}</div>'"
          />
          <div class="fsh-home-card-cat-badge">${cat.title}</div>
        </div>
        <div class="fsh-home-card-body">
          <div class="fsh-home-card-title">${bundle.title}</div>
          <div class="fsh-home-card-desc">${bundle.description}</div>
          <div class="fsh-home-card-footer">
            <div class="fsh-home-card-pieces">
              <strong>${bundle.products.length}</strong> curated pieces
            </div>
            <button class="fsh-home-card-btn" tabindex="-1">
              View Bundle ${ARROW}
            </button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // ── Init: render landing on first load ─────────────────────
  function init() {
    // Pre-render landing so it's ready when first visited
    renderFashionLanding();
    // Render the home spotlight section
    renderHomeSpotlight();
  }

  // ── Public API ─────────────────────────────────────────────
  return {
    init,
    showLanding,
    showList,
    showDetail,
    onProductToggle,
    customizeBundle,
    saveBundle,
    renderHomeSpotlight,
  };

})();
