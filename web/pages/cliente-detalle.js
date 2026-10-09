/**
 * Lógica para la página de Detalle de Cliente
 */

document.addEventListener('DOMContentLoaded', () => {
    // Obtener ID de la URL
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    
    if (!id) {
        Toast.show('No se ha especificado un cliente', 'error');
        setTimeout(() => {
            window.location.href = 'clientes.html';
        }, 1500);
        return;
    }
    
    cargarDatosCliente(id);
});

/**
 * Carga los datos del cliente y sus mascotas
 * @param {string} id ID del cliente
 */
async function cargarDatosCliente(id) {
    try {
        // En una app real, esto llamaría a un endpoint que traiga el cliente
        // y otro (o el mismo) que traiga sus mascotas
        
        // Simular retardo de red
        await new Promise(resolve => setTimeout(resolve, 800));
        
        // Datos mockeados
        const cliente = {
            id: id,
            nombre: 'Juan',
            apellido: 'Pérez',
            dni: '28456123',
            email: 'juan.perez@ejemplo.com',
            telefono: '+54 9 11 1234-5678',
            direccion: 'Av. Corrientes 1234, CABA',
            fechaRegistro: '2023-05-12'
        };
        
        const mascotas = [
            {
                id: 1,
                nombre: 'Luna',
                tipo: 'Perro',
                raza: 'Golden Retriever',
                edad: '3 años',
                sexo: 'Hembra'
            },
            {
                id: 2,
                nombre: 'Milo',
                tipo: 'Gato',
                raza: 'Mestizo',
                edad: '5 años',
                sexo: 'Macho'
            }
        ];
        
        renderizarDatosCliente(cliente);
        renderizarMascotas(mascotas);
        
        // Ocultar loading y mostrar contenido
        document.getElementById('loading-container').style.display = 'none';
        document.getElementById('content-container').style.display = 'block';
        
    } catch (error) {
        console.error('Error al cargar cliente:', error);
        Toast.show('Error al cargar los datos del cliente', 'error');
        document.getElementById('loading-container').innerHTML = `
            <div class="text-danger">
                <i class="bi bi-exclamation-triangle fs-1"></i>
                <p>Error al cargar el cliente. <a href="clientes.html">Volver</a></p>
            </div>
        `;
    }
}

/**
 * Muestra los datos del cliente en la interfaz
 */
function renderizarDatosCliente(cliente) {
    const nombreCompleto = `${cliente.nombre} ${cliente.apellido}`;
    
    document.getElementById('breadcrumb-nombre').textContent = nombreCompleto;
    document.getElementById('cliente-nombre').textContent = nombreCompleto;
    document.getElementById('cliente-iniciales').textContent = `${cliente.nombre.charAt(0)}${cliente.apellido.charAt(0)}`;
    
    document.getElementById('cliente-registro').textContent = Formatters.date(cliente.fechaRegistro);
    document.getElementById('cliente-dni').textContent = Formatters.dni(cliente.dni);
    document.getElementById('cliente-email').textContent = cliente.email;
    document.getElementById('cliente-telefono').textContent = cliente.telefono;
    document.getElementById('cliente-direccion').textContent = cliente.direccion;
}

/**
 * Renderiza las tarjetas de mascotas
 */
function renderizarMascotas(mascotas) {
    document.getElementById('count-mascotas').textContent = mascotas.length;
    
    const contenedor = document.getElementById('mascotas-container');
    
    if (mascotas.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12 text-center py-5 bg-white rounded shadow-sm">
                <i class="bi bi-emoji-frown fs-1 text-muted mb-3 d-block"></i>
                <h5 class="text-muted">Este cliente aún no tiene mascotas registradas</h5>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    mascotas.forEach(mascota => {
        let iconClass = 'bi-question-circle';
        if (mascota.tipo.toLowerCase() === 'perro') iconClass = 'bi-box2-heart'; // Simulación de icono de perro
        if (mascota.tipo.toLowerCase() === 'gato') iconClass = 'bi-github'; // Simulación de icono de gato (bootstrap no tiene específicos)
        
        // Usar los que tengamos más parecidos
        if (mascota.tipo.toLowerCase() === 'perro') iconClass = 'bi-circle-fill text-primary';
        if (mascota.tipo.toLowerCase() === 'gato') iconClass = 'bi-circle-fill text-warning';
        
        html += `
            <div class="col-12 col-md-6">
                <div class="card border-0 shadow-sm h-100 cursor-pointer pet-card-hover" onclick="verMascota(${mascota.id})" style="cursor:pointer; transition: transform 0.2s;">
                    <div class="card-body">
                        <div class="d-flex align-items-center mb-3">
                            <div class="rounded-circle bg-light p-3 me-3 d-flex justify-content-center align-items-center">
                                <i class="bi ${iconClass} fs-3"></i>
                            </div>
                            <div>
                                <h5 class="card-title fw-bold mb-0">${mascota.nombre}</h5>
                                <span class="badge bg-secondary rounded-pill fw-normal mt-1">${mascota.tipo}</span>
                            </div>
                        </div>
                        
                        <div class="row g-2 mb-3">
                            <div class="col-6">
                                <small class="text-muted d-block">Raza</small>
                                <span class="fw-semibold small">${mascota.raza}</span>
                            </div>
                            <div class="col-6">
                                <small class="text-muted d-block">Edad</small>
                                <span class="fw-semibold small">${mascota.edad}</span>
                            </div>
                            <div class="col-6">
                                <small class="text-muted d-block">Sexo</small>
                                <span class="fw-semibold small">${mascota.sexo}</span>
                            </div>
                        </div>
                        
                        <button class="btn btn-outline-primary btn-sm w-100" onclick="event.stopPropagation(); verMascota(${mascota.id})">
                            Ver Historia Clínica
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    contenedor.innerHTML = html;
}

/**
 * Redirige a la página de detalle de la mascota
 */
window.verMascota = function(id) {
    window.location.href = `mascota-detalle.html?id=${id}`;
};
