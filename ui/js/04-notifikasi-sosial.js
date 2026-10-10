/* 04-notifikasi-sosial.js — Notifikasi, media sosial.
   Dipisah otomatis dari DESIGN ADMIN/new-admin.html. Muat BERURUTAN via <script> di index.html (classic script, globals bersama). */
function notifTypeMeta(ty){
 if(ty==='Berhasil')return {cls:'green',icn:P_CHECK};
 if(ty==='Peringatan')return {cls:'amber',icn:P_ALERT};
 if(ty==='Penting')return {cls:'red',icn:P_ALERT};
 return {cls:'blue',icn:P_BELL};
}
function teamBadge(tm){var map={'Admin':'admin','Marketing':'marketing','Tim Soal':'soal','Soal':'soal','Tim User':'user','User':'user'};var k=map[tm];if(k&&ROLES[k])return '<span class="bdg" style="background:'+ROLES[k].color+';color:#fff">'+esc(tm)+'</span>';return '<span class="bdg">'+esc(tm||'')+'</span>';}
function notifUnread(){return (featOf('notifications').rows||[]).filter(function(n){return !n.read;}).length;}
function notifMark(id){var t=featOf('notifications');(t.rows||[]).forEach(function(n){if(n.id===id&&!n.read){n.read=true;n.st=['Sudah dibaca','gray'];n.chip='Sudah dibaca';}});saveFilters();render(false);}
function notifMarkAll(){var t=featOf('notifications');(t.rows||[]).forEach(function(n){if(!n.read){n.read=true;n.st=['Sudah dibaca','gray'];n.chip='Sudah dibaca';}});saveFilters();render(false);toast('Semua notifikasi dibaca');}
function notifView(page,t){
 var unread=notifUnread();
  var hero=listHero(page,t,'<button class="btn primary" data-new>'+ic(P_PLUS,17)+'Buat notifikasi</button>'+(unread?'<button class="btn" data-nreadall>'+ic(P_CHECK,17)+'Tandai semua dibaca</button>':''));
 var body;
 if(state.loading)body='<div class="card"><div style="padding:40px;text-align:center;color:var(--text-2)">Menyiapkan…</div></div>';
 else{
  var rows=(t.rows||[]);
  if(!rows.length)body='<div class="card"><div class="empty"><div class="eico">'+ic(P_BELL,24)+'</div><b>Semuanya sudah dibaca!</b><br><span style="font-size:12.5px">Pembaruan baru akan muncul di sini.</span></div></div>';
    else body='<div class="card" style="padding:10px;display:flex;flex-direction:column;gap:6px">'+rows.map(function(n){
    var m=notifTypeMeta(n.type);
    var goLabel=n.link==='ads'?'Lihat iklan':'Lihat detail';
    return '<div class="nrow'+(n.read?'':' unread')+'" data-nopen="'+esc(n.id)+'" tabindex="0" role="button" aria-label="'+esc(n.t)+'"><span class="status '+m.cls+'">'+ic(m.icn,16)+'</span><span style="flex:1;min-width:0"><span style="display:flex;gap:8px;align-items:center"><b>'+esc(n.t)+'</b>'+(n.read?'':'<span style="width:8px;height:8px;border-radius:50%;background:var(--primary);flex:0 0 8px" title="Belum dibaca"></span>')+'</span><span class="cell-s" style="display:block;margin-top:2px">'+esc(n.msg||n.s||'')+'</span><span style="display:flex;gap:8px;align-items:center;margin-top:6px;flex-wrap:wrap"><span class="cell-s">'+esc(n.type||'')+(n.time?' · '+esc(n.time):'')+'</span>'+(n.team?teamBadge(n.team):'')+(n.link?'<button class="link plain" data-ngoto="'+esc(n.link)+'" data-nid="'+esc(n.id)+'" style="padding:0">'+goLabel+' '+ic(P_CHR,14)+'</button>':'')+'</span></span>'+(n.read?'':'<button class="mini-btn ic" data-nmark="'+esc(n.id)+'" title="Tandai dibaca" aria-label="Tandai dibaca" style="flex:0 0 auto;align-self:center">'+ic(P_CHECK,14)+'</button>')+'</div>';}).join('')+'</div>';
 }
 return hero+body+listFoot();
}
var SOCICON={Instagram:'ti-brand-instagram',TikTok:'ti-brand-tiktok',YouTube:'ti-brand-youtube',X:'ti-brand-x',Facebook:'ti-brand-facebook',WhatsApp:'ti-brand-whatsapp',Telegram:'ti-brand-telegram'};
var SOCTILE={Instagram:['#FCE7F3','#DB2777'],TikTok:['var(--bg-hover)','var(--text-h)'],YouTube:['#FEE2E2','#DC2626'],X:['var(--bg-hover)','var(--text-h)'],Facebook:['#DBEAFE','#2563EB'],WhatsApp:['#DCFCE7','#16A34A'],Telegram:['#E0F2FE','#0284C7']};
function socTile(p){return SOCTILE[p]||['var(--primary-100)','var(--primary)'];}
function socialView(page,t){
 var rows=filteredRows(t);
  var active=rows.filter(function(r){return r.chip==='Aktif';}).length;
  var body;
 if(state.loading)body=skelHTML(1,64);
  else if(!rows.length)body='<div style="margin:14px 16px;border:1px dashed var(--border);border-radius:14px;padding:36px 20px;text-align:center;color:var(--text-2)"><b>Belum ada akun.</b><br><br><button class="btn sm" data-reset>Reset filter</button></div>';
    else body='<div id="smList" style="padding:8px;display:flex;flex-direction:column;gap:2px">'+rows.map(function(d){
     return '<div class="nrow" data-smopen="'+esc(d.id)+'" data-smid="'+esc(d.id)+'" tabindex="0" role="button" aria-label="Ubah '+esc(d.t)+'"><span class="grip" data-grip="'+esc(d.id)+'" title="Tahan dan geser untuk mengurutkan" aria-label="Geser untuk mengurutkan">'+ic('ti-grip-vertical',18)+'</span><span style="width:38px;height:38px;border-radius:12px;display:grid;place-items:center;color:#fff;flex:0 0 38px;background:var(--primary)">'+ic(SOCICON[d.platform]||'ti-share-2',19)+'</span><span style="flex:1;min-width:0"><b style="font-size:13.5px;color:var(--text-h);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(d.t)+'</b><span class="cell-s" style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(d.url||'')+' · '+esc(d.followers||'')+'</span><span class="cell-s" style="display:block">'+esc(d.trend||'')+'</span></span><button class="status '+(d.chip==='Aktif'?'green':'gray')+'" data-smtoggle="'+esc(d.id)+'" title="Ubah status" style="border:0;cursor:pointer;font-family:inherit;flex:0 0 auto">'+esc(d.chip)+'</button><button class="mini-btn ic" data-smcopy="'+esc(d.id)+'" title="Salin tautan" aria-label="Salin tautan" style="flex:0 0 auto">'+ic(P_COPY,14)+'</button><button class="mini-btn danger ic" data-smdel="'+esc(d.id)+'" title="Hapus akun" aria-label="Hapus akun '+esc(d.t)+'" style="flex:0 0 auto">'+ic(P_TRASH,14)+'</button></div>';}).join('')+'</div>';
  var prev=(t.rows||[]).filter(function(r){return r.chip==='Aktif';});
  var prevCard='<div class="card" style="box-shadow:none;align-self:start"><div class="card-h"><div><div><h2>Pratinjau tautan</h2><p>'+prev.length+' aktif · urut sesuai daftar</p></div></div></div><div class="prev-list">'+(prev.length?prev.map(function(r){var tl=socTile(r.platform);return '<button class="nrow" data-smgo="'+esc(r.url||'')+'" style="width:100%;background:none;border:0;border-radius:0;font:inherit;text-align:left" aria-label="Buka '+esc(r.t)+'"><span style="width:40px;height:40px;border-radius:12px;display:grid;place-items:center;flex:0 0 40px;background:'+tl[0]+';color:'+tl[1]+'">'+ic(SOCICON[r.platform]||'ti-share-2',20)+'</span><span style="flex:1;min-width:0;text-align:left"><b style="font-size:13.5px;color:var(--text-h);display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(r.t)+'</b><span class="cell-s" style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(r.url||'')+'</span></span>'+ic(P_CHR,18)+'</button>';}).join(''):'<div style="padding:12px 14px"><span class="cell-s">Tidak ada akun aktif. Aktifkan dari daftar.</span></div>')+'</div></div>';
  return listHero(page,t,'<button class="btn primary" data-new>'+ic(P_PLUS,17)+'Tambah akun</button>')
   +'<div class="smgrid">'
   +'<div class="card"><div class="card-h"><div><div><h2>'+esc(t.title)+'</h2></div></div><div class="sp"><span class="cell-s">'+rows.length+' akun · '+active+' aktif</span>'+(hasResetF()?'<button class="link" data-reset>Reset</button>':'')+'</div></div>'+filterBarHTML(t,'Cari akun…')
   +body+'</div>'+prevCard+'</div>'+listFoot();
}
VIEWS.questions=questionsView;
VIEWS.social=socialView;
function socialForm(editId){
 modalFocus=document.activeElement;
 var t=featOf('social-media');var f=findRow('social-media',editId);var d=f.d;
 var plats=['Instagram','TikTok','YouTube','X','Facebook','WhatsApp','Telegram'];
 $('#modalBox').innerHTML='<div class="modal-h"><h3>'+(d?'Ubah akun':'Tambah akun')+'</h3><p>Akun resmi yang tampil ke pelajar.</p></div><div class="modal-b">'
 +'<div class="field"><label for="smName">Nama akun</label><input id="smName" value="'+esc(d?d.t:'')+'" placeholder="cth: @tryoutku · Instagram"><span class="ferr" id="smNameErr"></span></div>'
 +'<div class="field"><label for="smPlat">Platform</label><select id="smPlat" aria-label="Platform">'+plats.map(function(p){return '<option'+(d&&d.platform===p?' selected':'')+'>'+p+'</option>';}).join('')+'</select></div>'
 +'<div class="field"><label for="smUrl">Tautan</label><input id="smUrl" value="'+esc(d?(d.url||''):'')+'" placeholder="https://…"><span class="ferr" id="smUrlErr"></span></div>'
 +'<div class="field"><label>Status</label><div class="seg" role="group" aria-label="Status"><button data-ss="Aktif" class="'+(!d||d.chip==='Aktif'?'on':'')+'">Aktif</button><button data-ss="Nonaktif" class="'+(d&&d.chip!=='Aktif'?'on':'')+'">Nonaktif</button></div></div>'
 +'</div><div class="modal-f"><button class="btn" id="smCancel">Batal</button><button class="btn primary" id="smOk">'+(d?'Simpan':'Tambah')+'</button></div>';
 $('#modalOv').classList.add('show');
 var st=(!d||d.chip==='Aktif')?'Aktif':'Nonaktif';
 $('#modalBox').querySelectorAll('[data-ss]').forEach(function(b){b.onclick=function(){st=b.getAttribute('data-ss');$('#modalBox').querySelectorAll('[data-ss]').forEach(function(x){x.classList.toggle('on',x===b);});};});
 $('#smCancel').onclick=closeModal;
 $('#smOk').onclick=function(){
  var vN=$('#smName').value.trim(),vU=$('#smUrl').value.trim(),ok=true;
  function mark(id,msg){var f=$('#'+id),e=$('#'+id+'Err');if(f)f.classList.toggle('bad',!!msg);if(e){e.textContent=msg||'';e.classList.toggle('show',!!msg);}if(msg)ok=false;}
  mark('smName',vN?'':'Nama akun wajib diisi.');
  mark('smUrl',!vU?'Tautan wajib diisi.':(!/^(https?:\/\/|\/)[^\s]+$/.test(vU)?'Tautan tidak valid. Awali http:// atau https://.':''));
  if(!ok){var b1=$('#modalBox').querySelector('.bad');if(b1)b1.focus();return;}
  var plat=$('#smPlat').value;
  if(d){d.t=vN;d.platform=plat;d.url=vU;d.chip=st;d.st=[st,st==='Aktif'?'green':'gray'];d.s=vU+' · '+(d.followers||'');toast('Akun diperbarui');}
  else{t.rows.push({id:'SM-'+Math.floor(100+Math.random()*900),t:vN,s:vU+' · pengikut baru',st:[st,st==='Aktif'?'green':'gray'],by:'Raka',chip:st,platform:plat,url:vU,followers:'pengikut baru'});toast('Akun ditambahkan');}
  closeModal();saveFilters();render(false);
 };
 $('#smName').focus();
}
/* ============ Tugas Streak (mirrors admin /(content)/streak-tasks 1:1) ============
   Enums, labels, validation, metrics + sortable table + form sections mirror
   streak-tasks.tsx + streak-task.service.ts + streak-task-sortable-table.tsx.
   Prototype-only deltas: static rows/metrics (no API), icon upload = URL field. */
