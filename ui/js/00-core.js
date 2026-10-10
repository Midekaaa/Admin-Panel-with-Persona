/* 00-core.js — Ikon, NAV, role, state, router, sidebar, breadcrumb.
   Dipisah otomatis dari DESIGN ADMIN/new-admin.html. Muat BERURUTAN via <script> di index.html (classic script, globals bersama). */
/* Never show a blank page: surface any error inside the content area */
window.addEventListener('error',function(e){var c=document.getElementById('content');if(c&&!c.dataset.ready){c.innerHTML='<div class="empty"><div class="eico"><i class="ti ti-alert-triangle" style="font-size:24px"></i></div><b>Gagal memuat halaman</b><br><span style="font-size:12.5px">'+String((e&&e.message)||'unknown error')+'</span></div>';}});
var store={get:function(k){try{return localStorage.getItem(k);}catch(_){return null;}},set:function(k,v){try{localStorage.setItem(k,v);}catch(_){}},del:function(k){try{localStorage.removeItem(k);}catch(_){}},clearPref:function(p){try{Object.keys(localStorage).filter(function(k){return k.indexOf(p)===0;}).forEach(function(k){localStorage.removeItem(k);});}catch(_){}}};
/* Icons: Tabler Icons webfont. Fonts: Inter (body) + Poppins (display). No emoji anywhere in this file. */
function I(cls){return '<i class="ti '+cls+'"></i>';}
function ic(cls,s){return '<i class="ti '+cls+'"'+(s?' style="font-size:'+s+'px"':'')+'></i>';}
var P_CHECK='ti-check',P_X='ti-x',P_SUN='ti-sun',P_MOON='ti-moon';
var P_COLLAPSE='ti-layout-sidebar-left-collapse',P_EXPAND='ti-layout-sidebar-left-expand';
var P_INBOX='ti-inbox',P_PLUS='ti-plus',P_PENCIL='ti-pencil',P_GRID='ti-layout-grid';
var P_ALERT='ti-alert-triangle',P_BOOK='ti-book';
var P_MEGA='ti-speakerphone',P_CHAT='ti-message-circle',P_MAIL='ti-mail',P_GEAR='ti-settings';
var P_SHIELD='ti-shield-check',P_FILE='ti-file-text',P_USERS='ti-users',P_LOGOUT='ti-logout';
var P_CHR='ti-chevron-right',P_CHL='ti-chevron-left',P_SEARCH='ti-search',P_DOWNLOAD='ti-download';
var P_ZAP='ti-bolt',P_CHEV='ti-chevron-down',P_CHEV_UP='ti-chevron-up',P_EYE='ti-eye';
var P_FILTER='ti-filter',P_SORT='ti-arrows-sort',P_SORT_ASC='ti-sort-ascending',P_SORT_DESC='ti-sort-descending';
var P_DOT='ti-dots',P_HALF='ti-circle-half-2',P_TRASH='ti-trash',P_ARCH='ti-archive';
var P_COPY='ti-copy',P_SEND='ti-send',P_BELL='ti-bell';
var P_UPLOAD='ti-upload';
/* ============ REAL NAV (mirrors sidebar/constants.tsx: 7 groups, routes, menu perms) ============ */
var NAV=[
 {g:'Beranda',items:[{k:'dashboard',t:'Dashboard',icn:'ti-layout-dashboard',route:'/',mp:'menu.dashboard'}]},
 {g:'Pengguna & Akses',items:[
  {k:'users',t:'Pengguna',icn:'ti-users',route:'/users',mp:'menu.users',perm:'users.read'},
  {k:'data-pelajar',t:'Data Pelajar',icn:'ti-school',route:'/data-pelajar',mp:'menu.users',perm:'users.read'},
   {k:'invitations',t:'Undangan',icn:'ti-mail',route:'/invitations',mp:'menu.invitations',perm:'users.invite',badge:'24',cls:'warn'},
   {k:'database',t:'Database',icn:'ti-database',mp:'menu.database',children:[
    {k:'roles',t:'Role',icn:'ti-shield-check',route:'/roles',mp:'menu.roles',perm:'roles.read',badge:'4',cls:'info'},
    {k:'permissions',t:'Permission',icn:'ti-key',route:'/permissions',mp:'menu.permissions',perm:'permissions.read'}]}]},
 {g:'Konten',items:[
  {k:'questions',t:'Bank Soal',icn:'ti-books',route:'/questions',mp:'menu.questions',perm:'questionBank.read',badge:'12',cls:'warn'},
  {k:'ads',t:'Iklan',icn:'ti-speakerphone',route:'/ads',mp:'menu.ads',perm:'ads.read',badge:'5',cls:'ok'},
   {k:'articles',t:'Artikel',icn:'ti-article',route:'/articles',mp:'menu.articles',perm:'articles.read'},
   {k:'vouchers',t:'Voucher',icn:'ti-ticket',route:'/vouchers',mp:'menu.vouchers',perm:'vouchers.read'},
   {k:'referrals',t:'Referral',icn:'ti-link',route:'/referrals',mp:'menu.referrals',perm:'referrals.read'},
   /* Prototype-only: no backend route yet — requested for Marketing */
   {k:'social-media',t:'Media Sosial',icn:'ti-building-broadcast-tower',route:'/social-media',mp:'menu.socialMedia',perm:'social-media.read'},
   {k:'streak-tasks',t:'Tugas Streak',icn:'ti-target',route:'/streak-tasks',mp:'menu.streakTasks',perm:'streak-tasks.read'},
   {k:'content-areas',t:'Bidang Materi',icn:'ti-sitemap',route:'/content-areas',mp:'menu.contentAreas',perm:'taxonomy.read'},
  {k:'topics',t:'Materi',icn:'ti-tag',route:'/topics',mp:'menu.topics',perm:'taxonomy.read'},
  {k:'univ-group',t:'Universitas',icn:'ti-building',mp:'menu.universitas',children:[
    {k:'universitas',t:'Universitas',icn:'ti-building',route:'/universitas',mp:'menu.universitas',perm:'universitas.read'},
    {k:'program-pendidikan',t:'Program Pendidikan',icn:'ti-list-details',route:'/program-pendidikan',mp:'menu.programPendidikan',perm:'program-pendidikan.read'},
    {k:'program-studi',t:'Program Studi',icn:'ti-book',route:'/program-studi',mp:'menu.programStudi',perm:'program-studi.read'}]},
  {k:'media',t:'Media',icn:'ti-photo',route:'/media',mp:'menu.media',perm:'media.read',badge:'320',cls:'info'}]},
 {g:'Struktur Ujian',items:[
  {k:'programs',t:'Program',icn:'ti-folder',route:'/programs',mp:'menu.programs',perm:'program.read'},
   {k:'blueprints',t:'Blueprint',icn:'ti-file-text',route:'/blueprints',mp:'menu.blueprints',perm:'blueprint.read',dot:true,cls:'info'},
  {k:'blueprint-versions',t:'Versi Blueprint',icn:'ti-git-branch',route:'/blueprint-versions',mp:'menu.blueprints',perm:'blueprint.read'}]},
 {g:'Assessment',items:[
  {k:'drills',t:'Latihan',icn:'ti-target',route:'/drills',mp:'menu.drill',perm:'drill.read',badge:'24',cls:''},
  {k:'tryouts',t:'Try Out',icn:'ti-trophy',route:'/tryouts',mp:'menu.tryouts',perm:'tryout.read',badge:'3',cls:'ok'},
  {k:'grading',t:'Penilaian Esai',icn:'ti-clipboard-check',route:'/grading',perm:'essay.grade',badge:'42',cls:'alert'}]},
 {g:'Monitoring',items:[
  {k:'audit-logs',t:'Log Aktivitas',icn:'ti-history',route:'/audit-logs',mp:'menu.auditLogs',perm:'audit-logs.read',dot:true,cls:'ok'},
  {k:'feedbacks',t:'Masukan',icn:'ti-message-circle',route:'/feedbacks',mp:'menu.feedbacks',perm:'feedbacks.read',badge:'7',cls:'warn'},
  {k:'question-reports',t:'Laporan Soal',icn:'ti-flag',route:'/question-reports',mp:'menu.questionReports',perm:'question-reports.manage',badge:'9',cls:'alert'},
  {k:'testimonials',t:'Testimoni',icn:'ti-star',route:'/testimonials',mp:'menu.feedbacks',perm:'feedbacks.read',badge:'13',cls:'warn'},
  {k:'notifications',t:'Notifikasi',icn:'ti-bell',route:'/notifications'}]},
 {g:'Sistem',items:[
  {k:'settings',t:'Pengaturan',icn:'ti-settings',route:'/settings'}]}
];
/* Role -> visible nav keys. Admin sees all. Media is read-only for Tim Soal. */
var ACCESS={
 soal:['dashboard','questions','content-areas','topics','programs','blueprints','blueprint-versions','drills','tryouts','grading','question-reports','media','notifications'],
 marketing:['dashboard','ads','articles','vouchers','referrals','social-media','notifications','streak-tasks'],
 user:['dashboard','users','data-pelajar','invitations','notifications'],
 admin:'*'
};
function coveredKeys(){var s={};['soal','marketing','user'].forEach(function(r){(ACCESS[r]||[]).forEach(function(k){s[k]=1;});});return s;}
function navVisible(role){
 if(role==='admin'){
  /* Admin opens everything, so its sidebar lists only what no other role has.
     Team pages stay one click away via the role switcher. Dashboard always stays. */
  var cov=coveredKeys();var out=[];
  NAV.forEach(function(gr){
   var items=[];
   gr.items.forEach(function(it){
    if(it.k==='settings')return;
    if(it.children){
     var kids=it.children.filter(function(c){return !cov[c.k];});
     if(kids.length)items.push({g:it.t,items:kids});
    }else if(it.k==='dashboard'||!cov[it.k])items.push(it);
   });
   if(items.length)out.push({g:gr.g,items:items});
  });
  return out;
 }
 var out=[];
 NAV.forEach(function(gr){
  var items=[];
  gr.items.forEach(function(it){
   if(it.children){
    var kids=it.children.filter(function(c){return ACCESS[role].indexOf(c.k)>=0;});
    if(kids.length)items.push({g:it.t,items:kids});
    else if(ACCESS[role].indexOf(it.k)>=0)items.push(it);
   }else if(ACCESS[role].indexOf(it.k)>=0)items.push(it);
  });
  if(items.length)out.push({g:gr.g,items:items});
 });
 return out;
}
function flatNav(role){
 var out=[];
 navVisible(role).forEach(function(gr){gr.items.forEach(function(it){
  if(it.items)it.items.forEach(function(c){c.g=gr.g+' · '+it.t;out.push(c);});else{it.g=gr.g;out.push(it);}});});
 return out;
}
/* ============ REAL FEATURE REGISTRY. route/perm/menu mirror the TanStack app.
   (streak-tasks is real: route /streak-tasks, perms streak-tasks.*). */
