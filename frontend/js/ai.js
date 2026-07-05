// ─────────────────────────────────────
//  BundleHub — AI Bundle Builder
//  Calls Claude API to generate bundles
// ─────────────────────────────────────

function setAIExampleMain(q) {
  document.getElementById('ai-input-main').value = q;
}

async function generateBundle() {
  const input = document.getElementById('ai-input-main').value.trim();
  if (!input) return;

  const resultEl = document.getElementById('ai-result');
  resultEl.innerHTML = `
    <div class="loading-wrap">
      <div class="spinner"></div>
      <p style="color:var(--text-muted);font-size:0.9rem;">AI is building your personalized bundle…</p>
    </div>`;

  const prompt = `You are BundleHub's AI bundle assistant. A user described their goal: "${input}"

Respond with ONLY a valid JSON object — no markdown, no explanation, no backticks. Use this exact format:
{
  "bundleName": "...",
  "emoji": "...",
  "description": "...",
  "items": [
    {"emoji":"...", "name":"...", "brand":"...", "price": NUMBER}
  ],
  "totalPrice": NUMBER,
  "originalPrice": NUMBER,
  "tags": ["...", "..."]
}

Rules:
- Create 5–8 items genuinely needed to achieve this goal
- Use realistic Indian market prices in INR (integers only, no decimals)
- originalPrice must be 5–25% higher than totalPrice
- tags: 2–3 short labels like ["Complete Kit", "Budget Friendly", "Under ₹40,000"]
- emoji: 1 single relevant emoji for the whole bundle
- Use specific, real brand names available in India`;

  try {
    const res = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data  = await res.json();
    const text  = data.content?.[0]?.text || '';
    const clean = text.replace(/```json|```/g, '').trim();
    const bundle = JSON.parse(clean);
    renderAIBundle(bundle);

  } catch (e) {
    resultEl.innerHTML = `
      <div style="text-align:center;padding:2rem;color:var(--text-muted);">
        <div style="font-size:2rem;margin-bottom:0.75rem;">⚠️</div>
        <p>Couldn't generate bundle right now. Please try again!</p>
      </div>`;
  }
}

function renderAIBundle(b) {
  const resultEl = document.getElementById('ai-result');
  const saved    = b.originalPrice - b.totalPrice;
  const savePct  = Math.round((saved / b.originalPrice) * 100);

  const rows = b.items.map(item => `
    <div class="bundle-item-row">
      <input type="checkbox" class="item-toggle" checked>
      <div class="item-icon">${item.emoji}</div>
      <div class="item-info">
        <div class="item-name">${item.name}</div>
        <div class="item-brand">${item.brand}</div>
      </div>
      <div class="item-price">₹${parseInt(item.price).toLocaleString('en-IN')}</div>
    </div>`).join('');

  const tags = (b.tags || [])
    .map(t => `<div class="item-chip">${t}</div>`)
    .join('');

  // Safely escape bundle name for onclick attribute
  const safeName = b.bundleName.replace(/'/g, "\\'");

  resultEl.innerHTML = `
    <div class="ai-result-header">
      <div style="font-size:3.5rem;margin-bottom:0.75rem;">${b.emoji}</div>
      <h2>${b.bundleName}</h2>
      <p>${b.description}</p>
      <div class="bundle-items" style="justify-content:center;margin-top:0.75rem;">${tags}</div>
    </div>

    <div class="items-list" style="margin-bottom:1.5rem;">
      <div class="items-list-header">
        AI-selected items (${b.items.length})
        <span>All chosen for your goal</span>
      </div>
      ${rows}
    </div>

    <div style="
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius: var(--radius);
      padding: 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      flex-wrap: wrap;
      gap: 1rem;
    ">
      <div>
        <div style="font-size:0.8rem;color:var(--text-muted);margin-bottom:4px;">Bundle total</div>
        <div style="font-size:1.8rem;font-weight:800;">₹${parseInt(b.totalPrice).toLocaleString('en-IN')}</div>
        <div style="font-size:0.85rem;color:var(--text-muted);">
          vs ₹${parseInt(b.originalPrice).toLocaleString('en-IN')} bought separately · You save ${savePct}%
        </div>
      </div>
      <div style="display:flex;gap:10px;flex-wrap:wrap;">
        <button class="btn-large btn-outline" onclick="showToast('Bundle saved! ✓')">
          Save Bundle
        </button>
        <button class="btn-large btn-accent"
          onclick="addAIBundle('${safeName}', ${b.totalPrice}, ${b.originalPrice}, '${b.emoji}')">
          Add to Cart →
        </button>
      </div>
    </div>`;
}
