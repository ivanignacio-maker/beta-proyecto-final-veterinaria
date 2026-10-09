/**
 * Componente Footer
 * Maneja el pie de página para el panel privado y público.
 */
window.FooterComponent = {
    /**
     * Renderiza el footer para el panel privado
     * @param {string} containerId ID del contenedor
     */
    render: function(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const currentYear = new Date().getFullYear();

        container.innerHTML = `
            <footer class="main-footer bg-white border-top py-4 mt-auto">
                <div class="container-fluid px-4">
                    <div class="row gy-3">
                        <div class="col-md-4">
                            <div class="d-flex align-items-center text-primary fw-bold mb-2">
                                <i class="bi bi-heart-pulse-fill me-2"></i> VetCare
                            </div>
                            <p class="text-muted small mb-0">Sistema integral de historia clínica única para mascotas.</p>
                        </div>
                        <div class="col-md-4">
                            <h6 class="fw-bold">Enlaces</h6>
                            <ul class="list-unstyled small">
                                <li><a href="#" class="text-decoration-none text-muted">Política de privacidad</a></li>
                                <li><a href="#" class="text-decoration-none text-muted">Términos y condiciones</a></li>
                                <li><a href="#" class="text-decoration-none text-muted">Contacto</a></li>
                            </ul>
                        </div>
                        <div class="col-md-4 text-md-end">
                            <h6 class="fw-bold">Legal</h6>
                            <p class="text-muted small mb-0">&copy; ${currentYear} VetCare. Todos los derechos reservados.</p>
                        </div>
                    </div>
                </div>
            </footer>
        `;
    },

    /**
     * Renderiza el footer para páginas públicas
     * @param {string} containerId ID del contenedor
     */
    renderPublic: function(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const currentYear = new Date().getFullYear();

        container.innerHTML = `
            <footer class="public-footer bg-dark text-light py-5 mt-auto">
                <div class="container">
                    <div class="row gy-4">
                        <div class="col-lg-4 col-md-6">
                            <div class="d-flex align-items-center text-primary fw-bold mb-3 fs-4">
                                <i class="bi bi-heart-pulse-fill me-2"></i> VetCare
                            </div>
                            <p class="text-light opacity-75">La historia clínica única que conecta profesionales, clínicas y dueños para mejorar la salud de las mascotas.</p>
                            <div class="d-flex gap-3 mt-3">
                                <a href="#" class="text-light opacity-75"><i class="bi bi-facebook fs-5"></i></a>
                                <a href="#" class="text-light opacity-75"><i class="bi bi-twitter fs-5"></i></a>
                                <a href="#" class="text-light opacity-75"><i class="bi bi-instagram fs-5"></i></a>
                                <a href="#" class="text-light opacity-75"><i class="bi bi-linkedin fs-5"></i></a>
                            </div>
                        </div>
                        <div class="col-lg-2 col-md-6">
                            <h6 class="text-uppercase fw-bold mb-3">Plataforma</h6>
                            <ul class="list-unstyled">
                                <li class="mb-2"><a href="#" class="text-decoration-none text-light opacity-75">Inicio</a></li>
                                <li class="mb-2"><a href="#" class="text-decoration-none text-light opacity-75">Características</a></li>
                                <li class="mb-2"><a href="#" class="text-decoration-none text-light opacity-75">Planes</a></li>
                            </ul>
                        </div>
                        <div class="col-lg-2 col-md-6">
                            <h6 class="text-uppercase fw-bold mb-3">Legal</h6>
                            <ul class="list-unstyled">
                                <li class="mb-2"><a href="#" class="text-decoration-none text-light opacity-75">Privacidad</a></li>
                                <li class="mb-2"><a href="#" class="text-decoration-none text-light opacity-75">Términos</a></li>
                            </ul>
                        </div>
                        <div class="col-lg-4 col-md-6">
                            <h6 class="text-uppercase fw-bold mb-3">Contacto</h6>
                            <ul class="list-unstyled text-light opacity-75">
                                <li class="mb-2"><i class="bi bi-envelope me-2"></i> contacto@vetcare.com</li>
                                <li class="mb-2"><i class="bi bi-telephone me-2"></i> +54 11 1234-5678</li>
                                <li class="mb-2"><i class="bi bi-geo-alt me-2"></i> Buenos Aires, Argentina</li>
                            </ul>
                        </div>
                    </div>
                    <hr class="my-4 border-secondary">
                    <div class="text-center text-light opacity-50 small">
                        &copy; ${currentYear} VetCare. Todos los derechos reservados.
                    </div>
                </div>
            </footer>
        `;
    }
};
