/**
 * Lógica para el Inicio de Sesión
 * Soporta Veterinarias y Dueños de Mascotas (Clientes)
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. Si ya está autenticado, redirigir a su panel correspondiente
    if (window.auth && window.auth.isAuthenticated()) {
        const u = window.auth.getUser();
        if (u && u.rol === 'CLIENTE') {
            window.location.href = 'cliente-dashboard.html';
        } else {
            window.location.href = 'dashboard.html';
        }
        return;
    }

    const loginForm = document.getElementById('login-form');
    const emailInput = document.getElementById('login-email');
    const passwordInput = document.getElementById('login-password');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const loginError = document.getElementById('login-error');
    const loginErrorText = document.getElementById('login-error-text');
    const btnSubmit = document.getElementById('btn-submit');
    const submitText = document.getElementById('submit-text');
    const submitSpinner = document.getElementById('submit-spinner');
    const pillCliente = document.getElementById('pill-cliente');
    const pillVet = document.getElementById('pill-vet');
    const labelIdentifier = document.getElementById('label-identifier');
    const btnDemoCliente = document.getElementById('btn-demo-cliente');
    const btnDemoVet = document.getElementById('btn-demo-vet');

    let currentRole = 'CLIENTE';

    // 2. Control de pestañas de rol
    function setRole(role) {
        currentRole = role;
        if (role === 'CLIENTE') {
            pillCliente.classList.add('active');
            pillVet.classList.remove('active');
            labelIdentifier.textContent = 'Correo electrónico o DNI';
            emailInput.placeholder = 'maria.g@email.com o 30123456';
            btnSubmit.className = 'btn btn-success w-100 py-2 mb-3 fw-bold shadow-sm';
            submitText.textContent = 'Ingresar como Dueño';
        } else {
            pillVet.classList.add('active');
            pillCliente.classList.remove('active');
            labelIdentifier.textContent = 'Correo electrónico institucional';
            emailInput.placeholder = 'admin@vetcare.com';
            btnSubmit.className = 'btn btn-primary w-100 py-2 mb-3 fw-bold shadow-sm';
            submitText.textContent = 'Ingresar como Veterinaria';
        }
        loginError.classList.add('d-none');
    }

    if (pillCliente) {
        pillCliente.addEventListener('click', () => setRole('CLIENTE'));
    }
    if (pillVet) {
        pillVet.addEventListener('click', () => setRole('VETERINARIA'));
    }

    // Inicializar estado del botón por defecto
    setRole('CLIENTE');

    // 3. Botones de Demo Rápido
    if (btnDemoCliente) {
        btnDemoCliente.addEventListener('click', () => {
            setRole('CLIENTE');
            emailInput.value = 'maria.g@email.com';
            passwordInput.value = 'password123';
            emailInput.classList.remove('is-invalid');
            passwordInput.classList.remove('is-invalid');
        });
    }

    if (btnDemoVet) {
        btnDemoVet.addEventListener('click', () => {
            setRole('VETERINARIA');
            emailInput.value = 'admin@vetcare.com';
            passwordInput.value = 'admin123';
            emailInput.classList.remove('is-invalid');
            passwordInput.classList.remove('is-invalid');
        });
    }

    // 4. Toggle visibilidad de contraseña
    if (togglePasswordBtn) {
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
    }

    // 5. Envío del formulario
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        loginError.classList.add('d-none');
        emailInput.classList.remove('is-invalid');
        passwordInput.classList.remove('is-invalid');

        const identifier = emailInput.value.trim();
        const password = passwordInput.value;

        let isValid = true;
        if (!identifier) {
            emailInput.classList.add('is-invalid');
            isValid = false;
        }

        if (!password || password.length < 4) {
            passwordInput.classList.add('is-invalid');
            isValid = false;
        }

        if (!isValid) return;

        setLoadingState(true);

        try {
            // Llamar a auth.login soportando el rol seleccionado
            const user = await window.auth.login(identifier, password, currentRole);
            
            // Redirigir según el rol del usuario
            if (user.rol === 'CLIENTE') {
                window.location.href = 'cliente-dashboard.html';
            } else {
                window.location.href = 'dashboard.html';
            }
        } catch (error) {
            showError(error.message || 'Credenciales incorrectas. Verificá tus datos.');
            setLoadingState(false);
        }
    });

    function setLoadingState(isLoading) {
        btnSubmit.disabled = isLoading;
        emailInput.disabled = isLoading;
        passwordInput.disabled = isLoading;
        if (isLoading) {
            submitText.textContent = 'Verificando...';
            submitSpinner.classList.remove('d-none');
        } else {
            submitText.textContent = currentRole === 'CLIENTE' ? 'Ingresar como Dueño' : 'Ingresar como Veterinaria';
            submitSpinner.classList.add('d-none');
        }
    }

    function showError(msg) {
        loginErrorText.textContent = msg;
        loginError.classList.remove('d-none');
        
        const card = document.querySelector('.login-card');
        if (card) {
            card.style.transform = 'translateX(-6px)';
            setTimeout(() => card.style.transform = 'translateX(6px)', 100);
            setTimeout(() => card.style.transform = 'translateX(-3px)', 200);
            setTimeout(() => card.style.transform = 'translateX(3px)', 300);
            setTimeout(() => card.style.transform = 'none', 400);
        }
    }
});
