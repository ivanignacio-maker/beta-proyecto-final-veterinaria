/**
 * Lógica para la página de Turnos
 */

let turnos = [];
let filtroTiempo = 'todos'; // todos, hoy, proximos, pasados
let filtroEstado = '';

document.addEventListener('DOMContentLoaded', () => {
    configurarMinimoFecha();
    inicializarEventos();
    cargarTurnos();
});

function configurarMinimoFecha() {
    const inputFecha = document.getElementById('turno-fecha');
    if (inputFecha) {
        const hoy = new Date().toISOString().split('T')[0];
        inputFecha.min = hoy;
    }
}

function inicializarEventos() {
    // Tabs de tiempo
    document.querySelectorAll('.nav-tabs .nav-link').forEach(tab => {
        tab.addEventListener('click', (e) => {
            document.querySelectorAll('.nav-tabs .nav-link').forEach(t => t.classList.remove('active'));
            e.target.classList.add('active');
            filtroTiempo = e.target.dataset.filtro;
            aplicarFiltros();
        });
    });
    
    // Filtro estado
    document.getElementById('filtro-estado').addEventListener('change', (e) => {
        filtroEstado = e.target.value;
        aplicarFiltros();
    });
    
    // Guardar turno
    document.getElementById('btn-guardar-turno').addEventListener('click', guardarTurno);
}

async function cargarTurnos() {
    try {
        await new Promise(resolve => setTimeout(resolve, 500));
        
        // Mock data
        const hoy = new Date();
        const manana = new Date(hoy);
        manana.setDate(manana.getDate() + 1);
        const ayer = new Date(hoy);
        ayer.setDate(ayer.getDate() - 1);
        
        turnos = [
            { id: 1, fecha: hoy.toISOString().split('T')[0], hora: '10:00', mascotaId: 1, mascotaNombre: 'Luna', propietarioNombre: 'Juan Pérez', motivo: 'Control', estado: 'Confirmado' },
            { id: 2, fecha: hoy.toISOString().split('T')[0], hora: '11:30', mascotaId: 2, mascotaNombre: 'Milo', propietarioNombre: 'María Gómez', motivo: 'Vacuna', estado: 'Pendiente' },
            { id: 3, fecha: manana.toISOString().split('T')[0], hora: '15:00', mascotaId: 3, mascotaNombre: 'Rocky', propietarioNombre: 'Carlos Ruiz', motivo: 'Consulta general', estado: 'Confirmado' },
            { id: 4, fecha: ayer.toISOString().split('T')[0], hora: '09:00', mascotaId: 4, mascotaNombre: 'Bella', propietarioNombre: 'Ana Torres', motivo: 'Ecografía', estado: 'Realizado' },
            { id: 5, fecha: manana.toISOString().split('T')[0], hora: '17:00', mascotaId: 5, mascotaNombre: 'Simba', propietarioNombre: 'Luis Díaz', motivo: 'Control post-cirugía', estado: 'Cancelado' }
        ];
        
        aplicarFiltros();
    } catch (error) {
        console.error('Error al cargar turnos:', error);
        Toast.show('Error al cargar turnos', 'error');
    }
}

function aplicarFiltros() {
    let turnosFiltrados = [...turnos];
    const hoyStr = new Date().toISOString().split('T')[0];
    
    if (filtroTiempo === 'hoy') {
        turnosFiltrados = turnosFiltrados.filter(t => t.fecha === hoyStr);
    } else if (filtroTiempo === 'proximos') {
        turnosFiltrados = turnosFiltrados.filter(t => t.fecha > hoyStr);
    } else if (filtroTiempo === 'pasados') {
        turnosFiltrados = turnosFiltrados.filter(t => t.fecha < hoyStr);
    }
    
    if (filtroEstado !== '') {
        turnosFiltrados = turnosFiltrados.filter(t => t.estado === filtroEstado);
    }
    
    // Ordenar por fecha y hora
    turnosFiltrados.sort((a, b) => {
        const datetimeA = new Date(`${a.fecha}T${a.hora}`);
        const datetimeB = new Date(`${b.fecha}T${b.hora}`);
        return datetimeA - datetimeB;
    });
    
    renderizarTurnos(turnosFiltrados);
}

