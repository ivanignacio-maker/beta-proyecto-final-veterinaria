/**
 * Inicialización principal de la aplicación
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Determinar tipo de página
    const body = document.body;
    const isPublicPage = body.classList.contains('public-layout');
    const isExternalAccess = body.classList.contains('external-layout');
    
    // 2. Control de acceso
    if (!isPublicPage && !isExternalAccess) {
        auth.requireAuth();
    }

    // 3. Inicializar componentes de layout (Sidebar)
    initSidebar();

    // 4. Marcar link activo en sidebar
    highlightActiveLink();

    // 5. Setup de utilidades globales (ej. cierre de modales si se hace clic fuera)
    initModals();
    
    // 6. Cargar datos del usuario en header
    if (auth.isAuthenticated() && !isPublicPage && !isExternalAccess) {
        renderUserInfo();
    }
});

function initSidebar() {
    const toggleBtn = document.querySelector('.main-header__toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (toggleBtn && sidebar) {
        // Crear overlay
        const overlay = document.createElement('div');
        overlay.className = 'sidebar-overlay';
        document.body.appendChild(overlay);

        const toggleSidebar = () => {
            sidebar.classList.toggle('sidebar--open');
            overlay.classList.toggle('show');
        };

        toggleBtn.addEventListener('click', toggleSidebar);
        overlay.addEventListener('click', toggleSidebar);
    }
}

function highlightActiveLink() {
    const currentPath = window.location.pathname;
    const links = document.querySelectorAll('.sidebar__link');
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        // Simple match, mejorar según routing
        if (href && currentPath.includes(href) && href !== '#') {
            link.classList.add('active');
        } else if (currentPath === '/' && href === 'index.html') {
            link.classList.add('active'); // Caso raíz
        }
    });
}

function initModals() {
    // Simple manejador de modales sin dependencias de Bootstrap JS
    const modalTriggers = document.querySelectorAll('[data-bs-toggle="modal"]');
    const closeBtns = document.querySelectorAll('[data-bs-dismiss="modal"]');

    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const target = document.querySelector(trigger.getAttribute('data-bs-target'));
            if (target) {
                target.classList.add('show');
            }
        });
    });

    closeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modal = btn.closest('.modal-custom-backdrop');
            if (modal) modal.classList.remove('show');
        });
    });

    // Cerrar al clickear el backdrop
    document.querySelectorAll('.modal-custom-backdrop').forEach(backdrop => {
        backdrop.addEventListener('click', (e) => {
            if (e.target === backdrop) {
                backdrop.classList.remove('show');
            }
        });
    });
}

function renderUserInfo() {
    const user = auth.getUser();
    if (!user) return;

    const nameEl = document.querySelector('.main-header__user-name');
    const avatarEl = document.querySelector('.main-header__user-avatar');

    if (nameEl) nameEl.textContent = user.nombre;
    if (avatarEl) avatarEl.textContent = utils.getInitials(user.nombre);
}
