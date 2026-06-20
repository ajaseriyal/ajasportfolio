const clamp = (value, min = 0, max = 1) => Math.min(max, Math.max(min, value));
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const header = document.querySelector('.site-header');
const story = document.querySelector('.portrait-story');
const stage = document.querySelector('.portrait-stage');
const portrait = document.querySelector('.portrait-shell');
const portraitImage = portrait?.querySelector('img');
const monogram = document.querySelector('.hero-monogram');

let ticking = false;

function updateScrollStory() {
  const y = window.scrollY;
  header?.classList.toggle('past-hero', y > 70);

  if (story && portrait && !reduceMotion) {
    const start = story.offsetTop;
    const travel = Math.max(1, story.offsetHeight - window.innerHeight);
    const progress = clamp((y - start) / travel);
    const scale = .76 + progress * 1.72;
    const translate = 17 - progress * 16;
    portrait.style.transform = `translateY(${translate}%) scale(${scale})`;
    portrait.style.borderRadius = `${50 - progress * 28}% ${50 - progress * 28}% ${24 - progress * 13}% ${24 - progress * 13}% / ${16 - progress * 5}% ${16 - progress * 5}% 10% 10%`;
    if (portraitImage) {
      portraitImage.style.filter = `saturate(${.82 + progress * .22}) contrast(${.96 + progress * .08})`;
    }
    stage?.classList.toggle('deep', progress > .58);
  }

  if (monogram && !reduceMotion) {
    const introProgress = clamp(y / Math.max(1, window.innerHeight));
    monogram.style.opacity = String(1 - introProgress * 1.25);
    monogram.style.transform = `translate(-51%, -50%) scale(${1 + introProgress * .14})`;
  }

  ticking = false;
}

function requestScrollUpdate() {
  if (!ticking) {
    requestAnimationFrame(updateScrollStory);
    ticking = true;
  }
}

window.addEventListener('scroll', requestScrollUpdate, { passive: true });
window.addEventListener('resize', requestScrollUpdate);
updateScrollStory();

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('in-view');
      revealObserver.unobserve(entry.target);
    }
  });
}, { rootMargin: '0px 0px -8% 0px', threshold: .08 });

document.querySelectorAll('.reveal').forEach((node) => revealObserver.observe(node));

if (window.location.hash) {
  const hashTarget = document.querySelector(window.location.hash);
  hashTarget?.classList.add('in-view');
  hashTarget?.querySelectorAll('.reveal').forEach((node) => node.classList.add('in-view'));
}

const words = ['special', 'transform', 'redefine', 'emerge', 'invent', 'evolve'];
const changingWord = document.querySelector('#changing-word');
let wordIndex = 0;

if (changingWord && !reduceMotion) {
  window.setInterval(() => {
    wordIndex = (wordIndex + 1) % words.length;
    changingWord.animate(
      [
        { opacity: 1, transform: 'translateY(0)' },
        { opacity: 0, transform: 'translateY(-.22em)', offset: .48 },
        { opacity: 0, transform: 'translateY(.22em)', offset: .52 },
        { opacity: 1, transform: 'translateY(0)' }
      ],
      { duration: 700, easing: 'cubic-bezier(.2,.7,.2,1)' }
    );
    window.setTimeout(() => { changingWord.textContent = words[wordIndex]; }, 350);
  }, 2400);
}

const emailButton = document.querySelector('.email-button[aria-expanded]');
emailButton?.addEventListener('click', () => {
  const expanded = emailButton.getAttribute('aria-expanded') === 'true';
  if (!expanded) {
    emailButton.setAttribute('aria-expanded', 'true');
    emailButton.innerHTML = '<span>ajas@shiftt.online</span><i>\u2197</i>';
    emailButton.addEventListener('click', () => {
      window.location.href = 'mailto:ajas@shiftt.online';
    }, { once: true });
  }
});

document.querySelectorAll('.case-card').forEach((card) => {
  card.addEventListener('pointermove', (event) => {
    if (reduceMotion || window.innerWidth < 760) return;
    const rect = card.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - .5;
    const y = (event.clientY - rect.top) / rect.height - .5;
    const media = card.querySelector('.case-media');
    if (media) media.style.transform = `translate(${x * 7}px, ${y * 7}px)`;
  });
  card.addEventListener('pointerleave', () => {
    const media = card.querySelector('.case-media');
    if (media) media.style.transform = '';
  });
});

document.querySelector('#year').textContent = new Date().getFullYear();
