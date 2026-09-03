document.addEventListener('DOMContentLoaded', () => {
    const toggle = document.querySelector('.menu-toggle');
    const mobileNav = document.getElementById('mobile-nav');
    const contactForm = document.querySelector('.contact__form');
    const formStatus = document.querySelector('.form-status');

    function setMenuOpen(open) {
        toggle.setAttribute('aria-expanded', String(open));
        toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
        toggle.classList.toggle('is-open', open);
        mobileNav.hidden = !open;
    }

    toggle.addEventListener('click', () => {
        setMenuOpen(toggle.getAttribute('aria-expanded') !== 'true');
    });

    mobileNav.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => setMenuOpen(false));
    });

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && toggle.getAttribute('aria-expanded') === 'true') {
            setMenuOpen(false);
            toggle.focus();
        }
    });

    contactForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const email = contactForm.querySelector('input[type="email"]');

        if (!email.checkValidity()) {
            formStatus.textContent = 'Digite um e-mail válido para continuar.';
            email.focus();
            return;
        }

        formStatus.textContent = 'Obrigada! Nossa equipe entrará em contato em breve.';
        contactForm.reset();
    });
});
