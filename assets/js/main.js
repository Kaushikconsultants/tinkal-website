// ============================================================
// TINKAL — Main JavaScript (Shared across all pages)
// ============================================================

// ── NAVBAR SCROLL EFFECT ──────────────────────────────────
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  if (!navbar) return;
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
})();

// ── MOBILE MENU ───────────────────────────────────────────
(function initMobileMenu() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileClose = document.getElementById('mobileClose');
  if (!hamburger || !mobileMenu) return;
  hamburger.addEventListener('click', () => mobileMenu.classList.add('open'));
  if (mobileClose) mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobileMenu.classList.remove('open')));
})();

// ── ACTIVE NAV LINK ───────────────────────────────────────
(function setActiveNav() {
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-menu a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && href.includes(path)) a.classList.add('active');
  });
})();

// ── CUSTOM AOS (Animate on Scroll) ───────────────────────
(function initAOS() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const delay = entry.target.getAttribute('data-aos-delay') || 0;
        setTimeout(() => entry.target.classList.add('aos-animate'), parseInt(delay));
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });
  document.querySelectorAll('[data-aos]').forEach(el => observer.observe(el));
})();

// ── STATS COUNTER ─────────────────────────────────────────
(function initCounters() {
  const counters = document.querySelectorAll('.counter');
  if (!counters.length) return;
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = parseInt(el.getAttribute('data-target'));
      const suffix = el.getAttribute('data-suffix') || '';
      const prefix = el.getAttribute('data-prefix') || '';
      let start = 0;
      const duration = 1800;
      const step = target / (duration / 16);
      const timer = setInterval(() => {
        start += step;
        if (start >= target) { start = target; clearInterval(timer); }
        el.textContent = prefix + Math.floor(start).toLocaleString() + suffix;
      }, 16);
      observer.unobserve(el);
    });
  }, { threshold: 0.3 });
  counters.forEach(c => observer.observe(c));
})();

// ── HORIZONTAL SCROLL DRAG ────────────────────────────────
(function initDragScroll() {
  const tracks = document.querySelectorAll('.services-scroll-track');
  tracks.forEach(track => {
    let isDown = false, startX, scrollLeft;
    track.addEventListener('mousedown', e => { isDown = true; startX = e.pageX - track.offsetLeft; scrollLeft = track.scrollLeft; });
    track.addEventListener('mouseleave', () => isDown = false);
    track.addEventListener('mouseup', () => isDown = false);
    track.addEventListener('mousemove', e => { if (!isDown) return; e.preventDefault(); const x = e.pageX - track.offsetLeft; track.scrollLeft = scrollLeft - (x - startX) * 1.5; });
  });
})();

