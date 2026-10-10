/* 03-bank-soal.js — Bank soal: mapel, materi, soal, import.
   Dipisah otomatis dari DESIGN ADMIN/new-admin.html. Muat BERURUTAN via <script> di index.html (classic script, globals bersama). */
function qKeyLetter(d){var k=String((d&&d.key)||'').trim().toUpperCase();return /^[A-E]$/.test(k)?k:'';}
function qOptsHTML(d,kl){
 return '<ul class="qopts">'+d.options.map(function(o,i){
  var L=QLTR[i]||'';
  return '<li><button class="qopt'+(L===kl?' key':'')+(d.pick===L?' pick':'')+'" data-qopt="'+esc(d.id)+'" data-qletter="'+L+'" aria-label="Pilihan '+L+': '+esc(o)+'"><span class="qk">'+L+'</span><span class="qt">'+esc(o)+'</span></button></li>';
 }).join('')+'</ul>';
}
function qCardHTML(d,no,ix){
 var kl=qKeyLetter(d);
 var locked=d.st&&d.st[0]==='Locked';
 var fig=d.fig?'<div class="qc-fig">'+ic('ti-photo',26)+'<span>'+esc(d.fig)+'</span></div>':'';
 var tags='<span class="qc-tags"><span class="qtag">'+esc(d.type||'')+'</span><span class="qtag">'+esc(d.topic||'')+'</span><span class="qtag '+(QDIFF[d.diff]||'')+'"><span class="dot"></span>'+esc(d.diff||'')+'</span><span class="qtag">Bobot '+esc(d.points||0)+'</span>'+(locked&&d.usedIn?'<span class="qtag">'+esc(d.usedIn)+' · berjalan</span>':'')+'</span>';
 var use='<span class="qc-use"><span class="cell-s">dipakai '+esc(d.used||0)+'x</span>'
  +'<button class="mini-btn ic" data-qkey="'+esc(d.id)+'" aria-expanded="false" aria-controls="qkey-'+esc(d.id)+'" title="Lihat kunci dan pembahasan" aria-label="Lihat kunci dan pembahasan soal '+esc(d.id)+'">'+ic(P_EYE,14)+'</button>'
  +(locked?'<button class="mini-btn ic" data-qlocked="'+esc(d.id)+'" title="Terkunci — dipakai tryout berjalan" aria-label="Soal terkunci">'+ic('ti-lock',14)+'</button>':'<button class="mini-btn ic" data-qqedit="'+esc(d.id)+'" title="Ubah soal" aria-label="Ubah soal '+esc(d.id)+'">'+ic(P_PENCIL,14)+'</button>')
  +'<button class="mini-btn ic" data-qdup="'+esc(d.id)+'" title="Duplikat" aria-label="Duplikat soal '+esc(d.id)+'">'+ic(P_COPY,14)+'</button>'
  +'<button class="mini-btn ic" data-qarch="'+esc(d.id)+'" title="Arsipkan" aria-label="Arsipkan soal '+esc(d.id)+'">'+ic(P_ARCH,14)+'</button></span>';
 return '<article class="qc" data-qcard="'+esc(d.id)+'">'
  +'<div class="qc-top"><button class="qc-no" data-qopen="'+esc(d.id)+'" title="Buka detail soal" aria-label="Buka detail soal '+esc(d.id)+'">'+no+'</button>'+tags
  +'<span class="status '+d.st[1]+'">'+esc(d.st[0])+'</span>'+(d.reports?'<span class="bdg alert">'+esc(d.reports)+' laporan</span>':'')+'</div>'
  +'<p class="qc-stem">'+esc(d.t)+'</p>'+fig
  +(d.checkFail&&d.checkFail.length?'<div class="cell-s" style="margin:8px 14px 0;color:var(--danger)">Gagal cek: '+esc(d.checkFail[0])+(d.checkFail.length>1?' (+'+(d.checkFail.length-1)+' lagi)':'')+'</div>':'')
  +(d.options&&d.options.length?qOptsHTML(d,kl):'<div class="qfill">'+(d.type==='Uraian'?'Kolom uraian pelajar · dinilai manual dari rubrik.':'Kolom jawaban pelajar · isian pendek.')+'</div>')
  +'<div class="qkey" id="qkey-'+esc(d.id)+'" hidden><b>Kunci jawaban</b><p><b>'+esc(d.key||'belum diisi')+'</b> — '+esc(d.explain||'Pembahasan belum ditulis.')+'</p></div>'
  +'<div class="qc-foot"><span class="qc-who">'+byAvatar(d.by,ix)+esc(d.by||'')+'</span>'+use+'</div></article>';
}
function qPick(id,L){
 var f=findRow('questions',id);if(!f.d)return;
 f.d.pick=(f.d.pick===L?'':L);
 var kl=qKeyLetter(f.d);
 saveFilters();render(false);
 if(f.d.pick&&kl&&f.d.pick!==kl)toast('Pilihan '+f.d.pick+' beda dari kunci '+kl,'Buka pembahasan untuk mengecek.');
}
/* ===== Cek soal otomatis (ikut aturan import admin asli) =====
   Bobot default: Mudah 5, Sedang 10, Sulit 15. */
