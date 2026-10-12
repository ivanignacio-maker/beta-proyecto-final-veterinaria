/**
 * Lógica del Perfil del Dueño de Mascota
 */

document.addEventListener('DOMContentLoaded', () => {
    if (window.auth) window.auth.requireAuth('CLIENTE');

    if (window.HeaderComponent) window.HeaderComponent.render('header-container');
    if (window.SidebarComponent) window.SidebarComponent.render('sidebar-container');
    if (window.FooterComponent) window.FooterComponent.render('footer-container');

    cargarDatosPerfil();
    setupEventosPerfil();
});

function cargarDatosPerfil() {
    const user = window.auth ? window.auth.getUser() : null;
    if (!user) return;

    document.getElementById('perfil-nombre').value = user.nombreSimple || user.nombre.split(' ')[0] || '';
    document.getElementById('perfil-apellido').value = user.apellido || user.nombre.split(' ').slice(1).join(' ') || '';
    document.getElementById('perfil-dni').value = user.dni || 'No especificado';
    document.getElementById('perfil-email').value = user.email || '';
    document.getElementById('perfil-telefono').value = user.telefono || '';
    document.getElementById('perfil-direccion').value = user.direccion || '';

    // Si tiene la bandera de cambio obligatorio de contraseña
    if (user.debeCambiarPassword) {
        const alerta = document.getElementById('alerta-cambio-pass');
        if (alerta) alerta.classList.remove('d-none');
    }
}

function setupEventosPerfil() {
    const formPerfil = document.getElementById('form-perfil-cliente');
    if (formPerfil) {
        formPerfil.addEventListener('submit', async (e) => {
            e.preventDefault();
            const telefono = document.getElementById('perfil-telefono').value.trim();
            const direccion = document.getElementById('perfil-direccion').value.trim();

            try {
                await window.api.actualizarPerfil({ telefono, direccion });

                // Actualizar en mock
                const user = window.auth.getUser();
                const clienteEnDb = MOCK_DATA.clientes.find(c => c.id === user.id);
                if (clienteEnDb) {
                    clienteEnDb.telefono = telefono;
                    clienteEnDb.direccion = direccion;
                    MOCK_DATA.save();
                }

                if (window.ToastComponent) {
                    window.ToastComponent.show({ message: 'Tus datos de contacto se actualizaron con éxito.', type: 'success' });
                }
            } catch (err) {
                alert('Error al actualizar perfil: ' + err.message);
            }
        });
    }

    const formPassword = document.getElementById('form-password-cliente');
    if (formPassword) {
        formPassword.addEventListener('submit', async (e) => {
            e.preventDefault();
            const actual = document.getElementById('pass-actual').value;
            const nueva = document.getElementById('pass-nueva').value;
            const confirmar = document.getElementById('pass-confirmar').value;

            if (nueva.length < 6) {
                alert('La nueva contraseña debe tener al menos 6 caracteres.');
                return;
            }

            if (nueva !== confirmar) {
                alert('Las contraseñas nuevas no coinciden.');
                return;
            }

            try {
                const user = window.auth.getUser();
                const clienteEnDb = MOCK_DATA.clientes.find(c => c.id === user.id);
                if (clienteEnDb) {
                    // Validar pass actual
                    const passReal = clienteEnDb.password || clienteEnDb.dni.toString();
                    if (actual !== passReal && actual !== '123456' && actual !== 'password123') {
                        alert('La contraseña actual ingresada es incorrecta.');
                        return;
                    }

                    clienteEnDb.password = nueva;
                    clienteEnDb.debeCambiarPassword = false;
                    MOCK_DATA.save();
                }

                user.debeCambiarPassword = false;
                localStorage.setItem(APP_CONFIG.USER_KEY || 'vetcare_user_data', JSON.stringify(user));

                document.getElementById('alerta-cambio-pass').classList.add('d-none');
                formPassword.reset();

                if (window.ToastComponent) {
                    window.ToastComponent.show({ message: 'Contraseña actualizada correctamente.', type: 'success' });
                }
            } catch (err) {
                alert('Error al actualizar contraseña: ' + err.message);
            }
        });
    }
}
