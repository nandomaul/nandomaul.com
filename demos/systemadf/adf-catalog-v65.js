/* Portfolio preview only: supplied catalog covers. No remote database writes. */
(()=>{
'use strict';
const covers={"3a98e7b8-3847-40b9-8d67-54f75d9e002e":"august-asset-official-store.png","463b1f88-c668-4d14-8b3e-20ebaa85ffc3":"828-realme-festival.png","6cacad59-ae04-463c-bb73-9226b09045ff":"september-official-store.png","8b3b65bd-79a9-4f3b-ba25-f58b7b963e96":"7-7-urgent-upload.png","a892140c-bbcb-41b4-831a-03e6624b9e4d":"october-assets.png","cb07a8a1-27f9-4282-8586-da506eac2141":"p4-series.png","e24c4652-53f3-4616-9a1e-b2439a864ddb":"realme-16-pro-5g-harry-potter-edition.png"};
const removed=new Set(["c265417d-3789-4aca-bd85-957f914721f9","de2cc7b5-7aee-436f-92c1-dc2d85f12331","e20be536-143d-485f-b934-723ea4f22f16"]);
const prefix='nando_adf_v40_table_',marker='nando-adf-catalog-v65',checkpoint='nando-adf-before-catalog-v65';
if(localStorage.getItem(marker))return;
const before=new Map(),changes=new Map();
function read(key,fallback){const value=localStorage.getItem(key);return value===null?fallback:JSON.parse(value)}
function write(key,value){before.set(key,localStorage.getItem(key));changes.set(key,JSON.stringify(value))}
try{
 const old=read(prefix+'catalogs',[]);
 if(!Array.isArray(old)||!old.length)throw Error('Catalog V43 belum dimuat.');
 const catalogs=old.filter(c=>!removed.has(c.id)).map(c=>{
  const file=covers[c.id];
  if(!file)return c;
  const url='/demos/systemadf/demo-v43/catalog-covers/'+file+'?v=65';
  return {...c,cover_path:url,cover_url:url};
 });
 const sections=read(prefix+'catalog_sections',[]).filter(s=>!removed.has(s.catalog_id));
 const removedSectionIds=new Set(read(prefix+'catalog_sections',[]).filter(s=>removed.has(s.catalog_id)).map(s=>s.id));
 const assets=read(prefix+'catalog_assets',[]).filter(a=>!removed.has(a.catalog_id)&&!removedSectionIds.has(a.section_id));
 write(prefix+'catalogs',catalogs);write(prefix+'catalog_sections',sections);write(prefix+'catalog_assets',assets);
 const order=(a,b)=>Number(a.sort_order||0)-Number(b.sort_order||0)||String(b.created_at||'').localeCompare(String(a.created_at||''));
 const cached=catalogs.slice().sort((a,b)=>Number(Boolean(b.is_pinned))-Number(Boolean(a.is_pinned))||order(a,b)).map(c=>({...c,cover_url:c.cover_path?.startsWith('/demos/systemadf/')?c.cover_path:c.cover_url||'',sections:sections.filter(s=>s.catalog_id===c.id).sort(order).map(s=>({...s,cover:s.cover_path||'',items:assets.filter(a=>a.section_id===s.id).sort(order)}))}));
 const snapshotKey='adf_catalog_snapshot_v1';
 const snapshot=read(snapshotKey,{});
 write(snapshotKey,{...snapshot,catalogs:cached});
 write(marker,{installed_at:new Date().toISOString(),revision:65,covers:catalogs.filter(c=>covers[c.id]).length});
 const hadCheckpoint=localStorage.getItem(checkpoint)!==null;
 if(!hadCheckpoint)localStorage.setItem(checkpoint,JSON.stringify({saved_at:new Date().toISOString(),entries:Object.fromEntries(before)}));
 const written=[];
 try{for(const[k,v]of changes){localStorage.setItem(k,v);written.push(k)}}
 catch(error){for(const k of written.reverse()){const previous=before.get(k);if(previous===null)localStorage.removeItem(k);else localStorage.setItem(k,previous)}if(!hadCheckpoint)localStorage.removeItem(checkpoint);throw error}
 window.NandoADFCatalogV65={covers:catalogs.filter(c=>covers[c.id]).length,removed:old.length-catalogs.length};
}catch(error){console.warn('Catalog cover update V65 skipped:',error.message)}
})();