var QW_BY_DIFF={Mudah:5,Sedang:10,Sulit:15};
var QDIFF_ID={easy:'Mudah',medium:'Sedang',hard:'Sulit',Mudah:'Mudah',Sedang:'Sedang',Sulit:'Sulit',mudah:'Mudah',sedang:'Sedang',sulit:'Sulit',sukar:'Sulit'};
function qNormDiff(v){return QDIFF_ID[String(v||'').trim().toLowerCase()]||'';}
function checkSoal(o){
 var errs=[];
 var type=o.type||'';
 if(!String(o.content||'').trim())errs.push('Teks soal wajib diisi.');
 if(type==='Pilihan Ganda'){
  var opts=(o.options||[]).filter(function(x){return String(x||'').trim();});
  if(opts.length<2)errs.push('Minimal 2 opsi jawaban.');
  var kl=String(o.key||'').trim().toUpperCase();
  if(!kl)errs.push('Kunci jawaban wajib diisi (contoh: B).');
  else{var idx='ABCDE'.indexOf(kl);if(idx<0||!String(opts[idx]||'').trim())errs.push('Kunci "'+kl+'" tidak cocok dengan opsi yang diisi.');}
 }else if(type==='Isian Singkat'){
  if(!String(o.key||'').trim())errs.push('Jawaban benar wajib diisi.');
 }else if(type==='Benar/Salah'){
  var b=String(o.key||'').trim().toLowerCase();
  if(b!=='benar'&&b!=='salah')errs.push('Kunci harus "Benar" atau "Salah".');
 }
 var dv=qNormDiff(o.diff);
 if(!dv)errs.push('Tingkat kesulitan wajib diisi (Mudah/Sedang/Sulit).');
 var pv=Number(String(o.points==null?'':o.points).replace(',','.'));
 if(o.points===''||o.points==null||!isFinite(pv)||pv<=0)errs.push('Bobot nilai wajib diisi (> 0).');
 else if(dv&&pv!==QW_BY_DIFF[dv])errs.push('Kesulitan '+dv+' harus berbobot '+QW_BY_DIFF[dv]+'.');
 return {ok:errs.length===0,reasons:errs,diff:dv||o.diff,points:pv};
}
/* Tambah soal manual di dalam materi: cek otomatis jalan saat simpan. */
function qSoalForm(matId){
 var m=qTop(matId);if(!m)return;
 var subjId=null;Object.keys(QMAT).forEach(function(k){QMAT[k].forEach(function(x){if(x.id===matId)subjId=k;});});
 var s=subjId?qSub(subjId):null;
 var mats=subjId?qMats(subjId):[m];
 modalFocus=document.activeElement;
 $('#modalBox').innerHTML='<div class="modal-h"><h3>Tambah soal</h3><p>'+esc(s?s.name:'')+' · '+esc(m.name)+' · cek otomatis saat simpan.</p></div>'
 +'<div class="modal-b">'
 +'<div class="field"><label for="qsType">Tipe soal</label><select id="qsType" aria-label="Tipe soal"><option>Pilihan Ganda</option><option>Isian Singkat</option><option>Benar/Salah</option><option>Uraian</option></select></div>'
 +'<div class="field"><label for="qsText">Teks soal</label><textarea id="qsText" placeholder="Tulis soal…"></textarea><span class="ferr" id="qseText"></span></div>'
 +'<div class="field" data-qs="pg"><label for="qsOpts">Opsi jawaban <small>(satu per baris)</small></label><textarea id="qsOpts" placeholder="Opsi A&#10;Opsi B&#10;Opsi C"></textarea><span class="ferr" id="qseOpts"></span></div>'
 +'<div class="field" data-qs="pg"><label for="qsKey">Kunci jawaban <small>(huruf, cth: B)</small></label><input id="qsKey" placeholder="B" style="text-transform:uppercase"><span class="ferr" id="qseKey"></span></div>'
 +'<div class="field" data-qs="isian" style="display:none"><label for="qsAns">Jawaban benar</label><input id="qsAns" placeholder="cth: Jakarta"><span class="ferr" id="qseAns"></span></div>'
 +'<div class="field" data-qs="bs" style="display:none"><label for="qsBS">Kunci jawaban</label><select id="qsBS" aria-label="Kunci jawaban"><option>Benar</option><option>Salah</option></select></div>'
 +'<div class="field" data-qs="uraian" style="display:none"><label for="qsRub">Rubrik penilaian</label><textarea id="qsRub" placeholder="Yang dinilai dari jawaban…"></textarea></div>'
 +'<div class="field"><label for="qsMat">Materi</label><select id="qsMat" aria-label="Materi">'+mats.map(function(x){return '<option value="'+esc(x.id)+'"'+(x.id===matId?' selected':'')+'>'+esc(x.name)+'</option>';}).join('')+'</select></div>'
 +'<div class="field"><label for="qsExp">Pembahasan</label><textarea id="qsExp" placeholder="Pembahasan jawaban…"></textarea></div>'
 +'<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(150px,1fr));gap:13px">'
 +'<div class="field"><label for="qsDiff">Tingkat kesulitan</label><select id="qsDiff" aria-label="Tingkat kesulitan"><option>Sedang</option><option>Mudah</option><option>Sulit</option></select></div>'
 +'<div class="field"><label for="qsPts">Bobot nilai</label><input id="qsPts" type="number" min="1" value="10"><span class="fhint">Default: Mudah 5 · Sedang 10 · Sulit 15.</span><span class="ferr" id="qsePts"></span></div>'
 +'</div>'
 +'</div>'
 +'<div class="modal-f"><button class="btn" id="qsCancel">Batal</button><button class="btn primary" id="qsOk">Simpan & cek</button></div>';
 $('#modalOv').classList.add('show');
 function syncType(){var ty=$('#qsType').value;$('#modalBox').querySelectorAll('[data-qs]').forEach(function(f){f.style.display=((f.getAttribute('data-qs')==='pg'&&ty==='Pilihan Ganda')||(f.getAttribute('data-qs')==='isian'&&ty==='Isian Singkat')||(f.getAttribute('data-qs')==='bs'&&ty==='Benar/Salah')||(f.getAttribute('data-qs')==='uraian'&&ty==='Uraian'))?'':'none';});}
 $('#qsType').onchange=syncType;syncType();
 $('#qsDiff').onchange=function(){var dd={Mudah:5,Sedang:10,Sulit:15}[$('#qsDiff').value];if(dd)$('#qsPts').value=dd;};
 $('#qsCancel').onclick=closeModal;
 $('#qsOk').onclick=function(){
  var ty=$('#qsType').value;
  var opts=$('#qsOpts').value.split('\n');
  var key=ty==='Pilihan Ganda'?$('#qsKey').value:ty==='Isian Singkat'?$('#qsAns').value:ty==='Benar/Salah'?$('#qsBS').value:'Dinilai sesuai rubrik';
  var mid=$('#qsMat').value,mm=qTop(mid)||m;
  var o={type:ty,content:$('#qsText').value,options:opts,key:key,diff:$('#qsDiff').value,points:$('#qsPts').value};
  var chk=checkSoal(o);
  function mark(id,msg){var f=$('#'+id),e=$('#qse'+id.slice(2));if(f)f.classList.toggle('bad',!!msg);if(e){e.textContent=msg||'';e.classList.toggle('show',!!msg);}if(msg)ok=false;}
  var ok=true;
  mark('qsText',!String(o.content).trim()?'Teks soal wajib diisi.':'');
  mark('qsOpts',(ty==='Pilihan Ganda'&&opts.filter(function(x){return String(x).trim();}).length<2)?'Minimal 2 opsi.':'');
  mark('qsKey',(ty==='Pilihan Ganda'&&!String(key).trim())?'Kunci wajib diisi.':'');
  mark('qsAns',(ty==='Isian Singkat'&&!String(key).trim())?'Jawaban wajib diisi.':'');
  mark('qsPts',(!/^\d+([.,]\d+)?$/.test(String($('#qsPts').value).trim()))?'Bobot harus angka > 0.':'');
  if(!ok){var b0=$('#modalBox').querySelector('.bad');if(b0)b0.focus();return;}
  var t=featOf('questions');
  var d={id:'SOAL-'+(9000+Math.floor(Math.random()*900)),t:String(o.content).trim()||'(tanpa teks)',s:ty+' · '+(s?s.name:'')+' · '+mm.name+' · '+chk.diff,diff:chk.diff,topic:mm.name,subj:subjId,mat:mid,type:ty,options:ty==='Pilihan Ganda'?opts.filter(function(x){return String(x).trim();}).map(function(x){return String(x).trim();}):[],key:ty==='Pilihan Ganda'?String(key).trim().toUpperCase():ty==='Benar/Salah'?(String(key).toLowerCase()==='salah'?'Salah':'Benar'):String(key).trim(),explain:$('#qsExp').value.trim(),points:chk.points,used:0,reports:0,by:'Admin',rubric:ty==='Uraian'?$('#qsRub').value.trim():''};
  if(chk.ok){d.st=['Ready','green'];d.chip='Ready';}else{d.st=['In Review','amber'];d.chip='In Review';d.checkFail=chk.reasons;}
  t.rows.unshift(d);closeModal();saveFilters();render(false);
  toast(chk.ok?'Soal masuk sebagai Ready':'Soal masuk sebagai In Review',chk.ok?'Lolos cek otomatis.':chk.reasons[0]);
 };
 var f0=$('#qsText');if(f0)f0.focus();
}
/* Import soal (UI-only, mirror admin asli): template + file + cek + import.
   Tanpa parsing/backend — baris contoh statis untuk pratinjau tampilan. */
