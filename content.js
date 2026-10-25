/* Public rendering only. GitHub credentials never enter this page. */
(() => {
  const originalKeys = new Map();
  document.querySelectorAll('[data-copy]').forEach(el => originalKeys.set(el.textContent, el.dataset.copy));
  let current = null;
  const safeURL = value => {
    try { return ['https:', 'http:', 'mailto:', 'tel:'].includes(new URL(value, location.href).protocol); }
    catch { return false; }
  };
  function apply(data) {
    if (!data || data.version !== 1 || !data.fields) return;
    current = data;
    for (const [attribute, property] of [['data-copy','textContent'],['data-title','textContent'],['data-url','href'],['data-label','aria-label'],['data-meta','content'],['data-value','value']]) {
      document.querySelectorAll(`[${attribute}]`).forEach(el => {
        const field = data.fields[el.getAttribute(attribute)];
        if (!field || typeof field.value !== 'string') return;
        if (property === 'href' && !safeURL(field.value)) return;
        if (property === 'textContent') el.textContent = field.value;
        else if (property === 'value') el.value = field.value;
        else el.setAttribute(property, field.value);
      });
    }
    document.dispatchEvent(new CustomEvent('site:content'));
  }
  window.siteFieldValue = (key, fallback) => current?.fields[key]?.value ?? fallback;
  window.siteCopy = original => window.siteFieldValue(originalKeys.get(original), original);
  window.siteContentReady = fetch('content.json', {cache:'no-cache'})
    .then(r => { if (!r.ok) throw new Error('Content unavailable'); return r.json(); })
    .then(apply).catch(() => { /* Semantic HTML remains usable if content cannot load. */ });
  const preview = new URLSearchParams(location.search).get('preview') === '1' && parent !== window;
  if (preview) {
    document.documentElement.classList.add('editor-preview');
    window.addEventListener('message', event => {
      if (event.origin !== location.origin || event.source !== parent) return;
      if (event.data?.type === 'portfolio:preview') apply(event.data.content);
      if (event.data?.type === 'portfolio:highlight' && typeof event.data.key === 'string') {
        document.querySelectorAll('.editing-selected').forEach(el => el.classList.remove('editing-selected'));
        const el = Array.from(document.querySelectorAll('[data-copy],[data-url]')).find(el => el.dataset.copy === event.data.key || el.dataset.url === event.data.key);
        if (el) { el.classList.add('editing-selected'); el.closest('[hidden]')?.removeAttribute('hidden'); el.scrollIntoView({block:'center',behavior:'smooth'}); }
      }
    });
    document.addEventListener('click', event => {
      const el = event.target.closest('[data-copy],[data-url]');
      if (el) { event.preventDefault(); event.stopImmediatePropagation(); parent.postMessage({type:'portfolio:select',key:el.dataset.copy || el.dataset.url}, location.origin); }
      else if (event.target.closest('a')) event.preventDefault();
    }, true);
    window.siteContentReady.then(() => parent.postMessage({type:'portfolio:ready'}, location.origin));
  }
})();
