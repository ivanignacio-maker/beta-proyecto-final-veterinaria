/**
 * Lógica para la página de Detalle de Mascota
 */

let mascotaId = null;
let timelineData = [];

document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    mascotaId = urlParams.get('id');
    
    if (!mascotaId) {
        Toast.show('No se ha especificado una mascota', 'error');
        setTimeout(() => window.location.href = 'mascotas.html', 1500);
        return;
    }
    
    establecerFechasDefault();
    inicializarEventos();
    cargarDatosMascota();
});

function establecerFechasDefault() {
    const hoy = new Date().toISOString().split('T')[0];
    document.getElementById('consulta-fecha').value = hoy;
    document.getElementById('vacuna-fecha').value = hoy;
    document.getElementById('estudio-fecha').value = hoy;
}

function inicializarEventos() {
    document.getElementById('btn-guardar-consulta').addEventListener('click', registrarConsulta);
    document.getElementById('btn-guardar-vacuna').addEventListener('click', registrarVacuna);
    document.getElementById('btn-guardar-estudio').addEventListener('click', registrarEstudio);
}

async function cargarDatosMascota() {
    try {
        await new Promise(resolve => setTimeout(resolve, 800)); // Mock delay
        
        // Datos mock
        const mascota = {
            id: mascotaId,
            nombre: 'Luna',
            tipo: 'Perro',
            raza: 'Golden Retriever',
            edad: '3 años',
            sexo: 'Hembra',
            peso: '25 kg',
            color: 'Dorado',
            microchip: '981020000123456',
            propietarioId: 1,
            propietarioNombre: 'Juan Pérez',
            estado: 'Activo'
        };
        
        timelineData = [
            {
                id: 1,
                tipo: 'consulta',
                fecha: '2023-10-01T10:30:00Z',
                titulo: 'Control Anual',
                descripcion: 'Revisión general en buen estado. Se recomienda limpieza dental.',
                veterinario: 'Dra. Ana López',
                veterinaria: 'Clínica Veterinaria Central'
            },
            {
                id: 2,
                tipo: 'vacuna',
                fecha: '2023-10-01T10:45:00Z',
                titulo: 'Sextuple',
                descripcion: 'Refuerzo anual aplicado.',
                laboratorio: 'Zoetis',
                veterinario: 'Dra. Ana López',
                veterinaria: 'Clínica Veterinaria Central'
            }
        ];
        
        const turnos = [
            { id: 1, fecha: '2023-11-15', hora: '16:00', motivo: 'Limpieza dental', profesional: 'Dra. Ana López', estado: 'Pendiente' }
        ];
        
        const accesos = [
            { id: 1, nombre: 'Clínica Veterinaria Central', estado: 'Aprobado', fecha: '2023-01-10' }
        ];
        
        renderizarEncabezado(mascota);
        renderizarTimeline();
        renderizarTurnos(turnos);
        renderizarAccesos(accesos);
        
        document.getElementById('loading-container').style.display = 'none';
        document.getElementById('content-container').style.display = 'block';
        
    } catch (error) {
        console.error('Error al cargar datos:', error);
        Toast.show('Error al cargar la mascota', 'error');
    }
}

function renderizarEncabezado(mascota) {
    document.getElementById('breadcrumb-nombre').textContent = mascota.nombre;
    document.getElementById('mascota-nombre').textContent = mascota.nombre;
    
    const propLink = document.getElementById('mascota-propietario-link');
    propLink.textContent = mascota.propietarioNombre;
    propLink.href = `cliente-detalle.html?id=${mascota.propietarioId}`;
    
    document.getElementById('mascota-raza').textContent = `${mascota.tipo} / ${mascota.raza}`;
    document.getElementById('mascota-edad').textContent = `${mascota.edad} / ${mascota.sexo}`;
    document.getElementById('mascota-peso-color').textContent = `${mascota.peso} / ${mascota.color}`;
    document.getElementById('mascota-microchip').textContent = mascota.microchip || 'No registra';
}

