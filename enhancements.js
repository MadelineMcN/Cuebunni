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
themeNode.className='theme-picker';
themeNode.innerHTML='<label for="themeChoice">Theme</label><select id="themeChoice" aria-label="App appearance"><option value="y2k">Glossy Y2K</option><option value="studio">Sage &amp; Sand</option><option value="minimal">Minimal</option></select>';
document.querySelector('header').appendChild(themeNode);
function chooseTheme(v){
 const value=['y2k','studio','minimal'].includes(v)?v:'y2k';
 document.body.dataset.theme=value;
 $id('themeChoice').value=value;
 document.querySelector('meta[name="theme-color"]').content=value==='studio'?'#fafbf8':value==='minimal'?'#ffffff':'#f8cde9';
 try{localStorage.setItem('cuebunni_theme_v1',value)}catch(e){}
}
let preferred='y2k';try{preferred=localStorage.getItem('cuebunni_theme_v1')||'y2k'}catch(e){}
chooseTheme(preferred);
$id('themeChoice').addEventListener('change',e=>chooseTheme(e.target.value));

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
['libraryEquipment','libraryLevel','compactLibrary'].forEach(id=>$id(id).addEventListener('change',renderLibrary));
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
renderLibrary();
})();