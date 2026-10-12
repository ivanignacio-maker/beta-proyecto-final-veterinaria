/**
 * Lógica para el Registro de Clientes (Dueños de Mascotas)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Si ya está autenticado
    if (window.auth && window.auth.isAuthenticated()) {
        const u = window.auth.getUser();
        if (u && u.rol === 'CLIENTE') {
            window.location.href = 'cliente-dashboard.html';
        } else {
            window.location.href = 'dashboard.html';
        }
        return;
    }

    const form = document.getElementById('register-form');
    const inputNombre = document.getElementById('reg-nombre');
    const inputApellido = document.getElementById('reg-apellido');
    const inputDni = document.getElementById('reg-dni');
    const inputEmail = document.getElementById('reg-email');
    const inputTelefono = document.getElementById('reg-telefono');
    const inputDireccion = document.getElementById('reg-direccion');
    const inputPassword = document.getElementById('reg-password');
    const togglePasswordBtn = document.getElementById('toggle-password');
    const registerError = document.getElementById('register-error');
    const registerErrorText = document.getElementById('register-error-text');
    const btnSubmit = document.getElementById('btn-submit');
    const submitText = document.getElementById('submit-text');
    const submitSpinner = document.getElementById('submit-spinner');

    // Toggle visibilidad de contraseña
    if (togglePasswordBtn) {
        togglePasswordBtn.addEventListener('click', () => {
            const type = inputPassword.getAttribute('type') === 'password' ? 'text' : 'password';
            inputPassword.setAttribute('type', type);
            const icon = togglePasswordBtn.querySelector('i');
            if (type === 'text') {
                icon.classList.replace('bi-eye', 'bi-eye-slash');
            } else {
                icon.classList.replace('bi-eye-slash', 'bi-eye');
            }
        });
    }

    // Submit del formulario
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        registerError.classList.add('d-none');
        [inputNombre, inputApellido, inputDni, inputEmail, inputPassword].forEach(el => el.classList.remove('is-invalid'));

        const nombre = inputNombre.value.trim();
        const apellido = inputApellido.value.trim();
        const dni = inputDni.value.trim().replace(/\D/g, ''); // Solo números
        const email = inputEmail.value.trim();
        const telefono = inputTelefono.value.trim();
        const direccion = inputDireccion.value.trim();
        const password = inputPassword.value;

        let isValid = true;

        if (!nombre) {
            inputNombre.classList.add('is-invalid');
            isValid = false;
        }

        if (!apellido) {
            inputApellido.classList.add('is-invalid');
            isValid = false;
        }

        if (!dni || dni.length < 7 || dni.length > 9) {
            inputDni.classList.add('is-invalid');
            isValid = false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            inputEmail.classList.add('is-invalid');
            isValid = false;
        }

        if (password && password.length < 6) {
            inputPassword.classList.add('is-invalid');
            isValid = false;
        }

        if (!isValid) return;

        setLoading(true);

        try {
            const datosCliente = {
                nombre,
                apellido,
                dni,
                email,
                telefono,
                direccion,
                password: password || dni // Si no define, se usa DNI como password inicial
            };

            await window.auth.registerCliente(datosCliente);

            // Registro exitoso, redirigir al panel del cliente
            window.location.href = 'cliente-dashboard.html';
        } catch (error) {
            showError(error.message || 'Error al procesar el registro.');
            setLoading(false);
        }
    });

    function setLoading(isLoading) {
        btnSubmit.disabled = isLoading;
        if (isLoading) {
            submitText.textContent = 'Creando cuenta...';
            submitSpinner.classList.remove('d-none');
        } else {
            submitText.innerHTML = '<i class="bi bi-check-circle me-1"></i>Registrarme y acceder';
            submitSpinner.classList.add('d-none');
        }
    }

    function showError(msg) {
        registerErrorText.textContent = msg;
        registerError.classList.remove('d-none');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
});
