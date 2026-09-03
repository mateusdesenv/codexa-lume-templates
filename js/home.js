document.addEventListener('DOMContentLoaded', () => {
    const header = document.getElementById('site-header');
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const leadForm = document.getElementById('lead-form');
    const formMessage = document.getElementById('form-message');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    function track(eventName, details = {}) {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: eventName, ...details });
        window.dispatchEvent(new CustomEvent('lume:analytics', { detail: { event: eventName, ...details } }));
    }

    function setMenu(open) {
        menuToggle.setAttribute('aria-expanded', String(open));
        menuToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
        mobileNav.hidden = !open;
        document.body.classList.toggle('menu-open', open);
    }

    menuToggle.addEventListener('click', () => {
        setMenu(menuToggle.getAttribute('aria-expanded') !== 'true');
    });

    mobileNav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => setMenu(false));
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
            setMenu(false);
            menuToggle.focus();
        }
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth >= 860) setMenu(false);
    });

    function updateHeader() {
        header.classList.toggle('is-scrolled', window.scrollY > 24);
    }

    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();

    const revealElements = document.querySelectorAll('.reveal');
    if (reduceMotion || !('IntersectionObserver' in window)) {
        revealElements.forEach((element) => element.classList.add('is-visible'));
    } else {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px' });
        revealElements.forEach((element) => revealObserver.observe(element));
    }

    const chapters = Array.from(document.querySelectorAll('.demo__chapters li'));
    if (!reduceMotion && chapters.length) {
        let activeChapter = 0;
        window.setInterval(() => {
            chapters[activeChapter].classList.remove('is-active');
            activeChapter = (activeChapter + 1) % chapters.length;
            chapters[activeChapter].classList.add('is-active');
        }, 2200);
    }

    document.querySelectorAll('[data-event]').forEach((element) => {
        element.addEventListener('click', () => {
            track(element.dataset.event, {
                demo: element.dataset.demo || undefined,
                destination: element.getAttribute('href') || undefined
            });
        });
    });

    const whatsappInput = leadForm.querySelector('[name="whatsapp"]');
    whatsappInput.addEventListener('input', (event) => {
        const digits = event.target.value.replace(/\D/g, '').slice(0, 11);
        if (digits.length <= 2) event.target.value = digits;
        else if (digits.length <= 7) event.target.value = `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
        else event.target.value = `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
    });

    leadForm.querySelectorAll('input[required]').forEach((input) => {
        input.addEventListener('blur', () => input.setAttribute('aria-invalid', String(!input.checkValidity())));
        input.addEventListener('input', () => {
            if (input.getAttribute('aria-invalid') === 'true') input.setAttribute('aria-invalid', String(!input.checkValidity()));
        });
    });

    leadForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const requiredFields = Array.from(leadForm.querySelectorAll('input[required]'));
        const invalidField = requiredFields.find((field) => !field.checkValidity());

        requiredFields.forEach((field) => field.setAttribute('aria-invalid', String(!field.checkValidity())));

        if (invalidField) {
            formMessage.classList.remove('is-success');
            formMessage.textContent = 'Revise os campos obrigatórios para continuar.';
            invalidField.focus();
            track('form_validation_error', { field: invalidField.name });
            return;
        }

        const data = new FormData(leadForm);
        const message = [
            'Olá, quero uma demonstração do Codexa Lume.',
            '',
            `Nome: ${data.get('nome')}`,
            `Clínica: ${data.get('clinica')}`,
            `WhatsApp: ${data.get('whatsapp')}`,
            `Instagram: ${data.get('instagram') || 'Não informado'}`,
            `Cidade: ${data.get('cidade')}`,
            `Procedimentos: ${data.get('procedimentos') || 'Não informado'}`
        ].join('\n');

        formMessage.classList.add('is-success');
        formMessage.textContent = 'Tudo certo. Vamos continuar pelo WhatsApp.';
        track('form_submit_success', { city: String(data.get('cidade')), procedures: String(data.get('procedimentos')) });
        window.open(`https://wa.me/5548988512030?text=${encodeURIComponent(message)}`, '_blank', 'noopener,noreferrer');
    });
});