function qImportModal(matId){
 var m=qTop(matId);if(!m)return;
 var subjId=null;Object.keys(QMAT).forEach(function(k){QMAT[k].forEach(function(x){if(x.id===matId)subjId=k;});});
 var s=subjId?qSub(subjId):null;
 var TPLS=[
  {k:'pg',t:'Pilihan Ganda',d:'Teks Soal · Opsi A–E · Kunci Jawaban · Tingkat Kesulitan · Bobot Nilai'},
  {k:'isian',t:'Isian Singkat',d:'Teks Soal · Jawaban Benar · Tingkat Kesulitan · Bobot Nilai'},
  {k:'bs',t:'Benar/Salah',d:'Teks Soal · Kunci Benar/Salah · Tingkat Kesulitan · Bobot Nilai'},
  {k:'uraian',t:'Uraian',d:'Teks Soal · Rubrik Penilaian · Kata Min/Maks · Tingkat Kesulitan'},
  {k:'generic',t:'Semua Tipe (Generic)',d:'type · content · options · statements · pairs · acceptedAnswers'}];
 var DEMO=[
  {n:2,teks:'Diketahui barisan 3, 7, 11, 15, … Suku ke-20 adalah …',tipe:'Pilihan Ganda',diff:'Sedang',bobot:10,st:'ready',msg:'Siap diimpor',opsi:['79','80','81','82'],kunci:'A',bahas:'Beda 4 → Un = 4n - 1 → U20 = 79.'},
  {n:3,teks:'Apa ibukota Indonesia?',tipe:'Isian Singkat',diff:'Mudah',bobot:5,st:'ready',msg:'Siap diimpor',kunci:'Jakarta',bahas:'Ibukota Indonesia adalah Jakarta.'},
  {n:4,teks:'Air mendidih di suhu 100°C pada tekanan normal.',tipe:'Benar/Salah',diff:'Mudah',bobot:5,st:'ready',msg:'Siap diimpor',kunci:'Benar',bahas:'Benar pada tekanan atmosfer normal.'},
  {n:5,teks:'Jelaskan proses fotosintesis pada tumbuhan.',tipe:'Uraian',diff:'Sulit',bobot:15,st:'ready',msg:'Siap diimpor',kunci:'Rubrik: cahaya, air, CO2, klorofil',bahas:'Mengubah air + CO2 menjadi glukosa.'},
  {n:6,teks:'Pilih bilangan genap berikut.',tipe:'Pilihan Ganda',diff:'Sedang',bobot:10,st:'ready',msg:'Siap diimpor',opsi:['2','3','4','5'],kunci:'A, C',bahas:'2 dan 4 genap.'},
  {n:7,teks:'Apa ibukota Indonesia?',tipe:'Isian Singkat',diff:'Mudah',bobot:5,st:'dup',msg:'Duplikat baris 3',kunci:'Jakarta',bahas:''},
  {n:8,teks:'(tanpa teks soal)',tipe:'Pilihan Ganda',diff:'—',bobot:0,st:'err',msg:'Tidak valid: Teks Soal wajib diisi; Kunci tidak cocok',kunci:'-',bahas:''}];
 modalFocus=document.activeElement;
 $('#modalBox').classList.add('wide');
 $('#modalBox').innerHTML='<div class="modal-h"><h3>Import soal</h3><p>'+esc(s?s.name:'')+' · '+esc(m.name)+' · CSV/XLSX · UI saja, file tidak diproses.</p></div>'
 +'<div class="modal-b">'
 +'<div style="border:1px solid var(--border);border-radius:14px;padding:13px 14px;background:var(--bg-hover)"><div style="font-size:12.8px;color:var(--text-2)">Unggah file CSV atau Excel (.xlsx) berisi daftar soal. Unduh template “Semua Tipe” untuk soal campuran, atau template per tipe untuk kolom yang lebih sederhana. Tipe file terdeteksi otomatis dari nama kolomnya.</div>'
 +'<div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"><span class="imp-tpl"><button class="btn sm" id="qiTplBtn">'+ic(P_DOWNLOAD,15)+'Unduh Template '+ic(P_CHEV,14)+'</button><span class="imp-tpl-pop" id="qiTplPop">'+TPLS.map(function(tp){return '<button data-qitpl="'+tp.k+'"><span style="flex:1;min-width:0"><b>'+esc(tp.t)+'</b><small>'+esc(tp.d)+'</small></span></button>';}).join('')+'</span></span>'
 +'<button class="btn sm primary" id="qiPick">'+ic(P_UPLOAD,15)+'<span id="qiPickLbl">Pilih File</span></button>'
 +'<button class="link" id="qiDemo">Muat contoh</button>'
 +'<input id="qiFile" type="file" accept=".csv,.xlsx,.xls" hidden aria-label="File soal"></div>'
 +'<span class="fhint">Maks 500 baris per file · dikirim per chunk (25 soal).</span></div>'
 +'<div id="qiEmpty" style="border:1px dashed var(--border);border-radius:14px;padding:26px 16px;text-align:center;color:var(--text-2)"><b>Belum ada file.</b><br><span style="font-size:12.5px">Pilih file atau muat contoh untuk melihat pratinjau hasil cek.</span></div>'
 +'<div id="qiResult" style="display:none;flex-direction:column;gap:10px">'
 +'<div style="display:flex;gap:7px;flex-wrap:wrap;align-items:center"><span class="bdg ok" id="qiCReady">5 siap</span><span class="bdg warn" id="qiCDup">1 duplikat</span><span class="bdg alert" id="qiCErr">1 error</span>'
 +'<span style="margin-left:auto;display:flex;gap:6px;flex-wrap:wrap" role="group" aria-label="Filter status import"><button class="chip active" data-qif="all">Semua</button><button class="chip" data-qif="ready">Siap</button><button class="chip" data-qif="dup">Duplikat</button><button class="chip" data-qif="err">Error</button></span></div>'
 +'<div class="imp-rows" id="qiRows"></div>'
 +'<div class="dsec" id="qiPrev" style="display:none"><h4>Detail soal · <span id="qiPrevN"></span></h4><div id="qiPrevB" style="font-size:12.8px"></div></div>'
 +'<div id="qiProgW" style="display:none"><div style="display:flex;justify-content:space-between;font-size:12px;color:var(--text-2);margin-bottom:6px"><b id="qiProgT" style="color:var(--text-h)">Mengimpor…</b><span id="qiProgN">0%</span></div><div class="imp-prog"><i id="qiProg"></i></div><div class="cell-s" style="margin-top:6px">Import dapat dilanjutkan per chunk; yang berhasil tidak dikirim ulang.</div></div>'
 +'</div>'
 +'</div>'
 +'<div class="modal-f"><button class="btn" id="qiCancel">Batal</button><button class="btn primary" id="qiOk" disabled>Import 5 Soal</button></div>';
 $('#modalOv').classList.add('show');
 var filter='all',sel={};DEMO.forEach(function(r){sel[r.n]=(r.st==='ready');});
 function readyCount(){return DEMO.filter(function(r){return r.st==='ready'&&sel[r.n];}).length;}
 function paintBtn(){var n=readyCount();var b=$('#qiOk');if(b){b.textContent='Import '+n+' Soal';b.disabled=(!n);}}
 function prevHTML(r){
  var ops=(r.opsi||[]).map(function(o,i){var L='ABCDE'[i]||'';var isK=String(r.kunci||'').indexOf(L)>=0;return '<div style="border:1px solid '+(isK?'var(--primary)':'var(--border-soft)')+';background:'+(isK?'var(--primary-50)':'var(--bg-card)')+';border-radius:10px;padding:7px 10px;font-size:12.8px"><b>'+L+'.</b> '+esc(o)+(isK?' <span class="bdg ok">Benar</span>':'')+'</div>';}).join('');
  return '<div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:8px"><span class="qtag">'+esc(r.tipe)+'</span><span class="qtag">'+esc(r.diff)+'</span><span class="qtag">Bobot '+esc(r.bobot)+'</span></div>'
  +'<div style="font-size:13.5px;color:var(--text-h);font-weight:600">'+esc(r.teks)+'</div>'
  +(ops?'<div style="display:flex;flex-direction:column;gap:6px;margin-top:8px">'+ops+'</div>':'<div class="qfill" style="margin:8px 0 0">Kunci: <b>'+esc(r.kunci||'-')+'</b></div>')
  +(r.bahas?'<div style="margin-top:8px;font-size:12.8px;color:var(--text-2)"><b style="color:var(--text-h)">Pembahasan:</b> '+esc(r.bahas)+'</div>':'');
 }
 function paintRows(){
  var box=$('#qiRows');if(!box)return;
  var rows=DEMO.filter(function(r){return filter==='all'||r.st===filter;});
  if(!rows.length){box.innerHTML='<div style="text-align:center;color:var(--text-2);padding:18px;font-size:12.5px">Tidak ada soal untuk filter ini.</div>';return;}
  box.innerHTML=rows.map(function(r){
   var cls=r.st==='ready'?'is-ready':r.st==='dup'?'is-dup':'is-err';
   var dot=r.st==='ready'?'ok':r.st==='dup'?'warn':'err';
   var badge=r.st==='ready'?'<span class="status green">Siap</span>':r.st==='dup'?'<span class="status amber">Duplikat</span>':'<span class="status red">Error</span>';
   return '<div class="imp-row '+cls+'"><input type="checkbox" data-qick="'+r.n+'"'+(r.st==='ready'&&sel[r.n]?' checked':'')+(r.st!=='ready'?' disabled':'')+' aria-label="Pilih baris '+r.n+'" style="width:17px;height:17px;accent-color:var(--primary);margin-top:2px">'
   +'<span class="imp-dot '+dot+'"></span><span style="flex:1;min-width:0"><b style="font-size:12.8px;color:var(--text-h)">Baris '+r.n+':</b> <span style="color:var(--text-1)">'+esc(r.teks)+'</span><br><span class="cell-s">'+esc(r.msg)+' · '+esc(r.tipe)+'</span></span>'
   +'<span style="display:flex;gap:6px;flex:0 0 auto;align-items:center">'+badge+'<button class="mini-btn" data-qiview="'+r.n+'">'+ic(P_EYE,14)+'<span>Lihat</span></button></span></div>';
  }).join('');
  box.querySelectorAll('[data-qick]').forEach(function(cb){cb.onchange=function(){sel[+cb.getAttribute('data-qick')]=cb.checked;paintBtn();};});
  box.querySelectorAll('[data-qiview]').forEach(function(b){b.onclick=function(){var n=+b.getAttribute('data-qiview');var r=null;DEMO.forEach(function(x){if(x.n===n)r=x;});if(!r)return;$('#qiPrev').style.display='';$('#qiPrevN').textContent='Baris '+r.n;$('#qiPrevB').innerHTML=prevHTML(r);};});
 }
 function showResult(fileLbl){
  $('#qiEmpty').style.display='none';var rs=$('#qiResult');rs.style.display='flex';
  var pl=$('#qiPickLbl');if(pl&&fileLbl)pl.textContent=fileLbl;
  paintRows();paintBtn();
 }
 var tp=$('#qiTplBtn'),pp=$('#qiTplPop');
 if(tp)tp.onclick=function(e){e.stopPropagation();pp.classList.toggle('show');};
 document.addEventListener('click',function h(e){var p2=$('#qiTplPop');if(p2&&!e.target.closest('.imp-tpl'))p2.classList.remove('show');});
 $('#modalBox').querySelectorAll('[data-qitpl]').forEach(function(b){b.onclick=function(){pp.classList.remove('show');var tp2=null;TPLS.forEach(function(x){if(x.k===b.getAttribute('data-qitpl'))tp2=x;});toast('Template '+(tp2?tp2.t:'')+' disiapkan…','Contoh kolom ikut dalam file.');};});
 $('#qiPick').onclick=function(){$('#qiFile').click();};
 $('#qiFile').onchange=function(){var f=$('#qiFile').files&&$('#qiFile').files[0];showResult(f?f.name:'contoh-soal.xlsx');toast('File dibaca (UI saja)','7 baris contoh dimuat.');};
 $('#qiDemo').onclick=function(){showResult('contoh-soal.xlsx');toast('Contoh dimuat','5 siap · 1 duplikat · 1 error.');};
 $('#modalBox').querySelectorAll('[data-qif]').forEach(function(b){b.onclick=function(){filter=b.getAttribute('data-qif');$('#modalBox').querySelectorAll('[data-qif]').forEach(function(x){x.classList.toggle('active',x===b);});paintRows();};});
 $('#qiCancel').onclick=closeModal;
 $('#qiOk').onclick=function(){
  var w=$('#qiProgW');w.style.display='';var bar=$('#qiProg'),tx=$('#qiProgN'),tt=$('#qiProgT');var p=0;
  $('#qiOk').disabled=true;
  var iv=setInterval(function(){p=Math.min(100,p+Math.ceil(Math.random()*22));bar.style.width=p+'%';tx.textContent=p+'%';tt.textContent=p<100?'Mengimpor '+readyCount()+' soal…':'Selesai';if(p>=100){clearInterval(iv);toast('Import selesai (UI saja)',readyCount()+' soal masuk sebagai In Review.');closeModal();}},220);
 };
 var c0=$('#qiCancel');if(c0)c0.focus();
}
function qDuplicate(id){
 var f=findRow('questions',id);if(!f.d)return;
 var c={};for(var k in f.d)c[k]=f.d[k];
 c.options=(f.d.options||[]).slice();
 c.id='SOAL-'+(9000+Math.floor(Math.random()*900));
 c.st=['In Review','amber'];c.chip='In Review';c.used=0;c.reports=0;c.pick='';delete c.usedIn;
 c.s=(f.d.s||'')+' · duplikat dari '+f.d.id;
 f.t.rows.unshift(c);saveFilters();render(false);toast('Soal diduplikat sebagai In Review',c.id);
}
function qArchive(id){
 var f=findRow('questions',id);if(!f.d)return;
 var was=f.d.st,wasChip=f.d.chip;
 f.d.st=['Archive','gray'];f.d.chip='Archive';saveFilters();render(false);
 toast('Soal diarsipkan','Tidak ikut tampil di tryout.',null,{label:'Urungkan',fn:function(){f.d.st=was;f.d.chip=wasChip;saveFilters();render(false);}});
}
/* ===== Bank Soal tingkat 1: daftar mata pelajaran =====
   Kartu soal dan css .qc* di atas tidak berubah; ini hanya menambah daftar
   di atasnya. questionsView() jadi pintu masuk tunggal untuk dua tingkat. */
