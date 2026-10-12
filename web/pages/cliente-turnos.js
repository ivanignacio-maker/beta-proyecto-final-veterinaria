/**
 * Lógica para la Gestión de Turnos del Cliente
 */

let misTurnos = [];
let misMascotas = [];
let listaVeterinarias = [];

document.addEventListener('DOMContentLoaded', async () => {
    if (window.auth) window.auth.requireAuth('CLIENTE');

    if (window.HeaderComponent) window.HeaderComponent.render('header-container');
    if (window.SidebarComponent) window.SidebarComponent.render('sidebar-container');
    if (window.FooterComponent) window.FooterComponent.render('footer-container');

    await inicializarDatos();
    setupEventos();
});

async function inicializarDatos() {
    try {
        const [turnosRes, mascotasRes, vetRes] = await Promise.all([
            window.api.getMisTurnos(),
            window.api.getMisMascotas(),
            window.api.getVeterinariasDisponibles()
        ]);

        misTurnos = turnosRes.data || [];
        misMascotas = mascotasRes.data || [];
        listaVeterinarias = vetRes.data || [];

        // Ordenar turnos por fecha descendente
        misTurnos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));

        renderTablaTurnos(misTurnos);
        llenarSelectsModal();

        // Si viene con param ?mascotaId=X en la URL, preseleccionar y abrir modal
        const paramMascotaId = new URLSearchParams(window.location.search).get('mascotaId');
        if (paramMascotaId) {
            const select = document.getElementById('turno-mascota');
            if (select) select.value = paramMascotaId;
            abrirModalTurno();
        }

    } catch (err) {
        console.error('Error inicializando turnos:', err);
    }
}

function renderTablaTurnos(lista) {
    const tbody = document.getElementById('turnos-tbody');
    if (!tbody) return;

    if (lista.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-5 text-muted">
                    <i class="bi bi-calendar-x display-6 d-block mb-2 opacity-50"></i>
                    No se encontraron turnos con los filtros seleccionados.
                </td>
            </tr>
        `;
        return;
    }

    let html = '';
    lista.forEach(t => {
        let badgeClass = 'bg-secondary';
        if (t.estado === 'confirmado') badgeClass = 'bg-success';
        else if (t.estado === 'pendiente') badgeClass = 'bg-warning text-dark';
        else if (t.estado === 'cancelado') badgeClass = 'bg-danger';
        else if (t.estado === 'realizado') badgeClass = 'bg-info text-dark';

        const puedeCancelar = (t.estado === 'pendiente' || t.estado === 'confirmado');

        html += `
            <tr>
                <td class="ps-4">
                    <div class="fw-bold text-dark">${t.fecha}</div>
                    <small class="text-muted"><i class="bi bi-clock me-1"></i>${t.hora} hs</small>
                </td>
                <td>
                    <span class="fw-semibold text-dark">${t.mascotaNombre}</span>
                </td>
                <td>
                    <span class="d-block text-dark">${t.clinica || 'Veterinaria San Bernardo'}</span>
                    <small class="text-muted">${t.profesional || 'Profesional de guardia'}</small>
                </td>
                <td>
                    <span class="text-dark small d-inline-block text-truncate" style="max-width: 250px;">${t.motivo}</span>
                </td>
                <td>
                    <span class="badge ${badgeClass} text-uppercase px-2 py-1" style="font-size: 0.72rem;">${t.estado}</span>
                </td>
                <td class="text-end pe-4">
                    ${puedeCancelar ? `
                        <button class="btn btn-sm btn-outline-danger" onclick="cancelarTurno(${t.id})" title="Cancelar este turno">
                            <i class="bi bi-x-circle me-1"></i>Cancelar
                        </button>
                    ` : `
                        <span class="text-muted small">&mdash;</span>
                    `}
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

function llenarSelectsModal() {
    const selectMascota = document.getElementById('turno-mascota');
    const selectVet = document.getElementById('turno-veterinaria');

    if (selectMascota) {
        selectMascota.innerHTML = '<option value="" disabled selected>Seleccioná una de tus mascotas...</option>';
        misMascotas.forEach(m => {
            selectMascota.innerHTML += `<option value="${m.id}">${m.nombre} (${m.tipo})</option>`;
        });
    }

    if (selectVet) {
        selectVet.innerHTML = '<option value="" disabled selected>Seleccioná la clínica veterinaria...</option>';
        listaVeterinarias.forEach(v => {
            selectVet.innerHTML += `<option value="${v.nombre}">${v.nombre} - ${v.especialidad}</option>`;
        });
    }

    // Default fecha mínima: hoy
    const fechaInput = document.getElementById('turno-fecha');
    if (fechaInput) {
        const hoy = new Date().toISOString().split('T')[0];
        fechaInput.min = hoy;
        fechaInput.value = hoy;
    }
}

function setupEventos() {
    // Filtros por estado
    const filterBtns = document.querySelectorAll('.filter-turno-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => {
                b.classList.remove('btn-primary', 'active');
                b.classList.add('btn-light', 'border');
            });
            btn.classList.remove('btn-light', 'border');
            btn.classList.add('btn-primary', 'active');

            const filter = btn.dataset.filter;
            if (filter === 'todos') {
                renderTablaTurnos(misTurnos);
            } else {
                renderTablaTurnos(misTurnos.filter(t => t.estado === filter));
            }
        });
    });

    // Abrir modal
    const btnPedir = document.getElementById('btn-pedir-turno');
    if (btnPedir) btnPedir.addEventListener('click', abrirModalTurno);

    // Enviar solicitud de turno
    const form = document.getElementById('form-solicitar-turno');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const mascotaId = document.getElementById('turno-mascota').value;
            const clinica = document.getElementById('turno-veterinaria').value;
            const fecha = document.getElementById('turno-fecha').value;
            const hora = document.getElementById('turno-hora').value;
            const motivo = document.getElementById('turno-motivo').value.trim();

            if (!mascotaId || !clinica || !fecha || !motivo) {
                alert('Por favor completá todos los campos requeridos.');
                return;
            }

            const m = misMascotas.find(item => item.id === parseInt(mascotaId));

            try {
                await window.api.crearTurno({
                    mascotaId,
                    mascotaNombre: m ? m.nombre : 'Mascota',
                    clinica,
                    fecha,
                    hora,
                    motivo,
                    estado: 'pendiente'
                });

                const modal = bootstrap.Modal.getInstance(document.getElementById('modalSolicitarTurno'));
                if (modal) modal.hide();
                form.reset();

                if (window.ToastComponent) {
                    window.ToastComponent.show({ 
                        message: '¡Turno solicitado exitosamente! Quedó con estado Pendiente a confirmación.', 
                        type: 'success' 
                    });
                }

                await inicializarDatos();
            } catch (err) {
                alert('Error al solicitar turno: ' + err.message);
            }
        });
    }
}

function abrirModalTurno() {
    const modal = new bootstrap.Modal(document.getElementById('modalSolicitarTurno'));
    modal.show();
}

async function cancelarTurno(id) {
    if (!confirm('¿Deseas cancelar este turno?')) return;
    try {
        await window.api.cancelarTurnoCliente(id);
        if (window.ToastComponent) {
            window.ToastComponent.show({ message: 'El turno ha sido cancelado.', type: 'warning' });
        }
        await inicializarDatos();
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

window.abrirModalTurno = abrirModalTurno;
window.cancelarTurno = cancelarTurno;
