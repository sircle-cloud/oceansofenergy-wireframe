/* ============================================
   OCEANS OF ENERGY — Wireframe v1
   GSAP + ScrollTrigger + Lenis
   ============================================ */

gsap.registerPlugin(ScrollTrigger);

/* ---------- Smooth scroll (Lenis) ---------- */
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
});
lenis.on('scroll', ScrollTrigger.update);
gsap.ticker.add((time) => lenis.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* ---------- Loader ---------- */
const loader = document.querySelector('[data-loader]');
const countEl = document.querySelector('[data-loader-count]');
let count = 0;
const tick = () => {
  count += Math.floor(Math.random() * 8) + 2;
  if (count >= 100) {
    count = 100;
    countEl.textContent = count;
    setTimeout(() => {
      gsap.to(loader, {
        yPercent: -100,
        duration: 1,
        ease: 'expo.inOut',
        onComplete: () => { loader.style.display = 'none'; playHero(); }
      });
    }, 350);
  } else {
    countEl.textContent = count;
    setTimeout(tick, 60 + Math.random() * 80);
  }
};
tick();

/* ---------- Custom cursor ---------- */
const cursor = document.querySelector('[data-cursor]');
const dot = document.querySelector('[data-cursor-dot]');
const cur = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
const tgt = { x: cur.x, y: cur.y };
window.addEventListener('mousemove', (e) => {
  tgt.x = e.clientX;
  tgt.y = e.clientY;
  gsap.to(dot, { x: e.clientX, y: e.clientY, duration: 0.05, overwrite: true });
});
const raf = () => {
  cur.x += (tgt.x - cur.x) * 0.15;
  cur.y += (tgt.y - cur.y) * 0.15;
  cursor.style.transform = `translate(${cur.x}px, ${cur.y}px) translate(-50%, -50%)`;
  requestAnimationFrame(raf);
};
raf();

document.querySelectorAll('a, button, [data-magnetic]').forEach((el) => {
  el.addEventListener('mouseenter', () => cursor.classList.add('is-hover'));
  el.addEventListener('mouseleave', () => cursor.classList.remove('is-hover'));
});

/* ---------- Magnetic buttons ---------- */
document.querySelectorAll('[data-magnetic]').forEach((el) => {
  el.addEventListener('mousemove', (e) => {
    const r = el.getBoundingClientRect();
    const x = e.clientX - r.left - r.width / 2;
    const y = e.clientY - r.top - r.height / 2;
    gsap.to(el, { x: x * 0.25, y: y * 0.25, duration: 0.5, ease: 'power3.out' });
  });
  el.addEventListener('mouseleave', () => {
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
  });
});

/* ---------- Nav scroll state ---------- */
const nav = document.querySelector('[data-nav]');
ScrollTrigger.create({
  start: 80,
  end: 99999,
  onUpdate: (s) => nav.classList.toggle('is-scrolled', s.scroll() > 80),
});

/* ---------- Hero intro ---------- */
function playHero() {
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from('.hero__title [data-split]', {
    yPercent: 110,
    duration: 1.3,
    stagger: 0.08,
  })
  .from('.hero__eyebrow', { y: 20, opacity: 0, duration: 0.8 }, '-=1')
  .from('.hero__sub', { y: 24, opacity: 0, duration: 0.8 }, '-=0.8')
  .from('.hero__actions > *', { y: 20, opacity: 0, duration: 0.7, stagger: 0.08 }, '-=0.6');
}


/* ---------- Hero waves canvas ---------- */
const canvas = document.querySelector('[data-waves]');
if (canvas) {
  const ctx = canvas.getContext('2d');
  let w, h, t = 0;
  const resize = () => {
    w = canvas.width = canvas.offsetWidth * devicePixelRatio;
    h = canvas.height = canvas.offsetHeight * devicePixelRatio;
  };
  resize();
  window.addEventListener('resize', resize);
  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    for (let layer = 0; layer < 4; layer++) {
      ctx.beginPath();
      ctx.moveTo(0, h);
      const amp = 30 * devicePixelRatio + layer * 10;
      const freq = 0.004 - layer * 0.0005;
      const yOff = h * (0.55 + layer * 0.1);
      const speed = 0.008 + layer * 0.003;
      for (let x = 0; x <= w; x += 4) {
        const y = yOff + Math.sin(x * freq + t * speed) * amp + Math.sin(x * freq * 2 + t * speed * 1.4) * amp * 0.3;
        ctx.lineTo(x, y);
      }
      ctx.lineTo(w, h);
      ctx.closePath();
      const g = ctx.createLinearGradient(0, yOff - amp, 0, h);
      g.fillStyle = '#00E5FF';
      g.addColorStop(0, `rgba(0, 229, 255, ${0.08 - layer * 0.015})`);
      g.addColorStop(1, `rgba(0, 30, 60, 0)`);
      ctx.fillStyle = g;
      ctx.fill();
    }
    t += 1;
    requestAnimationFrame(draw);
  };
  draw();
}

