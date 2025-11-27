/* ============================================
   DALEXOR - Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {
    initNavigation();
    initScrollAnimations();
    initCounterAnimations();
    init3DBackgrounds();
});

/* Navigation */
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.querySelector('.nav-toggle');
    const navMenu = document.querySelector('.nav-menu');
    
    // Scroll effect
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
    
    // Mobile toggle
    if (navToggle) {
        navToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            navToggle.classList.toggle('active');
        });
    }
    
    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });
}

/* Scroll Animations */
function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                
                // Trigger counter animation if applicable
                if (entry.target.classList.contains('metric-item')) {
                    animateCounter(entry.target);
                }
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.animate-on-scroll, .stagger-children, .metric-item').forEach(el => {
        observer.observe(el);
    });
}

/* Counter Animations */
function initCounterAnimations() {
    // Counters will be triggered by scroll observer
}

function animateCounter(element) {
    const valueEl = element.querySelector('.metric-value');
    if (!valueEl || valueEl.dataset.animated) return;
    
    valueEl.dataset.animated = 'true';
    const target = parseFloat(valueEl.dataset.count);
    const duration = 2000;
    const start = performance.now();
    const isDecimal = target % 1 !== 0;
    
    function update(currentTime) {
        const elapsed = currentTime - start;
        const progress = Math.min(elapsed / duration, 1);
        const easeOut = 1 - Math.pow(1 - progress, 3);
        const current = target * easeOut;
        
        valueEl.textContent = isDecimal ? current.toFixed(1) : Math.floor(current);
        
        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            valueEl.textContent = isDecimal ? target.toFixed(1) : target;
        }
    }
    
    requestAnimationFrame(update);
}

/* 3D Backgrounds */
function init3DBackgrounds() {
    // Hero Canvas
    const heroCanvas = document.getElementById('hero-canvas');
    if (heroCanvas) {
        initHeroBackground(heroCanvas);
    }
    
    // Platform Canvas
    const platformCanvas = document.getElementById('platform-canvas');
    if (platformCanvas) {
        initPlatformVisualization(platformCanvas);
    }
    
    // Metrics Canvas
    const metricsCanvas = document.getElementById('metrics-canvas');
    if (metricsCanvas) {
        initMetricsBackground(metricsCanvas);
    }
}

/* Hero 3D Background - Geometric Mesh */
function initHeroBackground(canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];
    let animationId;
    
    function resize() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
        initParticles();
    }
    
    function initParticles() {
        particles = [];
        const count = Math.floor((width * height) / 15000);
        
        for (let i = 0; i < count; i++) {
            particles.push({
                x: Math.random() * width,
                y: Math.random() * height,
                vx: (Math.random() - 0.5) * 0.3,
                vy: (Math.random() - 0.5) * 0.3,
                radius: Math.random() * 2 + 1
            });
        }
    }
    
    function draw() {
        ctx.clearRect(0, 0, width, height);
        
        // Draw connections
        ctx.strokeStyle = 'rgba(139, 92, 246, 0.1)';
        ctx.lineWidth = 1;
        
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                
                if (dist < 150) {
                    ctx.globalAlpha = (1 - dist / 150) * 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.stroke();
                }
            }
        }
        
        // Draw particles
        ctx.globalAlpha = 1;
        particles.forEach(p => {
            ctx.fillStyle = 'rgba(139, 92, 246, 0.6)';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fill();
            
            // Update position
            p.x += p.vx;
            p.y += p.vy;
            
            // Bounce off edges
            if (p.x < 0 || p.x > width) p.vx *= -1;
            if (p.y < 0 || p.y > height) p.vy *= -1;
        });
        
        animationId = requestAnimationFrame(draw);
    }
    
    window.addEventListener('resize', resize);
    resize();
    draw();
}

/* Platform Visualization */
function initPlatformVisualization(canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let time = 0;
    
    function resize() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
    }
    
    function draw() {
        ctx.clearRect(0, 0, width, height);
        time += 0.01;
        
        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) * 0.3;
        
        // Draw orbiting circles
        for (let i = 0; i < 3; i++) {
            const angle = time + (i * Math.PI * 2 / 3);
            const x = centerX + Math.cos(angle) * radius;
            const y = centerY + Math.sin(angle) * radius;
            
            // Connection to center
            ctx.strokeStyle = 'rgba(139, 92, 246, 0.2)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(centerX, centerY);
            ctx.lineTo(x, y);
            ctx.stroke();
            
            // Outer circle
            ctx.fillStyle = 'rgba(139, 92, 246, 0.3)';
            ctx.beginPath();
            ctx.arc(x, y, 20, 0, Math.PI * 2);
            ctx.fill();
        }
        
        // Center circle
        ctx.fillStyle = 'rgba(139, 92, 246, 0.5)';
        ctx.beginPath();
        ctx.arc(centerX, centerY, 30, 0, Math.PI * 2);
        ctx.fill();
        
        // Pulse ring
        const pulseRadius = radius * (1 + Math.sin(time * 2) * 0.1);
        ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 + Math.sin(time * 2) * 0.05})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(centerX, centerY, pulseRadius, 0, Math.PI * 2);
        ctx.stroke();
        
        requestAnimationFrame(draw);
    }
    
    window.addEventListener('resize', resize);
    resize();
    draw();
}

/* Metrics Background */
function initMetricsBackground(canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let waves = [];
    
    function resize() {
        width = canvas.width = canvas.offsetWidth;
        height = canvas.height = canvas.offsetHeight;
        initWaves();
    }
    
    function initWaves() {
        waves = [];
        for (let i = 0; i < 3; i++) {
            waves.push({
                y: height * (0.3 + i * 0.2),
                amplitude: 30 + i * 10,
                frequency: 0.005 - i * 0.001,
                speed: 0.02 + i * 0.005,
                offset: 0
            });
        }
    }
    
    function draw() {
        ctx.clearRect(0, 0, width, height);
        
        waves.forEach((wave, index) => {
            wave.offset += wave.speed;
            
            ctx.strokeStyle = `rgba(139, 92, 246, ${0.1 - index * 0.02})`;
            ctx.lineWidth = 2;
            ctx.beginPath();
            
            for (let x = 0; x <= width; x += 5) {
                const y = wave.y + Math.sin(x * wave.frequency + wave.offset) * wave.amplitude;
                if (x === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            
            ctx.stroke();
        });
        
        requestAnimationFrame(draw);
    }
    
    window.addEventListener('resize', resize);
    resize();
    draw();
}

/* Smooth Scroll */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* Form Handling */
function initForms() {
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<span class="loading-spinner"></span>';
            
            // Simulate form submission
            await new Promise(resolve => setTimeout(resolve, 2000));
            
            submitBtn.innerHTML = '✓ Submitted';
            submitBtn.classList.add('success');
            
            setTimeout(() => {
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                submitBtn.classList.remove('success');
                form.reset();
            }, 3000);
        });
    });
}

// Initialize forms if present
if (document.querySelector('form')) {
    initForms();
}
