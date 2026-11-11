/* ============================================
   SCRIPT — Portfolio Muhamad Ikhsan Salsabil
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    // ---- Preloader ----
    const preloader = document.getElementById('preloader');
    window.addEventListener('load', () => {
        setTimeout(() => {
            preloader.classList.add('hidden');
        }, 1200);
    });
    // Fallback: hide preloader after 3s max
    setTimeout(() => preloader.classList.add('hidden'), 3000);

    // ---- Particles Background ----
    const canvas = document.getElementById('particles');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    class Particle {
        constructor() {
            this.reset();
        }
        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.4 + 0.1;
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            if (mouse.x !== null) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    this.x -= dx * 0.01;
                    this.y -= dy * 0.01;
                }
            }

            if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
            if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            const theme = document.documentElement.getAttribute('data-theme');
            const color = theme === 'light' ? `rgba(124, 58, 237, ${this.opacity})` : `rgba(124, 58, 237, ${this.opacity})`;
            ctx.fillStyle = color;
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const count = Math.min(Math.floor((canvas.width * canvas.height) / 12000), 80);
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }
    initParticles();
    window.addEventListener('resize', initParticles);

    function connectParticles() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 150) {
                    const opacity = (1 - dist / 150) * 0.15;
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(124, 58, 237, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        connectParticles();
        requestAnimationFrame(animateParticles);
    }
    animateParticles();

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseleave', () => {
        mouse.x = null;
        mouse.y = null;
    });

    // ---- Navbar Scroll ----
    const navbar = document.getElementById('navbar');
    const scrollTopBtn = document.getElementById('scrollTop');
    const sections = document.querySelectorAll('.section, .hero');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;

        // Navbar background
        if (scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Scroll-to-top button
        if (scrollY > 400) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }

        // Active nav link
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            if (scrollY >= sectionTop) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    // ---- Mobile Menu ----
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('navMenu');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Close menu on outside click
    document.addEventListener('click', (e) => {
        if (!navMenu.contains(e.target) && !hamburger.contains(e.target)) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
        }
    });

    // ---- Theme Toggle ----
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
    });

    // ---- Typing Effect ----
    const typingTexts = [
        'Electrical Engineer',
        'IoT Developer',
        'Embedded Systems Engineer',
        'Hardware Designer',
        'Smart System Architect'
    ];
    let textIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingElement = document.getElementById('typingText');

    function typeEffect() {
        const currentText = typingTexts[textIndex];
        if (isDeleting) {
            typingElement.textContent = currentText.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentText.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentText.length) {
            speed = 2000;
            isDeleting = true;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            textIndex = (textIndex + 1) % typingTexts.length;
            speed = 400;
        }

        setTimeout(typeEffect, speed);
    }
    setTimeout(typeEffect, 1500);

    // ---- Scroll Reveal ----
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // ---- Animated Counters ----
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersAnimated = false;

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !countersAnimated) {
                countersAnimated = true;
                statNumbers.forEach(num => {
                    const target = parseInt(num.getAttribute('data-target'));
                    const duration = 2000;
                    const step = target / (duration / 16);
                    let current = 0;

                    const updateCounter = () => {
                        current += step;
                        if (current < target) {
                            num.textContent = Math.floor(current);
                            requestAnimationFrame(updateCounter);
                        } else {
                            num.textContent = target;
                        }
                    };
                    updateCounter();
                });
            }
        });
    }, { threshold: 0.5 });

    statNumbers.forEach(num => counterObserver.observe(num));

    // ---- Skill Level Bars ----
    const levelBars = document.querySelectorAll('.level-bar');
    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const bar = entry.target;
                const level = bar.getAttribute('data-level');
                bar.style.width = level + '%';
            }
        });
    }, { threshold: 0.3 });

    levelBars.forEach(bar => skillObserver.observe(bar));

    // ---- Project Filter ----
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.getAttribute('data-filter');
            projectCards.forEach(card => {
                if (filter === 'all' || card.getAttribute('data-category') === filter) {
                    card.classList.remove('hidden');
                    card.style.animation = 'fadeInUp 0.5s ease forwards';
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ---- Contact Form ----
    const contactForm = document.getElementById('contactForm');
    const submitBtn = document.getElementById('submitBtn');

    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const originalContent = submitBtn.innerHTML;
        submitBtn.innerHTML = `
            <span>Terkirim!</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" width="18" height="18">
                <polyline points="20 6 9 17 4 12"/>
            </svg>
        `;
        submitBtn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
        submitBtn.disabled = true;

        setTimeout(() => {
            submitBtn.innerHTML = originalContent;
            submitBtn.style.background = '';
            submitBtn.disabled = false;
            contactForm.reset();
        }, 3000);
    });

    // ---- Smooth Scroll for all anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(anchor.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
