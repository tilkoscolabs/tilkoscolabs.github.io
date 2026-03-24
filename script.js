/* ═══════════════════════════════════════════
   ShadowRecon Portfolio - JavaScript
   Matrix Rain, Animations & Interactions
   ═══════════════════════════════════════════ */

// ── Matrix Rain Effect ──
const canvas = document.getElementById('matrix-rain');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

const chars = 'アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン0123456789ABCDEF<>/{}[]()=+-*&^%$#@!';
const charArray = chars.split('');
const fontSize = 14;
let columns = Math.floor(canvas.width / fontSize);
const drops = Array(columns).fill(1);

function drawMatrix() {
    ctx.fillStyle = 'rgba(10, 14, 23, 0.05)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#00ff88';
    ctx.font = `${fontSize}px monospace`;

    for (let i = 0; i < drops.length; i++) {
        const text = charArray[Math.floor(Math.random() * charArray.length)];
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }
        drops[i]++;
    }
}

setInterval(drawMatrix, 50);

window.addEventListener('resize', () => {
    resizeCanvas();
    const newColumns = Math.floor(canvas.width / fontSize);
    while (drops.length < newColumns) drops.push(1);
    drops.length = newColumns;
});

// ── Typing Effect ──
const roles = [
    'Cybersecurity Researcher',
    'OSINT Analyst',
    'Penetration Tester',
    'Intelligence Analyst',
    'Digital Forensics Specialist',
    'Threat Hunter',
];

let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingElement = document.getElementById('typing-text');

function typeRole() {
    const currentRole = roles[roleIndex];

    if (isDeleting) {
        typingElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    let speed = isDeleting ? 30 : 80;

    if (!isDeleting && charIndex === currentRole.length) {
        speed = 2000;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        speed = 500;
    }

    setTimeout(typeRole, speed);
}

typeRole();

// ── Navbar Scroll ──
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.scrollY;
    if (currentScroll > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    lastScroll = currentScroll;
});

// ── Active Nav Link ──
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-link');

function updateActiveLink() {
    const scrollY = window.scrollY + 200;
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');

        if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
            navLinks.forEach(link => link.classList.remove('active'));
            const activeLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
            if (activeLink) activeLink.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveLink);

// ── Mobile Nav Toggle ──
const navToggle = document.getElementById('nav-toggle');
const navLinksContainer = document.querySelector('.nav-links');

navToggle.addEventListener('click', () => {
    navLinksContainer.classList.toggle('open');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinksContainer.classList.remove('open');
    });
});

// ── Counter Animation ──
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const startTime = performance.now();

        function step(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            counter.textContent = Math.floor(eased * target);
            if (progress < 1) {
                requestAnimationFrame(step);
            } else {
                counter.textContent = target + '+';
            }
        }

        requestAnimationFrame(step);
    });
}

// ── Skill Bars Animation ──
function animateSkillBars() {
    const fills = document.querySelectorAll('.skill-fill');
    fills.forEach(fill => {
        const width = fill.getAttribute('data-width');
        fill.style.width = width + '%';
    });
}

// ── Intersection Observer for Animations ──
const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px',
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Trigger counters when hero stats are visible
            if (entry.target.closest('.hero-stats') || entry.target.querySelector('.stat-number')) {
                animateCounters();
            }

            // Trigger skill bars
            if (entry.target.closest('#skills') || entry.target.querySelector('.skill-fill')) {
                animateSkillBars();
            }
        }
    });
}, observerOptions);

// Observe elements
document.querySelectorAll('.section, .hero-stats, .project-card, .cert-card, .info-card, .skill-category').forEach(el => {
    el.classList.add('fade-in');
    observer.observe(el);
});

// Counter specific observer
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounters();
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) statsObserver.observe(heroStats);

// Skills specific observer
const skillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateSkillBars();
            skillsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

const skillsSection = document.getElementById('skills');
if (skillsSection) skillsObserver.observe(skillsSection);

// ── Smooth Scroll for nav links ──
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});

// ── Console Easter Egg ──
console.log('%c🕵️ ShadowRecon Portfolio', 'font-size: 24px; font-weight: bold; color: #00ff88;');
console.log('%cBuilt by TilkoscoLabs | github.com/tilkoscolabs', 'color: #00d4ff;');
console.log('%c⚠️  Curious enough to open DevTools? Good. That\'s the hacker mindset.', 'color: #ffbd2e;');
