/*
  Маршруты: #home/start; #chronicle (каталог); #chronicle/ball (глава).
*/
(()=>{
'use strict';
const db=window.MAGGIE_DIARY;
if(!db || !Array.isArray(db.sections)){document.body.textContent='Не найден data.js';return;}
const $=id=>document.getElementById(id);
const workspace=$('workspace'),mastNav=$('mast-nav'),dialog=$('search-dialog'),searchInput=$('search-input'),searchResults=$('search-results');
const prefix=(s,p)=>s+'/'+p;
const route=(s,p)=>'#'+s+(p?'/'+p:'');
const galleryNames={chronicle:'СЮЖЕТ',people:'ЛЮДИ',mysteries:'ОРГАНИЗАЦИИ',diary:'РАЗНОЕ',archive:'АРХИВ'};
const motifNames={chronicle:'события',people:'досье',mysteries:'дела',diary:'записи',archive:'документы'};
const make=(tag,klass='',text)=>{const el=document.createElement(tag);if(klass)el.className=klass;if(text!==undefined)el.textContent=text;return el;};
const withAttrs=(el,attrs)=>{Object.entries(attrs).forEach(([key,value])=>el.setAttribute(key,value));return el;};
const groupArt=s=> db.art?.sectionImages?.[s] || `assets/${s}.png`;
const tileArt=(s,p)=> db.art?.pageImages?.[prefix(s,p)]?.card || `assets/${s}-${p}.png`;
const pageArt=(s,p,kind)=>db.art?.pageImages?.[prefix(s,p)]?.[kind] || tileArt(s,p);
function imageSlot(src,description,klass='',alt='Временная дизеринг-иллюстрация'){
 const frame=make('div','image-slot '+klass),img=make('img');
 img.src=src;img.alt=alt;img.loading='lazy';img.decoding='async';
 img.addEventListener('error',()=>{
   if(img.dataset.fallback==='done')return;
   img.dataset.fallback='done';img.src='assets/archive.png';
 });
 const tag=make('span','slot-caption',description);frame.append(img,tag);return frame;
}
function pushText(parent,text,klass='',tag='p'){const el=make(tag,klass,text);parent.appendChild(el);return el;}
function lineTitle(title,sub){const bar=make('div','ruled-label');bar.append(make('span','',title));if(sub)bar.append(make('span','',sub));return bar;}
function openPage(section,page){window.location.hash=route(section,page);if(window.location.hash===route(section,page))render();}
function parseRoute(){
 const parts=(window.location.hash||'#home/start').replace(/^#/,'').split('/');
 const read=v=>{try{return decodeURIComponent(v||'')}catch{return ''}};
 const section=db.sections.find(s=>s.id===read(parts[0]))||db.sections[0];
 const page=section.pages.find(p=>p.id===read(parts[1]));
 return {section,page};
}
function renderNav(active){
 mastNav.replaceChildren();
 db.sections.forEach((s,i)=>{
   const button=make('button','mast-tab'+(s.id===active?' current':''));button.type='button';
   button.textContent=s.id==='home'?'MAIN':galleryNames[s.id];
   button.setAttribute('aria-current',s.id===active?'page':'false');
   button.addEventListener('click',()=>openPage(s.id,s.id==='home'?'start':null));
   mastNav.appendChild(button);
 });
}
function navRow(section,page,index,isActive=false){
 const btn=make('button','directory-row'+(isActive?' selected':''));btn.type='button';
 btn.append(make('span','directory-no',String(index+1).padStart(2,'0')),make('span','directory-title',page.title),make('span','directory-arrow','↗'));
 btn.addEventListener('click',()=>openPage(section.id,page.id));return btn;
}
function home(){
 const layout=make('div','about-layout');
 // LEFT — independent scrolling pane, prose and links.
 const left=make('section','about-panel scroll-pane');
 left.append(lineTitle('РАЗМЫШЛЕНИЯ:','ДАТЬ ЛЕЩА / СЛОМАТЬ КОЛЕНИ'));
 const intro=make('div','pane-body intro-prose');
 pushText(intro,'Действия - волевые, результат - поражение.','intro-text');
 intro.append(imageSlot('assets/05-arkhiv.png','INTRO ART','intro-art'));
 pushText(intro,'Здесь собираются заметки по игровым дням, лица, места и некоторый aesthetics.','intro-text');
 pushText(intro,'*Может попасться мета-информация, но это голос свыше.','intro-text');
 left.append(intro);
 const quote=make('div','small-callout');quote.append(lineTitle('ОН СКАЗАЛ ТЕБЕ НУЖНО СЪЕСТЬ БЕЮ, Я СКАЗАЛА ПРИКОЛЬНАЯ МЫСЛЬ:'));pushText(quote,'На данный момент игры: конец первой учебной недели, 06 сентября.','aside-quote');left.append(quote);
 left.append(lineTitle('ИМЕЕТСЯ:'));
 const links=make('div','home-links');db.sections.filter(s=>s.id!=='home').forEach(s=>{
  const b=make('button','home-link');b.type='button';b.append(make('span','',s.title),make('span','','↗'));b.addEventListener('click',()=>openPage(s.id,null));links.appendChild(b);
 });left.append(links);
 const leftBottom=make('div','pane-body');pushText(leftBottom,'...','fine-print');left.append(leftBottom);
 // CENTER — stable image, can replace at any time
 const center=make('section','about-center');
 const central=imageSlot(db.art?.titleImage||'assets/castle-hero.png',);central.querySelector('img').loading='eager';
 center.append(central);
 const centerFooter=make('div','center-credit');centerFooter.append(make('span','','HOGWARTS / THE SAFEST PLACE'),make('span','','M.F. / 01'));center.append(centerFooter);
 // RIGHT — independent scroll, meta layers and quick contents.
 const right=make('section','about-panel scroll-pane about-right');right.append(lineTitle('КАК УСТРОЕН ЭТОТ АРХИВ:','02 / 03'));
 const expl=make('div','pane-body');pushText(expl,'*События живут в отдельных главах. Внутри каждой можно открыть оглавление и перейти сразу к нужному эпизоду.','intro-text');right.append(expl);
 right.append(lineTitle('УРОВНИ ЗНАНИЯ:'));
 const legend=make('div','legend-list');[
   ['01','Личные записи','Эмоциональное состояние и мысли вне сюжета.'],
   ['02','Сюжет','Что непосредственно происходило.'],
   ['03','Мета-информация','Навесы на персонажа во имя эстетики.']
 ].forEach(x=>{const item=make('div','legend-entry');item.append(make('span','legend-num',x[0]));const a=make('div');a.append(make('h3','',x[1]),make('p','',x[2]));item.append(a);legend.append(item);});right.append(legend);

  const wardrobeMount = make('div', 'maggie-wardrobe-mount');
  right.append(wardrobeMount);
  const showWardrobeError = (message, err) => {
    console.error('[Maggie Wardrobe]', message, err || '');
    const notice = make('div', 'pane-body');
    notice.append(make('strong', '', 'Гардероб не загрузился'));
    notice.append(make('p', 'aside-small', message));
    wardrobeMount.replaceChildren(notice);
  };
  const mountWardrobe = () => {
    if (!wardrobeMount.isConnected) return;
    if (typeof window.createMaggieWardrobe !== 'function') {
      showWardrobeError('Скрипт найден, но функция createMaggieWardrobe недоступна. Проверь консоль браузера.');
      return;
    }
    try { wardrobeMount.replaceChildren(window.createMaggieWardrobe()); }
    catch (err) { showWardrobeError('Ошибка запуска гардероба: ' + err.message, err); }
  };
  if (typeof window.createMaggieWardrobe === 'function') {
    queueMicrotask(mountWardrobe);
  } else {
    wardrobeMount.append(make('p', 'pane-body', 'Загружаю гардероб Мэгги…'));
    const wardrobeScript = document.createElement('script');
    wardrobeScript.src = new URL('maggie-wardrobe/maggie-wardrobe.js', document.baseURI).href;
    wardrobeScript.onload = mountWardrobe;
    wardrobeScript.onerror = () => showWardrobeError('Не найден maggie-wardrobe/maggie-wardrobe.js.');
    document.head.append(wardrobeScript);
  }

layout.append(left,center,right);
workspace.append(layout);
}
function sectionSidebar(section,activePage){
 const side=make('aside','directory-pane scroll-pane');
 side.append(lineTitle('РАЗДЕЛ '+section.number+' / '+galleryNames[section.id],String(section.pages.length).padStart(2,'0')+' ЗАПИСЕЙ'));
 const text=make('div','directory-intro');text.append(make('div','directory-number','0'+Number(section.number)),make('h1','',section.title),make('p','',section.description));side.append(text);
 side.append(lineTitle('СОДЕРЖАНИЕ:'));
 const nav=make('nav','directory-nav');nav.setAttribute('aria-label','Страницы раздела');
 section.pages.forEach((page,i)=>nav.append(navRow(section,page,i,activePage&&page.id===activePage.id)));side.append(nav);
 const end=make('div','directory-end');end.append(lineTitle('✎:'));end.append(imageSlot(groupArt(section.id),'[ SECTION ART ]','directory-art'));
 end.append(make('p','directory-footnote',section.id==='chronicle'?'Эти главы записаны от лица Мэгги. Сюжетные события сверены по записям Литы.':'.'));
 side.append(end);return side;
}
function catalog(section){
 const layout=make('div','catalog-layout');const side=sectionSidebar(section);const catalog=make('section','catalog-content scroll-pane');
 const title=lineTitle('СОБРАНИЕ / '+galleryNames[section.id],'M. FENWICK / '+section.number);catalog.append(title);
 const inner=make('div','catalog-heading');inner.append(make('h2','',section.title),make('span','catalog-descriptor',motifNames[section.id]+' / '+String(section.pages.length).padStart(2,'0')));catalog.append(inner);
 if(section.intro){const intro=make('p','chronicle-intro',section.intro);catalog.append(intro);if(section.credit){catalog.append(make('p','chronicle-credit',section.credit));}}
 const grid=make('div','catalog-grid');
 section.pages.forEach((page,i)=>{
   const card=make('button','catalog-card');card.type='button';card.setAttribute('aria-label','Открыть '+page.title);
   const heading=make('div','card-heading');heading.append(make('span','card-index','ЗАПИСЬ '+String(i+1).padStart(2,'0')),make('span','card-status',page.status||'ЧЕРНОВИК'));
   const title=make('h3','card-title',page.title);heading.append(title);card.append(heading);
   card.append(imageSlot(tileArt(section.id,page.id),'[ '+String(i+1).padStart(2,'0')+' / ART SLOT ]','catalog-art'));
   const footer=make('div','card-footer');footer.append(make('p','',page.lead),make('span','','↗'));card.append(footer);
   card.addEventListener('click',()=>openPage(section.id,page.id));grid.append(card);
 });catalog.append(grid);
 const end=make('div','catalog-bottom');end.append(make('span','','<<<'),make('span','','✣'),make('span','','>>>'));catalog.append(end);
 layout.append(side,catalog);workspace.append(layout);
}
function entry(section,page){
 const layout=make('div','entry-layout');
 const left=sectionSidebar(section,page);left.classList.add('entry-directory');
 const content=make('article','entry-content scroll-pane');
 content.append(lineTitle('ХРОНИКИ МЭГГИ / '+galleryNames[section.id],page.status||'КАРКАС'));
 const header=make('header','entry-header');
 const crumbs=make('div','breadcrumbs');const back=make('button','','← '+section.title);back.type='button';back.addEventListener('click',()=>openPage(section.id,null));crumbs.append(back,make('span','','/ '+page.title));header.append(crumbs);
 const title=make('h1','entry-title',page.title);header.append(title,make('p','entry-lead',page.lead));content.append(header);
 const picture=make('figure','entry-figure');picture.append(imageSlot(pageArt(section.id,page.id,'cover'),'[ / COVER ]','entry-cover'));
 const caption=make('figcaption','','');picture.append(caption);content.append(picture);
 const articleNote=make('div','entry-note');articleNote.append(make('span','', 'ЗАПИСЬ № '+String(section.pages.indexOf(page)+1).padStart(2,'0')),make('span','',section.id==='chronicle'?'/ ОТ ЛИЦА МЭГГИ':'ФАКТИЧЕСКИЕ ДАННЫЕ ПОКА НЕ ВНЕСЕНЫ'));content.append(articleNote);
 page.blocks.forEach((block,i)=>{
  const sectionBlock=make('section','chapter-block');sectionBlock.id='block-'+block.id;
  const top=make('div','block-meta');top.append(make('span','','0'+(i+1)+' / '+String(page.blocks.length).padStart(2,'0')),make('span','',galleryNames[section.id]));sectionBlock.append(top);
  sectionBlock.append(make('h2','',block.heading));
  if(['chronicle', 'people', 'mysteries', 'diary'].includes(section.id)){block.text.split(/\n\s*\n/).filter(Boolean).forEach(t=>pushText(sectionBlock,t.trim(),'chapter-copy'));}
  else {pushText(sectionBlock,block.text,'chapter-copy');}
  content.append(sectionBlock);
  if(i===1){const wide=make('figure','inline-art');wide.id='inline-art';wide.append(imageSlot(pageArt(section.id,page.id,'wide'),'[/ 16:9 ]','wide-art'));wide.append(make('figcaption','','.'));content.append(wide);}
 });
 const closer=make('div','entry-end');closer.append(make('span','','✣  КОНЕЦ ЗАПИСИ'));
 const next=section.pages[section.pages.indexOf(page)+1];if(next){const b=make('button','','СЛЕДУЮЩАЯ: '+next.title+' ↗');b.type='button';b.addEventListener('click',()=>openPage(section.id,next.id));closer.append(b);}
 content.append(closer);
 const toc=make('aside','entry-toc scroll-pane');toc.append(lineTitle('В ЭТОЙ ГЛАВЕ:'));
 const tocNav=make('nav','toc-nav');tocNav.setAttribute('aria-label','Оглавление главы');
 function jump(id){const dest=content.querySelector('#'+CSS.escape(id));if(dest)dest.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion:reduce)').matches?'auto':'smooth',block:'start'});}
 [['00','entry-top'],...page.blocks.map(b=>[b.heading,'block-'+b.id])].forEach(([label,id],i)=>{
   const b=make('button','toc-item');b.type='button';b.append(make('span','',String(i+1).padStart(2,'0')),make('span','',label));b.addEventListener('click',()=>jump(id==='entry-top'?'entry-top':id));tocNav.append(b);
 });toc.append(tocNav);const details=make('div','toc-end');details.append(lineTitle('ПРИМЕЧАНИЕ:'));
 pushText(details,section.id==='chronicle'?'':'','aside-small');
 details.append(imageSlot('assets/diary.png','[ TOC ART ]','toc-art'));toc.append(details);
 header.id='entry-top';layout.append(left,content,toc);workspace.append(layout);
}
function render(){
 const {section,page}=parseRoute();renderNav(section.id);workspace.replaceChildren();workspace.dataset.mode=section.id==='home'?'about':page?'entry':'catalog';
 if(section.id==='home')home();else if(!page)catalog(section);else entry(section,page);
 document.title=(page?.title||section.title)+' · Дневник Мэгги';
 const panes=workspace.querySelectorAll('.scroll-pane');panes.forEach(p=>p.scrollTop=0);
}
const searchIndex=db.sections.flatMap(s=>s.pages.map(p=>({s,p,hay:(s.title+' '+p.title+' '+p.lead+' '+p.blocks.map(b=>b.heading+' '+b.text).join(' ')).toLocaleLowerCase('ru')})));
function searchResultsRender(){
 const term=searchInput.value.trim().toLocaleLowerCase('ru');
 const list=term?searchIndex.filter(x=>x.hay.includes(term)):searchIndex.filter(x=>x.s.id!=='home').slice(0,8);
 searchResults.replaceChildren();
 if(!list.length){searchResults.append(make('p','search-no','Пока ничего не найдено. Архив еще пополняется.'));return;}
 list.slice(0,18).forEach(({s,p})=>{
   const b=make('button','search-hit');b.type='button';b.append(make('span','search-category',s.title+' / '+p.status),make('strong','',p.title),make('small','',p.lead));
   b.addEventListener('click',()=>{closeSearch();openPage(s.id,p.id);});searchResults.append(b);
 });
}
function openSearch(){dialog.hidden=false;searchInput.value='';searchResultsRender();searchInput.focus();}
function closeSearch(){dialog.hidden=true;}
$('search-button').addEventListener('click',openSearch);
$('search-dismiss').addEventListener('click',closeSearch);
dialog.addEventListener('click',e=>{if(e.target.closest('[data-close-search]'))closeSearch();});
searchInput.addEventListener('input',searchResultsRender);
searchInput.addEventListener('keydown',e=>{if(e.key==='Enter'){const first=searchResults.querySelector('button');if(first)first.click();}});
window.addEventListener('keydown',e=>{
 if((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'){e.preventDefault();dialog.hidden?openSearch():closeSearch();}
 if(e.key==='Escape'&&!dialog.hidden)closeSearch();
});
$('home-button').addEventListener('click',()=>openPage('home','start'));
$('close-button').addEventListener('click',()=>{
 if(window.parent!==window){window.parent.postMessage({type:'MAGGIE_DIARY_CLOSE'},'*');}else window.location.href='./index.html';
});
window.addEventListener('hashchange',render);
render();
})();