const RAR=['C','U','R','E','L','M'];
const KEY='kyara-albums-owned-v1';
const series=DATA.s;
const cards=DATA.c.map(([id,name,r,num,s])=>({id,name,r,num,s,lname:name.toLowerCase()}));
const byId=new Map(cards.map(c=>[c.id,c]));
const albums=series.map((name,i)=>({i,name,lname:name.toLowerCase(),cards:[]}));
cards.forEach(c=>albums[c.s].cards.push(c));
albums.forEach(a=>a.cards.sort((x,y)=>x.num-y.num));

let owned=new Map(); // id -> qty (0 = coché à la main sans quantité)
let lastImport=null;
try{const raw=JSON.parse(localStorage.getItem(KEY)||'null');if(raw){owned=new Map(raw.o);lastImport=raw.t||null}}catch(e){}
function save(){try{localStorage.setItem(KEY,JSON.stringify({o:[...owned],t:lastImport}))}catch(e){}}

const $=id=>document.getElementById(id);
const fmt=n=>n.toLocaleString('fr-FR');
const esc=s=>s.replace(/[&<>"]/g,ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[ch]));
const open=new Set();
const rarOn=new Set([0,1,2,3,4,5]);
let limit=60;

function ownedIn(a){let n=0;for(const c of a.cards)if(owned.has(c.id))n++;return n}
// cartes possédées / total de l'album, en ne comptant que les raretés sélectionnées
function countIn(a){let o=0,t=0;for(const c of a.cards)if(rarOn.has(c.r)){t++;if(owned.has(c.id))o++}return{o,t}}

function stats(){
  let done=0,started=0;
  for(const a of albums){const o=ownedIn(a);if(o===a.cards.length)done++;else if(o>0)started++}
  const n=owned.size;
  $('sOwned').textContent=fmt(n);$('sTotal').textContent=fmt(cards.length);
  $('sPct').textContent=(n/cards.length*100).toLocaleString('fr-FR',{maximumFractionDigits:1})+' %';
  $('sDone').textContent=fmt(done);$('sStarted').textContent=fmt(started);
  $('bigbar').style.width=(n/cards.length*100)+'%';
  $('importHint').textContent=lastImport?'Dernier import : '+new Date(lastImport).toLocaleString('fr-FR',{dateStyle:'short',timeStyle:'short'}):'Aucun import pour l’instant';
}

function hl(name,q){
  if(!q)return esc(name);
  const i=name.toLowerCase().indexOf(q);
  if(i<0)return esc(name);
  return esc(name.slice(0,i))+'<mark>'+esc(name.slice(i,i+q.length))+'</mark>'+esc(name.slice(i+q.length));
}

function visibleCards(a,q,cardHit){
  const onlyMiss=$('onlyMiss').checked;
  return a.cards.filter(c=>rarOn.has(c.r)&&(!onlyMiss||!owned.has(c.id))&&(!cardHit||c.lname.includes(q)));
}

function renderBody(a,q,cardHit){
  const list=visibleCards(a,q,cardHit);
  const items=list.map(c=>{const have=owned.has(c.id),qt=owned.get(c.id);
    return `<label class="card${have?' have':''}" data-r="${c.r}"><input type="checkbox" data-id="${c.id}"${have?' checked':''}><span class="cn">${hl(c.name,q)}<span class="cno">#${String(c.num).padStart(4,'0')}${qt>1?` · <span class="qty">×${qt}</span>`:''}</span></span><span class="cr">${RAR[c.r]}</span></label>`}).join('');
  return `<div class="abody"><div class="row"><button class="btn small" type="button" data-all="${a.i}">Tout cocher</button><button class="btn small" type="button" data-none="${a.i}">Tout décocher</button></div>${items?`<div class="cards">${items}</div>`:'<div class="empty">Aucune carte avec ces filtres.</div>'}</div>`;
}

// vue « Toutes les cartes » : une seule grille, sans regroupement par album
function renderCards(q){
  const onlyMiss=$('onlyMiss').checked,minSize=+$('minSize').value;
  const list=cards.filter(c=>rarOn.has(c.r)&&(!onlyMiss||!owned.has(c.id))&&albums[c.s].cards.length>=minSize&&(!q||c.lname.includes(q)||albums[c.s].lname.includes(q)));
  list.sort((x,y)=>y.r-x.r||albums[x.s].name.localeCompare(albums[y.s].name,'fr')||x.num-y.num);
  const miss=list.reduce((n,c)=>n+!owned.has(c.id),0);
  const rarTxt=rarOn.size<RAR.length?' '+[...rarOn].sort().map(r=>RAR[r]).join(', '):'';
  $('count').textContent=fmt(list.length)+' carte'+(list.length>1?'s':'')+rarTxt+' · '+fmt(miss)+' manquante'+(miss>1?'s':'');
  const shown=list.slice(0,limit*5);
  $('list').innerHTML=shown.length?`<li class="flat"><div class="cards">${shown.map(c=>{const have=owned.has(c.id),qt=owned.get(c.id);
    return `<label class="card${have?' have':''}" data-r="${c.r}"><input type="checkbox" data-id="${c.id}"${have?' checked':''}><span class="cn">${hl(c.name,q)}<span class="cno">${hl(albums[c.s].name,q)} · #${String(c.num).padStart(4,'0')}${qt>1?` · <span class="qty">×${qt}</span>`:''}</span></span><span class="cr">${RAR[c.r]}</span></label>`}).join('')}</div></li>`:'<li class="empty">Aucune carte ne correspond.</li>';
  const left=list.length-shown.length;
  $('moreBtn').hidden=left<=0;
  $('moreBtn').textContent='Afficher plus · '+fmt(left)+' cartes restantes';
  stats();
}

function render(){
  const q=$('q').value.trim().toLowerCase();
  const cardView=$('view').value==='cards';
  $('sort').hidden=$('status').hidden=cardView;
  if(cardView)return renderCards(q);
  const st=$('status').value,sort=$('sort').value,minSize=+$('minSize').value;
  let rows=[];
  for(const a of albums){
    if(a.cards.length<minSize)continue;
    const {o,t}=countIn(a),m=t-o;
    if(!t)continue;
    if(st==='todo'&&m===0)continue;
    if(st==='done'&&m!==0)continue;
    if(st==='none'&&o!==0)continue;
    if(st==='started'&&(o===0||m===0))continue;
    let cardHit=false;
    if(q){const albHit=a.lname.includes(q);if(!albHit){if(a.cards.some(c=>c.lname.includes(q)))cardHit=true;else continue}}
    rows.push({a,o,t,m,cardHit});
  }
  const cmp={
    missAsc:(x,y)=>(x.m===0)-(y.m===0)||x.m-y.m||y.t-x.t,
    missDesc:(x,y)=>y.m-x.m||y.t-x.t,
    sizeDesc:(x,y)=>y.t-x.t||x.m-y.m,
    sizeAsc:(x,y)=>x.t-y.t||x.m-y.m,
    pctDesc:(x,y)=>(y.o/y.t)-(x.o/x.t)||y.t-x.t,
    name:(x,y)=>x.a.name.localeCompare(y.a.name,'fr')
  }[sort];
  rows.sort((x,y)=>cmp(x,y)||x.a.name.localeCompare(y.a.name,'fr'));
  const rarTxt=rarOn.size<RAR.length?' ('+[...rarOn].sort().map(r=>RAR[r]).join(', ')+')':'';
  $('count').textContent=fmt(rows.length)+' album'+(rows.length>1?'s':'')+' · '+fmt(rows.reduce((s,r)=>s+r.m,0))+' cartes manquantes'+rarTxt+' dans cette sélection';
  const shown=rows.slice(0,limit);
  $('list').innerHTML=shown.length?shown.map(({a,o,t,m,cardHit})=>{
    const isOpen=open.has(a.i)||cardHit;
    const mix=[0,1,2,3,4,5].map(r=>{const tot=a.cards.filter(c=>c.r===r);if(!tot.length)return'';const h=tot.filter(c=>owned.has(c.id)).length;return `<span data-r="${r}">${RAR[r]} ${h}/${tot.length}</span>`}).join('');
    return `<li class="album${m===0?' done':''}" data-a="${a.i}"><button class="ahead" type="button" aria-expanded="${isOpen}" data-toggle="${a.i}">
      <span class="aname">${hl(a.name,q)}${m===0?'<span class="tag">Complet</span>':''}</span>
      <span class="ameta"><span><b class="num">${o}</b> / <span class="num">${t}</span></span><span class="miss">manque <b class="num">${m}</b></span></span>
      <span class="pbar"><i style="width:${o/t*100}%"></i></span>
      <span class="rmix">${mix}</span></button>${isOpen?renderBody(a,q,cardHit):''}</li>`}).join(''):'<li class="empty">Aucun album ne correspond.</li>';
  const left=rows.length-shown.length;
  $('moreBtn').hidden=left<=0;
  $('moreBtn').textContent='Afficher plus · '+fmt(left)+' albums restants';
  stats();
}

$('list').addEventListener('click',e=>{
  const tg=e.target.closest('[data-toggle]');
  if(tg){const i=+tg.dataset.toggle;open.has(i)?open.delete(i):open.add(i);render();return}
  const all=e.target.closest('[data-all]'),none=e.target.closest('[data-none]');
  if(all||none){const a=albums[+(all||none).dataset[all?'all':'none']];
    for(const c of a.cards){if(all){if(!owned.has(c.id))owned.set(c.id,1)}else owned.delete(c.id)}
    open.add(a.i);save();render();}
});
$('list').addEventListener('change',e=>{
  const id=+e.target.dataset.id;if(!id)return;
  if(e.target.checked)owned.set(id,1);else owned.delete(id);
  e.target.closest('.card').classList.toggle('have',e.target.checked);
  save();
  // met à jour l'en-tête de l'album sans tout redessiner (garde la carte sous le doigt)
  const li=e.target.closest('.album');
  if(!li)return stats();
  const a=albums[+li.dataset.a],{o,t}=countIn(a);
  li.querySelector('.ameta').innerHTML=`<span><b class="num">${o}</b> / <span class="num">${t}</span></span><span class="miss">manque <b class="num">${t-o}</b></span>`;
  li.querySelector('.pbar i').style.width=(o/t*100)+'%';
  li.classList.toggle('done',o===t);
  stats();
});

const chips=$('chips');
chips.innerHTML=`<button type="button" class="chip all" data-r="all" aria-pressed="true" title="Toutes les raretés">Tout</button>`+RAR.map((r,i)=>`<button type="button" class="chip" data-r="${i}" aria-pressed="true" title="Cartes ${r}">${r}</button>`).join('');
// quand toutes les raretés sont affichées, un clic n'en garde qu'une ; ensuite chaque clic en ajoute ou en retire une
chips.addEventListener('click',e=>{const b=e.target.closest('.chip');if(!b)return;
  if(b.dataset.r==='all')RAR.forEach((_,i)=>rarOn.add(i));
  else{const r=+b.dataset.r;
    if(rarOn.size===RAR.length){rarOn.clear();rarOn.add(r)}
    else if(rarOn.has(r)){rarOn.delete(r);if(!rarOn.size)RAR.forEach((_,i)=>rarOn.add(i))}
    else rarOn.add(r)}
  chips.querySelectorAll('.chip').forEach(c=>c.setAttribute('aria-pressed',c.dataset.r==='all'?rarOn.size===RAR.length:rarOn.has(+c.dataset.r)));
  limit=60;render()});

let t;$('q').addEventListener('input',()=>{clearTimeout(t);t=setTimeout(()=>{limit=60;render()},150)});
['view','sort','status','minSize','onlyMiss'].forEach(id=>$(id).addEventListener('change',()=>{limit=60;render()}));
$('moreBtn').addEventListener('click',()=>{limit+=100;render()});

function msg(text,kind){const m=$('msg');m.textContent=text;m.className='msg '+(kind||'')}
function importData(text){
  let d;try{d=JSON.parse(text)}catch(e){return msg('Ce texte n’est pas du JSON valide. Colle le contenu complet du fichier kyara-collection.json.','err')}
  if(d&&!Array.isArray(d)){d=d.collection||d.items||d.cards||d.data||d}
  if(!Array.isArray(d))return msg('Format inattendu : il faut une liste de cartes. Si la console a affiché « Erreur », reconnecte-toi sur Kyara et relance la ligne.','err');
  const next=new Map();let unknown=0;
  for(const it of d){
    let id,q=1;
    if(typeof it==='number')id=it;
    else if(Array.isArray(it)){id=it[0];q=it[1]??1}
    else if(it&&typeof it==='object'){id=it.characterId??it.charId??it.character?.id??it.id;q=it.qty??it.quantity??it.count??1}
    id=Number(id);
    if(!byId.has(id)){unknown++;continue}
    if(q>0)next.set(id,Number(q)||1);
  }
  if(!next.size)return msg('Aucune carte reconnue dans ce fichier.','err');
  owned=next;lastImport=Date.now();save();render();
  msg(fmt(next.size)+' cartes importées'+(unknown?` (${unknown} absente${unknown>1?"s":""} du catalogue, ignorée${unknown>1?"s":""} : relance la mise à jour du catalogue)`:'')+'.','ok');
}
$('file').addEventListener('change',e=>{const f=e.target.files[0];if(!f)return;f.text().then(importData);e.target.value=''});
$('pasteBtn').addEventListener('click',()=>{const v=$('paste').value.trim();if(!v)return msg('La zone de texte est vide.','err');importData(v)});
// Ligne à coller dans la console de kyara.games : lit la collection avec la session Kyara et la télécharge.
const EXPORT=`fetch('/api/me/collection?lean=1',{headers:{authorization:'Bearer '+localStorage.kyara_token,'x-device-id':localStorage.kyara_device}}).then(r=>r.json()).then(d=>{if(!Array.isArray(d))return console.log('Erreur',d);const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(d)],{type:'application/json'}));a.download='kyara-collection.json';a.click();console.log(d.length+' cartes exportées')})`;
$('snip').textContent=EXPORT;
$('copySnip').addEventListener('click',async()=>{
  try{await navigator.clipboard.writeText(EXPORT);msg('Ligne copiée. Colle-la dans la console de kyara.games.','ok')}
  catch(e){const r=document.createRange();r.selectNodeContents($('snip'));const s=getSelection();s.removeAllRanges();s.addRange(r);msg('Ligne sélectionnée : fais Ctrl+C pour la copier.','ok')}
});
$('resetBtn').addEventListener('click',()=>{$('resetConfirm').hidden=false});
$('resetNo').addEventListener('click',()=>{$('resetConfirm').hidden=true});
$('resetYes').addEventListener('click',()=>{owned=new Map();lastImport=null;save();$('resetConfirm').hidden=true;render();msg('Toutes les cartes sont décochées.','ok')});

$('fTotal').textContent=fmt(cards.length);$('fAlb').textContent=fmt(albums.length);
$('fDate').textContent=new Date(DATA.d+'T12:00:00').toLocaleDateString('fr-FR',{dateStyle:'long'});
if(!owned.size)$('importBox').open=true;
render();
