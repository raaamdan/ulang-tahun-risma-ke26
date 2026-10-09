/* ==========================================================================
   Musik latar
   - Memutar file MP3 dari pengaturan.js (assets/musik/lagu.mp3)
   - Kalau file tidak ada, otomatis memutar alunan kotak musik buatan sendiri
     (melodi "Selamat Ulang Tahun" + iringan lembut) lewat Web Audio.
   Tidak perlu diubah.
   ========================================================================== */
(function () {
  let ctx = null;
  let keluaran = null;
  let gema = null;
  let busSesi = null;
  let audioEl = null;

  let pakaiSynth = false;
  let sedangMain = false;
  let synthAktif = false;
  let volume = 0.7;

  let intervalId = null;
  let mulaiWaktu = 0;
  let indeks = 0;
  let putaran = 0;

  const KETUK = 0.6; // detik per ketukan
  const URUTAN = buatUrutan();

  /* ---------- Persiapan ---------- */
  function siapkan(src, vol) {
    if (typeof vol === 'number') volume = Math.max(0, Math.min(1, vol));
    if (!src) { pakaiSynth = true; return; }
    audioEl = new Audio();
    audioEl.loop = true;
    audioEl.preload = 'auto';
    audioEl.volume = volume;
    audioEl.addEventListener('error', () => {
      pakaiSynth = true;
      if (sedangMain && !synthAktif) mulaiSynth();
    });
    audioEl.src = src;
  }

  function bukaKonteks() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return;
      ctx = new AC();
      const kompresor = ctx.createDynamicsCompressor();
      kompresor.threshold.value = -14;
      kompresor.ratio.value = 4;
      kompresor.connect(ctx.destination);
      keluaran = kompresor;
      gema = buatGema();
    }
    if (ctx.state === 'suspended') ctx.resume();
  }

  function buatGema() {
    const panjang = Math.floor(ctx.sampleRate * 2.6);
    const buf = ctx.createBuffer(2, panjang, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < panjang; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / panjang, 2.8);
    }
    const conv = ctx.createConvolver();
    conv.buffer = buf;
    const basah = ctx.createGain();
    basah.gain.value = 0.32;
    conv.connect(basah).connect(keluaran);
    return conv;
  }

  /* ---------- Kontrol ---------- */
  function putar() {
    sedangMain = true;
    bukaKonteks(); // harus dipanggil saat pengguna mengetuk, supaya suara diizinkan browser
    if (!pakaiSynth && audioEl) {
      const janji = audioEl.play();
      if (janji && janji.catch) {
        janji.catch(err => {
          if (err && err.name === 'NotSupportedError') {
            pakaiSynth = true;
            if (sedangMain && !synthAktif) mulaiSynth();
          }
        });
      }
      return;
    }
    if (!synthAktif) mulaiSynth();
  }

  function jeda() {
    sedangMain = false;
    if (audioEl) audioEl.pause();
    hentikanSynth();
  }

  function alihkan() {
    if (sedangMain) { jeda(); return false; }
    putar();
    return true;
  }

  /* ---------- Kotak musik ---------- */
  function frek(midi) { return 440 * Math.pow(2, (midi - 69) / 12); }

  function nada(waktu, midi, durasi, kuat) {
    const f = frek(midi);
    const habis = waktu + Math.max(1.4, durasi * 1.9);
    const amp = ctx.createGain();
    amp.gain.setValueAtTime(0.0001, waktu);
    amp.gain.exponentialRampToValueAtTime(kuat, waktu + 0.006);
    amp.gain.exponentialRampToValueAtTime(0.0001, habis);

    const o1 = ctx.createOscillator(); o1.type = 'sine'; o1.frequency.value = f;
    const o2 = ctx.createOscillator(); o2.type = 'sine'; o2.frequency.value = f * 2;
    const o3 = ctx.createOscillator(); o3.type = 'triangle'; o3.frequency.value = f * 3.01;
    const g2 = ctx.createGain();
    g2.gain.setValueAtTime(0.28, waktu);
    g2.gain.exponentialRampToValueAtTime(0.001, waktu + 0.5);
    const g3 = ctx.createGain(); g3.gain.value = 0.04;

    o1.connect(amp);
    o2.connect(g2).connect(amp);
    o3.connect(g3).connect(amp);
    amp.connect(busSesi);
    [o1, o2, o3].forEach(o => { o.start(waktu); o.stop(habis + 0.05); });
  }

  function mulaiSynth() {
    if (!ctx) return;
    synthAktif = true;
    busSesi = ctx.createGain();
    busSesi.gain.value = volume * 0.55;
    busSesi.connect(keluaran);
    busSesi.connect(gema);
    mulaiWaktu = ctx.currentTime + 0.2;
    indeks = 0;
    putaran = 0;
    jadwalkan();
    intervalId = setInterval(jadwalkan, 100);
  }

  function jadwalkan() {
    if (!synthAktif) return;
    const batas = ctx.currentTime + 0.7;
    const ev = URUTAN.peristiwa;
    while (true) {
      const e = ev[indeks];
      const t = mulaiWaktu + (putaran * URUTAN.panjang + e.b) * KETUK;
      if (t > batas) break;
      if (t >= ctx.currentTime - 0.05) nada(Math.max(t, ctx.currentTime), e.m, e.d * KETUK, e.v);
      indeks++;
      if (indeks >= ev.length) { indeks = 0; putaran++; }
    }
  }

  function hentikanSynth() {
    synthAktif = false;
    clearInterval(intervalId);
    if (busSesi && ctx) {
      const b = busSesi;
      b.gain.setTargetAtTime(0, ctx.currentTime, 0.08);
      setTimeout(() => b.disconnect(), 700);
      busSesi = null;
    }
  }

  /* Partitur: b = ketukan mulai, m = nada (MIDI), d = lama (ketukan), v = kekuatan */
  function buatUrutan() {
    const N = {
      Bb2: 46, C3: 48, D3: 50, F3: 53, G3: 55, A3: 57, Bb3: 58,
      C4: 60, D4: 62, E4: 64, F4: 65, G4: 67, A4: 69, Bb4: 70,
      C5: 72, D5: 74, E5: 76, F5: 77, G5: 79, A5: 81, Bb5: 82, C6: 84, D6: 86
    };
    const ev = [];
    let b = 0;

    // Bagian A: melodi "Selamat Ulang Tahun" (lagu tradisional, domain publik)
    const melodi = [
      ['C5', .75], ['C5', .25], ['D5', 1], ['C5', 1], ['F5', 1], ['E5', 2],
      ['C5', .75], ['C5', .25], ['D5', 1], ['C5', 1], ['G5', 1], ['F5', 2],
      ['C5', .75], ['C5', .25], ['C6', 1], ['A5', 1], ['F5', 1], ['E5', 1], ['D5', 1],
      ['Bb5', .75], ['Bb5', .25], ['A5', 1], ['F5', 1], ['G5', 1], ['F5', 3]
    ];
    for (const [n, d] of melodi) { ev.push({ b, m: N[n], d, v: 0.3 }); b += d; }

    const akorA = [
      ['F3', ['A3', 'C4']], ['C3', ['G3', 'E4']], ['C3', ['G3', 'E4']], ['F3', ['A3', 'C4']],
      ['F3', ['A3', 'C4']], ['Bb2', ['Bb3', 'D4']], ['C3', ['G3', 'E4']], ['F3', ['A3', 'C4']]
    ];
    akorA.forEach(([akar, isi], i) => {
      const awal = 1 + i * 3;
      ev.push({ b: awal, m: N[akar], d: 3, v: 0.15 });
      isi.forEach(n => {
        ev.push({ b: awal + 1, m: N[n], d: 1, v: 0.06 });
        ev.push({ b: awal + 2, m: N[n], d: 1, v: 0.06 });
      });
    });

    // Bagian B: arpeggio lembut (gubahan sendiri)
    const mulaiB = 28;
    const arpeggio = {
      F: ['F3', [65, 69, 72, 77]],
      Dm: ['D3', [62, 65, 69, 74]],
      Bb: ['Bb2', [58, 62, 65, 70]],
      C: ['C3', [60, 64, 67, 72]]
    };
    const progresi = ['F', 'Dm', 'Bb', 'C', 'F', 'Dm', 'Bb', 'C'];
    const atas = [
      [['A5', 2], ['G5', 1]], [['F5', 2], ['A5', 1]], [['D6', 2], ['C6', 1]], [['G5', 3]],
      [['A5', 2], ['C6', 1]], [['D6', 2], ['C6', 1]], [['Bb5', 2], ['A5', 1]], [['G5', 2], ['E5', 1]]
    ];
    const pola = [0, 1, 2, 3, 2, 1];
    progresi.forEach((nama, i) => {
      const awal = mulaiB + i * 3;
      const [akar, nadaArp] = arpeggio[nama];
      ev.push({ b: awal, m: N[akar], d: 3, v: 0.13 });
      pola.forEach((p, j) => ev.push({ b: awal + j * 0.5, m: nadaArp[p], d: 0.5, v: 0.07 }));
      let t = awal;
      for (const [n, d] of atas[i]) { ev.push({ b: t, m: N[n], d, v: 0.22 }); t += d; }
    });

    ev.sort((a, c) => a.b - c.b);
    return { peristiwa: ev, panjang: 54 };
  }

  window.Musik = {
    siapkan,
    putar,
    jeda,
    alihkan,
    bukaKonteks,
    sedangMain: () => sedangMain
  };
})();
