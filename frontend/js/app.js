// ─────────────────────────────────────
//  BundleHub — App Core
//  Pages, bundle rendering, cart
// ─────────────────────────────────────

const cart = [];

// ── Toast ──
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2500);
}

// ── Page navigation ──
function showPage(name) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');

  document.querySelectorAll('.nav-links a').forEach(a => a.classList.remove('active'));
  const navMap = { home: 'nav-home', ai: 'nav-ai', creators: 'nav-creators' };
  if (navMap[name]) document.getElementById(navMap[name])?.classList.add('active');

  if (name === 'cart')     renderCart();
  if (name === 'creators') renderBundles(CREATOR_BUNDLES, 'creators-grid');
  if (name === 'profile')  document.getElementById('stat-cart').textContent = cart.length;

  window.scrollTo(0, 0);
}

function runHeroSearchFromNav() {
  const navInput = document.getElementById('nav-search-input');
  const heroInput = document.getElementById('hero-search-input');
  const value = navInput?.value.trim();
  if (!value) return;
  if (heroInput) heroInput.value = value;
  runHeroSearch();
}

// ── Emoji background colours ──
function emojiBackground(e) {
  const map = {
    '👔':'#ede9ff','🍳':'#fef3c7','🎓':'#dbeafe','💻':'#dcfce7',
    '🎮':'#fce7f3','🏋':'#d1fae5','✈':'#e0f2fe','👶':'#fce7f3',
    '💍':'#fef9c3','🐶':'#fef9c3','🎁':'#fce7f3','🌧':'#dbeafe',
    '🖥':'#dcfce7','🌍':'#e0f2fe','💪':'#d1fae5',
  };
  return map[e] || '#f0eff8';
}

// ── Render bundle grid ──
function renderBundles(list, containerId) {
  const grid = document.getElementById(containerId);
  if (!grid) return;
  grid.innerHTML = '';

  list.forEach(b => {
    const chips = b.items.slice(0, 4)
      .map(i => `<div class="item-chip">${i.icon} ${i.name.split(' ')[0]}</div>`)
      .join('');
    const extra = b.items.length > 4
      ? `<div class="item-chip">+${b.items.length - 4} more</div>` : '';

    grid.innerHTML += `
      <div class="bundle-card" onclick="showDetail(${b.id})">
        <div class="savings-badge">Save ${b.save}</div>
        <div class="bundle-img" style="background:${emojiBackground(b.emoji)}">${b.emoji}</div>
        <div class="bundle-body">
          <div class="bundle-badge">${b.badge}</div>
          <div class="bundle-name">${b.name}</div>
          <div class="bundle-desc">${b.desc}</div>
          <div class="bundle-items">${chips}${extra}</div>
          <div class="bundle-footer">
            <div class="bundle-price">
              ₹${b.price.toLocaleString('en-IN')}
              <span>₹${b.original.toLocaleString('en-IN')}</span>
            </div>
            <button class="add-btn" onclick="event.stopPropagation();addToCart(${b.id})">
              Add to Cart
            </button>
          </div>
        </div>
      </div>`;
  });
}

// ── Category filter ──
function filterCat(cat, el) {
  document.querySelectorAll('.cat-tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');

  const titles = {
    all:     '🔥 Trending Bundles',
    fashion: '👔 Fashion Bundles',
    home:    '🏠 Home Setup Bundles',
    college: '🎓 College Bundles',
    work:    '💻 Work Bundles',
    gaming:  '🎮 Gaming Bundles',
    fitness: '🏋 Fitness Bundles',
    travel:  '✈ Travel Bundles',
    baby:    '👶 Baby Bundles',
    wedding: '💍 Wedding Bundles',
    pet:     '🐶 Pet Bundles',
    gift:    '🎁 Gift Bundles',
  };
  document.getElementById('cat-title').textContent = titles[cat] || '🌟 Bundles';

  const filtered = cat === 'all' ? BUNDLES : BUNDLES.filter(b => b.cat === cat);
  renderBundles(filtered, 'bundles-grid');
}