var F={
 'dash-soal':{menu:'menu.dashboard',route:'/',title:'Dashboard Soal',cat:'dash',queue:'grading',
  cols:['Antrian','Konteks','Status','Aksi'],filters:[],chips:['Semua','Terbuka','Antre','Berlangsung'],
  rows:[
   {id:'SR-2091',t:'Laporan kunci ganda',s:'TPS · Penalaran Umum · PU-14',st:['Terbuka · 2 hari','red'],by:'Sistem'},
   {id:'E-42',t:'42 esai antre dinilai',s:'TO Akbar 12 · Ekonomi · rubrik v2',st:['Antre','amber'],by:'R. Kartika'},
   {id:'BP-v4',t:'Blueprint SNBT-2026 v4',s:'Kesiapan 82% · 2 unit belum dikunci',st:['Revisi','amber'],by:'D. Mahesa'},
   {id:'TO-12',t:'TO Akbar 12',s:'1.842 peserta · berakhir 2 hari',st:['Berlangsung','green'],by:'Sistem'}]},
  /* Ringkasan antrean marketing ikut halaman Iklan. */
  'dash-marketing':{menu:'menu.dashboard',route:'/',title:'Dashboard Marketing',cat:'dash',queue:'ads'},
 'dash-user':{menu:'menu.dashboard',route:'/',title:'Dashboard Operasional',cat:'dash',queue:'invitations',
  cols:['Antrian','Konteks','Status','Aksi'],filters:[],chips:['Semua','Pengingat','Antre'],
  rows:[
   {id:'INV-8',t:'8 undangan kedaluwarsa < 3 hari',s:'sekolah mitra · 640 kursi',st:['Pengingat','amber'],by:'Tim User'},
   {id:'WA-12',t:'12 pendaftar belum verifikasi WA',s:'perlu pengingat manual',st:['Antre','amber'],by:'Tim User'},
   {id:'NEW-87',t:'87 pelajar baru hari ini',s:'94% verifikasi otomatis · 5 manual',st:['Sehat','green'],by:'Sistem'}]},
 'dash-admin':{menu:'menu.dashboard',route:'/',title:'Dashboard Sistem',cat:'dash',queue:'audit-logs',
  cols:['Area','Konteks','Status','Aksi'],filters:[],chips:['Semua','Perhatian','Sehat'],
  rows:[
   {id:'INV-8',t:'8 undangan kedaluwarsa < 3 hari',s:'sekolah mitra · 640 kursi · diterima 68%',st:['Pengingat','amber'],by:'Tim User'},
   {id:'TES-13',t:'13 testimoni menunggu kurasi',s:'rating 4-5 · 2 perlu sunting bahasa',st:['Kurasi','amber'],by:'Marketing'},
   {id:'R-4',t:'4 role · 26 permission',s:'terakhir diubah kemarin · audit ok',st:['Sehat','green'],by:'Admin'},
   {id:'LOG',t:'128 catatan aktivitas hari ini',s:'0 keanehan · disimpan 30 hari',st:['Aman','green'],by:'Sistem'}]},
 users:{menu:'menu.users',route:'/users',perm:'users.read',title:'Pengguna',cat:'access',qa:'Ubah peran',
  acts:[{l:'Detail',icn:P_EYE,do:'drawer'},{l:'Kelola peran',icn:P_SHIELD,do:'dtab:akses'},{l:'Reset sandi',icn:'ti-key',do:'dtab:keamanan'}],
  sub:'Daftar akun: nama, email, peran, dan tanggal dibuat. Bisa undang, atur peran, reset kata sandi, export data.',
  cols:['Nama','Kontak / Peran','Status','Aksi'],filters:[],chips:['Semua','Aktif','Baru'],
  rows:[
   {id:'U-9211',t:'Nadia Prameswari',s:'nadia@… · @nadia · Pelajar',st:['Aktif','green'],by:'Nadia P.',chip:'Aktif'},
   {id:'U-9208',t:'Bagas Ramadhan',s:'bagas@… · @bagas · Pelajar',st:['Aktif','green'],by:'Bagas R.',chip:'Aktif'},
   {id:'U-9001',t:'Sinta (Tim Soal)',s:'sinta@… · Tim Soal · boleh buka 11 halaman',st:['Aktif','green'],by:'Sinta',chip:'Aktif'}],
  empty:{t:'Belum ada pengguna',d:'Undang anggota tim atau impor dari sekolah mitra.',c:'Undang pengguna'},
  form:[{k:'name',l:'Nama lengkap',req:1,ph:'cth: Sinta Maharani'},{k:'email',l:'Email',type:'email',req:1,ph:'nama@sekolah.sch.id'},{k:'role',l:'Peran awal',type:'select',opts:['Tim Soal','Tim Marketing','Tim User','Admin']}]},
 'data-pelajar':{menu:'menu.users',hideActs:true,route:'/data-pelajar',perm:'users.read',title:'Data Pelajar',cat:'access',qa:'Lihat profil',
  sub:'Nama, sekolah, tahun lulus, kontak WA, dan asal info pendaftar. Ketuk baris untuk lihat detail.',
  cols:['Nama','Sekolah / Lulus','Status','Info'],filters:[{k:'lulus',l:'Lulus',o:['Semua','2026','2025']}],chips:['Semua'],
  rows:[
   {id:'S-771',t:'Nadia P. — XII',s:'SMAN 1 Bandung · lulus 2026 · WA terisi',st:['Aktif','green'],by:'Organik'},
   {id:'S-772',t:'Bagas R. — gap year',s:'SMKN 2 Solo · lulus 2025 · WA terisi',st:['Aktif','green'],by:'Teman'}],
  empty:{t:'Belum ada data pelajar',d:'Data masuk otomatis saat pelajar mendaftar atau via undangan sekolah.',c:'Undang sekolah'}},
  invitations:{menu:'menu.invitations',hideActs:true,route:'/invitations',perm:'users.invite',title:'Undangan',cat:'access',qa:'Kirim ulang',view:'invitations',
  acts:[{l:'Detail',icn:P_EYE,do:'drawer'},{l:'Salin tautan',icn:P_COPY,do:'toast:Tautan undangan disalin'},{l:'Kirim ulang',icn:P_SEND,do:'toast:Undangan dikirim ulang'}],
  sub:'Undang sekolah atau tim lewat email. Lihat status, salin tautan, kirim ulang, cabut, export rekap.',
  cols:['Email','Roles / Exp','Status','Aksi'],filters:[{k:'st',l:'Status',o:['Semua','Menunggu','Dibuka','Diterima','Kedaluwarsa']}],chips:['Semua','Menunggu','Diterima','Kedaluwarsa'],
  rows:[
   {id:'INV-1042',t:'tu@sman1-cirebon.sch.id',s:'Sekolah · 120 kursi · berakhir 2 hari',st:['Menunggu','amber'],by:'Tim User',chip:'Menunggu'},
   {id:'INV-1041',t:'halo@bimbelalpha.id',s:'Sekolah · sudah dibuka 2x',st:['Dibuka','blue'],by:'Tim User',chip:'Semua'},
   {id:'INV-1038',t:'tu@smkn2-solo.sch.id',s:'Sekolah · 200 kursi',st:['Diterima','green'],by:'Tim User',chip:'Diterima'}],
  empty:{t:'Belum ada undangan',d:'Undang sekolah mitra atau anggota tim lewat email.',c:'Buat undangan'},
  form:[{k:'email',l:'Email tujuan',type:'email',req:1,ph:'tu@sekolah.sch.id'},{k:'role',l:'Peran',type:'select',opts:['Sekolah','Tim Soal','Tim Marketing','Tim User']},{k:'seats',l:'Kursi',type:'number',ph:'120',hint:'Kosongkan untuk tanpa batas.'}]},
  /* Prototype-only request flow: Marketing requests, Tim User decides, all roles informed. */
  'minta-undangan':{menu:'menu.inviteRequests',route:'/minta-undangan',perm:'—',title:'Minta Undangan',cat:'access',qa:'Lihat detail',view:'reqinv',
   sub:'Marketing meminta, Tim User memutuskan. Semua peran diberi tahu hasilnya.',
   cols:['Permintaan','Konteks','Status','Aksi'],filters:[],chips:['Semua','Menunggu','Dikirim','Ditolak','Batal','Kedaluwarsa'],
   rows:[],
   empty:{t:'Belum ada permintaan',d:'Marketing meminta undangan lewat tombol di atas. Tim User memutuskan di sini.',c:'Minta undangan'}},
 roles:{menu:'menu.roles',route:'/roles',perm:'roles.read',title:'Peran',cat:'access',qa:'Ubah akses',
  acts:[{l:'Detail',icn:P_EYE,do:'drawer'},{l:'Kelola akses',icn:P_SHIELD,do:'dtab:akses'},{l:'Duplikat',icn:P_COPY,do:'toast:Peran diduplikat sebagai Draft'}],
  sub:'Nama peran, penjelasan, dan jumlah anggota. Atur siapa boleh buka apa di daftar bawah.',
  cols:['Peran','Cakupan','Anggota','Aksi'],filters:[],chips:['Semua'],
  rows:[
   {id:'R-SOAL',t:'Tim Soal',s:'11 halaman · Bank Soal, Latihan, Tryout, Laporan',st:['4 anggota','blue'],by:'Admin'},
    {id:'R-MKT',t:'Tim Marketing',s:'8 halaman · Iklan, Artikel, Voucher, Referral, Notifikasi',st:['3 anggota','blue'],by:'Admin'},
   {id:'R-USER',t:'Tim User',s:'5 halaman · Pengguna, Pelajar, Undangan, Notifikasi',st:['5 anggota','blue'],by:'Admin'},
   {id:'R-ADM',t:'Admin',s:'semua halaman · termasuk Peran & Log',st:['2 anggota','purple'],by:'Admin'}],
  empty:{t:'Belum ada peran khusus',d:'Buat peran baru lalu centang halaman yang boleh dibuka.',c:'Buat peran'},
  form:[{k:'name',l:'Nama peran',req:1,ph:'cth: Kurator Soal'},{k:'desc',l:'Deskripsi',type:'textarea',ph:'Tanggung jawab peran ini…'}]},
 permissions:{menu:'menu.permissions',hideActs:true,route:'/permissions',perm:'permissions.read',title:'Izin akses',cat:'access',qa:'Lihat pemakaian',
  sub:'Daftar semua izin: halaman apa boleh dibuka dan aksi apa boleh dilakukan, plus keterangannya.',
  cols:['Izin','Keterangan','Jenis','Aksi'],filters:[{k:'jenis',l:'Jenis',o:['Semua','Menu','Data']}],chips:['Semua','Menu','Data'],
  rows:[
   {id:'menu.questions',t:'Bank Soal',s:'Tampilkan Bank Soal di menu kiri',st:['Menu','blue'],by:'Sistem',chip:'Menu'},
   {id:'tryout.publish',t:'Publikasikan tryout',s:'Terbitkan tryout setelah siap',st:['Data','gray'],by:'Sistem',chip:'Data'},
   {id:'question-reports.manage',t:'Kelola laporan soal',s:'Tinjau dan tindaklanjuti laporan',st:['Data','gray'],by:'Sistem',chip:'Data'}],
  empty:{t:'Belum ada izin khusus',d:'Izin baru muncul sendiri saat fitur baru ditambahkan.',c:'Muat ulang'}},
questions:{menu:'menu.questions',route:'/questions',perm:'questionBank.read',title:'Bank Soal',cat:'content',qa:'Publikasikan',view:'questions',
   acts:[{l:'Detail',icn:P_EYE,do:'drawer'},{l:'Duplikat',icn:P_COPY,do:'toast:Soal diduplikat sebagai Draft'},{l:'Arsipkan',icn:P_ARCH,do:'toast:Soal diarsipkan'}],
   sub:'Soal pilihan ganda, isian, dan uraian — lengkap dengan tipe, materi, tingkat sulit, dan status.',
   sorts:[{key:'title',label:'Konten'},{key:'type',label:'Tipe'},{key:'diff',label:'Kesulitan'},{key:'status',label:'Status'}],
   cols:['Konten','Materi','Status','Aksi'],filters:[{k:'type',l:'Tipe',o:['Semua','Pilihan Ganda','Benar/Salah','Menjodohkan','Isian Singkat','Uraian']},{k:'diff',l:'Kesulitan',o:['Semua','Mudah','Sedang','Sulit']},{k:'st',l:'Status',o:['Semua','In Review','Ready','Locked','Archive']}],chips:['Semua','In Review','Ready','Locked','Archive'],
  /* s sengaja memuat tipe + kesulitan supaya filter bawaan (cari 4 huruf awal) tetap kena. */
  rows:[
    {id:'SOAL-8821',t:'Grafik fungsi f(x) = x² − 6x + 5 berpotongan dengan sumbu X pada titik …',s:'Pilihan Ganda · Matematika · Aljabar · Mudah · dipakai 12x',st:['Ready','green'],by:'R. Kartika',chip:'Ready',
     type:'Pilihan Ganda',diff:'Mudah',topic:'Aljabar',subj:'SUB-MAT',mat:'MAT-ALJ',points:5,fig:'grafik-fungsi.png',options:['(−1, 0) dan (5, 0)','(1, 0) dan (5, 0)','(−1, 0) dan (−5, 0)','(1, 0) dan (3, 0)','(3, 0) dan (−5, 0)'],key:'B',
     explain:'Nilai x saat f(x) = 0 diperoleh dari x² − 6x + 5 = 0, sehingga (x − 1)(x − 5) = 0 dan x = 1 atau x = 5. Jadi titik potongnya (1, 0) dan (5, 0).',used:12,reports:0},
    {id:'SOAL-8803',t:'Jika x² − 2x − 8 = 0, tentukan seluruh nilai x yang memenuhi.',s:'Isian Singkat · Matematika · Persamaan Kuadrat · Sedang · dipakai 15x',st:['Ready','green'],by:'R. Kartika',chip:'Ready',
     type:'Isian Singkat',diff:'Sedang',topic:'Persamaan Kuadrat',subj:'SUB-MAT',mat:'MAT-PK',points:10,options:[],key:'x = 4 atau x = −2',
     explain:'x² − 2x − 8 = (x − 4)(x + 2) = 0, sehingga x = 4 atau x = −2. Jawaban siswa boleh ditulis dengan urutan terbalik.',used:15,reports:0},
    {id:'SOAL-8822',t:'Bacalah kutipan berikut. "Banyak UMKM kehilangan pelanggan karena hanya mengandalkan penjualan di sekitar rumah. Pemilik usaha yang memakai katalog daring mencatat penjualan dari luar daerah naik rata-rata 30%." Kesimpulan yang paling tepat dari kutipan itu adalah …',s:'Pilihan Ganda · Bahasa Indonesia · Literasi · Sulit · dipakai 3x',st:['In Review','amber'],by:'Sinta',chip:'In Review',
     type:'Pilihan Ganda',diff:'Sulit',topic:'Literasi',subj:'SUB-BIN',mat:'BIN-LIT',points:15,options:['Penggunaan katalog daring membantu UMKM menjangkau pasar yang lebih luas','Penjualan di sekitar rumah sudah tidak menarik bagi pembeli','Katalog daring selalu lebih menguntungkan daripada toko fisik','Hanya 30% UMKM yang sudah memakai katalog daring','Kenaikan penjualan berasal dari kenaikan harga barang'],key:'A',
     explain:'Kutipan menyebut kenaikan penjualan 30% pada pemilik usaha yang memakai katalog daring, dan pembeli dari luar daerah. Jadi katalog daring memperluas jangkauan pasar. Angka 30% menunjukkan kenaikan penjualan, bukan jumlah UMKM.',used:3,reports:1},
    {id:'SOAL-8774',t:'Sebuah gelombang berjalan pada tali memiliki panjang gelombang 4 m dan kecepatan 8 m/s. Frekuensi gelombang tersebut adalah …',s:'Pilihan Ganda · Fisika · Gelombang · Mudah · ada gambar · dipakai 21x',st:['Ready','green'],by:'D. Mahesa',chip:'Ready',
     type:'Pilihan Ganda',diff:'Mudah',topic:'Gelombang',subj:'SUB-FIS',mat:'FIS-GEL',points:5,fig:'gelombang-tali.webp',options:['1 Hz','2 Hz','4 Hz','8 Hz','16 Hz'],key:'B',
     explain:'Frekuensi dihitung dari f = v ÷ λ = 8 ÷ 4 = 2 Hz. Panjang gelombang dalam meter dan kecepatan dalam meter per sekon.',used:21,reports:0},
    {id:'SOAL-8790',t:'Dari suatu barisan aritmetika diketahui suku ke-5 = 12 dan suku ke-9 = 28. Nilai suku ke-20 adalah …',s:'Pilihan Ganda · Matematika · Barisan · Sedang · 2 laporan',st:['In Review','amber'],by:'Sistem',chip:'In Review',
     type:'Pilihan Ganda',diff:'Sedang',topic:'Barisan',subj:'SUB-MAT',mat:'MAT-BAR',points:10,options:['56','64','68','72','80'],key:'D',
     explain:'Selisih suku ke-9 dan ke-5 adalah 16, jadi beda barisan u = 16 ÷ 4 = 4. Dari a + 4u = 12 diperoleh a = −4. Maka suku ke-20 = −4 + 19(4) = 72.',used:27,reports:2},
    {id:'SOAL-8791',t:'Tentukan benar atau salah pernyataan berikut: kata "praktek" merupakan bentuk baku dari kata "praktik".',s:'Benar/Salah · Bahasa Indonesia · Tata Bahasa · Mudah · dipakai 8x',st:['Ready','green'],by:'Sinta',chip:'Ready',
     type:'Benar/Salah',diff:'Mudah',topic:'Tata Bahasa',subj:'SUB-BIN',mat:'BIN-TB',points:5,options:['Benar','Salah'],key:'A',
     explain:'Menurut KBBI, bentuk baku kata kerja adalah "praktik". "Praktek" hanya dipakai dalam konteks tidak baku, jadi pernyataan ini benar.',used:8,reports:0},
    {id:'SOAL-8809',t:'Pasangkan setiap istilah dengan definisi yang paling tepat.',s:'Menjodohkan · Biologi · Genetika · Sedang · dipakai 9x',st:['Locked','blue'],by:'R. Kartika',chip:'Locked',
     type:'Menjodohkan',diff:'Sedang',topic:'Genetika',subj:'SUB-BIO',mat:'BIO-GEN',points:10,usedIn:'TO Akbar 12',options:['Hibrida — Persilangan dua individu dengan variasi genetik berbeda','Alel resesif — Alel yang hanya muncul pada individu homozigot resesif','Homozigot — Individu yang memiliki dua alel identik dari satu gen','Genotipe — Susunan alel yang dimiliki individu'],key:'Semua pasangan sesuai',
     explain:'Keempat pasangan sudah sesuai definisi baku. Saat dipakai di tryout, urutan pasangan diacak; kunci jawaban mengikuti urutan yang diacak.',used:9,reports:0},
    {id:'SOAL-8782',t:'Uraikan hubungan antara kenaikan permintaan dan harga keseimbangan di pasar, serta dampaknya terhadap jumlah barang yang diperdagangkan.',s:'Uraian · Ekonomi · Mikroekonomi · Sulit · dipakai 1x',st:['Archive','gray'],by:'D. Mahesa',chip:'Archive',
     type:'Uraian',diff:'Sulit',topic:'Mikroekonomi',subj:'SUB-EKO',mat:'EKO-MIK',points:15,options:[],key:'Dinilai sesuai rubrik',
     explain:'Rubrik menilai tiga hal: alasan harga naik ketika permintaan naik, pergeseran titik keseimbangan, dan alasan jumlah barang yang diperdagangkan bertambah. Jawaban dinilai manual oleh pemeriksa.',used:1,reports:0}],
   empty:{t:'Belum ada soal di sini',d:'Buat soal pertama: pilih tipe, tulis konten, pasang kunci dan pembahasan.',c:'Buat soal'},
   form:[{k:'type',l:'Tipe soal',type:'select',opts:['Pilihan Ganda','Benar/Salah','Menjodohkan','Isian Singkat','Uraian']},{k:'content',l:'Konten soal',type:'textarea',req:1,ph:'Tulis soal (maks 80 char tampil di daftar)…'},{k:'diff',l:'Kesulitan',type:'select',opts:['Mudah','Sedang','Sulit']}]},
  media:{menu:'menu.media',route:'/media',perm:'media.read',title:'Media',cat:'content',qa:'Pratinjau',view:'media',
   acts:[{l:'Detail',icn:P_EYE,do:'drawer'},{l:'Export',icn:P_DOWNLOAD,do:'toast:Menyiapkan export…'}],
   sub:'Pustaka file bersama: avatar, gambar soal, banner & iklan.',
   cols:['File','Kegunaan / Ukuran','Status','Aksi'],filters:[],chips:['Semua','Avatar','Banner','Soal','Logo','Iklan','Lainnya'],
  rows:[
   {id:'M-101',t:'gelombang-tali.webp',s:'Gambar · 1,2 MB · dipakai 3 soal',st:['Dipakai','green'],by:'D. Mahesa',chip:'Soal',cat:'Soal',owner:'Admin',mime:'image/webp',size:'1,2 MB',ratio:'3/4'},
   {id:'M-102',t:'grafik-fungsi.png',s:'Gambar · 640 KB · dipakai 1 soal',st:['Dipakai','green'],by:'Sinta',chip:'Soal',cat:'Soal',owner:'Admin',mime:'image/png',size:'640 KB',ratio:'1/1'},
   {id:'M-103',t:'audio-listening.mp3',s:'Audio · 2,1 MB · belum dipakai',st:['Belum dipakai','gray'],by:'Raka',chip:'Lainnya',cat:'Lainnya',owner:'Admin',mime:'audio/mpeg',size:'2,1 MB',ratio:'16/10'},
   {id:'M-104',t:'avatar-nadia.png',s:'Gambar · 320 KB · avatar aktif',st:['Dipakai','green'],by:'Nadia P.',chip:'Avatar',cat:'Avatar',owner:'Pelajar',mime:'image/png',size:'320 KB',ratio:'1/1'},
   {id:'M-105',t:'avatar-bagas.png',s:'Gambar · 298 KB · avatar aktif',st:['Dipakai','green'],by:'Bagas R.',chip:'Avatar',cat:'Avatar',owner:'Pelajar',mime:'image/png',size:'298 KB',ratio:'1/1'},
   {id:'M-106',t:'hero-snbt-2026.webp',s:'Gambar · 2,4 MB · banner beranda',st:['Dipakai','green'],by:'Raka',chip:'Banner',cat:'Banner',owner:'Admin',mime:'image/webp',size:'2,4 MB',ratio:'16/9'},
   {id:'M-107',t:'logo-ui.png',s:'Gambar · 180 KB · dipakai 48 prodi',st:['Dipakai','green'],by:'Sistem',chip:'Logo',cat:'Logo',owner:'Admin',mime:'image/png',size:'180 KB',ratio:'1/1'},
   {id:'M-108',t:'panduan-snbt.pdf',s:'Dokumen · 4,7 MB · belum dipakai',st:['Belum dipakai','gray'],by:'D. Mahesa',chip:'Lainnya',cat:'Lainnya',owner:'Admin',mime:'application/pdf',size:'4,7 MB',ratio:'3/4'},
   {id:'M-109',t:'feed-ig-promo.png',s:'Gambar · 890 KB · dipakai 1 iklan',st:['Dipakai','green'],by:'Raka',chip:'Iklan',cat:'Iklan',owner:'Admin',mime:'image/png',size:'890 KB',ratio:'1/1'}],
  empty:{t:'Belum ada media',d:'Unggah gambar, audio, atau dokumen untuk dipakai di soal dan iklan.',c:'Unggah media'},
  form:[{k:'file',l:'Nama file',req:1,ph:'cth: diagram-gaya.png'},{k:'type',l:'Tipe',type:'select',opts:['Gambar','Audio','Dokumen']}]},
  ads:{menu:'menu.ads',route:'/ads',perm:'ads.read',title:'Iklan',cat:'content',qa:'Tayangkan',view:'ads',
   sub:'Materi promosi: gambar, tulisan, tautan, posisi tampil, dan jadwal tayang.',
   cols:['Iklan','Jadwal','Status','Aksi'],filters:[],chips:['Semua','Tayang','Menunggu','Draft','Selesai'],
  rows:[
    {id:'ADS-IG',t:'IG Feed — TO Akbar 12',s:'lengkap · 7 hari · beranda',st:['Tayang','green'],by:'Raka',chip:'Tayang',variant:'full',label:'Pendaftaran Dibuka',button:'Lihat Info',link:'/tryout/akbar-12',img:null,order:0,mulai:'1 Okt 2026',selesai:'8 Okt 2026'},
    {id:'ADS-TT',t:'TikTok — Testimoni',s:'gambar saja · tanpa batas',st:['Tayang','green'],by:'Raka',chip:'Tayang',variant:'image_only',label:'',button:'',link:'',img:'grafik-fungsi.png',order:1,mulai:'28 Sep 2026',selesai:'Belum diatur'},
   {id:'ADS-GG',t:'Iklan tryout SNBT',s:'menunggu jadwal · belum diatur',st:['Menunggu','amber'],by:'Raka',chip:'Menunggu',variant:'full',label:'Segera Hadir',button:'Lihat Info',link:'',img:null,order:2,mulai:'Belum diatur',selesai:'Belum diatur'}],
  empty:{t:'Belum ada iklan',d:'Buat materi iklan: gambar, tautan, posisi, varian, dan jadwal tayang.',c:'Buat iklan'},
  form:[{k:'title',l:'Judul iklan',req:1,ph:'cth: TO Akbar 12 dibuka'},{k:'variant',l:'Tampilan',type:'select',opts:['Lengkap','Gambar saja','Teks saja']},{k:'budget',l:'Anggaran (Rp)',type:'number',ph:'2000000'}]},
  /* Mirrors admin /(content)/articles: Konfigurasi portal + Daftar artikel grup "artikel". Prototype-only rows. */
  articles:{menu:'menu.articles',route:'/articles',perm:'articles.read',title:'Artikel',cat:'content',qa:'Lihat artikel',view:'articles',
   sub:'Sumber portal untuk halaman publik TRYOUTKU. Simpan konfigurasi lalu pantau daftar artikel grup “artikel”.',
   cols:['Artikel','Tanggal','Status','Aksi'],filters:[],chips:['Semua'],
   rows:[
    {id:'panduan-snbt-2026',t:'Panduan Lengkap SNBT 2026',s:'Jadwal, syarat, dan strategi lolos seleksi.',st:['Tayang','green'],by:'Portal',chip:'Semua',slug:'panduan-snbt-2026',thumbnail:null,published:'28 Sep 2026',excerpt:'Jadwal, syarat, dan strategi lolos SNBT 2026 dirangkum dari portal resmi.'},
    {id:'strategi-tps-efektif',t:'Strategi Mengerjakan TPS dengan Efektif',s:'Manajemen waktu dan pola soal yang sering keluar.',st:['Tayang','green'],by:'Portal',chip:'Semua',slug:'strategi-tps-efektif',thumbnail:null,published:'25 Sep 2026',excerpt:'Manajemen waktu dan pola soal TPS yang paling sering keluar.'},
    {id:'beasiswa-stekom-2026',t:'Info Beasiswa STEKOM 2026',s:'Syarat, berkas, dan batas waktu pendaftaran.',st:['Tayang','green'],by:'Portal',chip:'Semua',slug:'beasiswa-stekom-2026',thumbnail:null,published:'20 Sep 2026',excerpt:'Syarat, berkas, dan batas waktu pendaftaran beasiswa.'},
    {id:'tips-manajemen-waktu',t:'Tips Manajemen Waktu Tryout',s:'Cara membagi waktu per subtes tanpa panik.',st:['Draft','amber'],by:'Portal',chip:'Semua',slug:'tips-manajemen-waktu',thumbnail:null,published:'18 Sep 2026',excerpt:'Cara membagi waktu per subtes tanpa panik saat ujian.'}],
   empty:{t:'Belum ada artikel',d:'Simpan konfigurasi portal untuk memuat artikel grup “artikel”.',c:'Muat ulang'}},
  /* Prototype-only promo tools — requested for Marketing */
  vouchers:{menu:'menu.vouchers',route:'/vouchers',perm:'vouchers.read',title:'Voucher',cat:'content',qa:'Aktifkan',view:'vouchers',
   sub:'Kode diskon untuk pelajar. Atur nilai, kuota, jadwal, dan siapa yang menerima.',
   cols:['Voucher','Jadwal','Status','Aksi'],filters:[],chips:['Semua','Draft','Siap','Aktif','Kedaluwarsa'],
   rows:[
    {id:'V-AKBAR12',t:'Diskon TO Akbar 12',s:'50 koin · kuota 200 · semua pelajar',st:['Aktif','green'],by:'Raka',chip:'Aktif',code:'TO-AKBAR12',kind:'Koin',value:50,quota:200,used:143,mulai:'1 Okt 2026',selesai:'8 Okt 2026',target:'Semua pelajar',targetKind:'Semua',targetN:''},
    {id:'V-HEMAT20',t:'Hemat awal bulan',s:'20 koin · kuota 100 · acak 100 orang',st:['Siap','amber'],by:'Raka',chip:'Siap',code:'HEMAT20',kind:'Koin',value:20,quota:100,used:0,mulai:'5 Okt 2026',selesai:'12 Okt 2026',target:'Acak · 100 orang',targetKind:'Acak',targetN:100},
    {id:'V-MITRA',t:'Sekolah mitra Cirebon',s:'100 koin · kuota 120 · pilihan 120 kursi',st:['Draft','gray'],by:'Raka',chip:'Draft',code:'MITRA-CRB',kind:'Koin',value:100,quota:120,used:0,mulai:'Belum diatur',selesai:'Belum diatur',target:'Pilihan · 120 kursi',targetKind:'Pilihan',targetN:120},
    {id:'V-FLASH10',t:'Flash sale 10rb',s:'10 koin · kuota 50 · semua pelajar',st:['Kedaluwarsa','gray'],by:'Raka',chip:'Kedaluwarsa',code:'FLASH10',kind:'Koin',value:10,quota:50,used:50,mulai:'20 Sep 2026',selesai:'21 Sep 2026',target:'Semua pelajar',targetKind:'Semua',targetN:''}],
   empty:{t:'Belum ada voucher',d:'Buat kode diskon: nilai, kuota, jadwal, dan penerima.',c:'Buat voucher'}},
  referrals:{menu:'menu.referrals',route:'/referrals',perm:'referrals.read',title:'Referral',cat:'content',qa:'Tutup',view:'referrals',
   sub:'Admin membuat quest, siswa yang membuat tautan. Satu quest live dalam satu waktu.',
   cols:['Quest','Kuota','Penyebar','Pendaftar'],filters:[],chips:['Semua','Aktif','Penuh','Kedaluwarsa'],hideActs:true,
   colDefs:[
    {label:'Quest',sort:'quest',html:function(d){return questBadge(d.quest)+'<div class="cell-s" style="margin-top:4px">'+esc(refQuestName(d.quest))+'</div>';}},
    {label:'Kuota',sort:null,html:function(d){return '<div class="cell-t">'+esc(d.used||0)+'/'+esc(d.max||0)+'</div><div class="cell-s">pendaftar</div>';}},
    {label:'Penyebar',sort:'owner',html:function(d,i){return '<div class="who">'+ava(d.by,i)+'<span><span class="cell-t" style="font-weight:500">'+esc(d.owner||d.by)+'</span><br><span class="cell-s">'+ic('ti-calendar',13)+' '+esc(d.joined||'—')+'</span> <span class="status amber">'+esc(d.coin||0)+' '+COIN_IMG+'</span></span></div>';}},
    {label:'Pendaftar',sort:null,html:function(d){var h=d.hist||[];var names=h.map(function(x){return x.n;}).join(', ');return '<div class="cell-t">'+(names?esc(names):'<span class="cell-s">—</span>')+'</div><div class="cell-s">+'+esc(refQuestJoin(d.quest))+' '+COIN_IMG+'</div>';}}],
   acts:[{l:'Detail',icn:P_EYE,do:'drawer'},{l:'Cabut',icn:P_TRASH,do:'refcabut'},{l:'Salin tautan',icn:P_COPY,do:'toast:Tautan disalin'}],
   rows:[
    {id:'L-RAKA',t:'tryoutku.id/r/rakasnbt',s:'Raka · 34/100 pendaftar unik · +10 koin per pendaftar',st:['Aktif','green'],by:'Raka',chip:'Aktif',code:'rakasnbt',link:'tryoutku.id/r/rakasnbt',owner:'Raka',quest:'A',used:34,max:100,coin:10,joined:'28 Sep 2026',hist:[{n:'Nadia P.',t:'28 Sep 2026'},{n:'Bagas R.',t:'27 Sep 2026'}]},
    {id:'L-SINTA',t:'tryoutku.id/r/sintalolos',s:'Sinta · 12/50 pendaftar unik · +10 koin per pendaftar',st:['Aktif','green'],by:'Sinta',chip:'Aktif',code:'sintalolos',link:'tryoutku.id/r/sintalolos',owner:'Sinta',quest:'A',used:12,max:50,coin:10,joined:'25 Sep 2026',hist:[{n:'Citra L.',t:'25 Sep 2026'}]},
    {id:'L-BAGAS',t:'tryoutku.id/r/bagasmain',s:'Bagas · 30/30 pendaftar unik · +10 koin per pendaftar',st:['Penuh','amber'],by:'Bagas',chip:'Penuh',code:'bagasmain',link:'tryoutku.id/r/bagasmain',owner:'Bagas',quest:'A',used:30,max:30,coin:10,joined:'20 Sep 2026',hist:[{n:'Eko P.',t:'20 Sep 2026'},{n:'Farah A.',t:'19 Sep 2026'}]},
    {id:'L-DINDA',t:'tryoutku.id/r/dindaajak',s:'Dinda · 2/50 pendaftar unik · +10 koin per pendaftar',st:['Aktif','green'],by:'Dinda',chip:'Aktif',code:'dindaajak',link:'tryoutku.id/r/dindaajak',owner:'Dinda',quest:'A',used:2,max:50,coin:10,joined:'2 Okt 2026',hist:[]},
    {id:'L-EKO',t:'tryoutku.id/r/ekoutbk',s:'Eko · 5/40 pendaftar unik · +15 koin per pendaftar',st:['Aktif','green'],by:'Eko',chip:'Aktif',code:'ekoutbk',link:'tryoutku.id/r/ekoutbk',owner:'Eko',quest:'B',used:5,max:40,coin:15,joined:'15 Sep 2026',hist:[{n:'Gilang R.',t:'15 Sep 2026'}]},
    {id:'L-FARAH',t:'tryoutku.id/r/farahakbar',s:'Farah · 9/60 pendaftar unik · +15 koin per pendaftar',st:['Aktif','green'],by:'Farah',chip:'Aktif',code:'farahakbar',link:'tryoutku.id/r/farahakbar',owner:'Farah',quest:'C',used:9,max:60,coin:15,joined:'22 Sep 2026',hist:[{n:'Hadi P.',t:'22 Sep 2026'}]}],
   empty:{t:'Belum ada tautan',d:'Tautan muncul saat siswa ikut quest yang live.',c:'Lihat quest'}},
  /* Prototype-only: no backend route yet — requested for Marketing */
 'social-media':{menu:'menu.socialMedia',route:'/social-media',perm:'social-media.read',title:'Media Sosial',cat:'content',qa:'Ubah',view:'social',
  acts:[{l:'Detail',icn:P_EYE,do:'drawer'},{l:'Salin tautan',icn:P_COPY,do:'toast:Tautan disalin'},{l:'Ubah status',icn:P_CHECK,do:'toast:Status tampilan diubah'}],
  sub:'Akun resmi: Instagram, TikTok, YouTube, WhatsApp. Atur tautan dan status tampil.',
   cols:['Akun','Tautan / Pengikut','Status','Aksi'],filters:[],chips:['Semua','Aktif','Nonaktif'],
  rows:[
   {id:'SM-IG',t:'@tryoutku · Instagram',s:'tryoutku.id/ig · tautan resmi',st:['Aktif','green'],by:'Raka',chip:'Aktif',platform:'Instagram',url:'tryoutku.id/ig',followers:'tautan resmi',trend:'tampil di profil'},
   {id:'SM-TT',t:'@tryoutku · TikTok',s:'tryoutku.id/tt · tautan resmi',st:['Aktif','green'],by:'Raka',chip:'Aktif',platform:'TikTok',url:'tryoutku.id/tt',followers:'tautan resmi',trend:'tampil di profil'},
   {id:'SM-WA',t:'Grup WA SNBT 2026',s:'tryoutku.id/wa · tautan undangan',st:['Nonaktif','gray'],by:'Raka',chip:'Nonaktif',platform:'WhatsApp',url:'tryoutku.id/wa',followers:'tautan undangan',trend:'perlu tautan baru'}],
  empty:{t:'Belum ada akun',d:'Tambahkan akun resmi beserta tautannya.',c:'Tambah akun'},
  form:[{k:'label',l:'Nama akun',req:1,ph:'cth: @tryoutku · Instagram'},{k:'platform',l:'Platform',type:'select',opts:['Instagram','TikTok','YouTube','X','Facebook','WhatsApp','Telegram']},{k:'url',l:'Tautan',req:1,ph:'https://'}]},
  /* Mirrors admin /(content)/streak-tasks: same enums, labels, validation, metrics + sortable table + drawer form. */
  'streak-tasks':{menu:'menu.streakTasks',hideActs:true,route:'/streak-tasks',perm:'streak-tasks.read',title:'Tugas Streak',cat:'content',qa:'Ubah tugas',view:'streak-tasks',
   sub:'Atur target, tampilan, dan aturan tugas yang ditampilkan ke siswa. Tarik handle untuk mengubah urutan tampil.',
   cols:['Tugas','Aturan','Reward','Monitoring','Status','Aksi'],filters:[],chips:['Semua'],
   rows:[
    {id:1,code:'quiz-harian-1',type:'quiz',status:'active',period:'daily',kind:'Kuis',title:'Kuis 3 soal harian',description:'Selesaikan kuis harian 3 soal untuk menjaga streak.',targetCount:1,rewardAmount:10,iconKey:'math',colorKey:'violet',iconUrl:null,iconAlt:'Ikon tugas kuis',sortOrder:0,isActive:true,config:{subjectId:1,ctaUrl:'/app/quest',ctaLabel:'Mulai',successMessage:'Mantap, task selesai!'},metric:{completedCount:1240,uniqueUsers:380,completedToday:42},st:['Aktif','green'],by:'Admin',chip:'Semua'},
    {id:2,code:'practice-session-1',type:'practice',status:'active',period:'daily',kind:'Latihan',title:'Selesaikan 1 sesi latihan',description:'Selesaikan 1 sesi latihan apa pun hari ini.',targetCount:1,rewardAmount:10,iconKey:'english',colorKey:'blue',iconUrl:null,iconAlt:'Ikon tugas latihan',sortOrder:1,isActive:true,config:{packageType:'drill',ctaUrl:'/app/latihan',ctaLabel:'Mulai',successMessage:'Latihan selesai, koin masuk!'},metric:{completedCount:980,uniqueUsers:310,completedToday:35},st:['Aktif','green'],by:'Admin',chip:'Semua'},
    {id:3,code:'tryout-mingguan-1',type:'tryout',status:'active',period:'weekly',kind:'Tryout',title:'Selesaikan 1 tryout minggu ini',description:'Selesaikan 1 paket tryout dengan nilai minimum 70.',targetCount:1,rewardAmount:15,iconKey:'indonesian',colorKey:'emerald',iconUrl:null,iconAlt:'Ikon tugas tryout',sortOrder:2,isActive:true,config:{packageType:'tryout',minScore:70,ctaUrl:'/app/try-outs',ctaLabel:'Mulai',successMessage:'Tryout selesai!'},metric:{completedCount:410,uniqueUsers:290,completedToday:8},st:['Aktif','green'],by:'Admin',chip:'Semua'},
    {id:4,code:'share-harian-1',type:'share',status:'paused',period:'daily',kind:'Share',title:'Bagikan progres harian',description:'Bagikan progres belajarmu ke media sosial.',targetCount:1,rewardAmount:5,iconKey:'coin',colorKey:'amber',iconUrl:null,iconAlt:'Ikon tugas share',sortOrder:3,isActive:false,config:{ctaUrl:'',ctaLabel:'',successMessage:'Terima kasih sudah berbagi!'},metric:{completedCount:260,uniqueUsers:180,completedToday:5},st:['Dijeda','amber'],by:'Admin',chip:'Semua'}],
   empty:{t:'Belum ada tugas streak',d:'Buat tugas pertama: kode, tipe, target, reward, dan aturan mainnya.',c:'Buat tugas'}},
  'content-areas':{menu:'menu.contentAreas',route:'/content-areas',perm:'taxonomy.read',title:'Bidang Materi',cat:'structure',qa:'Kelola materi',
  acts:[{l:'Detail',icn:P_EYE,do:'drawer'},{l:'Lihat materi',icn:'ti-tag',do:'go:topics'},{l:'Arsipkan',icn:P_ARCH,do:'toast:Bidang diarsipkan'}],
  sub:'Kelompok besar materi, misalnya TPS, Literasi, dan Saintek.',
  cols:['Nama','Isi','Status','Aksi'],filters:[],chips:['Semua'],
  rows:[
   {id:'CA-TPS',t:'TPS — Penalaran Umum (PU)',s:'128 soal · 14 materi · 6 unit blueprint',st:['Aktif','green'],by:'D. Mahesa'},
   {id:'CA-LIT',t:'Literasi Bahasa Indonesia',s:'96 soal · 10 materi · 4 unit',st:['Aktif','green'],by:'Sinta'},
   {id:'CA-FIS',t:'Fisika Saintek',s:'74 soal · 9 materi · 3 unit',st:['Nonaktif','gray'],by:'Sistem'}],
  empty:{t:'Belum ada bidang materi',d:'Buat bidang materi sebagai wadah materi dan unit blueprint.',c:'Buat bidang'},
  form:[{k:'name',l:'Nama bidang',req:1,ph:'cth: TPS — Penalaran Umum'},{k:'code',l:'Kode',req:1,ph:'cth: CA-TPS'}]},
  topics:{menu:'menu.topics',hideActs:true,route:'/topics',perm:'taxonomy.read',title:'Materi',cat:'structure',qa:'Gabungkan duplikat',
   sub:'Topik di dalam tiap kelompok materi. Topik kembar bisa digabung.',
   cols:['Materi','ContentArea','Status','Aksi'],filters:[{k:'ca',l:'Bidang',o:['Semua','TPS','Literasi','Fisika']}],chips:['Semua'],
  rows:[
   {id:'PU-14',t:'Penalaran Umum 14 — Kuantor',s:'TPS · 3 nama lain',st:['Aktif','green'],by:'D. Mahesa'},
   {id:'BI-07',t:'Literasi BI 07 — Teks argumen',s:'Literasi · 1 nama lain',st:['Aktif','green'],by:'Sinta'},
   {id:'FIS-03',t:'Gelombang berjalan',s:'Fisika · mirip 92% dengan FIS-02',st:['Aktif','green'],by:'Sistem'}],
  empty:{t:'Belum ada materi',d:'Materi mengelompokkan soal dalam satu bidang. Cek kemiripan sebelum menambah.',c:'Buat materi'},
  form:[{k:'name',l:'Nama materi',req:1,ph:'cth: Penalaran Umum 15 — Silogisme'},{k:'ca',l:'Bidang Materi',type:'select',opts:['TPS','Literasi','Fisika']}]},
 universitas:{menu:'menu.universitas',hideActs:true,route:'/universitas',perm:'universitas.read',title:'Universitas',cat:'structure',qa:'Lihat prodi',
  sub:'Daftar kampus negeri dan swasta per kota beserta prodinya. Ketuk untuk lihat prodi.',
  cols:['Nama','Lokasi','Status','Aksi'],filters:[{k:'jenis',l:'Jenis',o:['Semua','PTN','PTS']}],chips:['Semua'],
  rows:[
   {id:'UI',t:'Universitas Indonesia',s:'PTN · Depok · 48 prodi',st:['Aktif','green'],by:'Sistem'},
   {id:'UGM',t:'Universitas Gadjah Mada',s:'PTN · Yogyakarta · 52 prodi',st:['Aktif','green'],by:'Sistem'},
   {id:'TELU',t:'Universitas Telkom',s:'PTS · Bandung · 31 prodi',st:['Aktif','green'],by:'Raka'}],
  empty:{t:'Belum ada universitas',d:'Tambahkan kampus beserta logo, jenis, dan lokasi untuk referensi prodi.',c:'Tambah universitas'},
  form:[{k:'name',l:'Nama universitas',req:1,ph:'cth: Universitas Airlangga'},{k:'jenis',l:'Jenis',type:'select',opts:['PTN','PTS']},{k:'city',l:'Kota',ph:'cth: Surabaya'}]},
 'program-pendidikan':{menu:'menu.programPendidikan',hideActs:true,route:'/program-pendidikan',perm:'program-pendidikan.read',title:'Program Pendidikan',cat:'structure',qa:'Lihat prodi',
  sub:'Jenjang pendidikan: D3, D4, S1, S2 — terhubung ke tiap prodi.',
  cols:['Jenjang','Diperbarui','Status','Aksi'],filters:[],chips:['Semua'],
  rows:[
   {id:'S1',t:'Sarjana (S1)',s:'diperbarui bulan lalu · 120 prodi',st:['Aktif','green'],by:'Sistem'},
   {id:'D4',t:'Diploma 4',s:'diperbarui 2 bulan lalu · 34 prodi',st:['Aktif','green'],by:'Sistem'}],
  empty:{t:'Belum ada jenjang',d:'Jenjang menghubungkan program studi ke tingkat pendidikan.',c:'Tambah jenjang'}},
 'program-studi':{menu:'menu.programStudi',hideActs:true,route:'/program-studi',perm:'program-studi.read',title:'Program Studi',cat:'structure',qa:'Lihat passing grade',
  sub:'Jurusan beserta daya tampung dan passing grade tiap kampus.',
  cols:['Prodi','Info','Status','Aksi'],filters:[],chips:['Semua'],
  rows:[
   {id:'TI-UI',t:'Teknik Informatika — UI',s:'daya tampung 120 · PG 72,4',st:['Aktif','green'],by:'Sistem'},
   {id:'MAN-UGM',t:'Manajemen — UGM',s:'daya tampung 160 · PG 68,1',st:['Aktif','green'],by:'Sistem'}],
  empty:{t:'Belum ada prodi',d:'Tambahkan prodi dengan daya tampung dan passing grade acuan.',c:'Tambah prodi'},
  form:[{k:'name',l:'Nama prodi',req:1,ph:'cth: Ilmu Komputer — UGM'},{k:'quota',l:'Daya tampung',type:'number',ph:'120'}]},
 programs:{menu:'menu.programs',route:'/programs',perm:'program.read',title:'Program',cat:'structure',qa:'Lihat blueprint',
  acts:[{l:'Detail',icn:P_EYE,do:'drawer'},{l:'Lihat blueprint',icn:P_FILE,do:'go:blueprints'},{l:'Arsipkan',icn:P_ARCH,do:'toast:Program diarsipkan'}],
  sub:'Paket kurikulum berisi beberapa blueprint. Ketuk untuk lihat blueprint.',
  cols:['Program','Blueprint','Status','Aksi'],filters:[{k:'st',l:'Status',o:['Semua','Aktif','Diarsipkan']}],chips:['Semua','Aktif','Diarsipkan'],
  rows:[
   {id:'SNBT',t:'SNBT 2026 (SNBT)',s:'6 blueprint · TPS + Literasi + PK',st:['Aktif','green'],by:'D. Mahesa',chip:'Aktif'},
   {id:'TPS',t:'TPS Intensif (TPS)',s:'3 blueprint',st:['Aktif','green'],by:'R. Kartika',chip:'Aktif'},
   {id:'SKL-24',t:'Sekolah 2024 (arsip)',s:'2 blueprint',st:['Diarsipkan','gray'],by:'Sistem',chip:'Diarsipkan'}],
  empty:{t:'Belum ada program',d:'Program mengelompokkan blueprint dan asesmen dalam satu kurikulum.',c:'Buat program'},
  form:[{k:'name',l:'Nama program',req:1,ph:'cth: SNBT 2027'},{k:'code',l:'Kode',req:1,ph:'cth: SNBT-27'}]},
 blueprints:{menu:'menu.blueprints',route:'/blueprints',perm:'blueprint.read',title:'Blueprint',cat:'structure',qa:'Kunci versi',
  acts:[{l:'Detail',icn:P_EYE,do:'drawer'},{l:'Lihat versi',icn:'ti-git-branch',do:'go:blueprint-versions'},{l:'Publikasikan',icn:P_CHECK,do:'toast:Blueprint dipublikasikan'}],
  sub:'Rancangan sebaran soal per program. Kunci versinya kalau sudah siap dipakai.',
  cols:['Blueprint','Kesiapan','Status','Aksi'],filters:[{k:'st',l:'Kesiapan',o:['Semua','Siap digunakan','Perlu perhatian','Perlu pemeriksaan']}],chips:['Semua'],
  rows:[
   {id:'BP-SNBT-v4',t:'SNBT-2026 v4 · program SNBT',s:'kesiapan 82% · 2 unit belum dikunci',st:['Perlu perhatian','amber'],by:'D. Mahesa'},
   {id:'BP-TPS-v2',t:'TPS Intensif v2',s:'kesiapan 100% · Siap digunakan',st:['Siap digunakan','green'],by:'R. Kartika'},
   {id:'BP-SAIN-v1',t:'Saintek v1',s:'belum ada versi terbit',st:['Perlu pemeriksaan','red'],by:'Sistem'}],
  empty:{t:'Belum ada blueprint',d:'Blueprint memetakan unit, subtes, dan sebaran soal sebelum dipakai latihan.',c:'Buat blueprint'},
  form:[{k:'name',l:'Nama blueprint',req:1,ph:'cth: SNBT-2027 v1'},{k:'program',l:'Program',type:'select',opts:['SNBT 2026','TPS Intensif']}]},
 'blueprint-versions':{menu:'menu.blueprints',hideActs:true,route:'/blueprint-versions',perm:'blueprint.read',title:'Versi Blueprint',cat:'structure',qa:'Bandingkan versi',
  acts:[{l:'Detail',icn:P_EYE,do:'drawer'},{l:'Publikasikan',icn:P_CHECK,do:'toast:Versi diterbitkan'},{l:'Arsipkan',icn:P_ARCH,do:'toast:Versi diarsipkan'}],
  sub:'Riwayat perubahan blueprint. Bandingkan versi konsep, terbit, dan arsip.',
  cols:['Versi','Blueprint','Status','Aksi'],filters:[{k:'st',l:'Status',o:['Semua','Draft','Terbit','Diarsipkan']}],chips:['Semua','Draft','Terbit','Diarsipkan'],
  rows:[
   {id:'V-104',t:'v4 · SNBT-2026',s:'2 unit belum dikunci · kesiapan 82%',st:['Draft','amber'],by:'D. Mahesa',chip:'Draft'},
   {id:'V-103',t:'v3 · SNBT-2026',s:'dipakai TO Akbar 12 · 180 soal',st:['Terbit','green'],by:'R. Kartika',chip:'Terbit'},
   {id:'V-099',t:'v2 · TPS Intensif',s:'digantikan v3 · arsip, hanya lihat',st:['Diarsipkan','gray'],by:'Sistem',chip:'Diarsipkan'}],
  empty:{t:'Belum ada versi',d:'Setiap perubahan blueprint tersimpan sebagai versi yang bisa dibandingkan.',c:'Buat versi'}},
 drills:{menu:'menu.drill',route:'/drills',perm:'drill.read',title:'Latihan',cat:'assess',qa:'Lihat daftar soal',
  acts:[{l:'Detail',icn:P_EYE,do:'drawer'},{l:'Kelola unit',icn:P_GRID,do:'dtab:unit'},{l:'Publikasikan',icn:P_CHECK,do:'toast:Latihan dipublikasikan'}],
   sub:'Paket latihan dari blueprint yang sudah siap. Ketuk untuk lihat pool soal.',
   cols:['Latihan','Kesiapan','Status','Aksi'],filters:[{k:'st',l:'Status',o:['Semua','Siap','Perlu perbaikan','Draft']}],chips:['Semua','Siap','Perlu perbaikan','Draft'],
  rows:[
   {id:'DR-PU',t:'Latihan PU-14 (24 paket)',s:'blueprint v4 aktif · 240 soal siap',st:['Siap','green'],by:'Tim Soal',chip:'Siap'},
   {id:'DR-FIS',t:'Latihan Fisika Gelombang',s:'2 topik belum ada soal sulit',st:['Perlu perbaikan','amber'],by:'Tim Soal',chip:'Perlu perbaikan'},
   {id:'DR-NEW',t:'Latihan draft baru',s:'belum pilih versi blueprint',st:['Draft','gray'],by:'D. Mahesa',chip:'Draft'}],
  empty:{t:'Belum ada latihan',d:'Latihan mengambil pool soal dari versi blueprint yang sudah siap.',c:'Buat latihan'},
  form:[{k:'name',l:'Nama latihan',req:1,ph:'cth: Latihan PK-05'},{k:'program',l:'Program',type:'select',opts:['SNBT 2026','TPS Intensif']}]},
 tryouts:{menu:'menu.tryouts',hideActs:true,route:'/tryouts',perm:'tryout.read',title:'Try Out',cat:'assess',qa:'Publikasikan',
  acts:[{l:'Detail',icn:P_EYE,do:'drawer'},{l:'Publikasikan',icn:P_CHECK,do:'toast:Try out dipublikasikan'},{l:'Duplikat',icn:P_COPY,do:'toast:Try out diduplikat sebagai Draft'}],
  sub:'Ujian bersama: paket soal, jadwal, dan jumlah peserta. Ketuk untuk detail.',
  cols:['Try Out','Jadwal / Peserta','Status','Aksi'],filters:[{k:'st',l:'Status',o:['Semua','Draft','Dipublikasikan','Diarsipkan']}],chips:['Semua','Dipublikasikan','Draft','Diarsipkan'],
  rows:[
   {id:'TO-12',t:'TO Akbar 12 · SNBT · 180 soal',s:'s/d 2 hari lagi · 1.842 peserta · kesiapan Siap',st:['Dipublikasikan','green'],by:'Tim Soal',chip:'Dipublikasikan'},
   {id:'TO-08',t:'TO Mini TPS-08 · 60 soal',s:'live · 412 peserta',st:['Dipublikasikan','green'],by:'Tim Soal',chip:'Dipublikasikan'},
   {id:'TO-04',t:'TO Saintek 04 (draft)',s:'blueprint v4 · 40% soal terpetakan',st:['Draft','amber'],by:'D. Mahesa',chip:'Draft'}],
  empty:{t:'Belum ada try out',d:'Susun try out dari blueprint: paket soal, jadwal, lalu publikasikan.',c:'Buat try out'},
  form:[{k:'title',l:'Judul try out',req:1,ph:'cth: TO Akbar 13'},{k:'program',l:'Program',type:'select',opts:['SNBT 2026','TPS Intensif']},{k:'n',l:'Jumlah soal',type:'number',ph:'180'}]},
 grading:{menu:'— (essay.grade)',hideActs:true,route:'/grading',perm:'essay.grade',title:'Penilaian Esai',cat:'queue',qa:'Nilai sekarang',
  sub:'Jawaban esai menunggu nilai. Beri skor 0–100 beserta masukan untuk pelajar.',
  cols:['Jawaban','Konteks','Status','Aksi'],filters:[{k:'st',l:'Status',o:['Semua','Menunggu','Dinilai']}],chips:['Semua','Menunggu','Dinilai'],
  rows:[
   {id:'E-5512',t:'Esai Ekonomi · 320 kata',s:'TO Akbar 12 · jawaban A-991 · dikirim 2 hari lalu',st:['Menunggu','amber'],by:'Belum dinilai',chip:'Menunggu'},
   {id:'E-5510',t:'Esai Ekonomi · 280 kata',s:'TO Akbar 12 · jawaban A-988',st:['Menunggu','amber'],by:'Belum dinilai',chip:'Menunggu'},
   {id:'E-5498',t:'Esai Sejarah · skor 85',s:'Latihan 09 · oleh R. Kartika',st:['Dinilai','green'],by:'R. Kartika',chip:'Dinilai'}],
  empty:{t:'Antrian kosong',d:'Semua jawaban esai sudah dinilai. Jawaban baru akan muncul di sini.',c:'Muat ulang'}},
 'audit-logs':{menu:'menu.auditLogs',hideActs:true,route:'/audit-logs',perm:'audit-logs.read',title:'Log Aktivitas',cat:'system',qa:'Export',
  acts:[{l:'Detail',icn:P_EYE,do:'drawer'},{l:'Salin ID',icn:P_COPY,do:'toast:ID disalin'}],
  sub:'Catatan siapa melakukan apa dan kapan. Hanya bisa dilihat, tersimpan 30 hari.',
  cols:['Waktu','Pengguna','Aksi','Bagian','ID','Detail'],
  colDefs:[
   {label:'Waktu',sort:null,html:function(d){return '<div class="cell-t">'+esc(d.when||'—')+'</div>';}},
   {label:'Pengguna',sort:null,html:function(d){return '<div class="cell-t" style="font-weight:500">'+esc(d.by)+'</div>';}},
   {label:'Aksi',sort:null,html:function(d){return '<span class="status '+d.st[1]+'">'+esc(d.st[0])+'</span>';}},
   {label:'Bagian',sort:null,html:function(d){return '<span class="cell-s">'+esc(d.ent||'—')+'</span>';}},
   {label:'ID',sort:null,html:function(d){return '<span class="cell-s">'+esc(d.id)+'</span>';}},
   {label:'Detail',sort:null,html:function(d){return '<span class="cell-s">'+esc(d.s)+'</span>';}}
  ],
  filters:[{k:'ent',l:'Data',o:['Semua','Try Out','Soal','Peran','Undangan']}],chips:['Semua'],
  rows:[
   {id:'A-991',t:'TO-12 dipublikasikan',s:'oleh Admin · hari ini · 128 catatan',st:['Terbit','blue'],by:'Admin',ent:'Try Out',when:'1 Okt, 09:12'},
   {id:'A-990',t:'Akses Marketing diubah',s:'kemarin · boleh buka Media',st:['Diubah','amber'],by:'Admin',ent:'Peran',when:'30 Sep, 16:40'},
   {id:'A-989',t:'Laporan SR-2091 otomatis',s:'kunci jawaban ganda',st:['Dibuat','gray'],by:'Sistem',ent:'Soal',when:'30 Sep, 08:03'}],
  empty:{t:'Belum ada aktivitas',d:'Setiap aksi penting tercatat di sini dan disimpan 30 hari.',c:'Muat ulang'}},
 feedbacks:{menu:'menu.feedbacks',hideActs:true,route:'/feedbacks',perm:'feedbacks.read',title:'Masukan',cat:'queue',qa:'Ubah status',
  acts:[{l:'Detail',icn:P_EYE,do:'drawer'},{l:'Ubah status',icn:P_CHECK,do:'drawer'},{l:'Hapus',icn:P_TRASH,do:'confirm:Hapus masukan ini?|Masukan diarsipkan.|Masukan dihapus'}],
  sub:'Saran dan kendala dari pelajar. Tandai statusnya, bisa banyak sekaligus.',
  cols:['Masukan','Pengguna','Status','Aksi'],filters:[{k:'st',l:'Status',o:['Semua','Menunggu','Ditinjau','Selesai','Ditutup']}],chips:['Semua','Menunggu','Ditinjau','Selesai','Ditutup'],
  rows:[
   {id:'FB-301',t:'Timer macet saat tab sleep',s:'kendala · Chrome Android · percobaan A-977',st:['Ditinjau','amber'],by:'Bagas R.',chip:'Ditinjau'},
   {id:'FB-298',t:'Minta pembahasan video per subtes',s:'masukan · XII · SMAN 1',st:['Menunggu','blue'],by:'Nadia P.',chip:'Menunggu'}],
  empty:{t:'Tidak ada masukan',d:'Masukan dan bug dari pelajar akan masuk ke antrian ini.',c:'Muat ulang'}},
 'question-reports':{menu:'menu.questionReports',route:'/question-reports',perm:'question-reports.manage',title:'Laporan Soal',cat:'queue',qa:'Tandai ditinjau',
  acts:[{l:'Detail',icn:P_EYE,do:'drawer'},{l:'Ubah status',icn:P_CHECK,do:'drawer'},{l:'Lihat soal',icn:P_BOOK,do:'go:questions'}],
  sub:'Laporan soal bermasalah dari pelajar, misalnya kunci ganda. Proses banyak sekaligus.',
  cols:['Soal','Alasan','Status','Aksi'],filters:[{k:'st',l:'Status',o:['Semua','Menunggu','Ditinjau','Selesai','Ditolak']}],chips:['Semua','Menunggu','Ditinjau','Selesai','Ditolak'],
  rows:[
   {id:'SR-2091',t:'SOAL-8790 v2 — kunci ganda B & D',s:'Jawaban salah · dari Nadia P.',st:['Menunggu','red'],by:'Nadia P.',chip:'Menunggu'},
   {id:'SR-2088',t:'SOAL-8774 v1 — gambar tidak tampil',s:'Gambar bermasalah · Fisika',st:['Ditinjau','amber'],by:'Bagas R.',chip:'Ditinjau'},
   {id:'SR-2079',t:'SOAL-8701 v3 — label sulit salah',s:'Kurang jelas · 78% salah · PK',st:['Selesai','green'],by:'R. Kartika',chip:'Selesai'}],
  empty:{t:'Tidak ada laporan',d:'Laporan kunci salah atau gambar rusak dari pelajar muncul di sini.',c:'Muat ulang'}},
 testimonials:{menu:'menu.feedbacks',hideActs:true,route:'/testimonials',perm:'feedbacks.read',title:'Testimoni',cat:'content',qa:'Terbitkan',
  acts:[{l:'Detail',icn:P_EYE,do:'drawer'},{l:'Terbitkan',icn:P_CHECK,do:'toast:Testimoni diterbitkan'},{l:'Hapus',icn:P_TRASH,do:'confirm:Hapus testimoni ini?|Testimoni diarsipkan.|Testimoni dihapus'}],
  sub:'Cerita lolos dari pelajar. Periksa, sunting bahasa, lalu terbitkan.',
  cols:['Testimoni','Rating','Status','Aksi'],filters:[{k:'st',l:'Status',o:['Semua','Terbit','Draft']}],chips:['Semua','Terbit','Draft'],
  rows:[
   {id:'T-88',t:'Nadia — lolos SNBT UI',s:'5/5 · hasil: lolos TI UI · 42 terbantu · terverifikasi',st:['Terbit','green'],by:'Nadia P.',chip:'Terbit'},
   {id:'T-91',t:'Bagas — naik 120 poin TPS',s:'5/5 · menunggu verifikasi',st:['Draft','amber'],by:'Bagas R.',chip:'Draft'}],
  empty:{t:'Belum ada testimoni',d:'Kurasi cerita lolos pelajar: verifikasi, sunting bahasa, lalu terbitkan.',c:'Muat ulang'}},
  notifications:{menu:'—',route:'/notifications',perm:'—',title:'Notifikasi',cat:'system',qa:'Tandai dibaca',view:'notifications',
   acts:[{l:'Detail',icn:P_EYE,do:'drawer'},{l:'Tandai dibaca',icn:P_CHECK,do:'toast:Ditandai sudah dibaca'}],
   sub:'Pusat notifikasi untuk tim dan pelajar. Buat baru, lalu tandai yang sudah dibaca.',
   cols:['Judul','Tipe','Status','Aksi'],filters:[],chips:['Semua','Belum dibaca','Sudah dibaca'],
   rows:[
    {id:'N-1',t:'TO Akbar 12 dibuka',s:'Untuk semua pelajar',st:['Belum dibaca','blue'],by:'Raka',chip:'Belum dibaca',type:'Berhasil',team:'Marketing',msg:'TO Akbar 12 dibuka untuk semua pelajar.',time:'1 Okt, 08:00',link:null,read:false},
     {id:'N-3',t:'Iklan IG Feed diperpanjang',s:'Tayang sampai 8 Okt',st:['Belum dibaca','blue'],by:'Raka',chip:'Belum dibaca',type:'Info',team:'Marketing',msg:'Iklan IG Feed TO Akbar diperpanjang sampai 8 Okt di sidebar beranda.',time:'1 Okt, 07:45',link:'ads',read:false},
    {id:'N-2',t:'Perawatan rutin malam ini',s:'02:00–03:00 · aplikasi web',st:['Sudah dibaca','gray'],by:'Admin',chip:'Sudah dibaca',type:'Peringatan',team:'Admin',msg:'Perawatan rutin 02:00–03:00. Aplikasi web tidak bisa diakses.',time:'30 Sep, 17:20',link:null,read:true}],
  empty:{t:'Belum ada notifikasi',d:'Notifikasi dan peringatan sistem akan tercatat di sini.',c:'Buat notifikasi'},
  form:[{k:'title',l:'Judul',req:1,ph:'cth: TO Akbar 13 dibuka'},{k:'message',l:'Pesan',type:'textarea',req:1,ph:'Tulis pesan singkat…'},{k:'type',l:'Tipe',type:'select',opts:['Info','Berhasil','Peringatan','Penting']}]},
 settings:{menu:'—',route:'/settings',perm:'—',title:'Pengaturan',cat:'custom',qa:'Simpan',
  sub:'Tampilan · Notifikasi · Pasang aplikasi · Data · Kembalikan bawaan.',
  cols:[],filters:[],chips:['Semua'],rows:[]},
 profile:{menu:'—',route:'/profile',perm:'—',title:'Profil',cat:'custom',qa:'Ubah profil',
  sub:'Data diri, kontak, dan halaman yang boleh dibuka.',
  cols:[],filters:[],chips:['Semua'],rows:[]}
};
function GENERIC(t,s){return {title:t,sub:s||'Halaman',cat:'system',cols:['Kolom A','Kolom B','Status','Info'],filters:[],chips:['Semua'],rows:[{id:'D-1',t:'Baris 1',s:'—',st:['Baru','blue'],by:'Tim'}]};}