// ── FAQ ACCORDION ─────────────────────────────────────────
(function initFAQ() {
  document.querySelectorAll('.faq-q').forEach(q => {
    q.addEventListener('click', () => {
      const item = q.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
})();

// ── PROJECT MODAL ─────────────────────────────────────────
function openProjectModal(project) {
  const overlay = document.getElementById('projectModal');
  if (!overlay) return;
  document.getElementById('modalTitle').textContent = project.title || '';
  document.getElementById('modalDesc').textContent = project.description || '';
  const imgWrap = document.getElementById('modalImgWrap');
  if (project.heroImage) {
    imgWrap.innerHTML = `<img src="${project.heroImage}" alt="${project.title}" style="width:100%;height:280px;object-fit:cover;">`;
  } else {
    imgWrap.innerHTML = `<div style="height:200px;background:linear-gradient(135deg,#0D2461,#0066FF);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.3);font-size:48px;"><i class="fas fa-cube"></i></div>`;
  }
  document.getElementById('modalProblem').textContent = project.problem || '—';
  document.getElementById('modalSolution').textContent = project.solution || '—';
  document.getElementById('modalResult').textContent = project.result || '—';
  const tagsEl = document.getElementById('modalTags');
  tagsEl.innerHTML = (project.tags || '').split(',').filter(Boolean).map(t => `<span class="pfc-tag">${t.trim()}</span>`).join('');
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeProjectModal() {
  const overlay = document.getElementById('projectModal');
  if (overlay) { overlay.classList.remove('open'); document.body.style.overflow = ''; }
}

// ── ENQUIRY MODAL ─────────────────────────────────────────
function openEnquiryModal(serviceName) {
  const overlay = document.getElementById('enquiryModal');
  if (!overlay) return;
  const input = document.getElementById('enquiryService');
  if (input && serviceName) input.value = serviceName;
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeEnquiryModal() {
  const overlay = document.getElementById('enquiryModal');
  if (overlay) { overlay.classList.remove('open'); document.body.style.overflow = ''; }
}

// Close modals on overlay click
document.addEventListener('click', e => {
  if (e.target.classList.contains('modal-overlay')) {
    closeProjectModal();
    closeEnquiryModal();
  }
});
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') { closeProjectModal(); closeEnquiryModal(); }
});

// ── EMAILJS CONTACT FORM ──────────────────────────────────
// IMPORTANT: Replace these with your EmailJS values
const EMAILJS_SERVICE_ID  = 'service_6xolpku';
const EMAILJS_TEMPLATE_ID = 'template_tfpsc24';
const EMAILJS_PUBLIC_KEY  = 'NFEJnBMXuiYd07FUI';

function initContactForm(formId) {
  const form = document.getElementById(formId);
  if (!form) return;
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = form.querySelector('[type="submit"]');
    const msgEl = form.querySelector('.form-success');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
    try {
      await emailjs.sendForm(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, form, EMAILJS_PUBLIC_KEY);
      if (msgEl) { msgEl.classList.add('show'); msgEl.textContent = '✅ Message sent! We\'ll contact you within 24 hours.'; }
      form.reset();
      btn.innerHTML = '✅ Sent Successfully!';
      setTimeout(() => { btn.disabled = false; btn.innerHTML = originalText; if(msgEl) msgEl.classList.remove('show'); }, 5000);
    } catch (err) {
      btn.disabled = false;
      btn.innerHTML = originalText;
      if (msgEl) { msgEl.classList.add('show'); msgEl.style.background = '#FFF5F5'; msgEl.style.borderColor = '#FEB2B2'; msgEl.style.color = '#C53030'; msgEl.textContent = '❌ Failed to send. Please WhatsApp us directly.'; }
    }
  });
}

// ── CTA BANNER FORM ───────────────────────────────────────
(function initCtaBannerForm() {
  const form = document.getElementById('ctaBannerForm');
  if (!form) return;
  form.addEventListener('submit', async function(e) {
    e.preventDefault();
    const btn = form.querySelector('button');
    btn.disabled = true;
    btn.textContent = 'Sending...';
    try {
      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
        from_name: document.getElementById('ctaName')?.value || '',
        from_email: document.getElementById('ctaEmail')?.value || '',
        phone: document.getElementById('ctaPhone')?.value || '',
        message: 'Quick CTA Banner Lead',
        service: 'General Enquiry'
      }, EMAILJS_PUBLIC_KEY);
      btn.textContent = '✅ Sent!';
      form.reset();
      setTimeout(() => { btn.disabled = false; btn.textContent = 'Get Free Audit →'; }, 4000);
    } catch {
      btn.disabled = false;
      btn.textContent = 'Try Again';
    }
  });
})();

// ── SERVICE FILTER ────────────────────────────────────────
function initServiceFilter() {
  document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', function () {
      document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      this.classList.add('active');
      const cat = this.getAttribute('data-filter');
      document.querySelectorAll('.service-card, .project-full-card').forEach(card => {
        if (cat === 'all' || card.getAttribute('data-category') === cat) {
          card.style.display = '';
          card.style.animation = 'fadeIn 0.4s ease';
        } else {
          card.style.display = 'none';
        }
      });
    });
  });
}

// ── LOAD REVIEWS ON HOME PAGE ─────────────────────────────
async function loadHomeReviews() {
  const grid = document.getElementById('homeReviewsGrid');
  if (!grid) return;
  
  // FIX: Using your existing getAllReviews() function, then filtering to only show published ones
  let allReviews = [];
  try {
    allReviews = await getAllReviews();
  } catch (e) {
    console.error("Error loading reviews:", e);
  }

  const reviews = allReviews.filter(r => r.published !== false).slice(0, 6);

  if (!reviews.length) {
    grid.innerHTML = `<div class="no-reviews-placeholder" style="width:100%;text-align:center;padding:40px;"><p style="color:var(--text2);">Client testimonials coming soon!</p></div>`;
    return;
  }
  
  // Wrap in swiper-slide
  grid.innerHTML = reviews.map(r => r.type === 'video' ? renderVideoReview(r) : renderTextReview(r)).join('');
  
  // Initialize Swiper
  new Swiper('.reviewsSwiper', {
    slidesPerView: 1, spaceBetween: 24, loop: true,
    autoplay: { delay: 4000, disableOnInteraction: false },
    navigation: { nextEl: '.r-next', prevEl: '.r-prev' },
    breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
  });
}

function renderTextReview(r) {
  const stars = '★'.repeat(r.stars || 5) + '☆'.repeat(5 - (r.stars || 5));
  const initial = (r.clientName || 'C').charAt(0).toUpperCase();
  return `<div class="swiper-slide"><div class="review-card" style="height:100%;display:flex;flex-direction:column;justify-content:space-between;">
    <div><div class="review-stars">${stars}</div><p class="review-text">"${r.text}"</p></div>
    <div class="review-author"><div class="review-avatar">${initial}</div><div><div class="review-name">${r.clientName || ''}</div><div class="review-biz">${r.businessName || ''}</div></div></div>
  </div></div>`;
}

