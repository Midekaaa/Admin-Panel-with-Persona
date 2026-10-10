/* 06-promo-referral.js — Voucher, quest, referral, undangan.
   Dipisah otomatis dari DESIGN ADMIN/new-admin.html. Muat BERURUTAN via <script> di index.html (classic script, globals bersama). */
function vouFind(id){return findRow('vouchers',id).d;}
function vouValText(d){return Number(d.value||0).toLocaleString('id-ID')+' koin';}
function vouGenCode(p){var c='ABCDEFGHJKLMNPQRSTUVWXYZ23456789';var s='';for(var i=0;i<6;i++)s+=c[Math.floor(Math.random()*c.length)];return (p||'TO')+'-'+s;}
function vouCardHTML(d){
 var pct=d.quota?Math.min(100,Math.round((d.used||0)/d.quota*100)):0;
 var opts=['Draft','Siap','Aktif','Kedaluwarsa'].map(function(s){return '<option'+(d.chip===s?' selected':'')+'>'+s+'</option>';}).join('');
 var foot='<div style="margin-top:auto;display:flex;gap:6px;align-items:center;flex-wrap:wrap;border-top:1px solid var(--border-soft);padding-top:10px"><button class="mini-btn" data-vouedit="'+esc(d.id)+'">'+ic(P_PENCIL,14)+'<span>Ubah</span></button><select class="mini-btn" data-vouflow="'+esc(d.id)+'" aria-label="Ubah status '+esc(d.t)+'">'+opts+'</select><span style="margin-left:auto;display:flex;gap:6px"><button class="mini-btn" data-voudup="'+esc(d.id)+'" aria-label="Duplikat sebagai Draft">'+ic(P_COPY,14)+'<span>Duplikat</span></button><button class="mini-btn ic danger" data-voudel="'+esc(d.id)+'" title="Hapus voucher" aria-label="Hapus voucher">'+ic(P_TRASH,14)+'</button></span></div>';
 return '<article class="card" style="box-shadow:none;display:flex;flex-direction:column;min-width:0;position:relative">'
 +'<div style="padding:14px 14px 4px">'
 +'<div style="display:flex;align-items:center;gap:8px"><span class="cell-s" style="font-weight:600;letter-spacing:.08em">VOUCHER</span><span style="margin-left:auto"><span class="status '+d.st[1]+'">'+esc(d.st[0])+'</span></span></div>'
 +'<div style="display:flex;align-items:center;gap:8px;margin-top:6px"><span style="flex:1;min-width:0;font-family:ui-monospace,Menlo,Consolas,monospace;font-size:20px;font-weight:700;color:var(--text-h);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(d.code)+'</span><button class="mini-btn ic" data-voucopy="'+esc(d.code)+'" title="Salin kode" aria-label="Salin kode">'+ic(P_COPY,14)+'</button></div>'
 +'<div class="cell-t" style="font-size:13.5px;font-weight:500;margin-top:2px">'+esc(d.t)+'</div></div>'
 +'<div style="position:relative;border-top:2px dashed var(--border);margin:12px 0 0"><span style="position:absolute;left:-9px;top:-10px;width:18px;height:18px;border-radius:50%;background:var(--bg-page)"></span><span style="position:absolute;right:-9px;top:-10px;width:18px;height:18px;border-radius:50%;background:var(--bg-page)"></span></div>'
 +'<div style="padding:12px 14px;display:flex;flex-direction:column;gap:8px;flex:1">'
 +'<dl class="kv" style="margin:0"><dt>Nilai</dt><dd><span class="status blue">'+esc(vouValText(d))+'</span></dd><dt>Terpakai</dt><dd>'+esc(d.used||0)+' dari '+esc(d.quota||0)+'<span style="display:block;height:6px;border-radius:99px;background:var(--bg-hover);margin-top:6px"><span style="display:block;height:100%;width:'+pct+'%;border-radius:99px;background:var(--primary)"></span></span></dd><dt>Berlaku</dt><dd>'+esc(d.mulai||'—')+' → '+esc(d.selesai||'—')+'</dd><dt>Penerima</dt><dd>'+esc(d.target||'Semua pelajar')+'</dd></dl>'
 +foot+'</div></article>';
}
/* Referral quests: admin makes the quest (A/B/C, one live), students make the links. */
var QUESTS=null;
function questAll(){if(!QUESTS)questLoad();return QUESTS;}
function questSave(){store.set('na3-quests-v2',JSON.stringify(QUESTS));}
function questLoad(){try{var s=store.get('na3-quests-v2');if(s){QUESTS=JSON.parse(s)||[];return;}}catch(_){}QUESTS=[
 {id:'Q-A',slot:'A',t:'Ajak teman baru',rewardIn:10,rewardJoin:10,mulai:'1 Okt 2026',selesai:'31 Des 2026',st:['Aktif','green'],chip:'Aktif',isLive:true},
 {id:'Q-B',slot:'B',t:'Lainnya',rewardIn:15,rewardJoin:10,mulai:'Belum diatur',selesai:'Belum diatur',st:['Draft','gray'],chip:'Draft',isLive:false},
 {id:'Q-C',slot:'C',t:'Bonus TO Akbar',rewardIn:15,rewardJoin:15,mulai:'Belum diatur',selesai:'Belum diatur',st:['Draft','gray'],chip:'Draft',isLive:false}];}
