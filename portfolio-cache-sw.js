/* V33: versioned PUBLIC asset cache. No API, form, auth, or user data caching. */
const PREFIX = 'nm-public-v33-', MAX_BYTES = 256 * 1024 * 1024;
let manifestPromise, job, foreground = 0, foregroundAt = 0, cacheBytes = 0;
const devClients = new Set();
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
async function manifest() {
  if (!manifestPromise) manifestPromise = fetch('/portfolio-cache-manifest.json', {cache:'no-store', credentials:'omit'})
    .then(async response => {
      if (!response.ok) throw Error('Cache manifest unavailable');
      const data = await response.json();
      if (!/^[a-f0-9]{16}$/.test(data.version) || !Array.isArray(data.assets)) throw Error('Invalid cache manifest');
      const entries = new Map();
      for (const item of data.assets) {
        if (!item || typeof item.path !== 'string' || !item.path.startsWith('/') || item.path.startsWith('//') || /[?#\\]/.test(item.path) || item.path.includes('/..') || !Number.isFinite(item.bytes) || item.bytes < 0) continue;
        entries.set(item.path, item);
      }
      const name = PREFIX + data.version, existing = await caches.open(name);
      const keys = await existing.keys();
      cacheBytes = keys.reduce((total,key) => total+(entries.get(new URL(key.url).pathname)?.bytes??0),0);
      return {name,version:data.version,entries};
    }).catch(error => {manifestPromise=null;throw error;});
  return manifestPromise;
}
function assetFor(url,data) {
  if (url.origin!==self.location.origin || !/^https?:$/.test(url.protocol))return null;
  return data.entries.get(url.pathname)??(url.pathname.endsWith('/')?data.entries.get(url.pathname+'index.html'):null);
}
function validResponse(response) {
  return response.ok && response.status===200 && response.type!=='opaque' && !/private|no-store/i.test(response.headers.get('cache-control')||'');
}
async function save(cache,entry,response) {
  if(!validResponse(response)||cacheBytes+entry.bytes>MAX_BYTES)return;
  const key=new URL(entry.path,self.location.origin).href;
  if(!await cache.match(key)){await cache.put(key,response.clone());cacheBytes+=entry.bytes;}
}
self.addEventListener('install',event=>event.waitUntil(self.skipWaiting()));
self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    await self.clients.claim();
    try {
      const data=await manifest();
      // Keep one previous version for existing tabs; never touch other apps' caches.
      const names=(await caches.keys()).filter(name=>name.startsWith(PREFIX)&&name!==data.name);
      for(const name of names.slice(0,Math.max(0,names.length-1)))await caches.delete(name);
    }catch{}
  })());
});
self.addEventListener('fetch',event=>{
  const request=event.request,url=new URL(request.url);
  if(request.method!=='GET'||url.origin!==self.location.origin||request.headers.has('authorization')||url.pathname==='/portfolio-cache-manifest.json'||url.pathname==='/portfolio-cache-sw.js')return;
  if(devClients.has(event.clientId)){event.respondWith(fetch(request,{cache:'no-store'}));return;}
  event.respondWith((async()=>{
    let data;
    try{data=await manifest();}catch{return fetch(request);}
    const entry=assetFor(url,data);
    if(!entry){
      // Previously deployed hashed bundles can still serve an already-open tab.
      if(url.pathname.startsWith('/_next/static/')&&/\.(js|css|woff2?)$/.test(url.pathname)){
        for(const name of (await caches.keys()).filter(name=>name.startsWith(PREFIX))){
          const held=await (await caches.open(name)).match(url.origin+url.pathname);
          if(held)return held;
        }
      }
      return fetch(request); // Homepage HTML and all API endpoints remain network-only.
    }
    const cache=await caches.open(data.name),key=new URL(entry.path,self.location.origin).href;
    const cached=await cache.match(key);
    if(cached&&!['reload','no-store'].includes(request.cache))return cached;
    foreground++;foregroundAt=Date.now();
    try {
      const response=await fetch(request,{cache:'reload'});
      if(request.cache!=='no-store'){
        if(cached&&validResponse(response)){await cache.delete(key);cacheBytes-=entry.bytes;}
        await save(cache,entry,response);
      }
      return response;
    }catch(error){if(cached)return cached;throw error;}
    finally{foreground--;foregroundAt=Date.now();}
  })());
});
async function report(status) {
  for(const client of await self.clients.matchAll({type:'window',includeUncontrolled:true}))client.postMessage({type:'nm-cache-progress-v33',...status});
}
async function warm(paths) {
  const data=await manifest(),cache=await caches.open(data.name);
  const prefixes=paths.map(raw=>{
    try{const url=new URL(raw,self.location.origin);return url.origin===self.location.origin?url.pathname.replace(/[^/]*$/,''):null;}catch{return null;}
  }).filter(Boolean);
  const score=item=>(prefixes.some(prefix=>item.path.startsWith(prefix))?0:10)+item.priority;
  const entries=[...data.entries.values()].sort((a,b)=>score(a)-score(b)||a.bytes-b.bytes||a.path.localeCompare(b.path));
  let ready=0,failed=0,deferred=0;
  await report({ready,failed,deferred,total:entries.length,done:false,version:data.version});
  for(const entry of entries){
    const key=new URL(entry.path,self.location.origin).href;
    if(await cache.match(key)){ready++;continue;}
    if(cacheBytes+entry.bytes>MAX_BYTES){deferred++;continue;}
    while(foreground>0||Date.now()-foregroundAt<350)await sleep(120);
    try {
      const estimate=await self.navigator.storage?.estimate?.();
      if(estimate?.quota&&estimate.usage&&estimate.quota-estimate.usage<entry.bytes+8*1024*1024){deferred++;continue;}
      const controller=new AbortController(),timer=setTimeout(()=>controller.abort(),20000);
      try{
        const response=await fetch(key,{credentials:'omit',cache:'reload',signal:controller.signal});
        if(!validResponse(response)){failed++;continue;}
        await save(cache,entry,response);
        if(await cache.match(key))ready++;else deferred++;
      }finally{clearTimeout(timer);}
    }catch{failed++;}
    if((ready+failed+deferred)%12===0)await report({ready,failed,deferred,total:entries.length,done:false,version:data.version});
    await sleep(70);
  }
  await report({ready,failed,deferred,total:entries.length,done:true,version:data.version});
}
self.addEventListener('message',event=>{
  if(event.data?.type==='nm-dev-bypass-v33'&&event.source?.id){devClients.add(event.source.id);return;}
  if(event.data?.type!=='nm-warm-public-v33'||!Array.isArray(event.data.urls))return;
  if(!job)job=warm(event.data.urls.filter(value=>typeof value==='string').slice(0,30)).catch(()=>report({done:true,unavailable:true})).finally(()=>{job=null;});
  event.waitUntil(job);
});
