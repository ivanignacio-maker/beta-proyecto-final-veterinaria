/**
 * Lógica para la página de Perfil
 */

document.addEventListener('DOMContentLoaded', () => {
    cargarDatosPerfil();
    inicializarEventos();
});

function inicializarEventos() {
    // Submit del form de perfil
    document.getElementById('perfil-form').addEventListener('submit', (e) => {
        e.preventDefault();
        guardarPerfil();
    });
    
    // Botón cancelar del perfil
    document.getElementById('btn-cancelar').addEventListener('click', () => {
        cargarDatosPerfil(); // Restaurar valores
    });
    
    // Botón guardar password
    document.getElementById('btn-guardar-password').addEventListener('click', cambiarPassword);
}

function cargarDatosPerfil() {
    // Mock data del usuario logueado (vet)
    const datos = {
        nombre: 'Veterinaria Central',
        email: 'contacto@vetcentral.com',
        telefono: '+54 11 1234-5678',
        direccion: 'Av. Corrientes 1234, CABA',
        matricula: 'MP 12345'
    };
    
    // Formulario
    document.getElementById('perfil-nombre').value = datos.nombre;
    document.getElementById('perfil-email').value = datos.email;
    document.getElementById('perfil-telefono').value = datos.telefono;
    document.getElementById('perfil-direccion').value = datos.direccion;
    document.getElementById('perfil-matricula').value = datos.matricula;
    
    actualizarDisplay(datos);
}

function actualizarDisplay(datos) {
    document.getElementById('perfil-nombre-display').textContent = datos.nombre;
    document.getElementById('perfil-email-display').textContent = datos.email;
    document.getElementById('perfil-tel-display').textContent = datos.telefono;
    document.getElementById('perfil-dir-display').textContent = datos.direccion;
    
    // Actualizar avatar (iniciales)
    const palabras = datos.nombre.split(' ');
    let iniciales = palabras[0].charAt(0);
    if (palabras.length > 1) iniciales += palabras[1].charAt(0);
    document.getElementById('perfil-avatar').textContent = iniciales.toUpperCase();
    
    // Actualizar header (en caso de que use config/auth)
    const headerName = document.querySelector('.user-name');
    if (headerName) headerName.textContent = datos.nombre;
}

function guardarPerfil() {
    const btn = document.getElementById('btn-guardar');
    btn.disabled = true;
    btn.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Guardando...';
    
    setTimeout(() => {
        const datos = {
            nombre: document.getElementById('perfil-nombre').value,
            email: document.getElementById('perfil-email').value,
            telefono: document.getElementById('perfil-telefono').value,
            direccion: document.getElementById('perfil-direccion').value,
            matricula: document.getElementById('perfil-matricula').value
        };
        
        actualizarDisplay(datos);
        Toast.show('Perfil actualizado correctamente', 'success');
        
        btn.disabled = false;
        btn.textContent = 'Guardar cambios';
    }, 800);
}

function cambiarPassword() {
    const actual = document.getElementById('pwd-actual').value;
    const nueva = document.getElementById('pwd-nueva').value;
    const conf = document.getElementById('pwd-confirmar').value;
    
    if (!actual || !nueva || !conf) {
        alert('Complete todos los campos de contraseña');
        return;
    }
    
    if (nueva.length < 8) {
        alert('La nueva contraseña debe tener al menos 8 caracteres');
        return;
    }
    
    if (nueva !== conf) {
        alert('Las contraseñas nuevas no coinciden');
        return;
    }
    
    // Simular éxito
    const modal = bootstrap.Modal.getInstance(document.getElementById('modal-password'));
    modal.hide();
    
    document.getElementById('form-password').reset();
    Toast.show('Contraseña actualizada con éxito', 'success');
}