function questFind(id){var out=null;questAll().forEach(function(q){if(String(q.id)===String(id))out=q;});return out;}
function questActives(){return questAll().filter(function(q){return q.isLive;});}
function questLabel(){var a=questActives();if(!a.length)return 'Tanpa quest';return 'Quest '+a.map(function(q){return q.slot;}).join(', ');}
function questBadge(slot){var c={A:'blue',B:'purple',C:'amber'}[slot]||'gray';return '<span class="status '+c+'">Quest '+esc(slot||'')+'</span>';}
/* Ikon koin student app (smartcbt/public/assets/gamify/coin.png, disalin ke coin.png). */
var COIN_IMG='<img src="coin.png" alt="koin" style="width:15px;height:15px;vertical-align:-3px">';
function questForm(editId){
 modalFocus=document.activeElement;
 var q=editId?questFind(editId):null;if(!q)return;
 $('#modalBox').innerHTML='<div class="modal-h"><h3>Ubah Quest '+esc(q.slot)+'</h3><p>Nama, reward split, dan periode quest.</p></div>'
 +'<div class="modal-b">'
 +'<div class="field"><label for="qqName">Nama quest</label><input id="qqName" value="'+esc(q.t||'')+'" placeholder="cth: Ajak Teman SNBT"><span class="ferr" id="qqeName"></span></div>'
 +'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:13px">'
 +'<div class="field"><label for="qqIn">Koin pengajak</label><input id="qqIn" type="number" min="0" value="'+esc(q.rewardIn==null?'':q.rewardIn)+'"><span class="ferr" id="qqeIn"></span></div>'
 +'<div class="field"><label for="qqJoin">Koin pendaftar</label><input id="qqJoin" type="number" min="0" value="'+esc(q.rewardJoin==null?'':q.rewardJoin)+'"><span class="ferr" id="qqeJoin"></span></div>'
 +'</div>'
 +'<span class="fhint">Satu siswa satu reward. Share berkali-kali tetap dihitung 1.</span>'
 +'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:13px">'
 +'<div class="field"><label for="qqStart">Mulai <small>(opsional)</small></label><input id="qqStart" type="datetime-local"></div>'
 +'<div class="field"><label for="qqEnd">Selesai <small>(opsional)</small></label><input id="qqEnd" type="datetime-local"></div>'
 +'</div>'
 +'</div>'
 +'<div class="modal-f"><button class="btn" id="qqCancel">Batal</button><button class="btn primary" id="qqOk">Simpan</button></div>';
 $('#modalOv').classList.add('show');
 $('#qqCancel').onclick=closeModal;
 $('#qqOk').onclick=function(){
  var vN=$('#qqName').value.trim(),vI=$('#qqIn').value.trim(),vJ=$('#qqJoin').value.trim(),vS=$('#qqStart').value,vE=$('#qqEnd').value;
  var ok=true;
  function mark(id,msg){var f=$('#'+id),e=$('#qqe'+id.slice(2));if(f)f.classList.toggle('bad',!!msg);if(e){e.textContent=msg||'';e.classList.toggle('show',!!msg);}if(msg)ok=false;}
  mark('qqName',!vN?'Nama quest wajib diisi.':vN.length>80?'Nama maksimal 80 karakter.':'');
  mark('qqIn',(!/^\d+$/.test(vI)||+vI<0||+vI>32767)?'Koin 0 sampai 32767.':'');
  mark('qqJoin',(!/^\d+$/.test(vJ)||+vJ<0||+vJ>32767)?'Koin 0 sampai 32767.':'');
  if(!ok){var b1=$('#modalBox').querySelector('.bad');if(b1)b1.focus();return;}
  q.t=vN;q.rewardIn=+vI;q.rewardJoin=+vJ;if(vS)q.mulai=vS.replace('T',', ');if(vE)q.selesai=vE.replace('T',', ');
  questSave();syncInvQuest();closeModal();saveFilters();render(false);toast('Quest '+q.slot+' diperbarui');
 };
 var f0=$('#qqName');if(f0)f0.focus();
}
function questToggleLive(id){
 var q=questFind(id);if(!q)return;
 if(q.isLive){
  openConfirm('Nonaktifkan Quest '+q.slot+'?','Tautan yang ada tetap tercatat. Quest lain yang live tidak terganggu.','Nonaktifkan',function(){
   q.isLive=false;var m=QST.Draft;q.st=[m[0],m[1]];q.chip=m[0];
   questSave();syncInvQuest();saveFilters();render(false);toast('Quest '+q.slot+' nonaktif');
  });return;
 }
 openConfirm('Aktifkan Quest '+q.slot+'?','Berjalan bersama quest live lainnya. Tautan lama tetap tercatat.','Aktifkan',function(){
  q.isLive=true;var m2=QST.Aktif;q.st=[m2[0],m2[1]];q.chip=m2[0];
  questSave();syncInvQuest();saveFilters();render(false);toast('Quest '+q.slot+' live');
 });
}
function syncInvQuest(){var lbl=questLabel();var t=featOf('invitations');(t.rows||[]).forEach(function(r){if(!r.s0)r.s0=String(r.s||'');r.s=r.s0+' · '+lbl;});}
function vouchersView(page,t){
 var rows=filteredRows(t);
 var w={Aktif:0,Siap:1,Draft:2,Kedaluwarsa:3};
 rows=rows.slice().sort(function(a,b){return (w[a.chip]==null?9:w[a.chip])-(w[b.chip]==null?9:w[b.chip]);});
 var total=rows.length;var pages=Math.max(1,Math.ceil(total/PG_SIZE));
 if(state.pg>pages)state.pg=pages;
 var pageRows=rows.slice((state.pg-1)*PG_SIZE,state.pg*PG_SIZE);
 var body;
 if(state.loading)body=skelHTML(2,200);
  else if(!rows.length)body='<div style="margin:14px 16px;border:1px dashed var(--border);border-radius:14px;padding:36px 20px;text-align:center;color:var(--text-2)"><b>Belum ada voucher untuk filter ini.</b><br><br><button class="btn sm" data-reset>Reset filter</button> <button class="btn sm" data-vouquick>Tambah cepat</button> <button class="btn sm primary" data-vounew>Buat voucher</button></div>';
 else body='<div class="adsgrid" style="display:grid;grid-template-columns:1fr;gap:12px;padding:14px 16px">'+pageRows.map(vouCardHTML).join('')+'</div>';
 return listHero(page,t,'<button class="btn" data-vouquick>'+ic(P_ZAP,17)+'Tambah cepat</button><button class="btn primary" data-vounew>'+ic(P_PLUS,17)+'Buat voucher</button>')
  +'<div class="card"><div class="card-h"><div><div><h2>'+esc(t.title)+'</h2></div></div><div class="sp">'+(hasResetF()?'<button class="link" data-reset>Reset</button>':'')+'</div></div>'+filterBarHTML(t,'Cari voucher…')
  +body+tfootHTML(total,'voucher',pgPN(pages))+'</div>'+listFoot();
}
function linkMaster(){var t=featOf('referrals');if(!t._master)t._master=(t.rows||[]).slice();return t._master;}
function refQuestName(slot){var q=null;(questAll()||[]).forEach(function(x){if(String(x.slot)===String(slot))q=x;});return q?q.t:'';}
function refQuestJoin(slot){var q=null;(questAll()||[]).forEach(function(x){if(String(x.slot)===String(slot))q=x;});return q?q.rewardJoin:'';}
function questMinis(qs){
 var ordered=qs.slice().sort(function(a,b){return ((b.isLive?1:0)-(a.isLive?1:0));});
 if(!ordered.length)return '';
 return '<div class="cell-s" style="margin:0 2px 8px">Quest · '+ordered.filter(function(q){return q.isLive;}).length+' live</div>'
 +'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:12px;margin-bottom:12px">'
 +ordered.map(function(q){var isLive=!!q.isLive;
  return '<div class="card" style="box-shadow:none;padding:12px 14px 12px 24px;display:flex;flex-direction:column;gap:6px;position:relative;overflow:hidden">'
  +'<span class="st-stick" style="background:'+(isLive?'var(--secondary)':'var(--border)')+'"></span>'
  +'<div style="display:flex;gap:8px;align-items:center">'+questBadge(q.slot)+'<span class="cell-t" style="flex:1;min-width:0;font-size:14px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(q.t)+'</span></div>'
  +'<div class="cell-s">+'+esc(q.rewardIn||0)+' '+COIN_IMG+' pengajak · +'+esc(q.rewardJoin||0)+' '+COIN_IMG+' pendaftar</div>'
  +'<div class="cell-s">Berlaku '+esc(q.mulai||'—')+' → '+esc(q.selesai||'—')+'</div>'
  +'<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap;margin-top:2px"><button class="mini-btn" data-qedit="'+esc(q.id)+'" title="Ubah quest" aria-label="Ubah quest">'+ic(P_PENCIL,14)+'<span>Ubah</span></button>'+(isLive?'<button class="mini-btn" data-qact="'+esc(q.id)+'">Nonaktifkan</button>':'<button class="mini-btn primary" data-qact="'+esc(q.id)+'">Aktifkan</button>')+'</div>'
  +'</div>';}).join('')
 +'</div>';
}
function referralsView(page,t){
 questLoad();
 t.rows=linkMaster();
 return listHero(page,t,'')
  +reqWidget()
  +questMinis(questAll())
  +tableCard(page,t,false)
  +listFoot();
}
/* Minta Undangan now lives on Referral (Marketing only): small request strip, no standalone page. */
function reqWidget(){
 if(state.role!=='marketing')return '';
 reqLoad();reqExpire();
 var open=reqAll().filter(function(r){return r.team==='Marketing'&&r.chip==='Menunggu';}).length;
 return '<div class="card" style="margin-bottom:12px"><div style="padding:12px 14px;display:flex;gap:10px;align-items:center;flex-wrap:wrap"><div style="flex:1;min-width:0"><div class="cell-t">Minta Undangan</div><div class="cell-s">'+(open?open+' menunggu keputusan '+teamBadge('Tim User'):'Butuh undangan pengguna pilihan? Minta via '+teamBadge('Tim User')+'.')+'</div></div><button class="btn sm primary" data-reqnew>'+ic(P_PLUS,15)+'Minta undangan</button></div></div>';
}
VIEWS.vouchers=vouchersView;
VIEWS.referrals=referralsView;
/* Invite requests (prototype): Marketing requests, Tim User decides, all roles informed. */
var REQST={Menunggu:['Menunggu','amber'],Dikirim:['Dikirim','green'],Ditolak:['Ditolak','red'],Batal:['Batal','gray'],Kedaluwarsa:['Kedaluwarsa','gray']};
function reqAll(){var t=featOf('minta-undangan');return t.rows||[];}
function reqSave(){store.set('na3-reqinv',JSON.stringify(reqAll()));}
function reqLoad(){try{var s=store.get('na3-reqinv');var t=featOf('minta-undangan');if(s){t.rows=JSON.parse(s)||[];}else{t.rows=[
 {id:'REQ-301',email:'tu@sman1-cirebon.sch.id',cat:'Promo deal',detail:'bonus 25 koin, 100 kursi TO Akbar',t:'tu@sman1-cirebon.sch.id',s:'Promo deal · bonus 25 koin, 100 kursi TO Akbar',st:['Menunggu','amber'],by:'Raka',team:'Marketing',chip:'Menunggu',ts:Date.now()-36e5},
 {id:'REQ-299',email:'halo@bimbelalpha.id',cat:'Lainnya',detail:'akses demo guru BK',t:'halo@bimbelalpha.id',s:'Lainnya · akses demo guru BK',st:['Dikirim','green'],by:'Raka',team:'Marketing',chip:'Dikirim',ts:Date.now()-72e5}]};}catch(_){}}
