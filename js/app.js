/* ==========================================================================
   Alur kartu: amplop → kartu → galeri → kue
   Semua teks diambil dari pengaturan.js. File ini tidak perlu diubah.
   ========================================================================== */
(function () {
  const BAWAAN = {
    namaPanggilan: 'Sayang', namaLengkap: '', usiaKe: 26, tanggalUlangTahun: '',
    inisialSegel: '♥', judulSampul: 'Selamat ulang tahun', kutipanSampul: '',
    fotoUtama: '', salam: '', pesan: [], penutup: '', tandaTangan: '',
    judulGaleri: 'Kenangan kita', subjudulGaleri: '', foto: [],
    ajakanKue: 'Buat permohonan,', ajakanKue2: 'lalu tiup lilinnya.',
    ucapanAkhir: '', ucapanAkhirKecil: '', musik: '', volumeMusik: 0.7,
    kecepatanKetik: 24, tampilkanHitungMundur: true
  };
  const K = Object.assign({}, BAWAAN, window.PENGATURAN || {});
  if (typeof K.pesan === 'string') K.pesan = [K.pesan];
  if (!Array.isArray(K.foto)) K.foto = [];

  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));
  const kurangiGerak = window.Efek ? Efek.kurangiGerak : false;
  const layarLebar = () => window.matchMedia('(min-width: 860px)').matches;

  /* ---------------- Isi teks dari pengaturan ---------------- */
  function tanggalTeks() {
    const [y, m, d] = String(K.tanggalUlangTahun).split('-').map(Number);
    if (!y || !m || !d) return { teks: K.tanggalUlangTahun, tanggal: null };
    const tanggal = new Date(y, m - 1, d);
    const teks = new Intl.DateTimeFormat('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }).format(tanggal);
    return { teks, tanggal };
  }

  function isiTeks() {
    $$('[data-isi]').forEach(el => {
      const nilai = K[el.dataset.isi];
      if (nilai !== undefined && nilai !== null) el.textContent = nilai;
    });
    const { teks } = tanggalTeks();
    $$('[data-tanggal]').forEach(el => { el.textContent = teks; });
    $$('[data-foto-utama]').forEach(img => {
      if (K.fotoUtama) { img.src = K.fotoUtama; img.alt = `Foto ${K.namaPanggilan}`; }
      else (img.closest('figure') || img).hidden = true;
    });
    $('#pesan-lengkap').textContent = K.pesan.join(' ');
    document.title = `Selamat ulang tahun, ${K.namaPanggilan}`;
  }

  function hitungMundur() {
    const el = $('#hitung-mundur');
    const { tanggal } = tanggalTeks();
    if (!K.tampilkanHitungMundur || !tanggal) { el.hidden = true; return; }
    const kini = new Date();
    const hariIni = new Date(kini.getFullYear(), kini.getMonth(), kini.getDate());
    const selisih = Math.round((tanggal - hariIni) / 86400000);
    if (selisih > 1) el.textContent = `${selisih} hari lagi menuju hari spesialmu`;
    else if (selisih === 1) el.textContent = 'Besok hari spesialmu';
    else if (selisih === 0) el.textContent = 'Hari ini hari spesialmu';
    else el.hidden = true;
  }

  /* ---------------- Perpindahan adegan ---------------- */
  function tampilkan(nama) {
    $$('.adegan').forEach(a => a.classList.toggle('aktif', a.id === `adegan-${nama}`));
    const target = $(`#adegan-${nama}`);
    target.scrollTop = 0;
    const fokus = target.querySelector('h2[tabindex]');
    if (fokus) setTimeout(() => fokus.focus({ preventScroll: true }), 400);
  }

  /* ---------------- Musik ---------------- */
  const tombolMusik = $('#tombol-musik');
  function aturTombolMusik(nyala) {
    tombolMusik.classList.toggle('mati', !nyala);
    tombolMusik.setAttribute('aria-label', nyala ? 'Matikan musik' : 'Nyalakan musik');
  }
  tombolMusik.addEventListener('click', () => aturTombolMusik(Musik.alihkan()));

  let dijedaOtomatis = false;
  document.addEventListener('visibilitychange', () => {
    if (document.hidden && Musik.sedangMain()) { Musik.jeda(); dijedaOtomatis = true; }
    else if (!document.hidden && dijedaOtomatis) { dijedaOtomatis = false; Musik.putar(); }
  });

  /* ---------------- 1. Amplop ---------------- */
  const amplop = $('#amplop');
  amplop.addEventListener('click', () => {
    if (amplop.classList.contains('terbuka')) return;
    Musik.putar();
    tombolMusik.hidden = false;
    aturTombolMusik(true);
    amplop.classList.add('terbuka');
    $('#adegan-amplop').classList.add('dibuka');
    amplop.setAttribute('aria-label', 'Amplop terbuka');
    setTimeout(() => tampilkan('kartu'), kurangiGerak ? 300 : 1900);
  });

  /* ---------------- 2. Kartu ---------------- */
  const kartu = $('#kartu');
  const sampul = $('#sampul');
  const petunjukKartu = $('#petunjuk-kartu');
  let kartuTerbuka = false;

  function bukaKartu() {
    if (kartuTerbuka) return;
    kartuTerbuka = true;
    kartu.classList.add('terbuka');
    sampul.removeAttribute('role');
    sampul.removeAttribute('tabindex');
    sampul.removeAttribute('aria-label');
    petunjukKartu.classList.add('sembunyi');

    setTimeout(() => {
      const r = kartu.getBoundingClientRect();
      Efek.tabur({ x: window.innerWidth / 2, y: r.top + r.height * 0.3, jumlah: 90 });
    }, kurangiGerak ? 0 : 1000);

    setTimeout(() => {
      petunjukKartu.textContent = 'Ketuk tulisannya untuk menampilkan semua';
      petunjukKartu.classList.remove('sembunyi');
      mesinKetik();
    }, kurangiGerak ? 200 : 1600);
  }
  sampul.addEventListener('click', bukaKartu);
  sampul.addEventListener('keydown', e => {
    if (!kartuTerbuka && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); bukaKartu(); }
  });

  /* Mesin ketik */
  const halaman = $('#halaman-pesan');
  const wadahPesan = $('#pesan');
  let timerKetik = null;
  let ketikSelesai = false;
  let lewati = false;

  function mesinKetik() {
    wadahPesan.innerHTML = '';
    if (kurangiGerak) return tampilkanSemua();
    const kecepatan = Math.max(5, Number(K.kecepatanKetik) || 24);
    const kursor = document.createElement('span');
    kursor.className = 'kursor';
    let pi = 0, ci = 0, p = null, simpul = null;

    function berikut() {
      if (lewati) return tampilkanSemua();
      if (pi >= K.pesan.length) { kursor.remove(); return selesai(); }
      if (!p) {
        p = document.createElement('p');
        simpul = document.createTextNode('');
        p.append(simpul, kursor);
        wadahPesan.appendChild(p);
      }
      const teks = K.pesan[pi];
      const huruf = teks[ci] || '';
      simpul.textContent += huruf;
      ci++;

      const dekatBawah = halaman.scrollHeight - halaman.scrollTop - halaman.clientHeight < 140;
      if (dekatBawah) halaman.scrollTop = halaman.scrollHeight;

      let jeda = kecepatan;
      if (/[.!?]/.test(huruf)) jeda = kecepatan * 14;
      else if (/[,;:]/.test(huruf)) jeda = kecepatan * 6;
      if (ci >= teks.length) { pi++; ci = 0; p = null; jeda = kecepatan * 22; }
      timerKetik = setTimeout(berikut, jeda);
    }
    berikut();
  }

  function tampilkanSemua() {
    clearTimeout(timerKetik);
    wadahPesan.innerHTML = '';
    K.pesan.forEach(t => {
      const p = document.createElement('p');
      p.textContent = t;
      wadahPesan.appendChild(p);
    });
    selesai();
  }

  function selesai() {
    if (ketikSelesai) return;
    ketikSelesai = true;
    $('#tanda').classList.add('tampil');
    petunjukKartu.classList.add('sembunyi');
    $('#aksi-kartu').classList.add('tampil');
    setTimeout(() => {
      if (halaman.scrollHeight > halaman.clientHeight) {
        halaman.scrollTo({ top: halaman.scrollHeight, behavior: kurangiGerak ? 'auto' : 'smooth' });
      }
    }, 300);
  }

  halaman.addEventListener('click', () => { if (kartuTerbuka && !ketikSelesai) lewati = true; });

  /* ---------------- 3. Galeri ---------------- */
  const KEMIRINGAN = [-3.5, 2.5, -1.5, 3, -2.5, 1.5, -3, 2];

  function bangunGaleri() {
    const ul = $('#galeri');
    ul.innerHTML = '';
    K.foto.forEach((f, i) => {
      const li = document.createElement('li');
      li.style.setProperty('--i', i);
      li.style.setProperty('--r', `${KEMIRINGAN[i % KEMIRINGAN.length]}deg`);

      const tombol = document.createElement('button');
      tombol.type = 'button';
      tombol.className = 'polaroid';
      tombol.setAttribute('aria-label', `Perbesar foto: ${f.keterangan || `foto ${i + 1}`}`);

      const img = document.createElement('img');
      img.src = f.src;
      img.alt = f.keterangan || '';
      img.loading = 'lazy';
      img.decoding = 'async';
      img.addEventListener('error', () => {
        const ganti = document.createElement('span');
        ganti.className = 'foto-hilang';
        ganti.textContent = `Foto belum ditemukan:\n${f.src}`;
        img.replaceWith(ganti);
      });

      const ket = document.createElement('span');
      ket.className = 'polaroid__ket';
      ket.textContent = f.keterangan || '';

      tombol.append(img, ket);
      tombol.addEventListener('click', () => bukaLightbox(i, tombol));
      li.appendChild(tombol);
      ul.appendChild(li);
    });
  }

  /* Foto besar */
  const lb = $('#lightbox');
  const lbFoto = $('#lb-foto');
  const lbKet = $('#lb-ket');
  let lbIndeks = 0;
  let lbAsal = null;

  function isiLightbox() {
    const f = K.foto[lbIndeks];
    lbFoto.src = f.src;
    lbFoto.alt = f.keterangan || '';
    lbKet.textContent = f.keterangan || '';
  }
  function bukaLightbox(i, asal) {
    lbIndeks = i;
    lbAsal = asal;
    isiLightbox();
    lb.hidden = false;
    requestAnimationFrame(() => lb.classList.add('tampil'));
    $('#lb-tutup').focus();
  }
  function tutupLightbox() {
    lb.classList.remove('tampil');
    setTimeout(() => { lb.hidden = true; }, 250);
    if (lbAsal) lbAsal.focus();
  }
  function geser(arah) {
    if (!K.foto.length) return;
    lbIndeks = (lbIndeks + arah + K.foto.length) % K.foto.length;
    isiLightbox();
  }
  $('#lb-tutup').addEventListener('click', tutupLightbox);
  $('#lb-kiri').addEventListener('click', () => geser(-1));
  $('#lb-kanan').addEventListener('click', () => geser(1));
  lb.addEventListener('click', e => { if (e.target === lb) tutupLightbox(); });
  document.addEventListener('keydown', e => {
    if (lb.hidden) return;
    if (e.key === 'Escape') tutupLightbox();
    if (e.key === 'ArrowLeft') geser(-1);
    if (e.key === 'ArrowRight') geser(1);
  });
  let sentuhX = null;
  lb.addEventListener('touchstart', e => { sentuhX = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', e => {
    if (sentuhX === null) return;
    const dx = e.changedTouches[0].clientX - sentuhX;
    if (Math.abs(dx) > 45) geser(dx < 0 ? 1 : -1);
    sentuhX = null;
  });

  /* ---------------- 4. Kue ---------------- */
  let sudahDirayakan = false;

  function bangunLilin() {
    const wadah = $('#lilin-wadah');
    String(K.usiaKe).split('').forEach(angka => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'lilin';
      b.setAttribute('aria-label', `Tiup lilin angka ${angka}`);
      b.innerHTML =
        '<span class="api" aria-hidden="true"></span>' +
        '<span class="sumbu" aria-hidden="true"></span>' +
        '<span class="asap" aria-hidden="true"></span>' +
        `<span class="angka" aria-hidden="true">${angka}</span>`;
      b.addEventListener('click', () => tiup(b));
      wadah.appendChild(b);
    });
  }

  function tiup(lilin) {
    if (lilin.classList.contains('padam')) return;
    lilin.classList.add('padam');
    lilin.disabled = true;
    if (!$$('.lilin:not(.padam)').length) semuaPadam();
  }

  function tiupSemua() {
    $$('.lilin:not(.padam)').forEach((l, i) => setTimeout(() => tiup(l), i * 160));
  }

  function semuaPadam() {
    if (sudahDirayakan) return;
    sudahDirayakan = true;
    hentikanMic();
    $('#kue').classList.add('padam');
    $('#aksi-kue').classList.remove('tampil');
    $('#status-mic').hidden = true;
    setTimeout(() => { $('#aksi-kue').hidden = true; }, 600);
    setTimeout(rayakan, kurangiGerak ? 100 : 700);
  }

  function rayakan() {
    const r = $('#kue').getBoundingClientRect();
    Efek.tabur({ x: window.innerWidth / 2, y: r.top + 30, jumlah: 150, sebar: 1.2 });
    setTimeout(() => Efek.tabur({ x: window.innerWidth * 0.18, y: window.innerHeight * 0.35, jumlah: 70 }), 450);
    setTimeout(() => Efek.tabur({ x: window.innerWidth * 0.82, y: window.innerHeight * 0.35, jumlah: 70 }), 800);
    Efek.hujan(3200);

    const akhir = $('#akhir');
    akhir.hidden = false;
    requestAnimationFrame(() => requestAnimationFrame(() => akhir.classList.add('tampil')));
    setTimeout(() => {
      akhir.scrollIntoView({ behavior: kurangiGerak ? 'auto' : 'smooth', block: 'center' });
    }, 400);
  }

  $('#tiup').addEventListener('click', tiupSemua);

  /* Tiup sungguhan lewat mikrofon (hanya bekerja di https atau localhost) */
  let micStream = null;
  let micCtx = null;
  let micRaf = null;

  async function mulaiMic() {
    const status = $('#status-mic');
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      status.textContent = 'Mikrofon tidak tersedia di sini. Ketuk lilinnya saja, ya.';
      return;
    }
    $('#tiup-mic').disabled = true;
    status.textContent = 'Izinkan mikrofon dulu…';
    try {
      micStream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: false, autoGainControl: false }
      });
      const AC = window.AudioContext || window.webkitAudioContext;
      micCtx = new AC();
      const sumber = micCtx.createMediaStreamSource(micStream);
      const analis = micCtx.createAnalyser();
      analis.fftSize = 1024;
      sumber.connect(analis);
      const data = new Float32Array(analis.fftSize);
      status.textContent = 'Sekarang tiup ke arah mikrofon…';
      let berturut = 0;
      const dengar = () => {
        analis.getFloatTimeDomainData(data);
        let jumlah = 0;
        for (let i = 0; i < data.length; i++) jumlah += data[i] * data[i];
        const rms = Math.sqrt(jumlah / data.length);
        berturut = rms > 0.14 ? berturut + 1 : Math.max(0, berturut - 1);
        if (berturut > 8) { status.textContent = ''; tiupSemua(); return; }
        micRaf = requestAnimationFrame(dengar);
      };
      dengar();
    } catch (err) {
      status.textContent = 'Mikrofon tidak bisa dipakai. Ketuk lilinnya saja, ya.';
      $('#tiup-mic').disabled = false;
      hentikanMic();
    }
  }

  function hentikanMic() {
    cancelAnimationFrame(micRaf);
    if (micStream) micStream.getTracks().forEach(t => t.stop());
    micStream = null;
    if (micCtx) micCtx.close();
    micCtx = null;
  }

  $('#tiup-mic').addEventListener('click', mulaiMic);

  /* ---------------- Navigasi ---------------- */
  $$('[data-ke]').forEach(b => b.addEventListener('click', () => tampilkan(b.dataset.ke)));
  $('#ulangi').addEventListener('click', () => window.location.reload());

  /* ---------------- Mulai ---------------- */
  isiTeks();
  hitungMundur();
  bangunGaleri();
  bangunLilin();
  Efek.mulaiLatar($('#latar'));
  Efek.siapkanKonfeti($('#konfeti'));
  Musik.siapkan(K.musik, K.volumeMusik);
})();
