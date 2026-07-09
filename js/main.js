/* =============================================
   ANKIT MISHRA PORTFOLIO v2 — MAIN JS
   ============================================= */

// ===== THEME TOGGLE (WORKING) =====
const html = document.documentElement;
const themeBtn = document.getElementById('themeBtn');
const themeIcon = document.getElementById('themeIcon');

const saved = localStorage.getItem('am-theme') || 'dark';
setTheme(saved);

function setTheme(t) {
  html.setAttribute('data-theme', t);
  localStorage.setItem('am-theme', t);
  themeIcon.textContent = t === 'dark' ? '☀' : '◑';
}

themeBtn.addEventListener('click', () => {
  const cur = html.getAttribute('data-theme');
  setTheme(cur === 'dark' ? 'light' : 'dark');
});

// ===== PAGE NAVIGATION (WORKING) =====
const pages = document.querySelectorAll('.page');
const navBtns = document.querySelectorAll('.nav-btn');

function showPage(name) {
  // Hide all pages
  pages.forEach(p => p.classList.remove('active'));
  navBtns.forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.mob-nav-btn').forEach(b => b.classList.remove('active'));

  // Show target page
  const target = document.getElementById('page-' + name);
  if (target) {
    target.classList.add('active');
    window.scrollTo(0, 0);
  }

  // Highlight nav btn
  navBtns.forEach(b => { if (b.dataset.page === name) b.classList.add('active'); });

  // Close mobile menu
  closeMobileMenu();

  // Trigger skill bar animations when visiting skills page
  if (name === 'skills') {
    setTimeout(animateActiveBars, 200);
  }
}

// Nav buttons
navBtns.forEach(btn => {
  btn.addEventListener('click', () => showPage(btn.dataset.page));
});

// Logo click
document.querySelector('.nav-logo').addEventListener('click', () => showPage('home'));

// Mobile nav
document.querySelectorAll('.mob-nav-btn').forEach(btn => {
  btn.addEventListener('click', () => showPage(btn.dataset.page));
});

// Expose globally for inline onclick
window.showPage = showPage;

// ===== MOBILE MENU =====
const hamburger = document.getElementById('hamburger');
const mobMenu = document.getElementById('mobMenu');
const mobOverlay = document.getElementById('mobOverlay');
const mobClose = document.getElementById('mobClose');

hamburger.addEventListener('click', openMobileMenu);
mobClose.addEventListener('click', closeMobileMenu);
mobOverlay.addEventListener('click', closeMobileMenu);

function openMobileMenu() {
  mobMenu.classList.add('open');
  mobOverlay.classList.add('open');
}
function closeMobileMenu() {
  mobMenu.classList.remove('open');
  mobOverlay.classList.remove('open');
}

// Canvas particles removed to prevent null reference error

// ===== SCROLL PROGRESS & BACK TO TOP =====
const progressBar = document.getElementById('progressBar');
const backToTopBtn = document.getElementById('backToTopBtn');

pages.forEach(page => {
  page.addEventListener('scroll', () => {
    if (!page.classList.contains('active')) return;
    
    // Progress Bar
    const scrollTop = page.scrollTop;
    const scrollHeight = page.scrollHeight - page.clientHeight;
    const scrollPercent = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = scrollPercent + '%';

    // Back to top button
    if (backToTopBtn) {
      if (scrollTop > 300) {
        backToTopBtn.classList.add('show');
      } else {
        backToTopBtn.classList.remove('show');
      }
    }
  });
});

if (backToTopBtn) {
  backToTopBtn.addEventListener('click', () => {
    const activePage = document.querySelector('.page.active');
    if (activePage) {
      gsap.to(activePage, { scrollTop: 0, duration: 0.6, ease: "power2.out" });
    }
  });
}

// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const cursorRing = document.getElementById('cursorRing');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px';
  cursor.style.top = my + 'px';
});

(function followRing() {
  rx += (mx - rx) * 0.12;
  ry += (my - ry) * 0.12;
  cursorRing.style.left = rx + 'px';
  cursorRing.style.top = ry + 'px';
  requestAnimationFrame(followRing);
})();

