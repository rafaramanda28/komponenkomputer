const here=location.pathname.split('/').pop()||'index.html';
document.querySelectorAll('nav a').forEach(a=>{if(a.getAttribute('href')===here)a.setAttribute('aria-current','page')});
const tabs=[...document.querySelectorAll('.tabs button')];
if(tabs.length){
  const panels=[...document.querySelectorAll('.panel')];
  const show=id=>{
    if(!panels.some(p=>p.id===id))id=tabs[0].dataset.t;
    tabs.forEach(b=>b.setAttribute('aria-selected',b.dataset.t===id));
    panels.forEach(p=>p.hidden=p.id!==id);
    history.replaceState(null,'','#'+id);
  };
  tabs.forEach(b=>b.onclick=()=>show(b.dataset.t));
  show(location.hash.slice(1));
}
