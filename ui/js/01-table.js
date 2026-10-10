/* 01-table.js — Tabel: sortir, filter, pagination, hero, KPI.
   Dipisah otomatis dari DESIGN ADMIN/new-admin.html. Muat BERURUTAN via <script> di index.html (classic script, globals bersama). */
var MATRIX=[
 ['Bank Soal · Bidang · Materi',1,0,0,1],
 ['Blueprint · Versi · Program',1,0,0,1],
 ['Latihan · Try Out · Nilai esai',1,0,0,1],
  ['Laporan soal',1,0,0,1],
  ['Iklan · Medsos · Broadcast',0,1,0,1],
  ['Testimoni',0,0,0,1],
  ['Media promosi (banner & iklan)',2,0,0,1],
  ['Pengguna · Pelajar · Undangan',0,0,1,1],
  ['Notifikasi (broadcast)',1,1,1,1],
  ['Masukan',0,0,0,1],
  ['Tugas Streak',0,1,0,1],
  ['Artikel portal',0,1,0,1],
  ['Voucher & referral',0,1,0,1],
  ['Universitas · Prodi · Jenjang',0,0,0,1],
 ['Peran · Izin · Log · Pengaturan',0,0,0,1]
];
function cellHTML(v,ri,ci,editable){
 var inner=v===2?ic(P_HALF,14):(v?ic(P_CHECK,13):'–');
 var cls=v===2?'tick part':(v?'tick y':'tick n');
 var title=v===2?'Sebagian / hanya lihat':(v?'Boleh buka':'Tidak boleh');
 if(!editable)return '<span class="'+cls+'" title="'+title+'">'+inner+'</span>';
 return '<button class="'+cls+'" data-mx="'+ri+'-'+ci+'" title="'+title+' — klik untuk ubah" aria-label="Ubah akses">'+inner+'</button>';
}
function matrixHTML(){
 var editable=(state.role==='admin');
 var h='<div class="card" style="margin-top:12px"><div class="card-h"><div><h2>Siapa bisa buka apa</h2><p>Ketuk kotak untuk mengubah (khusus Admin)</p></div><div class="sp">'+(editable?'<button class="link" data-mxreset>Reset</button>':'<button class="link" data-t="Permintaan akses dikirim ke Admin">Minta akses</button>')+'</div></div><div class="matrix-scroll"><div class="matrix">'
 +'<div class="mrow head"><div>Fitur</div><div>Soal</div><div>Mkt</div><div>User</div><div>Adm</div></div>';
 MATRIX.forEach(function(m,ri){
  h+='<div class="mrow"><div><b>'+m[0]+'</b></div>';
  for(var ci=1;ci<=4;ci++)h+='<div>'+cellHTML(m[ci],ri,ci,editable)+'</div>';
  h+='</div>';
 });
 return h+'</div></div></div>';
}
/* SVG charts (no dependency): area + bars */
function areaChart(data,labels){
 var W=560,H=150,P=8;var max=Math.max.apply(null,data.concat([10]));
 var pts=data.map(function(v,i){var x=P+i*(W-2*P)/(data.length-1);var y=H-P-(v/max)*(H-2*P);return [x,y];});
 var line=pts.map(function(p,i){return (i?'L':'M')+p[0].toFixed(1)+' '+p[1].toFixed(1);}).join(' ');
 var area=line+'L'+(W-P)+' '+(H-P)+'L'+P+' '+(H-P)+'Z';
 var dots=pts.map(function(p){return '<circle cx="'+p[0].toFixed(1)+'" cy="'+p[1].toFixed(1)+'" r="3.2" fill="var(--primary)"/>';}).join('');
 var grid='';for(var g=1;g<=3;g++){var gy=(H*g/4);grid+='<line x1="'+P+'" y1="'+gy+'" x2="'+(W-P)+'" y2="'+gy+'" stroke="var(--border-soft)" stroke-width="1"/>';}
 return '<svg viewBox="0 0 '+W+' '+H+'" role="img" aria-label="Grafik aktivitas 7 hari">'+grid+'<path d="'+area+'" fill="var(--primary-100)" opacity=".55"/><path d="'+line+'" fill="none" stroke="var(--primary)" stroke-width="2.4" stroke-linecap="round"/>'+dots+'</svg>';
}
function barsHTML(data){
 var max=Math.max.apply(null,data.concat([1]));
 return '<div class="bars" role="img" aria-label="Registrasi per hari">'+data.map(function(v,i){var h=Math.max(8,Math.round(v/max*80));return '<span style="height:'+h+'px" class="'+(i===data.length-1?'hot':'')+'"><b>'+v+'</b></span>';}).join('')+'</div>';
}
var SORTS={
 title:{label:'Judul',get:function(d){return String(d.t||'');}},
 detail:{label:'Detail',get:function(d){return String((d.by||'')+' '+(d.s||''));}},
 status:{label:'Status',get:function(d){return String((d.st&&d.st[0])||'');}},
 owner:{label:'Penyebar',get:function(d){return String(d.owner||d.by||'');}},
 quest:{label:'Quest',get:function(d){return String(d.quest||'');}},
 type:{label:'Tipe',get:function(d){return String(d.type||'');}},
 diff:{label:'Kesulitan',get:function(d){return String(d.diff||'');}}
};
/* Opsi urut dibaca dari kolom tabel itu sendiri (kontekstual per halaman).
   t.sorts opsional: override eksplisit [{key,label}]. */
