/* ============================================
   PORTFOLIO - SCRIPT.JS
   Three.js 3D Scene, Animations, Contact Form
   ============================================ */

// ---- THREE.JS 3D HERO BACKGROUND ----
(function initThreeScene() {
  const canvas = document.getElementById('hero-canvas');
  if (!canvas || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 30;

  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // Lights
  const ambientLight = new THREE.AmbientLight(0x7c3aed, 0.4);
  scene.add(ambientLight);

  const pointLight1 = new THREE.PointLight(0x06b6d4, 1.5, 100);
  pointLight1.position.set(20, 20, 20);
  scene.add(pointLight1);

  const pointLight2 = new THREE.PointLight(0x7c3aed, 1.2, 100);
  pointLight2.position.set(-20, -10, 10);
  scene.add(pointLight2);

  // Materials
  const wireMat = new THREE.MeshPhongMaterial({
    color: 0x7c3aed, wireframe: true, transparent: true, opacity: 0.35
  });
  const glassMat = new THREE.MeshPhongMaterial({
    color: 0x06b6d4, transparent: true, opacity: 0.15, shininess: 100
  });
  const glowMat = new THREE.MeshPhongMaterial({
    color: 0x2563eb, transparent: true, opacity: 0.25, emissive: 0x2563eb, emissiveIntensity: 0.3
  });

  // Create floating shapes
  const shapes = [];
  const geometries = [
    new THREE.IcosahedronGeometry(2.5, 0),
    new THREE.TorusGeometry(2, 0.6, 8, 16),
    new THREE.OctahedronGeometry(2, 0),
    new THREE.TorusKnotGeometry(1.5, 0.4, 50, 8),
    new THREE.DodecahedronGeometry(1.8, 0),
    new THREE.TetrahedronGeometry(2, 0),
    new THREE.IcosahedronGeometry(1.5, 1),
    new THREE.TorusGeometry(1.5, 0.5, 6, 12),
  ];
  const materials = [wireMat, glassMat, glowMat];

  for (let i = 0; i < 12; i++) {
    const geo = geometries[i % geometries.length];
    const mat = materials[i % materials.length];
    const mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(
      (Math.random() - 0.5) * 50,
      (Math.random() - 0.5) * 40,
      (Math.random() - 0.5) * 30
    );
    mesh.rotation.set(Math.random() * Math.PI, Math.random() * Math.PI, 0);
    mesh.userData = {
      rotSpeed: { x: (Math.random() - 0.5) * 0.01, y: (Math.random() - 0.5) * 0.01 },
      floatSpeed: 0.3 + Math.random() * 0.5,
      floatOffset: Math.random() * Math.PI * 2,
      baseY: mesh.position.y
    };
    shapes.push(mesh);
    scene.add(mesh);
  }

  // Particles
  const particleGeo = new THREE.BufferGeometry();
  const count = 200;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    positions[i] = (Math.random() - 0.5) * 80;
  }
  particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  const particleMat = new THREE.PointsMaterial({
    color: 0x7c3aed, size: 0.08, transparent: true, opacity: 0.6
  });
  const particles = new THREE.Points(particleGeo, particleMat);
  scene.add(particles);

  // Mouse tracking
  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  // Animation loop
  function animate() {
    requestAnimationFrame(animate);
    const time = Date.now() * 0.001;

    shapes.forEach((mesh) => {
      const d = mesh.userData;
      mesh.rotation.x += d.rotSpeed.x;
      mesh.rotation.y += d.rotSpeed.y;
      mesh.position.y = d.baseY + Math.sin(time * d.floatSpeed + d.floatOffset) * 2;
    });

    particles.rotation.y += 0.0003;
    particles.rotation.x += 0.0001;

    camera.position.x += (mouseX * 3 - camera.position.x) * 0.02;
    camera.position.y += (-mouseY * 2 - camera.position.y) * 0.02;
    camera.lookAt(scene.position);

    renderer.render(scene, camera);
  }
  animate();

  // Resize
  window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();


// ---- TYPING ANIMATION ----
(function initTyping() {
  const el = document.getElementById('typing-text');
  if (!el) return;
  const texts = ['Frontend Developer', 'Game Programmer', 'Web Enthusiast', 'Problem Solver'];
  let textIdx = 0, charIdx = 0, deleting = false;

  function type() {
    const current = texts[textIdx];
    el.textContent = current.substring(0, charIdx);

    if (!deleting) {
      charIdx++;
      if (charIdx > current.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
    } else {
      charIdx--;
      if (charIdx < 0) {
        deleting = false;
        charIdx = 0;
        textIdx = (textIdx + 1) % texts.length;
      }
    }
    setTimeout(type, deleting ? 40 : 80);
  }
  setTimeout(type, 1000);
})();


// ---- NAVBAR SCROLL ----
(function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const navLinks = document.getElementById('navLinks');

  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
  });

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('active');
  });

  navLinks.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('active');
    });
  });
})();


// ---- SCROLL REVEAL ANIMATIONS ----
(function initScrollReveal() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
})();


// ---- SKILL BAR ANIMATION ----
(function initSkillBars() {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
          bar.style.width = bar.dataset.width + '%';
        });
      }
    });
  }, { threshold: 0.3 });

  document.querySelectorAll('.skill-category').forEach(el => observer.observe(el));
})();


// ---- CONTACT FORM (FormSubmit.co — sends directly to Gmail, no setup needed) ----
(function initContactForm() {
  const form = document.getElementById('contactForm');
  const statusEl = document.getElementById('formStatus');
  const submitBtn = document.getElementById('submitBtn');

  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Collect form data
    const name = form.user_name.value.trim();
    const email = form.user_email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    // Validate
    if (!name || !email || !subject || !message) {
      showStatus('Please fill in all fields.', 'error');
      return;
    }

    // Button loading state
    submitBtn.disabled = true;
    submitBtn.textContent = '⏳ Sending...';

    try {
      // Send via FormSubmit.co AJAX — messages go directly to sumitkajla484@gmail.com
      const response = await fetch('https://formsubmit.co/ajax/sumitkajla484@gmail.com', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: name,
          email: email,
          _subject: subject,
          message: message,
          _template: 'table'
        })
      });

      const result = await response.json();

      if (result.success) {
        showStatus('✅ Message sent successfully! I\'ll get back to you soon.', 'success');
        form.reset();
      } else {
        showStatus('❌ Failed to send. Please try again or email me directly.', 'error');
      }
    } catch (error) {
      console.error('Form submit error:', error);
      showStatus('❌ Network error. Please try again or email me at sumitkajla484@gmail.com', 'error');
    }

    submitBtn.disabled = false;
    submitBtn.textContent = '🚀 Send Message';
  });

  function showStatus(msg, type) {
    statusEl.textContent = msg;
    statusEl.className = 'form-status ' + type;
    setTimeout(() => {
      statusEl.className = 'form-status';
    }, 6000);
  }
})();
