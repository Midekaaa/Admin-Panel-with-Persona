/* 07-shell-boot.js — Shell generik, drawer/modal, palette, boot.
   Dipisah otomatis dari DESIGN ADMIN/new-admin.html. Muat BERURUTAN via <script> di index.html (classic script, globals bersama). */
function listView(page,t){
 var canCreate=!!(t.form||t.cat==='content'||t.cat==='structure'||t.cat==='access');
 if(t.view&&VIEWS[t.view])return VIEWS[t.view](page,t);
 var primary=canCreate?'<button class="btn primary" data-new>'+ic(P_PLUS,17)+'Buat '+esc(t.title)+'</button>':'<button class="btn primary" data-t="Menyiapkan export…">'+ic(P_DOWNLOAD,17)+'Export</button>';
 return listHero(page,t,primary)
  +tableCard(page,t,false)
  +(page==='roles'?matrixHTML():'')
  +listFoot();
}
function settingsView(){
 function row(t,s,ctrl,last){return '<div style="display:flex;align-items:center;gap:12px;padding:12px 0'+(last?'':' ;border-bottom:1px solid var(--border-soft)')+'"><div style="flex:1;min-width:0"><div class="cell-t">'+t+'</div><div class="cell-s">'+s+'</div></div><div style="flex:0 0 auto">'+ctrl+'</div></div>';}
 var themeSeg='<div class="seg"><button data-theme-set="light" class="'+(state.theme==='light'?'on':'')+'">Terang</button><button data-theme-set="dark" class="'+(state.theme==='dark'?'on':'')+'">Gelap</button></div>';
 var bBrowser='<button class="btn sm" data-t="Izin notifikasi diminta ke browser">Minta izin</button>';
 var bEmail='<button class="btn sm" data-t="Email ringkasan diaktifkan">Aktifkan</button>';
 var bPasang='<button class="btn sm primary" data-t="Tombol pasang akan muncul dari browser">Pasang</button>';
 var bExport='<button class="btn sm" data-t="Menyiapkan export…">Export</button>';
 var bCadang='<button class="btn sm" data-t="Salinan baru dimulai">Cadangkan</button>';
 var bReset='<button class="btn sm danger" data-devreset>Kembalikan</button>';
 var hero='<div class="hero"><div><h1>Pengaturan</h1><p>Tampilan, notifikasi, dan data. Semua tersimpan otomatis di perangkat ini.</p></div></div>';
 var foot='<div style="height:56px"></div>';
 return hero+'<div class="card setv2" style="margin-bottom:12px"><div style="padding:6px 16px 14px">'
 +'<div class="nav-title" style="padding:12px 0 2px">Tampilan</div>'
 +row('Mode','Terang atau gelap, berlaku langsung.',themeSeg,1)
 +'<div class="nav-title" style="padding:12px 0 2px">Notifikasi</div>'
 +row('Notifikasi browser','Izin diminta ke browser dulu.',bBrowser,0)
 +row('Email ringkasan','Rekap antrean tiap pagi.',bEmail,1)
 +'<div class="nav-title" style="padding:12px 0 2px">Perangkat & data</div>'
 +row('Pasang aplikasi','Buka cepat dari layar utama.',bPasang,0)
 +row('Export rekap','Excel berisi data yang sedang tampil.',bExport,0)
 +row('Salinan cadangan','Terakhir berhasil 02:00.',bCadang,1)
 +'<div class="nav-title" style="padding:12px 0 2px">Bawaan</div>'
 +row('Reset lokal','Filter, tema, dan halaman terakhir kembali awal.',bReset,1)
 +'</div></div>'+foot;
}
function profileView(){
 return '<div class="hero"><div><h1>Profil</h1><p>Data diri, kontak, dan halaman yang boleh dibuka.</p></div><div class="hero-actions"><button class="btn primary" data-profile-edit>'+ic(P_PENCIL,17)+'Ubah profil</button></div></div>'
 +'<div class="card" style="margin-bottom:12px"><div style="padding:18px;display:flex;gap:14px;align-items:center"><span class="ava" style="width:56px;height:56px;font-size:18px;flex-basis:56px">AD</span><div><div class="cell-t" style="font-size:16px">Admin</div><div class="cell-s">admin@tryoutku.id · bergabung Jan 2025</div><div style="margin-top:6px;display:flex;gap:6px;flex-wrap:wrap"><span class="status blue">'+ROLES[state.role].label+'</span><span class="status gray">Verifikasi 2 langkah aktif</span></div></div></div></div>'
 +'<div class="grid2"><div class="card"><div class="card-h"><div><div><h2>Detail</h2></div></div></div><div style="padding:14px 16px"><dl class="kv"><dt>Nama</dt><dd>Admin</dd><dt>Email</dt><dd>admin@tryoutku.id</dd><dt>Username</dt><dd>@admin</dd><dt>WA</dt><dd>terisi · terverifikasi</dd><dt>Peran aktif</dt><dd>'+ROLES[state.role].label+'</dd></dl></div></div>'
 +'<div class="card"><div class="card-h"><div><div><h2>Akses</h2><p>halaman yang boleh dibuka peran ini</p></div></div><div class="sp"><button class="link" data-goto="roles">Kelola peran</button></div></div><div style="padding:14px 16px;display:flex;gap:6px;flex-wrap:wrap">'+flatNav(state.role).slice(0,12).map(function(n){return '<span class="perm">'+esc(n.t)+'</span>';}).join('')+'</div></div></div>'
 +'<div class="foot"><span>Foto profil bisa diganti di aplikasi asli.</span></div>';
}
function quickFAB(){
  var items=(QUICK[state.role]||QUICK.admin).map(function(q){return '<button data-hero-go="'+q[4]+'"'+(q[5]?' data-hero-new="1"':'')+'><span class="qi" style="background:'+q[3]+'">'+ic(q[0]==='plus'?P_PLUS:q[0]==='grid'?P_GRID:q[0]==='check'?P_CHECK:q[0]==='pencil'?P_PENCIL:q[0]==='mega'?P_MEGA:q[0]==='share'?'ti-share-2':q[0]==='chat'?P_CHAT:q[0]==='mail'?P_MAIL:q[0]==='gear'?P_GEAR:q[0]==='shield'?P_SHIELD:P_FILE,17)+'</span><span><b>'+esc(q[1])+'</b><small>'+esc(q[2])+'</small></span></button>';}).join('');
 return '<div class="fab-wrap"><button class="fab-btn" id="quickBtn" aria-haspopup="true">'+ic(P_ZAP,17)+'Pintasan<span class="chev">'+ic(P_CHEV,15)+'</span></button><div class="quick-pop" id="quickPop"><div class="quick">'+items+'</div></div></div>';
}
function render(skel){
 renderSidebar();renderCrumbs();
 var page=state.page||defPage();var t=featOf(page);
 var html='';
 if(page==='dashboard')html=dashView();
 else if(page==='settings')html=settingsView();
 else if(page==='profile')html=profileView();
 else html=listView(page,t);
 $('#content').innerHTML=html+quickFAB();
 bindAll(page,t);
 $('#content').dataset.ready='1';
 syncChrome();
}
/* ---- Detail drawer with tabs per category ---- */
var lastFocus=null;
function drawerTabs(t){
 var tabs=[['ringkas','Ringkasan']];
 if(state.dpage==='users')tabs.push(['keamanan','Keamanan']);
 if(state.dpage==='streak-tasks')return '<div class="tabs" role="tablist"><button role="tab" aria-selected="true" class="on" data-dtab="ringkas">Ringkasan</button></div>';
 if(t.cat==='queue')tabs.push(['riwayat','Riwayat'],['tindak','Tindak lanjut']);
 else if(t.cat==='content')tabs.push(['media','Media & versi'],['riwayat','Aktivitas']);
 else if(t.cat==='structure'||t.cat==='assess')tabs.push(['unit','Unit & versi'],['riwayat','Aktivitas']);
 else if(t.cat==='access')tabs.push(['akses','Akses'],['riwayat','Aktivitas']);
 else if(t.cat==='system')tabs.push(['data','Catatan sistem'],['riwayat','Aktivitas']);
 return '<div class="tabs" role="tablist">'+tabs.map(function(tb){return '<button role="tab" aria-selected="'+(state.tab===tb[0])+'" class="'+(state.tab===tb[0]?'on':'')+'" data-dtab="'+tb[0]+'">'+tb[1]+'</button>';}).join('')+'</div>';
}
function drawerBody(t,d){
  if((state.dpage==='vouchers'||state.dpage==='referrals')&&state.tab==='media')return '<div class="dsec"><h4>Pemakaian</h4><div style="font-size:12.8px;color:var(--text-2)">'+(state.dpage==='vouchers'?('Kode terpakai '+esc(d.used||0)+' dari '+esc(d.quota||0)+' kuota · '+esc(d.target||'')):('Tautan dipakai '+esc(d.used||0)+(d.max?(' dari '+esc(d.max)):'')+' pendaftar unik · +'+esc(d.coin||0)+' '+COIN_IMG+' per pendaftar.'))+'</div></div>';
  if(state.tab==='riwayat')return '<div class="timeline">'+actRow(['SA','Dibuat otomatis oleh sistem','2 hari lalu'])+actRow(['RK','Terakhir disentuh','20 menit lalu · tanpa anomali','#16A34A','R. Kartika'])+'</div>';
 if(state.tab==='tindak')return '<div class="dsec"><h4>Alur kerja antrean</h4><div style="font-size:12.8px;color:var(--text-2)">1. Tinjau isi & konteks di tab Ringkasan.<br>2. Tekan tombol utama di bawah untuk memproses.<br>3. Bulk tersedia dari tabel untuk banyak baris sekaligus.</div></div>';
 if(state.tab==='media')return '<div class="dsec"><h4>Versi</h4><div style="display:flex;flex-direction:column;gap:9px;margin-top:10px">'
 +'<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span class="status green">Aktif</span><span class="cell-t">v3</span><span class="cell-s">· versi yang tampil sekarang</span></div>'
 +'<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span class="status gray">Arsip</span><span class="cell-t">v2</span><span class="cell-s">· hanya lihat</span></div>'
 +'<div style="display:flex;gap:8px;align-items:center;flex-wrap:wrap"><span class="status gray">Arsip</span><span class="cell-t">v1</span><span class="cell-s">· hanya lihat</span></div>'
 +'</div></div>'
 +'<div class="dsec"><h4>Pratinjau siswa</h4><div class="cell-s" style="margin-top:6px">Tampil persis seperti dilihat pelajar.</div><div class="skel" style="height:120px;margin-top:8px" title="Pratinjau"></div></div>'
 +'<div style="display:flex;gap:8px;align-items:flex-start;font-size:12.5px;color:var(--text-2)">'+ic(P_ALERT,16)+'<span>Gambar rusak ditandai otomatis.</span></div>';
 if(state.tab==='unit')return '<div class="dsec"><h4>Unit & versi</h4><div style="font-size:12.8px;color:var(--text-2)">Subtes → Unit → sebaran soal. Unit yang belum dikunci ditandai <b>Perlu perhatian</b>; penerbitan butuh persetujuan.</div><dl class="kv"><dt>Kesiapan</dt><dd>82% · 2 unit belum dikunci</dd><dt>Versi aktif</dt><dd>v4 (Draft) · v3 (Terbit)</dd></dl>';
 if(state.tab==='akses')return '<div class="dsec"><h4>Siapa bisa buka</h4><div style="font-size:12.8px;color:var(--text-2)">'+esc(rolesFor(state.dpage||'dashboard'))+'. Ubah dari halaman Peran.</div></div>';
 if(state.tab==='data')return '<div class="cell-s">Catatan mentah untuk admin teknis: siapa, kapan, dari perangkat mana.</div><div class="json">'+esc(JSON.stringify({id:d.id,actor:d.by,status:d.st[0],detail:d.s,ip:'103.147.x.x',at:'2026-10-01T02:00:00+07:00'},null,2))+'</div>';
 if(state.tab==='keamanan')return '<div class="field"><label for="drPass">Kata sandi baru</label><input id="drPass" type="password" placeholder="Minimal 6 karakter" aria-label="Kata sandi baru" autocomplete="new-password"><span class="ferr" id="drPassErr"></span></div><button class="btn sm primary" data-drpass>Atur ulang kata sandi</button><div class="dsec"><h4>Zona berbahaya</h4><div style="font-size:12.8px;color:var(--text-2)">Akun dinonaktifkan. Data riwayat tetap tersimpan.</div><div style="margin-top:8px"><button class="btn sm danger" data-drdel>Hapus akun</button></div></div>';
 if(state.dpage==='invitations'&&state.tab==='ringkas')return '<div><span class="status '+d.st[1]+'">'+esc(d.st[0])+'</span></div><dl class="kv"><dt>Email</dt><dd>'+esc(d.t)+'</dd><dt>Info</dt><dd>'+esc(d.s)+'</dd><dt>ID</dt><dd>'+esc(d.id)+'</dd><dt>Letak menu</dt><dd>'+esc(groupOf(state.dpage||'dashboard').g)+'</dd></dl><div class="dsec"><h4>Tautan undangan</h4><div style="font-size:12.8px;color:var(--text-2);word-break:break-all">tryoutku.id/undang/'+esc(d.id)+'</div><div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn sm" data-t="Undangan dikirim ulang">Kirim ulang</button></div></div>';
 if(state.dpage==='users'&&state.tab==='akses')return '<div class="dsec"><h4>Peran</h4>'+['Tim Soal','Tim Marketing','Tim User','Admin'].map(function(r,i){return '<label style="display:flex;align-items:center;gap:9px;font-size:13px;font-weight:500;padding:7px 0"><input type="checkbox" data-drrole '+(i===2?'checked':'')+'> '+r+'</label>';}).join('')+'</div><div class="dsec"><h4>Izin khusus</h4><div style="display:flex;gap:6px;flex-wrap:wrap"><span class="perm">users.read</span><span class="perm">users.invite</span></div><div class="fhint" style="margin-top:6px">Kode izin dikelola di halaman Izin.</div></div><button class="btn sm primary" data-drsave>Simpan akses</button>';
 if(state.dpage==='roles'&&state.tab==='akses')return '<div class="dsec"><h4>Halaman yang boleh dibuka</h4>'+['Bank Soal','Latihan','Try Out','Laporan Soal','Media','Pengguna','Undangan','Iklan','Log Aktivitas'].map(function(f,i){return '<label style="display:flex;align-items:center;gap:9px;font-size:13px;font-weight:500;padding:7px 0"><input type="checkbox" data-drrole '+(i<4?'checked':'')+'> '+f+'</label>';}).join('')+'</div><button class="btn sm primary" data-drsave>Simpan akses</button>';
 if(state.dpage==='data-pelajar'&&state.tab==='ringkas')return '<div><span class="status '+d.st[1]+'">'+esc(d.st[0])+'</span></div><dl class="kv"><dt>Nama</dt><dd>'+esc(d.t)+'</dd><dt>Info</dt><dd>'+esc(d.s)+'</dd><dt>Sumber</dt><dd>'+esc(d.by)+'</dd></dl><div class="dsec"><h4>Catatan</h4><div style="font-size:12.8px;color:var(--text-2)">Data pelajar hanya bisa dilihat. Perubahan berasal dari pendaftaran atau undangan.</div></div>';
 if(state.dpage==='questions'&&state.tab==='media')return '<div class="dsec"><h4>Versi soal</h4><dl class="kv"><dt>v3 · aktif</dt><dd>dipakai 12x · siap dipakai</dd><dt>v2 · arsip</dt><dd>digantikan v3</dd><dt>v1 · arsip</dt><dd>hanya lihat</dd></dl></div><div class="dsec"><h4>Pemeriksaan terbit</h4><div style="font-size:12.8px;color:var(--text-2)">Kunci jawaban terisi · pembahasan ada · 1 gambar duplikat (peringatan).</div><div style="margin-top:8px"><button class="btn sm primary" data-t="Versi baru diterbitkan">Terbitkan versi</button></div></div>';
 if(state.dpage==='topics'&&state.tab==='ringkas')return '<div><span class="status '+d.st[1]+'">'+esc(d.st[0])+'</span></div><dl class="kv"><dt>Materi</dt><dd>'+esc(d.t)+'</dd><dt>Kelompok</dt><dd>'+esc(d.s)+'</dd></dl><div class="dsec"><h4>Nama lain</h4><div style="display:flex;gap:6px;flex-wrap:wrap"><span class="perm">Kuantor</span><span class="perm">Logika kuantor</span></div></div><div class="dsec"><h4>Gabung duplikat</h4><div style="font-size:12.8px;color:var(--text-2)">Mirip 92% dengan materi lain. Menggabung memindahkan semua soal.</div><div style="margin-top:8px"><button class="btn sm" data-t="Materi digabung">Gabungkan</button></div></div>';
 if(state.dpage==='media'&&state.tab==='ringkas')return '<div><span class="status '+d.st[1]+'">'+esc(d.st[0])+'</span></div><div class="skel" style="height:120px" title="Pratinjau"></div><dl class="kv"><dt>File</dt><dd>'+esc(d.t)+'</dd><dt>Info</dt><dd>'+esc(d.s)+'</dd></dl><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn sm" data-t="Menyiapkan export…">Export</button></div>';
 if(state.dpage==='universitas'&&state.tab==='ringkas')return '<div><span class="status '+d.st[1]+'">'+esc(d.st[0])+'</span></div><dl class="kv"><dt>Kampus</dt><dd>'+esc(d.t)+'</dd><dt>Info</dt><dd>'+esc(d.s)+'</dd></dl><div class="dsec"><h4>Program (3)</h4><div style="font-size:12.8px;color:var(--text-2)">S1 · Teknik Informatika<br>S1 · Manajemen<br>D4 · Teknologi Rekayasa</div><div style="margin-top:8px"><button class="btn sm" data-t="Tambah kombinasi prodi">Tambah prodi</button></div></div>';
 if(state.dpage==='drills'&&state.tab==='unit')return '<div class="dsec"><h4>Versi latihan</h4><label style="display:flex;gap:9px;font-size:13px;padding:6px 0;align-items:center"><input type="radio" name="drv" checked> v4 · siap dipakai</label><label style="display:flex;gap:9px;font-size:13px;padding:6px 0;align-items:center"><input type="radio" name="drv"> v3 · perlu perbaikan</label><div style="margin-top:8px"><button class="btn sm primary" data-t="Versi latihan diganti">Gunakan versi ini</button></div></div><dl class="kv"><dt>Peserta 7 hari</dt><dd>312</dd><dt>Sesi selesai</dt><dd>1.204</dd><dt>Rata-rata nilai</dt><dd>72,4</dd></dl>';
 if(state.dpage==='tryouts'&&state.tab==='ringkas')return '<div><span class="status '+d.st[1]+'">'+esc(d.st[0])+'</span></div><dl class="kv"><dt>Judul</dt><dd>'+esc(d.t)+'</dd><dt>Jadwal</dt><dd>'+esc(d.s)+'</dd><dt>ID</dt><dd>'+esc(d.id)+'</dd></dl><div class="dsec"><h4>Kesiapan</h4><div style="font-size:12.8px;color:var(--text-2)">Paket soal lengkap · jadwal terisi · 0 penghambat.</div><div style="margin-top:8px;display:flex;gap:8px;flex-wrap:wrap"><button class="btn sm primary" data-t="Try out dipublikasikan">Publikasikan</button><button class="btn sm" data-t="Membuka pemantau peserta">Pantau</button></div></div>';
 if(state.dpage==='grading'&&state.tab==='ringkas')return '<div><span class="status '+d.st[1]+'">'+esc(d.st[0])+'</span></div><dl class="kv"><dt>Jawaban</dt><dd>'+esc(d.t)+'</dd><dt>Konteks</dt><dd>'+esc(d.s)+'</dd></dl><div class="dsec"><h4>Rubrik</h4><div style="font-size:12.8px;color:var(--text-2)">Isi 40% · Struktur 30% · Bahasa 30% · maks 100 poin.</div></div><div class="field"><label for="drScore">Nilai (0–100)</label><input id="drScore" type="number" placeholder="cth: 85" aria-label="Nilai" inputmode="numeric"><span class="ferr" id="drScoreErr"></span></div><div class="field"><label for="drFb">Masukan untuk pelajar <small>(opsional)</small></label><textarea id="drFb" placeholder="Tulis masukan singkat…"></textarea></div><button class="btn sm primary" data-drgrade>Simpan nilai</button>';
 if(state.dpage==='feedbacks'&&state.tab==='ringkas')return '<div><span class="status '+d.st[1]+'">'+esc(d.st[0])+'</span></div><dl class="kv"><dt>Judul</dt><dd>'+esc(d.t)+'</dd><dt>Dari</dt><dd>'+esc(d.by)+' · '+esc(d.s)+'</dd></dl><div class="dsec"><h4>Pesan</h4><div style="font-size:12.8px;color:var(--text-2)">Timer berhenti saat tab tidak aktif di Chrome Android. Terjadi 2x saat TO Akbar.</div></div><div class="dsec"><h4>Perangkat</h4><div style="font-size:12px;color:var(--text-2)">Chrome 126 · Android 14 · 360×800</div></div><div class="field"><label for="drFbSt">Status</label><select id="drFbSt" aria-label="Status"><option>Menunggu</option><option>Ditinjau</option><option>Selesai</option><option>Ditutup</option></select></div><div class="field"><label for="drFbNote">Catatan admin <small>(opsional)</small></label><textarea id="drFbNote" placeholder="Tulis tindak lanjut…"></textarea></div><button class="btn sm primary" data-drsavefb>Simpan</button>';
 if(state.dpage==='question-reports'&&state.tab==='ringkas')return '<div><span class="status '+d.st[1]+'">'+esc(d.st[0])+'</span></div><dl class="kv"><dt>Soal</dt><dd>'+esc(d.t)+'</dd><dt>Pelapor</dt><dd>'+esc(d.by)+' · '+esc(d.s)+'</dd></dl><div class="dsec"><h4>Catatan pelapor</h4><div style="font-size:12.8px;color:var(--text-2)">Kunci B dan D sama-sama benar menurut pembahasan.</div></div><div class="dsec"><h4>Laporan lain (1)</h4><div style="font-size:12.8px;color:var(--text-2)">SR-2088 · gambar tidak tampil · Fisika.</div></div><div class="field"><label for="drRepSt">Status</label><select id="drRepSt" aria-label="Status"><option>Menunggu</option><option>Ditinjau</option><option>Selesai</option><option>Ditolak</option></select></div><div class="field"><label for="drRepWhy">Alasan penolakan <small>(wajib jika Ditolak)</small></label><input id="drRepWhy" placeholder="cth: kunci sudah benar"><span class="ferr" id="drRepErr"></span></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn sm primary" data-drsaverep>Simpan</button><button class="btn sm" data-drgosoal>Buka soal</button></div>';
 if(state.dpage==='testimonials'&&state.tab==='ringkas')return '<div><span class="status '+d.st[1]+'">'+esc(d.st[0])+'</span></div><dl class="kv"><dt>Testimoni</dt><dd>'+esc(d.t)+'</dd><dt>Info</dt><dd>'+esc(d.s)+'</dd></dl><div class="dsec"><h4>Rating</h4><div style="color:var(--gold);font-size:18px">'+ic('ti-star',18)+ic('ti-star',18)+ic('ti-star',18)+ic('ti-star',18)+ic('ti-star',18)+'</div></div><div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn sm primary" data-t="Testimoni diterbitkan">Terbitkan</button><button class="btn sm" data-t="Testimoni dijadikan unggulan">Unggulkan</button></div>';
  if(state.dpage==='ads'&&state.tab==='ringkas')return '<div><span class="status '+d.st[1]+'">'+esc(d.st[0])+'</span></div><dl class="kv"><dt>Iklan</dt><dd>'+esc(d.t)+'</dd><dt>Varian</dt><dd>'+(d.variant==='full'?'Lengkap':'Gambar saja')+'</dd><dt>Jadwal</dt><dd>'+esc(d.mulai||'Belum diatur')+' → '+esc(d.selesai||'Belum diatur')+'</dd><dt>Urutan</dt><dd>'+d.order+'</dd>'+(d.perf?'<dt>Klik</dt><dd>'+esc(d.perf.clicks)+' dalam '+esc(d.perf.days)+' hari tayang</dd><dt>CTR</dt><dd>'+esc(d.perf.ctr)+'</dd>':'')+'</dl><div class="dsec"><h4>Alur status</h4><div style="font-size:12.8px;color:var(--text-2)">Draft → Menunggu → Tayang → Selesai. Tayang meminta konfirmasi.</div></div>';
  if(state.dpage==='streak-tasks'&&state.tab==='ringkas'){
   var stCfg=(d.config||{});
   var days=state.streakDays||30;
   var dm=stScale(d.metric,days);
   var dIcon=d.iconUrl?'<img src="'+esc(d.iconUrl)+'" alt="'+esc(d.iconAlt||d.title)+'" style="width:36px;height:36px;border-radius:10px;border:1px solid var(--border);object-fit:cover;flex:0 0 36px">':'<span style="width:36px;height:36px;border-radius:10px;display:grid;place-items:center;background:var(--primary-50);color:var(--primary);font-weight:600;font-size:11px;flex:0 0 36px">'+esc(stIni(d.title))+'</span>';
   var dCta=(stCfg.ctaLabel||stCfg.ctaUrl)?(esc(stCfg.ctaLabel||'Mulai')+(stCfg.ctaUrl?' → '+esc(stCfg.ctaUrl):'')):'Bawaan';
    return '<div style="display:flex;gap:10px;align-items:center">'+dIcon+'<span style="min-width:0;flex:1"><span class="cell-t" style="display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">'+esc(d.title||'—')+'</span><span class="cell-s" style="display:block">'+esc(d.code||'')+' · '+esc(STTASK_TYPE_LBL[d.type]||'')+'</span></span><span class="status '+d.st[1]+'">'+esc(d.st[0])+'</span></div>'
   +'<div style="display:flex;flex-direction:column;gap:10px;margin-top:12px">'
   +'<div><div class="cell-s">Aturan</div><div class="cell-t">'+esc(stRuleText(d))+'</div></div>'
   +'<div><div class="cell-s">Reward</div><div class="cell-t">'+esc(d.rewardAmount)+' koin</div></div>'
   +'<div><div class="cell-s">Kinerja · '+days+' hari</div><div class="cell-t">'+dm.completedCount.toLocaleString('id-ID')+' selesai · '+dm.uniqueUsers.toLocaleString('id-ID')+' pengguna · '+dm.completedToday+' hari ini</div></div>'
   +'</div>'
   +'<p style="font-size:12.8px;color:var(--text-2);margin:12px 0 0">'+esc(d.description||'—')+'</p>'
   +'<details class="st-adv" style="margin-top:12px"><summary>'+ic('ti-settings',16)+'<span>Detail teknis</span></summary><div class="adv-b"><div class="cell-s">Tombol siswa: '+dCta+'</div>'+(stCfg.successMessage?'<div class="cell-s">Pesan sukses: '+esc(stCfg.successMessage)+'</div>':'')+'</div></details>';
  }
  if(state.dpage==='vouchers'&&state.tab==='ringkas')return '<div><span class="status '+d.st[1]+'">'+esc(d.st[0])+'</span></div><dl class="kv"><dt>Kode</dt><dd style="font-family:ui-monospace,Menlo,Consolas,monospace">'+esc(d.code||d.id)+'</dd><dt>Nilai</dt><dd>'+esc(vouValText(d))+'</dd><dt>Kuota</dt><dd>Terpakai '+esc(d.used||0)+' dari '+esc(d.quota||0)+'</dd><dt>Jadwal</dt><dd>'+esc(d.mulai||'—')+' → '+esc(d.selesai||'—')+'</dd><dt>Penerima</dt><dd>'+esc(d.target||'—')+'</dd></dl><div class="dsec"><h4>Alur status</h4><div style="font-size:12.8px;color:var(--text-2)">Draft → Siap → Aktif → Kedaluwarsa. Mengaktifkan meminta konfirmasi.</div></div>';
  if(state.dpage==='referrals'&&state.tab==='ringkas')return '<div><span class="status '+d.st[1]+'">'+esc(d.st[0])+'</span></div><dl class="kv"><dt>Tautan</dt><dd>'+esc(d.link||d.code||'')+'</dd><dt>Penyebar</dt><dd>'+esc(d.owner||d.by||'')+'</dd><dt>Pendaftar unik</dt><dd>'+esc(d.used||0)+(d.max?(' dari '+esc(d.max)):'')+'</dd><dt>Koin per pendaftar</dt><dd>+'+esc(d.coin||0)+' '+COIN_IMG+'</dd><dt>Ikut quest</dt><dd>'+questBadge(d.quest)+' '+esc(refQuestName(d.quest))+'</dd><dt>Dibuat</dt><dd>'+esc(d.joined||'—')+'</dd></dl>';
  if(state.dpage==='articles'&&state.tab==='ringkas')return '<div><span class="status '+d.st[1]+'">'+esc(d.st[0])+'</span></div><dl class="kv"><dt>Judul</dt><dd>'+esc(d.t)+'</dd><dt>Tanggal</dt><dd>'+esc(d.published||'—')+'</dd><dt>Slug</dt><dd>'+esc(d.slug||d.id)+'</dd></dl>'+(d.excerpt?'<div class="dsec"><h4>Ringkasan</h4><div style="font-size:12.8px;color:var(--text-2)">'+esc(d.excerpt)+'</div></div>':'');
  return '<div><span class="status '+d.st[1]+'">'+esc(d.st[0])+'</span></div><dl class="kv"><dt>Penanggung jawab</dt><dd>'+esc(d.by)+'</dd><dt>Detail</dt><dd>'+esc(d.s)+'</dd><dt>ID</dt><dd>'+esc(d.id)+'</dd><dt>Letak menu</dt><dd>'+esc(groupOf(state.dpage||'dashboard').g)+'</dd></dl><div class="dsec"><h4>Catatan</h4><div style="font-size:12.8px;color:var(--text-2)">Riwayat versi dan lampiran tampil di tab sebelah.</div></div>';
}
function openDrawer(id,tab){
 var page=state.page||defPage();if(page==='dashboard')page=featOf('dashboard').queue;
 var f=findRow(page,id);var t=f.t,d=f.d;
 if(!d){toast('Data tidak ditemukan',id,'err');return;}
 lastFocus=document.activeElement;state.tab=tab||'ringkas';state.dpage=page;
 paintDrawer(t,d);
 $('#scrim').classList.add('show');$('#drawer').classList.add('show');
 var c=$('#drClose');if(c)c.focus();
}
function paintDrawer(t,d){
 var dTitle=d.title||d.t||d.code||d.id;
 var dSub=esc(d.code||d.id)+' · '+esc(d.st[0]);
 var isSt=(state.dpage==='streak-tasks');
 var foot=isSt?'<div class="drawer-f"><button class="btn primary" style="flex:1;justify-content:center" data-stdedit="'+esc(d.id)+'">Ubah tugas</button></div>'
  :'<div class="drawer-f"><button class="btn primary" style="flex:1;justify-content:center" data-dact="'+esc(d.id)+'">'+esc(t.qa||'Proses')+'</button></div>';
 $('#drawer').innerHTML='<div class="drawer-h"><div style="display:flex;gap:8px;align-items:center"><h3 style="flex:1">'+esc(dTitle)+'</h3><button class="iconbtn" id="drClose" aria-label="Tutup detail">'+ic(P_X,18)+'</button></div><p>'+dSub+'</p>'+drawerTabs(t)+'</div>'
 +'<div class="drawer-b" id="drawerBody">'+drawerBody(t,d)+'</div>'
 +foot;
 $('#drClose').onclick=closeDrawer;
 $('#drawer').querySelectorAll('[data-t]').forEach(function(b){b.onclick=function(){toast(b.getAttribute('data-t'));closeDrawer();};});
 $('#drawer').querySelectorAll('[data-dtab]').forEach(function(b){b.onclick=function(){state.tab=b.getAttribute('data-dtab');paintDrawer(t,d);};});
 var da=$('#drawer').querySelector('[data-dact]');
 if(da)da.onclick=function(){toast((t.qa||'Proses')+': '+esc(d.id),'Sudah dicatat.');closeDrawer();};
 var dp=$('#drawer').querySelector('[data-drpass]');if(dp)dp.onclick=function(){var v=$('#drPass').value;var er=$('#drPassErr');if(!v||v.length<6){er.textContent='Minimal 6 karakter.';er.classList.add('show');return;}er.classList.remove('show');toast('Kata sandi diperbarui');closeDrawer();};
 var dl=$('#drawer').querySelector('[data-drdel]');if(dl)dl.onclick=function(){openConfirm('Hapus akun ini?','Akun dinonaktifkan. Data riwayat tetap tersimpan.','Hapus',function(){toast('Akun dihapus');closeDrawer();});};
 var ds=$('#drawer').querySelector('[data-drsave]');if(ds)ds.onclick=function(){toast('Hak akses disimpan');closeDrawer();};
 var dg=$('#drawer').querySelector('[data-drgrade]');if(dg)dg.onclick=function(){var v=$('#drScore').value.trim();var er=$('#drScoreErr');if(v===''||!/^\d+$/.test(v)||+v<0||+v>100){er.textContent='Isi angka 0 sampai 100.';er.classList.add('show');return;}er.classList.remove('show');toast('Nilai '+v+' disimpan','Jawaban masuk antrean review.');closeDrawer();};
 var df=$('#drawer').querySelector('[data-drsavefb]');if(df)df.onclick=function(){toast('Status masukan disimpan');closeDrawer();};
 var dr2=$('#drawer').querySelector('[data-drsaverep]');if(dr2)dr2.onclick=function(){var st=$('#drRepSt').value;var wy=$('#drRepWhy').value.trim();var er=$('#drRepErr');if(st==='Ditolak'&&!wy){er.textContent='Alasan wajib diisi jika Ditolak.';er.classList.add('show');return;}er.classList.remove('show');toast('Laporan '+st.toLowerCase());closeDrawer();};
  var dg2=$('#drawer').querySelector('[data-drgosoal]');if(dg2)dg2.onclick=function(){closeDrawer();go('questions');};
  var sde=$('#drawer').querySelector('[data-stdedit]');if(sde)sde.onclick=function(){var sid=sde.getAttribute('data-stdedit');closeDrawer();setTimeout(function(){streakTaskForm(isNaN(+sid)?sid:+sid);},80);};
}
function closeDrawer(){$('#scrim').classList.remove('show');$('#drawer').classList.remove('show');if(lastFocus&&lastFocus.focus)lastFocus.focus();}
/* ---- Modal: create / edit / confirm with inline validation ---- */
var modalFocus=null;
function openModal(o){
 modalFocus=document.activeElement;
 var fields=(o.fields||[]).map(function(f){
  var input;
  if(f.type==='select')input='<select id="mf-'+f.k+'" aria-label="'+esc(f.l)+'">'+(f.opts||[]).map(function(op){return '<option>'+esc(op)+'</option>';}).join('')+'</select>';
  else if(f.type==='textarea')input='<textarea id="mf-'+f.k+'" placeholder="'+esc(f.ph||'')+'" aria-label="'+esc(f.l)+'"></textarea>';
  else input='<input id="mf-'+f.k+'" type="'+(f.type||'text')+'" placeholder="'+esc(f.ph||'')+'" aria-label="'+esc(f.l)+'"'+(f.type==='number'?' inputmode="numeric"':'')+'>';
  return '<div class="field"><label for="mf-'+f.k+'">'+esc(f.l)+(f.req?'':' <small>(opsional)</small>')+'</label>'+input+(f.hint?'<span class="fhint">'+esc(f.hint)+'</span>':'')+'<span class="ferr" id="mfe-'+f.k+'"></span></div>';
  }).join('');
  if(!fields){
   var cIcon=o.danger?P_TRASH:P_CHECK;
   $('#modalBox').innerHTML='<div class="modal-h modal-confirm"><span class="confirm-ic '+(o.danger?'bad':'ok')+'">'+ic(cIcon,22)+'</span><h3>'+esc(o.title)+'</h3>'+(o.sub?'<p>'+esc(o.sub)+'</p>':'')+'</div><div class="modal-f confirm-f"><button class="btn" id="mCancel">Batal</button><button class="btn '+(o.danger?'danger-solid':'primary')+'" id="mOk">'+esc(o.submit||'Simpan')+'</button></div>';
  }else
  $('#modalBox').innerHTML='<div class="modal-h"><h3>'+esc(o.title)+'</h3>'+(o.sub?'<p>'+esc(o.sub)+'</p>':'')+'</div><div class="modal-b">'+fields+'</div><div class="modal-f"><button class="btn" id="mCancel">Batal</button><button class="btn '+(o.danger?'danger':'primary')+'" id="mOk">'+esc(o.submit||'Simpan')+'</button></div>';
 $('#modalOv').classList.add('show');
 $('#mCancel').onclick=closeModal;
 $('#mOk').onclick=function(){
  var vals={},ok=true,firstBad=null;
  (o.fields||[]).forEach(function(f){
   var el=$('#mf-'+f.k);var v=el?el.value.trim():'';
   var err=$('#mfe-'+f.k);var msg='';
   if(f.req&&!v)msg=esc(f.l)+' wajib diisi.';
   else if(v&&f.type==='email'&&!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(v))msg='Format email tidak valid. Contoh: nama@sekolah.sch.id.';
   else if(v&&f.type==='number'&&!/^\d+$/.test(v))msg='Hanya angka yang diperbolehkan.';
   if(err){err.textContent=msg;err.classList.toggle('show',!!msg);}
   if(el)el.classList.toggle('bad',!!msg);
   if(msg){ok=false;if(!firstBad)firstBad=el;}
   vals[f.k]=v;
  });
  if(!ok){if(firstBad)firstBad.focus();return;}
  closeModal();o.onSubmit(vals);
 };
  var f0=$('#modalBox').querySelector('input,select,textarea');if(f0)f0.focus();else{var fb=$('#mCancel');if(fb)fb.focus();}
}
function closeModal(){$('#modalOv').classList.remove('show');$('#modalBox').classList.remove('wide');if(modalFocus&&modalFocus.focus)modalFocus.focus();}
function openConfirm(title,sub,yesLabel,onYes){openModal({title:title,sub:sub,fields:[],submit:yesLabel||'Ya, lanjutkan',danger:true,onSubmit:onYes});}
function defaultForm(t){
 return [{k:'name',l:'Nama / judul',req:1,ph:'cth: '+((t.rows&&t.rows[0]&&t.rows[0].t)||'Item baru')}];
}
function bcPaint(){
 var tt=((document.getElementById('mf-title')||{}).value||'').trim();
 var mm=((document.getElementById('mf-message')||{}).value||'').trim();
 var ty=document.getElementById('mf-type')?document.getElementById('mf-type').value:'Info';
 var pv=document.getElementById('bcPrev');if(!pv)return;
 var m=notifTypeMeta(ty);
  pv.innerHTML='<div style="display:flex;gap:10px;align-items:flex-start;background:var(--bg-card);border:1px solid var(--border);border-radius:14px;padding:12px;box-shadow:var(--shadow-sm)"><span style="width:36px;height:36px;border-radius:10px;display:grid;place-items:center;background:var(--primary);color:#fff;flex:0 0 36px">'+ic(P_BELL,18)+'</span><span style="flex:1;min-width:0"><span style="font-size:11px;color:var(--text-3);font-weight:600">TRYOUTKU · sekarang</span><b style="display:block;font-size:13px;color:var(--text-h);margin-top:2px">'+esc(tt||'Judul notifikasi')+'</b><span class="cell-s" style="display:block;margin-top:1px">'+esc(mm||'Pesan notifikasi tampil di sini.')+'</span><span class="status '+m.cls+'" style="margin-top:6px">'+esc(ty)+'</span></span></div>';
}
function pendingCreate(page){
  var t=featOf(page);
  var fields=t.form||defaultForm(t);
  openModal({title:'Buat '+t.title,sub:page==='notifications'?'Tercatat di pusat notifikasi tim dan pelajar.':'Tersimpan sebagai Draft dan masuk antrean.',fields:fields,submit:'Buat',
   onSubmit:function(v){
    if(page==='notifications'){
     var nty=v.type||'Info';
     t.rows.unshift({id:'N-'+Math.floor(100+Math.random()*900),t:v.title||'Notifikasi baru',s:nty+' · baru saja',st:['Belum dibaca','blue'],by:'Admin',chip:'Belum dibaca',type:nty,msg:v.message||'',time:'baru saja',link:null,read:false,team:'Admin'});
     saveFilters();render(false);toast('Notifikasi dibuat','Tercatat di pusat notifikasi.');
     return;
    }
    var first=fields[0]?String(v[fields[0].k]||'Item baru'):'Item baru';
    var id=(t.title||'X').slice(0,2).toUpperCase()+'-NEW-'+Math.floor(100+Math.random()*900);
    var row={id:id,t:first,s:'baru saja · oleh Admin',st:['Draft','amber'],by:'Admin'};
    t.rows.unshift(row);saveFilters();render(false);
    toast(id+' dibuat','Masuk antrean '+t.title+'.',{},{label:'Urungkan',fn:function(){var ix=t.rows.indexOf(row);if(ix>=0)t.rows.splice(ix,1);render(false);}});
   }});
  if(page==='notifications'){
   var mb=$('#modalBox').querySelector('.modal-b');
   if(mb){var dv=document.createElement('div');dv.className='dsec';dv.innerHTML='<h4>Pratinjau notifikasi</h4><div id="bcPrev" style="margin-top:8px"></div>';mb.appendChild(dv);
   ['mf-title','mf-message','mf-type'].forEach(function(fid){var el=document.getElementById(fid);if(el){el.addEventListener('input',bcPaint);el.addEventListener('change',bcPaint);}});
   bcPaint();}
  }
 }
