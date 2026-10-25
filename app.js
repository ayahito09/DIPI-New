/**
 * RONA MASA · KEMBALI MENGINGAT KENANGAN
 * Nocturne edition: interactive hero, section deck, bento quote carousel,
 * fanart gallery + lightbox, audio ambience.
 */

document.documentElement.classList.add('js');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

document.addEventListener('DOMContentLoaded', () => {
  initTopbar();
  initHeroSpot();
  initHeroParticles();
  initScrollObserver();
  initSectionScroll();
  initQuotes();
  initGallery();
  initAudio();
  initSectionIndicator();
});

/* ==========================================================================
   SCROLL PROGRESS (--p for the top bar, --hp for the hero)
   ========================================================================== */
function initTopbar() {
  const root = document.documentElement;
  let ticking = false;
  const update = () => {
    ticking = false;
    const y = window.scrollY;
    const max = root.scrollHeight - window.innerHeight;
    root.style.setProperty('--p', max > 0 ? y / max : 0);
    root.style.setProperty('--hp', Math.min(1, y / window.innerHeight));
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();
}

/* ==========================================================================
   HERO SPOTLIGHT (pointer reveals the photo under the scrim)
   ========================================================================== */
function initHeroSpot() {
  const hero = document.getElementById('hero');
  const title = hero && hero.querySelector('.hero-title');
  if (!hero || !title) return;

  // Split the name into letters (h1 keeps its aria-label for screen readers)
  let i = 0;
  const walk = (node) => {
    for (const n of [...node.childNodes]) {
      if (n.nodeType === 1) { walk(n); continue; }
      const frag = document.createDocumentFragment();
      for (const c of n.textContent) {
        if (c === ' ') { frag.append(' '); continue; }
        const s = document.createElement('span');
        s.className = 'ch';
        s.textContent = c;
        s.style.setProperty('--i', i++);
        s.setAttribute('aria-hidden', 'true');
        frag.append(s);
      }
      n.replaceWith(frag);
    }
  };
  walk(title);
  if (reduceMotion) return;

  const letters = [...title.querySelectorAll('.ch')];
  hero.addEventListener('pointermove', (e) => {
    const r = hero.getBoundingClientRect();
    hero.style.setProperty('--mx', `${e.clientX - r.left}px`);
    hero.style.setProperty('--my', `${e.clientY - r.top}px`);
    hero.style.setProperty('--tx', ((e.clientX - r.left) / r.width - 0.5) * 2);
    hero.style.setProperty('--ty', ((e.clientY - r.top) / r.height - 0.5) * 2);
    for (const l of letters) {
      const b = l.getBoundingClientRect();
      const d = Math.hypot(e.clientX - (b.left + b.width / 2), e.clientY - (b.top + b.height / 2));
      const lift = Math.max(0, 1 - d / 180);
      l.style.setProperty('--lift', lift.toFixed(3));
      l.classList.toggle('is-near', lift > 0.45);
    }
  });
  hero.addEventListener('pointerleave', () => {
    ['--tx', '--ty'].forEach((p) => hero.style.removeProperty(p));
    letters.forEach((l) => { l.style.removeProperty('--lift'); l.classList.remove('is-near'); });
  });
}

/* ==========================================================================
   HERO PARTICLES (lime & ember motes)
   ========================================================================== */
function initHeroParticles() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || reduceMotion) return;
  const ctx = canvas.getContext('2d');
  const parent = canvas.parentElement;

  let w, h;
  function resize() {
    w = canvas.width = parent.offsetWidth;
    h = canvas.height = parent.offsetHeight;
  }
  resize();
  window.addEventListener('resize', resize);

  const pts = [];
  for (let i = 0; i < 28; i++) {
    pts.push({
      x: Math.random() * w,
      y: Math.random() * h,
      sz: Math.random() * 2.2 + 0.8,
      vx: (Math.random() - 0.5) * 0.4,
      vy: -Math.random() * 0.5 - 0.1,
      o: Math.random() * 0.5 + 0.3,
      p: Math.random() * Math.PI * 2,
      lime: Math.random() > 0.35,
    });
  }

  // Motes drift toward the pointer; a click scatters a burst that fades out
  let mx = -1e4, my = -1e4;
  const burst = [];
  parent.addEventListener('pointermove', (e) => {
    const r = canvas.getBoundingClientRect();
    mx = e.clientX - r.left; my = e.clientY - r.top;
  });
  parent.addEventListener('pointerleave', () => { mx = my = -1e4; });
  parent.addEventListener('click', (e) => {
    if (e.target.closest('a, button')) return;
    const r = canvas.getBoundingClientRect();
    for (let i = 0; i < 26; i++) {
      const ang = Math.random() * Math.PI * 2, sp = Math.random() * 4 + 1.5;
      burst.push({ x: e.clientX - r.left, y: e.clientY - r.top, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, life: 1, sz: Math.random() * 2.5 + 1, red: Math.random() > 0.6 });
    }
  });

  (function loop() {
    ctx.clearRect(0, 0, w, h);
    for (const p of pts) {
      const dx = mx - p.x, dy = my - p.y, d = Math.hypot(dx, dy);
      if (d < 220) { p.x += dx / d * 0.6; p.y += dy / d * 0.6; }
      p.x += p.vx;
      p.y += p.vy;
      p.p += 0.03;
      if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      const a = p.o * (0.55 + 0.45 * Math.sin(p.p));
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.sz, 0, Math.PI * 2);
      ctx.fillStyle = p.lime ? `rgba(214,255,77,${a})` : `rgba(255,138,91,${a})`;
      ctx.fill();
    }
    for (let i = burst.length - 1; i >= 0; i--) {
      const b = burst[i];
      b.x += b.vx; b.y += b.vy; b.vx *= 0.95; b.vy = b.vy * 0.95 + 0.05; b.life -= 0.012;
      if (b.life <= 0) { burst.splice(i, 1); continue; }
      ctx.beginPath();
      ctx.arc(b.x, b.y, b.sz, 0, Math.PI * 2);
      ctx.fillStyle = b.red ? `rgba(188,2,2,${b.life})` : `rgba(214,255,77,${b.life})`;
      ctx.fill();
    }
    requestAnimationFrame(loop);
  })();
}