function sortProps(t){
 if(t.sorts)return t.sorts;
 return colDefsOf(t).filter(function(c){return c.sort&&SORTS[c.sort];}).map(function(c){return {key:c.sort,label:c.label};});
}
function applySort(rows){
 if(!state.sort||!state.sortKey||!SORTS[state.sortKey])return rows;
 var g=SORTS[state.sortKey].get;var dir=state.sort==='asc'?1:-1;
 return rows.slice().sort(function(a,b){return dir*g(a).localeCompare(g(b),'id',{numeric:true,sensitivity:'base'});});
}
function thCell(label,key,alignRight){
 if(!key)return '<th'+(alignRight?' style="text-align:right"':'')+'><span class="th-in">'+esc(label)+'</span></th>';
 var active=state.sortKey===key&&state.sort;
 var arrow=ic(active&&state.sort==='asc'?P_CHEV_UP:P_CHEV,14);
 var aria=active?(state.sort==='asc'?'ascending':'descending'):'none';
 return '<th class="th-sort'+(active?' sorted':'')+'" data-sort="'+key+'" aria-sort="'+aria+'"'+(alignRight?' style="text-align:right"':'')+'><span class="th-in">'+esc(label)+' '+arrow+'</span></th>';
}
/* ===== Filter Notion: kondisi {properti, operator, nilai} + urut properti =====
   Properti dibaca dari deskriptor tabel (chips → Status, filters → select).
   Semua kondisi digabung AND. state.flt=[{k,op:'eq'|'ne',v}]. */
/* Properti dibaca dari descriptor tabel (chips → Status, filters → select).
   Select yang isinya sama/lengkap dengan chip digabung jadi satu Status. */
function filterProps(t){
 var chips=(t.chips||[]).filter(function(c){return c!=='Semua';});
 var out=[],chipUsed=chips.length>0;
 (t.filters||[]).forEach(function(f){
  var ops=(f.o||[]).filter(function(o){return o!=='Semua';});
  if(!ops.length)return;
  var covers=chips.length>0&&chips.every(function(c){return ops.indexOf(c)>=0;});
  var sub=chips.length>0&&ops.every(function(o){return chips.indexOf(o)>=0;});
  if(sub&&!covers)return;
  if(covers)chipUsed=false;
  out.push({key:f.k,label:f.l,options:ops});
 });
 if(chipUsed)out.unshift({key:'_chip',label:'Status',options:chips});
 return out;
}
function propOf(t,k){var out=null;filterProps(t).forEach(function(p){if(p.key===k)out=p;});return out;}
function fltMatch(d,c){
 var v=c.v,hit;
 if(c.k==='_chip')hit=(d.chip===v||d.chip==='Semua'||!d.chip);
 else if(c.k==='isi'){var cc=qSubCount(d);hit=(v==='In Review')?cc.draft>0:cc.total===0;}
 else if(c.k==='ent')hit=(d.ent===v);
 else if(c.k==='owner')hit=(d.owner===v);
 else hit=((d.t+' '+d.s).toLowerCase().indexOf(String(v).toLowerCase().slice(0,4))>=0||(d.st&&d.st[0]===v));
 return c.op==='ne'?!hit:!!hit;
}
function fltN(){return (state.flt||[]).length;}
function hasResetF(){return fltN()>0||!!state.q||!!state.sort;}
function sortLbl(t){var sp=t?sortProps(t):null;var lbl=null;if(sp)sp.forEach(function(o){if(o.key===state.sortKey)lbl=o.label;});if(!lbl&&SORTS[state.sortKey])lbl=SORTS[state.sortKey].label;if(!state.sort||!state.sortKey||!lbl)return 'Urutkan';return lbl+' '+(state.sort==='asc'?'A–Z':'Z–A');}
function filteredRows(t){
 var rows=(t.rows||[]).filter(function(d){return (state.flt||[]).every(function(c){return fltMatch(d,c);});});
 if(state.q){var q=state.q.toLowerCase();rows=rows.filter(function(d){return (d.id+' '+d.t+' '+d.s+' '+d.by).toLowerCase().indexOf(q)>=0;});}
 return applySort(rows);
}
/* Bar filter dua baris: [cari…] lalu [Filter ·n] [kondisi ×]… [Urutkan] [Reset]. */
function filterBarHTML(t,ph,ss){
 var conds=(state.flt||[]).map(function(c,i){
  var p=propOf(t,c.k);
  return '<span class="fcond"><span>'+esc(p?p.label:c.k)+' '+(c.op==='ne'?'bukan':'adalah')+' '+esc(c.v)+'</span><button data-nflt-del="'+i+'" aria-label="Hapus filter">'+ic(P_X,13)+'</button></span>';
 }).join('');
 var n=fltN();
 var sortIcon=state.sort==='asc'?P_SORT_ASC:state.sort==='desc'?P_SORT_DESC:P_SORT;
 return '<div><div class="filters">'
  +searchField(ph||'Cari…',ss||'flex:0 0 auto;width:340px;max-width:100%')
  +'</div><div class="filters" style="padding-top:8px">'
  +(filterProps(t).length?'<button class="link'+(n?' on':'')+'" data-nfilter aria-haspopup="true">'+ic(P_FILTER,15)+(n?('Filter · '+n):'Filter')+'</button>':'')
  +conds
  +(sortProps(t).length?'<button class="link'+(state.sort?' on':'')+'" id="sortBtn" title="'+esc(sortLbl(t))+'" aria-pressed="'+(!!state.sort)+'">'+ic(sortIcon,15)+esc(sortLbl(t))+'</button>':'')
  +(hasResetF()?'<button class="link" data-reset>Reset</button>':'')
  +'</div><div style="height:10px"></div></div>';
}
/* Deskriptor filter/sort sesuai bar yang dirender (level-1 mapel pakai SUBTOOLS, level-2 pakai TOPICSORT). */
function filterDesc(){var pg=state.page||defPage();if(pg==='questions'&&!state.qsub)return SUBTOOLS;return featOf(pg);}
function sortDesc(){var pg=state.page||defPage();if(pg==='questions'){if(!state.qsub)return SUBTOOLS;if(!state.qtop)return TOPICSORT;}return featOf(pg);}
/* Filter/Sort popover: click-only toggle. Hover does nothing.
   Open/close via click on the button, close on outside click / Escape / select. */
