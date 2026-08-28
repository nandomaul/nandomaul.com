(function(){
  const style=document.createElement('style');
  style.textContent=`
    html,body{width:100%;min-height:100%;margin:0;overflow:auto!important}
    canvas{max-width:100vw!important;max-height:100vh!important}
  `;
  document.head.appendChild(style);
  const device=d=>{const mobile=d?d==='mobile':innerWidth<700;document.body.classList.toggle('portfolio-mobile',mobile);document.body.classList.toggle('portfolio-desktop',!mobile)};
  window.addEventListener('message',e=>e.data?.type==='portfolio-device'&&device(e.data.device));
  window.addEventListener('DOMContentLoaded',()=>{device();parent.postMessage({type:'portfolio-route',href:location.pathname+location.search,orientation:location.pathname.includes('/games/nebeng-dulu')?'landscape':'portrait'},'*')});
})();