/* ==========================================================================
   SCROLL REVEAL (IntersectionObserver)
   ========================================================================== */
function initScrollObserver() {
  // Stagger each section's parts in as the snap lands on it
  document.querySelectorAll('.sec-head').forEach((group) => {
    const parts = group.children;
    [...parts].forEach((el, i) => {
      el.classList.add('reveal');
      el.dataset.delay = Math.min(i + 1, 5);
    });
  });
  document.querySelectorAll('.quote-bento, .cine-photo, .gallery').forEach((el) => el.classList.add('reveal'));
  const els = document.querySelectorAll('.reveal');
  if (!els.length) return;
  // Toggled both ways so every visit to a section replays its reveal
  const obs = new IntersectionObserver((entries) => {
    // In deck mode every section overlaps the screen; the deck drives reveals instead
    if (document.documentElement.classList.contains('deck')) return;
    for (const e of entries) e.target.classList.toggle('is-visible', e.isIntersecting);
  }, { threshold: 0.2 });
  els.forEach((el) => obs.observe(el));
}

/* ==========================================================================
   SECTION DECK (fullscreen sections, one per step, each with its own entrance)
   Every section is fixed to the screen; wheel, keys and links swap them with the
   effect named in the incoming section's data-fx. A section taller than the
   screen (phones) scrolls inside itself and hands over at its top/bottom edge.
   Native scrolling returns only with reduced motion.
   ========================================================================== */