var SUBJECTS=[
 {id:'SUB-MAT',name:'Matematika',group:'Sains',icn:'ti-abacus'},
 {id:'SUB-FIS',name:'Fisika',group:'Sains',icn:'ti-wave-sine'},
 {id:'SUB-BIO',name:'Biologi',group:'Sains',icn:'ti-leaf'},
 {id:'SUB-INF',name:'Informatika',group:'Sains',icn:'ti-binary-tree'},
 {id:'SUB-BIN',name:'Bahasa Indonesia',group:'Bahasa',icn:'ti-book-2'},
 {id:'SUB-EKO',name:'Ekonomi',group:'Sosial',icn:'ti-coin'}];
/* Select level 1: hanya "Isi". Chip kelompok sudah dihapus, jadi chips kosong.
   Key 'isi' sengaja dibeda dari 'st' milik soal. */
var SUBTOOLS={chips:[],filters:[{k:'isi',l:'Isi',o:['Semua','In Review','Belum ada soal']}],sorts:[{key:'title',label:'Nama'}]};
var TOPICSORT={filters:[],chips:[],sorts:[{key:'title',label:'Nama'}]};
function qSub(id){var out=null;SUBJECTS.forEach(function(s){if(s.id===id)out=s;});return out;}
/* Angka selalu dihitung ulang dari baris soal, jadi tidak pernah basi setelah
   duplikat atau arsip. live = Ready + Locked; draft = In Review. */
