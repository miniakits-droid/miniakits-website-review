/* Miniakits – homepage welcome popup + original chime (landing pages only) */
(function () {
  var KEY = 'mk_chime_popup_seen';
  var mem = false;
  function seen() { try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return mem; } }
  function mark() { mem = true; try { sessionStorage.setItem(KEY, '1'); } catch (e) {} }
  if (seen()) return;

  var lang = (document.documentElement.lang || 'fr').toLowerCase();
  var AR = lang.indexOf('ar') === 0;
  var EN = lang.indexOf('en') === 0;
  var waText = AR
    ? 'مرحبا Miniakits! أريد عُدّة Miniakits بـ 40 درهماً (مجسمان كبيران، أو 3 مجسمات متوسطة، أو 5 مجسمات صغيرة، مع الألوان والفُرَش). الكمية: … المدينة: …'
    : EN
    ? 'Hello Miniakits! I would like a Miniakits kit for 40 DH (2 large, 3 medium or 5 small figurines, paints and brushes included). Quantity: … City: …'
    : 'Bonjour Miniakits ! Je voudrais un kit Miniakits à 40 DH (2 grandes, 3 moyennes ou 5 petites figurines, peintures et pinceaux inclus). Quantité : … Ville : …';
  var wa = 'https://wa.me/212700563350?text=' + encodeURIComponent(waText);
  var T = AR ? {
    title: 'عُدّة Miniakits بـ 40 درهماً',
    body: 'مجسمان كبيران، أو 3 مجسمات متوسطة، أو 5 مجسمات صغيرة، مع الألوان والفُرَش. تُحضَّر حسب الطلب.',
    cta: 'اطلبوا عبر واتساب',
    close: 'إغلاق',
    sound: 'تشغيل الصوت',
    label: 'عرض Miniakits'
  } : EN ? {
    title: 'Miniakits kit — 40 DH',
    body: '2 large, 3 medium or 5 small figurines, with paints and brushes included. Made to order.',
    cta: 'Order on WhatsApp',
    close: 'Close',
    sound: 'Play sound',
    label: 'Miniakits offer'
  } : {
    title: 'Kit Miniakits à 40 DH',
    body: '2 grandes, 3 moyennes ou 5 petites figurines, avec peintures et pinceaux inclus. Fabriqué sur commande.',
    cta: 'Commander sur WhatsApp',
    close: 'Fermer',
    sound: 'Écouter le son',
    label: 'Offre Miniakits'
  };

  var css =
    '.mkc{position:fixed;inset:0;z-index:10000;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(20,24,40,.72)}' +
    '.mkc-box{position:relative;width:min(92vw,420px);background:#fff6e8;border:3px solid #1d4f86;border-radius:24px;padding:28px 22px 22px;box-shadow:8px 8px 0 #ef4f6c;text-align:center;outline:none;color:#23243a}' +
    '.mkc-box[dir=rtl]{text-align:center}' +
    '.mkc-logo{width:170px;height:auto;margin:0 auto 10px;display:block}' +
    '.mkc-box h2{font-family:Fredoka,Nunito,sans-serif;color:#1d4f86;font-size:clamp(1.35rem,5vw,1.7rem);line-height:1.2;margin:0 0 .45em}' +
    '.mkc-box p{margin:0 0 16px;line-height:1.55;font-size:1.02rem}' +
    '.mkc-cta{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:#25d366;color:#fff;text-decoration:none;border-radius:999px;padding:14px 22px;font:600 1.05rem Fredoka,Nunito,sans-serif;box-shadow:0 6px 0 #149c48}' +
    '.mkc-x{position:absolute;top:-10px;inset-inline-end:-10px;z-index:2;width:44px;height:44px;border-radius:50%;border:3px solid #fff;background:#1d4f86;color:#fff;font:700 24px/1 system-ui,sans-serif;cursor:pointer;box-shadow:0 4px 12px rgba(0,0,0,.35)}' +
    '.mkc-snd{display:none;position:absolute;top:10px;inset-inline-start:10px;width:40px;height:40px;border-radius:50%;border:2px solid #1d4f86;background:#fff;cursor:pointer;font-size:1.15rem;line-height:1}' +
    '.mkc-snd.is-on{display:inline-grid;place-items:center}' +
    '.mkc-x:focus-visible,.mkc-cta:focus-visible,.mkc-snd:focus-visible{outline:3px solid #ffd23f;outline-offset:3px}' +
    '@media (prefers-reduced-motion:no-preference){.mkc-box{animation:mkc-in .35s ease-out}}' +
    '@keyframes mkc-in{from{transform:translateY(12px) scale(.98);opacity:0}to{transform:none;opacity:1}}' +
    '@media (max-width:480px){.mkc-x{top:-6px;inset-inline-end:-6px}}';

  var audio = null, cancelled = false, plays = 0, MAX = 3, GAP = 2000;
  var repeatTimer = null, fallback = false, listenersOn = false, reduced = false;
  var wrap = null, styleEl = null, prevFocus = null;

  try { reduced = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches; } catch (e) {}

  function ensureAudio() {
    if (audio) return audio;
    audio = document.createElement('audio');
    audio.preload = 'none';
    audio.setAttribute('playsinline', '');
    audio.volume = 0.35;
    var o = document.createElement('source'); o.src = '/audio/chime.ogg'; o.type = 'audio/ogg';
    var m = document.createElement('source'); m.src = '/audio/chime.mp3'; m.type = 'audio/mpeg';
    var a = document.createElement('source'); a.src = '/audio/chime.m4a'; a.type = 'audio/mp4';
    audio.appendChild(o); audio.appendChild(m); audio.appendChild(a);
    audio.setAttribute('data-mk-chime', '1');
    wrap.appendChild(audio);
    audio.addEventListener('ended', onEnded);
    return audio;
  }

  function clearRepeat() { if (repeatTimer) { clearTimeout(repeatTimer); repeatTimer = null; } }

  function stopAudio() {
    cancelled = true;
    clearRepeat();
    if (audio) { try { audio.pause(); audio.currentTime = 0; } catch (e) {} }
  }

  function onEnded() {
    if (cancelled || plays >= MAX) return;
    repeatTimer = setTimeout(function () {
      repeatTimer = null;
      if (cancelled || !wrap) return;
      playOnce();
    }, GAP);
  }

  function playOnce() {
    if (cancelled || !wrap) return Promise.resolve();
    var el = ensureAudio();
    try { el.currentTime = 0; } catch (e) {}
    var p = el.play();
    if (p && p.then) {
      return p.then(function () { plays += 1; hideHint(); }).catch(function () { return Promise.reject(); });
    }
    plays += 1;
    hideHint();
    return Promise.resolve();
  }

  function showHint() {
    if (!wrap) return;
    var b = wrap.querySelector('.mkc-snd');
    if (b) b.classList.add('is-on');
  }
  function hideHint() {
    if (!wrap) return;
    var b = wrap.querySelector('.mkc-snd');
    if (b) b.classList.remove('is-on');
  }

  function startFromFallback(e) {
    if (cancelled || !fallback || !wrap) return;
    if (e && e.target && wrap.contains(e.target) && !e.target.closest('.mkc-snd')) return;
    if (e && (e.key === 'Escape' || e.key === 'Esc' || e.key === 'Tab')) return;
    fallback = false;
    unbindFallback();
    playOnce().catch(function () { fallback = true; showHint(); bindFallback(); });
  }

  function bindFallback() {
    if (listenersOn) return;
    listenersOn = true;
    document.addEventListener('keydown', startFromFallback, true);
    document.addEventListener('pointerdown', startFromFallback, true);
  }
  function unbindFallback() {
    if (!listenersOn) return;
    listenersOn = false;
    document.removeEventListener('keydown', startFromFallback, true);
    document.removeEventListener('pointerdown', startFromFallback, true);
  }

  function tryAutoplay() {
    if (reduced) {
      fallback = true;
      showHint();
      bindFallback();
      ensureAudio();
      return;
    }
    playOnce().catch(function () {
      fallback = true;
      showHint();
      bindFallback();
    });
  }

  function close() {
    mark();
    stopAudio();
    unbindFallback();
    document.removeEventListener('keydown', onKey);
    if (wrap) wrap.remove();
    if (styleEl) styleEl.remove();
    wrap = styleEl = audio = null;
    if (prevFocus && prevFocus.focus) try { prevFocus.focus(); } catch (e) {}
  }

  function onKey(e) {
    if (e.key === 'Escape' || e.key === 'Esc') { e.preventDefault(); close(); return; }
    if (e.key !== 'Tab' || !wrap) return;
    var f = wrap.querySelectorAll('a,button');
    if (!f.length) return;
    var a = f[0], z = f[f.length - 1];
    if (e.shiftKey && document.activeElement === a) { e.preventDefault(); z.focus(); }
    else if (!e.shiftKey && document.activeElement === z) { e.preventDefault(); a.focus(); }
  }

  function open() {
    if (seen() || wrap) return;
    styleEl = document.createElement('style');
    styleEl.textContent = css;
    document.head.appendChild(styleEl);
    prevFocus = document.activeElement;
    wrap = document.createElement('div');
    wrap.className = 'mkc';
    wrap.innerHTML =
      '<div class="mkc-box" role="dialog" aria-modal="true" aria-labelledby="mkc-title" tabindex="-1"' + (AR ? ' dir="rtl" lang="ar"' : (EN ? ' lang="en"' : ' lang="fr"')) + '>' +
        '<button type="button" class="mkc-x" aria-label="' + T.close + '">×</button>' +
        '<button type="button" class="mkc-snd" aria-label="' + T.sound + '">🔊</button>' +
        '<picture><source srcset="/img/logo-miniakits.webp?v=2" type="image/webp"><img class="mkc-logo" src="/img/logo-miniakits.png?v=2" width="170" height="59" alt="Miniakits"></picture>' +
        '<h2 id="mkc-title">' + T.title + '</h2>' +
        '<p>' + T.body + '</p>' +
        '<a class="mkc-cta" href="' + wa + '" target="_blank" rel="noopener">' + T.cta + '</a>' +
      '</div>';
    document.body.appendChild(wrap);
    var box = wrap.querySelector('.mkc-box');
    var x = wrap.querySelector('.mkc-x');
    var snd = wrap.querySelector('.mkc-snd');
    var cta = wrap.querySelector('.mkc-cta');
    x.addEventListener('click', function (e) { e.preventDefault(); e.stopPropagation(); close(); });
    cta.addEventListener('click', function () { stopAudio(); mark(); });
    wrap.addEventListener('click', function (e) { if (e.target === wrap) close(); });
    snd.addEventListener('click', function (e) {
      e.preventDefault();
      e.stopPropagation();
      if (cancelled) return;
      fallback = false;
      unbindFallback();
      playOnce().catch(function () { fallback = true; showHint(); bindFallback(); });
    });
    document.addEventListener('keydown', onKey);
    x.focus();
    tryAutoplay();
  }

  function schedule() {
    setTimeout(function () {
      if (seen()) return;
      if (document.visibilityState === 'hidden') {
        document.addEventListener('visibilitychange', function vc() {
          if (document.visibilityState === 'visible') { document.removeEventListener('visibilitychange', vc); open(); }
        });
        return;
      }
      open();
    }, 2500);
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', schedule);
  else schedule();
})();
