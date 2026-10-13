/* GakNyampe static export route repair V65 */
(()=>{
 if(window.__gakRoutesV65)return;window.__gakRoutesV65=true;
 function staticUrlV65(value) {
  if (!value) return null;
  try {
    const origin = typeof window === "undefined" ? "http://portfolio.local" : window.location.origin;
    const url = new URL(value, origin);
    if (url.origin !== origin || !url.pathname.startsWith("/demos/gaknyampe/")) return null;
    const exact = {"+not-found":"+not-found.html","_sitemap":"_sitemap.html","aktifitas":"aktifitas.html","aktivitas":"aktivitas.html","checkout":"checkout.html","games/blok-nebeng":"games/blok-nebeng.html","games/capit-tanding":"games/capit-tanding.html","games/nebeng-dulu":"games/nebeng-dulu.html","games/oyen-nebeng":"games/oyen-nebeng.html","":"index.html","isi-saldo":"isi-saldo.html","jelajah":"jelajah.html","keranjang":"keranjang.html","makan-nanti":"makan-nanti.html","nebeng-dulu":"nebeng-dulu.html","notifikasi":"notifikasi.html","profile":"profile.html","scan":"scan.html","semua-aja":"semua-aja.html","tracking":"tracking.html","traktir":"traktir.html"};
    const dynamic = [{"route":"restoran/[id]","file":"restoran/[id].html"}];
    let route = decodeURIComponent(url.pathname.slice("/demos/gaknyampe/".length)).replace(/\/$/, "");
    if (url.pathname.endsWith(".html")) return url.pathname + url.search + url.hash;
    if (Object.prototype.hasOwnProperty.call(exact, route)) {
      url.pathname = "/demos/gaknyampe/" + exact[route];
    } else {
      for (const item of dynamic) {
        const parts = route.split("/"), pattern = item.route.split("/");
        if (parts.length !== pattern.length || !pattern.every((part, i) => part.startsWith("[") ? Boolean(parts[i]) : part === parts[i])) continue;
        url.pathname = "/demos/gaknyampe/" + item.file;
        url.searchParams.set("__gnRouteV65", route);
        break;
      }
    }
    return url.pathname + url.search + url.hash;
  } catch { return null; }
}
 const base="/demos/gaknyampe/";
 const current=new URL(location.href);
 const intended=current.searchParams.get('__gnRouteV65');
 if(intended&&/^restoran\/[^/]+$/.test(intended)){
  current.pathname=base+intended;
  current.searchParams.delete('__gnRouteV65');
 }else if(current.pathname.startsWith(base)&&current.pathname.endsWith('.html')){
  current.pathname=current.pathname.endsWith('/index.html')?current.pathname.slice(0,-10):current.pathname.slice(0,-5);
 }
 const initial=current.pathname+current.search+current.hash;
 if(initial!==location.pathname+location.search+location.hash)history.replaceState(history.state,'',initial);
 const report=()=>{
  if(parent===window)return;
  const href=staticUrlV65(location.href);
  if(href)parent.postMessage({type:'portfolio-route',href},location.origin);
 };
 for(const method of ['pushState','replaceState']){
  const native=history[method].bind(history);
  history[method]=function(state,title,url){const result=native(state,title,url);report();return result};
 }
 addEventListener('popstate',report);addEventListener('hashchange',report);
 addEventListener('DOMContentLoaded',report,{once:true});
})();
