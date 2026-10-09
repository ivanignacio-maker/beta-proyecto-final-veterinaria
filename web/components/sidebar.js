/**
 * Componente Sidebar
 * Maneja la navegación lateral y su comportamiento en responsive.
 */
window.SidebarComponent = {
    /**
     * Renderiza el sidebar en el contenedor especificado
     * @param {string} containerId ID del contenedor
     */
    render: function(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const currentPath = window.location.pathname.split('/').pop() || 'dashboard.html';

        const checkActive = (path) => currentPath.includes(path) ? 'active' : '';

        container.innerHTML = `
            <div id="sidebarOverlay" class="sidebar-overlay d-lg-none" style="display: none; position: fixed; inset: 0; background: rgba(0,0,0,0.5); z-index: 1040;"></div>
            <aside id="mainSidebar" class="sidebar bg-white border-end d-flex flex-column" style="width: 280px; height: 100vh; position: fixed; left: -280px; transition: 0.3s; z-index: 1050; top: 0;">
                <div class="p-3 border-bottom d-flex justify-content-between align-items-center">
                    <span class="text-primary fw-bold fs-4"><i class="bi bi-heart-pulse-fill me-2"></i>VetCare</span>
                    <button class="btn btn-sm btn-light d-lg-none" onclick="window.SidebarComponent.close()">
                        <i class="bi bi-x-lg"></i>
                    </button>
                </div>
                
                <div class="p-3 overflow-auto flex-grow-1">
                    <div class="mb-3">
                        <small class="text-uppercase text-muted fw-bold mb-2 d-block">Principal</small>
                        <nav class="nav flex-column gap-1">
                            <a href="dashboard.html" class="sidebar__link nav-link rounded ${checkActive('dashboard')} text-dark px-3 py-2">
                                <i class="bi bi-grid-1x2 me-2"></i>Dashboard
                            </a>
                            <a href="clientes.html" class="sidebar__link nav-link rounded ${checkActive('clientes')} text-dark px-3 py-2">
                                <i class="bi bi-people me-2"></i>Clientes
                            </a>
                            <a href="mascotas.html" class="sidebar__link nav-link rounded ${checkActive('mascotas')} text-dark px-3 py-2">
                                <i class="bi bi-heart-pulse me-2"></i>Mascotas
                            </a>
                        </nav>
                    </div>

                    <div class="mb-3">
                        <small class="text-uppercase text-muted fw-bold mb-2 d-block">Gestión Clínica</small>
                        <nav class="nav flex-column gap-1">
                            <a href="turnos.html" class="sidebar__link nav-link rounded ${checkActive('turnos')} text-dark px-3 py-2">
                                <i class="bi bi-calendar-check me-2"></i>Turnos
                            </a>
                            <a href="solicitudes.html" class="sidebar__link nav-link rounded ${checkActive('solicitudes')} text-dark px-3 py-2">
                                <i class="bi bi-shield-check me-2"></i>Solicitudes de acceso
                            </a>
                        </nav>
                    </div>

                    <div class="mb-3">
                        <small class="text-uppercase text-muted fw-bold mb-2 d-block">Cuenta</small>
                        <nav class="nav flex-column gap-1">
                            <a href="perfil.html" class="sidebar__link nav-link rounded ${checkActive('perfil')} text-dark px-3 py-2">
                                <i class="bi bi-person-circle me-2"></i>Mi perfil
                            </a>
                            <a href="#logout" class="sidebar__link nav-link rounded text-danger px-3 py-2">
                                <i class="bi bi-box-arrow-right me-2"></i>Cerrar sesión
                            </a>
                        </nav>
                    </div>
                </div>
            </aside>
            <style>
                @media (min-width: 992px) {
                    #mainSidebar { left: 0 !important; }
                    .main-content-wrapper { margin-left: 280px; }
                }
                .sidebar__link:hover, .sidebar__link.active {
                    background-color: var(--color-primary-light, #DBEAFE);
                    color: var(--color-primary-dark, #1D4ED8) !important;
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
            sidebar.style.left = '-280px';
            overlay.style.display = 'none';
        }
    }
};
