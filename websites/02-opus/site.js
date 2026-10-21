
/* Opus landing — interactions and prototype states from Figma */
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const sleep = ms => new Promise(r => setTimeout(r, ms));

  /* Run a loop only while its element is on screen */
  function whileVisible(el, start, stop, threshold = 0.25) {
    let on = false;
    new IntersectionObserver(([e]) => {
      if (e.isIntersecting && !on) { on = true; start(); }
      else if (!e.isIntersecting && on) { on = false; stop && stop(); }
    }, { threshold }).observe(el);
  }

  /* ---------- Fit absolute Figma stages to their container ---------- */
  const fits = $$('.fit[data-w]');
  const mqPhone = matchMedia('(max-width: 640px)');
  const fitAll = () => fits.forEach(f => {
    const ph = mqPhone.matches && f.dataset.mw;
    const w = ph ? +f.dataset.mw : +f.dataset.w, h = ph ? +f.dataset.mh : +f.dataset.h;
    const k = ph ? Math.min(1.2, f.clientWidth / w) : Math.min(1, f.clientWidth / w);
    f.style.setProperty('--k', k);
    f.style.height = (h * k) + 'px';
  });
  mqPhone.addEventListener('change', fitAll);
  new ResizeObserver(fitAll).observe(document.body);
  fitAll();

  /* ---------- Buttons (refs: Osmo button pack text roll, 21st "Nothing-Plop" dot arrow): the label rolls up on hover,
     Accent and Primary CTAs carry a 5x5 dot grid that collapses into a dotted arrow ---------- */
  const ARROW_DOTS = [2, 8, 10, 11, 12, 13, 14, 18, 22];
  const rollLabel = b => {
    const label = b.textContent.trim(); if (!label || b.querySelector('.b-roll')) return;
    b.textContent = '';
    const roll = document.createElement('span'); roll.className = 'b-roll';
    for (let k = 0; k < 2; k++) { const t = document.createElement('span'); t.className = 'b-t'; t.textContent = label; if (k) t.setAttribute('aria-hidden', 'true'); roll.append(t); }
    b.append(roll);
    if ((b.classList.contains('btn-accent') || b.classList.contains('btn-primary')) && !b.closest('.stage, .pf-win, .cm-card, .nba-frame')) {
      const g = document.createElement('span'); g.className = 'b-dots'; g.setAttribute('aria-hidden', 'true');
      for (let i = 0; i < 25; i++) { const d = document.createElement('i'); if (ARROW_DOTS.includes(i)) d.className = 'a'; d.style.setProperty('--d', ((i % 5) * 22 + ((i / 5) | 0) * 8) + 'ms'); g.append(d); }
      b.append(g);
    }
  };
  $$('.btn').forEach(rollLabel);
  const setBtnLabel = (b, txt) => { const ts = $$('.b-t', b); if (ts.length) ts.forEach(t => t.textContent = txt); else b.textContent = txt; };

  /* ---------- Reveal on scroll ---------- */
  const rio = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); rio.unobserve(e.target); }
  }), { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal').forEach(el => rio.observe(el));

  /* ---------- Customer map: dot globe (same seed/spec as the Figma render), drag, zoom, filters, people ---------- */
  const cm = $('#cmap');
  if (cm) {
    const cv = $('.cm-canvas', cm), ctx = cv.getContext('2d');
    const W = 1200, H = 720, CX = 600, CY = 370, R0 = 270, DPR = Math.min(2, window.devicePixelRatio || 1);
    cv.width = W * DPR; cv.height = H * DPR;
    const mul = a => () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; };
    const SEGS = [['save', 18, -28, [224, 146, 125]], ['grow', -14, 32, [134, 169, 223]], ['react', 38, 58, [221, 185, 122]], ['deep', -34, -70, [163, 179, 212]]];
    const D = Math.PI / 180;
    const land = (x, y, z) => Math.sin(3.1 * x + 1.3) * Math.cos(2.7 * y - 0.4) + 0.8 * Math.sin(2.3 * z + 0.7) + 0.5 * Math.cos(4.1 * x + 2.2 * z) + 0.35 * Math.sin(5.3 * y + 1.7 * x);
    // points: 0 = land, 1 = ocean, 2..5 = segment clusters
    const xs = [], ys = [], zs = [], ks = [];
    { const rnd = mul(7);
      for (let i = 0; i < 16000; i++) {
        const z0 = 2 * rnd() - 1, t = 2 * Math.PI * rnd(), r = Math.sqrt(1 - z0 * z0);
        const x = r * Math.cos(t), y = z0, z = r * Math.sin(t);
        const keep = land(x, y, z) > -0.1;
        if (keep || rnd() < 0.06) { xs.push(x); ys.push(y); zs.push(z); ks.push(keep ? 0 : 1); }
      }
      SEGS.forEach(([, la, lo], k) => {
        la *= D; lo *= D;
        for (let i = 0; i < 520; i++) {
          const u1 = Math.max(rnd(), 1e-9), u2 = rnd(), u3 = Math.max(rnd(), 1e-9), u4 = rnd();
          const g1 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2), g2 = Math.sqrt(-2 * Math.log(u3)) * Math.cos(2 * Math.PI * u4);
          const a = la + g1 * .11, b = lo + g2 * .14;
          xs.push(Math.cos(a) * Math.sin(b)); ys.push(Math.sin(a)); zs.push(Math.cos(a) * Math.cos(b)); ks.push(2 + k);
        }
      });
    }
    const N = xs.length, PX = new Float32Array(N), PY = new Float32Array(N), BK = new Uint16Array(N), ORD = new Uint32Array(N);
    const COLS = [[236, 240, 248], [236, 240, 248], ...SEGS.map(s => s[3])];
    const LV = 10, NB = COLS.length * LV + 1; // last bucket = back side
    const cnt = new Uint32Array(NB), start = new Uint32Array(NB);
    // stars (pre-rendered)
    const stars = document.createElement('canvas'); stars.width = W * DPR; stars.height = H * DPR;
    { const s = stars.getContext('2d'), rnd = mul(99); s.scale(DPR, DPR);
      for (let i = 0; i < 160; i++) { const x = rnd() * W, y = rnd() * H, a = .25 + rnd() * .35; s.fillStyle = `rgba(255,255,255,${a})`; s.beginPath(); s.arc(x, y, .7, 0, 7); s.fill(); } }
    let rot = .55, tilt = -.32, zoom = 1, zoomT = 1, vr = 0, rotT = null, focus = -1, dragging = false, lastI = 0, sel = null;
    const proj = (x, y, z) => {
      const cr = Math.cos(rot), sr = Math.sin(rot), ct = Math.cos(tilt), st = Math.sin(tilt);
      const X = x * cr + z * sr, Z1 = -x * sr + z * cr, Y = y * ct - Z1 * st, Z = y * st + Z1 * ct;
      const R = R0 * zoom; return [CX + X * R, CY - Y * R, Z];
    };
    const ll = (la, lo) => [Math.cos(la * D) * Math.sin(lo * D), Math.sin(la * D), Math.cos(la * D) * Math.cos(lo * D)];
    const draw = () => {
      const R = R0 * zoom, cr = Math.cos(rot), sr = Math.sin(rot), ct = Math.cos(tilt), st = Math.sin(tilt);
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'source-over'; ctx.drawImage(stars, 0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      SEGS.forEach(([, la, lo, col], k) => {
        const [px, py, pz] = proj(...ll(la, lo)); if (pz <= 0) return;
        const f = focus === -1 ? 1 : focus === k ? 1.7 : .3, a = .16 * pz * f, rr = 110 * zoom;
        const g = ctx.createRadialGradient(px, py, 0, px, py, rr);
        g.addColorStop(0, `rgba(${col},${a})`); g.addColorStop(1, `rgba(${col},0)`); ctx.fillStyle = g; ctx.fillRect(px - rr, py - rr, rr * 2, rr * 2);
      });
      cnt.fill(0);
      for (let i = 0; i < N; i++) {
        const x = xs[i], y = ys[i], z = zs[i];
        const X = x * cr + z * sr, Z1 = -x * sr + z * cr, Y = y * ct - Z1 * st, Z = y * st + Z1 * ct;
        PX[i] = CX + X * R; PY[i] = CY - Y * R;
        const b = Z < 0 ? NB - 1 : ks[i] * LV + Math.min(LV - 1, ((Z + 1) / 2 * LV) | 0);
        BK[i] = b; cnt[b]++;
      }
      let acc = 0; for (let b = 0; b < NB; b++) { start[b] = acc; acc += cnt[b]; }
      const fill = start.slice(); for (let i = 0; i < N; i++) ORD[fill[BK[i]]++] = i;
      for (let b = 0; b < NB; b++) {
        if (!cnt[b]) continue;
        let a, s, col;
        if (b === NB - 1) { a = .05; s = 1.3; col = [255, 255, 255]; }
        else {
          const k = (b / LV) | 0, depth = ((b % LV) + .5) / LV; col = COLS[k];
          if (k >= 2) { a = .45 + .5 * depth; s = (1.4 + .9 * depth); const seg = k - 2; if (focus !== -1) { if (seg === focus) { a = Math.min(1, a * 1.3); s *= 1.2; } else a *= .3; } }
          else { a = (.16 + .62 * Math.pow(depth, 1.4)) * (k === 1 ? .6 : 1); s = 1.1 + .8 * depth; if (focus !== -1) a *= .6; }
          s *= Math.sqrt(zoom);
        }
        ctx.fillStyle = `rgba(${col},${a})`; const h = s / 2;
        for (let j = start[b], e = start[b] + cnt[b]; j < e; j++) { const i = ORD[j]; ctx.fillRect(PX[i] - h, PY[i] - h, s, s); }
      }
      // atmosphere
      const ring = ctx.createRadialGradient(CX, CY, R * .97, CX, CY, R * 1.06);
      ring.addColorStop(0, 'rgba(149,163,181,0)'); ring.addColorStop(.4, 'rgba(149,163,181,.06)'); ring.addColorStop(1, 'rgba(149,163,181,0)');
      ctx.fillStyle = ring; ctx.fillRect(CX - R * 1.1, CY - R * 1.1, R * 2.2, R * 2.2);
      ctx.globalCompositeOperation = 'source-over';
    };
    // people
    const people = $$('.cm-m', cm).map(el => ({ el, seg: el.dataset.seg, p: ll(+el.dataset.lat, +el.dataset.lon), lon: +el.dataset.lon }));
    const segIdx = s => SEGS.findIndex(x => x[0] === s);
    const line = $('.cm-link line', cm), card = $('.cm-card', cm);
    const placePeople = () => {
      people.forEach(m => {
        const [x, y, z] = proj(...m.p); m.x = x; m.y = y; m.z = z;
        const vis = z > .08; m.vis = vis;
        m.el.style.transform = `translate(${x.toFixed(1)}px, ${y.toFixed(1)}px)`;
        m.el.style.opacity = vis ? Math.min(1, (z - .08) * 4).toFixed(2) : 0;
        m.el.style.zIndex = Math.round(z * 100) + 100;
        m.el.classList.toggle('hide', !vis);
      });
      if (sel && sel.vis) { line.setAttribute('x1', sel.x); line.setAttribute('y1', sel.y); line.setAttribute('x2', 884); line.setAttribute('y2', 194); line.style.opacity = 1; }
      else line.style.opacity = 0;
    };
    const fillCard = m => {
      const d = m.el.dataset;
      $('.cm-av', card).src = $('img', m.el).src;
      $('.cm-name', card).textContent = d.name; $('.cm-meta', card).textContent = d.meta;
      $('.cm-signal', card).textContent = d.signal; $('.cm-worth', card).textContent = d.worth; $('.cm-next', card).textContent = d.next;
      const seg = $('.cm-seg', card); seg.style.setProperty('--c', m.el.style.getPropertyValue('--c'));
      $('span', seg).textContent = { save: 'Save', grow: 'Grow', react: 'Reactivate', deep: 'Deepen' }[d.seg];
    };
    const wrapNear = (target, cur) => { const tw = 2 * Math.PI; return target + Math.round((cur - target) / tw) * tw; };
    const select = (m, user) => {
      if (user) lastI = Date.now();
      if (sel === m) return;
      if (sel) sel.el.classList.remove('on');
      sel = m; m.el.classList.add('on');
      card.classList.add('swap'); setTimeout(() => { fillCard(m); card.classList.remove('swap'); }, 180);
      rotT = wrapNear(-0.36 - m.lon * D, rot);
    };
    people.forEach(m => m.el.addEventListener('click', e => { e.stopPropagation(); select(m, true); }));
    $$('.cm-f', cm).forEach(b => b.addEventListener('click', () => {
      lastI = Date.now();
      $$('.cm-f', cm).forEach(x => x.classList.toggle('on', x === b));
      focus = b.dataset.seg === 'all' ? -1 : segIdx(b.dataset.seg);
      people.forEach(m => m.el.classList.toggle('dim', focus !== -1 && segIdx(m.seg) !== focus));
      if (focus !== -1 && segIdx(sel.seg) !== focus) select(people.find(m => segIdx(m.seg) === focus), true);
    }));
    $$('.cm-zoom button', cm).forEach(b => b.addEventListener('click', () => { lastI = Date.now(); zoomT = Math.min(1.5, Math.max(.8, zoomT * (b.dataset.z === '1' ? 1.15 : 1 / 1.15))); }));
    // drag to rotate
    let px0 = 0, py0 = 0, pid = null;
    cm.addEventListener('pointerdown', e => {
      if (e.target.closest('.cm-m, .cm-f, .cm-card, .cm-zoom')) return;
      dragging = true; pid = e.pointerId; px0 = e.clientX; py0 = e.clientY; vr = 0; rotT = null; lastI = Date.now();
      cm.classList.add('dragging'); cm.setPointerCapture(pid);
    });
    cm.addEventListener('pointermove', e => {
      if (!dragging || e.pointerId !== pid) return;
      const k = parseFloat(getComputedStyle(cm).getPropertyValue('--k')) || 1;
      const dx = (e.clientX - px0) / k, dy = (e.clientY - py0) / k; px0 = e.clientX; py0 = e.clientY;
      vr = dx * .006; rot += vr; tilt = Math.max(-1, Math.min(.6, tilt - dy * .004));
    });
    const endDrag = e => { if (!dragging) return; dragging = false; cm.classList.remove('dragging'); try { cm.releasePointerCapture(pid); } catch (_) {} lastI = Date.now(); };
    cm.addEventListener('pointerup', endDrag); cm.addEventListener('pointercancel', endDrag);
    // loop
    let raf = 0, cycleT = null;
    const frame = () => {
      raf = requestAnimationFrame(frame);
      if (!dragging) {
        if (rotT !== null) { rot += (rotT - rot) * .06; if (Math.abs(rotT - rot) < .002) rotT = null; }
        else if (Math.abs(vr) > .0004) { rot += vr; vr *= .94; }
        else if (!reduced) rot += .0012;
      }
      zoom += (zoomT - zoom) * .15;
      draw(); placePeople();
    };
    const cycle = () => {
      if (Date.now() - lastI < 10000) return;
      const pool = people.filter(m => (focus === -1 || segIdx(m.seg) === focus));
      const i = pool.indexOf(sel); select(pool[(i + 1) % pool.length], false);
    };
    select(people[0], false); rot = rotT; rotT = null; fillCard(people[0]);
    draw(); placePeople();
    whileVisible(cm, () => { if (!raf) raf = requestAnimationFrame(frame); if (!reduced && !cycleT) cycleT = setInterval(cycle, 6000); },
      () => { cancelAnimationFrame(raf); raf = 0; clearInterval(cycleT); cycleT = null; }, 0.15);
  }

  /* ---------- Book a demo modal: opens from every Book a demo / Talk to sales, validates, thank-you in place ---------- */
  const demo = $('#demo');
  if (demo) {
    const form = $('.dm-form', demo), done = $('.dm-success', demo), card = $('.dm-card', demo);
    const FREE = /@(gmail|googlemail|yahoo|hotmail|outlook|live|icloud|me|aol|gmx|proton|protonmail|mail|yandex|ya)\./i;
    let lastFocus = null, closeT = null;
    const setErr = (name, msg) => { const f = form.elements[name].closest('.dm-field'); f.classList.toggle('bad', !!msg); $('.dm-err', f).textContent = msg || ''; };
    const openDemo = () => {
      clearTimeout(closeT); lastFocus = document.activeElement;
      form.hidden = false; done.hidden = true; form.reset(); ['company', 'email', 'industry'].forEach(n => setErr(n, ''));
      $('select', form).classList.add('empty');
      demo.hidden = false; document.documentElement.classList.add('dm-lock');
      requestAnimationFrame(() => requestAnimationFrame(() => demo.classList.add('open')));
      setTimeout(() => form.elements.company.focus({ preventScroll: true }), 60);
    };
    const closeDemo = () => {
      demo.classList.remove('open'); document.documentElement.classList.remove('dm-lock');
      closeT = setTimeout(() => { demo.hidden = true; }, 380);
      if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
    };
    document.addEventListener('click', e => {
      const t = e.target.closest('[data-demo]'); if (t) { e.preventDefault(); openDemo(); return; }
      if (!demo.hidden && e.target.closest('[data-close]')) closeDemo();
    });
    document.addEventListener('keydown', e => {
      if (demo.hidden) return;
      if (e.key === 'Escape') closeDemo();
      if (e.key === 'Tab') {
        const f = $$('input, select, button', card).filter(el => !el.closest('[hidden]'));
        const first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });
    $('select', form).addEventListener('change', e => { e.target.classList.toggle('empty', !e.target.value); setErr('industry', ''); });
    ['company', 'email'].forEach(n => form.elements[n].addEventListener('input', () => setErr(n, '')));
    form.addEventListener('submit', e => {
      e.preventDefault();
      const company = form.elements.company.value.trim(), email = form.elements.email.value.trim(), industry = form.elements.industry.value;
      const errs = {
        company: company ? '' : 'Please enter your company name.',
        email: !email ? 'Please enter your business email.' : !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) ? 'Please enter a valid email.' : '',
        industry: industry ? '' : 'Please choose your industry.'
      };
      Object.entries(errs).forEach(([n, m]) => setErr(n, m));
      const bad = Object.keys(errs).find(n => errs[n]);
      if (bad) { form.elements[bad].focus(); return; }
      const content = `OPUS DEMO BRIEF\n\nCompany: ${company}\nEmail: ${email}\nIndustry: ${industry}\n\nDiscuss customer segments, churn signals, expansion opportunities and lifecycle campaigns.\n\nTemplate preview only. No request was submitted and no demo was booked.\n`;
      const url = URL.createObjectURL(new Blob([content], {type:'text/plain;charset=utf-8'}));
      const link = document.createElement('a'); link.href = url; link.download = 'opus-demo-brief.txt'; document.body.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(url), 10000);
      form.hidden = true; done.hidden = false; $('.dm-done', done).focus({preventScroll:true});
    });
  }

  /* ---------- Sticky header: shows on scroll up once past the hero, hides on scroll down, highlights the section in view ---------- */

  /* ---------- Mobile menu (≤900px) ---------- */
  const mnav = $('#mnav');
  if (mnav) {
    const openers = $$('.burger[aria-controls="mnav"]');
    let lastFocus = null;
    const setMenu = on => {
      mnav.classList.toggle('open', on);
      document.documentElement.classList.toggle('menu-open', on);
      openers.forEach(b => b.setAttribute('aria-expanded', on));
      if (on) { lastFocus = document.activeElement; setTimeout(() => $('.mnav-top .burger', mnav).focus(), 50); }
      else if (lastFocus) lastFocus.focus({ preventScroll: true });
    };
    openers.forEach(b => b.addEventListener('click', () => setMenu(true)));
    $$('[data-mclose]', mnav).forEach(a => a.addEventListener('click', () => setMenu(false)));
    addEventListener('keydown', e => { if (e.key === 'Escape' && mnav.classList.contains('open')) setMenu(false); });
    matchMedia('(min-width: 901px)').addEventListener('change', e => { if (e.matches) setMenu(false); });
  }

  const snav = $('#snav');
  if (snav) {
    const heroEl = $('.hero'), snLinks = $$('.snav-links a', snav), snFocus = $$('a, button', snav);
    const snSecs = snLinks.map(a => $(a.getAttribute('href')));
    let lastY = scrollY, acc = 0, ticking = false;
    const setShown = on => {
      if (snav.classList.contains('show') === on) return;
      snav.classList.toggle('show', on); snav.setAttribute('aria-hidden', on ? 'false' : 'true');
      snFocus.forEach(a => a.tabIndex = on ? 0 : -1);
    };
    const snUpdate = () => {
      ticking = false;
      const y = scrollY, dy = y - lastY; lastY = y;
      if (y < heroEl.offsetHeight - 64) { setShown(false); acc = 0; }
      else if (dy < 0) { acc = Math.min(0, acc) + dy; if (acc < -6) setShown(true); }
      else if (dy > 0) { acc = Math.max(0, acc) + dy; if (acc > 6) setShown(false); }
      const mid = innerHeight / 2;
      snLinks.forEach((a, i) => { const r = snSecs[i] && snSecs[i].getBoundingClientRect(); a.classList.toggle('on', !!r && r.top <= mid && r.bottom > mid); });
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(snUpdate); } }, { passive: true });
  }

  /* ---------- Hero video: plays only while the hero is on screen, stays on the poster for reduced motion ---------- */
  const heroVideo = $('.hero-video');
  if (heroVideo) {
    if (reduced) { heroVideo.removeAttribute('autoplay'); heroVideo.pause(); }
    else whileVisible($('.hero'), () => { const p = heroVideo.play(); if (p) p.catch(() => {}); }, () => heroVideo.pause(), 0.05);
  }

  /* ---------- Platform: window rises, sidebar and cards stagger in, numbers count, ticker ticks ---------- */
  const pf = $('#platform');
  new IntersectionObserver(([e], o) => {
    if (!e.isIntersecting) return; o.disconnect(); pf.classList.add('in');
    if (reduced) return;
    $$('[data-pfk]', pf).forEach((el, i) => { const to = +el.dataset.pfk; el.textContent = '0'; setTimeout(() => countUp(el, to, 1400, v => Math.round(v)), 600 + i * 90); });
    $$('.pf-kpi [data-pfn]', pf).forEach(el => { const to = +el.dataset.pfn; el.textContent = '0'; setTimeout(() => countUp(el, to, 1400, v => Math.round(v).toLocaleString('en-US')), 870); });
    $$('[data-pfp]', pf).forEach(el => { const to = +el.dataset.pfp; el.textContent = '0'; setTimeout(() => countUp(el, to, 1600, v => Math.round(v)), 700); });
  }, { threshold: 0.3 }).observe($('.pf-fit', pf));
  const ticks = $$('[data-tick]', pf).map(el => ({ el, v: +el.dataset.tick, step: el.dataset.step.split(',').map(Number) }));
  let tickTimer = null;
  const tickOnce = () => {
    ticks.forEach(t => {
      const [a, b] = t.step, inc = Math.floor(a + Math.random() * (b - a + 1));
      if (!inc) return;
      t.v += inc; t.el.textContent = t.v.toLocaleString('en-US');
      t.el.classList.add('bump'); setTimeout(() => t.el.classList.remove('bump'), 400);
    });
    tickTimer = setTimeout(tickOnce, 1200 + Math.random() * 900);
  };
  if (!reduced) whileVisible($('.pf-ticker'), () => { tickTimer = setTimeout(tickOnce, 800); }, () => clearTimeout(tickTimer), 0.5);
  $$('.pf-nav', pf).forEach(n => n.addEventListener('click', () => { $$('.pf-nav', pf).forEach(x => x.classList.toggle('on', x === n)); $$('.pf-nav > span:nth-child(2)', pf).forEach(s => s.className = s.closest('.on') ? 't-c14m' : 't-c14'); }));

  /* ---------- Hero: Ask card (Hero_V3, steps advance every 2.4 s, 40 ms per character) ---------- */
  const chat = $('#chat'), input = $('#chat-input');
  const mainSuggest = $('.suggest[data-main]');
  const PLACEHOLDER = 'Ask about your customers…', FOLLOWUP = 'Ask a follow-up…';
  let chatRun = 0;
  const setChat = s => { chat.classList.remove('is-idle', 'is-typing', 'is-answer'); chat.classList.add('is-' + s); };
  async function typeInto(el, text, run, cps = 40) {
    el.classList.add('typed'); el.textContent = '';
    const caret = document.createElement('span'); caret.className = 'caret';
    for (let i = 1; i <= text.length; i++) {
      if (run !== chatRun) return false;
      el.textContent = text.slice(0, i); el.appendChild(caret);
      await sleep(reduced ? 0 : cps);
    }
    return true;
  }
  async function chatLoop(question, hot) {
    const run = ++chatRun;
    while (run === chatRun) {
      setChat('idle'); input.classList.remove('typed'); input.textContent = PLACEHOLDER;
      $$('.suggest').forEach(b => b.classList.remove('is-hot'));
      await sleep(2400); if (run !== chatRun) return;
      setChat('typing'); (hot || mainSuggest).classList.add('is-hot');
      if (!await typeInto(input, question || mainSuggest.dataset.q, run)) return;
      await sleep(600); if (run !== chatRun) return;
      $('.q-bubble').textContent = question || mainSuggest.dataset.q;
      setChat('answer'); input.classList.remove('typed'); input.textContent = FOLLOWUP;
      await sleep(4000);
      question = null; hot = null;
    }
  }
  $$('.suggest').forEach(b => b.addEventListener('click', () => chatLoop(b.dataset.main !== undefined ? b.dataset.q : b.dataset.q, b)));
  whileVisible(chat, () => chatLoop(), () => { chatRun++; }, 0.2);

  /* ---------- Stage_Signals: scroll 0..1 maps to Step 1..5, cards slide up onto the stack ---------- */
  const sig = $('#signals'), sigStage = $('.signals .stage'), sigCards = $$('.sig-card'), sigBars = $$('.sig-progress i');
  // [x, y, rotationDeg (Figma, counter-clockwise), opacity] per card for steps 1..5
  const P = [
    [[527,230,0,1],[527,850,0,1],[527,910,0,1],[527,970,0,1],[527,1030,0,1]],
    [[517,216,3,1],[527,230,0,1],[527,850,0,1],[527,910,0,1],[527,970,0,1]],
    [[507,202,3,1],[537,216,-3,1],[527,230,0,1],[527,850,0,1],[527,910,0,1]],
    [[507,188,3,1],[547,202,-3,1],[517,216,3,1],[527,230,0,1],[527,850,0,1]],
    [[507,188,3,0],[547,188,-3,1],[507,202,3,1],[537,216,-3,1],[527,230,0,1]],
  ];
  let sigStep = -1;
  function setSig(step) {
    if (step === sigStep) return; sigStep = step;
    sigStage.dataset.step = step + 1;
    sigCards.forEach((c, i) => {
      const [x, y, r, o] = P[step][i];
      c.style.transform = `translate(${x}px, ${y}px) rotate(${-r}deg)`;
      c.style.opacity = o;
    });
    sigBars.forEach((b, i) => b.classList.toggle('on', i <= step));
    playCard(step);
  }
  // the card on top of the stack plays its micro-animation
  function playCard(i) {
    sigCards.forEach((c, j) => { if (j !== i) c.classList.remove('live'); });
    const c = sigCards[i]; if (!c) return;
    c.classList.remove('live'); void c.offsetWidth; c.classList.add('live');
    $$('[data-c]', c).forEach(el => { const to = +el.dataset.c; el.textContent = '0'; setTimeout(() => countUp(el, to, 1200, v => Math.round(v)), 300); });
  }
  setSig(0);
  const sigSticky = () => getComputedStyle($('.signals-sticky')).position === 'sticky';
  function sigScale() {
    const vw = innerWidth, vh = $('.signals-sticky').clientHeight;
    const k = Math.min(1, vw / 1440, vh / 900);
    sigStage.style.setProperty('--k', k);
    // ≤900: no sticky scene, the card stack is shown on its own at a readable size
    sig.style.setProperty('--sk', Math.min(1, (document.documentElement.clientWidth - 24) / 470));
  }
  sigScale(); addEventListener('resize', sigScale);
  let sigTimer = null;
  function onScroll() {
    if (!sigSticky()) return;
    const r = sig.getBoundingClientRect(), total = sig.offsetHeight - innerHeight;
    const p = Math.min(1, Math.max(0, -r.top / total));
    setSig(Math.min(4, Math.floor(p * 5)));
  }
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  whileVisible(sig, () => { if (sigSticky()) playCard(sigStep); }, null, 0.3);
  // On small screens the stage is not sticky: auto-play 1.4 s per step, 2.6 s on the last
  whileVisible(sig, () => {
    if (sigSticky()) return;
    let s = 0; setSig(0);
    const tick = () => { s = (s + 1) % 5; setSig(s); sigTimer = setTimeout(tick, s === 4 ? 2600 : 1400); };
    sigTimer = setTimeout(tick, 1400);
  }, () => clearTimeout(sigTimer));

  /* ---------- Stage_Ask: question types in, answer fades up, dashboard dims ---------- */
  const askStage = $('#ask'), askQ = $('#ask-q');
  const ASK = 'Why did churn increase this month?';
  let askRun = 0;
  async function askLoop() {
    const run = ++askRun;
    while (run === askRun) {
      askStage.classList.remove('answered'); askQ.textContent = '';
      const caret = document.createElement('span'); caret.className = 'caret';
      for (let i = 1; i <= ASK.length; i++) {
        if (run !== askRun) return;
        askQ.textContent = ASK.slice(0, i); askQ.appendChild(caret);
        await sleep(reduced ? 0 : 40);
      }
      await sleep(500); if (run !== askRun) return;
      askQ.textContent = ASK; askStage.classList.add('answered');
      await sleep(4000); if (run !== askRun) return;
    }
  }
  askQ.textContent = ASK;
  whileVisible($('.w-ask'), askLoop, () => { askRun++; askQ.textContent = ASK; askStage.classList.add('answered'); }, 0.4);

  /* ---------- Stage_Flow: widgets light up in turn, point travels, ruler handle eases in on step 3 ---------- */
  const flow = $('#flow'), ruler = $('#ruler');
  for (let i = 0; i <= 30; i++) {
    const t = document.createElement('i'); t.className = 'tk' + (i % 5 === 0 ? ' major' : '');
    t.style.left = (i * 296 / 30) + 'px'; ruler.prepend(t);
    if (i % 5 === 0) { const l = document.createElement('span'); l.className = 'lb'; l.textContent = i + '%'; l.style.left = (i * 296 / 30) + 'px'; ruler.prepend(l); }
  }
  let flowStep = 1, flowTimer = null;
  function setFlow(s) {
    flowStep = s; flow.dataset.step = s;
    $$('.fw', flow).forEach(w => w.classList.toggle('dim', +w.dataset.w !== s));
    $$('.node', flow).forEach((n, i) => n.classList.toggle('on', i === s - 1));
  }
  whileVisible(flow, () => {
    const tick = () => { setFlow(flowStep % 3 + 1); flowTimer = setTimeout(tick, 2400); };
    flowTimer = setTimeout(tick, 2400);
  }, () => clearTimeout(flowTimer));

  /* ---------- Opus: dots travel along the dotted connectors (tools → map → tools) ---------- */
  // Each connector is the cubic the Figma export draws: M p0 C (x0+dx, y0) (x1-dx, y1) p1
  const LINES = [
    [183.33, 70, 406.67, 162, 112], [183.33, 158, 406.67, 221.33, 112], [183.33, 246, 406.67, 280.67, 112],
    [183.33, 334, 406.67, 340, 114], [183.33, 422, 406.67, 399.33, 114], [183.33, 510, 406.67, 458.67, 112],
    [183.33, 598, 406.67, 518, 112],
    [793.34, 192, 1016.67, 208, 114], [793.34, 290.67, 1016.67, 296, 106], [793.34, 389.33, 1016.67, 384, 106],
    [793.34, 488, 1016.67, 472, 114],
  ];
  const fd = $('#flowdots'), NS = 'http://www.w3.org/2000/svg';
  const runners = LINES.map(([x0, y0, x1, y1, dx], i) => {
    const p = document.createElementNS(NS, 'path');
    p.setAttribute('d', `M${x0} ${y0} C${x0 + dx} ${y0} ${x1 - dx} ${y1} ${x1} ${y1}`);
    p.setAttribute('fill', 'none');
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('r', 4); c.setAttribute('fill', '#245da9');
    fd.append(p, c);
    return { p, c, len: 0, dur: 3600 + (i % 3) * 500, off: (i * 0.37) % 1 };
  });
  runners.forEach(r => r.len = r.p.getTotalLength());
  let fdRaf = 0;
  const easeIO = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
  function fdFrame(now) {
    runners.forEach(r => {
      const t = ((now / r.dur) + r.off) % 1, e = easeIO(t);
      const pt = r.p.getPointAtLength(e * r.len);
      r.c.setAttribute('cx', pt.x); r.c.setAttribute('cy', pt.y);
      r.c.setAttribute('opacity', t < .08 ? t / .08 : t > .92 ? (1 - t) / .08 : 1);
    });
    fdRaf = requestAnimationFrame(fdFrame);
  }
  if (reduced) { runners.forEach(r => { const pt = r.p.getPointAtLength(r.len * .4); r.c.setAttribute('cx', pt.x); r.c.setAttribute('cy', pt.y); }); }
  else whileVisible(fd, () => { fdRaf = requestAnimationFrame(fdFrame); }, () => cancelAnimationFrame(fdRaf), 0.1);

  /* ---------- Stage_Offer_Drum: two text drums roll one row every 1.4 s ---------- */
  const drum = $('#drum');
  const L = ['Too expensive', 'Not using enough', 'Missing a feature', 'Temporary need', 'Heavy usage'];
  const R = ['20% off renewal', 'Guided onboarding', 'Add-on bundle', '2-month pause', 'Upgrade to Pro'];
  const N = 20;
  const dPhone = matchMedia('(max-width: 640px)');
  const DG = () => dPhone.matches ? { CY: 430, GAP: 34, LX: 165, RX: 185, DX: 24, SIZE: [[17, 22, -0.2], [15, 20, -0.1], [14, 20, 0]] } : { CY: 330, GAP: 52, LX: 260, RX: 940, DX: 80, SIZE: [[28, 32, -0.56], [24, 32, -0.24], [20, 28, -0.1]] };
  const OP = [1, .4, .28, .2, .14, .08, .04, 0];
  const SIZE = [[28, 32, -0.56], [24, 32, -0.24], [20, 28, -0.1]];
  const items = [];
  for (let j = 0; j < N; j++) {
    const l = document.createElement('p'), r = document.createElement('p');
    l.className = 'it l'; r.className = 'it r';
    l.textContent = L[j % 5]; r.textContent = R[j % 5];
    drum.insertBefore(l, drum.firstChild); drum.insertBefore(r, drum.firstChild);
    items.push({ l, r, slot: j - 10 });
  }
  const measure = document.createElement('canvas').getContext('2d');
  function textW(t, px, ls) { measure.font = `400 ${px}px "DM Sans"`; return measure.measureText(t).width + ls * t.length; }
  function place(it, jump) {
    const s = Math.max(-7, Math.min(7, it.slot)), a = Math.abs(s);
    const { CY, GAP, LX, RX, DX, SIZE } = DG();
    const [fs, lh, ls] = SIZE[Math.min(a, 2)];
    const dx = DX * Math.pow(a / 6, 2);
    const y = CY + s * GAP - lh / 2;
    [it.l, it.r].forEach(el => {
      el.classList.toggle('jump', !!jump);
      el.style.fontSize = fs + 'px'; el.style.lineHeight = lh + 'px'; el.style.letterSpacing = ls + 'px';
      el.style.opacity = OP[Math.min(a, 7)];
    });
    const wl = textW(it.l.textContent, fs, ls);
    it.l.style.transform = `translate(${LX - dx - wl}px, ${y}px)`;
    it.r.style.transform = `translate(${RX + dx}px, ${y}px)`;
    it.r.classList.toggle('mint', s === 0);
  }
  const placeAll = () => items.forEach(it => place(it, true));
  placeAll();
  if (document.fonts) document.fonts.ready.then(placeAll);
  dPhone.addEventListener('change', placeAll);
  let drumTimer = null;
  function roll() {
    items.forEach(it => {
      it.slot -= 1;
      if (it.slot < -10) { it.slot += N; place(it, true); }
      else place(it, false);
    });
    requestAnimationFrame(() => items.forEach(it => { it.l.classList.remove('jump'); it.r.classList.remove('jump'); }));
  }
  whileVisible(drum, () => { const t = () => { roll(); drumTimer = setTimeout(t, 2200); }; drumTimer = setTimeout(t, 1400); }, () => clearTimeout(drumTimer), 0.3);

  /* ---------- Campaign: build progress fills to 86 % when the card appears ---------- */
  const build = $('#build'), pct = $('#build-pct');
  new IntersectionObserver(([e], o) => {
    if (!e.isIntersecting) return; o.disconnect();
    build.classList.add('in');
    countUp(pct, 86, 1400, v => Math.round(v) + '%');
  }, { threshold: 0.4 }).observe(build);

  /* ---------- Results and learning: numbers count up and bars grow once (1.2 s ease-out) ---------- */
  function countUp(el, to, ms, fmt) {
    if (reduced) { el.textContent = fmt(to); return; }
    const t0 = performance.now();
    const step = t => {
      const p = Math.min(1, (t - t0) / ms), e = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(to * e);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const usd = v => '$' + Math.round(v).toLocaleString('en-US');
  const kfmt = v => '$' + v.toFixed(1) + 'k';
  const res = $('#res');
  const RES_MS = 2800;
  const sine = t => -(Math.cos(Math.PI * t) - 1) / 2;
  let resRaf = [];
  function resPlay() {
    $$('[data-count]', res).forEach(el => {
      const to = +el.dataset.count, fmt = el.dataset.fmt === 'k' ? kfmt : usd;
      if (reduced) { el.textContent = fmt(to); return; }
      const t0 = performance.now();
      const step = t => {
        const p = Math.min(1, (t - t0) / RES_MS);
        el.textContent = fmt(to * sine(p));
        if (p < 1) resRaf.push(requestAnimationFrame(step));
      };
      resRaf.push(requestAnimationFrame(step));
    });
    $$('i[data-w]', res).forEach(b => b.style.width = b.dataset.w + '%');
  }
  function resReset() {
    resRaf.forEach(cancelAnimationFrame); resRaf = [];
    $$('[data-count]', res).forEach(el => el.textContent = el.dataset.fmt === 'k' ? kfmt(0) : usd(0));
    $$('i[data-w]', res).forEach(b => b.style.width = '0');
  }
  let resTimer = null;
  whileVisible(res, () => { resTimer = setTimeout(resPlay, 400); }, () => { clearTimeout(resTimer); resReset(); }, 0.35);

  /* ---------- NBA: sticky card, steps scroll past it (ref reflexai.com) + micro-animations ---------- */
  const nbaBlocks = $$('.nba-block'), frame = $('#nba-frame'), layers = $$('.nba-layer');
  layers.forEach(l => $$('.a-in', l).forEach((el, i) => el.style.setProperty('--i', i)));
  const fmtNum = (v, dec) => dec ? v.toFixed(dec) : Math.round(v).toLocaleString('en-US');
  const timers = new Map();
  function later(layer, fn, ms) { const t = setTimeout(fn, ms); timers.get(layer).push(t); }
  function playLayer(layer) {
    (timers.get(layer) || []).forEach(clearTimeout); timers.set(layer, []);
    layer.classList.remove('play'); void layer.offsetWidth; layer.classList.add('play');
    // counters
    $$('.num', layer).forEach(el => { const to = +el.dataset.to, dec = +(el.dataset.dec || 0); el.textContent = fmtNum(0, dec); later(layer, () => countUp(el, to, 1600, v => fmtNum(v, dec)), 450); });
    // title types in
    $$('.type', layer).forEach(el => {
      const txt = el.dataset.text; el.textContent = '';
      const cur = document.createElement('span'); cur.className = 'cur';
      [...txt].forEach((ch, i) => later(layer, () => { el.textContent = txt.slice(0, i + 1); el.appendChild(cur); }, 300 + i * 32));
      later(layer, () => { el.innerHTML = txt.replace(/ (\S+)$/, '&nbsp;$1'); }, 300 + txt.length * 32 + 900);
    });
    // booking: the selection moves to the chosen slot
    const slots = $$('.slot', layer);
    if (slots.length) {
      const pick = i => slots.forEach((x, j) => { x.classList.toggle('sel', j === i); x.setAttribute('aria-checked', j === i); });
      pick(-1); later(layer, () => pick(0), 900); later(layer, () => pick(1), 1500);
    }
    // the main button gets a soft press
    $$('.pressable', layer).forEach(b => { later(layer, () => b.classList.add('press'), 2200); later(layer, () => b.classList.remove('press'), 2380); });
  }
  function stopLayer(layer) { (timers.get(layer) || []).forEach(clearTimeout); layer.classList.remove('play'); }
  let nbaActive = -1;
  function setNba(i) {
    if (i === nbaActive) return; nbaActive = i;
    nbaBlocks.forEach((b, j) => { b.classList.toggle('active', j === i); b.classList.toggle('seen', j <= i); });
    layers.forEach((l, j) => { l.classList.toggle('on', j === i); if (j === i) playLayer(l); else stopLayer(l); });
  }
  const mqMobile = matchMedia('(max-width: 900px)');
  function nbaScroll() {
    if (mqMobile.matches) return;
    const mid = innerHeight / 2;
    const fr = frame.getBoundingClientRect();
    if (fr.bottom < 0 || fr.top > innerHeight) return;
    let best = 0, bestD = Infinity;
    nbaBlocks.forEach((b, j) => { const r = b.getBoundingClientRect(); const d = Math.abs(r.top + r.height / 2 - mid); if (d < bestD) { bestD = d; best = j; } });
    setNba(best);
  }
  addEventListener('scroll', nbaScroll, { passive: true });
  // mobile: each card sits under its step and plays when it scrolls in
  const inlineIO = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) playLayer(e.target); else stopLayer(e.target); }), { threshold: 0.4 });
  function nbaLayout() {
    if (mqMobile.matches) {
      layers.forEach((l, j) => { l.classList.add('inline', 'on'); nbaBlocks[j].appendChild(l); inlineIO.observe(l); });
      nbaBlocks.forEach(b => b.classList.add('seen'));
      nbaActive = -1;
    } else {
      layers.forEach(l => { inlineIO.unobserve(l); l.classList.remove('inline', 'on'); frame.appendChild(l); });
      nbaActive = -1; nbaScroll(); if (nbaActive < 0) setNba(0);
    }
  }
  mqMobile.addEventListener('change', nbaLayout); nbaLayout();
  whileVisible(frame, () => { if (!mqMobile.matches && nbaActive >= 0) playLayer(layers[nbaActive]); }, null, 0.3);
  $$('.slot').forEach(s => s.addEventListener('click', () => {
    const all = $$('.slot', s.closest('.slots'));
    all.forEach(x => { x.classList.toggle('sel', x === s); x.setAttribute('aria-checked', x === s); });
  }));

  /* ---------- FAQ accordion (Closed/Open, 0.3 s) ---------- */
  $$('.faq-item').forEach(item => {
    const q = $('.faq-q', item);
    q.addEventListener('click', () => {
      const open = !item.classList.contains('open');
      item.classList.toggle('open', open); q.setAttribute('aria-expanded', open);
    });
  });
})();

