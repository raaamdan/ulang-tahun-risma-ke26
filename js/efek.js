/* ==========================================================================
   Efek visual: langit berbintang + debu emas (latar) dan konfeti
   Tidak perlu diubah.
   ========================================================================== */
(function () {
  const kurangiGerak = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function siapkanKanvas(canvas, onUkur) {
    const ctx = canvas.getContext('2d');
    const state = { ctx, w: 0, h: 0 };
    function ukur() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      state.w = canvas.clientWidth;
      state.h = canvas.clientHeight;
      canvas.width = Math.round(state.w * dpr);
      canvas.height = Math.round(state.h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (onUkur) onUkur(state);
    }
    window.addEventListener('resize', ukur);
    ukur();
    return state;
  }

  /* ---------------- Latar ---------------- */
  function mulaiLatar(canvas) {
    let bintang = [];
    let debu = [];
    let s = null;

    function buatDebu(acak) {
      return {
        x: Math.random() * s.w,
        y: acak ? Math.random() * s.h : s.h + 12,
        r: Math.random() * 1.6 + 0.6,
        vy: -(0.12 + Math.random() * 0.28),
        vx: (Math.random() - 0.5) * 0.12,
        f: Math.random() * Math.PI * 2,
        a: 0.2 + Math.random() * 0.4
      };
    }
    function buat(st) {
      s = st;
      const n = Math.round(Math.min(130, (st.w * st.h) / 8500));
      bintang = Array.from({ length: n }, () => ({
        x: Math.random() * st.w,
        y: Math.random() * st.h * 0.8,
        r: Math.random() * 1.05 + 0.25,
        f: Math.random() * Math.PI * 2,
        k: 0.3 + Math.random() * 0.9
      }));
      debu = Array.from({ length: st.w < 600 ? 12 : 22 }, () => buatDebu(true));
      if (kurangiGerak) gambar(0);
    }

    function gambar(t) {
      const { ctx, w, h } = s;
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#FBEFE8';
      for (const b of bintang) {
        const kerlip = Math.sin(t * 0.001 * b.k + b.f);
        ctx.globalAlpha = kurangiGerak ? 0.55 : 0.25 + 0.6 * kerlip * kerlip;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.globalAlpha = 1;
      for (const d of debu) {
        if (!kurangiGerak) {
          d.y += d.vy;
          d.x += d.vx + Math.sin(t * 0.0005 + d.f) * 0.1;
          if (d.y < -12) Object.assign(d, buatDebu(false));
        }
        const g = ctx.createRadialGradient(d.x, d.y, 0, d.x, d.y, d.r * 4);
        g.addColorStop(0, `rgba(243,221,166,${d.a})`);
        g.addColorStop(1, 'rgba(243,221,166,0)');
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r * 4, 0, Math.PI * 2);
        ctx.fill();
      }
      if (!kurangiGerak) requestAnimationFrame(gambar);
    }
    siapkanKanvas(canvas, buat);
    if (!kurangiGerak) requestAnimationFrame(gambar);
  }

  /* ---------------- Konfeti ---------------- */
  const WARNA = ['#F3DDA6', '#D8B26E', '#E592A6', '#F8E8E5', '#B8405F', '#F2A7B8'];
  let k = null;
  let partikel = [];
  let berjalan = false;

  function siapkanKonfeti(canvas) { k = siapkanKanvas(canvas); }

  function partikelBaru(x, y, vx, vy, i) {
    const acak = Math.random();
    return {
      x, y, vx, vy,
      rot: Math.random() * 360,
      vr: (Math.random() - 0.5) * 10,
      ukuran: 6 + Math.random() * 7,
      warna: WARNA[i % WARNA.length],
      bentuk: acak < 0.35 ? 'hati' : acak < 0.68 ? 'kelopak' : 'kertas',
      umur: 0,
      maks: 150 + Math.random() * 90,
      goyang: Math.random() * Math.PI * 2
    };
  }

  function jalankan() {
    if (!berjalan) { berjalan = true; requestAnimationFrame(langkah); }
  }

  function tabur(opsi = {}) {
    if (!k) return;
    const x = opsi.x ?? k.w / 2;
    const y = opsi.y ?? k.h / 2;
    const sebar = opsi.sebar ?? 1;
    let jumlah = opsi.jumlah ?? 120;
    if (kurangiGerak) jumlah = Math.round(jumlah / 5);
    for (let i = 0; i < jumlah; i++) {
      const sudut = Math.random() * Math.PI * 2;
      const kec = (3 + Math.random() * 8) * sebar;
      partikel.push(partikelBaru(x, y, Math.cos(sudut) * kec, Math.sin(sudut) * kec - 4.5, i));
    }
    jalankan();
  }

  function hujan(durasi = 2500) {
    if (!k || kurangiGerak) return;
    const akhir = performance.now() + durasi;
    let i = 0;
    const id = setInterval(() => {
      if (performance.now() > akhir) return clearInterval(id);
      for (let j = 0; j < 4; j++) {
        const p = partikelBaru(Math.random() * k.w, -16, (Math.random() - 0.5) * 1.5, 1.5 + Math.random() * 2.5, i++);
        p.maks = 400;
        partikel.push(p);
      }
      jalankan();
    }, 70);
  }

  function gambarBentuk(ctx, p) {
    const s = p.ukuran;
    ctx.beginPath();
    if (p.bentuk === 'hati') {
      ctx.moveTo(0, s * 0.5);
      ctx.bezierCurveTo(-s, -s * 0.1, -s * 0.5, -s * 0.85, 0, -s * 0.25);
      ctx.bezierCurveTo(s * 0.5, -s * 0.85, s, -s * 0.1, 0, s * 0.5);
      ctx.fill();
    } else if (p.bentuk === 'kelopak') {
      ctx.ellipse(0, 0, s * 0.32, s * 0.68, 0, 0, Math.PI * 2);
      ctx.fill();
    } else {
      ctx.fillRect(-s / 2, -s / 4, s, s / 2);
    }
  }

  function langkah() {
    const { ctx, w, h } = k;
    ctx.clearRect(0, 0, w, h);
    partikel = partikel.filter(p => p.umur < p.maks && p.y < h + 40);
    for (const p of partikel) {
      p.umur++;
      p.vx *= 0.985;
      p.vy = p.vy * 0.985 + 0.16;
      p.x += p.vx + Math.sin(p.umur * 0.07 + p.goyang) * 0.7;
      p.y += p.vy;
      p.rot += p.vr;
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, (p.maks - p.umur) / 40));
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.fillStyle = p.warna;
      gambarBentuk(ctx, p);
      ctx.restore();
    }
    if (partikel.length) {
      requestAnimationFrame(langkah);
    } else {
      berjalan = false;
      ctx.clearRect(0, 0, w, h);
    }
  }

  window.Efek = { mulaiLatar, siapkanKonfeti, tabur, hujan, kurangiGerak };
})();