function reqFind(id){var out=null;reqAll().forEach(function(r){if(String(r.id)===String(id))out=r;});return out;}
function copyText(v,okMsg){function done(){toast(okMsg||'Disalin: '+v);}try{if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(v).then(done,function(){toast(v);});else toast(v);}catch(_){toast(v);}}
function reqBell(t,s2,link){NOTIFS.unshift({id:'N-'+Math.floor(100+Math.random()*900),t:t,s:s2||'',c:'#1D4ED8',type:'Info',link:link||'invitations',read:false});}
function reqExpire(){var week=7*24*36e5;var now=Date.now();var ch=false;reqAll().forEach(function(r){if(r.chip==='Menunggu'&&r.ts&&now-r.ts>week){var m=REQST.Kedaluwarsa;r.st=[m[0],m[1]];r.chip=m[0];ch=true;}});if(ch)reqSave();}
function reqActsFor(){if(state.role==='user')return [{l:'Setujui',icn:P_CHECK,do:'reqok'},{l:'Tolak',icn:P_X,do:'reqno'},{l:'Detail',icn:P_EYE,do:'drawer'}];if(state.role==='marketing')return [{l:'Detail',icn:P_EYE,do:'drawer'},{l:'Batalkan',icn:P_X,do:'reqcancel'}];return [{l:'Detail',icn:P_EYE,do:'drawer'}];}
function reqRowsFor(){reqLoad();reqExpire();var all=reqAll();if(state.role==='marketing')return all.filter(function(r){return r.team==='Marketing';});return all;}
/* reqView retired: requests live on Referral (reqWidget), decisions in Undangan (invView). */
function reqView(page,t){
 t.rows=reqRowsFor();t.acts=reqActsFor();
 var actions='';
 if(state.role==='marketing')actions='<button class="btn primary" data-reqnew>'+ic(P_PLUS,17)+'Minta undangan</button>';
 else{var n=t.rows.filter(function(r){return r.chip==='Menunggu';}).length;if(n)actions='<span class="cell-s">'+n+' menunggu keputusan</span>';}
 return listHero(page,t,actions)+tableCard(page,t,false)+listFoot();
}
/* VIEWS.reqinv retired with the standalone page (see reqView note). */
function reqModal(){
 if(state.role!=='marketing'){toast('Hanya Marketing yang bisa meminta','Minta Tim User mengeksekusi.','err');return;}
 var open=reqAll().filter(function(r){return r.team==='Marketing'&&r.chip==='Menunggu';}).length;
 if(open>=5){toast('Maksimal 5 permintaan terbuka','Selesaikan yang lama dulu.','err');return;}
  /* Benefit simpel: undangan selalu untuk pengguna baru (Quest A). Tanpa dropdown. */
  var qslot='A';
  openModal({title:'Minta undangan',sub:'Tim User memutuskan. Kamu diberi tahu hasilnya.',fields:[
   {k:'email',l:'Email tujuan',type:'email',req:1,ph:'tu@sekolah.sch.id'},
   {k:'detail',l:'Penjelasan singkat',req:1,ph:'cth: user baru mendapatkan benefit +10 koin Quest A'}],
   submit:'Kirim permintaan',
   onSubmit:function(v){
    var benefit=' · benefit Quest '+qslot;
    var r={id:'REQ-'+Math.floor(100+Math.random()*900),email:v.email,cat:v.cat||'Promo deal',detail:v.detail,quest:qslot,t:v.email,s:(v.cat||'Promo deal')+' · '+v.detail+benefit,st:['Menunggu','amber'],by:'Raka',team:'Marketing',chip:'Menunggu',ts:Date.now()};
    reqAll().unshift(r);reqSave();reqBell('Permintaan undangan baru',v.email+' · '+r.s,'invitations');saveFilters();render(false);toast('Permintaan dikirim','Tim User memutuskan.');
   }});
}
function reqApprove(id){
 var r=reqFind(id);if(!r)return;
 if(state.role!=='user'&&state.role!=='admin'){toast('Hanya Tim User yang memutuskan',null,'err');return;}
 if(r.chip!=='Menunggu'){toast('Sudah diputuskan: '+r.chip,null,'err');return;}
 var m=REQST.Dikirim;r.st=[m[0],m[1]];r.chip=m[0];r.s=r.s+' · oleh Tim User';
 var inv={id:'INV-'+Math.floor(1000+Math.random()*9000),t:r.email,s:(r.cat||'')+' · diminta '+(r.by||''),st:['Menunggu','amber'],by:r.by||'Raka',chip:'Menunggu',reqId:r.id};
 inv.s0=inv.s;inv.s=inv.s0+' · '+questLabel();featOf('invitations').rows.unshift(inv);
 reqSave();reqBell('Undangan dikirim',r.email+' · permintaan '+(r.by||''));saveFilters();render(false);toast('Undangan dikirim ke '+r.email,'Tercatat di Undangan.');
}
function reqReject(id){
 var r=reqFind(id);if(!r)return;
 if(state.role!=='user'&&state.role!=='admin'){toast('Hanya Tim User yang memutuskan',null,'err');return;}
 if(r.chip!=='Menunggu'){toast('Sudah diputuskan: '+r.chip,null,'err');return;}
 openModal({title:'Tolak permintaan?',sub:r.email+' · '+r.s,fields:[{k:'why',l:'Alasan penolakan',req:1,ph:'cth: kuota sekolah penuh'}],submit:'Tolak',
  onSubmit:function(v){var m=REQST.Ditolak;r.st=[m[0],m[1]];r.chip=m[0];r.s=r.s+' · ditolak: '+v.why;reqSave();reqBell('Permintaan ditolak',r.email+' · '+v.why);saveFilters();render(false);toast('Permintaan ditolak');}});
}
function reqCancel(id){
 var r=reqFind(id);if(!r)return;
 if(r.chip==='Menunggu'){
  openConfirm('Batalkan permintaan '+r.email+'?','Permintaan hilang dari antrean Tim User.','Batalkan',function(){
   var m=REQST.Batal;r.st=[m[0],m[1]];r.chip=m[0];reqSave();saveFilters();render(false);toast('Permintaan dibatalkan');
  });return;
 }
 if(r.chip==='Dikirim'){
  openConfirm('Tarik kembali undangan '+r.email+'?','Undangan yang belum diterima ikut dicabut.','Tarik kembali',function(){
   var t=featOf('invitations');t.rows=(t.rows||[]).filter(function(x){return !(x.reqId&&String(x.reqId)===String(id)&&x.chip==='Menunggu');});
   var m=REQST.Batal;r.st=[m[0],m[1]];r.chip=m[0];reqSave();reqBell('Undangan ditarik',r.email,'invitations');saveFilters();render(false);toast('Undangan ditarik kembali');
  });return;
 }
 toast('Tidak ada yang bisa dibatalkan',r.chip,'err');
}
/* Undangan + permintaan: Tim User memantau semua undangan dan mengeksekusi permintaan Marketing di sini. */
function invView(page,t){
 reqLoad();syncInvQuest();
 var pend=reqAll().filter(function(r){return r.chip==='Menunggu';});
 var sec='';
 if(state.role!=='marketing'&&pend.length){
  sec='<div class="card" style="margin-bottom:12px"><div class="card-h"><div><div><h2>Permintaan dari Marketing</h2><p>'+pend.length+' menunggu keputusan · kirim atau tolak dari sini</p></div></div></div><div class="act-list">'
  +pend.map(function(r){return '<div class="ev"><span class="ev-ic tone-primary">'+ic(P_MAIL,17)+'</span><div class="et"><div class="et-t">'+esc(r.email)+'</div><time>'+esc(r.cat||'')+' · '+esc(r.detail||'')+(r.quest?(' · benefit Quest '+esc(r.quest)):'')+' · '+esc(r.by||'')+'</time></div><button class="btn sm primary" data-do="reqok" data-id="'+esc(r.id)+'" style="flex:0 0 auto">Setujui</button><button class="btn sm" data-do="reqno" data-id="'+esc(r.id)+'" style="flex:0 0 auto">Tolak</button></div>';}).join('')
  +'</div></div>';
 }
 var primary='<button class="btn primary" data-new>'+ic(P_PLUS,17)+'Buat '+esc(t.title)+'</button>';
 return listHero(page,t,primary)+sec+tableCard(page,t,false)+listFoot();
}
VIEWS.invitations=invView;
function vouForm(editId){
 modalFocus=document.activeElement;
 var d=editId?vouFind(editId):null;
 var target=d?(d.targetKind||'Semua'):'Semua';
 $('#modalBox').innerHTML='<div class="modal-h"><h3>'+(d?'Ubah voucher':'Buat voucher')+'</h3><p>Atur kode, nilai, kuota, jadwal, dan penerima.</p></div>'
 +'<div class="modal-b">'
 +'<div class="field"><label for="vfName">Nama voucher</label><input id="vfName" value="'+esc(d?(d.t||''):'')+'" placeholder="cth: Diskon TO Akbar 13"><span class="ferr" id="vfeName"></span></div>'
 +'<div class="field"><label for="vfCode">Kode <small>(kosongkan untuk kode otomatis)</small></label><div style="display:flex;gap:8px"><input id="vfCode" value="'+esc(d?(d.code||''):'')+'" placeholder="TO-XXXXXX" autocomplete="off" style="flex:1;min-width:0;text-transform:uppercase"><button class="mini-btn" id="vfGen" style="flex:0 0 auto">'+ic('ti-reload',14)+'<span>Acak</span></button></div><span class="ferr" id="vfeCode"></span></div>'
 +'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:13px">'
 +'<div class="field"><label for="vfVal">Nilai (koin)</label><input id="vfVal" type="number" min="1" value="'+esc(d?(d.value==null?'':d.value):'')+'" placeholder="cth: 50"><span class="ferr" id="vfeVal"></span></div>'
 +'<div class="field"><label for="vfQuota">Kuota</label><input id="vfQuota" type="number" min="1" value="'+esc(d?(d.quota==null?'':d.quota):'')+'" placeholder="cth: 100"><span class="ferr" id="vfeQuota"></span></div>'
 +'</div>'
 +'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:13px">'
 +'<div class="field"><label for="vfStart">Mulai <small>(opsional)</small></label><input id="vfStart" type="datetime-local"><span class="ferr" id="vfeStart"></span></div>'
 +'<div class="field"><label for="vfEnd">Selesai <small>(opsional)</small></label><input id="vfEnd" type="datetime-local"><span class="ferr" id="vfeEnd"></span></div>'
 +'</div>'
 +'<div class="field"><label>Penerima</label><div class="seg" role="group" aria-label="Penerima"><button data-vt="Semua" class="'+(target==='Semua'?'on':'')+'">Semua</button><button data-vt="Acak" class="'+(target==='Acak'?'on':'')+'">Acak</button><button data-vt="Pilihan" class="'+(target==='Pilihan'?'on':'')+'">Pilihan</button></div><span class="fhint" id="vfTargetHint"></span></div>'
 +'<div class="field" id="vfWN"><label for="vfN">Jumlah penerima</label><input id="vfN" type="number" min="1" value="'+esc(d?(d.targetN==null?'':d.targetN):'')+'" placeholder="cth: 50"><span class="ferr" id="vfeN"></span></div>'
 +'</div>'
 +'<div class="modal-f"><button class="btn" id="vfCancel">Batal</button><button class="btn primary" id="vfOk">'+(d?'Simpan':'Buat')+'</button></div>';
 $('#modalOv').classList.add('show');
 function targetHint(){var h={Semua:'Semua pelajar bisa memakai kode ini.',Acak:'Sistem memilih N pelajar secara acak.',Pilihan:'N kursi untuk sekolah atau grup tertentu.'};var el=$('#vfTargetHint');if(el)el.textContent=h[target]||'';var w=$('#vfWN');if(w)w.style.display=target==='Semua'?'none':'';}
 $('#modalBox').querySelectorAll('[data-vt]').forEach(function(b){b.onclick=function(){target=b.getAttribute('data-vt');$('#modalBox').querySelectorAll('[data-vt]').forEach(function(x){x.classList.toggle('on',x===b);});targetHint();};});
 $('#vfGen').onclick=function(){var el=$('#vfCode');if(el)el.value=vouGenCode('TO');};
 targetHint();
 $('#vfCancel').onclick=closeModal;
 $('#vfOk').onclick=function(){
  var vN=$('#vfName').value.trim(),vC=$('#vfCode').value.trim().toUpperCase(),vV=$('#vfVal').value.trim(),vQ=$('#vfQuota').value.trim(),vS=$('#vfStart').value,vE=$('#vfEnd').value,vT=$('#vfN').value.trim();
  var ok=true;
  function mark(id,msg){var f=$('#'+id),e=$('#vfe'+id.slice(2));if(f)f.classList.toggle('bad',!!msg);if(e){e.textContent=msg||'';e.classList.toggle('show',!!msg);}if(msg)ok=false;}
  mark('vfName',!vN?'Nama voucher wajib diisi.':vN.length>80?'Nama maksimal 80 karakter.':'');
  mark('vfCode',(vC&&!/^[A-Z0-9-]{3,20}$/.test(vC))?'Kode 3–20 karakter: huruf, angka, strip.':'');
  var nV=Number(vV);
  if(!vV)mark('vfVal','Nilai wajib diisi.');
  else if(!/^\d+$/.test(vV)||nV<1||nV>32767)mark('vfVal','Koin 1 sampai 32767.');
  else mark('vfVal','');
  mark('vfQuota',(!/^\d+$/.test(vQ)||+vQ<1)?'Kuota minimal 1.':'');
  if(vS&&vE&&vE<=vS)mark('vfEnd','Waktu selesai harus setelah waktu mulai.');else mark('vfEnd','');
  if(target!=='Semua')mark('vfN',(!/^\d+$/.test(vT)||+vT<1)?'Jumlah penerima minimal 1.':'');else mark('vfN','');
  if(!ok){var bad1=$('#modalBox').querySelector('.bad');if(bad1)bad1.focus();return;}
  if(!vC)vC=vouGenCode('TO');
  var tgt=target==='Semua'?'Semua pelajar':target==='Acak'?('Acak · '+vT+' orang'):('Pilihan · '+vT+' kursi');
  var summ=nV.toLocaleString('id-ID')+' koin · kuota '+vQ+' · '+tgt.toLowerCase();
  var t=featOf('vouchers');
  if(d){d.t=vN;d.code=vC;d.kind='Koin';d.value=nV;d.quota=+vQ;d.target=tgt;d.targetKind=target;d.targetN=target==='Semua'?'':+vT;d.s=summ;if(vS)d.mulai=vS.replace('T',', ');if(vE)d.selesai=vE.replace('T',', ');toast('Voucher diperbarui');}
  else{t.rows.unshift({id:'V-'+Math.floor(100+Math.random()*900),t:vN,s:summ,st:['Draft','gray'],by:'Raka',chip:'Draft',code:vC,kind:'Koin',value:nV,quota:+vQ,used:0,mulai:vS?vS.replace('T',', '):'Belum diatur',selesai:vE?vE.replace('T',', '):'Belum diatur',target:tgt,targetKind:target,targetN:target==='Semua'?'':+vT});toast('Voucher dibuat sebagai Draft');}
  closeModal();saveFilters();render(false);
 };
 var f0=$('#vfName');if(f0)f0.focus();
}
function vouApply(id,target){var m=VOUCHST[target]||VOUCHST.Draft;var d=setChip(featOf('vouchers'),id,m[0],m[1]);if(!d)return null;saveFilters();render(false);return d;}
function vouFlow(id,target){
 if(target==='Aktif'){openModal({title:'Aktifkan voucher ini?',sub:'Kode bisa dipakai pelajar sesuai jadwal dan kuota.',fields:[],submit:'Aktifkan',onSubmit:function(){vouApply(id,'Aktif');toast('Voucher aktif');}});return;}
 vouApply(id,target);toast('Status voucher diperbarui');
}
function vouDelete(id){
 var d=vouFind(id);
 openConfirm('Hapus voucher '+((d&&d.code)||id)+'?','Kode hilang dari daftar dan tidak bisa dipakai lagi.','Hapus',function(){
  var t=featOf('vouchers');var gone=[];t.rows=(t.rows||[]).filter(function(r){if(r.id===id){gone.push(r);return false;}return true;});render(false);
  toast('Voucher dihapus',null,null,{label:'Urungkan',fn:function(){gone.forEach(function(r){t.rows.unshift(r);});render(false);}});
 });
}
function vouDuplicate(id){var t=featOf('vouchers');var d=vouFind(id);if(!d)return;var c={};for(var k in d)c[k]=d[k];c.id='V-'+Math.floor(100+Math.random()*900);c.code=vouGenCode('TO');c.chip='Draft';c.st=['Draft','gray'];c.used=0;t.rows.unshift(c);saveFilters();render(false);toast('Voucher diduplikat sebagai Draft');}
function refRevoke(id){
 var m=linkMaster();var d=null;m.forEach(function(r){if(String(r.id)===String(id))d=r;});if(!d)return;
 openConfirm('Cabut tautan '+((d&&d.code)||id)+'?','Tautan berhenti berlaku. Siswa yang sudah join tetap tercatat.','Cabut',function(){
  var gone=[];var t=featOf('referrals');t._master=m.filter(function(r){if(String(r.id)===String(id)){gone.push(r);return false;}return true;});
  render(false);
  toast('Tautan dicabut',null,null,{label:'Urungkan',fn:function(){gone.forEach(function(r){t._master.unshift(r);});render(false);}});
 });
}
function vouQuick(){
 openModal({title:'Tambah cepat voucher',sub:'Cukup nama. Sisanya otomatis: 10 koin, kuota 100, semua pelajar.',fields:[{k:'name',l:'Nama voucher',req:1,ph:'cth: Diskon kilat'}],submit:'Tambah',
  onSubmit:function(v){
   var code=vouGenCode('TO');
   featOf('vouchers').rows.unshift({id:'V-'+Math.floor(100+Math.random()*900),t:v.name,s:'10 koin · kuota 100 · semua pelajar',st:['Draft','gray'],by:'Raka',chip:'Draft',code:code,kind:'Koin',value:10,quota:100,used:0,mulai:'Belum diatur',selesai:'Belum diatur',target:'Semua pelajar',targetKind:'Semua',targetN:''});
   saveFilters();render(false);toast(code+' ditambahkan','Ubah untuk atur detail.');
  }});
}
