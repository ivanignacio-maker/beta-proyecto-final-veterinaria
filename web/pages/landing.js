/**
 * Lógica principal de la página de aterrizaje (Landing Page)
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Renderizar Header y Footer Públicos usando componentes globales
    if (window.HeaderComponent && typeof window.HeaderComponent.renderPublic === 'function') {
        window.HeaderComponent.renderPublic('header-container');
    } else {
        renderHeaderPublico();
    }

    if (window.FooterComponent && typeof window.FooterComponent.renderPublic === 'function') {
        window.FooterComponent.renderPublic('footer-container');
    } else {
        renderFooterPublico();
    }

    // 2. Scroll suave para enlaces internos
    setupSmoothScroll();

    // 3. Animación sutil con IntersectionObserver
    setupAnimations();
});

/**
 * Fallback para renderizar header público
 */
function renderHeaderPublico() {
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        headerContainer.innerHTML = `
            <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
                <div class="container">
                    <a class="navbar-brand fw-bold text-primary d-flex align-items-center gap-2" href="index.html">
                        <i class="bi bi-heart-pulse-fill"></i> VetCare
                    </a>
                    <button class="navbar-toggler border" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav me-auto align-items-center ms-lg-3">
                            <li class="nav-item">
                                <a class="nav-link text-dark fw-medium" href="#caracteristicas">Características</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link text-dark fw-medium" href="#como-funciona">Cómo Funciona</a>
                            </li>
                        </ul>
                        <div class="d-flex flex-column flex-lg-row gap-2 mt-2 mt-lg-0">
                            <a class="btn btn-outline-secondary" href="acceso.html">
                                <i class="bi bi-key me-1"></i> Canjear Código
                            </a>
                            <a class="btn btn-outline-primary" href="login.html">
                                <i class="bi bi-box-arrow-in-right me-1"></i> Iniciar Sesión
                            </a>
                            <a class="btn btn-primary" href="registro.html">
                                <i class="bi bi-person-plus me-1"></i> Registrarse (Dueños)
                            </a>
                        </div>
                    </div>
                </div>
            </nav>
        `;
    }
}

/**
 * Fallback para renderizar footer público
 */
function renderFooterPublico() {
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        footerContainer.innerHTML = `
            <footer class="bg-white py-4 mt-auto border-top">
                <div class="container text-center">
                    <p class="text-muted mb-0 small">
                        &copy; ${new Date().getFullYear()} VetCare - Historia Clínica Única de Mascotas. Todos los derechos reservados.
                    </p>
                </div>
            </footer>
        `;
    }
}

/**
 * Configura el scroll suave para los anclajes de la página
 */
function setupSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

/**
 * Configura la animación fadeIn de las tarjetas usando IntersectionObserver
 */
function setupAnimations() {
    const featureCards = document.querySelectorAll('.feature-card');
    
    featureCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
    });

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                obs.unobserve(entry.target);
            }
        });
    }, observerOptions);

    featureCards.forEach(card => {
        observer.observe(card);
    });
}
