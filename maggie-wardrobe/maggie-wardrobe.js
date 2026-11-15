/* Maggie Fenwick wardrobe · autonomous plugin. 7 original outfit PNGs. */
(function(){
'use strict';
const script = document.currentScript;
const base = new URL('.', script && script.src ? script.src : document.baseURI);
const outfits = [
  {
    "id": "01-uniform",
    "name": "Форма Пуффендуя",
    "chapter": "Школа / обычный день",
    "description": "Мантия, галстук и цвета факультета. Базовый образ Мэгги.",
    "image": "looks/01-uniform.png",
    "thumb": "thumbs/01-uniform.webp"
  },
  {
    "id": "02-casual",
    "name": "Повседневная одежда",
    "chapter": "Хогвартс / без мантии",
    "description": "Желтая рубашка, коричневое платье и походные ботинки.",
    "image": "looks/02-casual.png",
    "thumb": "thumbs/02-casual.webp"
  },
  {
    "id": "03-tournament-dream",
    "name": "Сон первого испытания",
    "chapter": "Турнир зельеварения / сон",
    "description": "Ведьмовская шляпа и золотое платье из мира снов.",
    "image": "looks/03-tournament-dream.png",
    "thumb": "thumbs/03-tournament-dream.webp"
  },
  {
    "id": "04-tournament-twisted",
    "name": "Скрутики и испытание",
    "chapter": "Турнир зельеварения / сон",
    "description": "Боевая версия сказочного образа. Здравствуй, реальность.",
    "image": "looks/04-tournament-twisted.png",
    "thumb": "thumbs/04-tournament-twisted.webp"
  },
  {
    "id": "05-conservatory",
    "name": "Путь в Консерваторию",
    "chapter": "Запретный лес / Консерватория",
    "description": "Плащ, шляпа, карманы и прочее снаряжение для сомнительных решений.",
    "image": "looks/05-conservatory.png",
    "thumb": "thumbs/05-conservatory.webp"
  },
  {
    "id": "06-lita-dream",
    "name": "В голове Литы",
    "chapter": "Путешествие по сознанию",
    "description": "Привычная одежда для совершенно непривычного путешествия.",
    "image": "looks/06-lita-dream.png",
    "thumb": "thumbs/06-lita-dream.webp"
  },
  {
    "id": "07-pajama-ball",
    "name": "Бал в пижаме",
    "chapter": "Большой зал / бал",
    "description": "Пижама, мантия и тапочки. Формальная одежда для неформального Хогвартса.",
    "image": "looks/07-pajama-ball.png",
    "thumb": "thumbs/07-pajama-ball.webp"
  }
];
const styleID='mw-wardrobe-style-v1';
const css="/* MAGGIE / compact paper wardrobe. Pure component, no overlays. */\n.mw-wardrobe{--mw-paper:var(--paper,#eeeade);--mw-light:var(--paper-light,#f3efe4);--mw-panel:var(--shade,#ded8c9);--mw-line:var(--line,#c1b9aa);--mw-ink:var(--ink,#2c2b27);--mw-muted:var(--muted,#8b8579);--mw-serif:var(--gothic,Georgia,serif);--mw-mono:var(--mono,'Courier New',monospace);display:block;width:100%;min-width:0;color:var(--mw-ink);background:var(--mw-paper);border-block:1px solid var(--mw-line)}\n.mw-wardrobe,.mw-wardrobe *{box-sizing:border-box}.mw-wardrobe [hidden]{display:none!important}\n.mw-wardrobe button{font:inherit;cursor:pointer;color:inherit;border-radius:0}\n.mw-wardrobe button:focus-visible,.mw-wardrobe [tabindex='0']:focus-visible{outline:2px solid #706149;outline-offset:-3px;z-index:4}\n.mw-heading{display:flex;align-items:center;justify-content:space-between;gap:8px;min-height:34px;padding:9px 13px 7px;border-bottom:1px solid var(--mw-line);color:var(--mw-muted);font:700 10px/1.25 var(--mw-mono);letter-spacing:.01em}\n.mw-smallbrand{white-space:nowrap;font-size:9px}\n.mw-stage{position:relative;display:flex;justify-content:center;align-items:center;min-width:0;height:clamp(340px,46vw,560px);padding:10px 9px 0;overflow:hidden;touch-action:pan-y;background:radial-gradient(circle at 50% 65%,#eee7d8 0,#e8e0d0 60%,#e3dbca 100%);isolation:isolate}\n.mw-stage:before{content:\"\";position:absolute;inset:0;opacity:.2;background-image:radial-gradient(#7c7161 .68px,transparent .78px);background-size:8px 8px;pointer-events:none}\n.mw-ruler{position:absolute;inset:15px auto 15px 13px;width:11px;border-left:1px solid #a8a0927a;opacity:.58;background:repeating-linear-gradient(to bottom,transparent 0 14px,#aaa193 14px 15px,transparent 15px 29px);pointer-events:none}\n.mw-stage img{height:100%;max-width:100%;width:100%;object-fit:contain;object-position:center bottom;position:relative;display:block;user-select:none;-webkit-user-drag:none;filter:drop-shadow(0 3px 2px rgba(52,43,30,.16));transition:opacity .12s ease}\n.mw-stage img.mw-loading{opacity:.26}\n.mw-failure{position:absolute;inset:20% 15%;display:flex;align-items:center;justify-content:center;color:#615a4e;background:#e7dfd0;font:14px/1.4 Georgia,serif;text-align:center}\n.mw-edition{position:absolute;bottom:7px;right:10px;pointer-events:none;background:#e9e3d8c9;padding:3px 5px;color:#766f62;font:700 9px/1.2 var(--mw-mono)}\n.mw-info{padding:15px 16px 13px;border-top:1px solid var(--mw-line);min-width:0;background:var(--mw-light)}\n.mw-meta{display:flex;align-items:center;justify-content:space-between;color:var(--mw-muted);font:700 10px/1.3 var(--mw-mono)}\n.mw-name{font:normal clamp(23px,2.3vw,33px)/1.08 var(--mw-serif);letter-spacing:-.04em;margin:10px 0 7px;overflow-wrap:anywhere}\n.mw-chapter{font:700 10px/1.4 var(--mw-mono);color:#837a6e;margin:0 0 8px}\n.mw-description{font:14px/1.4 Georgia,serif;margin:0;color:#555047}\n.mw-control{display:grid;grid-template-columns:50px minmax(0,1fr) 50px;align-items:stretch;border-block:1px solid var(--mw-line);height:48px;background:var(--mw-panel)}\n.mw-arrow{border:0;background:transparent;font:28px/1 Georgia,serif!important;min-width:0}\n.mw-arrow:first-child{border-right:1px solid var(--mw-line)}.mw-arrow:last-child{border-left:1px solid var(--mw-line)}.mw-arrow:hover{background:#d1c6b4}\n.mw-control-label{display:flex;align-items:center;justify-content:center;text-align:center;padding:0 4px;color:#6c6558;font:700 9px/1.2 var(--mw-mono)}\n.mw-strip{display:grid;grid-template-columns:repeat(7,minmax(0,1fr));min-width:0;border-bottom:1px solid var(--mw-line)}\n.mw-choice{min-width:0;height:65px;padding:3px 2px 5px;border:0;border-right:1px solid var(--mw-line);background:#eae4d8;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:0}\n.mw-choice:last-child{border-right:0}.mw-choice:hover{background:#d7cfbf}.mw-choice[aria-pressed='true']{box-shadow:inset 0 3px #514837;background:#d7ccba}\n.mw-choice img{display:block;width:100%;min-width:0;height:43px;max-width:50px;object-fit:contain;object-position:center bottom}\n.mw-choice span{display:block;font:700 8px/1.5 var(--mw-mono);color:#6c665b}\n.mw-footer{padding:8px 13px 9px;color:var(--mw-muted);font:700 9px/1.35 var(--mw-mono)}\n@media(max-width:950px){.mw-stage{height:clamp(320px,52vw,520px)}.mw-heading{font-size:9px}}\n@media(max-width:650px){.mw-stage{height:min(70vw,460px);min-height:320px}.mw-name{font-size:29px}}\n@media(max-width:400px){.mw-stage{height:410px}.mw-control-label{font-size:8px}}\n@media(prefers-reduced-motion:reduce){.mw-stage img{transition:none}}\n";
if(!document.getElementById(styleID)){
  const el=document.createElement('style'); el.id=styleID; el.textContent=css;
  (document.head||document.documentElement).appendChild(el);
}
function make(tag,cls,txt){
  const el=document.createElement(tag);if(cls)el.className=cls;
  if(txt!==undefined)el.textContent=txt;return el;
}
function createMaggieWardrobe(options={}){
  const looks=(options.looks||outfits).slice();
  if(!looks.length)throw Error('Maggie wardrobe: no looks configured');
  const src=path=>new URL(path,base).href;
  const root=make('section','mw-wardrobe');
  root.setAttribute('aria-label','Гардероб Мэгги');
  const heading=make('div','mw-heading');
  heading.append(make('span','','ГАРДЕРОБ МЭГГИ'),make('span','mw-smallbrand','/ LOOKBOOK'));
  root.append(heading);
  const stage=make('div','mw-stage'); stage.tabIndex=0;
  stage.setAttribute('aria-label','>>>');
  const ruler=make('span','mw-ruler');ruler.setAttribute('aria-hidden','true');stage.append(ruler);
  const figure=make('img','mw-figure');figure.draggable=false;
  const fallback=make('div','mw-failure','Иллюстрация не найдена'); fallback.hidden=true;
  const edition=make('div','mw-edition','FENWICK · 01/07');
  stage.append(figure,fallback,edition);root.append(stage);
  const info=make('div','mw-info');
  const meta=make('div','mw-meta'),count=make('span'),badge=make('span','','/ COLLECTION');
  meta.append(count,badge);
  const title=make('h3','mw-name'),chapter=make('p','mw-chapter'),description=make('p','mw-description');
  info.append(meta,title,chapter,description);root.append(info);
  const controls=make('div','mw-control');
  const prev=make('button','mw-arrow','‹'),label=make('div','mw-control-label','← СМЕНИТЬ ОБРАЗ →'),next=make('button','mw-arrow','›');
  prev.type=next.type='button';prev.setAttribute('aria-label','Предыдущий наряд');next.setAttribute('aria-label','Следующий наряд');
  controls.append(prev,label,next);root.append(controls);
  const strip=make('div','mw-strip');strip.setAttribute('role','group');strip.setAttribute('aria-label','Выбор наряда');
  const choices=[];
  looks.forEach((look,i)=>{
    const btn=make('button','mw-choice');btn.type='button';btn.title=look.name;
    btn.setAttribute('aria-label',look.name);btn.setAttribute('aria-pressed','false');
    const thumb=make('img');thumb.src=src(look.thumb||look.image);thumb.loading='lazy';thumb.alt='';
    thumb.addEventListener('error',()=>thumb.hidden=true);
    btn.append(thumb,make('span','',String(i+1).padStart(2,'0')));
    btn.addEventListener('click',()=>show(i));choices.push(btn);strip.append(btn);
  });root.append(strip);
  root.append(make('div','mw-footer','ONE GIRL / MANY STORIES'));
  let current=0, loadToken=0,touch=null;
  function show(index){
    current=(index%looks.length+looks.length)%looks.length;
    const look=looks[current],n=String(current+1).padStart(2,'0'),total=String(looks.length).padStart(2,'0');
    count.textContent=n+' / '+total;
    edition.textContent='FENWICK · '+n+'/'+total;
    title.textContent=look.name;chapter.textContent=look.chapter||'';description.textContent=look.description||'';
    choices.forEach((b,i)=>b.setAttribute('aria-pressed',String(i===current)));
    fallback.hidden=true;figure.classList.add('mw-loading');
    const token=++loadToken;
    const nextImage=new Image();
    nextImage.onload=()=>{if(token!==loadToken)return;figure.src=nextImage.src;figure.alt='Мэгги: '+look.name;figure.hidden=false;fallback.hidden=true;figure.classList.remove('mw-loading');};
    nextImage.onerror=()=>{if(token!==loadToken)return;figure.hidden=true;fallback.hidden=false;figure.classList.remove('mw-loading');};
    nextImage.src=src(look.image);
  }
  prev.addEventListener('click',()=>show(current-1));
  next.addEventListener('click',()=>show(current+1));
  stage.addEventListener('keydown',e=>{if(e.key==='ArrowRight'||e.key==='ArrowLeft'){e.preventDefault();e.stopPropagation();show(current+(e.key==='ArrowRight'?1:-1));}});
  stage.addEventListener('touchstart',e=>{if(e.touches.length===1)touch={x:e.touches[0].clientX,y:e.touches[0].clientY};},{passive:true});
  stage.addEventListener('touchend',e=>{if(!touch||!e.changedTouches.length)return;const dx=e.changedTouches[0].clientX-touch.x,dy=e.changedTouches[0].clientY-touch.y;if(Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.4)show(current+(dx<0?1:-1));touch=null;},{passive:true});
  show(options.startAt||0);
  return root;
}
window.createMaggieWardrobe=createMaggieWardrobe;
})();
