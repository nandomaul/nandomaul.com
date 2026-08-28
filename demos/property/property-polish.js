(function(){
  document.documentElement.style.minHeight='100%';
  document.documentElement.style.margin='0';
  document.addEventListener('DOMContentLoaded',()=>{document.body.style.minHeight='100%';document.body.style.margin='0';const root=document.getElementById('root');if(root)root.style.minHeight='100%'},{once:true});
  const adminPath=/\/demos\/property\/admin(?:\/|$)/.test(location.pathname);
  const icon=(name)=>({
    Overview:'<svg viewBox="0 0 24 24"><path d="M4 19V9m5 10V5m5 14v-7m5 7V3"/></svg>',
    Leads:'<svg viewBox="0 0 24 24"><circle cx="9" cy="8" r="3"/><path d="M3 20v-2c0-3 2-5 6-5s6 2 6 5v2M16 6a3 3 0 0 1 0 6m2 2c2 .7 3 2.2 3 4v2"/></svg>',
    Projects:'<svg viewBox="0 0 24 24"><path d="M4 20V7h6V4h6v6h4v10zM8 11h1m3 0h1m3 3h1M8 15h1m3 0h1"/></svg>',
    Property:'<svg viewBox="0 0 24 24"><path d="m3 11 9-7 9 7v9H3zM9 20v-6h6v6"/></svg>'
  }[name]);
  const seed=[
    {id:'LD-2608-041',name:'Alya Ramadhani',phone:'0812 4401 9821',source:'Instagram',status:'Lead Baru',project:'Pesona Bunga Cibatok'},
    {id:'LD-2608-038',name:'Rizky Fadillah',phone:'0821 7319 2250',source:'Website',status:'Diproses',project:'Pesona Bunga Cibatok'},
    {id:'LD-2608-031',name:'Dinda Permata',phone:'0857 2209 1148',source:'WhatsApp',status:'Survey',project:'Pesona Bunga Cibatok'},
    {id:'LD-2608-026',name:'Fajar Nugraha',phone:'0813 9082 4470',source:'Referral',status:'Booking',project:'Pesona Bunga Cibatok'},
    {id:'LD-2608-019',name:'Maya Lestari',phone:'0819 6140 3285',source:'TikTok',status:'Diproses',project:'Pesona Bunga Cibatok'}
  ];
  let leads=(()=>{try{return JSON.parse(localStorage.getItem('property_sales_leads_v2'))||seed}catch{return seed}})();
  let view='Overview';
  let query='';
  let filter='Semua';
  const nextStatus={'Lead Baru':'Diproses','Diproses':'Survey','Survey':'Booking','Booking':'Lead Baru'};
  const save=()=>{try{localStorage.setItem('property_sales_leads_v2',JSON.stringify(leads))}catch{}};
  const esc=(s)=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const stats=()=>[
    ['Total leads',leads.length,'+12% this month'],['New today',leads.filter(x=>x.status==='Lead Baru').length,'Fresh opportunities'],['Survey',leads.filter(x=>x.status==='Survey').length,'Visits scheduled'],['Booking',leads.filter(x=>x.status==='Booking').length,'Ready for handoff']
  ];
  const statCards=()=>`<div class="ps-grid ps-stats">${stats().map(x=>`<article class="ps-card ps-stat"><span>${x[0]}</span><strong>${x[1]}</strong><em>${x[2]}</em></article>`).join('')}</div>`;
  function leadTable(limit){
    const list=leads.filter(x=>(filter==='Semua'||x.status===filter)&&`${x.name} ${x.phone} ${x.id}`.toLowerCase().includes(query.toLowerCase())).slice(0,limit||99);
    return `<section class="ps-card ps-list"><div class="ps-card-head"><h2>${view==='Overview'?'Recent leads':'Lead pipeline'}</h2><span>${list.length} records</span></div>${view==='Leads'?`<div class="ps-table-tools"><label class="ps-search">⌕<input id="ps-search" value="${esc(query)}" placeholder="Search name, phone, or lead code"></label><select id="ps-filter">${['Semua','Lead Baru','Diproses','Survey','Booking'].map(x=>`<option ${x===filter?'selected':''}>${x}</option>`).join('')}</select></div>`:''}<div class="ps-table-wrap"><table class="ps-table"><thead><tr><th>Buyer</th><th>Project</th><th>Source</th><th>Status</th><th>Action</th></tr></thead><tbody>${list.map(x=>`<tr><td><strong>${x.name}</strong><small>${x.id} · ${x.phone}</small></td><td>${x.project}</td><td>${x.source}</td><td><span class="ps-pill">${x.status}</span></td><td><div class="ps-actions"><button data-next="${x.id}">Next status</button><button class="primary" data-pdf="${x.id}">PDF</button></div></td></tr>`).join('')}</tbody></table></div></section>`;
  }
  function overview(){return `${statCards()}<div class="ps-grid ps-overview"><section class="ps-card"><div class="ps-card-head"><h2>Lead growth</h2><span>Qualified enquiries · 14 days</span></div><div class="ps-chart"><svg viewBox="0 0 620 220" preserveAspectRatio="xMidYMid meet"><defs><linearGradient id="psArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8293a5" stop-opacity=".25"/><stop offset="1" stop-color="#8293a5" stop-opacity="0"/></linearGradient></defs><path class="grid" d="M10 35H610M10 90H610M10 145H610M10 200H610"/><path class="area" d="M10 185L105 148L200 158L295 98L390 119L485 59L610 34L610 210L10 210Z"/><path class="line" d="M10 185L105 148L200 158L295 98L390 119L485 59L610 34"/>${[[10,185],[105,148],[200,158],[295,98],[390,119],[485,59],[610,34]].map((p,i)=>`<circle class="dot" style="--dot-delay:${i*70}ms" cx="${p[0]}" cy="${p[1]}" r="4"/>`).join('')}</svg><div class="ps-chart-labels"><span>07 Aug</span><span>13 Aug</span><span>20 Aug</span></div></div></section><section class="ps-card"><div class="ps-card-head"><h2>Pipeline</h2><span>Current stages</span></div><div class="ps-pipeline">${[['Lead Baru','72%'],['Diproses','58%'],['Survey','34%'],['Booking','18%']].map((x,i)=>`<div style="--bar-delay:${i*90}ms"><span>${x[0]}</span><i style="--w:${x[1]}"></i><b>${leads.filter(y=>y.status===x[0]).length}</b></div>`).join('')}</div></section></div>${leadTable(4)}`}
  function leadView(){return `${statCards()}${leadTable()}`}
  function projects(){const rows=[['Pesona Bunga Cibatok','Active sales campaign','74%','42 qualified leads'],['Cibatok Phase II','Launch preparation','48%','Creative in review'],['Mountain View Cluster','Research & pricing','26%','Market validation']];return `<div class="ps-grid ps-content-grid">${rows.map(x=>`<article class="ps-card ps-project"><header><div><p class="ps-eyebrow">Residential project</p><h3>${x[0]}</h3></div><span class="ps-pill">Active</span></header><p>${x[1]}. Track campaign readiness, enquiry quality, and sales handoff in one place.</p><div class="ps-progress"><i style="--w:${x[2]}"></i></div><footer><span>${x[2]} complete</span><strong>${x[3]}</strong></footer></article>`).join('')}</div>`}
  function properties(){const rows=[['Type 27/60','Rp185.000.000','12 units'],['Type 30/72','Rp214.000.000','8 units'],['Corner Type 30/84','Rp238.000.000','3 units']];return `<div class="ps-grid ps-content-grid">${rows.map((x,i)=>`<article class="ps-card ps-property"><div class="ps-house"></div><header><div><p class="ps-eyebrow">${i?'Phase II':'Pesona Bunga Cibatok'}</p><h3>${x[0]}</h3></div><span class="ps-pill">${x[2]}</span></header><p>Modern compact home with efficient layout, natural light, carport, and garden.</p><div class="ps-progress"><i style="--w:${[62,45,25][i]}%"></i></div><footer><strong>${x[1]}</strong><span>Available inventory</span></footer></article>`).join('')}</div>`}
  function mainContent(){return view==='Overview'?overview():view==='Leads'?leadView():view==='Projects'?projects():properties()}
  function render(){
    const root=document.getElementById('root');if(!root)return;
    root.innerHTML=`<div class="ps-admin"><div class="ps-shell"><aside class="ps-side"><nav class="ps-nav">${['Overview','Leads','Projects','Property'].map(x=>`<button data-view="${x}" class="${x===view?'active':''}">${icon(x)}<span>${x}</span></button>`).join('')}</nav></aside><main class="ps-main"><header class="ps-top"><div><p class="ps-eyebrow">Sales intelligence</p><h1>${{Overview:'A clearer view of every opportunity.',Leads:'Leads that can be acted on.',Projects:'Projects moving forward.',Property:'Inventory ready to sell.'}[view]}</h1></div><span class="ps-date">20 AUG 2026</span></header><div class="ps-fade">${mainContent()}</div></main></div></div>`;
    root.querySelectorAll('[data-view]').forEach(b=>b.addEventListener('click',()=>{view=b.dataset.view;render()}));
    root.querySelectorAll('[data-next]').forEach(b=>b.addEventListener('click',()=>{leads=leads.map(x=>x.id===b.dataset.next?{...x,status:nextStatus[x.status]}:x);save();render()}));
    root.querySelectorAll('[data-pdf]').forEach(b=>b.addEventListener('click',()=>downloadPdf(leads.find(x=>x.id===b.dataset.pdf))));
    root.querySelector('#ps-search')?.addEventListener('input',e=>{query=e.target.value;const pos=e.target.selectionStart;render();const n=document.querySelector('#ps-search');n?.focus();n?.setSelectionRange(pos,pos)});
    root.querySelector('#ps-filter')?.addEventListener('change',e=>{filter=e.target.value;render()});
  }
  function downloadPdf(lead){
    if(!lead)return;
    const lines=['NUSANTARA LIVING','BUYER INTEREST FORM','Reference: '+lead.id,'','Buyer: '+lead.name,'Phone: '+lead.phone,'Project: '+lead.project,'Source: '+lead.source,'Status: '+lead.status,'','Property: Type 27 / 60','Indicative price: Rp185.000.000','Booking fee: Rp500.000','','Prepared by: Sales Operations','Date: 20 August 2026'];
    const safe=s=>String(s).replace(/\\/g,'\\\\').replace(/\(/g,'\\(').replace(/\)/g,'\\)');
    const stream=['BT','/F1 18 Tf','72 790 Td',...lines.flatMap((line,i)=>[i===0?'':i===1?'/F1 14 Tf':'/F1 11 Tf',i?'0 -28 Td':'',`(${safe(line)}) Tj`]).filter(Boolean),'ET'].join('\n');
    const objs=['<< /Type /Catalog /Pages 2 0 R >>','<< /Type /Pages /Kids [3 0 R] /Count 1 >>','<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Resources << /Font << /F1 5 0 R >> >> /Contents 4 0 R >>',`<< /Length ${stream.length} >>\nstream\n${stream}\nendstream`,'<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>'];
    let pdf='%PDF-1.4\n',offsets=[0];objs.forEach((o,i)=>{offsets.push(pdf.length);pdf+=`${i+1} 0 obj\n${o}\nendobj\n`});const xref=pdf.length;pdf+=`xref\n0 ${objs.length+1}\n0000000000 65535 f \n${offsets.slice(1).map(n=>String(n).padStart(10,'0')+' 00000 n ').join('\n')}\ntrailer\n<< /Size ${objs.length+1} /Root 1 0 R >>\nstartxref\n${xref}\n%%EOF`;
    const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([pdf],{type:'application/pdf'}));a.download=`Buyer_Form_${lead.id}.pdf`;a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);
  }
  function cleanBuyer(){
    document.querySelectorAll('a[href^="https://wa.me"],a[href^="https://api.whatsapp"]').forEach(a=>a.addEventListener('click',e=>{e.preventDefault();e.stopImmediatePropagation();window.portfolioDemoToast?.('Successfully sent. Please check your email for the next step.')},{capture:true,once:true}));
  }
  window.addEventListener('DOMContentLoaded',()=>{if(adminPath)setTimeout(render,80);else{cleanBuyer();new MutationObserver(cleanBuyer).observe(document.body,{childList:true,subtree:true})}});
})();
