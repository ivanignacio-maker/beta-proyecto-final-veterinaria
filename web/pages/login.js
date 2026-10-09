/**
 * Lógica para el Inicio de Sesión
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Redirigir si ya está autenticado
    if (localStorage.getItem(APP_CONFIG.TOKEN_KEY)) {
        window.location.href = 'dashboard.html';
        return;
    }

    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const loginError = document.getElementById('login-error');
    const btnSubmit = document.getElementById('btn-submit');
    const submitText = document.getElementById('submit-text');
    const submitSpinner = document.getElementById('submit-spinner');

    // 2. Toggle visibilidad de contraseña
    togglePasswordBtn.addEventListener('click', () => {
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        
        const icon = togglePasswordBtn.querySelector('i');
        if (type === 'text') {
            icon.classList.remove('bi-eye');
            icon.classList.add('bi-eye-slash');
        } else {
            icon.classList.remove('bi-eye-slash');
            icon.classList.add('bi-eye');
        }
    });

    // Permitir enviar con la tecla Enter
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            loginForm.dispatchEvent(new Event('submit'));
        }
    });

    // 3. Manejo del formulario
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Limpiar errores previos
        loginError.classList.add('d-none');
        emailInput.classList.remove('is-invalid');
        passwordInput.classList.remove('is-invalid');

        const email = emailInput.value.trim();
        const password = passwordInput.value;

        // Validación básica
        let isValid = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email || !emailRegex.test(email)) {
            emailInput.classList.add('is-invalid');
            isValid = false;
        }

        if (!password || password.length < 4) {
            passwordInput.classList.add('is-invalid');
            isValid = false;
        }

        if (!isValid) return;

        // Estado de carga
        setLoadingState(true);

        // Simulamos la llamada a la API (mocking delay)
        try {
            const success = await mockLoginApi(email, password);
            if (success) {
                // Éxito: Guardar token y datos, redirigir
                localStorage.setItem(APP_CONFIG.TOKEN_KEY, 'mock_token_12345');
                localStorage.setItem(APP_CONFIG.USER_KEY, JSON.stringify({ email: email, role: 'admin' }));
                window.location.href = 'dashboard.html';
            } else {
                // Error de credenciales
                showError();
                setLoadingState(false);
            }
        } catch (error) {
            showError();
            setLoadingState(false);
        }
    });

    // Funciones auxiliares
    function setLoadingState(isLoading) {
        if (isLoading) {
            btnSubmit.disabled = true;
            submitText.textContent = 'Iniciando...';
            submitSpinner.classList.remove('d-none');
            emailInput.disabled = true;
            passwordInput.disabled = true;
        } else {
            btnSubmit.disabled = false;
            submitText.textContent = 'Iniciar sesión';
            submitSpinner.classList.add('d-none');
            emailInput.disabled = false;
            passwordInput.disabled = false;
        }
    }

    function showError() {
        loginError.classList.remove('d-none');
        // Pequeño shake effect
        loginCard = document.querySelector('.login-card');
        loginCard.style.animation = 'shake 0.5s';
        setTimeout(() => { loginCard.style.animation = ''; }, 500);
    }

    // Mock API
    function mockLoginApi(email, password) {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Acepta especificamente este usuario según requerimiento mock
                if (email === 'admin@vetcare.com' && password === 'admin123') {
                    resolve(true);
                } else {
                    resolve(false);
                }
            }, 1000); // 1 segundo de retraso simulado
        });
    }
});

// Agregar estilos de animación por si hace falta en el error
const style = document.createElement('style');
style.innerHTML = `
@keyframes shake {
    0% { transform: translateX(0); }
    25% { transform: translateX(-5px); }
    50% { transform: translateX(5px); }
    75% { transform: translateX(-5px); }
    100% { transform: translateX(0); }
}`;
document.head.appendChild(style);
