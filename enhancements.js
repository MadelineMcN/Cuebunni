'use strict';
// Progressive enhancement: existing saved classes and instructor notes stay compatible.
(function(){
const extra=window.CUE_REPERTOIRE||[];
for(const x of DATA){
 if(!x.equipment)x.equipment='Reformer';
 if(!x.level)x.level='Essential';
}
for(const x of extra){
 if(DATA.some(y=>y.name===x.name&&y.equipment===x.equipment&&y.level===x.level))continue;
 DATA.push(x);
}
const $id=id=>document.getElementById(id);
const themeNode=document.createElement('div');
themeNode.className='panel appearance-panel';
themeNode.innerHTML=`<div class="bar">✦ Appearance <span>Choose your style</span></div><div class="inside"><h2>Make it yours</h2><p class="muted">Switch the look anytime. Your classes and personal cues stay the same.</p><div class="theme-options" role="group" aria-label="App appearance">
<button type="button" class="theme-option" data-theme-option="y2k" aria-pressed="false"><span class="theme-swatches"><i style="background:#f9c6e5"></i><i style="background:#bb84da"></i><i style="background:#ffe5a7"></i></span><strong>Glossy Y2K</strong><small>Playful pink &amp; lilac</small></button>
<button type="button" class="theme-option" data-theme-option="studio" aria-pressed="false"><span class="theme-swatches"><i style="background:#fff"></i><i style="background:#90a98f"></i><i style="background:#e8dcc8"></i></span><strong>Sage &amp; Sand</strong><small>Clean Pilates studio</small></button>
<button type="button" class="theme-option" data-theme-option="minimal" aria-pressed="false"><span class="theme-swatches"><i style="background:#fff"></i><i style="background:#484f54"></i><i style="background:#d9dde0"></i></span><strong>Minimal</strong><small>Simple &amp; neutral</small></button>
</div><p class="source">CueBunni v0.3 · Your theme is saved on this device.</p></div>`;
const hero=$id('home').querySelector('.hero');
hero.insertAdjacentElement('afterend',themeNode);
const headerTagline=document.querySelector('header .small');
const heroTitle=document.querySelector('#home .hero h1');
const heroDescription=document.querySelector('#home .hero p');
const heroAction=document.querySelector('#home .hero button');
const heroKicker=document.querySelector('#home .hero .pill');
const sectionTitles={home:'Your studio',builder:'Class builder',library:'Exercise library',editor:'Exercise notebook',saved:'Saved classes',checker:'Flow checker'};
function updateSectionTitles(theme){
 document.querySelectorAll('main .bar').forEach(bar=>{
  if(!bar.dataset.originalLabel)bar.dataset.originalLabel=bar.firstChild&&bar.firstChild.nodeType===3?bar.firstChild.nodeValue:'';
  let label=sectionTitles[bar.closest('section')?.id]||'Class plan';
  if(bar.closest('#generated'))label='Class plan';
  if(bar.closest('.appearance-panel'))label='Appearance';
  if(bar.firstChild&&bar.firstChild.nodeType===3)
   bar.firstChild.nodeValue=theme==='y2k'?bar.dataset.originalLabel:label;
 });
 const savedHeading=document.querySelector('#saved .inside h2');
 if(savedHeading)savedHeading.textContent=theme==='y2k'?'Your little library ♡':'Your class plans';
 const libraryHeading=document.querySelector('#library .inside h2');
 if(libraryHeading)libraryHeading.textContent=theme==='y2k'?'Find your next cue':'Movement library';
 const libraryTab=document.querySelector('.tab[data-go="library"]');
 if(libraryTab&&libraryTab.lastChild&&libraryTab.lastChild.nodeType===3)
  libraryTab.lastChild.nodeValue=theme==='y2k'?'Cues':'Library';
}
function updateThemeLanguage(theme){
 if(theme==='y2k'){
  headerTagline.textContent='little cues. lovely classes. ✿';
  heroTitle.textContent="Let's make something lovely ♡";
  heroDescription.textContent='Build a thoughtful Pilates class, find natural cues, and keep your favorites in one place.';
  heroAction.textContent='✦ Create a class';
  heroKicker.textContent='✦ your pocket class studio';
 }else{
  headerTagline.textContent=theme==='studio'?'Your Pilates teaching workspace':'Pilates class planning & cue library';
  heroTitle.textContent=theme==='studio'?'Teach with clarity and confidence.':'Your Pilates workspace.';
  heroDescription.textContent='Organize your repertoire, build thoughtful classes, and keep every cue at your fingertips.';
  heroAction.textContent='Create a class →';
  heroKicker.textContent='CLASS PLANNING · REPERTOIRE · CUES';
 }
}
function chooseTheme(v){
 const value=['y2k','studio','minimal'].includes(v)?v:'y2k';
 document.body.dataset.theme=value;
 updateThemeLanguage(value);
 updateSectionTitles(value);
 themeNode.querySelectorAll('[data-theme-option]').forEach(el=>{const selected=el.dataset.themeOption===value;el.setAttribute('aria-pressed',selected);el.classList.toggle('selected',selected)});
 document.querySelector('meta[name="theme-color"]').content=value==='studio'?'#fafbf8':value==='minimal'?'#ffffff':'#f8cde9';
 try{localStorage.setItem('cuebunni_theme_v1',value)}catch(e){}
}
let preferred='y2k';try{preferred=localStorage.getItem('cuebunni_theme_v1')||'y2k'}catch(e){}
chooseTheme(preferred);
themeNode.addEventListener('click',e=>{const btn=e.target.closest('[data-theme-option]');if(btn)chooseTheme(btn.dataset.themeOption)});

const equipment=$id('equipment');equipment.innerHTML='<option>Reformer</option><option>Mat</option>';
const level=$id('level');level.innerHTML='<option>Essential</option><option>Intermediate</option>';
const search=$id('search');
const filters=document.createElement('div');
filters.innerHTML='<div class="filter-grid"><label>Equipment<select id="libraryEquipment"><option value="all">All equipment</option><option>Reformer</option><option>Mat</option></select></label><label>Level<select id="libraryLevel"><option value="all">All levels</option><option>Essential</option><option>Intermediate</option></select></label></div><label style="display:flex;align-items:center;gap:7px;font-size:12px"><input type="checkbox" id="compactLibrary" checked style="width:auto">Compact phone view</label><p id="librarySummary" class="library-summary"></p>';
search.insertAdjacentElement('afterend',filters);
const oldCard=card;
card=function(x,i,context='library'){
 let html=oldCard(x,i,context);
 const levelPill='<span class="pill">'+esc(x.equipment||'Reformer')+' · '+esc(x.level||'Essential')+'</span>';
 html=html.replace('<h3>',levelPill+'<h3>');
 if(x.reviewNeeded)html=html.replace('<div class="section">','<p class="review-pill">Instructor review needed: spring, setup &amp; exact movement cues</p><div class="section">');
 return html;
};
renderLibrary=function(){
 const q=search.value.trim().toLowerCase(),equip=$id('libraryEquipment').value,level=$id('libraryLevel').value;
 const arr=allExercises().filter(x=>(equip==='all'||(x.equipment||'Reformer')===equip)&&(level==='all'||(x.level||'Essential')===level)&&(x.name+' '+x.group+' '+x.notice+' '+x.watch+' '+(x.anatomy||'')).toLowerCase().includes(q));
 $id('libraryList').classList.toggle('library-compact',$id('compactLibrary').checked);
 $id('librarySummary').textContent=arr.length+' movements · '+(level==='all'?'both levels':level)+' · '+(equip==='all'?'both apparatus':equip);
 $id('libraryList').innerHTML=arr.length?arr.map((x,i)=>card(x,i)).join(''):'<div class="empty">No matching exercises ♡</div>';
};
['libraryEquipment','libraryLevel','compactLibrary'].forEach(id=>$id(id).addEventListener('change',()=>renderLibrary()));
const oldGenerate=generate;
generate=function(){
 const equip=equipment.value,lvl=level.value;
 if(equip==='Reformer'&&lvl==='Essential'){oldGenerate();return}
 const pool=allExercises().filter(x=>x.equipment===equip&&x.level===lvl);
 if(!pool.length){toast('No movements found at this level.');return}
 const focus=$id('focus').value,target=Number($id('duration').value);
 const preferred=pool.filter(x=>focus==='balanced'||(focus==='mobility'&&x.zone==='mobility')||(focus==='lower'&&x.zone==='lower')||(focus==='upper'&&x.zone==='upper'));
 const candidates=preferred.length>=5?preferred:pool;
 const n=target===30?8:target===45?11:14;
 current=candidates.slice(0,n).map(x=>getExercise(x.id)).filter(Boolean);
 renderCurrent();
 toast('Draft created. Verify level, sequence, springs and setup before teaching.');
};
$id('libraryCount').textContent=allExercises().length;
// The library-ui.js module renders the new card grid after enhancements load.
})();