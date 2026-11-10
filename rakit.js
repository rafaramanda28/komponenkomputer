const P=[
['mobo','b650','Motherboard B650','Socket AM5, RAM DDR5',{sock:'AM5',ram:'DDR5'}],
['mobo','b660','Motherboard B660','Socket LGA1700, RAM DDR4',{sock:'LGA1700',ram:'DDR4'}],
['cpu','r5','Ryzen 5 7600','Socket AM5, 65 W',{sock:'AM5',w:65}],
['cpu','i5','Core i5-12400F','Socket LGA1700, 65 W',{sock:'LGA1700',w:65}],
['ram','d5','RAM 16 GB DDR5','5600 MT/s',{ram:'DDR5'}],
['ram','d4','RAM 16 GB DDR4','3200 MT/s',{ram:'DDR4'}],
['sto','nv','SSD NVMe 1 TB','PCIe, baca ±3.500 MB/s',{}],
['sto','hd','HDD 1 TB','7200 RPM, baca ±150 MB/s',{hdd:1}],
['gpu','g4','GeForce RTX 4060','8 GB VRAM, 115 W',{w:115}],
['gpu','g7','GeForce RTX 4070 Super','12 GB VRAM, 220 W',{w:220}],
['psu','p4','PSU 450 W','80 PLUS Bronze',{cap:450}],
['psu','p6','PSU 650 W','80 PLUS Gold',{cap:650}]
].map(([t,id,n,s,a])=>({t,id,n,s,...a}));
const L={mobo:'Motherboard',cpu:'CPU',ram:'RAM',sto:'Storage',gpu:'GPU',psu:'PSU'};
const $=s=>document.querySelector(s),byId=id=>P.find(p=>p.id===id);
const tray=$('#tray'),board=$('#board'),hasil=$('#hasil');
let build={},sel=null;

function draw(){
  tray.innerHTML=Object.keys(L).map(t=>`<h3>${L[t]}</h3>`+P.filter(p=>p.t===t).map(p=>
    `<button class="part${sel===p.id?' sel':''}${build[t]&&build[t].id===p.id?' used':''}" draggable="true" data-id="${p.id}">${p.n}<small>${p.s}</small></button>`).join('')).join('');
  board.innerHTML=Object.keys(L).map(t=>{const p=build[t];
    return `<div class="slot${p?' full':''}" data-t="${t}" tabindex="0" role="button" aria-label="Slot ${L[t]}"><span>${L[t]}</span>${p?`<b>${p.n}</b>${p.s}`:`<br>Kosong. Seret ${L[t]} ke sini.`}</div>`}).join('');
}
function put(p,slot){
  const t=slot.dataset.t;
  if(p.t!==t){
    slot.classList.add('no');setTimeout(()=>slot.classList.remove('no'),400);
    hasil.innerHTML=`<li class="warn">${p.n} adalah ${L[p.t]}, tidak bisa dipasang di slot ${L[t]}.</li>`;return;
  }
  build[t]=p;sel=null;hasil.innerHTML='';draw();
}
tray.addEventListener('click',e=>{const b=e.target.closest('.part');if(b){sel=sel===b.dataset.id?null:b.dataset.id;draw()}});
tray.addEventListener('dragstart',e=>{const b=e.target.closest('.part');if(b)e.dataTransfer.setData('text/plain',b.dataset.id)});
board.addEventListener('dragover',e=>{const s=e.target.closest('.slot');if(s){e.preventDefault();s.classList.add('over')}});
board.addEventListener('dragleave',e=>{const s=e.target.closest('.slot');if(s)s.classList.remove('over')});
board.addEventListener('drop',e=>{e.preventDefault();const s=e.target.closest('.slot'),p=byId(e.dataTransfer.getData('text/plain'));if(s&&p)put(p,s)});
board.addEventListener('click',e=>{
  const s=e.target.closest('.slot');if(!s)return;
  if(sel)put(byId(sel),s);
  else if(build[s.dataset.t]){delete build[s.dataset.t];hasil.innerHTML='';draw()}
});
board.addEventListener('keydown',e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();e.target.click()}});

$('#cek').onclick=()=>{
  const m=Object.keys(L).filter(t=>!build[t]);
  if(m.length){hasil.innerHTML=`<li class="warn">Belum lengkap, kurang: ${m.map(t=>L[t]).join(', ')}.</li>`;return}
  const {mobo,cpu,ram,sto,gpu,psu}=build,r=[];
  r.push(cpu.sock===mobo.sock?['ok',`Socket cocok: CPU dan motherboard sama-sama ${cpu.sock}.`]:['bad',`Socket tidak cocok: CPU ${cpu.sock}, motherboard ${mobo.sock}. Posisi pin dan dudukannya berbeda, CPU tidak bisa dipasang.`]);
  r.push(ram.ram===mobo.ram?['ok',`RAM cocok: ${ram.ram}.`]:['bad',`RAM ${ram.ram} tidak cocok dengan motherboard yang memakai ${mobo.ram}. Posisi takik slotnya berbeda.`]);
  const use=cpu.w+gpu.w+100,need=Math.ceil(use*1.3/10)*10;
  r.push(psu.cap>=need?['ok',`Daya cukup: estimasi beban ${use} W, PSU ${psu.cap} W (disarankan minimal ${need} W).`]:['bad',`Daya kurang: estimasi beban ${use} W, disarankan PSU minimal ${need} W, yang dipasang ${psu.cap} W.`]);
  if(sto.hdd)r.push(['warn','HDD bisa dipakai, tetapi booting dan loading program jauh lebih lambat daripada SSD.']);
  const bad=r.some(x=>x[0]==='bad');
  hasil.innerHTML=`<li class="${bad?'bad':'ok'}"><b>${bad?'Rakitan belum bisa menyala.':'Rakitan valid, PC bisa menyala.'}</b></li>`+r.map(([c,t])=>`<li class="${c}">${t}</li>`).join('');
};
$('#reset').onclick=()=>{build={};sel=null;hasil.innerHTML='';draw()};
draw();
