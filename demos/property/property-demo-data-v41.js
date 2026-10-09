/* Fictional enquiries. Counts, pipeline bars and growth share the same lead records. */
(() => { try {
  const marker='nando-property-demo-v41',key='property_sales_leads_v2';
  const date=offset=>{const d=new Date();d.setHours(10,0,0,0);d.setDate(d.getDate()+offset);return d;};
  const day=d=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
  const esc=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const statuses=['Lead Baru','Diproses','Survey','Booking'],projects=['Pesona Bunga Cibatok','Cibatok Phase II','Mountain View Cluster'];
  if(!localStorage.getItem(marker)){
    const old=JSON.parse(localStorage.getItem(key)||'[]');if(!Array.isArray(old))throw Error('Unexpected lead storage.');const ids=new Set(old.map(x=>x.id));
    const names=['Alya','Bima','Citra','Danu','Eva','Fajar','Gita','Hana','Indra','Jihan','Kirana','Lutfi'];
    const samples=Array.from({length:120},(_,i)=>({id:'DEMO-LD-'+String(i+1).padStart(3,'0'),name:names[i%12]+' '+['Putri','Pratama','Lestari','Ardi','Ramadhani'][i%5],phone:'Demo · '+String(i+1).padStart(3,'0'),source:['Instagram','Website','WhatsApp','Referral','TikTok'][i%5],status:statuses[[0,0,1,1,1,2,2,3][i%8]],project:projects[i%3],created_at:date(-(i<84?Math.floor(i/3)+i%7:35+Math.floor((i-84)/2))).toISOString(),note:'Fictional portfolio enquiry.'}));
    localStorage.setItem(key,JSON.stringify([...old,...samples.filter(x=>!ids.has(x.id))]));localStorage.setItem(marker,'1');
  }
  window.NandoPropertyV41={
    stats(leads){const end=day(date(0)),start=day(date(-29)),last=day(date(-59));const current=leads.filter(x=>String(x.created_at||'').slice(0,10)>=start).length,previous=leads.filter(x=>{const d=String(x.created_at||'').slice(0,10);return d>=last&&d<start;}).length;return [['Total leads',leads.length,previous?((current-previous)/previous*100).toFixed(0)+'% vs previous 30 days':'Sample enquiries'],['New today',leads.filter(x=>String(x.created_at||'').slice(0,10)===end).length,'Fresh enquiries'],['Survey',leads.filter(x=>x.status==='Survey').length,'Visits scheduled'],['Booking',leads.filter(x=>x.status==='Booking').length,'Ready for handoff']];},
    date(){return esc(new Date().toLocaleDateString('en-GB',{day:'2-digit',month:'short',year:'numeric'}).toUpperCase());},
    chart(leads){const days=Array.from({length:14},(_,i)=>day(date(i-13))),counts=days.map(d=>leads.filter(x=>String(x.created_at||'').slice(0,10)===d).length),max=Math.max(1,...counts),points=counts.map((n,i)=>[10+i*600/13,200-n/max*166]);const line=points.map((p,i)=>(i?'L':'M')+p.map(n=>n.toFixed(1)).join(' ')).join(' '),area=line+' L610 210 L10 210Z';return '<div class="ps-chart"><svg viewBox="0 0 620 220" preserveAspectRatio="xMidYMid meet" role="img" aria-label="Daily enquiries for the last fourteen days"><defs><linearGradient id="psArea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8293a5" stop-opacity=".25"/><stop offset="1" stop-color="#8293a5" stop-opacity="0"/></linearGradient></defs><path class="grid" d="M10 35H610M10 90H610M10 145H610M10 200H610"/><path class="area" d="'+area+'"/><path class="line" d="'+line+'"/>'+points.map((p,i)=>'<circle class="dot" style="--dot-delay:'+i*35+'ms" cx="'+p[0]+'" cy="'+p[1]+'" r="4"><title>'+days[i]+': '+counts[i]+' enquiries</title></circle>').join('')+'</svg><div class="ps-chart-labels">'+[0,6,13].map(i=>'<span>'+esc(new Date(days[i]+'T10:00:00').toLocaleDateString('en-GB',{day:'numeric',month:'short'}))+'</span>').join('')+'</div></div>';},
    pipeline(leads){const counts=statuses.map(s=>leads.filter(x=>x.status===s).length),max=Math.max(1,...counts);return '<div class="ps-pipeline">'+statuses.map((s,i)=>'<div style="--bar-delay:'+i*60+'ms"><span>'+s+'</span><i style="--w:'+Math.round(counts[i]/max*100)+'%"></i><b>'+counts[i]+'</b></div>').join('')+'</div>';},
    projectLeads(leads,name){return leads.filter(x=>x.project===name).length;}
  };
}catch(error){console.warn('Property demo data could not be saved:',error.message);} })();
