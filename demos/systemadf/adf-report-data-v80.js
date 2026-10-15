/* Portfolio demo only. Fictional full-year records, including future months.
 * No network, Supabase writes, real content links, or uploaded artwork changes.
 */
(function () {
  'use strict';
  const PREFIX = 'nando_adf_v40_table_';
  const MARKER = 'nando-adf-report-v80';
  const REVISION = '80.1';
  const METRICS = ['views', 'likes', 'comments', 'shares', 'saves', 'engagement', 'net_follows'];
  const pad = n => String(n).padStart(2, '0');
  const generated = id => /^(?:demo-v(?:41|42|80)-post-|demo-post-launch$)/.test(String(id || ''));
  function hash(value) {
    let h = 2166136261;
    for (const c of value) h = Math.imul(h ^ c.charCodeAt(0), 16777619);
    return (h >>> 0) / 4294967296;
  }
  function buildData(accounts, year, extraMonth = '') {
    const posts = [], metrics = [];
    const targets = [860000, 940000, 1040000, 1120000, 1230000, 1340000,
      1460000, 1570000, 1690000, 1810000, 1940000, 2080000];
    const campaigns = ['Fresh start', 'Everyday stories', 'Creator essentials', 'Product discovery',
      'Community stories', 'Midyear highlights', 'Creative routines', 'Outdoor moments',
      'Product in action', 'Creator spotlight', 'Community favourites', 'Year-end highlights'];
    const months = Array.from({ length: 12 }, (_, i) => `${year}-${pad(i + 1)}`);
    if (/^\d{4}-(?:0[1-9]|1[0-2])$/.test(extraMonth) && !months.includes(extraMonth)) months.push(extraMonth);
    for (const month of months) {
      const [y, m] = month.split('-').map(Number);
      const days = new Date(Date.UTC(y, m, 0)).getUTCDate();
      const accountWeights = accounts.map((_, i) => [24, 23, 17, 15, 12, 9][i] || 8);
      const totalWeight = accountWeights.reduce((s, x) => s + x, 0);
      accounts.forEach((account, a) => {
        const target = Math.round(targets[m - 1] * accountWeights[a] / totalWeight);
        const weights = Array.from({ length: days }, (_, d) => 0.8 + hash(`${month}:${a}:${d}`) * 0.4);
        const weightTotal = weights.reduce((s, x) => s + x, 0);
        let allocated = 0;
        weights.forEach((weight, d) => {
          const day = `${month}-${pad(d + 1)}`;
          const id = `demo-v80-post-${day}-${a}`;
          const views = d === days - 1 ? target - allocated : Math.round(target * weight / weightTotal);
          allocated += views;
          const variation = 0.85 + hash(id + ':interaction') * 0.3;
          const likes = Math.round(views * (a % 2 ? 0.055 : 0.041) * variation);
          const comments = Math.round(views * 0.0025 * variation);
          const shares = Math.round(views * 0.006 * variation);
          const saves = Math.round(views * 0.008 * variation);
          const final = { views, likes, comments, shares, saves,
            engagement: likes + comments + shares + saves, net_follows: Math.round(views * 0.0018 * variation) };
          posts.push({ id, account_id: account.id,
            title: `${String(account.brand).toUpperCase()} · ${campaigns[m - 1]} ${pad(d + 1)}`,
            published_on: day, url: '', format: a % 2 ? 'Video' : d % 3 ? 'Reel' : 'Carousel' });
          const baseline = Object.fromEntries(METRICS.map(k => [k, Math.round(final[k] * 0.4)]));
          baseline.engagement = baseline.likes + baseline.comments + baseline.shares + baseline.saves;
          metrics.push({ id: `${id}-a`, post_id: id, captured_at: `${day}T10:00:00.000Z`, ...baseline },
            { id: `${id}-b`, post_id: id, captured_at: `${day}T18:00:00.000Z`, ...final });
        });
      });
    }
    return { posts, metrics };
  }
  function install(storage, now = new Date()) {
    const read = key => {
      const rows = JSON.parse(storage.getItem(PREFIX + key) || '[]');
      if (!Array.isArray(rows)) throw Error('Invalid local demo table: ' + key);
      return rows;
    };
    const accounts = read('content_social_accounts')
      .filter(a => /^demo-v41-account-\d+$/.test(a.id || '') && typeof a.brand === 'string')
      .sort((a, b) => a.id.localeCompare(b.id));
    if (accounts.length !== 6 || new Set(accounts.map(a => a.id)).size !== 6)
      throw Error('Expected six portfolio demo accounts; report data was not changed.');
    const year = now.getFullYear();
    const insightMonth = typeof window !== 'undefined' ? window.NandoADFMonthV42 || '' : '';
    const extraMonth = insightMonth && !insightMonth.startsWith(String(year) + '-') ? insightMonth : '';
    const signature = JSON.stringify({ revision: REVISION, year, extraMonth, accounts: accounts.map(a => [a.id, a.brand]) });
    const oldMarker = storage.getItem(MARKER);
    const postKey = PREFIX + 'content_social_posts', metricKey = PREFIX + 'content_social_metrics';
    if (oldMarker === signature && (storage.getItem(postKey) || '').length > 2 && (storage.getItem(metricKey) || '').length > 2)
      return { status: 'ready', year, reused: true };
    const oldPosts = storage.getItem(postKey), oldMetrics = storage.getItem(metricKey);
    const savedPosts = read('content_social_posts'), savedMetrics = read('content_social_metrics');
    const generatedIds = new Set(savedPosts.filter(p => generated(p.id)).map(p => p.id));
    const sample = buildData(accounts, year, extraMonth);
    const nextPosts = JSON.stringify([...savedPosts.filter(p => !generated(p.id)), ...sample.posts]);
    const nextMetrics = JSON.stringify([...savedMetrics.filter(m => !generated(m.post_id) && !generatedIds.has(m.post_id)), ...sample.metrics]);
    const changes = [[postKey, oldPosts, nextPosts], [metricKey, oldMetrics, nextMetrics], [MARKER, oldMarker, signature]];
    const done = [];
    try {
      for (const [key, before, after] of changes) {
        storage.setItem(key, after);
        done.push([key, before]);
      }
    } catch (error) {
      for (const [key, before] of done.reverse()) {
        if (before === null) storage.removeItem(key); else storage.setItem(key, before);
      }
      throw error;
    }
    return { status: 'ready', year, reused: false, posts: sample.posts.length,
      snapshots: sample.metrics.length, bytes: nextPosts.length + nextMetrics.length };
  }
  if (typeof module === 'object' && module.exports) {
    module.exports = { buildData, install, METRICS };
    return;
  }
  try {
    window.NandoADFReportV80 = install(window.localStorage);
  } catch (error) {
    window.NandoADFReportV80 = { status: 'error', message: error.message };
    console.warn('ADF report demo: previous data retained.', error.message);
  }
})();