function qSubCount(s){
 var r=(featOf('questions').rows||[]).filter(function(d){return d.subj===s.id;});
 var live=0,draft=0;
 r.forEach(function(d){if(!d.st||d.st[0]==='In Review')draft++;else if(d.st[0]==='Archive'){}else live++;});
 return {total:r.length,live:live,draft:draft};
}
/* ===== Bank Soal tingkat 2: daftar isi materi per mapel =====
   Tiap mapel punya materi sendiri (tidak bersarang antar mapel, ikut
   penamaan mapel resmi). Angka dihitung ulang dari baris soal. */
var QMAT={
 'SUB-MAT':[{id:'MAT-ALJ',name:'Aljabar'},{id:'MAT-PK',name:'Persamaan Kuadrat'},{id:'MAT-BAR',name:'Barisan & Deret'},{id:'MAT-GEO',name:'Geometri'}],
 'SUB-FIS':[{id:'FIS-GEL',name:'Gelombang'},{id:'FIS-KIN',name:'Kinematika'},{id:'FIS-LIS',name:'Listrik Dinamis'}],
 'SUB-BIO':[{id:'BIO-GEN',name:'Genetika'},{id:'BIO-SEL',name:'Sel'},{id:'BIO-EKO',name:'Ekosistem'}],
 'SUB-INF':[{id:'INF-ALG',name:'Algoritma'},{id:'INF-JAR',name:'Jaringan Komputer'}],
 'SUB-BIN':[{id:'BIN-LIT',name:'Literasi'},{id:'BIN-TB',name:'Tata Bahasa'},{id:'BIN-KI',name:'Karya Ilmiah'}],
 'SUB-EKO':[{id:'EKO-MIK',name:'Mikroekonomi'},{id:'EKO-MAK',name:'Makroekonomi'}]};
