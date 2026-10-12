/**
 * Componente Header
 * Maneja el renderizado del encabezado para:
 * - Panel Profesional (Veterinaria)
 * - Portal del Cliente (Dueño de Mascota)
 * - Zona pública (Landing, Login, Registro, Acceso)
 */
window.HeaderComponent = {
    /**
     * Renderiza el header para el panel privado (adapta según rol VETERINARIA o CLIENTE)
     * @param {string} containerId ID del contenedor donde se inyectará el header
     */
    render: function(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const user = (window.auth && window.auth.getUser()) ? window.auth.getUser() : {
            nombre: 'Usuario',
            rol: 'VETERINARIA'
        };

        const isCliente = user.rol === 'CLIENTE';
        const userInitials = window.utils ? window.utils.getInitials(user.nombre) : (user.nombre ? user.nombre.substring(0, 2).toUpperCase() : 'US');
        const roleBadge = isCliente ? 
            `<span class="badge bg-success-subtle text-success border border-success-subtle d-none d-sm-inline"><i class="bi bi-person-heart me-1"></i>Dueño de Mascota</span>` :
            `<span class="badge bg-primary-subtle text-primary border border-primary-subtle d-none d-sm-inline"><i class="bi bi-hospital me-1"></i>Clínica Veterinaria</span>`;

        const homeUrl = isCliente ? 'cliente-dashboard.html' : 'dashboard.html';
        const perfilUrl = isCliente ? 'cliente-perfil.html' : 'perfil.html';
        const mascotasUrl = isCliente ? 'cliente-mascotas.html' : 'mascotas.html';

        container.innerHTML = `
            <header class="main-header d-flex justify-content-between align-items-center p-3 border-bottom bg-white shadow-sm sticky-top" style="z-index: 1030;">
                <div class="d-flex align-items-center gap-3">
                    <button class="btn btn-light d-lg-none border" type="button" id="sidebarToggle" aria-label="Alternar menú">
                        <i class="bi bi-list fs-4"></i>
                    </button>
                    <a href="${homeUrl}" class="d-flex align-items-center text-primary text-decoration-none fw-bold fs-4">
                        <i class="bi bi-heart-pulse-fill me-2"></i>
                        <span>VetCare</span>
                    </a>
                    ${roleBadge}
                </div>
                <div class="d-flex align-items-center gap-3">
                    <div class="text-end d-none d-md-block">
                        <div class="fw-semibold text-dark text-truncate" style="max-width: 220px;">${user.nombre}</div>
                        <small class="text-muted">${isCliente ? (user.email || 'Propietario') : (user.matricula ? `Matrícula ${user.matricula}` : 'Personal autorizado')}</small>
                    </div>
                    <div class="dropdown">
                        <button class="btn btn-light border rounded-circle p-0 d-flex align-items-center justify-content-center shadow-sm" type="button" id="userDropdown" data-bs-toggle="dropdown" aria-expanded="false" style="width: 42px; height: 42px;">
                            <span class="fw-bold ${isCliente ? 'text-success' : 'text-primary'}">${userInitials}</span>
                        </button>
                        <ul class="dropdown-menu dropdown-menu-end shadow border-0" aria-labelledby="userDropdown">
                            <li class="px-3 py-2 border-bottom d-md-none">
                                <span class="d-block fw-semibold text-dark">${user.nombre}</span>
                                <small class="text-muted">${isCliente ? 'Dueño de Mascota' : 'Veterinaria'}</small>
                            </li>
                            <li><a class="dropdown-item py-2" href="${perfilUrl}"><i class="bi bi-person me-2 text-primary"></i>Mi perfil</a></li>
                            ${isCliente ? `<li><a class="dropdown-item py-2" href="${mascotasUrl}"><i class="bi bi-heart me-2 text-success"></i>Mis mascotas</a></li>` : ''}
                            ${!isCliente ? `<li><a class="dropdown-item py-2" href="solicitudes.html"><i class="bi bi-shield-check me-2 text-info"></i>Solicitudes de acceso</a></li>` : ''}
                            <li><hr class="dropdown-divider"></li>
                            <li><a class="dropdown-item py-2 text-danger" href="javascript:void(0)" onclick="if(window.auth) window.auth.logout();"><i class="bi bi-box-arrow-right me-2"></i>Cerrar sesión</a></li>
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

        const isLogged = window.auth && window.auth.isAuthenticated();
        const user = isLogged ? window.auth.getUser() : null;
        let ctaButton = '';

        if (isLogged && user) {
            const destUrl = user.rol === 'CLIENTE' ? 'cliente-dashboard.html' : 'dashboard.html';
            ctaButton = `
                <a href="${destUrl}" class="btn btn-primary d-flex align-items-center gap-2">
                    <i class="bi bi-speedometer2"></i> Ir a mi panel
                </a>
            `;
        } else {
            ctaButton = `
                <a href="login.html" class="btn btn-outline-primary">
                    <i class="bi bi-box-arrow-in-right me-1"></i> Iniciar sesión
                </a>
                <a href="registro.html" class="btn btn-primary">
                    <i class="bi bi-person-plus me-1"></i> Registrarse (Dueños)
                </a>
            `;
        }

        container.innerHTML = `
            <header class="public-header sticky-top bg-white border-bottom shadow-sm" style="z-index: 1030;">
                <nav class="navbar navbar-expand-lg navbar-light py-3">
                    <div class="container">
                        <a class="navbar-brand d-flex align-items-center text-primary fw-bold fs-4" href="index.html">
                            <i class="bi bi-heart-pulse-fill me-2 fs-3"></i>
                            <span>VetCare</span>
                        </a>
                        <button class="navbar-toggler border" type="button" data-bs-toggle="collapse" data-bs-target="#navbarPublic" aria-controls="navbarPublic" aria-expanded="false" aria-label="Alternar navegación">
                            <i class="bi bi-list fs-4"></i>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarPublic">
                            <ul class="navbar-nav me-auto mb-2 mb-lg-0 ms-lg-4">
                                <li class="nav-item">
                                    <a class="nav-link text-dark fw-medium" href="index.html">Inicio</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link text-dark fw-medium" href="index.html#caracteristicas">Características</a>
                                </li>
                                <li class="nav-item">
                                    <a class="nav-link text-dark fw-medium" href="index.html#como-funciona">Cómo funciona</a>
                                </li>
                            </ul>
                            <div class="d-flex flex-column flex-lg-row gap-2">
                                <a href="acceso.html" class="btn btn-outline-secondary">
                                    <i class="bi bi-key me-1"></i> Canjear código externo
                                </a>
                                ${ctaButton}
                            </div>
                        </div>
                    </div>
                </nav>
            </header>
        `;
    }
};