/* ---------- Generic fade-in reveals ---------- */
gsap.utils.toArray('[data-fade]').forEach((el) => {
  gsap.from(el, {
    y: 40,
    opacity: 0,
    duration: 1,
    ease: 'expo.out',
    scrollTrigger: { trigger: el, start: 'top 85%' },
  });
});

/* ---------- Section title char reveal ---------- */
gsap.utils.toArray('[data-reveal]').forEach((el) => {
  const html = el.innerHTML;
  // wrap words minimally
  el.innerHTML = html.replace(/(\S+)/g, '<span class="word"><span class="word__i">$1</span></span>');
  el.querySelectorAll('.word').forEach((w) => {
    w.style.display = 'inline-block';
    w.style.overflow = 'hidden';
    w.style.verticalAlign = 'bottom';
  });
  el.querySelectorAll('.word__i').forEach((w) => {
    w.style.display = 'inline-block';
  });
  gsap.from(el.querySelectorAll('.word__i'), {
    yPercent: 110,
    duration: 1.1,
    ease: 'expo.out',
    stagger: 0.04,
    scrollTrigger: { trigger: el, start: 'top 80%' },
  });
});

/* ---------- Marquee infinite scroll ---------- */
const marquee = document.querySelector('[data-marquee]');
if (marquee) {
  const w = marquee.scrollWidth;
  gsap.to(marquee, {
    x: -w / 2,
    duration: 30,
    ease: 'none',
    repeat: -1,
  });
}

/* ---------- Tech step subtle parallax/hover stagger ---------- */
gsap.utils.toArray('[data-step]').forEach((step, i) => {
  gsap.from(step, {
    x: -30,
    opacity: 0,
    duration: 0.9,
    ease: 'expo.out',
    delay: i * 0.08,
    scrollTrigger: { trigger: step, start: 'top 85%' },
  });
});

/* ---------- Tech image parallax ---------- */
gsap.utils.toArray('[data-parallax]').forEach((el) => {
  gsap.to(el, {
    yPercent: -8,
    ease: 'none',
    scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: true },
  });
});

/* ---------- Counters ---------- */
gsap.utils.toArray('[data-counter]').forEach((el) => {
  const target = +el.dataset.target;
  const num = el.querySelector('.num');
  const obj = { v: 0 };
  ScrollTrigger.create({
    trigger: el,
    start: 'top 80%',
    once: true,
    onEnter: () => {
      gsap.to(obj, {
        v: target,
        duration: 2,
        ease: 'expo.out',
        onUpdate: () => { num.textContent = Math.floor(obj.v); },
      });
    },
  });
});

/* ---------- Hero bg parallax on scroll ---------- */
gsap.to('.hero__bg', {
  yPercent: 25,
  ease: 'none',
  scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true },
});

/* ---------- Refresh on load ---------- */
window.addEventListener('load', () => ScrollTrigger.refresh());