// Upgraded Helper to get YouTube ID (Supports Shorts & Mobile links)
function extractYouTubeId(url) {
  if (!url) return null;
  const match = url.match(/(?:v=|\/embed\/|\.be\/|\/shorts\/|\/v\/|\/e\/|watch\?v=|&v=|^youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  return match ? match[1] : null;
}

function renderVideoReview(r) {
  const embedId = extractYouTubeId(r.videoUrl);
  return `<div class="swiper-slide"><div class="review-video-card" style="height:100%;">
    <div class="review-video-thumb"><iframe src="https://www.youtube.com/embed/${embedId}" allowfullscreen loading="lazy"></iframe></div>
    <div class="review-video-info"><div class="review-name">${r.clientName || ''}</div><div class="review-biz">${r.businessName || ''}</div></div>
  </div></div>`;
}

// ── LOAD PROJECTS (HOME PREVIEW) ──────────────────────────
async function loadHomeProjects() {
  const grid = document.getElementById('homeProjectsGrid');
  if (!grid) return;
  const projects = await getProjects(6); // Fetch 6 for the slider
  if (!projects.length) {
    grid.innerHTML = `<div class="no-projects-placeholder" style="width:100%;"><p>Projects coming soon!</p></div>`;
    return;
  }
  grid.innerHTML = projects.map(p => renderProjectCard(p)).join('');
  
  // Initialize Swiper
  new Swiper('.projectsSwiper', {
    slidesPerView: 1, spaceBetween: 24, loop: true,
    autoplay: { delay: 3500, disableOnInteraction: false },
    navigation: { nextEl: '.p-next', prevEl: '.p-prev' },
    breakpoints: { 768: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }
  });
}

function renderProjectCard(p) {
  const imgHtml = p.heroImage ? `<img src="${p.heroImage}" alt="${p.title}" style="width:100%;height:200px;object-fit:cover;">` : `<div style="height:200px;background:linear-gradient(135deg,#0D2461,#0066FF);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.3);font-size:48px;"><i class="fas fa-cube"></i></div>`;
  const tags = (p.tags || '').split(',').filter(Boolean).map(t => `<span class="project-tag">${t.trim()}</span>`).join('');
  return `<div class="swiper-slide" style="height:auto;"><div class="project-card" onclick='openProjectModal(${JSON.stringify(p).replace(/'/g,"&#39;")})' style="height:100%;display:flex;flex-direction:column;">
    <div class="project-thumb">${imgHtml}</div>
    <div class="project-info" style="flex:1;">
      <div class="project-tags">${tags}</div><div class="project-title">${p.title}</div><div class="project-desc">${(p.description || '').substring(0,100)}...</div>
    </div>
  </div></div>`;
}

// ── LOAD PROJECTS (PROJECTS PAGE) ─────────────────────────
async function loadAllProjects(filterCat) {
  const grid = document.getElementById('projectsFullGrid');
  if (!grid) return;
  grid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;"><i class="fas fa-circle-notch fa-spin" style="color:var(--blue);font-size:32px;"></i></div>`;
  const projects = await getProjects(null, filterCat);
  if (!projects.length) {
    grid.innerHTML = `<div class="no-projects-placeholder" style="grid-column:1/-1;"><i class="fas fa-folder-open" style="font-size:48px;color:var(--border);display:block;margin-bottom:12px;"></i><p style="color:var(--text2);">No projects yet. Check back soon!</p></div>`;
    return;
  }
  grid.innerHTML = projects.map(p => renderFullProjectCard(p)).join('');
  setTimeout(() => {
    grid.querySelectorAll('[data-aos]').forEach(el => el.classList.add('aos-animate'));
  }, 100);
}

function renderFullProjectCard(p) {
  const imgHtml = p.heroImage
    ? `<img src="${p.heroImage}" alt="${p.title}">`
    : `<div style="height:220px;background:linear-gradient(135deg,#0D2461,#0066FF);display:flex;align-items:center;justify-content:center;color:rgba(255,255,255,0.3);font-size:48px;"><i class="fas fa-cube"></i></div>`;
  const tags = (p.tags || '').split(',').filter(Boolean).map(t => `<span class="pfc-tag">${t.trim()}</span>`).join('');
  return `<div class="project-full-card" data-category="${p.category||'all'}" data-aos="fade-up" onclick='openProjectModal(${JSON.stringify(p).replace(/'/g,"&#39;")})'>
    <div class="pfc-img">${imgHtml}</div>
    <div class="pfc-body">
      <div class="pfc-tags">${tags}</div>
      <div class="pfc-title">${p.title}</div>
      <div class="pfc-desc">${(p.description||'').substring(0,120)}${(p.description||'').length>120?'...':''}</div>
      <div class="pfc-link">View Details <i class="fas fa-arrow-right"></i></div>
    </div>
  </div>`;
}

// ── THREE.JS HERO ANIMATION ───────────────────────────────
function initHeroThreeJS() {
  const container = document.getElementById('hero-3d-container');
  if (!container || !window.THREE) return;

  const w = container.offsetWidth, h = container.offsetHeight;
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 1000);
  camera.position.set(0, 0, 8);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(w, h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // Floating nodes
  const nodeGeom = new THREE.SphereGeometry(0.12, 16, 16);
  const nodeMat = new THREE.MeshPhongMaterial({ color: 0x0066FF, emissive: 0x003388, shininess: 80 });
  const nodes = [];
  const nodePositions = [];

  for (let i = 0; i < 24; i++) {
    const mesh = new THREE.Mesh(nodeGeom, nodeMat.clone());
    const x = (Math.random() - 0.5) * 10;
    const y = (Math.random() - 0.5) * 8;
    const z = (Math.random() - 0.5) * 6;
    mesh.position.set(x, y, z);
    mesh.userData = { ox: x, oy: y, oz: z, speed: Math.random() * 0.5 + 0.2, phase: Math.random() * Math.PI * 2 };
    scene.add(mesh);
    nodes.push(mesh);
    nodePositions.push(new THREE.Vector3(x, y, z));
  }

  // Lines connecting nearby nodes
  const lineMat = new THREE.LineBasicMaterial({ color: 0x0D2461, transparent: true, opacity: 0.25 });
  nodePositions.forEach((a, i) => {
    nodePositions.forEach((b, j) => {
      if (i >= j) return;
      if (a.distanceTo(b) < 3.5) {
        const geo = new THREE.BufferGeometry().setFromPoints([a, b]);
        scene.add(new THREE.Line(geo, lineMat));
      }
    });
  });

  // Central hub — styled like logo
  const hubGeom = new THREE.BoxGeometry(0.6, 0.6, 0.6, 1, 1, 1);
  const hubMat = new THREE.MeshPhongMaterial({ color: 0x0D2461, emissive: 0x001040, wireframe: false, shininess: 120 });
  const hub = new THREE.Mesh(hubGeom, hubMat);
  hub.position.set(0, 0, 0);
  scene.add(hub);

  // Rings
  const ring1 = new THREE.Mesh(
    new THREE.TorusGeometry(2, 0.025, 16, 100),
    new THREE.MeshBasicMaterial({ color: 0x0066FF, transparent: true, opacity: 0.3 })
  );
  const ring2 = new THREE.Mesh(
    new THREE.TorusGeometry(3.2, 0.015, 16, 100),
    new THREE.MeshBasicMaterial({ color: 0x00C8FF, transparent: true, opacity: 0.2 })
  );
  ring1.rotation.x = Math.PI / 4;
  ring2.rotation.x = -Math.PI / 3;
  ring2.rotation.y = Math.PI / 5;
  scene.add(ring1); scene.add(ring2);

  // Lighting
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dLight = new THREE.DirectionalLight(0x0066FF, 1.2);
  dLight.position.set(5, 5, 5);
  scene.add(dLight);
  const pLight = new THREE.PointLight(0x00C8FF, 1.5, 15);
  pLight.position.set(-3, 2, 3);
  scene.add(pLight);

  // Mouse parallax
  let mx = 0, my = 0;
  document.addEventListener('mousemove', e => {
    mx = (e.clientX / window.innerWidth - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  let t = 0;
  function animate() {
    requestAnimationFrame(animate);
    t += 0.008;
    hub.rotation.x += 0.007;
    hub.rotation.y += 0.010;
    ring1.rotation.z += 0.004;
    ring2.rotation.z -= 0.003;
    ring2.rotation.x += 0.002;
    nodes.forEach(n => {
      const d = n.userData;
      n.position.y = d.oy + Math.sin(t * d.speed + d.phase) * 0.4;
      n.position.x = d.ox + Math.cos(t * d.speed * 0.7 + d.phase) * 0.2;
    });
    camera.position.x += (mx * 0.8 - camera.position.x) * 0.04;
    camera.position.y += (-my * 0.5 - camera.position.y) * 0.04;
    camera.lookAt(0, 0, 0);
    renderer.render(scene, camera);
  }
  animate();

  // Resize
  window.addEventListener('resize', () => {
    const nw = container.offsetWidth, nh = container.offsetHeight;
    camera.aspect = nw / nh; camera.updateProjectionMatrix();
    renderer.setSize(nw, nh);
  });
}

// ── SMOOTH SCROLL FOR ANCHORS ─────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});
