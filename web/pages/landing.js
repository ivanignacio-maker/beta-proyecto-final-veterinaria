/**
 * Lógica principal de la página de aterrizaje (Landing Page)
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Renderizar Header y Footer Públicos
    renderHeaderPublico();
    renderFooterPublico();

    // 2. Scroll suave para enlaces internos
    setupSmoothScroll();

    // 3. Animación sutil con IntersectionObserver
    setupAnimations();
});

/**
 * Renderiza un header público simple en caso de que no lo haga un componente
 */
function renderHeaderPublico() {
    const headerContainer = document.getElementById('header-container');
    if (headerContainer) {
        headerContainer.innerHTML = `
            <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm sticky-top">
                <div class="container">
                    <a class="navbar-brand fw-bold text-primary d-flex align-items-center gap-2" href="index.html">
                        <i class="bi bi-heart-pulse"></i> VetCare
                    </a>
                    <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span class="navbar-toggler-icon"></span>
                    </button>
                    <div class="collapse navbar-collapse" id="navbarNav">
                        <ul class="navbar-nav ms-auto align-items-center">
                            <li class="nav-item">
                                <a class="nav-link" href="#caracteristicas">Características</a>
                            </li>
                            <li class="nav-item">
                                <a class="nav-link" href="#como-funciona">Cómo Funciona</a>
                            </li>
                            <li class="nav-item ms-lg-3">
                                <a class="btn btn-outline-primary btn-sm rounded-pill px-3 mb-2 mb-lg-0 w-100" href="acceso.html">Acceso Externo</a>
                            </li>
                            <li class="nav-item ms-lg-2">
                                <a class="btn btn-primary btn-sm rounded-pill px-3 w-100" href="login.html">Iniciar Sesión</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        `;
    }
}

/**
 * Renderiza el footer público
 */
function renderFooterPublico() {
    const footerContainer = document.getElementById('footer-container');
    if (footerContainer) {
        footerContainer.innerHTML = `
            <footer class="bg-white py-4 mt-auto border-top">
                <div class="container text-center">
                    <p class="text-muted mb-0">
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
    
    // Configuración inicial de estilo para ocultar las tarjetas antes de animar
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

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Al entrar en viewport, aplicar animación
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    featureCards.forEach(card => {
        observer.observe(card);
    });
}