function renderizarTurnos(turnosFiltrados) {
    const tbody = document.getElementById('turnos-tbody');
    
    if (turnosFiltrados.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="text-center py-4 text-muted">No se encontraron turnos</td></tr>';
        return;
    }
    
    let html = '';
    turnosFiltrados.forEach(turno => {
        let badgeColor = 'bg-secondary';
        if (turno.estado === 'Pendiente') badgeColor = 'bg-warning text-dark';
        if (turno.estado === 'Confirmado') badgeColor = 'bg-primary';
        if (turno.estado === 'Realizado') badgeColor = 'bg-success';
        if (turno.estado === 'Cancelado') badgeColor = 'bg-danger';
        
        let botonesAcciones = '';
        if (turno.estado === 'Pendiente') {
            botonesAcciones = `
                <button class="btn btn-sm btn-outline-success" onclick="cambiarEstado(${turno.id}, 'Confirmado')" title="Confirmar"><i class="bi bi-check-lg"></i></button>
                <button class="btn btn-sm btn-outline-danger" onclick="cambiarEstado(${turno.id}, 'Cancelado')" title="Cancelar"><i class="bi bi-x-lg"></i></button>
            `;
        } else if (turno.estado === 'Confirmado') {
            botonesAcciones = `
                <button class="btn btn-sm btn-outline-success" onclick="cambiarEstado(${turno.id}, 'Realizado')" title="Marcar Realizado"><i class="bi bi-check2-all"></i></button>
                <button class="btn btn-sm btn-outline-danger" onclick="cambiarEstado(${turno.id}, 'Cancelado')" title="Cancelar"><i class="bi bi-x-lg"></i></button>
            `;
        }
        
        html += `
            <tr>
                <td class="ps-4 fw-medium text-nowrap">${Formatters.date(turno.fecha)} <br> <span class="text-primary">${turno.hora}</span></td>
                <td>
                    <a href="mascota-detalle.html?id=${turno.mascotaId}" class="text-decoration-none fw-bold">${turno.mascotaNombre}</a>
                </td>
                <td class="text-muted small">${turno.propietarioNombre}</td>
                <td>${turno.motivo}</td>
                <td><span class="badge ${badgeColor}">${turno.estado}</span></td>
                <td class="text-end pe-4">
                    <div class="btn-group">
                        ${botonesAcciones}
                        <button class="btn btn-sm btn-outline-secondary" onclick="window.location.href='mascota-detalle.html?id=${turno.mascotaId}'" title="Ver mascota"><i class="bi bi-eye"></i></button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
}

window.cambiarEstado = function(id, nuevoEstado) {
    if(confirm(`¿Estás seguro de cambiar el estado a ${nuevoEstado}?`)) {
        const turno = turnos.find(t => t.id === id);
        if (turno) {
            turno.estado = nuevoEstado;
            aplicarFiltros();
            Toast.show(`Turno ${nuevoEstado.toLowerCase()}`, 'success');
        }
    }
};

function guardarTurno() {
    const mascota = document.getElementById('turno-mascota').value;
    const fecha = document.getElementById('turno-fecha').value;
    const hora = document.getElementById('turno-hora').value;
    const motivo = document.getElementById('turno-motivo').value;
    
    if (!mascota || !fecha || !hora || !motivo) {
        alert('Por favor complete los campos obligatorios');
        return;
    }
    
    const nuevoTurno = {
        id: Date.now(),
        fecha: fecha,
        hora: hora,
        mascotaId: 1, // Mock
        mascotaNombre: 'Luna', // Mock
        propietarioNombre: 'Juan Pérez',
        motivo: motivo,
        estado: 'Pendiente'
    };
    
    turnos.push(nuevoTurno);
    
    const modal = bootstrap.Modal.getInstance(document.getElementById('modal-turno'));
    modal.hide();
    
    document.getElementById('form-turno').reset();
    Toast.show('Turno creado exitosamente', 'success');
    
    aplicarFiltros();
}
