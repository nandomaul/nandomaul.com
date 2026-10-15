/* Portfolio demo privacy V79. Only loaded by the disconnected SystemADF copy. */
(() => {
  'use strict';
  if (window.NandoADFPrivacyV79) return;
  const ENTRY = '/demos/systemadf/index.html';
  if (location.pathname !== ENTRY && !document.querySelector('meta[name="adf-version"]')) return;
  const first = ['Arga', 'Nara', 'Elvan', 'Mira', 'Jovan', 'Avara', 'Sena', 'Liora', 'Revan', 'Aluna', 'Kian', 'Vanya', 'Ezra', 'Naira', 'Reno', 'Alea'];
  const last = ['Wisesa', 'Arunika', 'Mahesa', 'Pradipta', 'Kirana', 'Adiwangsa', 'Puspa', 'Samudra', 'Laksana', 'Anindya', 'Pramudya', 'Sasmita', 'Daniswara', 'Cakrawala', 'Aksara', 'Nusantara'];
  const aliases = new Set(first.flatMap(a => last.map(b => a + ' ' + b)));
  const neutral = /^(?:system(?: adf)?|admin(?: adf)?|content team|request team|portfolio preview|unknown|requester|team|local preview|preview|adf|akg|gmi|realme|akaso)$/i;
  const peopleKeys = /^(?:requester|requester_display_name|display_name|full_name|author_name|sender_name|creator_name|pic_name|person_name|actor)$/;
  const accessKeys = /^(?:drive_link|asset_link|link|link_url|linkUrl|post_url|content_url|contentUrl|external_url|download_url|document_url|href)$/;
  const contactKeys = /^(?:requester_email|email|phone|phone_number|mobile_number|address)$/;
  const workUrls = /(?:https?:)?\/\/(?:[\w.-]+\.)?(?:google\.com|googleusercontent\.com|tiktok\.com|instagram\.com|facebook\.com|youtu\.be|youtube\.com|wa\.me|whatsapp\.com)\/[^\s<>"'`\\)]*/gi;
  const names = new Map();
  function hash(value) { let n = 2166136261; for (const c of String(value).toLowerCase().trim()) { n ^= c.charCodeAt(0); n = Math.imul(n, 16777619); } return n >>> 0; }
  function alias(value) {
    const v = String(value || '').trim();
    if (!v || neutral.test(v) || aliases.has(v)) return v;
    const n = hash(v), result = first[n % first.length] + ' ' + last[(n >>> 8) % last.length];
    names.set(v, result);
    return result;
  }
  function plain(value) { if (!value || typeof value !== 'object') return false; const p = Object.getPrototypeOf(value); return p === Object.prototype || p === null; }
  function collect(value, depth = 0) {
    if (depth > 25 || !value || typeof value !== 'object') return;
    if (Array.isArray(value)) { value.forEach(x => collect(x, depth + 1)); return; }
    if (!plain(value)) return;
    for (const [key, v] of Object.entries(value)) {
      if (peopleKeys.test(key) && typeof v === 'string') alias(v);
      else if (v && typeof v === 'object') collect(v, depth + 1);
    }
  }
  function cleanText(value) {
    if (/^(?:data:|blob:)/i.test(value)) return value;
    let result = value.replace(workUrls, '');
    if (/^[\[{]/.test(result.trim()) && result.length < 8 * 1024 * 1024) {
      try { const data = JSON.parse(result); if (data && typeof data === 'object') return JSON.stringify(sanitize(data)); } catch { /* Ordinary text, not serialized data. */ }
    }
    for (const [name, replacement] of names) {
      if (!result.includes(name)) continue;
      const escaped = name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      result = result.replace(new RegExp('(^|[^\\p{L}\\p{N}_])' + escaped + '(?=$|[^\\p{L}\\p{N}_])', 'gu'), '$1' + replacement);
    }
    return result;
  }
  function clean(value, context = '', depth = 0) {
    if (depth > 30) return value;
    if (typeof value === 'string') return cleanText(value);
    if (Array.isArray(value)) return value.map(v => clean(v, context, depth + 1));
    if (!plain(value)) return value;
    const result = {};
    const person = value.requester_display_name || value.requester || value.requester_profile?.display_name;
    for (const [key, v] of Object.entries(value)) {
      if (accessKeys.test(key)) result[key] = typeof v === 'string' ? '' : clean(v, context + '.' + key, depth + 1);
      else if (contactKeys.test(key) && typeof v === 'string') result[key] = '';
      else if (peopleKeys.test(key) && typeof v === 'string') result[key] = alias(v);
      else if (key === 'url' && /catalog_assets|content_social_posts|social_posts|\.trashItems/i.test(context)) result[key] = '';
      else result[key] = clean(v, context + '.' + key, depth + 1);
    }
    if (person) {
      const display = alias(person);
      for (const key of ['requester', 'requester_display_name']) if (key in value) result[key] = display;
      if (plain(result.requester_profile)) result.requester_profile = { ...result.requester_profile, display_name: display, email: '' };
    }
    return result;
  }
  function sanitize(value, context = '') { collect(value); return clean(value, context); }
  function scopedKey(key) { return /^(?:nando_adf_v40_table_|nando-adf-(?:before|catalog)|adf_|systemadf-request-drafts-)/.test(String(key)); }
  const serializedCache = new Map();
  function serialized(key, value) {
    const text = String(value);
    if (!scopedKey(key)) return text;
    const cached = serializedCache.get(String(key));
    if (cached?.source === text || cached?.output === text) return cached.output;
    let output;
    try { output = JSON.stringify(sanitize(JSON.parse(text), String(key))); }
    catch { output = cleanText(text); }
    serializedCache.set(String(key), { source: text, output });
    return output;
  }

  // Migrate only this demo's rows and snapshots. Navigation state and other apps' caches stay independent.
  let storage;
  try { storage = window.localStorage; } catch { /* Private browsing can block storage. */ }
  const nativeGet = Storage.prototype.getItem, nativeSet = Storage.prototype.setItem;
  if (storage) {
    const keys = Array.from({ length: storage.length }, (_, i) => storage.key(i)).filter(scopedKey);
    for (const key of keys) { try { collect(JSON.parse(nativeGet.call(storage, key))); } catch { /* Non-JSON marker. */ } }
    for (const key of keys) {
      try { const old = nativeGet.call(storage, key), next = serialized(key, old); if (next !== old) nativeSet.call(storage, key, next); } catch { /* Reads below still sanitize if the quota is exhausted. */ }
    }
  }
  Storage.prototype.getItem = function (key) {
    const value = nativeGet.call(this, key);
    return this === storage && value !== null && scopedKey(key) ? serialized(key, value) : value;
  };
  Storage.prototype.setItem = function (key, value) {
    return nativeSet.call(this, key, this === storage && scopedKey(key) ? serialized(key, value) : value);
  };

  // Preserve uploaded images, Blobs, layout dimensions and editor state when cleaning workspace metadata.
  if (typeof IDBObjectStore !== 'undefined') {
    for (const method of ['put', 'add']) {
      const native = IDBObjectStore.prototype[method];
      IDBObjectStore.prototype[method] = function (value, ...keys) {
        const own = this.transaction.db.name === 'systemadf-content-workspace' && this.name === 'workspace';
        return native.call(this, own ? sanitize(value, 'workspace') : value, ...keys);
      };
    }
  }
  function migrateWorkspace() {
    if (typeof indexedDB === 'undefined' || !indexedDB.databases) return Promise.resolve();
    return indexedDB.databases().then(list => {
      if (!list.some(x => x.name === 'systemadf-content-workspace')) return;
      return new Promise(resolve => {
        const request = indexedDB.open('systemadf-content-workspace');
        request.onerror = request.onblocked = () => resolve();
        request.onsuccess = () => {
          const db = request.result;
          if (!db.objectStoreNames.contains('workspace')) { db.close(); resolve(); return; }
          const tx = db.transaction('workspace', 'readwrite'), cursor = tx.objectStore('workspace').openCursor();
          cursor.onsuccess = () => { const row = cursor.result; if (!row) return; row.update(sanitize(row.value, 'workspace')); row.continue(); };
          tx.oncomplete = tx.onerror = tx.onabort = () => { db.close(); resolve(); };
        };
      });
    }).catch(() => {});
  }

  const outputs = new Set();
  const nativeObjectUrl = URL.createObjectURL;
  URL.createObjectURL = function (value) { const url = nativeObjectUrl.call(this, value); outputs.add(url); return url; };
  const nativeRevokeUrl = URL.revokeObjectURL;
  URL.revokeObjectURL = function (url) { outputs.delete(String(url)); return nativeRevokeUrl.call(this, url); };
  function builder() {
    const route = String(location.hash || '').slice(1).split('?')[0].replace(/\/$/, '');
    if (!/^\/content-marketing(?:\/|$)/.test(route)) return false;
    const title = document.querySelector('.adf-screen-header h1')?.textContent?.trim() || '';
    return /^(?:Build Cover Content|Manage Assets|Calendar Content)$/.test(title);
  }
  function generated(url) { return builder() && (outputs.has(String(url)) || /^data:image\/(?:png|jpe?g|webp);/i.test(String(url))); }
  function internal(url) {
    try { const next = new URL(String(url), location.href); return next.origin === location.origin && next.pathname === ENTRY && (!next.hash || /^#\/(?!\/)/.test(next.hash)); }
    catch { return false; }
  }
  function stop(event) { event.preventDefault(); event.stopImmediatePropagation(); }
  function blockAccess(event) {
    const target = event.target?.closest?.('a,button,[role="button"]');
    if (!target) return;
    if (target.matches('a')) {
      const href = target.getAttribute('href');
      if (target.hasAttribute('download') && generated(target.href)) return;
      if (href === null) return;
      if (href === '' || (href === '#' && target.target === '_blank')) { stop(event); return; }
      if (href === '#') { event.preventDefault(); return; }
      if (internal(href) && !target.hasAttribute('download')) return;
      stop(event); return;
    }
    const label = [target.getAttribute('aria-label'), target.getAttribute('title'), target.textContent].filter(Boolean).join(' ');
    if ((!builder() && /download|unduh|go to content|buka konten|open drive|open folder|continue.*(?:open|download)/i.test(label)) || /go to content|buka konten|open drive/i.test(label)) stop(event);
  }
  for (const type of ['click', 'auxclick']) document.addEventListener(type, blockAccess, true);
  document.addEventListener('submit', event => { const action = event.target?.getAttribute?.('action'); if (action && !internal(action)) stop(event); }, true);
  const nativeOpen = window.open;
  window.open = function (url, ...args) {
    if ((url && internal(url)) || generated(url) || ((!url || url === 'about:blank') && builder())) return nativeOpen.call(this, url, ...args);
    return null;
  };
  window.NandoADFPrivacyV79 = Object.freeze({ version: 79, sanitize, alias, workspaceReady: migrateWorkspace() });
})();