document.querySelectorAll('a, button, .proj-card, .cert-card, .ach-card, .skill-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2.2)';
    cursorRing.style.transform = 'translate(-50%,-50%) scale(1.6)';
    cursorRing.style.opacity = '0.2';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    cursorRing.style.transform = 'translate(-50%,-50%) scale(1)';
    cursorRing.style.opacity = '0.45';
  });
});

// ===== TYPING EFFECT =====
const phrases = [
  'AI Engineer',
  'Full-Stack Developer',
  'Competitive Programmer'
];
const typeEl = document.getElementById('typeText');
let pi = 0, ci = 0, del = false;

function type() {
  const ph = phrases[pi];
  typeEl.textContent = del
    ? ph.substring(0, ci - 1)
    : ph.substring(0, ci + 1);
  del ? ci-- : ci++;

  let wait = del ? 55 : 95;
  if (!del && ci === ph.length) { wait = 1800; del = true; }
  else if (del && ci === 0) { del = false; pi = (pi + 1) % phrases.length; wait = 350; }
  setTimeout(type, wait);
}
type();

// ===== CODE EDITOR TYPING EFFECT =====
const codePhrases = [
  "return await collection.find(query).limit(10)",
  "return get_recommendations(embedding)",
  "data.sort_values(by='rating', ascending=False)"
];
const codeTypeEl = document.getElementById('codeTypewriter');
if (codeTypeEl) {
  let cpi = 0;
  function typeCode() {
    gsap.to(codeTypeEl, {
      duration: 2,
      text: codePhrases[cpi],
      ease: "none",
      onComplete: () => {
        setTimeout(() => {
          gsap.to(codeTypeEl, {
            duration: 1,
            text: "",
            ease: "none",
            onComplete: () => {
              cpi = (cpi + 1) % codePhrases.length;
              setTimeout(typeCode, 500);
            }
          });
        }, 3000);
      }
    });
  }
  setTimeout(typeCode, 1000);
}

// ===== SKILL BARS (WORKING - animate on tab click & page load) =====
function animateActiveBars() {
  const panel = document.querySelector('.stab-panel.active');
  if (!panel) return;
  panel.querySelectorAll('.si-fill').forEach(bar => {
    bar.style.width = '0'; // reset
    requestAnimationFrame(() => {
      setTimeout(() => {
        bar.style.width = bar.dataset.w + '%';
      }, 50);
    });
  });
}

// Skills tabs (WORKING)
const stabs = document.querySelectorAll('.stab');
const stabPanels = document.querySelectorAll('.stab-panel');

stabs.forEach(btn => {
  btn.addEventListener('click', () => {
    stabs.forEach(b => b.classList.remove('active'));
    stabPanels.forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    const panel = document.getElementById('stab-' + btn.dataset.tab);
    if (panel) {
      panel.classList.add('active');
      setTimeout(animateActiveBars, 80);
    }
  });
});

// ===== PROJECT FILTER (GSAP fade+scale) =====
const pfils = document.querySelectorAll('.pfil');
const projCards = document.querySelectorAll('.proj-card');

