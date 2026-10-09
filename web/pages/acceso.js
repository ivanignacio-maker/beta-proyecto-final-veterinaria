/**
 * Lógica para la página de canje de código externo
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Renderizar Header y Footer Públicos (Mocks si no existen los componentes)
    renderHeaderPublico();
    renderFooterPublico();

    const accesoForm = document.getElementById('acceso-form');
    const codigoInput = document.getElementById('codigo-acceso');
    const clinicaInput = document.getElementById('nombre-clinica');
    const matriculaInput = document.getElementById('matricula');
    const errorDiv = document.getElementById('acceso-error');
    const btnSubmit = document.getElementById('btn-submit');
    const submitText = document.getElementById('submit-text');
    const submitSpinner = document.getElementById('submit-spinner');

    // 2. Convertir input a mayúsculas
    codigoInput.addEventListener('input', function() {
        this.value = this.value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    });

    // 3. Manejo del formulario
    accesoForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Control de intentos (rate limiting)
        const blockStatus = checkRateLimit();
        if (blockStatus.blocked) {
            showError(`Has superado el límite de intentos. Esperá ${blockStatus.minutesLeft} minutos.`);
            btnSubmit.disabled = true;
            return;
        }

        // Limpieza de errores
        errorDiv.classList.add('d-none');
        codigoInput.classList.remove('is-invalid');
        clinicaInput.classList.remove('is-invalid');

        const codigo = codigoInput.value.trim();
        const clinica = clinicaInput.value.trim();
        const matricula = matriculaInput.value.trim();

        // Validación
        let isValid = true;
        if (!codigo || codigo.length < 6) {
            codigoInput.classList.add('is-invalid');
            isValid = false;
        }
        if (!clinica) {
            clinicaInput.classList.add('is-invalid');
            isValid = false;
        }

        if (!isValid) return;

        // Carga
        setLoadingState(true);

        try {
            const result = await mockCanjearCodigoApi(codigo);
            if (result.status === 'success') {
                // Guardar info de sesión temporal y redirigir
                const sessionData = {
                    codigo: codigo,
                    clinica: clinica,
                    matricula: matricula,
                    mascotaId: result.mascotaId,
                    timestamp: new Date().getTime()
                };
                sessionStorage.setItem('vetcare_external_session', JSON.stringify(sessionData));
                window.location.href = 'acceso-resultado.html';
            } else {
                handleApiError(result.reason);
                registerFailedAttempt();
            }
        } catch (error) {
            handleApiError('default');
            registerFailedAttempt();
        } finally {
            setLoadingState(false);
        }
    });

    // Rate Limiting Logic (5 attempts max, 15 min cooldown)
    function checkRateLimit() {
        const attemptsStr = sessionStorage.getItem('vetcare_attempts');
        if (!attemptsStr) return { blocked: false };

        const attempts = JSON.parse(attemptsStr);
        if (attempts.count >= 5) {
            const timePassed = new Date().getTime() - attempts.lastAttempt;
            const cooldown = 15 * 60 * 1000; // 15 mins
            if (timePassed < cooldown) {
                const minutesLeft = Math.ceil((cooldown - timePassed) / 60000);
                return { blocked: true, minutesLeft };
            } else {
                // Reset limit after cooldown
                sessionStorage.removeItem('vetcare_attempts');
                return { blocked: false };
            }
        }
        return { blocked: false };
    }

    function registerFailedAttempt() {
        const attemptsStr = sessionStorage.getItem('vetcare_attempts');
        let attempts = attemptsStr ? JSON.parse(attemptsStr) : { count: 0, lastAttempt: null };
        attempts.count += 1;
        attempts.lastAttempt = new Date().getTime();
        sessionStorage.setItem('vetcare_attempts', JSON.stringify(attempts));
    }

    function handleApiError(reason) {
        let msg = '';
        switch (reason) {
            case 'invalid': msg = 'El código ingresado no es válido. Verificá que esté correctamente escrito.'; break;
            case 'expired': msg = 'Este código ha expirado. Solicitá uno nuevo al dueño de la mascota.'; break;
            case 'revoked': msg = 'Este código fue revocado por el dueño de la mascota.'; break;
            case 'used': msg = 'Este código ya fue utilizado anteriormente.'; break;
            case 'blocked': msg = 'Demasiados intentos fallidos. Intentá nuevamente en 15 minutos.'; break;
            default: msg = 'Ocurrió un error. Intentá nuevamente más tarde.'; break;
        }
        showError(msg);
    }

    function showError(msg) {
        errorDiv.textContent = msg;
        errorDiv.classList.remove('d-none');
    }

    function setLoadingState(isLoading) {
        btnSubmit.disabled = isLoading;
        submitSpinner.classList.toggle('d-none', !isLoading);
        submitText.textContent = isLoading ? 'Verificando...' : 'Canjear código';
        codigoInput.disabled = isLoading;
        clinicaInput.disabled = isLoading;
        matriculaInput.disabled = isLoading;
    }

    // Mock API
    function mockCanjearCodigoApi(codigo) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (codigo === 'A1B2C3D4') resolve({ status: 'success', mascotaId: 101 });
                else if (codigo === 'EXPIRED1') resolve({ status: 'error', reason: 'expired' });
                else if (codigo === 'REVOKED1') resolve({ status: 'error', reason: 'revoked' });
                else if (codigo === 'USED0001') resolve({ status: 'error', reason: 'used' });
                else resolve({ status: 'error', reason: 'invalid' });
            }, 1200);
        });
    }

    // Funciones fallback para header y footer
    function renderHeaderPublico() {
        const headerContainer = document.getElementById('header-container');
        if (headerContainer && !headerContainer.innerHTML.trim()) {
            headerContainer.innerHTML = `
                <nav class="navbar navbar-light bg-white shadow-sm">
                    <div class="container">
                        <a class="navbar-brand fw-bold text-primary" href="index.html">
                            <i class="bi bi-heart-pulse"></i> VetCare
                        </a>
                    </div>
                </nav>
            `;
        }
    }
    function renderFooterPublico() {
        const footerContainer = document.getElementById('footer-container');
        if (footerContainer && !footerContainer.innerHTML.trim()) {
            footerContainer.innerHTML = `
                <footer class="bg-white py-3 mt-auto border-top text-center text-muted">
                    <small>&copy; ${new Date().getFullYear()} VetCare</small>
                </footer>
            `;
        }
    }
});
