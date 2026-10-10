/* 05-streak-artikel.js — Tugas streak, upload media, artikel.
   Dipisah otomatis dari DESIGN ADMIN/new-admin.html. Muat BERURUTAN via <script> di index.html (classic script, globals bersama). */
function stFind(id){var t=featOf('streak-tasks');var out=null;(t.rows||[]).forEach(function(x){if(String(x.id)===String(id))out=x;});return {t:t,d:out};}
function stSorted(){var t=featOf('streak-tasks');return (t.rows||[]).slice().sort(function(a,b){return (a.sortOrder||0)-(b.sortOrder||0);});}
function stScale(m,days){if(!m)return {completedCount:0,uniqueUsers:0,completedToday:0};var f=(days||30)/30;return {completedCount:Math.round(m.completedCount*f),uniqueUsers:m.uniqueUsers,completedToday:m.completedToday};}
function stIni(s){var w=String(s||'').trim().split(/\s+/);if(!w.length||!w[0])return '??';var a=w[0][0]||'',b=w.length>1?(w[w.length-1][0]||''):'';return (a+b).toUpperCase();}
function stTypeCls(t){return t==='quiz'?'purple':t==='practice'?'green':t==='tryout'?'blue':'amber';}
function stRuleText(r){
 var pkg=(r.config&&r.config.packageType)||null;
 var per=r.period==='daily'?'hari':r.period==='weekly'?'minggu':'akun';
 var scope=r.type==='quiz'?(r.config&&r.config.subjectId?('Subject '+r.config.subjectId):'Semua subject'):r.type==='share'?'Tanpa filter':(pkg==='drill'?'Paket latihan':pkg==='tryout'?'Paket tryout':(pkg||'Semua paket'))+(r.config&&r.config.packageId?(' · ID '+r.config.packageId):'')+(r.config&&r.config.minScore!=null?(' · min '+r.config.minScore):'');
 return (r.targetCount||1)+'x / '+per+' · '+scope;
}
function stTotals(){var days=state.streakDays||30;var rows=stSorted();var tot=0,today=0;rows.forEach(function(r){var m=stScale(r.metric,days);tot+=m.completedCount;today+=m.completedToday;});return {days:days,total:tot,today:today,count:rows.length};}
function streakTasksView(page,t){
 var s=stTotals();
 var days=state.streakDays||30;
 var hero='<div class="hero"><div><h1>'+esc(t.title)+'</h1><p>'+esc(t.sub||'')+'</p><p class="cell-s" style="margin-top:6px">Bisa dibuka oleh: '+esc(rolesFor(page))+'</p></div><div class="hero-actions"><button class="btn primary" data-stnew>'+ic(P_PLUS,17)+'Tambah Tugas</button></div></div>';
 var metrics='<div class="card" style="margin-bottom:12px"><div class="card-h"><div><div><h2>Monitoring Tugas</h2></div></div><div class="sp"><div class="seg" role="group" aria-label="Periode monitoring">'+[7,30,90].map(function(v){return '<button data-strange="'+v+'" class="'+(days===v?'on':'')+'">'+v+' hari</button>';}).join('')+'</div></div></div>'
  +'<div class="kpis" style="margin:0;padding:14px 16px;grid-template-columns:repeat(3,1fr)"><div class="kpi"><div class="kh"><span class="lbl">Selesai · '+days+' hari</span></div><div class="val">'+s.total.toLocaleString('id-ID')+'</div></div>'
  +'<div class="kpi"><div class="kh"><span class="lbl">Selesai hari ini</span></div><div class="val">'+s.today.toLocaleString('id-ID')+'</div></div>'
  +'<div class="kpi"><div class="kh"><span class="lbl">Task aktif</span></div><div class="val">'+s.count+'</div></div></div></div>';
 var rows=stSorted();
 function grip(id){return '<span class="grip" data-stgrip="'+esc(id)+'" title="Tahan dan geser untuk mengurutkan" aria-label="Geser untuk mengurutkan">'+ic('ti-grip-vertical',18)+'</span>';}
  function stStick(r){
   var eff=(r._pending&&r._pending!==r.status)?r._pending:r.status;
   var lbl=STTASK_STATUS_LBL[eff]||eff;
   if(r._pending&&r._pending!==r.status)lbl+=' (belum diterbitkan)';
   var bg=eff==='active'?'var(--secondary)':eff==='paused'?'var(--gold)':'var(--text-3)';
   return '<span class="st-stick" title="Status: '+esc(lbl)+'" style="background:'+bg+'"></span>';
  }
 function stOpts(r){var cur=r._pending||r.status;return Object.keys(STTASK_STATUS_LBL).map(function(k){return '<option value="'+k+'"'+(cur===k?' selected':'')+'>'+STTASK_STATUS_LBL[k]+'</option>';}).join('');}
 function stPending(){return stSorted().filter(function(r){return r._pending&&r._pending!==r.status;});}
 function stPubBtn(){var n=stPending().length;return n?'<button class="btn sm primary" data-stpub>Tinjau & terbitkan ('+n+')</button>':'';}
 function stPublish(){
  var list=stPending();
  if(!list.length)return;
  modalFocus=document.activeElement;
  $('#modalBox').innerHTML='<div class="modal-h"><h3>Tinjau '+list.length+' perubahan</h3><p>Periksa sebelum tayang ke siswa. Belum ada yang berubah online.</p></div>'
  +'<div class="modal-b">'+list.map(function(r){return '<div style="display:flex;gap:8px;align-items:center;padding:10px 0;border-bottom:1px solid var(--border-soft)"><span class="cell-t" style="flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(r.title)+'</span><span class="status '+STTASK_STATUS_CLS[r.status]+'">'+esc(STTASK_STATUS_LBL[r.status])+'</span><span class="cell-s">→</span><span class="status '+STTASK_STATUS_CLS[r._pending]+'">'+esc(STTASK_STATUS_LBL[r._pending])+'</span></div>';}).join('')+'</div>'
  +'<div class="modal-f"><button class="btn danger" id="mDrop">Batalkan semua</button><button class="btn" id="mCancel">Nanti</button><button class="btn primary" id="mOk">Terapkan ('+list.length+')</button></div>';
  $('#modalOv').classList.add('show');
  $('#mCancel').onclick=closeModal;
  $('#mDrop').onclick=function(){list.forEach(function(r){delete r._pending;});closeModal();saveFilters();render(false);toast('Perubahan dibatalkan');};
  $('#mOk').onclick=function(){list.forEach(function(r){r.status=r._pending;r.isActive=(r._pending==='active');r.st=[STTASK_STATUS_LBL[r._pending],STTASK_STATUS_CLS[r._pending]];delete r._pending;});closeModal();saveFilters();render(false);toast('Perubahan diterbitkan','Sudah tayang ke siswa.');};
  var fb=$('#mCancel');if(fb)fb.focus();
 }
 function stAct(r){return '<select class="mini-btn" data-stsel="'+esc(r.id)+'" aria-label="Status '+esc(r.title)+'">'+stOpts(r)+'</select><button class="mini-btn" data-stedit="'+esc(r.id)+'">'+ic(P_PENCIL,14)+'<span>Edit</span></button><button class="mini-btn danger ic" data-stdel="'+esc(r.id)+'" aria-label="Hapus '+esc(r.title)+'">'+ic(P_TRASH,14)+'</button>';}
 function stGroups(r){var m=stScale(r.metric,days);return '<div class="st-groups">'
  +'<div><div class="cell-s">Aturan</div><div class="cell-t">'+esc(stRuleText(r))+'</div></div>'
  +'<div><div class="cell-s">Reward</div><div class="cell-t">+'+esc(r.rewardAmount)+' koin</div></div>'
  +'<div><div class="cell-s">Monitoring</div><div class="cell-t">'+m.completedCount.toLocaleString('id-ID')+' selesai · '+m.uniqueUsers.toLocaleString('id-ID')+' pengguna · '+m.completedToday+' hari ini</div></div></div>';}
  function stTitle(r){return '<div class="st-title"><span class="status '+stTypeCls(r.type)+'" style="flex:0 0 auto">'+esc(STTASK_TYPE_LBL[r.type]||r.type)+'</span><span class="t">'+esc(r.title)+'</span></div>';}
 var body;
 if(state.loading)body=skelHTML(3,52);
 else if(!rows.length)body='<div style="margin:14px 16px;border:1px dashed var(--border);border-radius:14px;padding:36px 20px;text-align:center;color:var(--text-2)"><b>Belum ada tugas streak.</b><br><br><button class="btn sm primary" data-stnew>Buat tugas</button></div>';
 else body='<div style="padding:14px 16px;display:flex;flex-direction:column;gap:10px" aria-label="Daftar tugas streak">'
  +rows.map(function(r){
   return '<div class="st-card2" data-strow="'+esc(r.id)+'" tabindex="0">'
   +stStick(r)+'<div style="display:flex;gap:10px;align-items:center">'+grip(r.id)+'<div style="flex:1;min-width:0">'+stTitle(r)+'</div><div class="st-side">'+stAct(r)+'</div></div>'
   +stGroups(r)+'</div>';
  }).join('')+'</div>';
   var table='<div class="card"><div class="card-h"><div><div><h2>Urutan & konfigurasi task</h2><p>Geser handle di kiri untuk menyusun urutan tampil.</p></div></div><div class="sp">'+stPubBtn()+'</div></div>'+body+'</div>';
 return hero+metrics+table+listFoot();
}
VIEWS['streak-tasks']=streakTasksView;
function stDefaults(r){
 var c=(r&&r.config)||{};
 return {code:r?r.code:'',type:r?r.type:'quiz',status:r?r.status:(r&&r.isActive===false?'paused':'active'),period:r?r.period:'daily',kind:r?r.kind:'',title:r?r.title:'',description:r?r.description:'',targetCount:r?r.targetCount:1,rewardAmount:r?r.rewardAmount:0,iconKey:r?r.iconKey:'math',colorKey:r?r.colorKey:'violet',iconUrl:(r&&r.iconUrl)||'',iconAlt:(r&&r.iconAlt)||'',sortOrder:r?r.sortOrder:stSorted().length,minScore:c.minScore,subjectId:c.subjectId,packageId:c.packageId,ctaUrl:c.ctaUrl||'',ctaLabel:c.ctaLabel||'',successMessage:c.successMessage||''};
}
function stSlug(s){return String(s||'').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-+|-+$/g,'').slice(0,60)||'task-baru';}
function wIconThumb(url,name){return '<div style="display:flex;gap:10px;align-items:center;margin-top:8px"><img src="'+esc(url)+'" alt="" style="width:44px;height:44px;border-radius:12px;border:1px solid var(--border);object-fit:cover;flex:0 0 44px"><span class="cell-s" style="flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(name||'Gambar terpasang')+'</span><button class="mini-btn danger ic" id="wIconRm" aria-label="Hapus gambar">'+ic(P_TRASH,14)+'</button></div>';}
function bindIconRm(){var b=$('#wIconRm');if(b)b.onclick=function(){var iu=$('#wIconUrl');if(iu)iu.value='';var wf=$('#wIconFile');if(wf)wf.value='';var pv=$('#wIconPrev');if(pv)pv.innerHTML='';refreshPrev();};}
function wRulesHTML(ty,d){
 if(ty==='quiz')return '<div class="field"><label for="wSubject">Khusus subject <small>(opsional)</small></label><input id="wSubject" type="number" min="1" placeholder="cth: 12" value="'+esc(d.subjectId==null?'':d.subjectId)+'"><span class="fhint">ID subject. Kosongkan = semua subject.</span><span class="ferr" id="wSubjectErr"></span></div>';
 if(ty==='practice'||ty==='tryout')return '<div style="border:1px solid var(--primary-100);background:var(--primary-50);border-radius:12px;padding:10px 12px"><div class="cell-t">Jenis paket: '+(ty==='practice'?'Latihan':'Tryout')+'</div><div class="cell-s">Mengikuti tipe tugas, tidak perlu dipilih manual.</div></div>'
 +'<div class="field"><label for="wPackage">Khusus paket <small>(opsional)</small></label><input id="wPackage" type="number" min="1" placeholder="cth: 7" value="'+esc(d.packageId==null?'':d.packageId)+'"><span class="fhint">ID paket. Kosongkan = semua paket.</span><span class="ferr" id="wPackageErr"></span></div>'
 +'<div class="field"><label for="wMin">Syarat nilai <small>(opsional)</small></label><input id="wMin" type="number" min="0" max="100" placeholder="cth: 70" value="'+esc(d.minScore==null?'':d.minScore)+'"><span class="fhint">Siswa harus mencapai nilai ini. Kosongkan = tanpa syarat.</span><span class="ferr" id="wMinErr"></span></div>';
 return '<div style="border:1px solid var(--border);border-radius:12px;padding:10px 12px;background:var(--bg-card)"><div class="cell-t">Tanpa filter aktivitas</div><div class="cell-s">Penyelesaian dihitung dari aktivitas share pada periode task.</div></div>';
}
var STTYPE_DEFAULTS={quiz:{icon:'math',color:'violet'},practice:{icon:'english',color:'emerald'},tryout:{icon:'indonesian',color:'blue'},share:{icon:'coin',color:'amber'}};
var STICON_SRC={math:'smartcbt/public/assets/mapel/mtk.png',english:'smartcbt/public/assets/mapel/bahasa inggris.png',indonesian:'smartcbt/public/assets/mapel/bahasa indonesia.png',coin:'smartcbt/public/assets/gamify/coin.png'};
var STCOIN_SRC='smartcbt/public/assets/gamify/coin.png';
function streakTaskForm(editId){
 modalFocus=document.activeElement;
 var f=editId!=null?stFind(editId):{t:featOf('streak-tasks'),d:null};
 var d=f.d||null;var v=stDefaults(d);
 function selOpts(map,cur){return Object.keys(map).map(function(k){return '<option value="'+k+'"'+(cur===k?' selected':'')+'>'+map[k]+'</option>';}).join('');}
  function typeSeg(){var M={quiz:[P_BOOK,'Soal pilihan'],practice:[P_PENCIL,'Sesi latihan'],tryout:[P_FILE,'Paket tryout'],share:[P_SEND,'Aktivitas share']};return '<div class="pick-grid cols-4" role="group" aria-label="Tipe tugas">'+Object.keys(STTASK_TYPE_LBL).map(function(k){var m=M[k]||['ti-circle',''];return '<button type="button" class="pick'+(v.type===k?' on':'')+'" data-wtype="'+k+'"><span class="pick-ic">'+ic(m[0],20)+'</span><b>'+STTASK_TYPE_LBL[k]+'</b><small>'+m[1]+'</small></button>';}).join('')+'</div>';}
  function periodSeg(){var P=[['daily','Harian','Reset tiap hari'],['weekly','Mingguan','Reset tiap minggu'],['lifetime','Sekali','Sekali per akun']];return '<div class="pick-grid cols-3" role="group" aria-label="Periode">'+P.map(function(p){return '<button type="button" class="pick'+(v.period===p[0]?' on':'')+'" data-wperiod="'+p[0]+'"><b>'+p[1]+'</b><small>'+p[2]+'</small></button>';}).join('')+'</div>';}
 function rwChips(){return '<div class="chips" style="padding:0">'+[0,5,10,15].map(function(c){return '<button class="chip'+(String(v.rewardAmount)===String(c)?' active':'')+'" data-rw="'+c+'">'+c+'</button>';}).join('')+'</div>';}
 function prevHTML(){
  var tIn=$('#wTitle');var t=tIn?tIn.value.trim():(v.title||'');if(!t)t='Judul task';
  var ty=v.type;
  var iuEl=$('#wIconUrl');var iu=iuEl?iuEl.value.trim():(v.iconUrl||'');
  var ikEl=$('#wIcon');var ik=ikEl?ikEl.value:(v.iconKey||'math');
  var kind=STTASK_TYPE_LBL[ty]||ty;
  var rwEl=$('#wReward');var rw=rwEl?rwEl.value.trim():'';if(rw==='')rw='0';
  var tgEl=$('#wTarget');var tg=tgEl?tgEl.value.trim():'';
  var dsEl=$('#wDesc');var ds=dsEl?dsEl.value.trim():(v.description||'');if(!ds)ds=t;
  var tn=Number(tg);var perW=v.period==='weekly'?'per minggu':v.period==='lifetime'?'total':'per hari';
  if(tg!==''&&!isNaN(tn)&&tn>1)ds+=(ds?' ':'')+'Target '+tn+'x '+perW+'.';
  var ctEl=$('#wCtaLabel');var ct=ctEl?ctEl.value.trim():'';if(!ct)ct='Mulai';
  var cuEl=$('#wCtaUrl');var cu=cuEl?cuEl.value.trim():(v.ctaUrl||'');
  var actPrev;
  if(ty==='quiz'&&!cu)actPrev='<span class="status gray">Segera hadir</span>';
  else if(ty==='share')actPrev='<span class="btn sm primary">Klaim +'+esc(rw)+'</span>';
  else actPrev='<span class="st-cta" style="display:inline-flex;align-items:center;gap:4px;font-size:12px;font-weight:600;white-space:nowrap">'+esc(ct)+' '+ic('ti-arrow-right',14)+'</span>';
  var src=iu||STICON_SRC[ik]||STICON_SRC.math;
  var ini=stIni(t);
  return '<div style="background:var(--bg-card);border:1px solid var(--border);border-radius:16px;padding:12px;display:flex;gap:12px;align-items:flex-start">'
  +'<span style="position:relative;width:44px;height:44px;border-radius:12px;display:grid;place-items:center;background:var(--primary-50);color:var(--primary);font-weight:700;font-size:12px;flex:0 0 44px">'+esc(ini)+'<img src="'+esc(src)+'" alt="" style="position:absolute;inset:0;margin:auto;width:30px;height:30px;object-fit:contain" onerror="this.remove()"></span>'
  +'<span style="min-width:0;flex:1"><span class="cell-t" style="font-size:14px"><span class="status '+stTypeCls(ty)+'">'+esc(kind)+'</span> '+esc(t)+'</span>'
  +'<span class="cell-s" style="display:block;margin-top:2px">'+esc(ds)+'</span>'
  +'<span style="display:block;margin-top:8px"><span class="status amber">+'+esc(rw)+' koin<img src="'+STCOIN_SRC+'" alt="" style="width:15px;height:15px;object-fit:contain;margin-left:5px;vertical-align:-3px" onerror="this.remove()"></span></span></span>'
  +'<span style="flex:0 0 auto;align-self:flex-end">'+actPrev+'</span>'
  +'</div>';
 }
 function refreshPrev(){var p=$('#wPrev');if(p)p.innerHTML=prevHTML();}
  function paint(){
   function iconTiles(){
    return Object.keys(STTASK_ICON_LBL).map(function(k){
     var on=v.iconKey===k;
     var src=STICON_SRC[k]||'';
     var fb=k==='math'?P_BOOK:k==='english'?'ti-language':k==='indonesian'?'ti-book':'ti-coin';
     return '<button type="button" class="w-icon'+(on?' on':'')+'" data-iconpick="'+k+'" aria-pressed="'+on+'" title="'+esc(STTASK_ICON_LBL[k])+'"><span class="w-icon-img"><img src="'+esc(src)+'" alt="" onerror="this.style.display=\'none\'"><span style="position:absolute;inset:0;display:grid;place-items:center;color:var(--primary)">'+ic(fb,20)+'</span></span><span class="w-icon-lbl">'+esc(STTASK_ICON_LBL[k])+'</span></button>';
    }).join('');
   }
   $('#modalBox').innerHTML='<div class="modal-h"><h3>'+(d?'Edit Tugas Streak':'Tambah Tugas Streak')+'</h3><p>Lengkapi langkah 1–5, lalu simpan.</p></div>'
   +'<div class="modal-b">'
   +'<div class="w-step"><div class="w-step-h"><span class="w-num">1</span><div><b>Tipe tugas</b><br><small>Jenis aktivitas yang dikerjakan siswa</small></div></div>'+typeSeg()+'<span class="fhint" id="wRuleHint">'+esc(STTASK_RULE[v.type])+'</span></div>'
   +'<div class="w-step"><div class="w-step-h"><span class="w-num">2</span><div><b>Judul & deskripsi</b><br><small>Tampil ke siswa</small></div></div><div class="field"><label for="wTitle">Judul</label><input id="wTitle" value="'+esc(v.title)+'" placeholder="cth: Kuis 3 soal harian"><span class="ferr" id="wTitleErr"></span></div><div class="field"><label for="wDesc">Deskripsi <small>(kosong = sama dengan judul)</small></label><textarea id="wDesc" placeholder="Tampil ke siswa di bawah judul.">'+esc(v.description)+'</textarea><span class="ferr" id="wDescErr"></span></div></div>'
   +'<div class="w-step"><div class="w-step-h"><span class="w-num">3</span><div><b>Periode & aturan</b><br><small>Kapan tugas berlaku dan syaratnya</small></div></div>'+periodSeg()+'<div class="field"><label for="wTarget">Target per periode</label><input id="wTarget" type="number" min="1" max="100" value="'+esc(v.targetCount)+'"><span class="fhint">Biasanya 1.</span><span class="ferr" id="wTargetErr"></span></div><div class="field"><label>Aturan khusus</label><div id="wRules" style="display:flex;flex-direction:column;gap:10px">'+wRulesHTML(v.type,v)+'</div></div></div>'
   +'<div class="w-step"><div class="w-step-h"><span class="w-num">4</span><div><b>Reward koin</b><br><small>Imbalan sekali selesai</small></div></div><div class="field"><label for="wReward">Jumlah koin</label><div class="w-coin"><button type="button" class="w-stepbtn" data-coin="-" aria-label="Kurangi koin">-</button><input id="wReward" type="number" min="0" max="32767" value="'+esc(v.rewardAmount)+'"><button type="button" class="w-stepbtn" data-coin="+" aria-label="Tambah koin">+</button></div>'+rwChips()+'<span class="fhint">Ketik, pakai - / +, atau pilih cepat.</span><span class="ferr" id="wRewardErr"></span></div></div>'
   +'<div class="w-step"><div class="w-step-h"><span class="w-num">5</span><div><b>Ikon mapel</b><br><small>Pilih ikon bawaan atau unggah sendiri</small></div></div><div class="w-icons w-icons-4">'+iconTiles()+'</div><select id="wIcon" data-no-enh style="display:none">'+selOpts(STTASK_ICON_LBL,v.iconKey)+'</select><select id="wColor" data-no-enh style="display:none">'+selOpts(STTASK_COLOR_LBL,v.colorKey)+'</select><label class="w-up"><span class="w-up-ic">'+ic(P_PLUS,16)+'</span><span style="flex:1;min-width:0"><b>Unggah ikon sendiri</b><small>PNG/JPG/WEBP · maks 5 MB</small></span><input id="wIconFile" type="file" accept="image/png,image/jpeg,image/webp" hidden></label><span class="ferr" id="wIconFileErr"></span><div id="wIconPrev">'+(v.iconUrl?wIconThumb(v.iconUrl,'Gambar saat ini'):'')+'</div><input id="wIconUrl" type="hidden" value="'+esc(v.iconUrl)+'"></div>'
   +'<details class="st-adv"><summary>'+ic('ti-settings',16)+'<span>Lanjutan <small style="font-weight:500;color:var(--text-3)">· jarang diubah</small></span></summary><div class="adv-b">'
   +'<div class="nav-title" style="padding:12px 0 2px">Status & kode</div>'
   +'<div class="field"><label for="wStatus">Status</label><select id="wStatus" aria-label="Status">'+selOpts(STTASK_STATUS_LBL,v.status)+'</select><span class="fhint">Aktif = tampil. Dijeda = sembunyi. Draft = belum siap.</span></div>'
   +'<div class="field"><label for="wCode">Kode unik <small>· internal</small></label><input id="wCode" value="'+esc(v.code)+'" placeholder="Otomatis dari judul"><span class="fhint">Siswa tidak melihat ini.</span><span class="ferr" id="wCodeErr"></span></div>'
   +'<div class="nav-title" style="padding:12px 0 2px">Tombol & pesan</div>'
   +'<div class="field"><label for="wCtaLabel">Teks tombol <small>(opsional)</small></label><input id="wCtaLabel" value="'+esc(v.ctaLabel)+'" placeholder="Mulai"><span class="ferr" id="wCtaLabelErr"></span></div>'
   +'<div class="field"><label for="wCtaUrl">Tujuan tombol <small>(opsional)</small></label><input id="wCtaUrl" value="'+esc(v.ctaUrl)+'" placeholder="cth: /app/latihan"><span class="ferr" id="wCtaUrlErr"></span></div>'
   +'<div class="field"><label for="wSuccess">Pesan sukses <small>(opsional)</small></label><input id="wSuccess" value="'+esc(v.successMessage)+'" placeholder="Mantap, task selesai!"><span class="ferr" id="wSuccessErr"></span></div>'
   +'</div></details>'
   +'</div><div class="modal-f"><button class="btn" id="wCancel">Batal</button><button class="btn primary" id="wSave">'+(d?'Simpan':'Buat task')+'</button></div>';
   $('#modalOv').classList.add('show');
   $('#wCancel').onclick=closeModal;
   $('#modalBox').querySelectorAll('[data-wtype]').forEach(function(b){b.onclick=function(){v.type=b.getAttribute('data-wtype');if(!d){var df=STTYPE_DEFAULTS[v.type]||{icon:'math',color:'violet'};v.iconKey=df.icon;v.colorKey=df.color;var wi=$('#wIcon');if(wi)wi.value=v.iconKey;var wc=$('#wColor');if(wc)wc.value=v.colorKey;}$('#modalBox').querySelectorAll('[data-wtype]').forEach(function(x){x.classList.toggle('on',x===b);});var rh=$('#wRuleHint');if(rh)rh.textContent=STTASK_RULE[v.type]||'';var rw=$('#wRules');if(rw)rw.innerHTML=wRulesHTML(v.type,v);refreshPrev();if(!d){$('#modalBox').querySelectorAll('[data-iconpick]').forEach(function(x){x.classList.toggle('on',x.getAttribute('data-iconpick')===v.iconKey);});}};});
   $('#modalBox').querySelectorAll('[data-wperiod]').forEach(function(b){b.onclick=function(){v.period=b.getAttribute('data-wperiod');$('#modalBox').querySelectorAll('[data-wperiod]').forEach(function(x){x.classList.toggle('on',x===b);});refreshPrev();};});
   $('#modalBox').querySelectorAll('[data-rw]').forEach(function(b){b.onclick=function(){$('#wReward').value=b.getAttribute('data-rw');$('#modalBox').querySelectorAll('[data-rw]').forEach(function(x){x.classList.toggle('active',x===b);});refreshPrev();};});
   $('#modalBox').querySelectorAll('[data-coin]').forEach(function(b){b.onclick=function(){var el=$('#wReward');if(!el)return;var n=parseInt(el.value||'0',10);if(isNaN(n))n=0;n+=b.getAttribute('data-coin')==='+'?1:-1;if(n<0)n=0;if(n>32767)n=32767;el.value=n;$('#modalBox').querySelectorAll('[data-rw]').forEach(function(x){x.classList.toggle('active',x.getAttribute('data-rw')===String(n));});refreshPrev();};});
   $('#modalBox').querySelectorAll('[data-iconpick]').forEach(function(b){b.onclick=function(){v.iconKey=b.getAttribute('data-iconpick');var wi=$('#wIcon');if(wi)wi.value=v.iconKey;$('#modalBox').querySelectorAll('[data-iconpick]').forEach(function(x){x.classList.toggle('on',x===b);});refreshPrev();};});
   var wtIn=$('#wTitle');if(wtIn)wtIn.oninput=refreshPrev;
   var cuIn=$('#wCtaUrl');if(cuIn)cuIn.oninput=refreshPrev;
   var clIn=$('#wCtaLabel');if(clIn)clIn.oninput=refreshPrev;
   var wrIn=$('#wReward');if(wrIn)wrIn.oninput=function(){$('#modalBox').querySelectorAll('[data-rw]').forEach(function(x){x.classList.toggle('active',x.getAttribute('data-rw')===$('#wReward').value);});refreshPrev();};
   bindIconRm();
   var wf=$('#wIconFile');if(wf)wf.onchange=function(){
    var f=wf.files&&wf.files[0];var er=$('#wIconFileErr');
    if(!f)return;
    if(f.size>5*1024*1024){if(er){er.textContent='Maksimal 5 MB.';er.classList.add('show');}wf.value='';return;}
    if(er){er.textContent='';er.classList.remove('show');}
    var rd=new FileReader();
    rd.onload=function(){var url=String(rd.result||'');var iu=$('#wIconUrl');if(iu)iu.value=url;var pv=$('#wIconPrev');if(pv){pv.innerHTML=wIconThumb(url,f.name);bindIconRm();}refreshPrev();};
    rd.readAsDataURL(f);
   };
   $('#wSave').onclick=save;
   refreshPrev();
   var f0=$('#wTitle');if(f0)f0.focus();
  }
 function toNum(x){if(x==null||String(x).trim()==='')return undefined;var n=Number(String(x).trim());return isNaN(n)?NaN:n;}
 function save(){
  function wm(f,m){var el=document.getElementById(f);var er=document.getElementById(f+'Err');if(el)el.classList.toggle('bad',!!m);if(er){er.textContent=m||'';er.classList.toggle('show',!!m);}if(m)ok=false;}
  var ok=true;
  var cTitle=$('#wTitle').value.trim();
  var cReward=toNum($('#wReward').value);
  var cDesc=$('#wDesc').value.trim()||cTitle;
  var cTarget=toNum($('#wTarget').value);
  if(cTarget==null)cTarget=1;
  var cCode=$('#wCode').value.trim()||stSlug(cTitle);
  var st=$('#wStatus').value;
  wm('wTitle',!cTitle?'Judul wajib diisi.':cTitle.length>120?'Judul maksimal 120 karakter.':'');
  wm('wReward',(cReward==null||isNaN(cReward)||Math.floor(cReward)!==cReward||cReward<0||cReward>32767)?'Isi 0 sampai 32767.':'');
  wm('wDesc',cDesc.length>500?'Deskripsi maksimal 500 karakter.':'');
  wm('wTarget',(isNaN(cTarget)||Math.floor(cTarget)!==cTarget||cTarget<1||cTarget>100)?'Isi 1 sampai 100.':'');
  wm('wCode',cCode.length>80?'Kode maksimal 80 karakter.':'');
  var ty=v.type,pe=v.period;
  var sEl=$('#wSubject'),pEl=$('#wPackage'),mEl=$('#wMin');
  var cSub=sEl?toNum(sEl.value):undefined,cPkg=pEl?toNum(pEl.value):undefined,cMin=mEl?toNum(mEl.value):undefined;
  if(ty==='quiz'&&sEl&&(cSub!=null&&(isNaN(cSub)||Math.floor(cSub)!==cSub||cSub<1)))wm('wSubject','ID subject minimal 1.');
  if(ty==='practice'||ty==='tryout'){if(pEl&&(cPkg!=null&&(isNaN(cPkg)||Math.floor(cPkg)!==cPkg||cPkg<1)))wm('wPackage','ID paket minimal 1.');if(mEl&&(cMin!=null&&(isNaN(cMin)||cMin<0||cMin>100)))wm('wMin','Nilai 0 sampai 100.');}
  var cIconUrl=$('#wIconUrl').value.trim(),cCtaUrl=$('#wCtaUrl').value.trim(),cCtaLabel=$('#wCtaLabel').value.trim(),cSuccess=$('#wSuccess').value.trim();
  wm('wIconUrl',(cIconUrl.length>500&&cIconUrl.indexOf('data:image/')!==0)?'Gambar maksimal 500 karakter.':'');
  wm('wCtaUrl',cCtaUrl.length>500?'Tujuan tombol maksimal 500 karakter.':'');
  wm('wCtaLabel',cCtaLabel.length>80?'Teks tombol maksimal 80 karakter.':'');
  if(!ok){var bad=$('#modalBox').querySelector('.bad');if(bad){var dt=bad.closest('details.st-adv');if(dt&&!dt.open)dt.open=true;bad.focus();}return;}
  var cfg={};
  if(ty==='practice')cfg.packageType='drill';
  else if(ty==='tryout')cfg.packageType='tryout';
  if(cCtaLabel)cfg.ctaLabel=cCtaLabel;
  if(cCtaUrl)cfg.ctaUrl=cCtaUrl;
  if((ty==='practice'||ty==='tryout')&&cMin!=null)cfg.minScore=cMin;
  if((ty==='practice'||ty==='tryout')&&cPkg!=null)cfg.packageId=cPkg;
  if(ty==='quiz'&&cSub!=null)cfg.subjectId=cSub;
  if(cSuccess)cfg.successMessage=cSuccess;
  var t=featOf('streak-tasks');
  var cKind=STTASK_TYPE_LBL[ty]||ty;
  if(d){
   d.code=cCode;d.type=ty;d.period=pe;d.kind=cKind;d.title=cTitle;d.description=cDesc;
   d.targetCount=cTarget;d.rewardAmount=cReward;d.iconKey=$('#wIcon').value;d.colorKey=$('#wColor').value;
   d.iconUrl=cIconUrl||null;d.iconAlt='Ikon tugas '+cTitle;d.config=cfg;
   if(st===d.status)delete d._pending;else d._pending=st;
   closeModal();saveFilters();render(false);toast('Tugas streak berhasil diperbarui',d._pending?'Status menunggu diterbitkan.':'');
  }else{
   var maxId=0;(t.rows||[]).forEach(function(x){var n=+x.id||0;if(n>maxId)maxId=n;});
   t.rows.push({id:maxId+1,code:cCode,type:ty,status:st,period:pe,kind:cKind,title:cTitle,description:cDesc,targetCount:cTarget,rewardAmount:cReward,iconKey:$('#wIcon').value,colorKey:$('#wColor').value,iconUrl:cIconUrl||null,iconAlt:'Ikon tugas '+cTitle,sortOrder:stSorted().length,config:cfg,isActive:(st==='active'),metric:{completedCount:0,uniqueUsers:0,completedToday:0},st:[STTASK_STATUS_LBL[st],STTASK_STATUS_CLS[st]],by:'Admin',chip:'Semua'});
   t.rows.sort(function(a,b){return (a.sortOrder||0)-(b.sortOrder||0);});
   closeModal();saveFilters();render(false);toast('Tugas streak berhasil dibuat');
  }
 }
 paint();
}
function stDelete(id){
 var f=stFind(id);if(!f.d)return;
 openConfirm('Hapus tugas "'+f.d.title+'"?','Tugas hilang dari daftar dan tidak tampil ke siswa.','Hapus',function(){
  var t=f.t;var gone=[];
  t.rows=(t.rows||[]).filter(function(r){if(String(r.id)===String(id)){gone.push(r);return false;}return true;});
  render(false);
  toast('Tugas streak berhasil dihapus',null,null,{label:'Urungkan',fn:function(){gone.forEach(function(r){t.rows.push(r);});t.rows.sort(function(a,b){return (a.sortOrder||0)-(b.sortOrder||0);});render(false);}});
 });
}
VIEWS.notifications=notifView;
VIEWS.media=mediaView;
function mediaUpload(done){
 modalFocus=document.activeElement;
 $('#modalBox').innerHTML='<div class="modal-h"><h3>Unggah media</h3><p>Gambar, audio, atau dokumen. Maks 50 MB.</p></div><div class="modal-b"><div class="field"><label for="muName">Nama file</label><input id="muName" placeholder="cth: diagram-gaya.png"><span class="ferr" id="muNameErr"></span></div><div class="field"><label for="muType">Tipe</label><select id="muType" aria-label="Tipe"><option>Gambar</option><option>Audio</option><option>Dokumen</option></select></div><div class="field"><label for="muCat">Kegunaan</label><select id="muCat" aria-label="Kegunaan"><option>Soal</option><option>Banner</option><option>Avatar</option><option>Logo</option><option>Iklan</option><option>Lainnya</option></select><span class="fhint">File pelajar (mis. avatar) masuk otomatis saat diganti.</span></div><div id="muProg" style="display:none"><div class="skel" style="height:12px"></div><div class="cell-s" style="margin-top:6px">Mengunggah…</div></div></div><div class="modal-f"><button class="btn" id="muCancel">Batal</button><button class="btn primary" id="muOk">Unggah</button></div>';
 $('#modalOv').classList.add('show');
 $('#muCancel').onclick=closeModal;
 $('#muOk').onclick=function(){
  var v=$('#muName').value.trim();var er=$('#muNameErr');
  if(!v){er.textContent='Nama file wajib diisi.';er.classList.add('show');$('#muName').classList.add('bad');return;}
  er.classList.remove('show');$('#muName').classList.remove('bad');$('#muProg').style.display='';
  setTimeout(function(){
   var tp=$('#muType').value;var mime=tp==='Gambar'?'image/png':tp==='Audio'?'audio/mpeg':'application/pdf';var cat=$('#muCat').value;
   var t=featOf('media');t.rows.unshift({id:'M-'+Math.floor(100+Math.random()*900),t:v,s:tp+' · baru saja · belum dipakai',st:['Belum dipakai','gray'],by:'Admin',chip:cat,cat:cat,owner:'Admin',mime:mime,size:'—',ratio:tp==='Gambar'?'4/3':(tp==='Audio'?'16/10':'3/4')});
   if(done){done(t.rows[0]);}else{closeModal();saveFilters();render(false);toast('Media diunggah');}
  },900);
 };
 $('#muName').focus();
}
function mediaDetail(id){
 var f=findRow('media',id);var t=f.t,d=f.d;if(!d)return;
 modalFocus=document.activeElement;
 $('#modalBox').innerHTML='<div class="modal-h"><div style="display:flex;gap:8px;align-items:center"><h3 style="flex:1;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(d.t)+'</h3><button class="iconbtn" id="mdClose" aria-label="Tutup">'+ic(P_X,18)+'</button></div><p>'+esc(d.id)+' · '+esc(d.st[0])+'</p></div>'
 +'<div class="modal-b"><div style="min-height:200px;border-radius:12px;background:var(--bg-hover);display:grid;place-items:center;color:var(--text-3)">'+ic(mediaIcon(d),44)+'</div>'
  +'<div style="display:flex;gap:10px;align-items:center"><div style="flex:1;min-width:0"><div class="cell-t">'+esc(d.t)+'</div><div class="cell-s">'+esc(d.mime||'file')+' • '+esc(d.size||'—')+'</div><div class="cell-s">Diupload oleh '+byAvatar(d.by)+' ('+esc(d.owner||'Admin')+') · '+esc(d.cat||'')+'</div></div><button class="mini-btn" id="mdDown">'+ic(P_DOWNLOAD,14)+'<span>Export</span></button></span></div>'
 +'<div style="display:flex;gap:8px;justify-content:flex-end"><button class="btn sm danger" id="mdDel">Hapus</button></div></div>';
 $('#modalOv').classList.add('show');
 $('#mdClose').onclick=closeModal;
  $('#mdDown').onclick=function(){toast('Menyiapkan export…');};
  var mUgo=$('#modalBox').querySelector('[data-ugo]');if(mUgo)mUgo.onclick=function(){closeModal();go(userGo(mUgo.getAttribute('data-ugo')));};
 $('#mdDel').onclick=function(){closeModal();openConfirm('Hapus media '+d.t+'?','File hilang dari pustaka. Soal yang memakai file ini perlu diganti.','Hapus',function(){var gone=[];t.rows=t.rows.filter(function(r){if(r.id===id){gone.push(r);return false;}return true;});render(false);toast('Media dihapus',null,null,{label:'Urungkan',fn:function(){gone.forEach(function(r){t.rows.unshift(r);});render(false);}});});};
}
/* Mirrors admin /(content)/articles: Konfigurasi portal + Daftar artikel grup "artikel". */
function artCfg(){var d={apiBaseUrl:'https://portal.stekom.ac.id/api/v1',domain:'sbnmpts.stekom.ac.id',apiKey:'stekom-portal-demo-key-9f2c41'};try{var s=store.get('na3-portal');if(s){var o=JSON.parse(s);if(o.apiBaseUrl)d.apiBaseUrl=o.apiBaseUrl;if(o.domain)d.domain=o.domain;if(o.apiKey)d.apiKey=o.apiKey;}}catch(_){}return d;}
function artCardHTML(d){
 var thumb=d.thumbnail?'<img src="'+esc(d.thumbnail)+'" alt="" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0" onerror="this.remove()">':ic('ti-article',30);
 var date=esc(d.published||d.published_at||'Tanggal tidak tersedia');
 return '<article class="card" style="box-shadow:none;display:flex;flex-direction:column;min-width:0">'
 +'<button data-artopen="'+esc(d.id)+'" aria-label="Lihat '+esc(d.t)+'" style="position:relative;aspect-ratio:16/9;background:var(--bg-hover);border-radius:14px 14px 0 0;border:0;padding:0;cursor:pointer;color:var(--text-3);overflow:hidden;font-family:inherit;display:block;width:100%">'
 +'<span style="position:absolute;inset:0;display:grid;place-items:center">'+thumb+'</span></button>'
 +'<div style="padding:14px 14px 12px;display:flex;flex-direction:column;gap:8px;flex:1">'
 +'<span class="cell-s">'+date+'</span>'
 +'<div class="cell-t" style="font-size:14.5px;line-height:1.4">'+esc(d.t)+'</div>'
 +(d.excerpt?'<div class="cell-s" style="display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden">'+esc(d.excerpt)+'</div>':'')
 +'<div class="cell-s">Slug: '+esc(d.slug||d.id)+'</div>'
 +'<div style="margin-top:auto;display:flex;gap:6px;align-items:center;border-top:1px solid var(--border-soft);padding-top:10px"><span class="status '+d.st[1]+'">'+esc(d.st[0])+'</span><span style="margin-left:auto;display:flex;gap:6px"><button class="mini-btn" data-artopen="'+esc(d.id)+'">'+ic(P_EYE,14)+'<span>Detail</span></button></span></div>'
 +'</div></article>';
}
function articlesView(page,t){
 var cfg=artCfg();
 var rows=(t.rows||[]);
 var body;
 if(state.loading)body=skelHTML(2,200);
 else if(!rows.length)body='<div style="margin:14px 16px;border:1px dashed var(--border);border-radius:14px;padding:36px 20px;text-align:center;color:var(--text-2)"><b>Belum ada artikel yang tersedia.</b><br><span style="font-size:12.5px">Simpan konfigurasi portal untuk memuat artikel.</span><br><br><button class="btn sm" data-artreload>'+ic('ti-reload',17)+'Muat ulang artikel</button></div>';
 else body='<div class="adsgrid" style="display:grid;grid-template-columns:1fr;gap:12px;padding:14px 16px">'+rows.map(artCardHTML).join('')+'</div>';
 return listHero(page,t,'<button class="btn" data-artreload>'+ic('ti-reload',17)+'Muat ulang artikel</button>')
 +'<div class="card" style="margin-bottom:12px"><div class="card-h"><div><div><h2>Konfigurasi portal</h2><p>Atur sumber artikel yang digunakan halaman publik TRYOUTKU.</p></div></div></div>'
 +'<div style="padding:14px 16px;display:flex;flex-direction:column;gap:13px">'
 +'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:13px">'
 +'<div class="field"><label for="artUrl">URL API</label><input id="artUrl" value="'+esc(cfg.apiBaseUrl)+'" placeholder="https://portal.stekom.ac.id/api/v1" autocomplete="off"><span class="ferr" id="artUrlErr"></span></div>'
 +'<div class="field"><label for="artDomain">Domain portal</label><input id="artDomain" value="'+esc(cfg.domain)+'" placeholder="sbnmpts.stekom.ac.id" autocomplete="off"><span class="ferr" id="artDomainErr"></span></div>'
 +'</div>'
 +'<div class="field"><label for="artKey">API key</label><div style="display:flex;gap:8px;align-items:center"><input id="artKey" type="password" value="'+esc(cfg.apiKey)+'" placeholder="Masukkan API key" autocomplete="off" style="flex:1;min-width:0"><button class="mini-btn ic" data-artshow title="Tampilkan / sembunyikan" aria-label="Tampilkan API key">'+ic(P_EYE,14)+'</button><button class="mini-btn ic" data-artcopy title="Salin API key" aria-label="Salin API key">'+ic(P_COPY,14)+'</button></div><span class="ferr" id="artKeyErr"></span></div>'
 +'<div><button class="btn primary" data-artsave>'+ic(P_CHECK,17)+'Simpan konfigurasi</button></div>'
 +'</div></div>'
 +'<div class="card"><div class="card-h"><div><div><h2>Daftar artikel</h2><p>Artikel group “artikel” dari portal.</p></div></div><div class="sp"><span class="cell-s">'+rows.length+' artikel</span><button class="link" data-artreload>'+ic('ti-reload',15)+'Muat ulang artikel</button></div></div>'
 +body
 +'</div>'
 +listFoot();
}
VIEWS.articles=articlesView;
VIEWS.ads=adsView;
/* Voucher & referral (Marketing, prototype-only). Same card + status-flow language as ads. */
var VOUCHST={Draft:['Draft','gray'],Siap:['Siap','amber'],Aktif:['Aktif','green'],Kedaluwarsa:['Kedaluwarsa','gray']};
var QST={Aktif:['Aktif','green'],Draft:['Draft','gray']};
