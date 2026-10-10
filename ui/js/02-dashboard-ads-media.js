/* 02-dashboard-ads-media.js — Dashboard, iklan, media.
   Dipisah otomatis dari DESIGN ADMIN/new-admin.html. Muat BERURUTAN via <script> di index.html (classic script, globals bersama). */
function dashView(){
 if(state.role==='marketing')return dashMarketing();
 var r=ROLES[state.role];var t=featOf('dashboard');
 var today=new Date().toLocaleDateString('id-ID',{weekday:'long',day:'numeric',month:'long',year:'numeric'});
 var kpis=kpiHTML(r);
 var dd=DASH[state.role];var days=['Sen','Sel','Rab','Kam','Jum','Sab','Min'];
 var heroes=heroBtnsHTML(r);
 var q=featOf(t.queue);
 return '<div class="hero"><div><h1>'+hello()+'</h1><p>'+today+' · '+esc(r.tagline)+'</p></div><div class="hero-actions">'+heroes+'</div></div>'
  +'<div class="kpis">'+kpis+'</div>'
  +'<div class="grid2"><div class="card"><div class="card-h"><div><div><h2>Aktivitas 7 hari</h2><p>Pengerjaan & pendaftaran · diperbarui otomatis</p></div></div><div class="sp"><div class="seg" role="group" aria-label="Rentang"><button data-range="7" class="'+(state.range==='7'?'on':'')+'">7</button><button data-range="30" class="'+(state.range==='30'?'on':'')+'">30</button><button data-range="90" class="'+(state.range==='90'?'on':'')+'">90</button></div></div></div><div class="chart">'+areaChart(dd.act)+'</div><div class="chart-legend"><span><i style="background:var(--primary)"></i>Aktivitas</span><span>'+days.join(' · ')+'</span></div></div>'
  +'<div class="card"><div class="card-h"><div><div><h2>Registrasi & perangkat</h2><p>Sumber & perangkat pelajar</p></div></div></div>'+barsHTML(dd.reg)+dd.dev.map(function(d){return '<div class="kvline"><span>'+esc(d[0])+'</span><b>'+d[1]+'%</b></div>';}).join('')+'<div class="kvline"><span>Sumber teratas</span><b>'+esc(dd.ref[0][0])+' · '+dd.ref[0][1]+'</b></div><div style="height:10px"></div></div></div>'
  +tableCard(t.queue,q,true)
  +(state.role==='admin'?matrixHTML():'')
  +dashFoot();
}
function listHero(page,t,actions){return '<div class="hero"><div><h1>'+esc(t.title)+'</h1><p>'+esc(t.sub||'')+'</p><p class="cell-s" style="margin-top:6px">Bisa dibuka oleh: '+esc(rolesFor(page))+'</p></div><div class="hero-actions"><button class="btn" data-t="Menyiapkan export…">'+ic(P_FILE,17)+'Export</button>'+actions+'</div></div>';}
function listFoot(){return '<div style="height:56px"></div>';}
function dashFoot(){return '<div style="height:56px"></div>';}
function kpiHTML(r){return r.kpis.map(function(k){return '<button class="kpi '+k.c+'" data-goto="'+k.go+'"><div class="kh"><span class="lbl">'+esc(k.l)+'</span></div><div class="vrow"><span class="val">'+esc(k.v)+'</span><span class="delta '+k.c+'">'+esc(k.d)+'</span></div><div class="sub dot">'+esc(k.s)+'</div></button>';}).join('');}
function heroBtnsHTML(r){return r.heroes.map(function(h){return '<button class="btn '+(h[3]||'')+'" data-hero-go="'+h[2]+'"'+(h[4]?' data-hero-new="1"':'')+'>'+ic(h[4]?P_PLUS:P_ZAP,17)+esc(h[0])+'</button>';}).join('');}
var ADST={Draft:['Draft','gray'],Menunggu:['Menunggu','amber'],Tayang:['Tayang','green'],Selesai:['Selesai','gray']};
var ADFLOW={Draft:['Menunggu','Tayang','Selesai'],Menunggu:['Draft','Tayang','Selesai'],Tayang:['Draft','Menunggu','Selesai'],Selesai:['Draft','Menunggu','Tayang']};
var ADFLOWLBL={Draft:'Jadikan Draft',Menunggu:'Jadwalkan',Tayang:'Jadikan Tayang',Selesai:'Tandai Selesai'};
function adCardHTML(d){
 var vlabel=d.variant==='full'?'Lengkap':'Gambar saja';
 var opts=['Draft','Menunggu','Tayang','Selesai'].map(function(s){return '<option'+(d.chip===s?' selected':'')+'>'+s+'</option>';}).join('');
 var foot='<div style="margin-top:auto;display:flex;gap:6px;align-items:center;flex-wrap:wrap;border-top:1px solid var(--border-soft);padding-top:10px"><button class="mini-btn" data-adedit="'+esc(d.id)+'">'+ic(P_PENCIL,14)+'<span>Ubah</span></button><select class="mini-btn" data-adflow="'+esc(d.id)+'" aria-label="Ubah status '+esc(d.t)+'">'+opts+'</select><span style="margin-left:auto;display:flex;gap:6px"><button class="mini-btn" data-addup="'+esc(d.id)+'" aria-label="Duplikat sebagai Draft">'+ic(P_COPY,14)+'<span>Duplikat</span></button><button class="mini-btn ic danger" data-addel="'+esc(d.id)+'" title="Hapus iklan" aria-label="Hapus iklan">'+ic(P_TRASH,14)+'</button></span></div>';
  var prev='<div style="aspect-ratio:16/9;background:var(--bg-hover);border-radius:14px 14px 0 0;padding:12px;display:flex;justify-content:space-between;align-items:flex-start;color:var(--text-3)">'+ic('ti-photo',26)+'<span style="display:flex;gap:6px"><span class="status '+d.st[1]+'">'+esc(d.st[0])+'</span></span></div>';
 return '<article class="card" style="box-shadow:none;display:flex;flex-direction:column;min-width:0">'+prev+'<div style="padding:14px 14px 12px;display:flex;flex-direction:column;gap:8px;flex:1">'
  +'<div><div class="cell-t" style="font-size:17px">'+esc(d.t)+'</div>'+(d.variant==='full'&&d.label?'<div class="cell-s" style="margin-top:2px">'+esc(d.label)+' · '+esc(vlabel)+'</div>':'<div class="cell-s" style="margin-top:2px">'+esc(vlabel)+'</div>')+'</div>'
  +(d.perf?'<div style="display:flex;align-items:center;gap:10px;background:var(--bg-hover);border-radius:10px;padding:10px 12px"><div style="min-width:0;flex:1"><div style="font-family:Poppins,Inter,system-ui,sans-serif;font-size:19px;font-weight:600;line-height:1.1;color:var(--text-h)">'+esc(d.perf.clicks)+'</div><div class="cell-s">klik</div></div><span class="status green">CTR '+esc(d.perf.ctr)+'</span></div>':'')
  +'<div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;background:var(--bg-hover);border-radius:10px;padding:10px 12px;font-size:12px;color:var(--text-2)"><span>Mulai<br><b style="color:var(--text-h)">'+esc(d.mulai||'—')+'</b></span><span>Selesai<br><b style="color:var(--text-h)">'+esc(d.selesai||'—')+'</b></span></div>'
  +foot+'</div></article>';
}
function adsView(page,t){
 var rows=filteredRows(t);
 var total=rows.length;var pages=Math.max(1,Math.ceil(total/PG_SIZE));
 if(state.pg>pages)state.pg=pages;
 var pageRows=rows.slice((state.pg-1)*PG_SIZE,state.pg*PG_SIZE);
 var body;
 if(state.loading)body=skelHTML(2,200);
  else if(!rows.length)body='<div style="margin:14px 16px;border:1px dashed var(--border);border-radius:14px;padding:36px 20px;text-align:center;color:var(--text-2)"><b>Belum ada iklan untuk filter ini.</b><br><br><button class="btn sm" data-reset>Reset filter</button></div>';
 else body='<div class="adsgrid" style="display:grid;grid-template-columns:1fr;gap:12px;padding:14px 16px">'+pageRows.map(adCardHTML).join('')+'</div>';
  return listHero(page,t,'<button class="btn" data-adtemp>'+ic(P_GRID,17)+'Dari template</button><button class="btn primary" data-new>'+ic(P_PLUS,17)+'Tambah Iklan</button>')
   +'<div class="card"><div class="card-h"><div><div><h2>'+esc(t.title)+'</h2></div></div><div class="sp">'+(hasResetF()?'<button class="link" data-reset>Reset</button>':'')+'</div></div>'+filterBarHTML(t,'Cari iklan…')
   +body+tfootHTML(total,'iklan',pgPN(pages))+'</div>'+listFoot();
}
function adDuplicate(id){var t=featOf('ads');var d=adFind(id);if(!d)return;var c={};for(var k in d)c[k]=d[k];c.id='ADS-'+Math.floor(100+Math.random()*900);c.chip='Draft';c.st=['Draft','gray'];t.rows.unshift(c);saveFilters();render(false);toast('Iklan diduplikat sebagai Draft');}
function adTemplateModal(){
 modalFocus=document.activeElement;
  var temps=[{t:'Promo Try Out',s:'Label + jadwal 7 hari',variant:'full',label:'Pendaftaran Dibuka',button:'Lihat Info',dur:'7',icn:'ti-speakerphone',bg:'#B45309'},{t:'Cerita Lolos',s:'Gambar saja + tanpa batas',variant:'image_only',label:'',button:'',dur:'',icn:'ti-photo',bg:'#1D4ED8'}];
  $('#modalBox').innerHTML='<div class="modal-h"><h3>Dari template</h3><p>Pilih pola, langsung jadi Draft.</p></div><div class="modal-b">'+temps.map(function(tp,i){return '<button data-aduse="'+i+'" style="display:flex;gap:11px;align-items:center;text-align:left;border:1px solid var(--border);background:var(--bg-card);border-radius:12px;padding:12px;cursor:pointer;font-family:inherit;width:100%"><span class="qi" style="background:'+tp.bg+'">'+ic(tp.icn,17)+'</span><span><b style="font-size:13px;color:var(--text-h);display:block">'+tp.t+'</b><small style="font-size:12px;color:var(--text-2)">'+tp.s+'</small></span></button>';}).join('')+'</div><div class="modal-f"><button class="btn" id="atCancel">Batal</button></div>';
 $('#modalOv').classList.add('show');
 $('#atCancel').onclick=closeModal;
 $('#modalBox').querySelectorAll('[data-aduse]').forEach(function(b){b.onclick=function(){var tp=temps[+b.getAttribute('data-aduse')];var t=featOf('ads');t.rows.unshift({id:'ADS-'+Math.floor(100+Math.random()*900),t:tp.t+' — pola baru',s:(tp.variant==='full'?'lengkap':'gambar saja')+' · pola template',st:['Draft','gray'],by:'Raka',chip:'Draft',variant:tp.variant,label:tp.label,button:tp.button,link:'',img:null,order:0,mulai:'Belum diatur',selesai:'Belum diatur'});closeModal();saveFilters();render(false);toast('Iklan dibuat dari template');};});
}
function adFind(id){return findRow('ads',id).d;}
function adApply(id,target){var m=ADST[target]||ADST.Draft;var d=setChip(featOf('ads'),id,m[0],m[1]);if(!d)return null;saveFilters();render(false);return d;}
function adFlow(id,target){
 if(target==='Tayang'){openModal({title:'Tayangkan iklan ini?',sub:'Iklan tampil di Beranda sesuai jadwal yang diatur.',fields:[],submit:'Tayangkan',onSubmit:function(){adApply(id,'Tayang');toast('Status iklan diperbarui');}});return;}
 adApply(id,target);toast('Status iklan diperbarui');
}
function adDelete(id){
 var d=adFind(id);
 openConfirm('Hapus iklan '+((d&&d.t)||id)+'?', 'Iklan hilang dari daftar dan berhenti tayang.', 'Hapus', function(){
  var t=featOf('ads');var gone=[];t.rows=(t.rows||[]).filter(function(r){if(r.id===id){gone.push(r);return false;}return true;});render(false);
  toast('Iklan dihapus',null,null,{label:'Urungkan',fn:function(){gone.forEach(function(r){t.rows.unshift(r);});render(false);}});
 });
}
var VIEWS={};
function mediaIcon(d){var m=d.mime||'';if(m.indexOf('audio')===0)return 'ti-music';if(m.indexOf('image')===0)return 'ti-photo';if(m.indexOf('video')===0)return 'ti-video';return 'ti-file-text';}
function mediaView(page,t){
 var rows=filteredRows(t);
 var total=rows.length;var pages=Math.max(1,Math.ceil(total/PG_SIZE));
 if(state.pg>pages)state.pg=pages;
 var pageRows=rows.slice((state.pg-1)*PG_SIZE,state.pg*PG_SIZE);
 var body;
 if(state.loading)body=skelHTML(1,120);
  else if(!rows.length)body='<div style="margin:14px 16px;border:1px dashed var(--border);border-radius:14px;padding:36px 20px;text-align:center;color:var(--text-2)"><b>Belum ada media.</b><br><span style="font-size:12.5px">Unggah gambar, audio, atau dokumen.</span><br><br><button class="btn sm" data-reset>Reset filter</button></div>';
  else body='<div class="masonry">'+pageRows.map(function(d,ix){
  var ext=(d.t||'').split('.').pop().toUpperCase();
  return '<div class="card m-tile"><button class="m-art" data-mopen="'+esc(d.id)+'" aria-label="Buka '+esc(d.t)+'"><span style="display:flex;flex-direction:column;align-items:center;gap:6px">'+ic(mediaIcon(d),32)+'<b style="font-size:11px;letter-spacing:.06em">'+esc(ext)+'</b></span></button><div style="padding:12px 12px 10px;display:flex;flex-direction:column;gap:7px"><span><span class="cell-t" style="font-size:12.5px;display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(d.t)+'</span><span class="cell-s">'+esc(d.cat||'')+' · '+esc(d.size||'')+'</span></span><span style="display:flex;gap:6px;align-items:center">'+byAvatar(d.by,ix)+'<span class="status '+d.st[1]+'">'+esc(d.st[0])+'</span><span class="m-quick" style="margin-left:auto"><button class="mini-btn ic" data-mdown="'+esc(d.id)+'" title="Export" aria-label="Export">'+ic(P_DOWNLOAD,12)+'</button></span></span></div></div>';}).join('')+'</div>';
  return listHero(page,t,'<button class="btn primary" data-new>'+ic(P_PLUS,17)+'Unggah media</button>')
   +'<div class="card"><div class="card-h"><div><div><h2>'+esc(t.title)+'</h2></div></div><div class="sp">'+(hasResetF()?'<button class="link" data-reset>Reset</button>':'')+'</div></div>'+filterBarHTML(t,'Cari file…')
   +body+tfootHTML(total,'file',pgNum(pages))+'</div>'+listFoot();
}
/* ===== Bank Soal: kartu soal, bukan tabel =====
   Tampilan ini membaca soal seperti yang dilihat pelajar: nomor, teks, gambar,
   pilihan jawaban, kunci, pembahasan. Semua aksi admin tetap ada per kartu. */
var QLTR=['A','B','C','D','E','F'];
var QDIFF={'Mudah':'lv1','Sedang':'lv2','Sulit':'lv3'};
/* Kunci hanya menyorot opsi kalau isinya satu huruf A–E. Isian, uraian, dan
   menjodohkan punya kunci berupa kalimat, jadi tidak ada opsi yang disorot. */