/* ---- Command palette ---- */
function palIndex(){
 var out=[{sec:'Halaman'}];
 flatNav(state.role).forEach(function(n){out.push({t:n.t,s:'Menu '+(n.g||''),icn:n.icn||'ti-dots',go:n.k});});
 out.push({t:'Pengaturan',s:'/settings',icn:'ti-settings',go:'settings'});
 out.push({t:'Profil',s:'/profile',icn:'ti-user',go:'profile'});
 out.push({sec:'Aksi'});
 (QUICK[state.role]||QUICK.admin).forEach(function(q){out.push({t:q[1],s:q[2],icn:'ti-bolt',go:q[4],isNew:q[5]});});
 var page=state.page||defPage();
 if(page!=='dashboard'){var t=featOf(page);(t.rows||[]).slice(0,6).forEach(function(d){out.push({t:d.t,s:d.id+' · '+t.title,icn:'ti-file-text',row:d.id});});}
 return out;
}
function openPal(){state.palIdx=0;$('#palOv').classList.add('show');$('#palInput').value='';paintPal('');setTimeout(function(){$('#palInput').focus();},30);}
function closePal(){$('#palOv').classList.remove('show');}
function paintPal(q){
 q=(q||'').toLowerCase();
 var items=palIndex().filter(function(it){if(it.sec)return true;return (it.t+' '+it.s).toLowerCase().indexOf(q)>=0;});
 var list=$('#palList');var h='';var idx=0;var curSec='';
 items.forEach(function(it){
  if(it.sec){curSec=it.s;h+='<div class="pal-sec">'+esc(it.sec)+'</div>';return;}
  h+='<button class="pal-item'+(idx===state.palIdx?' on':'')+'" role="option" data-pal="'+idx+'"><span class="qi" style="background:var(--primary)">'+ic(it.icn||'ti-dots',15)+'</span><span><b>'+esc(it.t)+'</b><small>'+esc(it.s)+'</small></span></button>';
  it._i=idx;idx++;
 });
 list.innerHTML=h||'<div class="empty"><b>Tidak ketemu</b><br><span style="font-size:12.5px">Coba kata kunci lain.</span></div>';
 list._items=items.filter(function(it){return !it.sec;});
 list.querySelectorAll('[data-pal]').forEach(function(b){b.onclick=function(){palGo(list._items[+b.getAttribute('data-pal')]);};});
}
function palGo(it){
 if(!it)return;closePal();
 if(it.row){openDrawer(it.row);return;}
 go(it.go||'dashboard');
 if(it.isNew)setTimeout(function(){openCreate(it.go);},300);
}
/* ---- Notifications (real shape) ---- */
function renderNotif(){
 var d=$('#notifDrop');
 var list=visibleNotifs();
 var unread=list.filter(function(n){return !n.read;}).length;
 d.innerHTML='<div style="padding:13px 15px;border-bottom:1px solid var(--border-soft);font-weight:600;font-size:13px;display:flex;align-items:center;gap:8px">Notifikasi '+(unread?'<span class="bdg alert">'+unread+' baru</span>':'<span class="bdg ok">terbaca</span>')+'<span style="margin-left:auto"></span><button class="link plain" data-nread>Tandai semua dibaca</button></div><div class="notif">'
 +list.map(function(n){return '<button data-nid="'+n.id+'" class="'+(n.read?'':'unread')+'"><span class="nicon" style="background:'+n.c+'">'+ic(P_BELL,15)+'</span><span><b style="font-size:12.8px">'+esc(n.t)+'</b><br><small style="color:var(--text-2)">'+esc(n.s)+' · '+esc(n.type)+'</small></span></button>';}).join('')
 +'</div><div style="padding:8px;border-top:1px solid var(--border-soft)"><button class="link" data-ngoto="notifications" style="width:100%">Lihat semua</button></div>';
 d.querySelector('[data-nread]').onclick=function(e){e.stopPropagation();list.forEach(function(n){n.read=true;});renderNotif();syncChrome();toast('Semua notifikasi dibaca');};
 d.querySelectorAll('[data-nid]').forEach(function(b){b.onclick=function(){var n=null;NOTIFS.forEach(function(x){if(x.id===b.getAttribute('data-nid'))n=x;});if(n)n.read=true;d.classList.remove('show');syncChrome();if(n&&n.link)go(n.link);};});
 var g=d.querySelector('[data-ngoto]');if(g)g.onclick=function(){d.classList.remove('show');go('notifications');};
}
/* ---- Bindings for #content ---- */
function openCreate(p){p=p||defPage();if(p==='ads')adForm(null);else if(p==='media')mediaUpload();else if(p==='social-media')socialForm(null);else if(p==='streak-tasks')streakTaskForm(null);else if(p==='vouchers')vouForm(null);else if(p==='minta-undangan')reqModal();else pendingCreate(p);}
function doAct(id,way){
 if(way==='drawer')openDrawer(id);
 else if(way&&way.indexOf('dtab:')===0)openDrawer(id,way.slice(5));
 else if(way==='new'){if((state.page||defPage())==='minta-undangan')reqModal();else if((state.page||defPage())==='referrals')toast('Tautan dibuat siswa dari quest yang live');else pendingCreate(state.page||defPage());}
 else if(way==='reqok')reqApprove(id);
 else if(way==='reqno')reqReject(id);
 else if(way==='reqcancel')reqCancel(id);
 else if(way==='refcabut')refRevoke(id);
 else if(way&&way.indexOf('go:')===0)go(way.slice(3));
 else if(way&&way.indexOf('confirm:')===0){var cfs=way.slice(8).split('|');openConfirm(cfs[0],cfs[1]||'','Ya',function(){toast(cfs[2]||'Selesai');});}
 else if(way&&way.indexOf('toast:')===0)toast(way.slice(6));
}
function bindAll(page,t){
 var c=$('#content');
 c.querySelectorAll('[data-t]').forEach(function(b){b.onclick=function(e){e.stopPropagation();toast(b.getAttribute('data-t'));};});
 c.querySelectorAll('[data-goto]').forEach(function(b){b.onclick=function(e){e.stopPropagation();go(b.getAttribute('data-goto'));};});
 c.querySelectorAll('[data-hero-go]').forEach(function(b){b.onclick=function(e){e.stopPropagation();var p=b.getAttribute('data-hero-go');var nw=b.getAttribute('data-hero-new');go(p==='dashboard'?'dashboard':p);if(nw)setTimeout(function(){openCreate(p);},320);};});
 c.querySelectorAll('[data-new]').forEach(function(b){b.onclick=function(e){e.stopPropagation();openCreate(state.page||defPage());};});
  c.querySelectorAll('[data-adedit]').forEach(function(b){b.onclick=function(e){e.stopPropagation();adForm(b.getAttribute('data-adedit'));};});
  c.querySelectorAll('[data-ado]').forEach(function(b){b.onclick=function(e){e.stopPropagation();adFlow(b.getAttribute('data-id'),b.getAttribute('data-ado'));};});
  c.querySelectorAll('[data-adflow]').forEach(function(s){s.onchange=function(e){e.stopPropagation();var id=s.getAttribute('data-adflow');var v=s.value;var cur=(adFind(id)||{}).chip||'Draft';if(v==='Tayang'&&cur!=='Tayang')s.value=cur;adFlow(id,v);};});
 c.querySelectorAll('[data-addel]').forEach(function(b){b.onclick=function(e){e.stopPropagation();adDelete(b.getAttribute('data-addel'));};});
 c.querySelectorAll('[data-adgo]').forEach(function(b){b.onclick=function(e){e.stopPropagation();toast('Membuka tautan…');};});
 c.querySelectorAll('[data-addup]').forEach(function(b){b.onclick=function(e){e.stopPropagation();adDuplicate(b.getAttribute('data-addup'));};});
  c.querySelectorAll('[data-adtemp]').forEach(function(b){b.onclick=function(e){e.stopPropagation();adTemplateModal();};});
  c.querySelectorAll('[data-artreload]').forEach(function(b){b.onclick=function(e){e.stopPropagation();load(function(){toast('Artikel dimuat ulang');});};});
  c.querySelectorAll('[data-artsave]').forEach(function(b){b.onclick=function(e){e.stopPropagation();var u=$('#artUrl'),dm=$('#artDomain'),ky=$('#artKey');var vu=u?u.value.trim():'',vd=dm?dm.value.trim():'',vk=ky?ky.value:'';var ok=true;function mk(id,msg){var f=$('#'+id),er=$('#'+id+'Err');if(f)f.classList.toggle('bad',!!msg);if(er){er.textContent=msg||'';er.classList.toggle('show',!!msg);}if(msg)ok=false;}mk('artUrl',!vu?'URL API wajib diisi.':'');mk('artDomain',!vd?'Domain portal wajib diisi.':'');if(!ok){var bd=c.querySelector('#artUrl.bad,#artDomain.bad');if(bd)bd.focus();toast('URL API dan domain wajib diisi',null,'err');return;}store.set('na3-portal',JSON.stringify({apiBaseUrl:vu,domain:vd,apiKey:vk||''}));toast('Konfigurasi artikel disimpan');};});
  c.querySelectorAll('[data-artshow]').forEach(function(b){b.onclick=function(e){e.stopPropagation();var ky=$('#artKey');if(!ky)return;ky.type=ky.type==='password'?'text':'password';b.setAttribute('aria-label',ky.type==='password'?'Tampilkan API key':'Sembunyikan API key');};});
  c.querySelectorAll('[data-artcopy]').forEach(function(b){b.onclick=function(e){e.stopPropagation();var ky=$('#artKey');var v=ky?ky.value:'';if(!v){toast('API key kosong',null,'err');return;}function done(){toast('API key disalin');}try{if(navigator.clipboard&&navigator.clipboard.writeText)navigator.clipboard.writeText(v).then(done,function(){toast('API key gagal disalin',null,'err');});else done();}catch(_){toast('API key gagal disalin',null,'err');}};});
  c.querySelectorAll('[data-artopen]').forEach(function(b){b.onclick=function(e){e.stopPropagation();openDrawer(b.getAttribute('data-artopen'));};});
  c.querySelectorAll('[data-reqnew]').forEach(function(b){b.onclick=function(e){e.stopPropagation();reqModal();};});
  c.querySelectorAll('[data-vounew]').forEach(function(b){b.onclick=function(e){e.stopPropagation();vouForm(null);};});
  c.querySelectorAll('[data-vouquick]').forEach(function(b){b.onclick=function(e){e.stopPropagation();vouQuick();};});
  c.querySelectorAll('[data-vouedit]').forEach(function(b){b.onclick=function(e){e.stopPropagation();vouForm(b.getAttribute('data-vouedit'));};});
  c.querySelectorAll('[data-voudel]').forEach(function(b){b.onclick=function(e){e.stopPropagation();vouDelete(b.getAttribute('data-voudel'));};});
  c.querySelectorAll('[data-voudup]').forEach(function(b){b.onclick=function(e){e.stopPropagation();vouDuplicate(b.getAttribute('data-voudup'));};});
  c.querySelectorAll('[data-voucopy]').forEach(function(b){b.onclick=function(e){e.stopPropagation();copyText(b.getAttribute('data-voucopy'),'Kode disalin');};});
  c.querySelectorAll('[data-vouflow]').forEach(function(s){s.onchange=function(e){e.stopPropagation();var id=s.getAttribute('data-vouflow');var v=s.value;var cur=(vouFind(id)||{}).chip||'Draft';if(v==='Aktif'&&cur!=='Aktif')s.value=cur;vouFlow(id,v);};});
  c.querySelectorAll('[data-qedit]').forEach(function(b){b.onclick=function(e){e.stopPropagation();questForm(b.getAttribute('data-qedit'));};});
  c.querySelectorAll('[data-qact]').forEach(function(b){b.onclick=function(e){e.stopPropagation();questToggleLive(b.getAttribute('data-qact'));};});
  c.querySelectorAll('[data-stnew]').forEach(function(b){b.onclick=function(e){e.stopPropagation();streakTaskForm(null);};});
  c.querySelectorAll('[data-stedit]').forEach(function(b){b.onclick=function(e){e.stopPropagation();streakTaskForm(b.getAttribute('data-stedit'));};});
  c.querySelectorAll('[data-stdel]').forEach(function(b){b.onclick=function(e){e.stopPropagation();stDelete(b.getAttribute('data-stdel'));};});
  c.querySelectorAll('[data-stsel]').forEach(function(s){s.onchange=function(e){e.stopPropagation();var f=stFind(s.getAttribute('data-stsel'));if(!f.d)return;var ns=s.value;if(ns===f.d.status)delete f.d._pending;else f.d._pending=ns;saveFilters();render(false);if(ns!==f.d.status)toast('Ditandai: '+STTASK_STATUS_LBL[ns],'Tinjau sebelum tayang.');};});
  c.querySelectorAll('[data-stpub]').forEach(function(b){b.onclick=function(e){e.stopPropagation();stPublish();};});
  c.querySelectorAll('[data-strange]').forEach(function(b){b.onclick=function(e){e.stopPropagation();state.streakDays=+b.getAttribute('data-strange')||30;render(false);};});
  /* Dashboard: kartu tugas bisa diklik → buka halaman Tugas Streak + drawer tugasnya. */
  c.querySelectorAll('[data-stdopen]').forEach(function(b){b.onclick=function(e){e.stopPropagation();go('streak-tasks');openDrawer(b.getAttribute('data-stdopen'));};});
  c.querySelectorAll('[data-strow]').forEach(function(tr){
   tr.onclick=function(e){if(window.__stDrag){window.__stDrag=false;return;}if(e.target.closest('[data-stgrip]')||e.target.tagName==='BUTTON'||e.target.tagName==='SELECT'||e.target.tagName==='INPUT'||e.target.closest('.rowact'))return;openDrawer(tr.getAttribute('data-strow'));};
   tr.onkeydown=function(e){if((e.key==='Enter'||e.key===' ')&&e.target===tr){e.preventDefault();openDrawer(tr.getAttribute('data-strow'));}};
  });
  (function(){
   var stDragId=null,stMoved=false,stLastTarget=null;
   function stRows(){return Array.prototype.slice.call(c.querySelectorAll('[data-strow]'));}
   function stClearHint(){c.querySelectorAll('[data-strow].drop-hint').forEach(function(x){x.classList.remove('drop-hint');});}
   function stFlip(first,skip){stRows().forEach(function(r){if(r===skip)return;var id=r.getAttribute('data-strow');if(first[id]===undefined)return;var now=r.getBoundingClientRect();var dy=first[id]-now.top;if(dy){r.style.transition='none';r.style.transform='translateY('+dy+'px)';}});void document.body.offsetHeight;stRows().forEach(function(r){if(r===skip)return;r.style.transition='';r.style.transform='';});}
   c.querySelectorAll('[data-stgrip]').forEach(function(g){
    g.addEventListener('pointerdown',function(e){
     e.preventDefault();e.stopPropagation();
     stDragId=g.getAttribute('data-stgrip');stMoved=false;stLastTarget=null;
     var srcRow=g.closest('[data-strow]');if(!srcRow)return;
     var srect=srcRow.getBoundingClientRect();var offY=e.clientY-srect.top;
     srcRow.classList.add('drag-src');srcRow.style.pointerEvents='none';
     function onMove(ev){
      stMoved=true;
      srcRow.style.transform='translateY('+(ev.clientY-srect.top-offY)+'px)';
      var el=null;try{el=document.elementFromPoint(ev.clientX,ev.clientY);}catch(_){}
      var tr=(el&&el.closest)?el.closest('[data-strow]'):null;
      if(tr&&tr.getAttribute('data-strow')===stDragId)tr=null;
      if(tr!==stLastTarget){
       var first={};stRows().forEach(function(r){first[r.getAttribute('data-strow')]=r.getBoundingClientRect().top;});
       if(tr){var rct=tr.getBoundingClientRect();var below=(ev.clientY>rct.top+rct.height/2);tr.parentNode.insertBefore(srcRow,below?tr.nextSibling:tr);}
       stFlip(first,srcRow);stClearHint();
       if(tr){tr.classList.add('drop-hint');}
       stLastTarget=tr;
      }
     }
     function onUp(){
      window.removeEventListener('pointermove',onMove);window.removeEventListener('pointerup',onUp);window.removeEventListener('pointercancel',onUp);
      var moved=stMoved;stMoved=false;
      if(moved)window.__stDrag=true;
      if(stDragId){
       var order=stRows().map(function(r){return r.getAttribute('data-strow');});
       if(order.indexOf(String(stDragId))>=0){
        var t=featOf('streak-tasks');var byId={};(t.rows||[]).forEach(function(x){byId[String(x.id)]=x;});
        var newA=order.map(function(id){return byId[String(id)];}).filter(function(x){return !!x;});
        (t.rows||[]).forEach(function(x){if(newA.indexOf(x)<0)newA.push(x);});
        var same=newA.length===(t.rows||[]).length&&newA.every(function(x,ix){return (t.rows||[])[ix]===x;});
        newA.forEach(function(x,ix){x.sortOrder=ix;});
        t.rows=newA;
        if(!same){saveFilters();render(false);toast('Urutan tugas berhasil disimpan');}
        else{stRows().forEach(function(r){r.style.transition='';r.style.transform='';r.style.pointerEvents='';r.classList.remove('drag-src','drop-hint');});}
       }
      }
      stDragId=null;stLastTarget=null;
     }
     window.addEventListener('pointermove',onMove);
     window.addEventListener('pointerup',onUp);
     window.addEventListener('pointercancel',onUp);
    });
   });
  })();
  c.querySelectorAll('[data-mopen]').forEach(function(b){b.onclick=function(e){e.stopPropagation();mediaDetail(b.getAttribute('data-mopen'));};});
  c.querySelectorAll('[data-mdown]').forEach(function(b){b.onclick=function(e){e.stopPropagation();toast('Menyiapkan export…');};});
  /* Bank Soal — kartu soal. Tombol di dalam kartu tidak memicu klik kartu. */
  c.querySelectorAll('[data-qcard]').forEach(function(card){
   card.onclick=function(e){if(e.target.tagName==='BUTTON'||e.target.tagName==='INPUT'||e.target.tagName==='SELECT')return;openDrawer(card.getAttribute('data-qcard'));};
  });
  /* Bank Soal — pindah antar tingkat. Filter ikut dibersihkan supaya status
     "Ada Draft" di level 1 tidak ikut menyaring soal di level 2. */
  c.querySelectorAll('[data-qsub]').forEach(function(b){b.onclick=function(e){e.stopPropagation();state.qsub=b.getAttribute('data-qsub');state.qtop=null;state.flt=[];state.q='';state.pg=1;saveFilters();window.scrollTo(0,0);load();};if(b.tagName!=='BUTTON')b.onkeydown=function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();openDrawer0(b);};};function openDrawer0(el){state.qsub=el.getAttribute('data-qsub');state.qtop=null;state.chip='Semua';state.q='';state.fq={};state.pg=1;saveFilters();window.scrollTo(0,0);load();}});
  c.querySelectorAll('[data-qsubedit]').forEach(function(b){b.onclick=function(e){e.stopPropagation();qSubForm(b.getAttribute('data-qsubedit'));};});
  c.querySelectorAll('[data-qsubnew]').forEach(function(b){b.onclick=function(e){e.stopPropagation();qSubNew();};});
  c.querySelectorAll('[data-qsoalnew]').forEach(function(b){b.onclick=function(e){e.stopPropagation();if(state.qtop)qSoalForm(state.qtop);};});
  c.querySelectorAll('[data-qimport]').forEach(function(b){b.onclick=function(e){e.stopPropagation();if(state.qtop)qImportModal(state.qtop);};});
  c.querySelectorAll('[data-qtop]').forEach(function(b){b.onclick=function(e){e.stopPropagation();state.qtop=b.getAttribute('data-qtop');state.flt=[];state.q='';state.pg=1;saveFilters();window.scrollTo(0,0);load();};});
  c.querySelectorAll('[data-qback]').forEach(function(b){b.onclick=function(e){e.stopPropagation();state.qsub=null;state.qtop=null;state.flt=[];state.q='';state.pg=1;saveFilters();window.scrollTo(0,0);load();};});
  c.querySelectorAll('[data-qtopback]').forEach(function(b){b.onclick=function(e){e.stopPropagation();state.qtop=null;state.flt=[];state.q='';state.pg=1;saveFilters();window.scrollTo(0,0);load();};});
  c.querySelectorAll('[data-qopen]').forEach(function(b){b.onclick=function(e){e.stopPropagation();openDrawer(b.getAttribute('data-qopen'));};});
  c.querySelectorAll('[data-qkey]').forEach(function(b){b.onclick=function(e){e.stopPropagation();var card=b.closest('.qc');var kp=card?card.querySelector('.qkey'):null;if(!kp)return;var on=kp.hasAttribute('hidden');if(on)kp.removeAttribute('hidden');else kp.setAttribute('hidden','');var lb=on?'Sembunyikan kunci dan pembahasan':'Lihat kunci dan pembahasan';b.setAttribute('aria-expanded',on?'true':'false');b.setAttribute('title',lb);b.setAttribute('aria-label',lb);};});
  c.querySelectorAll('[data-qqedit]').forEach(function(b){b.onclick=function(e){e.stopPropagation();openDrawer(b.getAttribute('data-qqedit'),'media');};});
  c.querySelectorAll('[data-qdup]').forEach(function(b){b.onclick=function(e){e.stopPropagation();qDuplicate(b.getAttribute('data-qdup'));};});
  c.querySelectorAll('[data-qlocked]').forEach(function(b){b.onclick=function(e){e.stopPropagation();toast('Terkunci — dipakai tryout berjalan','Ubah + kunci jawaban dikunci. Duplikat/arsip tetap bisa.','err');};});
  c.querySelectorAll('[data-qarch]').forEach(function(b){b.onclick=function(e){e.stopPropagation();qArchive(b.getAttribute('data-qarch'));};});
  c.querySelectorAll('[data-qopt]').forEach(function(b){b.onclick=function(e){e.stopPropagation();qPick(b.getAttribute('data-qopt'),b.getAttribute('data-qletter'));};});
 c.querySelectorAll('[data-nopen]').forEach(function(r){r.onclick=function(){var id=r.getAttribute('data-nopen');var tt=featOf('notifications');var nn=null;(tt.rows||[]).forEach(function(x){if(x.id===id)nn=x;});if(!nn)return;if(nn.link){notifMark(id);go(nn.link);}else notifMark(id);};r.onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();r.onclick();}};});
 c.querySelectorAll('[data-ngoto]').forEach(function(b){b.onclick=function(e){e.stopPropagation();notifMark(b.getAttribute('data-nid'));go(b.getAttribute('data-ngoto'));};});
 c.querySelectorAll('[data-nmark]').forEach(function(b){b.onclick=function(e){e.stopPropagation();notifMark(b.getAttribute('data-nmark'));};});
 var nra=c.querySelector('[data-nreadall]');if(nra)nra.onclick=function(){notifMarkAll();};
  c.querySelectorAll('[data-smopen]').forEach(function(r){r.onclick=function(){if(window.__smDrag){window.__smDrag=false;return;}socialForm(r.getAttribute('data-smopen'));};r.onkeydown=function(e){if(e.key==='Enter'){e.preventDefault();socialForm(r.getAttribute('data-smopen'));}};});
  var smDragId=null,smDropId=null,smStartY=0,smMoved=false,smLastTarget=null;
  function smClearHint(){c.querySelectorAll('.nrow.drop-hint').forEach(function(x){x.classList.remove('drop-hint');});}
  function smRows(){var l=c.querySelector('#smList');return l?Array.prototype.slice.call(l.querySelectorAll('.nrow')):[];}
  function smFlip(first,skip){
   smRows().forEach(function(r){
    if(r===skip)return;var id=r.getAttribute('data-smid');if(!first||first[id]===undefined)return;
    var now=r.getBoundingClientRect();var dy=first[id]-now.top;
    if(dy){r.style.transition='none';r.style.transform='translateY('+dy+'px)';}
   });
   void document.body.offsetHeight;
   smRows().forEach(function(r){if(r===skip)return;r.style.transition='';r.style.transform='';});
  }
  c.querySelectorAll('[data-grip]').forEach(function(g){
   g.addEventListener('pointerdown',function(e){
    e.preventDefault();e.stopPropagation();
    smDragId=g.getAttribute('data-grip');smDropId=null;smMoved=false;smLastTarget=null;
    var srcRow=g.closest('.nrow');if(!srcRow)return;
    var srect=srcRow.getBoundingClientRect();smStartY=e.clientY-srect.top;
    srcRow.classList.add('drag-src','dragging');srcRow.style.pointerEvents='none';
    function onMove(ev){
     smMoved=true;
     var dy=ev.clientY-srect.top-smStartY;
     srcRow.style.transform='translateY('+dy+'px)';
     var el=null;try{el=document.elementFromPoint(ev.clientX,ev.clientY);}catch(_){}
     var tr=(el&&el.closest)?el.closest('.nrow'):null;
     if(tr&&tr.getAttribute('data-smid')===smDragId)tr=null;
     if(tr!==smLastTarget){
      var first={};smRows().forEach(function(r){first[r.getAttribute('data-smid')]=r.getBoundingClientRect().top;});
      if(tr){
       var rct=tr.getBoundingClientRect();var below=(ev.clientY>rct.top+rct.height/2);
       tr.parentNode.insertBefore(srcRow,below?tr.nextSibling:tr);
      }
      smFlip(first,srcRow);
      smClearHint();smDropId=null;
      if(tr){tr.classList.add('drop-hint');smDropId=tr.getAttribute('data-smid');}
      smLastTarget=tr;
     }
    }
    function onUp(ev){
     window.removeEventListener('pointermove',onMove);window.removeEventListener('pointerup',onUp);window.removeEventListener('pointercancel',onUp);
     var moved=smMoved;smMoved=false;
     if(moved)window.__smDrag=true;
     if(smDragId){
      var tt=featOf('social-media');var a=tt.rows||[];
       var fActive=hasResetF();
      if(!fActive){
       var order=smRows().map(function(r){return r.getAttribute('data-smid');});
       if(order.indexOf(smDragId)>=0){
        var byId={};a.forEach(function(x){byId[x.id]=x;});
        var newA=order.map(function(id){return byId[id];}).filter(function(x){return !!x;});
        a.forEach(function(x){if(newA.indexOf(x)<0)newA.push(x);});
        var same=newA.length===a.length&&newA.every(function(x,ix){return a[ix]===x;});
        tt.rows=newA;
        if(!same){saveFilters();render(false);toast('Urutan diperbarui');}
        else{smRows().forEach(function(r){r.style.transition='';r.style.transform='';r.style.pointerEvents='';r.classList.remove('drag-src','dragging','drop-hint');});}
       }
      }else if(smDropId&&smDropId!==smDragId){
       var from=-1,to=-1;a.forEach(function(x,ix){if(x.id===smDragId)from=ix;if(x.id===smDropId)to=ix;});
       if(from>=0&&to>=0){
        var below2=false;
        try{var pel=document.elementFromPoint(ev.clientX,ev.clientY);var pr=(pel&&pel.closest)?pel.closest('.nrow'):null;if(pr){var rc=pr.getBoundingClientRect();below2=(ev.clientY>rc.top+rc.height/2);}}catch(_){}
        var it=a.splice(from,1)[0];
        if(from<to)to--;
        a.splice(to+(below2?1:0),0,it);
        saveFilters();render(false);toast('Urutan diperbarui');
       }
      }else{
       render(false);
      }
     }
     smDragId=null;smDropId=null;smLastTarget=null;
    }
    window.addEventListener('pointermove',onMove);
    window.addEventListener('pointerup',onUp);
    window.addEventListener('pointercancel',onUp);
   });
  });
  c.querySelectorAll('[data-smtoggle]').forEach(function(b){b.onclick=function(e){e.stopPropagation();var tt=featOf('social-media');(tt.rows||[]).forEach(function(x){if(x.id===b.getAttribute('data-smtoggle')){var on=x.chip!=='Aktif';setChip(tt,x.id,on?'Aktif':'Nonaktif',on?'green':'gray');}});saveFilters();render(false);toast('Status tampilan diubah');};});
   c.querySelectorAll('[data-smcopy]').forEach(function(b){b.onclick=function(e){e.stopPropagation();toast('Tautan disalin');};});
   c.querySelectorAll('[data-smdel]').forEach(function(b){b.onclick=function(e){e.stopPropagation();var id=b.getAttribute('data-smdel');var f=findRow('social-media',id);if(!f.d)return;openConfirm('Hapus "'+f.d.t+'"?','Akun hilang dari daftar dan preview tautan.','Hapus',function(){var t=f.t;var gone=[];t.rows=(t.rows||[]).filter(function(r){if(r.id===id){gone.push(r);return false;}return true;});render(false);toast('Akun dihapus',null,null,{label:'Urungkan',fn:function(){gone.forEach(function(r){t.rows.push(r);});render(false);}});});};});
  c.querySelectorAll('[data-ugo]').forEach(function(b){b.onclick=function(e){e.stopPropagation();go(userGo(b.getAttribute('data-ugo')));};});
  c.querySelectorAll('[data-smgo]').forEach(function(b){b.onclick=function(e){e.stopPropagation();toast('Membuka tautan…');};});
  c.querySelectorAll('[data-range]').forEach(function(b){b.onclick=function(){state.range=b.getAttribute('data-range');render(false);};});
  c.querySelectorAll('[data-theme-set]').forEach(function(b){b.onclick=function(){state.theme=b.getAttribute('data-theme-set');document.documentElement.dataset.theme=state.theme;store.set('na3-theme',state.theme);syncChrome();render(false);toast(state.theme==='dark'?'Mode gelap':'Mode terang');};});
 var dev=c.querySelector('[data-devreset]');if(dev)dev.onclick=function(){openConfirm('Kembalikan bawaan?','Filter, tema, dan peran kembali seperti semula.','Kembalikan',function(){clearFilters();store.del('na3-theme');store.del('na3-collapsed');state.theme='light';document.documentElement.dataset.theme='light';setRole('soal');});};
 var pe=c.querySelector('[data-profile-edit]');if(pe)pe.onclick=function(){openModal({title:'Ubah profil',sub:'Nama & email tampil di hero dan avatar.',fields:[{k:'name',l:'Nama',req:1,ph:'Admin'},{k:'email',l:'Email',type:'email',req:1,ph:'admin@tryoutku.id'}],submit:'Simpan',onSubmit:function(){toast('Profil disimpan');}});};
 var qb=$('#quickBtn');if(qb)qb.onclick=function(e){e.stopPropagation();var p=$('#quickPop');var o=p.classList.toggle('show');qb.classList.toggle('open',o);};
   var sb=$('#sortBtn');if(sb){sb.onmouseenter=null;sb.onmouseleave=null;sb.onclick=function(e){e.stopPropagation();var p=$('#kebabPop');if(p&&p.classList.contains('show')&&p.dataset.src==='sort'){p.classList.remove('show');return;}openSortPop(sb,sortDesc());};}
 c.querySelectorAll('[data-sort]').forEach(function(h){h.onclick=function(e){e.stopPropagation();var k=h.getAttribute('data-sort');if(state.sortKey!==k||!state.sort){state.sortKey=k;state.sort='asc';}else if(state.sort==='asc'){state.sort='desc';}else{state.sort=null;state.sortKey=null;}state.pg=1;saveFilters();render(false);};});
 c.querySelectorAll('[data-pg]').forEach(function(b){if(b.disabled)return;b.onclick=function(e){e.stopPropagation();var v=b.getAttribute('data-pg');if(v==='prev')state.pg=Math.max(1,state.pg-1);else if(v==='next')state.pg=state.pg+1;else state.pg=+v;saveFilters();render(false);};});
 c.querySelectorAll('#quickPop [data-hero-go]').forEach(function(b){b.addEventListener('click',function(){var p=$('#quickPop');var q2=$('#quickBtn');if(p)setTimeout(function(){p.classList.remove('show');if(q2)q2.classList.remove('open');},60);});});
   c.querySelectorAll('[data-nfilter]').forEach(function(b){b.onmouseenter=null;b.onmouseleave=null;b.onclick=function(e){e.stopPropagation();var p=$('#kebabPop');if(p&&p.classList.contains('show')&&p.dataset.src==='filter'){p.classList.remove('show');return;}openFilterPop(b,filterDesc());};});
  c.querySelectorAll('[data-nflt-del]').forEach(function(b){b.onclick=function(e){e.stopPropagation();state.flt.splice(+b.getAttribute('data-nflt-del'),1);state.pg=1;saveFilters();render(false);};});
  c.querySelectorAll('.rowQ').forEach(function(inp){
   inp.addEventListener('input',function(e){state.q=e.target.value;state.pg=1;saveFilters();var p=e.target.selectionStart;render(false);var n2=c.querySelector('.rowQ');if(n2){n2.focus();try{n2.setSelectionRange(p,p);}catch(_){}}});
   inp.addEventListener('keydown',function(e){if(e.key==='Escape'&&e.target.value){e.stopPropagation();state.q='';state.pg=1;saveFilters();render(false);}});
  });
  c.querySelectorAll('[data-clear-q]').forEach(function(b){b.onclick=function(e){e.stopPropagation();state.q='';state.pg=1;saveFilters();render(false);var n2=c.querySelector('.rowQ');if(n2)n2.focus();};});
  c.querySelectorAll('[data-reset]').forEach(function(rs){rs.onclick=function(e){if(e){e.preventDefault();e.stopPropagation();}resetTable();};});
 var cl=c.querySelector('[data-clear]');if(cl)cl.onclick=function(e){e.stopPropagation();state.sel={};render(false);};
 c.querySelectorAll('[data-sel]').forEach(function(cb){cb.onclick=function(e){e.stopPropagation();var id=cb.getAttribute('data-sel');state.sel[id]=!state.sel[id];render(false);};});
 var sa=$('#selAll');if(sa)sa.onclick=function(e){e.stopPropagation();var ids=[];c.querySelectorAll('[data-sel]').forEach(function(b){ids.push(b.getAttribute('data-sel'));});var all=ids.length&&ids.every(function(id){return state.sel[id];});ids.forEach(function(id){state.sel[id]=!all;});render(false);};
 c.querySelectorAll('[data-open]').forEach(function(b){b.onclick=function(e){e.stopPropagation();openDrawer(b.getAttribute('data-open'));};});
 c.querySelectorAll('[data-do]').forEach(function(b){b.onclick=function(e){e.stopPropagation();doAct(b.getAttribute('data-id'),b.getAttribute('data-do'));};});
 c.querySelectorAll('[data-kebab]').forEach(function(b){b.onclick=function(e){e.stopPropagation();var id=b.getAttribute('data-kebab');var pg=state.page||defPage();if(pg==='dashboard')pg=featOf('dashboard').queue;var f2=findRow(pg,id);if(f2.d)openKebab(b,f2.d,f2.t);};});
 c.querySelectorAll('[data-bulk]').forEach(function(b){b.onclick=function(e){
  e.stopPropagation();var kind=b.getAttribute('data-bulk');var ids=Object.keys(state.sel).filter(function(id){return state.sel[id];});
  if(!ids.length)return;var pg=state.page||defPage();if(pg==='dashboard')pg=featOf('dashboard').queue;var ft=featOf(pg);
  if(kind==='process'){toast(ids.length+' baris diproses',(ft.qa||'Proses')+' dicatat.');state.sel={};render(false);}
  else if(kind==='archive'){var keep={};ids.forEach(function(id){(ft.rows||[]).forEach(function(r){if(r.id===id){keep[id]=[r.st[0],r.st[1]];r.st=['Diarsipkan','gray'];}});});state.sel={};render(false);toast(ids.length+' baris diarsipkan','Status bisa dikembalikan.',null,{label:'Urungkan',fn:function(){Object.keys(keep).forEach(function(id){(ft.rows||[]).forEach(function(r){if(r.id===id)r.st=keep[id];});});render(false);}});}
  else{openConfirm('Hapus '+ids.length+' baris?','Dihapus dari daftar ini. Di aplikasi asli, data terhapus masih bisa dikembalikan.','Hapus',function(){var gone=[];(ft.rows||[]).forEach(function(r){if(state.sel[r.id])gone.push(r);});ft.rows=(ft.rows||[]).filter(function(r){return !state.sel[r.id];});state.sel={};render(false);toast(gone.length+' baris dihapus','Di aplikasi asli, data terhapus masih bisa dikembalikan.',null,{label:'Urungkan',fn:function(){gone.forEach(function(r){ft.rows.unshift(r);});render(false);}});});}
 };});
 c.querySelectorAll('[data-row]').forEach(function(tr){
  tr.onclick=function(e){if(e.target.closest('.sel-cell')){var id=tr.getAttribute('data-row');state.sel[id]=!state.sel[id];render(false);return;}if(e.target.tagName==='INPUT'||e.target.tagName==='BUTTON')return;openDrawer(tr.getAttribute('data-row'));};
  tr.onkeydown=function(e){if((e.key==='Enter'||e.key===' ')&&e.target===tr){e.preventDefault();openDrawer(tr.getAttribute('data-row'));}};
 });
 c.querySelectorAll('[data-mx]').forEach(function(b){b.onclick=function(e){e.stopPropagation();var parts=b.getAttribute('data-mx').split('-');var m=MATRIX[+parts[0]];m[+parts[1]]=(m[+parts[1]]+1)%3;render(false);toast('Akses diperbarui',m[0]+' → '+['Tutup','Buka','Sebagian'][m[+parts[1]]]);};});
  var mxr=c.querySelector('[data-mxreset]');if(mxr)mxr.onclick=function(){toast('Hak akses dikembalikan ke bawaan');};
}
/* ---- Static chrome + global events ---- */
$('#notifBtn').onclick=function(e){e.stopPropagation();var d=$('#notifDrop');var o=d.classList.contains('show');document.querySelectorAll('.drop.show').forEach(function(x){x.classList.remove('show');});if(!o){renderNotif();d.classList.add('show');}};
$('#themeBtn').onclick=function(){state.theme=state.theme==='light'?'dark':'light';document.documentElement.dataset.theme=state.theme;store.set('na3-theme',state.theme);syncChrome();toast(state.theme==='dark'?'Mode gelap':'Mode terang');};
$('#menuBtn').onclick=function(){if(window.innerWidth<=860){$('#sidebar').classList.toggle('open');$('#overlayM').classList.toggle('show');}else{var c2=document.body.classList.toggle('collapsed');store.set('na3-collapsed',c2?'1':'0');}syncChrome();};
$('#overlayM').onclick=function(){$('#sidebar').classList.remove('open');$('#overlayM').classList.remove('show');syncChrome();};
$('#scrim').onclick=closeDrawer;
$('#modalOv').addEventListener('click',function(e){if(e.target===$('#modalOv'))closeModal();});
$('#palOv').addEventListener('click',function(e){if(e.target===$('#palOv'))closePal();});
$('#palInput').addEventListener('input',function(e){state.palIdx=0;paintPal(e.target.value);});
$('#palInput').addEventListener('keydown',function(e){
 var items=($('#palList')._items)||[];
 if(e.key==='ArrowDown'){e.preventDefault();state.palIdx=Math.min(items.length-1,state.palIdx+1);paintPal(e.target.value);}
 else if(e.key==='ArrowUp'){e.preventDefault();state.palIdx=Math.max(0,state.palIdx-1);paintPal(e.target.value);}
 else if(e.key==='Enter'){palGo(items[state.palIdx]);}
});
document.addEventListener('click',function(e){
 if(!e.target.closest('.drop')&&!e.target.closest('#notifBtn'))document.querySelectorAll('.drop.show').forEach(function(x){x.classList.remove('show');});
 var rp=$('#rolePop');if(rp&&!e.target.closest('.ctx'))rp.classList.remove('show');
 var up=$('#userPop');if(up&&!e.target.closest('.sb-user'))up.classList.remove('show');
 var qp=$('#quickPop');if(qp&&!e.target.closest('#quickBtn')){qp.classList.remove('show');var qb=$('#quickBtn');if(qb)qb.classList.remove('open');}
 var kp=$('#kebabPop');if(kp&&!e.target.closest('#kebabPop'))kp.classList.remove('show');
});
$('#loginBack').onclick=function(){$('#logoutOv').classList.remove('show');};
$('#offRetry').onclick=function(){if(navigator.onLine){$('#offBanner').classList.remove('show');load(function(){toast('Kembali daring','Data dimuat ulang.');});}else toast('Masih offline','Periksa koneksi lalu coba lagi.','err');};
window.addEventListener('offline',function(){$('#offBanner').classList.add('show');});
window.addEventListener('online',function(){$('#offBanner').classList.remove('show');});
document.addEventListener('keydown',function(e){
 var typing=document.activeElement&&(document.activeElement.tagName==='INPUT'||document.activeElement.tagName==='SELECT'||document.activeElement.tagName==='TEXTAREA');
 if(selCur){if(e.key==='Escape'){e.preventDefault();closeSelPop();}return;}
 if(e.key==='Escape'){
  if($('#palOv').classList.contains('show'))closePal();
  else if($('#modalOv').classList.contains('show'))closeModal();
  else{var kp2=$('#kebabPop');if(kp2)kp2.classList.remove('show');closeDrawer();var rp=$('#rolePop');if(rp)rp.classList.remove('show');var up=$('#userPop');if(up)up.classList.remove('show');var qp=$('#quickPop');if(qp)qp.classList.remove('show');var qb=$('#quickBtn');if(qb)qb.classList.remove('open');}
 }
 else if((e.key==='/'||((e.ctrlKey||e.metaKey)&&e.key.toLowerCase()==='k'))&&!typing){e.preventDefault();openPal();}
 else if(['1','2','3','4'].indexOf(e.key)>=0&&!typing){setRole(ROLE_ORDER[+e.key-1]);}
 else if(e.key==='.'&&!typing){cycle();}
});
window.addEventListener('resize',function(){clearTimeout(syncChrome.t);syncChrome.t=setTimeout(syncChrome,150);});
var saveSyT=null;
window.addEventListener('scroll',function(){clearTimeout(saveSyT);saveSyT=setTimeout(function(){try{store.set('na3-sy',String(window.scrollY||0));store.set('na3-skey',state.role+'|'+(state.page||defPage()));}catch(_){}},150);},{passive:true});
window.addEventListener('beforeunload',function(){try{store.set('na3-sy',String(window.scrollY||0));store.set('na3-skey',state.role+'|'+(state.page||defPage()));saveLast();}catch(_){}});
/* ---- Themed select dropdown: replaces the OS-native option popup ---- */
var selCur=null,selWrap=null;
function closeSelPop(){var p=$('#selPop');if(p)p.classList.remove('show');if(selWrap){selWrap.classList.remove('open');var t=selWrap.querySelector('.sel-trigger');if(t)t.setAttribute('aria-expanded','false');}selCur=null;selWrap=null;}
function selLabel(sel){var s=sel.closest('.sel');if(!s)return;var t=s.querySelector('.sel-trigger .sel-lbl');var o=sel.options[sel.selectedIndex];if(t)t.textContent=o?o.text:'';}
function openSelPop(sel,wrap,trigger){
 closeSelPop();
 var pop=$('#selPop');if(!pop)return;
 selCur=sel;selWrap=wrap;wrap.classList.add('open');trigger.setAttribute('aria-expanded','true');
 pop.innerHTML=Array.prototype.map.call(sel.options,function(o,i){var on=i===sel.selectedIndex;
   return '<button type="button" role="option" data-si="'+i+'" aria-selected="'+on+'" class="'+(on?'on':'')+'"><span class="sel-opt">'+esc(o.text)+'</span>'+(on?'<span class="tickok">'+ic(P_CHECK,14)+'</span>':'')+'</button>';}).join('');
  pop.style.minWidth=Math.max(trigger.offsetWidth,190)+'px';
 pop.classList.add('show');
 var r=trigger.getBoundingClientRect(),pw=pop.offsetWidth,ph=pop.offsetHeight;
 pop.style.left=Math.max(10,Math.min(r.left,window.innerWidth-pw-10))+'px';
 var top=r.bottom+6;if(top+ph>window.innerHeight-10&&r.top-ph-6>10)top=r.top-ph-6;
 pop.style.top=top+'px';
 pop.querySelectorAll('[data-si]').forEach(function(b){b.onclick=function(e){e.stopPropagation();selPick(sel,+b.getAttribute('data-si'));};});
}
function selPick(sel,i){sel.selectedIndex=i;sel.dispatchEvent(new Event('change',{bubbles:true}));selLabel(sel);closeSelPop();}
function enhanceSelect(sel){
 if(sel.hasAttribute('data-enh')||sel.hasAttribute('data-no-enh'))return;sel.setAttribute('data-enh','');
 if(sel.multiple||sel.size>0)return;
 var inFilter=!!sel.closest('.filters'),inField=!!sel.closest('.field');
 var wrap=document.createElement('span');wrap.className='sel';
 sel.parentNode.insertBefore(wrap,sel);wrap.appendChild(sel);sel.tabIndex=-1;
 var trigger=document.createElement('button');
 trigger.type='button';
 trigger.className='sel-trigger'+(inFilter?' sel-skin-filters':inField?' sel-skin-field':'');
 trigger.setAttribute('aria-haspopup','listbox');trigger.setAttribute('aria-expanded','false');
 var aria=sel.getAttribute('aria-label');if(aria)trigger.setAttribute('aria-label',aria);
 trigger.innerHTML='<span class="sel-lbl"></span><span class="sel-chev">'+ic(P_CHEV,14)+'</span>';
 wrap.appendChild(trigger);
 selLabel(sel);
 sel.addEventListener('change',function(){selLabel(sel);});
 trigger.onclick=function(e){e.stopPropagation();if(wrap.classList.contains('open'))closeSelPop();else openSelPop(sel,wrap,trigger);};
}
function enhanceSelects(root){(root||document).querySelectorAll('select:not([data-enh])').forEach(enhanceSelect);}
document.addEventListener('click',function(e){if(selCur&&!e.target.closest('#selPop')&&!e.target.closest('.sel-trigger'))closeSelPop();});
window.addEventListener('resize',closeSelPop);
window.addEventListener('scroll',closeSelPop,true);
var selMO=new MutationObserver(function(muts){var hit=false;muts.forEach(function(m){Array.prototype.forEach.call(m.addedNodes,function(n){if(n.nodeType===1&&(n.tagName==='SELECT'||(n.querySelector&&n.querySelector('select'))))hit=true;});});if(hit)enhanceSelects(document);});
selMO.observe(document.body,{childList:true,subtree:true});
enhanceSelects(document);
(function(){
 var r=store.get('na3-role')||'soal';if(!ROLES[r])r='soal';
 var p='dashboard';
 try{var last=store.get('na3-last');if(last){var parts=String(last).split('|');if(parts[0]&&ROLES[parts[0]])r=parts[0];if(parts[1])p=parts[1];}}catch(_){}
 if(!F[p]&&p!=='dashboard'&&p!=='settings'&&p!=='profile')p='dashboard';
 state.role=r;state.page=p;
  state.flt=[];state.q='';state.sort=null;state.sortKey=null;state.pg=1;state.sel={};state.tab='ringkas';
 loadFilters();
 load(function(){
  try{
   var cur=state.role+'|'+(state.page||defPage());
   var sk=store.get('na3-skey');var sy=parseInt(store.get('na3-sy')||'0',10);
   if(sk===cur&&sy>0)setTimeout(function(){window.scrollTo(0,sy);},50);
  }catch(_){}
 });
 syncChrome();
})();