function qMats(subj){return QMAT[subj]||[];}
function qTop(id){var out=null;Object.keys(QMAT).forEach(function(k){QMAT[k].forEach(function(m){if(m.id===id)out=m;});});return out;}
function qTopCount(mid){
 var r=(featOf('questions').rows||[]).filter(function(d){return d.mat===mid;});
 var live=0,draft=0;
 r.forEach(function(d){if(!d.st||d.st[0]==='In Review')draft++;else if(d.st[0]==='Archive'){}else live++;});
 return {total:r.length,live:live,draft:draft};
}
/* Level 1 punya barisnya sendiri, jadi tidak menyentuh filteredRows yang dipakai
   semua halaman lain. Urut A–Z mengikuti tombol urut yang sama seperti tabel. */
function qSubFiltered(){
 var out=SUBJECTS.filter(function(s){
  if(state.q&&(s.name+' '+s.group).toLowerCase().indexOf(state.q.toLowerCase())<0)return false;
  return (state.flt||[]).every(function(c){return fltMatch(s,c);});
  });
  if(state.sort){var dir=state.sort==='asc'?1:-1;out.sort(function(a,b){return dir*a.name.localeCompare(b.name,'id',{numeric:true,sensitivity:'base'});});}
  return out;
}
function qSubTileHTML(s){
 var c=qSubCount(s);
 var art=s.img
  ?'<img src="'+esc(s.img)+'" alt="" style="width:100%;height:100%;object-fit:cover;position:absolute;inset:0">'
  :'<span style="display:flex;width:100%;height:100%;justify-content:space-between;align-items:flex-start;padding:12px;color:var(--text-3)">'+ic('ti-photo',26)+'</span>';
 return '<div class="qsub">'
  +'<button class="qsub-art" data-qsub="'+esc(s.id)+'" aria-label="Buka soal '+esc(s.name)+', '+c.total+' soal">'+art+'</button>'
  +'<div class="qsub-meta" data-qsub="'+esc(s.id)+'" role="button" tabindex="0" aria-label="Buka soal '+esc(s.name)+'" style="cursor:pointer">'
  +'<span class="meta-row"><span class="cell-t" style="font-size:13px">'+esc(s.name)+'</span><span class="go">'+ic(P_CHR,15)+'</span></span>'
  +'<span class="cell-s">'+qMats(s.id).length+' materi · '+c.total+' soal</span>'
  +'</div></div>';
}
/* Ubah kartu mapel: gambar upload + nama. Sesi ini saja (tanpa backend). */
function qSubForm(id){
 var s=qSub(id);if(!s)return;
 var imgData=s.img||'';
 modalFocus=document.activeElement;
 $('#modalBox').innerHTML='<div class="modal-h"><h3>Ubah mapel</h3><p>Gambar dan nama yang tampil di kartu.</p></div>'
 +'<div class="modal-b">'
 +'<div class="field"><label for="qfName">Nama mapel</label><input id="qfName" value="'+esc(s.name||'')+'" placeholder="cth: Matematika"><span class="ferr" id="qfeName"></span></div>'
 +'<div class="field"><label>Gambar <small>(opsional)</small></label><div id="qfPrevWrap" style="margin-bottom:8px">'+(imgData?'<img src="'+esc(imgData)+'" alt="" style="width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:12px;border:1px solid var(--border)">':'')+'</div><label class="w-up" for="qfImg"><span class="w-up-ic">'+ic('ti-photo',18)+'</span><span style="flex:1;min-width:0"><b>Unggah gambar</b><small>PNG/JPG/WEBP · maks 5 MB</small></span><input id="qfImg" type="file" accept="image/png,image/jpeg,image/webp" hidden></label><span class="fhint">Kosongkan untuk ikon bawaan di kiri atas.</span></div>'
 +'</div>'
 +'<div class="modal-f"><button class="btn" id="qfCancel">Batal</button><button class="btn primary" id="qfOk">Simpan</button></div>';
 $('#modalOv').classList.add('show');
 $('#qfCancel').onclick=closeModal;
 var fi=$('#qfImg');
 if(fi)fi.onchange=function(){
  var f=fi.files&&fi.files[0];if(!f)return;
  if(f.size>5*1024*1024){toast('Gambar maksimal 5 MB',null,'err');fi.value='';return;}
  var rd=new FileReader();
  rd.onload=function(){imgData=rd.result;var w=$('#qfPrevWrap');if(w)w.innerHTML='<img src="'+esc(imgData)+'" alt="" style="width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:12px;border:1px solid var(--border)">';};
  rd.readAsDataURL(f);
 };
 $('#qfOk').onclick=function(){
  var vN=$('#qfName').value.trim();
  var fe=$('#qfeName'),fn=$('#qfName');
  if(!vN){if(fe){fe.textContent='Nama mapel wajib diisi.';fe.classList.add('show');}if(fn)fn.classList.add('bad');fn.focus();return;}
  s.name=vN;s.img=imgData||null;closeModal();saveFilters();render(false);toast('Kartu mapel diperbarui');
 };
 var f0=$('#qfName');if(f0)f0.focus();
}
/* Tambah mapel: nama + kelompok + cover. Sesi ini saja (tanpa backend). */
function qSubNew(){
 var imgData='';
 modalFocus=document.activeElement;
 $('#modalBox').innerHTML='<div class="modal-h"><h3>Tambah buku mapel</h3><p>Nama dan cover kartu mapel.</p></div>'
 +'<div class="modal-b">'
 +'<div class="field"><label for="qnName">Nama mapel</label><input id="qnName" value="" placeholder="cth: Kimia"><span class="ferr" id="qneName"></span></div>'
 +'<div class="field"><label>Cover <small>(opsional)</small></label><div id="qnPrevWrap" style="margin-bottom:8px"></div><label class="w-up" for="qnImg"><span class="w-up-ic">'+ic('ti-photo',18)+'</span><span style="flex:1;min-width:0"><b>Unggah cover</b><small>PNG/JPG/WEBP · maks 5 MB</small></span><input id="qnImg" type="file" accept="image/png,image/jpeg,image/webp" hidden></label><span class="fhint">Kosongkan untuk ikon bawaan.</span></div>'
 +'</div>'
 +'<div class="modal-f"><button class="btn" id="qnCancel">Batal</button><button class="btn primary" id="qnOk">Tambah</button></div>';
 $('#modalOv').classList.add('show');
 $('#qnCancel').onclick=closeModal;
 var fi=$('#qnImg');
 if(fi)fi.onchange=function(){
  var f=fi.files&&fi.files[0];if(!f)return;
  if(f.size>5*1024*1024){toast('Gambar maksimal 5 MB',null,'err');fi.value='';return;}
  var rd=new FileReader();
  rd.onload=function(){imgData=rd.result;var w=$('#qnPrevWrap');if(w)w.innerHTML='<img src="'+esc(imgData)+'" alt="" style="width:100%;aspect-ratio:16/9;object-fit:cover;border-radius:12px;border:1px solid var(--border)">';};
  rd.readAsDataURL(f);
 };
 $('#qnOk').onclick=function(){
  var vN=$('#qnName').value.trim();
  var fe=$('#qneName'),fn=$('#qnName');
  if(!vN){if(fe){fe.textContent='Nama mapel wajib diisi.';fe.classList.add('show');}if(fn)fn.classList.add('bad');fn.focus();return;}
  var base=(vN.replace(/[^A-Za-z]/g,'').slice(0,3)||'MAP').toUpperCase();
  var id='SUB-'+base+Math.floor(10+Math.random()*90);
  while(qSub(id)){id='SUB-'+base+Math.floor(10+Math.random()*90);}
  SUBJECTS.push({id:id,name:vN,group:'Umum',icn:'ti-book',img:imgData||null});
  if(!QMAT[id])QMAT[id]=[];
  closeModal();saveFilters();render(false);toast('Buku mapel ditambahkan','Isi materinya dari daftar isi.');
 };
 var f0=$('#qnName');if(f0)f0.focus();
}
function qSubjectsView(page,t){
 var subs=qSubFiltered();
 var total=subs.length;var pages=Math.max(1,Math.ceil(total/PG_SIZE));
 if(state.pg>pages)state.pg=pages;
 var pageSubs=subs.slice((state.pg-1)*PG_SIZE,state.pg*PG_SIZE);
 var body;
 if(state.loading)body=skelHTML(2,150);
else if(!subs.length)body='<div style="margin:14px 16px;border:1px dashed var(--border);border-radius:14px;padding:36px 20px;text-align:center;color:var(--text-2)"><b>Tidak ada mata pelajaran untuk filter ini.</b><br><span style="font-size:12.5px">Ubah kata kunci di atas.</span><br><br><button class="btn sm" data-reset>Reset filter</button></div>';
   else body='<div class="qsubs">'+pageSubs.map(qSubTileHTML).join('')+'</div>';
 return listHero(page,t,'<button class="btn primary" data-qsubnew>'+ic(P_PLUS,17)+'Tambah buku mapel</button>')
  +'<div class="card"><div class="card-h"><div><div><h2>Mata Pelajaran</h2></div></div><div class="sp"><button class="link" data-t="Menyiapkan export…">'+ic(P_DOWNLOAD,15)+'Export</button></div></div>'
  +filterBarHTML(SUBTOOLS,'Cari mata pelajaran…')
  +body+tfootHTML(total,'dari '+SUBJECTS.length+' mata pelajaran',pgNum(pages))+'</div>'+listFoot();
}
/* Daftar isi materi milik satu mapel. Cari + urut A–Z ikut tombol yang sama. */
function qTopFiltered(s){
 var out=qMats(s.id).filter(function(m){
  if(state.q&&(m.name+' '+s.name).toLowerCase().indexOf(state.q.toLowerCase())<0)return false;
  return true;
 });
 if(state.sort){var dir=state.sort==='asc'?1:-1;out.sort(function(a,b){return dir*a.name.localeCompare(b.name,'id',{numeric:true,sensitivity:'base'});});}
 return out;
}
function qTopTileHTML(s,m){
 var c=qTopCount(m.id);
 var pills=c.total?('<span class="bdg ok">'+c.live+' ready</span>'+(c.draft?'<span class="bdg warn">'+c.draft+' in review</span>':'')):'<span class="bdg">Belum ada soal</span>';
 var sub=c.total?(c.total+' soal'):'0 soal';
 return '<button class="qtop-row" data-qtop="'+esc(m.id)+'" aria-label="Buka materi '+esc(m.name)+', '+c.total+' soal">'
 +'<span class="et"><span class="et-t">'+esc(m.name)+'</span><br><time>'+esc(sub)+'</time></span>'
 +'<span style="display:flex;gap:6px;align-items:center;flex:0 0 auto">'+pills+'</span>'
 +'<span style="color:var(--text-3);flex:0 0 auto">'+ic(P_CHR,16)+'</span></button>';
}
function qTopicsView(page,t,s){
 var mats=qTopFiltered(s);
 var c=qSubCount(s);
 var total=mats.length;var pages=Math.max(1,Math.ceil(total/PG_SIZE));
 if(state.pg>pages)state.pg=pages;
 var pageMats=mats.slice((state.pg-1)*PG_SIZE,state.pg*PG_SIZE);
 var body;
 if(state.loading)body=skelHTML(2,150);
 else if(!mats.length)body='<div style="margin:14px 16px;border:1px dashed var(--border);border-radius:14px;padding:36px 20px;text-align:center;color:var(--text-2)">'
  +(qMats(s.id).length?('<b>Tidak ada materi untuk filter ini.</b><br><span style="font-size:12.5px">Ubah kata kunci di atas.</span><br><br><button class="btn sm" data-reset>Reset filter</button>')
  :('<b>Belum ada materi di '+esc(s.name)+'.</b><br><span style="font-size:12.5px">Daftar isi masih kosong.</span>'))
  +'</div>';
 else body='<div class="qtop-list">'+pageMats.map(function(m){return qTopTileHTML(s,m);}).join('')+'</div>';
 var meta=qMats(s.id).length+' materi · '+c.total+' soal';
 return '<div class="card"><div class="card-h"><button class="link" data-qback aria-label="Kembali ke daftar mata pelajaran" title="Kembali">'+ic(P_CHL,15)+'</button><span style="width:32px;aspect-ratio:3/4;border-radius:8px;overflow:hidden;flex:0 0 32px;background:var(--bg-hover);display:grid;place-items:center;color:var(--text-3)">'+(s.img?'<img src="'+esc(s.img)+'" alt="" style="width:100%;height:100%;object-fit:cover">':'')+'</span><div><div><h2>'+esc(s.name)+'</h2><p>'+meta+'</p></div></div><button class="mini-btn" data-qsubedit="'+esc(s.id)+'" title="Ubah mapel" aria-label="Ubah '+esc(s.name)+'">'+ic(P_PENCIL,14)+'<span>Ubah</span></button><div class="sp"><button class="link" data-t="Menyiapkan export…">'+ic(P_DOWNLOAD,15)+'Export</button></div></div>'
  +filterBarHTML(TOPICSORT,'Cari materi…','flex:0 0 auto;width:50%;min-width:220px')
 +body+tfootHTML(total,'dari '+qMats(s.id).length+' materi',pgNum(pages))+'</div>'+listFoot();
}
/* Baris soal milik satu materi. Memakai filteredRows apa adanya lalu
   menyaring lagi per materi, jadi chip, select, cari, dan urut tetap berlaku. */