/* Roles: persona filter over REAL menus (fakes removed). Marketing scope = real growth menus. */
var ROLES={
 soal:{label:'Tim Soal',color:'#1D4ED8',key:'1',tagline:'Bank soal, blueprint, tryout, latihan, laporan & esai. Media hanya baca.',
  hide:'Menyembunyikan Pengguna, Iklan, Testimoni, Peran & Log.',
  kpis:[
   {l:'Soal aktif',v:'8.412',d:'+126 minggu ini',c:'up',s:'12 perlu review · 9 dilapor',go:'questions'},
   {l:'Blueprint siap',v:'14/18',d:'78%',c:'flat',s:'4 revisi bobot · v4 82%',go:'blueprints'},
   {l:'Peserta aktif',v:'2.254',d:'+18%',c:'up',s:'3 tryout berjalan',go:'tryouts'},
   {l:'Butuh tindakan',v:'51',d:'prioritas',c:'down',s:'9 laporan + 42 esai',go:'grading'}],
  heroes:[['Buat tryout','Buat tryout dari blueprint siap','tryouts','',0],['Buat soal','Soal baru + gambar + kunci','questions','primary',1]]},
   marketing:{label:'Tim Marketing',color:'#B45309',key:'2',tagline:'Iklan, medsos & notifikasi. Tanpa ubah soal dan data user.',
   hide:'Menyembunyikan Bank Soal, Struktur Ujian, Pengguna, Peran & Log.',
   kpis:[
    {l:'Iklan tayang',v:'2',d:'2 tayang',c:'up',s:'1 menunggu · sidebar beranda',go:'ads'},
    {l:'Akun medsos',v:'3',d:'2 aktif',c:'flat',s:'1 nonaktif · perlu perbarui',go:'social-media'},
    {l:'Notifikasi',v:'2',d:'2 belum dibaca',c:'flat',s:'1 peringatan · 1 info',go:'notifications'}],
  heroes:[['Tambah tautan','Akun + status tampil','social-media','',1],['Tambah iklan','Materi + jadwal tayang','ads','primary',1]]},
 user:{label:'Tim User',color:'#15803D',key:'3',tagline:'Pengguna, pelajar & undangan. Tanpa ubah soal & iklan.',
  hide:'Menyembunyikan Bank Soal, Struktur Ujian, Iklan & Sistem.',
  kpis:[
   {l:'Pengguna',v:'12.480',d:'+312',c:'up',s:'9.840 pelajar aktif',go:'users'},
   {l:'Undangan menunggu',v:'24',d:'8 kedaluwarsa < 3 hari',c:'flat',s:'diterima 68%',go:'invitations'},
   {l:'Baru hari ini',v:'87',d:'+12%',c:'up',s:'94% verifikasi otomatis',go:'data-pelajar'},
   {l:'Perlu follow-up',v:'12',d:'WA belum terverifikasi',c:'flat',s:'kirim pengingat manual',go:'data-pelajar'}],
   heroes:[['Export data','File Excel pengguna','users','',0],['Undang','Lewat email + kursi','invitations','primary',1]]},
 admin:{label:'Admin',color:'#0F172A',key:'4',tagline:'Pengguna, akademik, media & monitoring. Kelola peran, izin & log.',
  hide:'Semua menu tampil. Pengaturan & Profil berlaku untuk semua peran.',
  kpis:[
   {l:'Pengguna',v:'12.480',d:'+312',c:'up',s:'9.840 pelajar aktif',go:'users'},
   {l:'Total soal',v:'8.412',d:'+126',c:'up',s:'18 blueprint · 3 tryout live',go:'questions'},
   {l:'Role aktif',v:'4',d:'26 izin',c:'flat',s:'terakhir diubah kemarin',go:'roles'},
   {l:'Log hari ini',v:'128',d:'0 masalah',c:'up',s:'disimpan 30 hari',go:'audit-logs'}],
  heroes:[['Lihat aktivitas','128 event hari ini','audit-logs','',0],['Undang tim','Email + peran awal','invitations','primary',1]]}
};
var ROLE_ORDER=['soal','marketing','user','admin'];
var QUICK={
 soal:[['plus','Buat soal','Soal baru + gambar','#1D4ED8','questions',1],['grid','Cek kesiapan','Kesiapan 82%','#0E7490','blueprints',0],['check','Nilai esai','42 menunggu','#B45309','grading',0]],
  marketing:[['plus','Buat iklan','2 tayang · 1 menunggu','#B45309','ads',1],['bell','Notifikasi','2 belum dibaca','#1D4ED8','notifications',1],['share','Kelola medsos','3 akun · 2 aktif','#1D4ED8','social-media',0]],
 user:[['plus','Undang','Lewat email + kursi','#15803D','invitations',1],['shield','Verifikasi','5 perlu manual','#B45309','data-pelajar',0],['mail','Pengingat','8 segera berakhir','#1D4ED8','invitations',0]],
 admin:[['shield','Kelola peran','4 peran · siapa boleh buka apa','#0F172A','roles',0],['file','Aktivitas hari ini','128 catatan · 0 keanehan','#1D4ED8','audit-logs',0],['gear','Pengaturan','Tema · notif · data','#15803D','settings',0]]
};
/* Activity feed rows: [initials, title, meta, legacyColor, actorName].
   The 4th slot is kept for backwards-compat but unused — person avatars are
   neutral now, so identity comes from initials + actorName. */