pfils.forEach(btn => {
  btn.addEventListener('click', () => {
    pfils.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.f;

    projCards.forEach(card => {
      const cats = card.dataset.cat || '';
      const isVisible = (f === 'all' || cats.includes(f));
      
      if (isVisible) {
        if (card.classList.contains('hidden')) {
          card.classList.remove('hidden');
          gsap.fromTo(card, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" });
        }
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== OLDER PROJECTS ACCORDION =====
const olderProjectsBtn = document.getElementById('olderProjectsBtn');
const olderProjectsContainer = document.getElementById('olderProjectsContainer');
if (olderProjectsBtn && olderProjectsContainer) {
  olderProjectsBtn.addEventListener('click', () => {
    const isHidden = olderProjectsContainer.style.display === 'none';
    if (isHidden) {
      olderProjectsContainer.style.display = 'block';
      olderProjectsBtn.innerHTML = 'Hide Older Projects ▲';
      gsap.fromTo(olderProjectsContainer, { opacity: 0, height: 0 }, { opacity: 1, height: 'auto', duration: 0.5, ease: "power2.out" });
    } else {
      gsap.to(olderProjectsContainer, { opacity: 0, height: 0, duration: 0.4, ease: "power2.in", onComplete: () => {
        olderProjectsContainer.style.display = 'none';
        olderProjectsBtn.innerHTML = 'View Older Projects ▼';
      }});
    }
  });
}

// ===== GSAP COUNTER ANIMATION (Hero Stats) =====
function animateCounters() {
  const statNums = document.querySelectorAll('.stat-num');
  statNums.forEach(num => {
    const val = parseFloat(num.innerText);
    if (!isNaN(val)) {
      const suffix = num.innerText.replace(/[0-9.]/g, '');
      const isFloat = num.innerText.includes('.');
      
      gsap.fromTo(num, 
        { innerText: 0 },
        {
          innerText: val,
          duration: 2,
          ease: "power2.out",
          snap: { innerText: isFloat ? 0.01 : 1 },
          onUpdate: function() {
            num.innerText = (isFloat ? Number(this.targets()[0].innerText).toFixed(2) : Math.round(this.targets()[0].innerText)) + suffix;
          }
        }
      );
    }
  });
}
setTimeout(animateCounters, 500);

// ===== CERT FILTER (WORKING) =====
const cfils = document.querySelectorAll('.cfil');
const certCards = document.querySelectorAll('.cert-card');

cfils.forEach(btn => {
  btn.addEventListener('click', () => {
    cfils.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.cf;

    certCards.forEach(card => {
      const cc = card.dataset.cc || '';
      if (f === 'all' || cc === f) {
        card.classList.remove('hidden');
      } else {
        card.classList.add('hidden');
      }
    });
  });
});

// ===== CONTACT FORM =====
const contactForm = document.getElementById('contactForm');
contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const name  = document.getElementById('fName').value;
  const email = document.getElementById('fEmail').value;
  const subj  = document.getElementById('fSubj').value || 'Portfolio Contact';
  const msg   = document.getElementById('fMsg').value;
  const body  = `Hi Ankit,\n\nName: ${name}\nEmail: ${email}\n\nMessage:\n${msg}`;
  window.location.href = `mailto:ankitrmishra01@gmail.com?subject=${encodeURIComponent(subj)}&body=${encodeURIComponent(body)}`;
  toast('📬 Opening mail client...');
});

// ===== TOAST =====
function toast(msg, dur = 3000) {
  const el = document.getElementById('toast');
  el.textContent = msg;
  el.classList.add('show');
  setTimeout(() => el.classList.remove('show'), dur);
}

// ===== PARTICLES on HOME =====
const particlesEl = document.getElementById('particles');
if (particlesEl) {
  for (let i = 0; i < 35; i++) {
    const p = document.createElement('div');
    const sz = Math.random() * 2 + 1;
    Object.assign(p.style, {
      position: 'absolute',
      width: sz + 'px', height: sz + 'px',
      background: ['#00ffa3','#00b4ff','#a855f7'][Math.floor(Math.random()*3)],
      borderRadius: '50%',
      left: Math.random() * 100 + '%',
      top: Math.random() * 100 + '%',
      opacity: (Math.random() * 0.25 + 0.05).toString(),
      animation: `pFloat ${Math.random() * 5 + 4}s ease-in-out ${Math.random() * 4}s infinite alternate`,
      pointerEvents: 'none',
    });
    particlesEl.appendChild(p);
  }
  // inject particle keyframes
  const s = document.createElement('style');
  s.textContent = `@keyframes pFloat {0%{transform:translateY(0) scale(1);opacity:0.08}100%{transform:translateY(-28px) scale(1.6);opacity:0.35}}`;
  document.head.appendChild(s);
}

// ===== INIT =====
// Start on home, animate bars when skills first visited
showPage('home');
