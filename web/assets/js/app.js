/**
 * Inicialización principal de la aplicación VetCare
 * Soporta control de acceso inteligente para:
 * - Vistas públicas (Landing, Login, Registro, Acceso por código)
 * - Portal del Dueño de Mascota (.client-layout)
 * - Panel Profesional Veterinario (.vet-layout o páginas clínicas)
 */
document.addEventListener('DOMContentLoaded', () => {
    // 1. Determinar tipo de página
    const body = document.body;
    const isPublicPage = body.classList.contains('public-layout');
    const isExternalAccess = body.classList.contains('external-layout');
    const isClientPage = body.classList.contains('client-layout');
    
    // 2. Control de acceso según el rol requerido
    if (!isPublicPage && !isExternalAccess) {
        if (isClientPage) {
            auth.requireAuth('CLIENTE');
        } else {
            auth.requireAuth('VETERINARIA');
        }
    }

    // 3. Inicializar componentes de layout (Sidebar toggle)
    initSidebar();

    // 4. Marcar link activo en sidebar
    highlightActiveLink();

    // 5. Setup de modales
    initModals();
    
    // 6. Cargar datos del usuario en header
    if (auth.isAuthenticated() && !isPublicPage && !isExternalAccess) {
        renderUserInfo();
    }
});

function initSidebar() {
    const toggleBtn = document.getElementById('sidebarToggle') || document.querySelector('.main-header__toggle');
    const sidebar = document.getElementById('mainSidebar') || document.querySelector('.sidebar');
    
    if (toggleBtn && sidebar && window.SidebarComponent) {
        toggleBtn.addEventListener('click', () => {
            window.SidebarComponent.toggle();
        });
    }
}

function highlightActiveLink() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const links = document.querySelectorAll('.sidebar__link');
    
    links.forEach(link => {
        const href = link.getAttribute('href');
        if (href && href !== '#' && href !== 'javascript:void(0)') {
            if (currentPath === href || (href !== 'index.html' && currentPath.includes(href.replace('.html', '')))) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        }
    });
}

function initModals() {
    // Manejador genérico para botones data-bs-dismiss="modal" en caso de no usar Bootstrap JS
    const closeBtns = document.querySelectorAll('[data-bs-dismiss="modal"]');
    closeBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const modalEl = btn.closest('.modal');
            if (modalEl && window.bootstrap && window.bootstrap.Modal) {
                const modal = window.bootstrap.Modal.getInstance(modalEl);
                if (modal) modal.hide();
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
    if (avatarEl && window.utils) avatarEl.textContent = utils.getInitials(user.nombre);
}