var ACTS={
 soal:[['RK','R. Kartika menilai 18 esai','TO Akbar 12 · 20 mnt lalu',null,'R. Kartika'],['SY','SR-2091 dibuat otomatis','kunci ganda · 1 jam lalu',null,'Sinta'],['DM','Blueprint v4 lock 82%','3 jam lalu',null,'D. Mahesa']],
  marketing:[['RK','Iklan IG Feed ditayangkan','Sidebar beranda · 1–8 Okt',null,'R. Kartika'],['SY','Tautan bio diperbarui','tryoutku.id/link · 2 jam lalu',null,'Sinta'],['RK','Draf iklan disiapkan','Menunggu jadwal · sidebar beranda',null,'R. Kartika']],
 user:[['SY','87 pelajar terverifikasi otomatis','94% · hari ini',null,'Sinta'],['TU','SMKN 2 Solo terima undangan','200 kursi',null,'Tim User'],['TU','12 pendaftar belum verifikasi WA','kirim pengingat',null,'Tim User']],
 admin:[['SA','Marketing boleh buka Media','kemarin',null,'Sistem'],['SY','Salinan data 02:00 berhasil','disimpan 30 hari',null,'Sinta'],['SY','128 aktivitas tercatat','0 anomali',null,'Sistem']]
};
/* One renderer for every activity list so no screen drifts. */
function actRow(a){
 var who=a[4]?a[4]+' · ':'';
 return '<div class="ev"><span class="ev-ava" aria-hidden="true">'+esc(a[0])+'</span>'
  +'<div class="et"><div class="et-t">'+esc(a[1])+'</div><time>'+esc(who+a[2])+'</time></div></div>';
}
/* Notifications: real shape (title/message/type/isRead/link). Dropdown disaring per peran agar marketing hanya lihat yang bisa dibuka. */
var NOTIFS=[
 {id:'N-1',t:'42 esai menunggu — tertua 2 hari',s:'TO Akbar 12 · antre nilai',c:'#B45309',type:'Peringatan',link:'grading',read:false},
  {id:'N-2',t:'Tautan grup WA nonaktif',s:'Perbarui undangan · tautan resmi',c:'#15803D',type:'Peringatan',link:'social-media',read:false},
 {id:'N-3',t:'SMKN 2 Solo terima undangan',s:'200 kursi · via Tim User',c:'#1D4ED8',type:'Berhasil',link:'invitations',read:false},
 {id:'N-4',t:'Salinan data 02:00 berhasil',s:'disimpan 30 hari · 0 keanehan',c:'#16A34A',type:'Berhasil',link:'audit-logs',read:true}
];
function notifVisible(n){if(!n.link)return true;if(ACCESS[state.role]==='*')return true;return ACCESS[state.role].indexOf(n.link)>=0||n.link==='notifications'||n.link==='dashboard';}
function visibleNotifs(){return NOTIFS.filter(notifVisible);}
/* Dashboard chart data (mirrors dashboard.service: 7-day activity + registrations + devices + referrals). */
var DASH={
 soal:{act:[42,55,48,70,66,80,74],reg:[12,18,15,22,20,28,25],dev:[['Android',58],['Desktop',32],['iOS',10]],ref:[['Organik',312],['Teman',208],['Sekolah',140]]},
  marketing:{act:[2,2,2,2,2,3,2],reg:[30,44,40,52,48,60,57],dev:[['Android',62],['Desktop',26],['iOS',12]],ref:[['Tayang',2],['Menunggu',1],['Selesai',0]]},
 user:{act:[60,72,66,84,80,95,87],reg:[60,72,66,84,80,95,87],dev:[['Android',71],['Desktop',19],['iOS',10]],ref:[['Sekolah',480],['Organik',260],['Teman',190]]},
 admin:{act:[120,150,135,170,160,190,184],reg:[90,110,100,128,120,142,135],dev:[['Android',64],['Desktop',27],['iOS',9]],ref:[['Organik',312],['Sekolah',284],['Teman',208],['Iklan',196]]}
};
/* State */
var state={role:store.get('na3-role')||'soal',page:null,qsub:null,qtop:null,q:'',sort:null,sortKey:null,
 pg:1,theme:store.get('na3-theme')||'light',loading:false,sel:{},tab:'ringkas',palIdx:0,range:'7',streakDays:30,flt:[]};
