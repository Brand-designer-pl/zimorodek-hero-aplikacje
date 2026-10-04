/* Zimorodek — hero: wlot ptaka → wejście interfejsu → napis za ptakiem.
   Wzorzec: premium-web-agent hero-reveal (stagger + reduced motion), wersja statyczna HTML + GSAP 3.12.5. */
(() => {
  const hero = document.getElementById('hero');
  const video = hero.querySelector('.hero__video');
  const still = hero.querySelector('.hero__still');
  const word = hero.querySelector('.hero__word');
  const left = hero.querySelectorAll('[data-hero="left"]');
  const up = hero.querySelectorAll('[data-hero="up"]');
  const replayBtn = hero.querySelector('.replay');
  const navLogo = hero.querySelector('.nav__logo img');
  const navLinks = hero.querySelectorAll('.nav__links a');
  const navCta = hero.querySelector('.nav__cta');

  const START_AT = 0.4;    // s filmu: pomijamy puste tło na początku (krótszy wstęp)
  const UI_AT = 3.1;       // s filmu: ptak rusza na kamerę → wjeżdża UI
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (!window.gsap || reduce.matches) {
    hero.classList.add('is-static');
    return;
  }

  let uiPlayed = false;
  let finished = false;
  let mode = 'hero';       // hero → diving → dived
  let diveQueued = false;

  function resetState() {
    uiPlayed = false;
    finished = false;
    hero.classList.remove('ui-in');
    gsap.killTweensOf([still, word, ...left, ...up]);
    gsap.set(still, { opacity: 0 });
    gsap.set(word, { opacity: 0, y: 40, filter: 'blur(14px)' });
    gsap.set(left, { opacity: 0, x: -70, filter: 'blur(8px)' });
    gsap.set(up, { opacity: 0, y: 120, filter: 'blur(10px)' });
  }

  function playUI() {
    if (uiPlayed) return;
    uiPlayed = true;
    // po wejściu czyścimy transform/filter, żeby działały animacje :hover z CSS
    const tl = gsap.timeline({
      defaults: { ease: 'expo.out', duration: 1.25 },
      onComplete: () => { hero.classList.add('ui-in'); gsap.set([...left, ...up], { clearProps: 'transform,filter,opacity' }); },
    });
    tl.to(left, { opacity: 1, x: 0, filter: 'blur(0px)', stagger: 0.09 }, 0)
      .to(up, { opacity: 1, y: 0, filter: 'blur(0px)', stagger: 0.12, duration: 1.4 }, 0.1);
  }

  function finish() {
    if (finished) return;
    finished = true;
    playUI();
    // Film zatrzymuje się na ostatniej klatce i zostaje na ekranie — nic go nie podmienia ani nie
    // przykrywa. Napis chowa się za ptakiem dzięki masce (.hero__wordlayer), więc ptak to zawsze wideo.
    if (!video.ended) gsap.set(still, { opacity: 1 });   // tylko gdy wideo nie ruszyło (autoplay/błąd)
    if (diveQueued) { diveQueued = false; goDive(); return; }
    gsap.to(word, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1.6, ease: 'expo.out', delay: 0.1 });
  }

  function playNav() {
    const navEls = [navLogo, ...navLinks, navCta];
    gsap.killTweensOf(navEls);
    hero.classList.remove('nav-in');
    gsap.set(navLogo, { clipPath: 'inset(0% 100% 0% 0%)', x: -34 });
    gsap.set([...navLinks, navCta], { opacity: 0, y: -26 });
    gsap.timeline({
      delay: 0.25,
      onComplete: () => { hero.classList.add('nav-in'); gsap.set(navEls, { clearProps: 'all' }); },
    })
      .to(navLogo, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.55, ease: 'power2.out' }, 0)
      .to(navLogo, { x: 0, duration: 1.1, ease: 'expo.out' }, 0)
      .to(navLinks, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out', stagger: 0.055 }, 0.15)
      .to(navCta, { opacity: 1, y: 0, duration: 0.7, ease: 'expo.out' }, 0.15 + navLinks.length * 0.055);
  }

  function start() {
    if (typeof mode !== 'undefined' && mode !== 'hero') return;   // powtórka tylko w stanie hero
    resetState();
    playNav();
    video.currentTime = START_AT;
    const p = video.play();
    if (p && p.catch) p.catch(() => { finish(); });   // autoplay zablokowany → stan końcowy
  }

  video.addEventListener('timeupdate', () => {
    if (!uiPlayed && video.currentTime >= UI_AT) playUI();
  });
  video.addEventListener('ended', finish);
  // przeglądarka potrafi wstrzymać wyciszone wideo (karta w tle, oszczędzanie energii) — wznawiamy
  const resume = () => {
    if (!finished && video.paused && !video.ended) video.play().catch(finish);
  };
  video.addEventListener('pause', () => setTimeout(resume, 150));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) resume(); });
  video.addEventListener('error', finish);

  replayBtn.addEventListener('click', start);
  window.addEventListener('keydown', (e) => {
    if ((e.key === 'r' || e.key === 'R') && !e.metaKey && !e.ctrlKey && !/input|textarea/i.test(e.target.tagName)) start();
  });

  // dopasowanie szerokości napisu do makiety (≈ 94% szerokości kadru)
  const span = word.querySelector('span');
  function fitWord() {
    span.style.fontSize = '';
    const target = hero.clientWidth * (window.innerWidth <= 760 ? 0.92 : 0.94);
    const w = span.getBoundingClientRect().width;
    if (w > 0) span.style.fontSize = (parseFloat(getComputedStyle(span).fontSize) * target / w) + 'px';
  }
  document.fonts.ready.then(fitWord);
  window.addEventListener('resize', fitWord);

  // delikatna paralaksa po zakończeniu wlotu
  const layers = [...hero.querySelectorAll('[data-parallax]')].map((el) => ({
    el, k: parseFloat(el.dataset.parallax),
    x: gsap.quickTo(el, 'x', { duration: 1.4, ease: 'power3.out' }),
    y: gsap.quickTo(el, 'y', { duration: 1.4, ease: 'power3.out' }),
  }));
  if (window.matchMedia('(pointer: fine)').matches) {
    hero.addEventListener('pointermove', (e) => {
      if (!finished || mode !== 'hero') return;
      const nx = e.clientX / window.innerWidth - 0.5;
      const ny = e.clientY / window.innerHeight - 0.5;
      layers.forEach(({ k, x, y }) => { x(nx * 64 * k); y(ny * 40 * k); });
    });
  }

  // ---------- scena: przewinięcie → nurkowanie (film nr 2) → sekcja 2 ----------
  const scene = document.getElementById('scene');
  const diveVideo = hero.querySelector('.hero__dive');
  const diveItems = scene.querySelectorAll('[data-dive]');
  const replay = hero.querySelector('.replay');
  const DIVE_START = 0;     // klatka 0 filmu 2 = ostatnia klatka filmu 1 (różnica tylko kompresji)
  const DIVE_RATE = 1.1;     // lekko szybciej — dynamiczne przejście (plik ma już przyspieszony start i lot)
  const DIVE_UI_BEFORE = 0.9; // s przed końcem filmu wjeżdża treść sekcji

  function heroOut() {
    gsap.killTweensOf([word, ...left, ...up]);
    return gsap.timeline({ defaults: { duration: 0.45, ease: 'power2.in' } })
      .to(word, { opacity: 0, y: -30, filter: 'blur(10px)' }, 0)
      .to(left, { opacity: 0, x: -50, filter: 'blur(6px)', stagger: 0.03 }, 0)
      .to(up, { opacity: 0, y: 60, filter: 'blur(6px)', stagger: 0.04 }, 0)
      .to(replay, { autoAlpha: 0, duration: 0.2 }, 0);
  }

  function diveIn() {
    if (scene.classList.contains('is-dived')) return;
    scene.classList.add('is-dived');
    gsap.fromTo(diveItems,
      { opacity: 0, x: 60, filter: 'blur(10px)' },
      { opacity: 1, x: 0, filter: 'blur(0px)', duration: 1.1, ease: 'expo.out', stagger: 0.07,
        onComplete: () => gsap.set(diveItems, { clearProps: 'transform,filter' }) });
  }

  function goDive() {
    if (mode !== 'hero') return;
    if (!finished) {                       // intro jeszcze trwa → dokończ je od razu i nurkuj
      diveQueued = true;
      video.currentTime = video.duration || 99;
      return;
    }
    mode = 'diving';
    lock(true);
    layers.forEach(({ x, y }) => { x(0); y(0); });
    heroOut();
    diveVideo.currentTime = DIVE_START;
    diveVideo.playbackRate = DIVE_RATE;
    // pierwsza klatka filmu 2 = ostatnia klatka filmu 1; krótkie przenikanie maskuje kompresję
    gsap.to(diveVideo, { opacity: 1, duration: 0.3, ease: "none" });
    diveVideo.play().catch(() => { gsap.set(diveVideo, { opacity: 0 }); mode = 'dived'; lock(false); diveIn(); });
  }

  function goHero() {
    if (mode === 'hero') return;
    mode = 'hero';
    lock(true);
    lockedUntil = performance.now() + 1100;
    setTimeout(() => lock(false), 1100);
    diveQueued = false;
    gsap.killTweensOf(diveItems);
    gsap.to(diveItems, { opacity: 0, x: 40, duration: 0.3, ease: 'power2.in',
      onComplete: () => { scene.classList.remove('is-dived'); gsap.set(diveItems, { clearProps: 'all' }); } });
    gsap.to(diveVideo, { opacity: 0, duration: 0.5, ease: 'power1.inOut', onComplete: () => diveVideo.pause() });
    gsap.to(replay, { autoAlpha: 1, duration: 0.3, clearProps: 'all' });
    gsap.to(word, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 1, ease: 'expo.out', delay: 0.2 });
    gsap.to([...left, ...up], { opacity: 1, x: 0, y: 0, filter: 'blur(0px)', duration: 1, ease: 'expo.out', stagger: 0.05, delay: 0.2,
      onComplete: () => gsap.set([...left, ...up], { clearProps: 'transform,filter,opacity' }) });
  }

  diveVideo.addEventListener('timeupdate', () => {
    if (mode === 'diving' && diveVideo.duration && diveVideo.currentTime >= diveVideo.duration - DIVE_UI_BEFORE) diveIn();
  });
  diveVideo.addEventListener('ended', () => {
    if (mode === 'diving') { mode = 'dived'; diveIn(); lockedUntil = performance.now() + 700; lock(false); }
  });
  diveVideo.addEventListener('pause', () => setTimeout(() => {
    if (mode === 'diving' && diveVideo.paused && !diveVideo.ended) diveVideo.play().catch(() => {});
  }, 150));

  // ---------- sterowanie sekwencją gestem (desktop i telefon) ----------
  // W hero gest „w dół” nie przewija strony, tylko uruchamia nurkowanie; w trakcie filmu przewijanie
  // jest zablokowane. W sekcji 2 gest „w górę” wraca do hero, a „w dół” przewija dalej normalnie.
  const root = document.documentElement;
  const lock = (on) => root.classList.toggle('is-locked', on);
  let lockedUntil = 0;
  const atTop = () => window.scrollY <= 2;

  // zwraca true, gdy gest został „zużyty” przez scenę (trzeba zablokować domyślne przewijanie)
  function intent(dir) {
    if (mode === 'diving' || performance.now() < lockedUntil) return true;   // trwa przejście
    if (!atTop()) return false;
    if (dir > 0 && mode === 'hero') { goDive(); return true; }
    if (dir < 0 && mode === 'dived') { goHero(); return true; }
    return false;
  }

  window.addEventListener('wheel', (e) => {
    if (Math.abs(e.deltaY) < 4) return;
    if (intent(Math.sign(e.deltaY))) e.preventDefault();
  }, { passive: false });

  let t0 = null;
  window.addEventListener('touchstart', (e) => {
    const t = e.touches[0]; t0 = { x: t.clientX, y: t.clientY, used: false };
  }, { passive: true });
  window.addEventListener('touchmove', (e) => {
    if (!t0) return;
    const t = e.touches[0], dx = t.clientX - t0.x, dy = t.clientY - t0.y;
    if (t0.used) { e.preventDefault(); return; }
    if (Math.abs(dy) < 24 || Math.abs(dy) < Math.abs(dx)) {   // gest poziomy (pasek kafelków) — nie ruszamy
      if ((mode === 'diving' || performance.now() < lockedUntil) && e.cancelable) e.preventDefault();
      return;
    }
    if (intent(dy < 0 ? 1 : -1)) { t0.used = true; if (e.cancelable) e.preventDefault(); }
  }, { passive: false });
  window.addEventListener('touchend', () => { t0 = null; }, { passive: true });

  window.addEventListener('keydown', (e) => {
    if (/input|textarea|select/i.test(e.target.tagName)) return;
    const down = ['ArrowDown', 'PageDown', ' ', 'Spacebar'].includes(e.key);
    const up = ['ArrowUp', 'PageUp'].includes(e.key);
    if ((down || up) && intent(down ? 1 : -1)) e.preventDefault();
  });

  // ---------- telefon: okno kadru podąża za ptakiem (filmy są poziome, ekran pionowy) ----------
  const mobile = window.matchMedia('(max-width: 760px)');
  const wordLayer = hero.querySelector('.hero__wordlayer');
  let track = null, camP = null;
  fetch('assets/tor-ptaka.json?v=2').then((r) => r.json()).then((j) => { track = j; }).catch(() => {});

  function birdX(name, el) {
    const t = track && track[name];
    if (!t) return 0.5;
    const i = Math.min(t.x.length - 1, Math.max(0, Math.floor((el.currentTime || 0) * t.fps)));
    return t.x[i];
  }
  // object-position (i mask-position) w %, tak by punkt f kadru wypadł na środku okna
  function posFor(f, el) {
    const bw = el.clientWidth, bh = el.clientHeight, vw = el.videoWidth || 1920, vh = el.videoHeight || 1072;
    const iw = vw * Math.max(bw / vw, bh / vh);
    if (iw - bw < 1) return 50;
    return Math.min(100, Math.max(0, (bw / 2 - f * iw) / (bw - iw) * 100));
  }
  function frame() {
    requestAnimationFrame(frame);
    if (!mobile.matches || !track) return;
    const active = mode === 'hero' ? video : diveVideo;
    const target = posFor(birdX(mode === 'hero' ? 'wlot' : 'nurek', active), active);
    camP = camP === null ? target : camP + (target - camP) * 0.22;
    const v = camP.toFixed(2) + '% 50%';
    video.style.objectPosition = v; diveVideo.style.objectPosition = v; still.style.objectPosition = v;
    wordLayer.style.webkitMaskPosition = v; wordLayer.style.maskPosition = v;
  }
  requestAnimationFrame(frame);
  mobile.addEventListener('change', () => {
    if (!mobile.matches) [video, diveVideo, still].forEach((el) => { el.style.objectPosition = ''; });
    if (!mobile.matches) { wordLayer.style.webkitMaskPosition = ''; wordLayer.style.maskPosition = ''; }
  });

  if (video.readyState >= 2) start();
  else video.addEventListener('loadeddata', start, { once: true });
})();
