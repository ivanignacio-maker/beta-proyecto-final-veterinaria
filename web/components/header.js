/**
 * Componente Header
 * Maneja el renderizado del encabezado tanto para el panel privado como para la zona pública.
 */
window.HeaderComponent = {
    /**
     * Renderiza el header para el panel privado
     * @param {string} containerId ID del contenedor donde se inyectará el header
     */
    render: function(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <header class="main-header d-flex justify-content-between align-items-center p-3 border-bottom bg-white shadow-sm">
                <div class="d-flex align-items-center gap-3">
                    <button class="btn btn-light d-lg-none" type="button" id="sidebarToggle" aria-label="Alternar menú">
                        <i class="bi bi-list fs-4"></i>
                    </button>
                    <div class="d-flex align-items-center text-primary fw-bold fs-4">
                        <i class="bi bi-heart-pulse-fill me-2"></i>
                        <span>VetCare</span>
                    </div>
                </div>
                <div class="d-flex align-items-center gap-3">
                    <span class="d-none d-md-inline text-muted">Clínica Veterinaria Central</span>
                    <div class="dropdown">
                        <button class="btn btn-light rounded-circle p-0" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false" style="width: 40px; height: 40px;">
                            <span class="fw-bold text-primary">JD</span>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end shadow" aria-labelledby="userDropdown">
                            <li><a class="dropdown-item" href="perfil.html"><i class="bi bi-person me-2"></i>Mi perfil</a></li>
                            <li><a class="dropdown-item" href="#"><i class="bi bi-gear me-2"></i>Configuración</a></li>
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item text-danger" href="#logout"><i class="bi bi-box-arrow-right me-2"></i>Cerrar sesión</a></li>
                        </ul>
                    </div>
                </div>
            </header>
        `;

        // Event listener para el sidebar mobile toggle
        const toggleBtn = document.getElementById('sidebarToggle');
        if (toggleBtn && window.SidebarComponent) {
            toggleBtn.addEventListener('click', () => {
                window.SidebarComponent.toggle();
            });
        }
    },

    /**
     * Renderiza el header para las páginas públicas
     * @param {string} containerId ID del contenedor donde se inyectará el header
     */
    renderPublic: function(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        container.innerHTML = `
            <header class="public-header sticky-top bg-white border-bottom shadow-sm">
                <nav class="navbar navbar-expand-lg navbar-light py-3">
                    <div class="container">
                        <a class="navbar-brand d-flex align-items-center text-primary fw-bold" href="index.html">
                            <i class="bi bi-heart-pulse-fill me-2 fs-3"></i>
                            <span>VetCare</span>
                        </a>
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-toggle="collapse" data-bs-target="#navbarPublic" aria-controls="navbarPublic" aria-expanded="false" aria-label="Toggle navigation">
                            <i class="bi bi-list"></i>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarPublic">
                            <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
                                <li class="nav-item">
                                    <a class="nav-link text-dark" href="index.html">Inicio</a>
                                </li>
                            </ul>
                            <div class="d-flex flex-column flex-lg-row gap-2">
                                <a href="acceso.html" class="btn btn-outline-primary">
                                    <i class="bi bi-key me-1"></i> Acceso con código
                                </a>
                                <a href="login.html" class="btn btn-primary">
                                    Iniciar sesión
                                </a>
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        `;
    }
};