function renderizarTimeline() {
    const container = document.getElementById('timeline-container');
    
    if (timelineData.length === 0) {
        container.innerHTML = '<div class="text-center p-4 text-muted">No hay registros en la historia clínica.</div>';
        return;
    }
    
    let html = '<div class="timeline" style="border-left: 2px solid #e9ecef; margin-left: 20px; padding-left: 20px;">';
    
    timelineData.forEach(item => {
        let bg = 'bg-primary';
        let icon = 'bi-file-medical';
        
        if (item.tipo === 'consulta') { bg = 'bg-primary'; icon = 'bi-clipboard-pulse'; }
        if (item.tipo === 'vacuna') { bg = 'bg-success'; icon = 'bi-shield-plus'; }
        if (item.tipo === 'estudio') { bg = 'bg-info'; icon = 'bi-file-earmark-medical'; }
        
        const fechaFormat = new Date(item.fecha).toLocaleDateString();
        
        html += `
            <div class="timeline-item position-relative mb-4">
                <div class="timeline-icon position-absolute ${bg} text-white rounded-circle d-flex justify-content-center align-items-center" style="width: 40px; height: 40px; left: -40px; top: 0;">
                    <i class="bi ${icon}"></i>
                </div>
                <div class="card border border-light shadow-sm">
                    <div class="card-header bg-light d-flex justify-content-between">
                        <h6 class="mb-0 fw-bold">${item.titulo}</h6>
                        <small class="text-muted">${fechaFormat}</small>
                    </div>
                    <div class="card-body">
                        <p class="mb-2">${item.descripcion}</p>
                        <hr class="my-2">
                        <small class="text-muted"><i class="bi bi-person me-1"></i> ${item.veterinario} - ${item.veterinaria}</small>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    container.innerHTML = html;
}

function renderizarTurnos(turnos) {
    const tbody = document.getElementById('turnos-tbody');
    if (turnos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" class="text-center text-muted">No hay turnos registrados</td></tr>';
        return;
    }
    
    let html = '';
    turnos.forEach(turno => {
        let badge = 'bg-warning text-dark';
        if (turno.estado === 'Confirmado') badge = 'bg-primary';
        if (turno.estado === 'Realizado') badge = 'bg-success';
        
        html += `
            <tr>
                <td class="ps-3">${Formatters.date(turno.fecha)} ${turno.hora}</td>
                <td>${turno.motivo}</td>
                <td>${turno.profesional}</td>
                <td><span class="badge ${badge}">${turno.estado}</span></td>
            </tr>
        `;
    });
    tbody.innerHTML = html;
}

function renderizarAccesos(accesos) {
    const container = document.getElementById('accesos-container');
    if (accesos.length === 0) {
        container.innerHTML = '<div class="col-12 text-muted">No hay accesos registrados</div>';
        return;
    }
    
    let html = '';
    accesos.forEach(acceso => {
        html += `
            <div class="col-12 col-md-6">
                <div class="card border-0 shadow-sm border-start border-4 border-success">
                    <div class="card-body">
                        <h6 class="fw-bold">${acceso.nombre}</h6>
                        <p class="mb-1 text-muted small">Estado: <span class="text-success">${acceso.estado}</span></p>
                        <p class="mb-0 text-muted small">Desde: ${Formatters.date(acceso.fecha)}</p>
                    </div>
                </div>
            </div>
        `;
    });
    container.innerHTML = html;
}

// Funciones para guardar eventos
function registrarConsulta() {
    const desc = document.getElementById('consulta-descripcion').value;
    if (!desc) return alert('La descripción es obligatoria');
    
    // Simular guardado
    const modal = bootstrap.Modal.getInstance(document.getElementById('modal-consulta'));
    modal.hide();
    Toast.show('Consulta registrada exitosamente', 'success');
    
    // Añadir a timeline local
    timelineData.unshift({
        id: Date.now(),
        tipo: 'consulta',
        fecha: document.getElementById('consulta-fecha').value,
        titulo: 'Consulta Médica',
        descripcion: desc,
        veterinario: 'Dr. Actual',
        veterinaria: 'Mi Veterinaria'
    });
    renderizarTimeline();
    document.getElementById('form-consulta').reset();
    establecerFechasDefault();
}

function registrarVacuna() {
    const nombre = document.getElementById('vacuna-nombre').value;
    if (!nombre) return alert('El nombre de la vacuna es obligatorio');
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('modal-vacuna'));
    modal.hide();
    Toast.show('Vacuna registrada exitosamente', 'success');
    
    timelineData.unshift({
        id: Date.now(),
        tipo: 'vacuna',
        fecha: document.getElementById('vacuna-fecha').value,
        titulo: `Vacuna: ${nombre}`,
        descripcion: `Lote: ${document.getElementById('vacuna-lote').value || 'N/A'}`,
        veterinario: 'Dr. Actual',
        veterinaria: 'Mi Veterinaria'
    });
    renderizarTimeline();
    document.getElementById('form-vacuna').reset();
    establecerFechasDefault();
}

function registrarEstudio() {
    const tipo = document.getElementById('estudio-tipo').value;
    const desc = document.getElementById('estudio-descripcion').value;
    if (!tipo || !desc) return alert('Tipo y descripción son obligatorios');
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('modal-estudio'));
    modal.hide();
    Toast.show('Estudio registrado exitosamente', 'success');
    
    timelineData.unshift({
        id: Date.now(),
        tipo: 'estudio',
        fecha: document.getElementById('estudio-fecha').value,
        titulo: `Estudio: ${tipo}`,
        descripcion: desc,
        veterinario: 'Dr. Actual',
        veterinaria: 'Mi Veterinaria'
    });
    renderizarTimeline();
    document.getElementById('form-estudio').reset();
    establecerFechasDefault();
}