var PG_SIZE=6;
function fkey(){return 'na3-f-'+state.role+'-'+(state.page||defPage());}
function saveFilters(){store.set(fkey(),JSON.stringify({flt:state.flt,q:state.q,sort:state.sort,sortKey:state.sortKey,pg:state.pg}));}
function loadFilters(){try{var s=store.get(fkey());if(!s)return;var o=JSON.parse(s);state.flt=o.flt||[];state.q=o.q||'';state.sort=o.sort||null;state.sortKey=o.sortKey||null;state.pg=o.pg||1;}catch(_){}}
function clearFilters(){store.clearPref('na3-f-');}
document.documentElement.dataset.theme=state.theme;
if(store.get('na3-collapsed')==='1')document.body.classList.add('collapsed');
function $(s){return document.querySelector(s);}
function esc(s){return String(s==null?'':s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
var AV=['#1D4ED8','#16A34A','#B45309','#7E22CE','#0E7490','#BE123C'];
function ava(n,i){var c=AV[((i||0)+String(n).length)%AV.length];var s=String(n).split(' ').map(function(w){return w[0];}).join('').slice(0,2).toUpperCase();return '<span class="who-ava" style="background:'+c+'">'+esc(s)+'</span>';}
var TEAM_NAMES=['Raka','D. Mahesa','Sinta','R. Kartika','Admin','Sistem'];
function userGo(name){return TEAM_NAMES.indexOf(name)>=0?'users':'data-pelajar';}
function byAvatar(by,i){if(!by)return '';return '<button class="ava-btn" data-ugo="'+esc(by)+'" title="'+esc(by)+'" aria-label="Lihat data '+esc(by)+'">'+ava(by,i||0)+'</button>';}
function toast(m,s2,kind,action){
 var el=document.createElement('div');el.className='toast-item'+(kind==='err'?' err':'');
 el.innerHTML=ic(kind==='err'?P_ALERT:P_CHECK,16)+'<span>'+esc(m)+(s2?'<br><span style="opacity:.65">'+esc(s2)+'</span>':'')+'</span>'+(action?'<button class="tact">'+esc(action.label)+'</button>':'');
 if(action)el.querySelector('.tact').onclick=function(){action.fn();el.remove();};
 $('#toast').appendChild(el);
 setTimeout(function(){el.style.opacity='0';setTimeout(function(){el.remove();},300);},action?4200:2600);
}
function defPage(){return 'dashboard';}
function featOf(page){if(page==='dashboard')return F['dash-'+state.role]||F['dash-admin'];return F[page]||GENERIC(page,'Halaman');}
function saveLast(){try{store.set('na3-last',state.role+'|'+(state.page||defPage()));}catch(_){}}
function setRole(r,silent){if(!ROLES[r])return;state.role=r;state.page=null;state.qsub=null;state.qtop=null;state.flt=[];state.q='';state.sort=null;state.sortKey=null;state.pg=1;state.sel={};state.tab='ringkas';loadFilters();store.set('na3-role',r);saveLast();if(!silent)window.scrollTo(0,0);load(function(){if(!silent)toast('Beralih ke '+ROLES[r].label,ROLES[r].hide);});}
function go(p){state.page=(p==='dashboard'?'dashboard':p);state.qsub=null;state.qtop=null;state.flt=[];state.q='';state.sort=null;state.sortKey=null;state.pg=1;state.sel={};state.tab='ringkas';loadFilters();saveLast();window.scrollTo(0,0);load();}
function load(done){state.loading=true;render(true);clearTimeout(load.t);load.t=setTimeout(function(){state.loading=false;render(false);if(done)done();},220);}
function cycle(){setRole(ROLE_ORDER[(ROLE_ORDER.indexOf(state.role)+1)%ROLE_ORDER.length]);}
function fic(cls,s){return '<i class="ti-f '+cls+'"'+(s?' style="font-size:'+s+'px"':'')+'></i>';}
function roleIcon(k){return k==='admin'?'ti-f-shield':k==='user'?'ti-f-user':k==='soal'?'ti-f-book':'ti-f-adc';}
function rolesFor(page){var names={soal:'Tim Soal',marketing:'Tim Marketing',user:'Tim User'};var out=[];['soal','marketing','user'].forEach(function(r){if(ACCESS[r].indexOf(page)>=0)out.push(names[r]);});out.push('Admin');return out.join(', ');}

function renderSidebar(){
 var r=ROLES[state.role];var h='';
 h+='<div class="ctx"><button id="roleBtn" aria-haspopup="listbox" aria-expanded="false"><span class="ctx-ic" style="background:'+r.color+'">'+fic(roleIcon(state.role),15)+'</span><span class="ctx-lbl">'+r.label+'</span><span class="chev">'+ic(P_CHEV,16)+'</span></button><div class="ctx-pop" id="rolePop" role="listbox">'+ROLE_ORDER.map(function(k,ix){return '<button role="option" aria-selected="'+(k===state.role)+'" data-pick="'+k+'" class="'+(k===state.role?'on':'')+'"><span class="ctx-ic" style="background:'+ROLES[k].color+'">'+fic(roleIcon(k),15)+'</span><span><b>'+ROLES[k].label+'</b><small>Tekan '+(ix+1)+'</small></span>'+(k===state.role?'<span class="tickok">'+ic(P_CHECK,15)+'</span>':'')+'</button>';}).join('')+'</div></div><nav class="nav" aria-label="Menu peran">';
 navVisible(state.role).forEach(function(gr){
  h+='<div class="nav-title">'+esc(gr.g)+'</div>';
  gr.items.forEach(function(it){
   if(it.items){it.items.forEach(function(c){h+=navBtn(c,true);});}
   else h+=navBtn(it,false);
  });
 });
 h+='</nav><div class="sb-foot"><div class="sb-user"><button id="userBtn" aria-haspopup="true"><span class="ava sm">AD</span><span class="uinfo"><b>Admin</b><small>'+r.label+'</small></span>'+ic(P_CHEV,15)+'</button><div class="user-pop" id="userPop"><button data-userset>'+ic(P_GEAR,17)+'<span>Pengaturan</span></button><button data-userprof>'+ic('ti-user',17)+'<span>Profil</span></button></div></div><button class="logout-btn" id="logoutBtn" aria-label="Keluar"></button></div>';
 $('#sidebar').innerHTML=h;
 $('#sidebar').querySelectorAll('[data-nav]').forEach(function(b){b.onclick=function(){go(b.getAttribute('data-nav'));$('#sidebar').classList.remove('open');$('#overlayM').classList.remove('show');};});
 var rb=$('#roleBtn'),rp=$('#rolePop');
 rb.onclick=function(e){e.stopPropagation();var o=rp.classList.toggle('show');rb.setAttribute('aria-expanded',o);};
 rp.querySelectorAll('[data-pick]').forEach(function(b){b.onclick=function(e){e.stopPropagation();rp.classList.remove('show');setRole(b.getAttribute('data-pick'));};});
 var ub=$('#userBtn'),up=$('#userPop');
 ub.onclick=function(e){e.stopPropagation();up.classList.toggle('show');};
 up.querySelector('[data-userset]').onclick=function(e){e.stopPropagation();up.classList.remove('show');go('settings');$('#sidebar').classList.remove('open');$('#overlayM').classList.remove('show');};
 up.querySelector('[data-userprof]').onclick=function(e){e.stopPropagation();up.classList.remove('show');go('profile');$('#sidebar').classList.remove('open');$('#overlayM').classList.remove('show');};
 $('#logoutBtn').onclick=function(){clearFilters();$('#logoutRole').textContent=ROLES[state.role].label;$('#logoutOv').classList.add('show');};
}
function navBtn(it,sub){
 var cur=(state.page||defPage())===it.k||(it.k==='dashboard'&&(state.page===null||state.page==='dashboard'));
 var bdg=it.dot?'<span class="bdg dot '+(it.cls||'')+'" title="Ada baru"></span>':(it.badge?'<span class="bdg '+(it.cls||'')+'">'+it.badge+'</span>':'');
  return '<button class="ni'+(sub?' sub':'')+(cur?' active':'')+'" data-nav="'+it.k+'" title="'+esc(it.t)+'"'+(cur?' aria-current="page"':'')+'>'+ic(it.icn||'ti-dots',sub?18:20)+'<span class="lbl">'+esc(it.t)+'</span>'+bdg+'</button>';
}
function groupOf(page){
 var groups=navVisible(state.role);
 for(var gi=0;gi<groups.length;gi++){var gr=groups[gi];
  for(var ii=0;ii<gr.items.length;ii++){var it=gr.items[ii];
   if(it.k===page)return {g:gr.g,item:it};
   if(it.items)for(var ci=0;ci<it.items.length;ci++)if(it.items[ci].k===page)return {g:gr.g,item:it.items[ci]};
   }}
 if(page==='settings')return {g:'Sistem',item:{t:'Pengaturan',icn:'ti-settings'}};
 return {g:'Beranda',item:{t:'Dashboard'}};
}
function renderCrumbs(){
 var page=state.page||defPage();var t=featOf(page);
 var isDash=(page==='dashboard');var g=groupOf(page==='dashboard'?'dashboard':page);
 var label=isDash?'Dashboard':t.title;
 var h='<button data-crumb="home"><span>Admin</span></button><span class="sep">'+ic(P_CHR,14)+'</span>';
 if(isDash)h+='<span class="cur">'+ic('ti-layout-dashboard',15)+'<span>'+esc(label)+'</span></span>';
 else{
  h+='<button data-crumb="group">'+esc(g.g)+'</button><span class="sep">'+ic(P_CHR,14)+'</span>';
  if(page==='questions'){
   var qs=state.qsub?qSub(state.qsub):null;
   if(!qs)h+='<span class="cur">'+ic((g.item&&g.item.icn)||'ti-dots',15)+'<span>'+esc(label)+'</span></span>';
   else{
    label=qs.name;
    h+='<button data-crumb="qs">'+ic((g.item&&g.item.icn)||'ti-dots',15)+'<span>'+esc(t.title)+'</span></button><span class="sep">'+ic(P_CHR,14)+'</span>';
    var qm=state.qtop?qTop(state.qtop):null;
    if(!qm)h+='<span class="cur"><span>'+esc(qs.name)+'</span></span>';
    else{label=qm.name;h+='<button data-crumb="qsub">'+esc(qs.name)+'</button><span class="sep">'+ic(P_CHR,14)+'</span><span class="cur"><span>'+esc(qm.name)+'</span></span>';}
   }
  }
  else h+='<span class="cur">'+ic((g.item&&g.item.icn)||'ti-dots',15)+'<span>'+esc(label)+'</span></span>';
 }
 var c=$('#crumbs');c.innerHTML=h;document.title=label+' · '+ROLES[state.role].label+' · Tryoutku Admin';
 c.querySelector('[data-crumb="home"]').onclick=function(){go('dashboard');};
 var gb=c.querySelector('[data-crumb="group"]');if(gb)gb.onclick=function(){go('dashboard');};
 var qsb=c.querySelector('[data-crumb="qs"]');if(qsb)qsb.onclick=function(){state.qsub=null;state.qtop=null;state.flt=[];state.q='';state.pg=1;saveFilters();window.scrollTo(0,0);load();};
 var qmb=c.querySelector('[data-crumb="qsub"]');if(qmb)qmb.onclick=function(){state.qtop=null;state.flt=[];state.q='';state.pg=1;saveFilters();window.scrollTo(0,0);load();};
}
function syncChrome(){
 var collapsed=document.body.classList.contains('collapsed');
 var mobile=window.innerWidth<=860;
 var open=mobile?$('#sidebar').classList.contains('open'):!collapsed;
 var mb=$('#menuBtn');if(mb){mb.innerHTML=ic(open?P_COLLAPSE:P_EXPAND,22);mb.setAttribute('aria-label',open?'Ciutkan navigasi':'Bentangkan navigasi');}
 var tb=$('#themeBtn');if(tb)tb.innerHTML=ic(state.theme==='dark'?P_SUN:P_MOON,22);
  var lb=$('#logoutBtn');if(lb)lb.innerHTML=ic(P_LOGOUT,18)+'<span>Keluar</span>';
  var unread=visibleNotifs().filter(function(n){return !n.read;}).length;
  var ping=$('#notifPing');if(ping)ping.style.display=unread?'block':'none';
}
/* Access matrix rows: [label, soal, mkt, user, adm] with 2 = partial/read-only */