var popCloseT=null;
function popStay(){if(popCloseT){clearTimeout(popCloseT);popCloseT=null;}}
function popArm(){popStay();var p=$('#kebabPop');if(p)p.classList.remove('show');}
/* Gap-tolerant leave: jangan tutup kalau pointer masih di tombol/pop
   atau di jembatan di antaranya (pindah tombol -> daftar). */
function popGuard(e,btn){
  var pop=$('#kebabPop');if(!pop||!pop.classList.contains('show'))return;
  var rt=e&&e.relatedTarget;
  if(rt){
    if(rt===pop||pop.contains(rt))return;
    if(btn&&(rt===btn||btn.contains(rt)))return;
  }
  try{
    if(e&&typeof e.clientX==='number'&&btn){
      var b=btn.getBoundingClientRect(),p=pop.getBoundingClientRect();
      var x=e.clientX,y=e.clientY;
      var minX=Math.min(b.left,p.left)-4,maxX=Math.max(b.right,p.right)+4;
      var minY=Math.min(b.top,p.top)-4,maxY=Math.max(b.bottom,p.bottom)+4;
      if(x>=minX&&x<=maxX&&y>=minY&&y<=maxY)return;
    }
  }catch(_){}
  popArm();
}
function placePop(btn,flush){
  var pop=$('#kebabPop');if(!pop)return null;
  var r=btn.getBoundingClientRect();
  var pw=pop.offsetWidth||220,ph=pop.offsetHeight||160;
  var x=r.left;if(x<12)x=12;if(x+pw>window.innerWidth-12)x=window.innerWidth-pw-12;
  var gap=flush?0:6;
  var y=r.bottom+gap;if(y+ph>window.innerHeight-12)y=r.top-ph-gap;if(y<12)y=12;
  pop.style.left=x+'px';pop.style.top=y+'px';
  pop.classList.add('show');
  return pop;
}
/* Langkah 1: pilih properti. Langkah 2: operator + nilai. */
function openFilterPop(btn,t,step){
 step=step||{stage:'props'};
 var pop=$('#kebabPop');if(!pop)return;
 var h='';
 if(step.stage==='props'){
  var props=filterProps(t);
  h+='<div class="fpop-h">Tambah filter</div>';
  if(!props.length)h+='<div class="fpop-note">Tidak ada properti filter di tabel ini.</div>';
  props.forEach(function(p){h+='<button data-nprop="'+esc(p.key)+'">'+ic(P_FILTER,15)+'<span>'+esc(p.label)+'</span></button>';});
 }else{
  var p=propOf(t,step.key);if(!p)return;
  var op='eq';
  h+='<button class="fpop-back" data-nback>'+ic(P_CHL,15)+'<span>'+esc(p.label)+'</span></button>';
  p.options.forEach(function(o){h+='<button data-nval="'+esc(o)+'"><span>'+esc(o)+'</span></button>';});
 }
    pop.innerHTML=h;placePop(btn);
  pop.dataset.src='filter';
  pop.onmouseenter=null;
  pop.onmouseleave=null;
  pop.querySelectorAll('[data-nprop]').forEach(function(b){b.onclick=function(e){e.stopPropagation();openFilterPop(btn,t,{stage:'vals',key:b.getAttribute('data-nprop')});};});
  var bb=pop.querySelector('[data-nback]');if(bb)bb.onclick=function(e){e.stopPropagation();openFilterPop(btn,t,{stage:'props'});};
 pop.querySelectorAll('[data-nval]').forEach(function(b){b.onclick=function(e){e.stopPropagation();state.flt.push({k:step.key,op:'eq',v:b.getAttribute('data-nval')});state.pg=1;saveFilters();pop.classList.remove('show');render(false);};});
}
/* Menu urut: opsi dibaca dari kolom tabel (sortProps) — klik properti = naik → turun → mati. */
function openSortPop(btn,t){
 var pop=$('#kebabPop');if(!pop)return;
 var opts=sortProps(t||sortDesc());
 var h='<div class="fpop-h">Urutkan</div>';
 if(!opts.length)h+='<div class="fpop-note">Tidak ada kolom yang bisa diurut di tabel ini.</div>';
 opts.forEach(function(o){
  var cur=state.sortKey===o.key&&state.sort;
  h+='<button data-nsort-pick="'+esc(o.key)+'">'+ic(cur?(state.sort==='asc'?P_SORT_ASC:P_SORT_DESC):P_SORT,15)+'<span>'+esc(o.label)+(cur?(state.sort==='asc'?' · A–Z':' · Z–A'):'')+'</span></button>';
 });
 pop.innerHTML=h;placePop(btn);
  pop.dataset.src='sort';
  pop.onmouseenter=null;
  pop.onmouseleave=null;
  pop.querySelectorAll('[data-nsort-pick]').forEach(function(b){b.onclick=function(e){e.stopPropagation();var k=b.getAttribute('data-nsort-pick');if(state.sortKey!==k||!state.sort){state.sortKey=k;state.sort='asc';}else if(state.sort==='asc'){state.sort='desc';}else{state.sort=null;state.sortKey=null;}state.pg=1;saveFilters();pop.classList.remove('show');render(false);};});
}
function cellTitle(d){return '<div class="cell-t">'+esc(d.t)+'</div><div class="cell-s">'+esc(d.id)+'</div>';}
function cellWho(d,i){return '<div class="who">'+ava(d.by,i)+'<span><span class="cell-t" style="font-weight:500">'+esc(d.by)+'</span><br><span class="cell-s">'+esc(d.s)+'</span></span></div>';}
function cellStatus(d){return '<span class="status '+d.st[1]+'">'+esc(d.st[0])+'</span>';}
function defColDefs(t){return [{label:(t.cols[0]||'Item'),sort:'title',html:function(d){return cellTitle(d);}},{label:(t.cols[1]||'Detail'),sort:'detail',html:function(d,i){return cellWho(d,i);}},{label:(t.cols[2]||'Status'),sort:'status',html:function(d){return cellStatus(d);}}];}
function colDefsOf(t){return t.colDefs||defColDefs(t);}
function headHTML(t){
 var h='<th style="width:48px"><input type="checkbox" id="selAll" aria-label="Pilih semua di halaman ini"></th>';
  colDefsOf(t).forEach(function(c){h+=thCell(c.label,c.sort||null);});
  if(!t.hideActs)h+=thCell(t.colDefs?(t.aksi||'Aksi'):(t.cols[3]||'Aksi'),null,true);
  return h;
}
function rowCellsHTML(t,d,i){return colDefsOf(t).map(function(c){return '<td>'+c.html(d,i)+'</td>';}).join('');}
function rowActs(t,d){
 var acts=t.acts||[{l:'Detail',icn:P_EYE,do:'drawer'},{l:(t.qa||'Proses'),icn:P_CHECK,do:'drawer'}];
 var prim=acts.slice(0,2);
 var over=(t.menu||[]).concat(acts.slice(2));
 var h=prim.map(function(a){return '<button class="mini-btn" data-do="'+a.do+'" data-id="'+esc(d.id)+'">'+ic(a.icn||P_DOT,14)+'<span>'+esc(a.l)+'</span></button>';}).join('');
 if(over.length)h+='<button class="mini-btn" data-kebab="'+esc(d.id)+'" aria-label="Aksi lainnya" aria-haspopup="true" style="padding:0 9px">'+ic(P_DOT,14)+'</button>';
 return h;
}
function openKebab(btn,d,t){
 var items=(t.menu||[]).concat(((t.acts||[]).slice(2)));
 if(!items.length)return;
 var pop=$('#kebabPop');
 popStay();pop.onmouseenter=null;pop.onmouseleave=null;
 pop.innerHTML=items.map(function(a,i){return '<button data-k="'+i+'" role="menuitem">'+ic(a.icn||P_DOT,15)+'<span>'+esc(a.l)+'</span></button>';}).join('');
 pop.classList.add('show');
 var r=btn.getBoundingClientRect();
 var pw=pop.offsetWidth||200,ph=pop.offsetHeight||120;
 var x=r.right-pw;if(x<12)x=12;if(x+pw>window.innerWidth-12)x=window.innerWidth-pw-12;
 var y=r.bottom+6;if(y+ph>window.innerHeight-12)y=r.top-ph-6;if(y<12)y=12;
 pop.style.left=x+'px';pop.style.top=y+'px';
 pop.querySelectorAll('[data-k]').forEach(function(b){b.onclick=function(e){e.stopPropagation();pop.classList.remove('show');var a=items[+b.getAttribute('data-k')];if(a)doAct(d.id,a.do);};});
}
function findRow(page,id){var t=featOf(page);var out=null;(t.rows||[]).forEach(function(x){if(String(x.id)===String(id))out=x;});return {t:t,d:out};}
function setChip(t,id,label,cls){var out=null;(t.rows||[]).forEach(function(r){if(r.id===id){r.st=[label,cls];r.chip=label;out=r;}});return out;}
function emptyHTML(t,create){var e=t.empty||{t:'Tidak ada hasil',d:'Ubah filter atau kata kunci.',c:'Reset filter'};return '<div class="empty"><div class="eico">'+ic(P_INBOX,24)+'</div><b>'+esc(e.t)+'</b><br><span style="font-size:12.5px">'+esc(e.d)+'</span><br><br><button class="btn sm" data-reset>Reset filter</button>'+(create?' <button class="btn sm primary" data-new>'+esc(e.c||('Buat '+t.title))+'</button>':'')+'</div>';}
function pgNum(pages){pages=Math.max(1,pages||1);var cur=Math.min(Math.max(1,state.pg),pages);
 var h='<button data-pg="1"'+(cur<=1?' disabled':'')+' aria-label="Halaman pertama">'+ic('ti-chevrons-left',16)+'</button>';
 h+='<button data-pg="prev"'+(cur<=1?' disabled':'')+' aria-label="Halaman sebelumnya">'+ic(P_CHL,16)+'</button>';
 var list=[];if(pages<=7){for(var p=1;p<=pages;p++)list.push(p);}
 else{list.push(1);var s=Math.max(2,cur-1),e=Math.min(pages-1,cur+1);if(cur<=3){s=2;e=4;}if(cur>=pages-2){s=pages-3;e=pages-1;}if(s>2)list.push(0);for(var q=s;q<=e;q++)list.push(q);if(e<pages-1)list.push(0);list.push(pages);}
 list.forEach(function(p){if(!p){h+='<span class="cell-s" aria-hidden="true" style="align-self:center;padding:0 4px">…</span>';return;}h+='<button data-pg="'+p+'" class="'+(p===cur?'on':'')+'" aria-label="Halaman '+p+'"'+(p===cur?' aria-current="page"':'')+'>'+p+'</button>';});
 h+='<button data-pg="next"'+(cur>=pages?' disabled':'')+' aria-label="Halaman berikutnya">'+ic(P_CHR,16)+'</button>';
 h+='<button data-pg="'+pages+'"'+(cur>=pages?' disabled':'')+' aria-label="Halaman terakhir">'+ic('ti-chevrons-right',16)+'</button>';
 return h;}
