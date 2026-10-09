/**
 * Lógica para la página de Solicitudes
 */

let solicitudes = [];
let filtroActual = 'Pendiente';

document.addEventListener('DOMContentLoaded', () => {
    inicializarEventos();
    cargarSolicitudes();
});

function inicializarEventos() {
    // Tabs de filtrado
    document.querySelectorAll('#solicitudesTabs .nav-link').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('#solicitudesTabs .nav-link').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            filtroActual = e.target.dataset.filtro;
            aplicarFiltro();
        });
    });
    
    // Modal búsqueda
    document.getElementById('btn-buscar-cliente').addEventListener('click', buscarClienteModal);
    document.getElementById('btn-enviar-solicitud').addEventListener('click', enviarSolicitud);
}

async function cargarSolicitudes() {
    try {
        await new Promise(resolve => setTimeout(resolve, 600));
        
        solicitudes = [
            { id: 1, mascotaNombre: 'Luna', mascotaTipo: 'Perro', propietarioNombre: 'Juan Pérez', propietarioDni: '12345678', fecha: '2023-10-06T10:00:00Z', estado: 'Pendiente' },
            { id: 2, mascotaNombre: 'Milo', mascotaTipo: 'Gato', propietarioNombre: 'Ana Torres', propietarioDni: '87654321', fecha: '2023-10-05T14:30:00Z', estado: 'Aprobada' },
            { id: 3, mascotaNombre: 'Rocky', mascotaTipo: 'Perro', propietarioNombre: 'Carlos Ruiz', propietarioDni: '11223344', fecha: '2023-10-01T09:15:00Z', estado: 'Rechazada' },
            { id: 4, mascotaNombre: 'Bella', mascotaTipo: 'Perro', propietarioNombre: 'María Gómez', propietarioDni: '55667788', fecha: '2023-10-07T08:00:00Z', estado: 'Pendiente' }
        ];
        
        aplicarFiltro();
    } catch (error) {
        console.error('Error al cargar solicitudes:', error);
        Toast.show('Error al cargar solicitudes', 'error');
    }
}

function aplicarFiltro() {
    let filtradas = solicitudes;
    if (filtroActual !== 'Todas') {
        filtradas = solicitudes.filter(s => s.estado === filtroActual);
    }
    
    // Ordenar por fecha desc
    filtradas.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
    renderizarSolicitudes(filtradas);
}

