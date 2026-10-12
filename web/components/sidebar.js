/**
 * Componente Sidebar
 * Maneja la navegación lateral adaptada para:
 * - Panel Profesional (Veterinaria)
 * - Portal del Dueño de Mascota (Cliente)
 */
window.SidebarComponent = {
    /**
     * Renderiza el sidebar en el contenedor especificado
     * @param {string} containerId ID del contenedor
     */
    render: function(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const user = (window.auth && window.auth.getUser()) ? window.auth.getUser() : {
            nombre: 'Usuario',
            rol: 'VETERINARIA'
        };

        const isCliente = user.rol === 'CLIENTE';
        const currentPath = window.location.pathname.split('/').pop() || (isCliente ? 'cliente-dashboard.html' : 'dashboard.html');

        const checkActive = (path) => currentPath.includes(path) ? 'active' : '';

        // Menú según rol
        let navHtml = '';

        if (isCliente) {
            // MENÚ PARA DUEÑOS DE MASCOTAS
            navHtml = `
                <div class="mb-3">
                    <small class="text-uppercase text-muted fw-bold mb-2 d-block px-3">Principal</small>
                    <nav class="nav flex-column gap-1">
                        <a href="cliente-dashboard.html" class="sidebar__link nav-link rounded ${checkActive('cliente-dashboard')} text-dark px-3 py-2">
                            <i class="bi bi-grid-1x2 me-2 text-primary"></i>Mi Panel
                        </a>
                        <a href="cliente-mascotas.html" class="sidebar__link nav-link rounded ${checkActive('cliente-mascotas')} ${checkActive('cliente-mascota-detalle')} text-dark px-3 py-2">
                            <i class="bi bi-heart-pulse me-2 text-danger"></i>Mis Mascotas
                        </a>
                    </nav>
                </div>

                <div class="mb-3">
                    <small class="text-uppercase text-muted fw-bold mb-2 d-block px-3">Atención y Turnos</small>
                    <nav class="nav flex-column gap-1">
                        <a href="cliente-turnos.html" class="sidebar__link nav-link rounded ${checkActive('cliente-turnos')} text-dark px-3 py-2">
                            <i class="bi bi-calendar-check me-2 text-success"></i>Mis Turnos
                        </a>
                        <a href="cliente-reporte.html" class="sidebar__link nav-link rounded ${checkActive('cliente-reporte')} text-dark px-3 py-2">
                            <i class="bi bi-journal-medical me-2 text-warning"></i>Reportar Atención (Fallback)
                        </a>
                    </nav>
                </div>

                <div class="mb-3">
                    <small class="text-uppercase text-muted fw-bold mb-2 d-block px-3">Seguridad y Permisos</small>
                    <nav class="nav flex-column gap-1">
                        <a href="cliente-autorizaciones.html" class="sidebar__link nav-link rounded ${checkActive('cliente-autorizaciones')} text-dark px-3 py-2">
                            <i class="bi bi-shield-check me-2 text-info"></i>Autorizaciones y Códigos
                        </a>
                    </nav>
                </div>

                <div class="mb-3">
                    <small class="text-uppercase text-muted fw-bold mb-2 d-block px-3">Mi Cuenta</small>
                    <nav class="nav flex-column gap-1">
                        <a href="cliente-perfil.html" class="sidebar__link nav-link rounded ${checkActive('cliente-perfil')} text-dark px-3 py-2">
                            <i class="bi bi-person-circle me-2 text-secondary"></i>Mi Perfil
                        </a>
                        <a href="javascript:void(0)" onclick="if(window.auth) window.auth.logout();" class="sidebar__link nav-link rounded text-danger px-3 py-2">
                            <i class="bi bi-box-arrow-right me-2"></i>Cerrar sesión
                        </a>
                    </nav>
                </div>
            `;
        } else {
            // MENÚ PARA VETERINARIAS
            navHtml = `
                <div class="mb-3">
                    <small class="text-uppercase text-muted fw-bold mb-2 d-block px-3">Principal</small>
                    <nav class="nav flex-column gap-1">
                        <a href="dashboard.html" class="sidebar__link nav-link rounded ${checkActive('dashboard')} text-dark px-3 py-2">
                            <i class="bi bi-grid-1x2 me-2 text-primary"></i>Dashboard
                        </a>
                        <a href="clientes.html" class="sidebar__link nav-link rounded ${checkActive('clientes')} ${checkActive('cliente-detalle')} text-dark px-3 py-2">
                            <i class="bi bi-people me-2 text-success"></i>Clientes
                        </a>
                        <a href="mascotas.html" class="sidebar__link nav-link rounded ${checkActive('mascotas')} ${checkActive('mascota-detalle')} text-dark px-3 py-2">
                            <i class="bi bi-heart-pulse me-2 text-danger"></i>Mascotas
                        </a>
                    </nav>
                </div>

                <div class="mb-3">
                    <small class="text-uppercase text-muted fw-bold mb-2 d-block px-3">Gestión Clínica</small>
                    <nav class="nav flex-column gap-1">
                        <a href="turnos.html" class="sidebar__link nav-link rounded ${checkActive('turnos')} text-dark px-3 py-2">
                            <i class="bi bi-calendar-check me-2 text-warning"></i>Turnos
                        </a>
                        <a href="solicitudes.html" class="sidebar__link nav-link rounded ${checkActive('solicitudes')} text-dark px-3 py-2">
                            <i class="bi bi-shield-check me-2 text-info"></i>Solicitudes de acceso
                        </a>
                    </nav>
                </div>

                <div class="mb-3">
                    <small class="text-uppercase text-muted fw-bold mb-2 d-block px-3">Cuenta</small>
                    <nav class="nav flex-column gap-1">
                        <a href="perfil.html" class="sidebar__link nav-link rounded ${checkActive('perfil')} text-dark px-3 py-2">
                            <i class="bi bi-person-circle me-2 text-secondary"></i>Mi perfil
                        </a>
                        <a href="javascript:void(0)" onclick="if(window.auth) window.auth.logout();" class="sidebar__link nav-link rounded text-danger px-3 py-2">
                            <i class="bi bi-box-arrow-right me-2"></i>Cerrar sesión
                        </a>
                    </nav>
                </div>
            `;
        }

        container.innerHTML = `
            <div id="sidebarOverlay" class="sidebar-overlay d-lg-none" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1040;"></div>
            <aside id="mainSidebar" class="sidebar bg-white border-end d-flex flex-column" style="width: 270px; height: 100vh; position: fixed; left: -270px; transition: left 0.3s ease-in-out; z-index: 1050; top: 0;">
                <div class="p-3 border-bottom d-flex justify-content-between align-items-center bg-light">
                    <div class="d-flex align-items-center text-primary fw-bold fs-4">
                        <i class="bi bi-heart-pulse-fill me-2"></i>
                        <span>VetCare</span>
                    </div>
                    <button class="btn btn-sm btn-light border d-lg-none" onclick="window.SidebarComponent.close()" aria-label="Cerrar menú">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>

                <div class="p-3 border-bottom bg-white d-flex align-items-center gap-2">
                    <div class="rounded-circle d-flex align-items-center justify-content-center ${isCliente ? 'bg-success-subtle text-success' : 'bg-primary-subtle text-primary'}" style="width: 38px; height: 38px; font-weight: bold;">
                        ${window.utils ? window.utils.getInitials(user.nombre) : 'US'}
                    </div>
                    <div class="overflow-hidden">
                        <div class="fw-bold text-dark text-truncate" style="font-size: 0.95rem;">${user.nombre}</div>
                        <span class="badge ${isCliente ? 'bg-success' : 'bg-primary'} text-white" style="font-size: 0.7rem;">
                            ${isCliente ? 'Dueño de Mascota' : 'Veterinaria'}
                        </span>
                    </div>
                </div>
                
                <div class="p-3 overflow-auto flex-grow-1">
                    ${navHtml}
                </div>

                <div class="p-3 border-top bg-light text-center">
                    <small class="text-muted" style="font-size: 0.75rem;">
                        Historia Clínica Única &bull; v1.0
                    </small>
                </div>
            </aside>

            <style>
                @media (min-width: 992px) {
                    #mainSidebar { left: 0 !important; }
                    .main-content, .main-footer { margin-left: 270px !important; }
                }
                .sidebar__link {
                    font-weight: 500;
                    transition: all 0.2s;
                }
                .sidebar__link:hover {
                    background-color: var(--color-bg, #F8FAFC);
                    color: var(--color-primary, #2563EB) !important;
                    transform: translateX(3px);
                }
                .sidebar__link.active {
                    background-color: var(--color-primary-light, #DBEAFE) !important;
                    color: var(--color-primary-dark, #1D4ED8) !important;
                    font-weight: 600;
                    border-left: 4px solid var(--color-primary, #2563EB);
                }
            </style>
        `;

        const overlay = document.getElementById('sidebarOverlay');
        if (overlay) {
            overlay.addEventListener('click', this.close);
        }
    },

    /**
     * Alterna la visibilidad del sidebar en móvil
     */
    toggle: function() {
        const sidebar = document.getElementById('mainSidebar');
        const overlay = document.getElementById('sidebarOverlay');
        if (sidebar && overlay) {
            if (sidebar.style.left === '0px') {
                this.close();
            } else {
                sidebar.style.left = '0px';
                overlay.style.display = 'block';
            }
        }
    },

    /**
     * Cierra el sidebar en móvil
     */
    close: function() {
        const sidebar = document.getElementById('mainSidebar');
        const overlay = document.getElementById('sidebarOverlay');
        if (sidebar && overlay && window.innerWidth < 992) {
            sidebar.style.left = '-270px';
            overlay.style.display = 'none';
        }
    }
};
