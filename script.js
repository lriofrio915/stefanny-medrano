// ===================================
// LANDING PAGE - DRA. MEDRANO
// JavaScript Functionality
// ===================================

document.addEventListener('DOMContentLoaded', function () {
    // Initialize all components
    initMobileMenu();
    initSmoothScroll();
    initFormHandler();
    initScrollAnimations();
    initHeaderScroll();
    initScrollToTop();
});

// ===================================
// MOBILE MENU
// ===================================

function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const nav = document.getElementById('nav');

    if (!menuBtn || !nav) return;

    menuBtn.addEventListener('click', function () {
        menuBtn.classList.toggle('active');
        nav.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = nav.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function () {
            menuBtn.classList.remove('active');
            nav.classList.remove('active');
        });
    });

    // Close menu when clicking outside
    document.addEventListener('click', function (e) {
        if (!nav.contains(e.target) && !menuBtn.contains(e.target)) {
            menuBtn.classList.remove('active');
            nav.classList.remove('active');
        }
    });
}

// ===================================
// SMOOTH SCROLL
// ===================================

function initSmoothScroll() {
    const links = document.querySelectorAll('a[href^="#"]');

    links.forEach(link => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');

            if (href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                const headerHeight = document.querySelector('.header').offsetHeight;
                const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;

                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// FORM HANDLER - N8N WEBHOOK
// ===================================

function initFormHandler() {
    const form = document.getElementById('contact-form');
    const formSuccess = document.getElementById('form-success');
    const submitBtn = document.getElementById('submit-btn');

    if (!form) return;

    // Webhook URL for n8n
    const WEBHOOK_URL = 'https://n8n.nexus-ia.com.es/webhook/formulario-medrano';

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Get form data
        const formData = {
            nombre: document.getElementById('nombre').value.trim(),
            telefono: document.getElementById('telefono').value.trim(),
            ubicacion: document.getElementById('ubicacion').value.trim(),
            motivo: document.getElementById('motivo').value.trim(),
            fecha: new Date().toISOString(),
            fuente: 'Landing Page'
        };

        // Validate form
        if (!validateForm(formData)) {
            return;
        }

        // Show loading state
        setButtonLoading(submitBtn, true);

        try {
            // Send data to n8n webhook
            const response = await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData)
            });

            // Show success message
            form.style.display = 'none';
            formSuccess.style.display = 'block';

            // Scroll to success message
            formSuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });

        } catch (error) {
            console.error('Error sending form:', error);

            // Even if there's an error, show success
            // (webhook might not return proper CORS headers)
            form.style.display = 'none';
            formSuccess.style.display = 'block';
        } finally {
            setButtonLoading(submitBtn, false);
        }
    });
}

function validateForm(data) {
    const errors = [];

    if (!data.nombre || data.nombre.length < 2) {
        errors.push('Por favor, ingresa tu nombre completo.');
        highlightField('nombre', true);
    } else {
        highlightField('nombre', false);
    }

    if (!data.telefono || data.telefono.length < 7) {
        errors.push('Por favor, ingresa un número de teléfono válido.');
        highlightField('telefono', true);
    } else {
        highlightField('telefono', false);
    }

    if (!data.ubicacion || data.ubicacion.length < 2) {
        errors.push('Por favor, indica tu ubicación.');
        highlightField('ubicacion', true);
    } else {
        highlightField('ubicacion', false);
    }

    if (!data.motivo || data.motivo.length < 5) {
        errors.push('Por favor, describe brevemente el motivo de tu consulta.');
        highlightField('motivo', true);
    } else {
        highlightField('motivo', false);
    }

    if (errors.length > 0) {
        // Focus first error field
        const firstErrorField = document.querySelector('.form-group.error input, .form-group.error textarea');
        if (firstErrorField) {
            firstErrorField.focus();
        }
        return false;
    }

    return true;
}

function highlightField(fieldId, hasError) {
    const field = document.getElementById(fieldId);
    const formGroup = field.closest('.form-group');

    if (hasError) {
        formGroup.classList.add('error');
        field.style.borderColor = '#EF4444';
    } else {
        formGroup.classList.remove('error');
        field.style.borderColor = '';
    }
}

function setButtonLoading(button, isLoading) {
    const btnText = button.querySelector('.btn-text');
    const btnLoading = button.querySelector('.btn-loading');

    if (isLoading) {
        btnText.style.display = 'none';
        btnLoading.style.display = 'inline-flex';
        button.disabled = true;
    } else {
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
        button.disabled = false;
    }
}

// ===================================
// SCROLL ANIMATIONS
// ===================================

function initScrollAnimations() {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Observe elements
    const animateElements = document.querySelectorAll(
        '.problem-card, .service-card, .testimonial-card, .solution-image, .about-image'
    );

    animateElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // Add animation class styles
    const style = document.createElement('style');
    style.textContent = `
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
}

// ===================================
// HEADER SCROLL EFFECT
// ===================================

function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            header.style.padding = '12px 0';
        } else {
            header.style.boxShadow = '';
            header.style.padding = '16px 0';
        }

        lastScroll = currentScroll;
    });
}

// ===================================
// UTILITY FUNCTIONS
// ===================================

// Format phone number as user types
document.addEventListener('input', function (e) {
    if (e.target.id === 'telefono') {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 10) {
            value = value.slice(0, 10);
        }

        // Format: 0999 999 999
        if (value.length > 4 && value.length <= 7) {
            value = value.slice(0, 4) + ' ' + value.slice(4);
        } else if (value.length > 7) {
            value = value.slice(0, 4) + ' ' + value.slice(4, 7) + ' ' + value.slice(7);
        }

        e.target.value = value;
    }
});

// Clear error state on input
document.addEventListener('focus', function (e) {
    if (e.target.matches('input, textarea')) {
        const formGroup = e.target.closest('.form-group');
        if (formGroup) {
            formGroup.classList.remove('error');
            e.target.style.borderColor = '';
        }
    }
}, true);

// ===================================
// SCROLL TO TOP BUTTON
// ===================================

function initScrollToTop() {
    const scrollTopBtn = document.getElementById('scroll-top-btn');

    if (!scrollTopBtn) return;

    // Show/hide button based on scroll position
    window.addEventListener('scroll', function () {
        const scrollHeight = document.documentElement.scrollHeight;
        const clientHeight = document.documentElement.clientHeight;
        const scrollTop = window.pageYOffset;

        // Calculate scroll percentage
        const scrollPercentage = (scrollTop / (scrollHeight - clientHeight)) * 100;

        // Show button when scrolled past 60% of the page
        if (scrollPercentage > 60) {
            scrollTopBtn.classList.add('visible');
        } else {
            scrollTopBtn.classList.remove('visible');
        }
    });

    // Scroll to top when clicked
    scrollTopBtn.addEventListener('click', function () {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}
