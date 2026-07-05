// Simple localStorage-backed subscriptions prototype
(function(){
  function getSubscriptions(){
    try { return JSON.parse(localStorage.getItem('bb_subscriptions')||'[]'); } catch { return []; }
  }
  function saveSubscriptions(s){ localStorage.setItem('bb_subscriptions', JSON.stringify(s)); }

  function openSubscribeModal(bundleId, bundleTitle){
    const modal = document.getElementById('subscribe-modal');
    modal.querySelector('#subscribe-bundle-title').textContent = bundleTitle;
    modal.dataset.bundleId = bundleId;
    modal.classList.add('open');
  }

  function closeSubscribeModal(){
    document.getElementById('subscribe-modal').classList.remove('open');
  }

  function subscribeNow(){
    const modal = document.getElementById('subscribe-modal');
    const bundleId = modal.dataset.bundleId;
    const cadence = modal.querySelector('input[name="cadence"]:checked').value;
    const subs = getSubscriptions();
    subs.push({ id: bundleId, cadence, createdAt: Date.now() });
    saveSubscriptions(subs);
    showToast('Subscribed — we will ship this on your cadence.');
    closeSubscribeModal();
    renderSubscriptionCount();
  }

  function renderSubscriptionCount(){
    const count = getSubscriptions().length;
    const el = document.getElementById('subscription-count');
    if(el) el.textContent = count;
  }

  function showToast(msg){
    const t = document.getElementById('toast');
    if(!t) return alert(msg);
    t.textContent = msg;
    t.style.opacity = 1;
    setTimeout(()=>{ t.style.opacity = 0; }, 3000);
  }

  window.BundleSubs = {
    openSubscribeModal,
    subscribeNow,
    closeSubscribeModal,
    getSubscriptions,
    renderSubscriptionCount
  };

  document.addEventListener('DOMContentLoaded', ()=>{
    const modal = document.getElementById('subscribe-modal');
    if(modal) modal.querySelector('.close').addEventListener('click', closeSubscribeModal);
    renderSubscriptionCount();
  });

})();