function initSectionScroll() {
  const root = document.documentElement;
  const stops = [...document.querySelectorAll('.panel')];
  if (reduceMotion || stops.length < 2) return;

  const DUR = 1100;
  let cur = 0;
  let busy = false;
  let enabled = false;
  const box = () => stops[cur];
  const lightboxOpen = () => !!document.querySelector('dialog[open]');
  // Can the current section still scroll by this much in that direction?
  const canScroll = (dir) => {
    const s = box();
    if (getComputedStyle(s).overflowY !== 'auto') return false; // the hero clips its bleed instead of scrolling
    return dir > 0 ? s.scrollTop + s.clientHeight < s.scrollHeight - 2 : s.scrollTop > 2;
  };

  // Reveals replay per section: only the current section's parts are shown
  const showReveals = (s, on) => s.querySelectorAll('.reveal').forEach((r) => r.classList.toggle('is-visible', on));

  function setDeck(on) {
    if (on === enabled) return;
    // Pick up from whichever section is in view before switching
    const mid = window.innerHeight / 2;
    cur = Math.max(0, stops.findIndex((s) => s.getBoundingClientRect().bottom > mid));
    enabled = true;
    root.classList.add('deck');
    window.scrollTo({ top: 0, behavior: 'instant' });
    stops.forEach((s, i) => { s.classList.toggle('is-current', i === cur); showReveals(s, i === cur); });
    root.style.setProperty('--p', cur / (stops.length - 1));
    document.dispatchEvent(new CustomEvent('deckchange', { detail: { from: cur, to: cur } }));
  }

  setDeck(true);

  function go(to) {
    if (!enabled || busy || to === cur || to < 0 || to >= stops.length) return;
    const from = stops[cur];
    const next = stops[to];
    busy = true;
    showReveals(from, false);
    from.classList.add('is-leaving');
    document.dispatchEvent(new CustomEvent('deckchange', { detail: { from: cur, to } }));
    // Arrive at the edge you came from (clipped sections like the hero never offset)
    next.scrollTop = to < cur && getComputedStyle(next).overflowY === 'auto' ? next.scrollHeight : 0;
    next.classList.add('is-current', `fx-${next.dataset.fx || 'rise'}`);
    root.style.setProperty('--p', to / (stops.length - 1));
    root.style.setProperty('--hp', to === 0 ? 0 : 1);
    setTimeout(() => showReveals(next, true), DUR * 0.45);
    setTimeout(() => {
      from.classList.remove('is-current', 'is-leaving');
      next.classList.remove(`fx-${next.dataset.fx || 'rise'}`);
      cur = to;
      busy = false;
    }, DUR);
  }
  window.__deckGo = go;

  window.addEventListener('wheel', (e) => {
    if (!enabled || e.ctrlKey || lightboxOpen()) return;
    const qFeature = e.target.closest('#qFeature');
    if (qFeature) {
      const dir = e.deltaY > 0 ? 1 : -1;
      const canScrollQ = dir > 0
        ? qFeature.scrollTop + qFeature.clientHeight < qFeature.scrollHeight - 1
        : qFeature.scrollTop > 1;
      if (canScrollQ) return; // allow quote box to scroll its own text
      e.preventDefault(); // do not scroll or switch outer section
      return;
    }
    const dir = e.deltaY > 0 ? 1 : -1;
    if (canScroll(dir)) return; // let the section scroll itself first
    e.preventDefault();
    if (Math.abs(e.deltaY) >= 8) go(cur + dir);
  }, { passive: false });

  window.addEventListener('keydown', (e) => {
    if (!enabled || lightboxOpen() || e.target.closest('input, textarea, button, a, iframe')) return;
    const dir = { ArrowDown: 1, PageDown: 1, ' ': e.shiftKey ? -1 : 1, ArrowUp: -1, PageUp: -1 }[e.key];
    const jump = { Home: 0, End: stops.length - 1 }[e.key];
    if (dir === undefined && jump === undefined) return;
    if (dir !== undefined && canScroll(dir)) return;
    e.preventDefault();
    go(jump ?? cur + dir);
  });

  // Touch swipe
  // A swipe changes section only if the section was already at that edge when the touch began.
  // Scrolling inside the quotes area (#qFeature) is isolated so the section does not scroll or switch.
  let ty = null, edgeUp = false, edgeDown = false, touchInQuote = false;
  window.addEventListener('touchstart', (e) => {
    touchInQuote = !!e.target.closest('#qFeature');
    ty = e.touches[0].clientY;
    edgeUp = !canScroll(1);   // nothing more below: swiping up goes forward
    edgeDown = !canScroll(-1); // nothing more above: swiping down goes back
  }, { passive: true });
  window.addEventListener('touchend', (e) => {
    if (!enabled || ty === null || lightboxOpen() || touchInQuote) {
      ty = null;
      touchInQuote = false;
      return;
    }
    const dy = ty - e.changedTouches[0].clientY;
    if (dy > 50 && edgeUp) go(cur + 1);
    else if (dy < -50 && edgeDown) go(cur - 1);
    ty = null;
    touchInQuote = false;
  });

  document.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const i = stops.indexOf(document.querySelector(a.getAttribute('href')));
      if (!enabled || i < 0) return;
      e.preventDefault();
      go(i);
    });
  });
}