function pgPN(pages,prev,next){return '<button data-pg="prev"'+(state.pg<=1?' disabled':'')+'>'+(prev||'Sebelumnya')+'</button><button data-pg="next"'+(state.pg>=pages?' disabled':'')+'>'+(next||'Berikutnya')+'</button>';}
function tfootHTML(total,label,pg){return '<div class="tfoot"><span><b style="color:var(--text-h)">'+total+'</b> '+label+'</span><span class="pg">'+pg+'</span></div>';}
function skelHTML(n,h){var s='';for(var i=0;i<n;i++)s+='<div class="skel" style="height:'+h+'px'+(i?';margin-top:10px':'')+'"></div>';return '<div style="padding:14px 16px" aria-hidden="true">'+s+'</div>';}
function searchField(ph,style){var has=!!state.q;return '<span class="fsearch"'+(style?' style="'+style+'"':'')+'>'+ic(P_SEARCH,17)+'<input type="text" class="rowQ" placeholder="'+esc(ph)+'" value="'+esc(state.q)+'" aria-label="'+esc(ph)+'" autocomplete="off" role="searchbox">'+(has?'<button class="rowClear" data-clear-q aria-label="Hapus pencarian">'+ic(P_X,15)+'</button>':'')+'</span>';}
function resetTable(){state.flt=[];state.q='';state.sort=null;state.sortKey=null;state.pg=1;saveFilters();render(false);toast('Filter direset');}
function tableCard(page,t,preview){
 var rows=filteredRows(t);
 var total=rows.length;var pages=Math.max(1,Math.ceil(total/PG_SIZE));
 if(state.pg>pages)state.pg=pages;
 var pageRows=preview?rows.slice(0,4):rows.slice((state.pg-1)*PG_SIZE,state.pg*PG_SIZE);
 var body;
  if(state.loading)body=skelHTML(3,44);
  else if(!rows.length)body=emptyHTML(t,!!(t.form||t.cat!=='system'));
   else body='<div class="tbl-wrap"><table'+(page==='referrals'?' class="tbl-ref"':'')+'><thead><tr>'+headHTML(t)+'</tr></thead><tbody>'
  +pageRows.map(function(d,i){return '<tr data-row="'+esc(d.id)+'" tabindex="0" class="'+(state.sel[d.id]?'selected':'')+'"><td class="sel-cell"><input type="checkbox" data-sel="'+esc(d.id)+'"'+(state.sel[d.id]?' checked':'')+' aria-label="Pilih '+esc(d.t)+'"></td>'+rowCellsHTML(t,d,i)+(t.hideActs?'':'<td><div class="rowact">'+rowActs(t,d)+'</div></td>')+'</tr>';}).join('')+'</tbody></table></div>';
  var selIds=Object.keys(state.sel).filter(function(id){return state.sel[id];});
 var bulk=selIds.length?'<div class="bulkbar" role="status">'+selIds.length+' dipilih <button class="mini-btn" data-bulk="process">Tandai diproses</button><button class="mini-btn" data-bulk="archive">Arsipkan</button><button class="mini-btn danger" data-bulk="delete">Hapus</button><button class="mini-btn" data-clear>Batal</button></div>':'';
   var pgBtns=preview?'':pgNum(pages);
  var headLeft='<h2>'+esc(t.title)+'</h2>';
   return '<div class="card"><div class="card-h"><div><div>'+headLeft+'</div></div><div class="sp">'
   +(preview?'<button class="link" data-goto="'+esc(page)+'">Lihat semua</button>':'<button class="link" data-t="Menyiapkan export…">'+ic(P_DOWNLOAD,15)+'Export</button>')
   +'</div></div>'
   +(preview?'':filterBarHTML(t,'Cari nama, ID, email…'))
   +bulk+body
    +(preview?'':tfootHTML(total,'dari '+(t.rows||[]).length+' data',pgBtns))+'</div>';
}
function hello(){return state.role==='soal'?'Halo, Tim Soal':state.role==='marketing'?'Halo, Marketing':state.role==='user'?'Halo, Tim User':'Halo, Admin';}
function adForm(editId,draft){
 modalFocus=document.activeElement;
 var d=editId?adFind(editId):null;
 if(draft){d={t:draft.t||'',label:draft.label||'',button:draft.button||'',link:draft.link||'',desc:draft.desc||'',img:draft.img||'',order:draft.order||0,mulai:'Belum diatur',selesai:'Belum diatur'};}
 var variant=(draft&&draft.variant)||(d?(d.variant||'full'):'full');
 var pickedImg=d?(d.img||''):'';
 var mediaRows=(featOf('media').rows||[]).filter(function(m){return (m.mime||'').indexOf('image')===0;});
 var dur0=d?((d.mulai&&d.mulai!=='Belum diatur')?'custom':''):'7';
 function pickTiles(){
  return '<button data-picknew="1" style="border:2px dashed var(--border);border-radius:12px;background:none;padding:10px;cursor:pointer;min-height:104px;font-family:inherit;color:var(--text-2);font-size:12.5px;font-weight:600;display:flex;flex-direction:column;gap:6px;align-items:center;justify-content:center">'+ic(P_PLUS,20)+'Unggah baru</button>'
  +mediaRows.map(function(m){var on=pickedImg===m.t;return '<button data-pick="'+esc(m.t)+'" title="'+esc(m.t)+'" style="border:2px solid '+(on?'var(--primary)':'var(--border)')+';border-radius:12px;background:var(--bg-hover);padding:8px;cursor:pointer;min-height:104px;font-family:inherit;position:relative"><span style="height:52px;display:grid;place-items:center;color:var(--text-3)">'+ic(mediaIcon(m),26)+'</span><span class="cell-t" style="font-size:11px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(m.t)+'</span>'+(on?'<span style="position:absolute;top:6px;right:6px;width:20px;height:20px;border-radius:50%;background:var(--primary);color:#fff;display:grid;place-items:center">'+ic(P_CHECK,12)+'</span>':'')+'</button>';}).join('');
 }
 $('#modalBox').innerHTML='<div class="modal-h"><h3>'+(d?'Ubah iklan':'Tambah iklan')+'</h3><p>Atur format, materi, jadwal, dan penempatan.</p></div>'
 +'<div class="modal-b">'
 +'<div class="dsec"><h4>Konten & media</h4><div style="display:flex;flex-direction:column;gap:13px;margin-top:10px">'
 +'<div class="field"><label>Tipe iklan</label><div class="seg" role="group" aria-label="Tipe iklan"><button data-av="full" class="'+(variant==='full'?'on':'')+'">Lengkap</button><button data-av="image_only" class="'+(variant==='image_only'?'on':'')+'">Gambar saja</button></div></div>'
 +'<div class="field" id="afWLabel"><label for="afLabel">Label</label><input id="afLabel" value="'+esc(d?(d.label||''):'Pendaftaran Dibuka')+'"><span class="ferr" id="afeLabel"></span></div>'
 +'<div class="field"><label for="afTitle">Judul</label><input id="afTitle" value="'+esc(d?(d.t||''):'')+'" placeholder="cth: TO Akbar 13 dibuka"><span class="ferr" id="afeTitle"></span></div>'
 +'<div class="field" id="afWDesc"><label for="afDesc">Deskripsi <small>(opsional)</small></label><textarea id="afDesc">'+esc(d?(d.desc||''):'')+'</textarea><span class="ferr" id="afeDesc"></span></div>'
 +'<div class="field" id="afWButton"><label for="afButton">Teks tombol</label><input id="afButton" value="'+esc(d?(d.button||''):'Lihat Info Pendaftaran')+'"><span class="ferr" id="afeButton"></span></div>'
 +'<div class="field"><label for="afLink">Tautan tujuan <small>(opsional)</small></label><input id="afLink" value="'+esc(d?(d.link||''):'')+'" placeholder="https://…"><span class="ferr" id="afeLink"></span></div>'
 +'<div class="field"><label>Gambar</label><div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:8px" id="afPick">'+pickTiles()+'</div><span class="ferr" id="afeImg"></span></div>'
 +'<div class="field"><label>Pratinjau</label><div id="afPrev" style="aspect-ratio:16/9;border-radius:12px;background:var(--bg-hover);display:grid;place-items:center;color:var(--text-3);font-size:12.5px;font-weight:600">Pratinjau iklan</div></div>'
 +'<div class="field"><label for="afOrder">Urutan tampil</label><input id="afOrder" type="number" value="'+(d?(d.order||0):0)+'" inputmode="numeric"><span class="ferr" id="afeOrder"></span></div>'
 +'</div></div>'
 +'<div class="dsec"><h4>Jadwal</h4><div style="display:flex;flex-direction:column;gap:13px;margin-top:10px">'
 +'<div class="field"><label for="afDur">Lama tayang</label><select id="afDur" aria-label="Lama tayang"><option value="">Tanpa batas</option><option value="7">7 hari</option><option value="14">14 hari</option><option value="30">30 hari</option><option value="custom">Kustom</option></select></div>'
 +'<div class="field"><label for="afStart">Mulai tayang</label><input id="afStart" type="datetime-local"><span class="ferr" id="afeStart"></span></div>'
 +'<div class="field" id="afWEnd"><label for="afEnd">Selesai tayang</label><input id="afEnd" type="datetime-local"><span class="ferr" id="afeEnd"></span><span class="fhint" id="afEndHint"></span></div>'
 +'</div></div>'
 +'<div class="dsec"><h4>Penempatan</h4><div style="font-size:12.8px;color:var(--text-2);margin-top:6px">Posisi tetap: Beranda.</div></div>'
 +'</div>'
 +'<div class="modal-f"><button class="btn" id="afCancel">Batal</button><button class="btn primary" id="afOk">'+(d?'Simpan':'Buat')+'</button></div>';
 $('#modalOv').classList.add('show');
 $('#afDur').value=dur0;
 function setVariant(v){variant=v;$('#modalBox').querySelectorAll('[data-av]').forEach(function(b){b.classList.toggle('on',b.getAttribute('data-av')===v);});var full=(v==='full');$('#afWLabel').style.display=full?'':'none';$('#afWButton').style.display=full?'':'none';$('#afWDesc').style.display=full?'':'none';}
 function refreshDur(){var dv=$('#afDur').value;$('#afWEnd').style.display=dv==='custom'?'':'none';var st=$('#afStart').value;var hint=$('#afEndHint');if(dv&&dv!=='custom'&&st){var dt=new Date(st);if(!isNaN(dt)){dt.setDate(dt.getDate()+ +dv);hint.textContent='Berakhir otomatis: '+dt.toLocaleDateString('id-ID',{day:'numeric',month:'short',year:'numeric'});return;}}hint.textContent='';}
 $('#modalBox').querySelectorAll('[data-av]').forEach(function(b){b.onclick=function(){setVariant(b.getAttribute('data-av'));};});
 $('#afDur').onchange=refreshDur;$('#afStart').onchange=refreshDur;
 function refreshPrev(){var pv=$('#afPrev');if(!pv)return;if(pickedImg){pv.innerHTML='<span style="padding:0 12px;text-align:center;font-size:12px">'+esc(pickedImg)+'</span>';}else{pv.textContent='Pratinjau iklan';}}
 function bindPicks(){
  $('#modalBox').querySelectorAll('[data-pick]').forEach(function(x){x.onclick=function(){var vv=x.getAttribute('data-pick');pickedImg=(pickedImg===vv?'':vv);$('#afPick').innerHTML=pickTiles();bindPicks();refreshPrev();};});
  var pn=$('#modalBox').querySelector('[data-picknew]');if(pn)pn.onclick=function(){var stash={t:$('#afTitle').value,label:$('#afLabel').value,button:$('#afButton').value,link:$('#afLink').value,desc:$('#afDesc').value,order:$('#afOrder').value,img:pickedImg,variant:variant,dur:$('#afDur').value,start:$('#afStart').value,end:$('#afEnd').value};mediaUpload(function(row){adForm(editId,stash);pickedImg=row.t;$('#afPick').innerHTML=pickTiles();bindPicks();refreshPrev();});};
 }
 bindPicks();refreshPrev();
 setVariant(variant);if(draft){$('#afDur').value=draft.dur||'';$('#afStart').value=draft.start||'';$('#afEnd').value=draft.end||'';}refreshDur();
 $('#afCancel').onclick=closeModal;
 $('#afOk').onclick=function(){
  var vTitle=$('#afTitle').value.trim(),vLabel=$('#afLabel').value.trim(),vDesc=$('#afDesc').value.trim(),vButton=$('#afButton').value.trim(),vLink=$('#afLink').value.trim(),vOrder=$('#afOrder').value.trim(),vStart=$('#afStart').value,dv=$('#afDur').value,vEnd=$('#afEnd').value;
  var ok=true;
  function mark(id,msg){var f=$('#'+id),e=$('#afe'+id.slice(2));if(f)f.classList.toggle('bad',!!msg);if(e){e.textContent=msg||'';e.classList.toggle('show',!!msg);}if(msg)ok=false;}
  mark('afLabel',(variant==='full'&&!vLabel)?'Label wajib diisi.':'');
  if(!vTitle)mark('afTitle','Judul wajib diisi.');else if(vTitle.length>160)mark('afTitle','Judul maksimal 160 karakter.');else mark('afTitle','');
  mark('afDesc',(vDesc.length>2000)?'Deskripsi maksimal 2000 karakter.':'');
  mark('afButton',(variant==='full'&&!vButton)?'Teks tombol wajib diisi.':'');
  mark('afLink',(vLink&&!/^(https?:\/\/|\/)[^\s]+$/.test(vLink))?'URL tujuan hanya boleh http, https, atau path relatif.':'');
  mark('afOrder',(!/^\d+$/.test(vOrder))?'Urutan tidak boleh kurang dari 0.':'');
  var errImg=$('#afeImg');if(variant==='image_only'&&!pickedImg){errImg.textContent='Gambar wajib dipilih untuk iklan gambar saja.';errImg.classList.add('show');ok=false;}else{errImg.textContent='';errImg.classList.remove('show');}
  if(dv&&!vStart)mark('afStart','Waktu mulai wajib diisi.');else mark('afStart','');
  if(dv==='custom'){if(!vEnd)mark('afEnd','Waktu selesai wajib diisi.');else if(vStart&&vEnd<=vStart)mark('afEnd','Waktu selesai harus setelah waktu mulai.');else mark('afEnd','');}else mark('afEnd','');
  if(!ok){var bad1=$('#modalBox').querySelector('.bad');if(bad1)bad1.focus();return;}
  var t=featOf('ads');
  var sched=dv?(dv==='custom'?'kustom':dv+' hari'):'tanpa batas';
  if(d){d.t=vTitle||'Iklan gambar';d.variant=variant;d.label=variant==='full'?vLabel:'Iklan';d.button=variant==='full'?vButton:'Lihat iklan';d.link=vLink;d.img=pickedImg||null;d.order=+vOrder;d.mulai=vStart?vStart.replace('T',', '):'Belum diatur';d.selesai=(dv==='custom'&&vEnd)?vEnd.replace('T',', '):(dv?sched:'Belum diatur');d.s=(variant==='full'?'lengkap':'gambar saja')+' · '+sched+' · beranda';toast('Iklan diperbarui');}
  else{t.rows.unshift({id:'ADS-'+Math.floor(100+Math.random()*900),t:vTitle||'Iklan gambar',s:(variant==='full'?'lengkap':'gambar saja')+' · '+sched+' · beranda',st:['Draft','gray'],by:'Raka',chip:'Draft',variant:variant,label:variant==='full'?vLabel:'Iklan',button:variant==='full'?vButton:'Lihat iklan',link:vLink,img:pickedImg||null,order:+vOrder,mulai:vStart?vStart.replace('T',', '):'Belum diatur',selesai:(dv==='custom'&&vEnd)?vEnd.replace('T',', '):(dv?sched:'Belum diatur')});toast('Iklan dibuat');}
  closeModal();saveFilters();render(false);
 };
 var f0=$('#afTitle');if(f0)f0.focus();
}
function dashMarketing(){
 var r=ROLES.marketing;
 var today=new Date().toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
 var kpis=kpiHTML(r);
  var heroes=heroBtnsHTML(r);
  var sts=stSorted();
  var stm=stTotals();
  var stActive=sts.filter(function(x){return x.isActive;}).length;
  var streak='<div class="card"><div class="card-h"><div><div><h2>Tugas Streak</h2><p>'+stActive+' aktif dari '+sts.length+' tugas · '+stm.today+' selesai hari ini</p></div></div><div class="sp"><button class="link" data-goto="streak-tasks">Kelola tugas</button></div></div>'
  +'<div style="padding:16px 16px 16px;display:flex;flex-direction:column;gap:12px">'
  +'<div class="kpis" style="margin:0;padding:0;grid-template-columns:repeat(3,1fr)">'
  +'<div class="kpi"><div class="kh"><span class="lbl">Selesai · '+stm.days+' hari</span></div><div class="val">'+stm.total.toLocaleString('id-ID')+'</div></div>'
  +'<div class="kpi"><div class="kh"><span class="lbl">Selesai hari ini</span></div><div class="val">'+stm.today.toLocaleString('id-ID')+'</div></div>'
  +'<div class="kpi"><div class="kh"><span class="lbl">Tugas aktif</span></div><div class="val">'+stActive+'/'+sts.length+'</div></div>'
  +'</div>'
  +(sts.length?sts.slice(0,3).map(function(x){var per=x.period==='daily'?'harian':x.period==='weekly'?'mingguan':'sekali';return '<button class="st-mini" data-stdopen="'+esc(x.id)+'" aria-label="Buka '+esc(x.title)+'"><span class="et"><span class="et-t">'+esc(x.title)+'</span><br><time>'+(x.targetCount||1)+'x / '+per+' · +'+(x.rewardAmount||0)+' koin · '+esc(STTASK_STATUS_LBL[x.status]||x.status)+'</time></span><span style="color:var(--text-3);flex:0 0 auto">'+ic(P_CHR,16)+'</span></button>';}).join(''):'<span class="cell-s">Belum ada tugas streak. Buat tugas pertama.</span>')
  +'</div></div>';
  var socials=(featOf('social-media').rows||[]);
  var active=socials.filter(function(x){return x.chip==='Aktif';});
  var kanal='<div class="card"><div class="card-h"><div><div><h2>Kanal aktif</h2><p>'+active.length+' aktif dari '+socials.length+' akun · urut sesuai daftar</p></div></div><div class="sp"><button class="link" data-goto="social-media">Kelola medsos</button></div></div><div class="act-list">'
  +(active.length?active.slice(0,3).map(function(s){var tl=socTile(s.platform);return '<div class="ev"><span class="ev-ic" style="background:'+tl[0]+';color:'+tl[1]+';border-color:transparent">'+ic(SOCICON[s.platform]||'ti-share-2',17)+'</span><div class="et"><div class="et-t">'+esc(s.t)+'</div><time>'+esc(s.url||'')+' · tampil di profil</time></div><span class="status green">Aktif</span></div>';}).join(''):'<div style="padding:4px 16px 16px"><span class="cell-s">Tidak ada akun aktif. Aktifkan dari daftar.</span></div>')
  +'</div></div>';
  var arts=(featOf('articles').rows||[]);
  var artCard='<div class="card"><div class="card-h"><div><div><h2>Artikel portal</h2><p>'+arts.length+' artikel grup “artikel” · dari portal</p></div></div><div class="sp"><button class="link" data-goto="articles">Kelola artikel</button></div></div><div class="act-list">'
  +(arts.length?arts.slice(0,3).map(function(a){return '<div class="ev"><div class="et"><div class="et-t">'+esc(a.t)+'</div><time>'+esc(a.published||'')+'</time></div><span class="status '+a.st[1]+'">'+esc(a.st[0])+'</span></div>';}).join(''):'<div style="padding:4px 16px 16px"><span class="cell-s">Belum ada artikel. Simpan konfigurasi portal.</span></div>')
  +'</div></div>';
   return '<div class="hero"><div><h1>Halo, Marketing</h1><p>'+today+' · '+esc(r.tagline)+'</p></div><div class="hero-actions">'+heroes+'</div></div>'
   +'<div class="kpis k3">'+kpis+'</div>'
   +'<div class="grid2">'+'<div style="display:flex;flex-direction:column;gap:14px;min-width:0">'+streak+'</div>'+'<div style="display:flex;flex-direction:column;gap:14px;min-width:0">'+kanal+artCard+'</div></div>'
  +dashFoot();
}
