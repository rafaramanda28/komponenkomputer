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
/* transisi keluar halaman: fade singkat sebelum pindah */
document.addEventListener('click',e=>{
  const a=e.target.closest('a[href]');
  if(!a||e.ctrlKey||e.metaKey||e.shiftKey||a.target)return;
  if(!/\.html/.test(a.getAttribute('href'))||a.pathname===location.pathname)return;
  e.preventDefault();
  document.body.classList.add('out');
  setTimeout(()=>{location.href=a.href},180);
});
addEventListener('pageshow',()=>document.body.classList.remove('out'));