function qTopicRows(m){return filteredRows(featOf('questions')).filter(function(d){return d.mat===m.id;});}
function qQuestionsView(page,t,s,m){
 var rows=qTopicRows(m);
 var c=qTopCount(m.id);
 var total=rows.length;var pages=Math.max(1,Math.ceil(total/PG_SIZE));
 if(state.pg>pages)state.pg=pages;
 var pageRows=rows.slice((state.pg-1)*PG_SIZE,state.pg*PG_SIZE);
 var body;
 if(state.loading)body=skelHTML(2,180);
  else if(!rows.length)body='<div style="margin:14px 16px;border:1px dashed var(--border);border-radius:14px;padding:36px 20px;text-align:center;color:var(--text-2)">'
   +(c.total?('<b>Belum ada soal untuk filter ini.</b><br><span style="font-size:12.5px">Ubah kata kunci atau atur filter di atas.</span><br><br><button class="btn sm" data-reset>Reset filter</button>')
   :('<b>Belum ada soal di '+esc(m.name)+'.</b><br><span style="font-size:12.5px">Mulai dari satu soal, lalu lengkapi kunci dan pembahasannya.</span>'))
   +'</div>';
  else body='<div class="qlist">'+pageRows.map(function(d,i){return qCardHTML(d,rows.indexOf(d)+1,i);}).join('')+'</div>';
 var meta=esc(s.name)+' · '+c.total+' soal · '+c.live+' ready'+(c.draft?(' · '+c.draft+' in review'):'');
  return '<div class="card"><div class="card-h"><button class="link" data-qtopback aria-label="Kembali ke daftar materi" title="Kembali">'+ic(P_CHL,15)+'</button><div><div><h2>Soal '+esc(m.name)+'</h2><p>'+meta+'</p></div></div><div class="sp"><button class="btn sm" data-qimport>'+ic(P_UPLOAD,15)+'Import</button><button class="btn sm primary" data-qsoalnew>'+ic(P_PLUS,15)+'Tambah soal</button><button class="link" data-t="Menyiapkan export…">'+ic(P_DOWNLOAD,15)+'Export</button></div></div>'
  +filterBarHTML(t,'Cari isi soal, topik, atau ID…')
  +body+tfootHTML(total,'soal dari '+c.total+' di '+esc(m.name),pgNum(pages))+'</div>'+listFoot();
}
function questionsView(page,t){
 var s=state.qsub?qSub(state.qsub):null;
 if(!s)return qSubjectsView(page,t);
 var m=state.qtop?qTop(state.qtop):null;
 if(!m)return qTopicsView(page,t,s);
 return qQuestionsView(page,t,s,m);
}
