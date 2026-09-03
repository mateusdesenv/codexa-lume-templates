document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('header');
    const menuToggle = document.getElementById('menuToggle');
    const nav = document.getElementById('nav');
    const navLinks = nav.querySelectorAll('.nav__link');
    const form = document.getElementById('contatoForm');
    const telefoneInput = document.getElementById('telefone');

    // ==========================================
    // Header scroll effect
    // ==========================================
    function onScroll() {
        if (window.scrollY > 50) {
            header.classList.add('header--scrolled');
        } else {
            header.classList.remove('header--scrolled');
        }
    }

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // ==========================================
    // Mobile menu
    // ==========================================
    menuToggle.addEventListener('click', () => {
        menuToggle.classList.toggle('active');
        nav.classList.toggle('active');
        document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // Close mobile menu on resize above breakpoint
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768) {
            menuToggle.classList.remove('active');
            nav.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // ==========================================
    // Smooth scroll for anchor links
    // ==========================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#') return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ==========================================
    // Phone mask
    // ==========================================
    telefoneInput.addEventListener('input', (e) => {
        let value = e.target.value.replace(/\D/g, '');

        if (value.length > 11) {
            value = value.slice(0, 11);
        }

        if (value.length > 2) {
            value = `(${value.slice(0, 2)}) ${value.slice(2)}`;
        }

        if (value.length > 10) {
            value = `${value.slice(0, 10)}-${value.slice(10)}`;
        }

        e.target.value = value;
    });

    // ==========================================
    // Form validation
    // ==========================================
    const fields = {
        nome: {
            el: document.getElementById('nome'),
            error: document.getElementById('nomeError'),
            validate: (val) => val.trim().length >= 2
        },
        telefone: {
            el: document.getElementById('telefone'),
            error: document.getElementById('telefoneError'),
            validate: (val) => /^\(\d{2}\)\s?\d{4,5}-\d{4}$/.test(val.trim())
        },
        email: {
            el: document.getElementById('email'),
            error: document.getElementById('emailError'),
            validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim())
        }
    };

    function validateField(field) {
        const isValid = field.validate(field.el.value);
        const group = field.el.closest('.form__group');

        if (isValid) {
            group.classList.remove('error');
            return true;
        } else {
            group.classList.add('error');
            return false;
        }
    }

    Object.values(fields).forEach(field => {
        field.el.addEventListener('blur', () => validateField(field));
        field.el.addEventListener('input', () => {
            if (field.el.closest('.form__group').classList.contains('error')) {
                validateField(field);
            }
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const isValid = Object.values(fields).every(validateField);
        const successMessage = document.getElementById('formSuccess');

        if (isValid) {
            const submitBtn = form.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;

            submitBtn.disabled = true;
            submitBtn.textContent = 'Enviando...';

            setTimeout(() => {
                form.reset();
                submitBtn.disabled = false;
                submitBtn.textContent = originalText;
                successMessage.classList.add('visible');

                setTimeout(() => {
                    successMessage.classList.remove('visible');
                }, 5000);
            }, 1200);
        } else {
            const firstInvalid = Object.values(fields).find(field => !field.validate(field.el.value));
            if (firstInvalid) firstInvalid.el.focus();
        }
    });

    // ==========================================
    // Reveal on scroll
    // ==========================================
    const revealElements = document.querySelectorAll('.experience-card, .plan__content, .plan__visual, .experts__content, .experts__visual, .contact__box');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(24px)';
        el.style.transition = `opacity 0.5s ease ${index * 0.05}s, transform 0.5s ease ${index * 0.05}s`;
        revealObserver.observe(el);
    });

    const style = document.createElement('style');
    style.textContent = `
        .revealed {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(style);
});