var STTASK_TYPE_LBL={quiz:'Quiz',practice:'Latihan',tryout:'Tryout',share:'Share'};
var STTASK_STATUS_LBL={draft:'Draft',active:'Aktif',paused:'Dijeda'};
var STTASK_STATUS_CLS={draft:'gray',active:'green',paused:'amber'};
var STTASK_PERIOD_LBL={daily:'Harian',weekly:'Mingguan',lifetime:'Sekali seumur hidup'};
/* Type -> icon. Used wherever a task is listed (dashboard card, table, preview). */
var STTASK_ICON={quiz:'ti-clipboard-check',practice:'ti-target',tryout:'ti-trophy',share:'ti-share-2'};
var STTASK_ICON_LBL={math:'Matematika',english:'Bahasa Inggris',indonesian:'Bahasa Indonesia',coin:'Koin'};
var STTASK_COLOR_LBL={violet:'Violet',blue:'Biru',emerald:'Hijau',amber:'Amber'};
var STTASK_RULE={quiz:'Batasi tugas berdasarkan subject yang harus dikerjakan siswa.',practice:'Batasi tugas berdasarkan paket latihan dan nilai minimum jika diperlukan.',tryout:'Batasi tugas berdasarkan paket tryout dan nilai minimum jika diperlukan.',share:'Tugas share tidak membutuhkan filter aktivitas tambahan.'};