// ── Bundle detail page ──
function showDetail(id) {
  const b = [...BUNDLES, ...CREATOR_BUNDLES].find(x => x.id === id);
  if (!b) return;

  const rows = b.items.map(item => `
    <div class="bundle-item-row">
      <input type="checkbox" class="item-toggle" checked>
      <div class="item-icon">${item.icon}</div>
      <div class="item-info">
        <div class="item-name">${item.name}</div>
        <div class="item-brand">${item.brand}</div>
      </div>
      <div class="item-price">₹${item.price.toLocaleString('en-IN')}</div>
    </div>`).join('');

  document.getElementById('detail-content').innerHTML = `
    <div class="detail-hero">
      <div class="detail-emoji">${b.emoji}</div>
      <div class="detail-info">
        <div class="detail-badge">${b.badge}</div>
        <div class="detail-name">${b.name}</div>
        <div class="detail-desc">${b.desc}</div>
        <div class="detail-price-row">
          <div class="detail-price">₹${b.price.toLocaleString('en-IN')}</div>
          <div class="detail-original">₹${b.original.toLocaleString('en-IN')}</div>
          <div class="detail-save">You save ${b.save}</div>
        </div>
        <div class="detail-actions">
          <button class="btn-large btn-accent" onclick="addToCart(${b.id});showPage('cart')">Add to Cart</button>
          <button class="btn-large btn-outline" onclick="addToCart(${b.id});showToast('Bundle saved! ✓')">Save Bundle</button>
        </div>
      </div>
    </div>
    <div class="items-list">
      <div class="items-list-header">
        Bundle includes ${b.items.length} items
        <span>Uncheck to remove items</span>
      </div>
      ${rows}
    </div>`;

  showPage('detail');
}

// ── Cart ──
function addToCart(id) {
  const b = [...BUNDLES, ...CREATOR_BUNDLES].find(x => x.id === id);
  if (!b) return;
  if (!cart.find(c => c.id === id)) cart.push({ ...b });
  updateCartCount();
  showToast(`🎉 ${b.name} added to cart!`);
}

function addAIBundle(name, price, original, emoji) {
  cart.push({ id: Date.now(), name, price, original, emoji, items: [{ name: 'AI-curated items' }] });
  updateCartCount();
  showToast('🎉 AI bundle added to cart!');
}

function updateCartCount() {
  document.getElementById('cart-count').textContent = cart.length;
}

function removeFromCart(i) {
  cart.splice(i, 1);
  updateCartCount();
  renderCart();
}

function renderCart() {
  const el = document.getElementById('cart-content');

  if (cart.length === 0) {
    el.innerHTML = `
      <div class="empty-state">
        <div class="emoji">🛒</div>
        <h3>Your cart is empty</h3>
        <p>Add some bundles to get started.</p>
        <button class="btn btn-primary" onclick="showPage('home')">Explore Bundles</button>
      </div>`;
    return;
  }

  const total  = cart.reduce((s, b) => s + b.price,    0);
  const orig   = cart.reduce((s, b) => s + b.original, 0);
  const saved  = orig - total;

  const items = cart.map((b, i) => `
    <div class="cart-item">
      <div class="cart-icon">${b.emoji}</div>
      <div class="cart-info">
        <div class="cart-name">${b.name}</div>
        <div class="cart-count-text">${b.items.length} item${b.items.length !== 1 ? 's' : ''} in this bundle</div>
      </div>
      <div class="cart-price">₹${b.price.toLocaleString('en-IN')}</div>
      <button class="cart-remove" onclick="removeFromCart(${i})">✕</button>
    </div>`).join('');

  el.innerHTML = `
    ${items}
    <div class="cart-summary">
      <div class="cart-row">
        <span>Subtotal (${cart.length} bundle${cart.length > 1 ? 's' : ''})</span>
        <span>₹${orig.toLocaleString('en-IN')}</span>
      </div>
      <div class="cart-row">
        <span>Bundle savings</span>
        <span style="color:#15803d">−₹${saved.toLocaleString('en-IN')}</span>
      </div>
      <div class="cart-row">
        <span>Delivery</span>
        <span style="color:#15803d">Free</span>
      </div>
      <div class="cart-row total">
        <span>Total</span>
        <span>₹${total.toLocaleString('en-IN')}</span>
      </div>
      <button class="btn-large btn-accent"
        style="width:100%;margin-top:1rem;"
        onclick="showToast('🚀 Checkout coming soon!')">
        Proceed to Checkout →
      </button>
    </div>`;
}

// ── Hero search ──
function runHeroSearch() {
  const val = document.getElementById('hero-search-input').value.trim();
  if (!val) return;
  showPage('ai');
  document.getElementById('ai-input-main').value = val;
  generateBundle();
}

function quickSearch(q) {
  document.getElementById('hero-search-input').value = q;
  runHeroSearch();
}

function setAIExample(q) {
  document.getElementById('ai-input-home').value = q;
}

function goToAI() {
  const val = document.getElementById('ai-input-home').value.trim();
  showPage('ai');
  if (val) {
    document.getElementById('ai-input-main').value = val;
    generateBundle();
  }
}

// ── Init ──
document.addEventListener('DOMContentLoaded', () => {
  renderBundles(BUNDLES, 'bundles-grid');
});