function renderizarSolicitudes(filtradas) {
    const container = document.getElementById('solicitudes-container');
    
    if (filtradas.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-shield-x fs-1 text-muted mb-3 d-block"></i>
                <h5 class="text-muted">No hay solicitudes ${filtroActual.toLowerCase()}s</h5>
            </div>
        `;
        return;
    }
    
    let html = '';
    filtradas.forEach(sol => {
        let badgeColor = 'bg-secondary';
        let iconClass = 'bi-shield';
        let actionBtn = '';
        
        if (sol.estado === 'Pendiente') {
            badgeColor = 'bg-warning text-dark';
            iconClass = 'bi-shield-exclamation';
            actionBtn = `<button class="btn btn-outline-danger btn-sm w-100" onclick="cancelarSolicitud(${sol.id})">Cancelar Solicitud</button>`;
        } else if (sol.estado === 'Aprobada') {
            badgeColor = 'bg-success';
            iconClass = 'bi-shield-check';
            actionBtn = `<button class="btn btn-primary btn-sm w-100" onclick="window.location.href='mascota-detalle.html?id=1'">Ver Historia Clínica</button>`;
        } else if (sol.estado === 'Rechazada' || sol.estado === 'Revocada') {
            badgeColor = 'bg-danger';
            iconClass = 'bi-shield-x';
        }
        
        html += `
            <div class="col-12 col-md-6 col-lg-4">
                <div class="card border-0 shadow-sm h-100">
                    <div class="card-header bg-white border-0 pt-3 pb-0 d-flex justify-content-between align-items-center">
                        <span class="badge ${badgeColor}">${sol.estado}</span>
                        <small class="text-muted">${Formatters.date(sol.fecha)}</small>
                    </div>
                    <div class="card-body text-center pt-2">
                        <div class="rounded-circle bg-light text-primary d-inline-flex justify-content-center align-items-center mb-3" style="width: 60px; height: 60px;">
                            <i class="bi ${iconClass} fs-3"></i>
                        </div>
                        <h5 class="fw-bold mb-0">Acceso a ${sol.mascotaNombre}</h5>
                        <p class="text-muted small mb-3">Mascota: ${sol.mascotaTipo}</p>
                        
                        <div class="text-start bg-light p-3 rounded mb-3">
                            <small class="text-muted d-block mb-1">Propietario</small>
                            <span class="fw-medium d-block">${sol.propietarioNombre}</span>
                            <small class="text-muted">DNI: ${sol.propietarioDni}</small>
                        </div>
                        
                        ${actionBtn}
                    </div>
                </div>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

window.cancelarSolicitud = function(id) {
    if (confirm('¿Está seguro de cancelar esta solicitud?')) {
        const sol = solicitudes.find(s => s.id === id);
        if (sol) {
            sol.estado = 'Rechazada'; // Usamos Rechazada/Cancelada
            aplicarFiltro();
            Toast.show('Solicitud cancelada', 'success');
        }
    }
}

function buscarClienteModal() {
    const dni = document.getElementById('buscar-dni').value.trim();
    if (!dni) return;
    
    document.getElementById('btn-buscar-cliente').disabled = true;
    document.getElementById('btn-buscar-cliente').innerHTML = '<span class="spinner-border spinner-border-sm"></span>';
    
    setTimeout(() => {
        document.getElementById('btn-buscar-cliente').disabled = false;
        document.getElementById('btn-buscar-cliente').textContent = 'Buscar';
        
        if (dni === '12345678') { // Mock success
            document.getElementById('res-nombre').textContent = 'Juan Pérez';
            
            const select = document.getElementById('select-mascota-solicitud');
            select.innerHTML = `
                <option value="1">Luna (Perro)</option>
                <option value="2">Milo (Gato)</option>
            `;
            
            document.getElementById('resultado-error').style.display = 'none';
            document.getElementById('resultado-busqueda').style.display = 'block';
            document.getElementById('btn-enviar-solicitud').disabled = false;
        } else { // Mock error
            document.getElementById('resultado-busqueda').style.display = 'none';
            document.getElementById('resultado-error').style.display = 'block';
            document.getElementById('btn-enviar-solicitud').disabled = true;
        }
    }, 800);
}

function enviarSolicitud() {
    const mascotaSelect = document.getElementById('select-mascota-solicitud');
    const mascotaNombre = mascotaSelect.options[mascotaSelect.selectedIndex].text;
    
    const nueva = {
        id: Date.now(),
        mascotaNombre: mascotaNombre.split(' (')[0],
        mascotaTipo: mascotaNombre.includes('Perro') ? 'Perro' : 'Gato',
        propietarioNombre: document.getElementById('res-nombre').textContent,
        propietarioDni: document.getElementById('buscar-dni').value,
        fecha: new Date().toISOString(),
        estado: 'Pendiente'
    };
    
    solicitudes.unshift(nueva);
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('modal-solicitud'));
    modal.hide();
    
    Toast.show('Solicitud de acceso enviada', 'success');
    
    // Reset modal
    document.getElementById('buscar-dni').value = '';
    document.getElementById('resultado-busqueda').style.display = 'none';
    document.getElementById('resultado-error').style.display = 'none';
    document.getElementById('btn-enviar-solicitud').disabled = true;
    
    filtroActual = 'Pendiente';
    document.querySelectorAll('#solicitudesTabs .nav-link').forEach(t => t.classList.remove('active'));
    document.querySelector('#solicitudesTabs .nav-link[data-filtro="Pendiente"]').classList.add('active');
    
    aplicarFiltro();
}
