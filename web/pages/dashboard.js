/**
 * Lógica para el Panel Principal (Dashboard)
 */

document.addEventListener('DOMContentLoaded', () => {
    // Configurar la fecha actual en el encabezado
    configurarFechaActual();
    
    // Cargar los datos del dashboard
    cargarDashboard();
});

/**
 * Formatea y muestra la fecha actual en el encabezado
 */
function configurarFechaActual() {
    const elementoFecha = document.getElementById('fecha-actual');
    if (!elementoFecha) return;
    
    const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    const fecha = new Date().toLocaleDateString('es-ES', opciones);
    
    // Capitalizar la primera letra
    elementoFecha.textContent = fecha.charAt(0).toUpperCase() + fecha.slice(1);
}

/**
 * Carga de forma asíncrona todos los datos necesarios para el dashboard
 */
async function cargarDashboard() {
    try {
        // En una aplicación real, esto se haría mediante una sola llamada al backend
        // o usando Promise.all con varias llamadas
        
        // Simular llamada a la API
        const stats = await api.dashboard.getStats();
        const turnos = await api.turnos.getHoy();
        const actividad = await api.dashboard.getActividadReciente();
        const solicitudes = await api.solicitudes.getPendientes();
        
        renderizarEstadisticas(stats);
        renderizarTurnosHoy(turnos);
        renderizarActividadReciente(actividad);
        renderizarSolicitudesPendientes(solicitudes);
        
    } catch (error) {
        console.error('Error al cargar el dashboard:', error);
        mostrarErrorDashboard();
    }
}

/**
 * Renderiza los contadores estadísticos
 * @param {Object} stats Objeto con los datos estadísticos
 */
function renderizarEstadisticas(stats) {
    document.getElementById('stat-mascotas').textContent = stats.mascotas || 47;
    document.getElementById('stat-turnos').textContent = stats.turnos || 8;
    document.getElementById('stat-consultas').textContent = stats.consultas || 12;
    document.getElementById('stat-solicitudes').textContent = stats.solicitudes || 3;
}

/**
 * Renderiza la lista de turnos de hoy
 * @param {Array} turnos Array de objetos de turno
 */
function renderizarTurnosHoy(turnos) {
    const contenedor = document.getElementById('turnos-hoy-list');
    if (!contenedor) return;
    
    if (!turnos || turnos.length === 0) {
        contenedor.innerHTML = `
            <div class="text-center py-4 text-muted">
                <i class="bi bi-calendar-x fs-1 mb-2 d-block"></i>
                <p class="mb-0">No hay turnos programados para hoy</p>
            </div>
        `;
        return;
    }
    
    // Limitar a 5 turnos para no sobrecargar el dashboard
    const turnosMostrar = turnos.slice(0, 5);
    
    let html = '<div class="list-group list-group-flush">';
    
    turnosMostrar.forEach(turno => {
        let badgeColor = 'bg-primary';
        if(turno.estado === 'Confirmado') badgeColor = 'bg-success';
        if(turno.estado === 'Cancelado') badgeColor = 'bg-danger';
        
        html += `
            <div class="list-group-item px-0 py-3 d-flex justify-content-between align-items-center">
                <div class="d-flex align-items-center gap-3">
                    <div class="fw-bold text-primary bg-light p-2 rounded">${turno.hora}</div>
                    <div>
                        <h6 class="mb-0 fw-bold">${turno.mascota.nombre}</h6>
                        <small class="text-muted d-block">${turno.propietario.nombre} • ${turno.motivo}</small>
                    </div>
                </div>
                <span class="badge ${badgeColor} rounded-pill">${turno.estado}</span>
            </div>
        `;
    });
    
    html += '</div>';
    contenedor.innerHTML = html;
}

/**
 * Renderiza la actividad reciente
 * @param {Array} actividad Array de objetos de actividad
 */
function renderizarActividadReciente(actividad) {
    const contenedor = document.getElementById('actividad-reciente-list');
    if (!contenedor) return;
    
    if (!actividad || actividad.length === 0) {
        contenedor.innerHTML = `
            <div class="text-center py-4 text-muted">
                <i class="bi bi-clock-history fs-1 mb-2 d-block"></i>
                <p class="mb-0">No hay actividad reciente registrada</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    actividad.forEach(item => {
        let icono = 'bi-record-circle';
        let colorClase = 'text-primary';
        
        if (item.tipo === 'consulta') { icono = 'bi-clipboard2-pulse'; colorClase = 'text-info'; }
        if (item.tipo === 'vacuna') { icono = 'bi-shield-plus'; colorClase = 'text-success'; }
        if (item.tipo === 'turno') { icono = 'bi-calendar-check'; colorClase = 'text-warning'; }
        if (item.tipo === 'solicitud') { icono = 'bi-shield-lock'; colorClase = 'text-secondary'; }
        
        html += `
            <li class="list-group-item px-0 py-3 d-flex align-items-start gap-3">
                <div class="mt-1 ${colorClase}">
                    <i class="bi ${icono} fs-5"></i>
                </div>
                <div>
                    <p class="mb-1">${item.descripcion}</p>
                    <small class="text-muted">${item.tiempoRelativo}</small>
                </div>
            </li>
        `;
    });
    
    contenedor.innerHTML = html;
}

/**
 * Renderiza las solicitudes pendientes en forma de tarjetas
 * @param {Array} solicitudes Array de solicitudes
 */
function renderizarSolicitudesPendientes(solicitudes) {
    const contenedor = document.getElementById('solicitudes-pendientes-list');
    if (!contenedor) return;
    
    if (!solicitudes || solicitudes.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12 text-center py-4 text-muted">
                <i class="bi bi-check-circle fs-1 mb-2 d-block"></i>
                <p class="mb-0">No hay solicitudes de acceso pendientes</p>
            </div>
        `;
        return;
    }
    
    let html = '';
    
    solicitudes.forEach(solicitud => {
        html += `
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card border border-warning shadow-sm h-100">
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h6 class="card-title fw-bold mb-0">Acceso a ${solicitud.mascota.nombre}</h6>
                            <span class="badge bg-warning text-dark">Pendiente</span>
                        </div>
                        <p class="card-text text-muted small mb-3">Propietario: ${solicitud.propietario.nombre}</p>
                        <p class="card-text small mb-3"><i class="bi bi-clock me-1"></i> Solicitado el: ${solicitud.fecha}</p>
                        <a href="solicitudes.html" class="btn btn-sm btn-outline-primary w-100">Ver solicitud</a>
                    </div>
                </div>
            </div>
        `;
    });
    
    contenedor.innerHTML = html;
}

/**
 * Muestra un mensaje de error si falla la carga inicial
 */
function mostrarErrorDashboard() {
    Toast.show('Error al cargar la información del panel', 'error');
}
