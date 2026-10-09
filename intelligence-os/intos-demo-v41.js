/* Preserve conversations; start a fresh General chat only once per browser session. */
(() => {
  window.nandoInitIntosV41 = state => {
    try {
      const entry='nando-intos-v41-entry';
      if(sessionStorage.getItem(entry))return state;
      const chat={id:'chat-demo-entry-'+Date.now(),title:'General System Brand',pinned:false,archived:false,unreadCount:0,mode:'general',activeTool:'ask-anything',updatedAt:new Date().toISOString(),messages:[]};
      const next={...state,activeConversationId:chat.id,activeMode:'general',activeTool:'ask-anything',conversations:[chat,...state.conversations],activeConversationByMode:{...state.activeConversationByMode,general:chat.id},baseMemories:{...state.baseMemories,general:{...state.baseMemories.general,messageCount:0,lastUserMessage:''}}};
      sessionStorage.setItem(entry,'1');return next;
    }catch{return state;}
  };
  const now=new Date(),label=(offset,style)=>{const d=new Date(now);d.setDate(d.getDate()+offset);return d.toLocaleDateString('en-GB',style);};
  window.nandoIntosPeriodsV41={
    '7D':Array.from({length:7},(_,i)=>label(i-6,{weekday:'short'})),
    '30D':Array.from({length:7},(_,i)=>label(Math.round(i*29/6)-29,{day:'numeric',month:'short'})),
    '90D':Array.from({length:7},(_,i)=>label(Math.round(i*89/6)-89,{day:'numeric',month:'short'})),
    '1Y':Array.from({length:7},(_,i)=>label(Math.round(i*364/6)-364,{month:'short',year:'2-digit'}))
  };
  const style=document.createElement('style');
  style.textContent='.conversation-toolbar .offline-test-badge,.conversation-toolbar .base-memory-indicator{display:none!important}';
  document.head.appendChild(style);
})();
