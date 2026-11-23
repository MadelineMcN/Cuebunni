'use strict';
/* Browsable exercise cards with a single detail inspector.
   The catalog, edits and saved class format remain unchanged. */
(function(){
  const library = document.getElementById('library');
  const list = document.getElementById('libraryList');
  const summary = document.getElementById('librarySummary');
  if (!library || !list) return;

  const filterUI = document.getElementById('compactLibrary');
  if (filterUI && filterUI.parentElement) filterUI.parentElement.remove();

  const controls = document.createElement('div');
  controls.className = 'library-view-controls';
  controls.innerHTML =
    '<div class="view-switch" role="group" aria-label="Library view">' +
    '<button type="button" class="view-button active" data-layout="grid" aria-pressed="true">▦ Cards</button>' +
    '<button type="button" class="view-button" data-layout="list" aria-pressed="false">☷ List</button></div>' +
    '<label class="sort-control" for="librarySort">Sort <select id="librarySort">' +
    '<option value="group">Category</option><option value="az">Name A–Z</option>' +
    '<option value="level">Level</option></select></label>';
  summary.insertAdjacentElement('afterend',controls);

  const workspace = document.createElement('div');
  workspace.className='library-workspace view-grid';
  list.parentNode.insertBefore(workspace,list);
  workspace.appendChild(list);
  list.className='library-card-grid';

  const detail = document.createElement('aside');
  detail.id='libraryDetail';
  detail.className='library-detail';
  detail.setAttribute('aria-label','Selected exercise details');
  detail.setAttribute('tabindex','-1');
  workspace.appendChild(detail);

  const backdrop = document.createElement('button');
  backdrop.className='library-backdrop hidden';
  backdrop.type='button';
  backdrop.setAttribute('aria-label','Close exercise details');
  workspace.appendChild(backdrop);

  const pager=document.createElement('div');
  pager.className='library-pager';
  workspace.insertAdjacentElement('afterend',pager);

  let view='grid',visible=36,selectedId=null,lastTrigger=null,matching=[];
  const safe = value => esc(value == null ? '' : value);
  const focusLabels={upper:'Arms / upper body',lower:'Lower body',core:'Abdominals / core',mobility:'Mobility / stretching'};
  const allowedProps=['ball','fitness circle','maple pole','long box','short box'];
  function propTags(x) {
    const raw=Array.isArray(x.props)?x.props:String(x.props||'').split(/[,;\n]/);
    const tags=raw.map(x=>String(x).trim().toLowerCase()).filter(x=>allowedProps.includes(x));
    // In some custom entries the apparatus may be in the category rather than the prop notes.
    const group=(x.group||'')+' '+(x.name||'');
    if(/\(long box\)/i.test(group)&&!tags.includes('long box'))tags.push('long box');
    if(/\(short box\)/i.test(group)&&!tags.includes('short box'))tags.push('short box');
    return tags;
  }
  function displayProp(name){return name.split(' ').map(w=>w[0].toUpperCase()+w.slice(1)).join(' ')}

  function isWide(){ return matchMedia('(min-width: 1180px)').matches; }

  function section(label,value,highlight){
    if(!value)return '';
    return '<section class="detail-section'+(highlight?' detail-highlight':'')+'"><h4>'+safe(label)+
      '</h4><p>'+safe(value)+'</p></section>';
  }

  function inspect(id,trigger){
    const x=getExercise(id);
    if(!x)return;
    selectedId=id;
    if(trigger)lastTrigger=trigger;
    const classification=(x.equipment||'Reformer')+' · '+(x.level||'Essential');
    detail.innerHTML =
      '<div class="detail-header"><div class="detail-heading"><span class="detail-kicker">'+safe(classification)+
      '</span><h3 id="detailTitle">'+safe(x.name)+'</h3><span class="detail-group">'+safe(x.group)+'</span></div>'+
      '<button type="button" class="detail-close" data-close-inspect aria-label="Close exercise details">✕</button></div>'+
      (x.reviewNeeded?'<p class="detail-review">Review the official training materials before teaching this movement.</p>':'')+
      '<div class="detail-metadata"><span><strong>Springs</strong>'+safe(x.springs||'Verify')+'</span>'+
      '<span><strong>Plane</strong>'+safe(x.plane||'Review')+'</span>'+
      '<span><strong>Focus</strong>'+safe(focusLabels[x.zone]||'Mixed')+'</span></div>'+
      section('Props used',propTags(x).map(displayProp).join(', ')||'No additional props tagged')+
      section('Starting position',x.setup)+section('Teaching cue',x.cue,true)+
      section('Muscles & resistance',x.anatomy)+section('What to notice',x.notice,true)+
      section('Compensations',x.watch)+section('Adjustments',x.adapt)+
      section('Your notes',x.notes||'No personal notes yet. Use Edit to add your own.')+
      '<div class="detail-actions"><button type="button" class="btn primary" data-add="'+safe(x.id)+'">+ Add to class</button>'+
      '<button type="button" class="btn ghost" data-edit="'+safe(x.id)+'">✎ Edit & notes</button></div>'+
      '<p class="source">Source: '+safe(x.source||SOURCE)+'. Setup and teaching prompts are illustrative; verify against your course materials.</p>';
    list.querySelectorAll('.library-tile').forEach(el=>el.classList.toggle('selected',el.dataset.entryId===id));
    workspace.classList.add('detail-open');
    backdrop.classList.remove('hidden');
    if(!isWide())detail.focus({preventScroll:true});
  }

  function tile(x){
    const selected=x.id===selectedId;
    const cls=(x.equipment||'Reformer')+' · '+(x.level||'Essential');
    return '<article class="library-tile'+(selected?' selected':'')+'" data-entry-id="'+safe(x.id)+'">'+
      '<div class="tile-top"><span class="tile-label">'+safe(x.group)+'</span><span class="tile-level">'+safe(cls)+'</span></div>'+
      '<h3>'+safe(x.name)+'</h3>'+
      '<p class="tile-summary">'+safe(x.reviewNeeded?'Add your own setup and teaching cues.':(x.notice||'Open to review cues and notes.'))+'</p>'+
      (propTags(x).length?'<div class="tile-props">'+propTags(x).map(p=>'<span class="tile-prop">'+safe(displayProp(p))+'</span>').join('')+'</div>':'')+
      '<div class="tile-foot"><span class="tile-springs">'+safe((x.equipment||'Reformer')==='Mat'?'Mat':x.springs||'Check springs')+'</span>'+
      '<button type="button" class="tile-open" data-inspect="'+safe(x.id)+'" aria-label="View details for '+safe(x.name)+'">View details <span aria-hidden="true">›</span></button></div>'+
      '</article>';
  }

  function filtered(){
    const q=document.getElementById('search').value.trim().toLowerCase();
    const equipment=document.getElementById('libraryEquipment').value;
    const level=document.getElementById('libraryLevel').value;
    const focus=document.getElementById('libraryFocus').value;
    const prop=document.getElementById('libraryProp').value;
    const sort=document.getElementById('librarySort').value;
    const result=allExercises().filter(x=>
      (equipment==='all'||(x.equipment||'Reformer')===equipment) &&
      (level==='all'||(x.level||'Essential')===level) &&
      (focus==='all'||x.zone===focus) &&
      (prop==='all'||propTags(x).includes(prop)) &&
      (x.name+' '+x.group+' '+(x.cue||'')+' '+(x.notice||'')+' '+(x.anatomy||'')+' '+(x.notes||'')+' '+propTags(x).join(' ')).toLowerCase().includes(q)
    );
    result.sort((a,b)=>{
      if(sort==='az')return a.name.localeCompare(b.name);
      if(sort==='level')return (a.level||'Essential').localeCompare(b.level||'Essential')||a.name.localeCompare(b.name);
      return a.group.localeCompare(b.group)||a.name.localeCompare(b.name);
    });
    return result;
  }

  renderLibrary=function(){
    matching=filtered();
    const shown=matching.slice(0,visible);
    summary.textContent=matching.length+' movements found · showing '+shown.length+' · Tap a card for full cues and setup';
    workspace.classList.toggle('view-list',view==='list');
    workspace.classList.toggle('view-grid',view==='grid');
    list.innerHTML=shown.length?shown.map(tile).join(''):'<div class="library-empty"><h3>No movements match these filters</h3><p>Try clearing a filter. Props only show exercises tagged with that item; add prop tags using Edit &amp; notes.</p></div>';
    pager.innerHTML=visible<matching.length?'<button type="button" class="btn ghost" data-more-library>Show more movements ('+
      (matching.length-visible)+' remaining)</button>':'';
    if(selectedId){
      const x=getExercise(selectedId);
      if(x && matching.some(item=>item.id===selectedId)) inspect(selectedId);
      else closeInspector(false);
    }else{
      detail.innerHTML='<div class="detail-placeholder"><span class="detail-placeholder-icon">✦</span><h3>Explore an exercise</h3><p>Select a card to view the starting position, teaching cues, common compensations and your personal notes.</p></div>';
    }
  };

  function closeInspector(refocus){
    selectedId=null;
    workspace.classList.remove('detail-open');
    backdrop.classList.add('hidden');
    list.querySelectorAll('.library-tile').forEach(x=>x.classList.remove('selected'));
    detail.innerHTML='<div class="detail-placeholder"><span class="detail-placeholder-icon">✦</span><h3>Explore an exercise</h3><p>Select a card to view its setup, cues and your notes.</p></div>';
    if(refocus && lastTrigger && lastTrigger.isConnected)lastTrigger.focus();
  }

  controls.addEventListener('click',e=>{
    const button=e.target.closest('[data-layout]');
    if(!button)return;
    view=button.dataset.layout;
    controls.querySelectorAll('[data-layout]').forEach(el=>{
      const active=el.dataset.layout===view;
      el.classList.toggle('active',active);
      el.setAttribute('aria-pressed',String(active));
    });
    renderLibrary();
  });
  document.getElementById('librarySort').addEventListener('change',renderLibrary);
  ['search','libraryEquipment','libraryLevel','libraryFocus','libraryProp'].forEach(id=>{
    document.getElementById(id).addEventListener(id==='search'?'input':'change',()=>{
      visible=36;
      if(!isWide())closeInspector(false);
      renderLibrary();
    });
  });
  library.addEventListener('click',e=>{
    const inspectButton=e.target.closest('[data-inspect]');
    if(inspectButton){inspect(inspectButton.dataset.inspect,inspectButton);return}
    if(e.target.closest('[data-close-inspect]')){closeInspector(true);return}
    if(e.target.closest('[data-more-library]')){visible+=36;renderLibrary();return}
    if(e.target===backdrop){closeInspector(true)}
  });
  document.addEventListener('keydown',e=>{if(e.key==='Escape'&&workspace.classList.contains('detail-open')&&!isWide())closeInspector(true)});
  window.addEventListener('resize',()=>{if(selectedId)backdrop.classList.toggle('hidden',isWide())});
  renderLibrary();
})();