/* ==========================================================================
   QUOTES (birthday wishes: names cycle every 3s, the active wish fills the feature)
   ========================================================================== */
function initQuotes() {
  const bento = document.getElementById('quoteStrip');
  const list = bento && bento.querySelector('.q-list');
  const feature = document.getElementById('qFeature');
  const text = document.getElementById('qText');
  const name = document.getElementById('qName');
  const cards = [...document.querySelectorAll('.q-card')];
  if (!bento || !list || !cards.length) return;
  let cur = 0;

  // Voice: one clip per sender (assets/audio/NN.mp3), loaded only when played.
  // While a clip plays the 3s carousel timer is paused (CSS .is-voice); when it ends the carousel moves on.
  const voice = new Audio();
  voice.preload = 'none';
  voice.volume = 1; // Full volume output (voice clips amplified +40% for crisp clarity)
  const btn = document.getElementById('qPlay');
  const label = document.getElementById('qPlayLabel');
  const bar = document.getElementById('qBar');
  const time = document.getElementById('qTime');
  const fmt = (s) => `${Math.floor(s / 60)}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
  const paint = () => {
    const playing = !voice.paused && !voice.ended;
    document.dispatchEvent(new CustomEvent('voice', { detail: playing }));
    bento.classList.toggle('is-voice', playing);
    btn.classList.toggle('is-on', playing);
    btn.setAttribute('aria-label', playing ? 'Jeda suara' : 'Putar suara');
    label.textContent = playing ? 'Jeda suara' : (voice.currentTime > 0 && !voice.ended ? 'Lanjut' : 'Putar suara');
    cards.forEach((c, i) => c.classList.toggle('is-voice', playing && i === cur));
    const d = voice.duration || 0;
    bar.style.width = d ? `${(voice.currentTime / d) * 100}%` : '0%';
    time.textContent = d ? `${fmt(voice.currentTime)} / ${fmt(d)}` : '0:00';
  };
  function resetVoice() { voice.pause(); voice.removeAttribute('src'); voice.load(); paint(); }
  btn.addEventListener('click', () => {
    if (!voice.paused) { voice.pause(); return; }
    if (!voice.getAttribute('src')) voice.src = cards[cur].dataset.audio;
    voice.play().catch(() => {}); // blocked or missing file: stay silent, button stays idle
  });
  ['play', 'pause', 'timeupdate', 'loadedmetadata'].forEach((ev) => voice.addEventListener(ev, paint));
  voice.addEventListener('ended', () => { resetVoice(); focus((cur + 1) % cards.length); });
  document.addEventListener('deckchange', resetVoice); // leaving the section silences it

  function focus(idx) {
    if (idx !== cur || voice.getAttribute('src')) resetVoice();
    cur = idx;
    const card = cards[idx];
    cards.forEach((c, i) => {
      c.classList.toggle('is-active', i === idx);
      c.setAttribute('aria-pressed', String(i === idx));
    });
    const quote = card.dataset.quote;
    text.textContent = quote;
    name.textContent = card.textContent.trim();
    feature.scrollTop = 0;
    if (!reduceMotion) {
      text.animate([{ opacity: 0, translate: '0 16px', filter: 'blur(6px)' }, { opacity: 1, translate: '0 0', filter: 'blur(0)' }], { duration: 600, easing: 'cubic-bezier(.22,1,.36,1)' });
    }
    // Keep the active name in view when the list scrolls (phone row)
    if (list.scrollWidth > list.clientWidth) {
      list.scrollTo({ left: card.offsetLeft - list.offsetLeft - (list.clientWidth - card.offsetWidth) / 2, behavior: 'smooth' });
    }
  }

  // The active name's 3s timer bar (CSS) finishing is the carousel tick
  bento.addEventListener('animationend', (e) => {
    if (e.target === cards[cur]) focus((cur + 1) % cards.length);
  });
  cards.forEach((c, i) => {
    c.style.setProperty('--i', i);
    c.addEventListener('click', () => focus(i));
  });

  // On mobile/touch: keep scrolling contained inside quotes feature so outer section never scrolls with it
  let qTouchStartY = 0;
  feature.addEventListener('touchstart', (e) => {
    qTouchStartY = e.touches[0].clientY;
  }, { passive: true });

  feature.addEventListener('touchmove', (e) => {
    if (!e.touches.length) return;
    const currentY = e.touches[0].clientY;
    const dy = currentY - qTouchStartY;
    const isScrollingDown = dy < 0; // finger drag up -> text scroll down
    const isScrollingUp = dy > 0;   // finger drag down -> text scroll up
    const isAtTop = feature.scrollTop <= 0;
    const isAtBottom = feature.scrollTop + feature.clientHeight >= feature.scrollHeight - 1;

    // Prevent parent section/panel from scrolling when reaching boundaries of quote text
    if ((isScrollingDown && isAtBottom) || (isScrollingUp && isAtTop)) {
      if (e.cancelable) e.preventDefault();
    }
    e.stopPropagation();
  }, { passive: false });

  focus(0);
}

/* ==========================================================================
   AUDIO BACKGROUND & PLAYLIST
   Tracks:
   1. Penjaga Hati - Nadhif Basalamah (Crop: 03:06 - 04:20)
   2. Fiction (Sumika) - Divya Peashy (Birthday Cover Song)
   3. Memory - Divya Peashy (Original Song)
   Controls: Prev, Play/Pause, Next, smooth fading, cinema & voice ducking
   ========================================================================== */
function initAudio() {
  const player = document.getElementById('audioPlayer');
  const btn = document.getElementById('btnAudio');
  const btnPrev = document.getElementById('btnAudioPrev');
  const btnNext = document.getElementById('btnAudioNext');
  const label = document.getElementById('audioLabel');
  if (!btn) return;

  const playlist = [
    {
      title: 'Penjaga Hati',
      artist: 'Nadhif Basalamah',
      src: 'assets/audio/penjaga-hati.mp3',
      fallback: 'nadhif basalamah - penjaga hati (Official Lyric Video).mp3'
    },
    {
      title: 'Fiction',
      subtitle: 'Cover',
      artist: 'Divya Peashy',
      src: 'assets/audio/fiction-sumika.mp3',
      fallback: '【Birthday Cover Song】Fiction - Sumika by Divya Peashy.mp3'
    },
    {
      title: 'Memory',
      subtitle: 'Original Song',
      artist: 'Divya Peashy',
      src: 'assets/audio/memory.mp3',
      fallback: '【Original Song】 Memory - Divya Peashy.mp3'
    }
  ];

  let curTrack = 0;
  let fallbackAttempted = false;
  let trackSwitchTimer = null;
  const audio = document.getElementById('bgAudio') || new Audio(playlist[0].src);
  audio.loop = false; // Playlist auto-advances to the next song
  audio.preload = 'metadata';

  // Fallback to root or alternative file if assets path fails
  audio.addEventListener('error', () => {
    const track = playlist[curTrack];
    if (!fallbackAttempted && track.fallback && !audio.src.includes(encodeURI(track.fallback)) && !audio.src.includes(track.fallback)) {
      fallbackAttempted = true;
      audio.src = track.fallback;
      audio.load();
      if (isPlaying) {
        audio.play().catch(() => {});
      }
    }
  });

  const TARGET_VOL = 0.48; // reduced by 20% from 0.60
  const FADE_IN_MS = 2000;
  const FADE_OUT_MS = 1200;

  let isPlaying = false;
  let userPaused = false;
  let fadeAnimId = null;
  let voiceOn = false; // a quote's voice clip is playing: music ducks to 20%
  const gestureEvents = ['pointerdown', 'pointerup', 'touchend', 'click', 'keydown'];

  function updateTrackUI() {
    const track = playlist[curTrack];
    if (label) {
      label.textContent = track.title;
      label.title = `${track.title} — ${track.artist}${track.subtitle ? ` (${track.subtitle})` : ''}`;
    }
    btn.setAttribute('aria-label', `${isPlaying ? 'Jeda' : 'Putar'} lagu ${track.title} oleh ${track.artist}`);
  }

  // Target volume from the current state: cinema dims it, a quote's voice ducks it
  function retarget(ms) {
    const base = document.body.classList.contains('cinema-on') ? 0.08 : TARGET_VOL;
    setVolumeSmooth(voiceOn ? base * 0.2 : base, ms);
  }

  document.addEventListener('voice', (e) => {
    if (voiceOn === e.detail) return;
    voiceOn = e.detail;
    if (!isPlaying) return;
    if (volumeLocked) voiceOn ? audio.pause() : audio.play().catch(() => {});
    else retarget(voiceOn ? 400 : 1200);
  });

  // iOS Safari ignores audio.volume (always 1): there the music pauses under a voice clip instead of ducking
  audio.volume = 0.5;
  const volumeLocked = audio.volume !== 0.5;
  audio.volume = 1;

  // Timer, not rAF: rAF stalls in background tabs and would leave the music stuck at volume 0
  function setVolumeSmooth(target, duration, onComplete) {
    if (volumeLocked) {
      if (onComplete) onComplete();
      return;
    }
    if (fadeAnimId) clearInterval(fadeAnimId);
    const startVol = audio.volume;
    const startTime = performance.now();

    fadeAnimId = setInterval(() => {
      const progress = Math.min(1, (performance.now() - startTime) / duration);
      // Cosine easing for natural acoustic perceived loudness
      const eased = 0.5 * (1 - Math.cos(Math.PI * progress));
      audio.volume = Math.max(0, Math.min(1, startVol + (target - startVol) * eased));
      if (progress < 1) return;
      clearInterval(fadeAnimId);
      fadeAnimId = null;
      audio.volume = target;
      if (onComplete) onComplete();
    }, 30);
  }

  // Crop / boundary handling for tracks (safe on iOS Safari)
  function enforceTrackBounds() {
    const track = playlist[curTrack];
    if (!track.cropStart || !audio.duration || audio.duration <= 200) return;
    if (track.cropEnd && audio.currentTime >= track.cropEnd) {
      nextTrack(true);
      return;
    }
    if (audio.currentTime < track.cropStart && audio.readyState >= 2 && audio.seekable && audio.seekable.length > 0) {
      try {
        audio.currentTime = track.cropStart;
      } catch (e) {}
    }
  }

  audio.addEventListener('loadedmetadata', enforceTrackBounds);
  audio.addEventListener('timeupdate', () => {
    if (isPlaying) enforceTrackBounds();
  });

  // When current track finishes naturally, advance to next track (debounced to avoid iOS false-ended triggers)
  audio.addEventListener('ended', () => {
    if (trackSwitchTimer) clearTimeout(trackSwitchTimer);
    trackSwitchTimer = setTimeout(() => {
      nextTrack(true);
    }, 200);
  });

  function loadTrack(idx, shouldPlay = true) {
    fallbackAttempted = false;
    curTrack = (idx + playlist.length) % playlist.length;
    const track = playlist[curTrack];
    audio.src = track.src;
    audio.load();
    updateTrackUI();
    if (shouldPlay) {
      userPaused = false;
      play();
    }
  }

  function nextTrack(autoPlay = true) {
    if (isPlaying && !volumeLocked) {
      setVolumeSmooth(0, 300, () => {
        loadTrack(curTrack + 1, autoPlay);
      });
    } else {
      loadTrack(curTrack + 1, autoPlay && isPlaying);
    }
  }

  function prevTrack() {
    const track = playlist[curTrack];
    const offset = track.cropStart ? track.cropStart : 0;
    const elapsed = audio.currentTime - offset;
    // If played more than 3 seconds, restart current track; otherwise go to previous
    if (elapsed > 3) {
      try { audio.currentTime = offset; } catch (e) {}
      if (!isPlaying) play();
      return;
    }
    if (isPlaying && !volumeLocked) {
      setVolumeSmooth(0, 300, () => {
        loadTrack(curTrack - 1, true);
      });
    } else {
      loadTrack(curTrack - 1, false);
    }
  }

  function play() {
    if (userPaused) return;
    enforceTrackBounds();
    isPlaying = true;
    btn.setAttribute('aria-pressed', 'true');
    updateTrackUI();
    if (!volumeLocked) {
      try { audio.volume = 0; } catch (e) {}
    }
    const p = audio.play();
    if (p !== undefined) {
      p.then(() => {
        if (!volumeLocked) {
          retarget(FADE_IN_MS);
        }
        gestureEvents.forEach((ev) => window.removeEventListener(ev, onFirstGesture, { capture: true }));
      }).catch(() => {
        // Autoplay blocked by browser policy without user gesture
        isPlaying = false;
        btn.setAttribute('aria-pressed', 'false');
        updateTrackUI();
      });
    }
  }

  function pause() {
    isPlaying = false;
    userPaused = true;
    btn.setAttribute('aria-pressed', 'false');
    updateTrackUI();
    setVolumeSmooth(0, FADE_OUT_MS, () => {
      audio.pause();
    });
  }

  btn.addEventListener('click', () => {
    if (isPlaying && !audio.paused) {
      pause();
    } else {
      userPaused = false;
      play();
    }
  });

  btnNext?.addEventListener('click', (e) => {
    e.stopPropagation();
    nextTrack(true);
  });

  btnPrev?.addEventListener('click', (e) => {
    e.stopPropagation();
    prevTrack();
  });

  // Hero "Putar musik" button: an explicit start for when the browser blocks autoplay
  const heroPlay = document.getElementById('heroPlay');
  heroPlay?.addEventListener('click', () => { userPaused = false; play(); });

  updateTrackUI();

  // Immediate autoplay attempt
  play();

  // Autoplay blocked: retry on a gesture the browser accepts (scroll/wheel/touchstart don't count)
  function onFirstGesture(e) {
    if (player?.contains(e.target) || heroPlay?.contains(e.target)) return;
    if (!isPlaying && !userPaused) play();
  }
  gestureEvents.forEach((ev) => window.addEventListener(ev, onFirstGesture, { capture: true, passive: true }));

  // Duck audio if user enters cinema mode (watching videos)
  const cinemaObserver = new MutationObserver(() => {
    if (isPlaying) retarget(800);
  });
  cinemaObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
}

/* ==========================================================================
   GALERI FANART (pointer tilt + <dialog> lightbox with prev/next, keys, swipe)
   ========================================================================== */
function initGallery() {
  const items = [...document.querySelectorAll('.g-item')];
  const lb = document.getElementById('gLightbox');
  if (!items.length || !lb) return;
  const img = document.getElementById('gImg');
  const cap = document.getElementById('gCap');
  const count = document.getElementById('gCount');
  let cur = 0;

  function show(i, dir = 0) {
    cur = (i + items.length) % items.length;
    const src = items[cur].querySelector('img');
    img.src = src.src;
    img.alt = src.alt;
    cap.textContent = items[cur].dataset.cap;
    count.textContent = `${cur + 1} / ${items.length}`;
    if (dir && !reduceMotion) {
      img.animate([{ opacity: 0, translate: `${dir * 60}px 0`, scale: 0.96 }, { opacity: 1, translate: '0 0', scale: 1 }], { duration: 500, easing: 'cubic-bezier(.22,1,.36,1)' });
    }
  }

  items.forEach((item, i) => {
    item.addEventListener('click', () => { show(i); lb.showModal(); });
    if (reduceMotion) return;
    item.addEventListener('pointermove', (e) => {
      const r = item.getBoundingClientRect();
      item.style.setProperty('--rx', `${((e.clientY - r.top) / r.height - 0.5) * -10}deg`);
      item.style.setProperty('--ry', `${((e.clientX - r.left) / r.width - 0.5) * 10}deg`);
    });
    item.addEventListener('pointerleave', () => { item.style.removeProperty('--rx'); item.style.removeProperty('--ry'); });
  });

  document.getElementById('gPrev').addEventListener('click', () => show(cur - 1, -1));
  document.getElementById('gNext').addEventListener('click', () => show(cur + 1, 1));
  document.getElementById('gClose').addEventListener('click', () => lb.close());
  lb.addEventListener('click', (e) => { if (e.target === lb) lb.close(); }); // backdrop
  lb.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') show(cur - 1, -1);
    if (e.key === 'ArrowRight') show(cur + 1, 1);
  });
  let tx = null;
  lb.addEventListener('touchstart', (e) => { tx = e.touches[0].clientX; }, { passive: true });
  lb.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - tx;
    if (Math.abs(dx) > 50) show(cur + (dx < 0 ? 1 : -1), dx < 0 ? 1 : -1);
  });
}

/* ==========================================================================
   SECTION INDICATOR (compact floating pill with section counter + interactive steppers)
   ========================================================================== */
function initSectionIndicator() {
  const indicator = document.getElementById('secIndicator');
  if (!indicator) return;

  const stops = [...document.querySelectorAll('.panel')];
  const dots = [...indicator.querySelectorAll('.sec-dot')];
  const curNum = indicator.querySelector('.sec-cur');
  const totalNum = indicator.querySelector('.sec-total');
  const secName = document.getElementById('secName');
  const counter = document.getElementById('secCounter');

  const names = ['Beranda', 'Ucapan', 'Bioskop', 'Galeri'];
  const total = stops.length || 4;

  if (totalNum) totalNum.textContent = String(total);

  function updateIndicator(to) {
    if (to < 0 || to >= total) return;

    // Update dots
    dots.forEach((dot, idx) => {
      const active = idx === to;
      dot.classList.toggle('is-active', active);
      dot.setAttribute('aria-selected', String(active));
      dot.setAttribute('tabindex', active ? '0' : '-1');
    });

    // Update numbers
    if (curNum) curNum.textContent = String(to + 1);
    else if (counter) counter.textContent = `${to + 1} / ${total}`;

    // Update section name
    if (secName) {
      secName.textContent = names[to] || (stops[to] ? stops[to].id : '');
    }

    // Toggle light theme when in section 1 (Quotes / Ucapan)
    indicator.classList.toggle('is-light', to === 1);
  }

  // Dot navigation click handlers
  dots.forEach((dot, idx) => {
    dot.addEventListener('click', (e) => {
      e.preventDefault();
      if (typeof window.__deckGo === 'function') {
        window.__deckGo(idx);
      } else if (stops[idx]) {
        stops[idx].scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // Listen for deckchange custom events
  document.addEventListener('deckchange', (e) => {
    if (e.detail && typeof e.detail.to === 'number') {
      updateIndicator(e.detail.to);
    }
  });

  // Native scroll fallback / reduced motion support
  if (reduceMotion || !document.documentElement.classList.contains('deck')) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = stops.indexOf(entry.target);
          if (idx >= 0) updateIndicator(idx);
        }
      });
    }, { threshold: 0.5 });
    stops.forEach((s) => obs.observe(s));
  }

  // Initial update
  updateIndicator(0);
}

