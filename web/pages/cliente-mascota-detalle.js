/**
 * Lógica para el Detalle de Mascota e Historia Clínica del Cliente
 */

let mascotaActual = null;
let eventosHistoria = [];

document.addEventListener('DOMContentLoaded', async () => {
    if (window.auth) window.auth.requireAuth('CLIENTE');

    if (window.HeaderComponent) window.HeaderComponent.render('header-container');
    if (window.SidebarComponent) window.SidebarComponent.render('sidebar-container');
    if (window.FooterComponent) window.FooterComponent.render('footer-container');

    const mascotaId = window.utils ? window.utils.getUrlParam('id') : new URLSearchParams(window.location.search).get('id');
    if (!mascotaId) {
        window.location.href = 'cliente-mascotas.html';
        return;
    }

    await cargarDatosMascota(mascotaId);
    setupFiltrosYModales();
});

async function cargarDatosMascota(id) {
    try {
        const [petRes, histRes, turnosRes, solicitudesRes, codigosRes] = await Promise.all([
            window.api.getMascota(id),
            window.api.getHistoriaClinica(id),
            window.api.getMisTurnos(),
            window.api.getMisSolicitudes(),
            window.api.getMisCodigos()
        ]);

        mascotaActual = petRes.data;
        if (!mascotaActual) {
            alert('Mascota no encontrada.');
            window.location.href = 'cliente-mascotas.html';
            return;
        }

        eventosHistoria = histRes.data || [];

        // Encabezado
        document.getElementById('breadcrumb-nombre-mascota').textContent = mascotaActual.nombre;
        document.getElementById('mascota-nombre').textContent = mascotaActual.nombre;
        document.getElementById('mascota-tipo').textContent = mascotaActual.tipo;
        document.getElementById('mascota-raza').textContent = mascotaActual.raza || 'Mestizo';
        document.getElementById('mascota-peso').textContent = mascotaActual.peso ? `${mascotaActual.peso} kg` : 'Sin registrar';
        document.getElementById('mascota-color').textContent = mascotaActual.color || 'No especifica';
        document.getElementById('mascota-microchip').textContent = mascotaActual.microchip || 'Sin chip';
        document.getElementById('mascota-foto').src = mascotaActual.foto;

        const edad = window.utils ? window.utils.formatDate(mascotaActual.fechaNacimiento) : mascotaActual.fechaNacimiento;
        document.getElementById('mascota-edad').textContent = `Nac: ${edad}`;

        // Links de acción
        document.getElementById('btn-reporte-fallback-link').href = `cliente-reporte.html?mascotaId=${mascotaActual.id}`;
        document.getElementById('btn-pedir-turno-link').href = `cliente-turnos.html?mascotaId=${mascotaActual.id}`;

        // Renderizar timeline
        renderTimeline(eventosHistoria);

        // Renderizar turnos
        const turnosMascota = (turnosRes.data || []).filter(t => t.mascotaId === mascotaActual.id);
        renderTurnos(turnosMascota);

        // Renderizar permisos
        const permisosMascota = (solicitudesRes.data || []).filter(s => s.mascotaId === mascotaActual.id);
        renderPermisos(permisosMascota);

        // Renderizar códigos
        const codigosMascota = (codigosRes.data || []).filter(c => c.mascotaId === mascotaActual.id);
        renderCodigos(codigosMascota);

    } catch (err) {
        console.error('Error cargando datos de mascota:', err);
    }
}

/**
 * Renderiza la historia clínica cronológica con badges claros de origen
 */
function renderTimeline(eventos) {
    const container = document.getElementById('timeline-container');
    if (!container) return;

    if (eventos.length === 0) {
        container.innerHTML = `
            <div class="card border-0 shadow-sm rounded-4 p-5 text-center bg-white">
                <i class="bi bi-clipboard2-x text-muted display-4 d-block mb-3"></i>
                <h5 class="fw-bold text-dark">Aún no hay registros clínicos</h5>
                <p class="text-muted small mb-3">Cuando un veterinario o vos registren consultas o vacunas, aparecerán aquí ordenadas por fecha.</p>
                <div>
                    <a href="cliente-reporte.html?mascotaId=${mascotaActual.id}" class="btn btn-outline-warning text-dark btn-sm">
                        <i class="bi bi-journal-medical me-1"></i>Reportar una atención previa
                    </a>
                </div>
            </div>
        `;
        return;
    }

    let html = '<div class="timeline position-relative pb-4">';

    eventos.forEach(ev => {
        const fechaFmt = window.utils ? window.utils.formatDate(ev.fecha) : ev.fecha;
        
        let icon = 'bi-clipboard2-pulse';
        let typeBadge = '<span class="badge bg-primary-subtle text-primary border border-primary-subtle text-capitalize">Consulta</span>';
        let cardBorder = 'border-start-primary';
        
        if (ev.tipo === 'vacuna') {
            icon = 'bi-shield-plus';
            typeBadge = '<span class="badge bg-success-subtle text-success border border-success-subtle text-capitalize">Vacuna</span>';
            cardBorder = 'border-start-success';
        } else if (ev.tipo === 'estudio') {
            icon = 'bi-file-earmark-medical';
            typeBadge = '<span class="badge bg-info-subtle text-info border border-info-subtle text-capitalize">Estudio</span>';
            cardBorder = 'border-start-info';
        } else if (ev.tipo === 'informe') {
            icon = 'bi-file-text';
            typeBadge = '<span class="badge bg-purple-subtle text-purple border text-capitalize" style="background:#EDE9FE; color:#6D28D9;">Informe Externo</span>';
            cardBorder = 'border-start-purple';
        }

        // Distinción estricta de orígenes según planificación
        let origenHtml = '';
        let bannerNoVerificado = '';

        if (ev.origen === 'veterinaria_interna') {
            origenHtml = `
                <span class="badge bg-primary text-white" title="Evento validado por profesional de la red">
                    <i class="bi bi-hospital me-1"></i>Clínica Verificada
                </span>
            `;
        } else if (ev.origen === 'veterinaria_externa_codigo') {
            origenHtml = `
                <span class="badge bg-info text-dark" title="Atención de profesional externo mediante código temporal">
                    <i class="bi bi-key-fill me-1"></i>Veterinaria Externa (Código)
                </span>
            `;
        } else if (ev.origen === 'cliente_formulario') {
            origenHtml = `
                <span class="badge bg-warning text-dark border border-warning" title="Reportado directamente por el dueño de la mascota">
                    <i class="bi bi-person-fill me-1"></i>Reportado por Dueño
                </span>
            `;
            bannerNoVerificado = `
                <div class="alert alert-warning py-1 px-2 rounded-2 mt-2 mb-0 small d-flex align-items-center gap-2 border-warning" style="font-size: 0.8rem;">
                    <i class="bi bi-exclamation-triangle-fill text-warning"></i>
                    <span>Información cargada por el dueño. <strong>No verificada por un profesional veterinario.</strong></span>
                </div>
            `;
        }

        html += `
            <div class="card border-0 shadow-sm rounded-4 mb-3 bg-white overflow-hidden border-start border-4 ${cardBorder}" style="border-left-width: 5px !important;">
                <div class="card-body p-4">
                    <div class="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-2 gap-2">
                        <div class="d-flex align-items-center gap-2">
                            <span class="fs-5 text-primary"><i class="bi ${icon}"></i></span>
                            <h5 class="fw-bold mb-0 text-dark">${ev.descripcion}</h5>
                            ${typeBadge}
                        </div>
                        <div class="d-flex align-items-center gap-2">
                            <span class="text-muted small"><i class="bi bi-calendar3 me-1"></i>${fechaFmt}</span>
                            ${origenHtml}
                        </div>
                    </div>

                    ${ev.observaciones ? `<p class="text-muted mb-2 small">${ev.observaciones}</p>` : ''}
                    ${bannerNoVerificado}

                    <div class="d-flex justify-content-between align-items-center pt-2 mt-2 border-top text-muted small" style="font-size: 0.8rem;">
                        <span><i class="bi bi-person me-1"></i>Profesional: <strong>${ev.profesional || 'No especifica'}</strong></span>
                        <span><i class="bi bi-geo-alt me-1"></i>${ev.clinica || 'Centro de atención'}</span>
                    </div>
                </div>
            </div>
        `;
    });

    html += '</div>';
    container.innerHTML = html;
}

/**
 * Renderiza turnos de esta mascota
 */
function renderTurnos(turnos) {
    const container = document.getElementById('turnos-mascota-container');
    if (!container) return;

    if (turnos.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4 text-muted small">
                <i class="bi bi-calendar-x d-block fs-3 mb-2 opacity-50"></i>
                No hay turnos registrados para esta mascota.
            </div>
        `;
        return;
    }

    let html = '<div class="table-responsive"><table class="table align-middle"><thead><tr><th>Fecha</th><th>Hora</th><th>Motivo</th><th>Clínica</th><th>Estado</th></tr></thead><tbody>';
    turnos.forEach(t => {
        const badgeClass = t.estado === 'confirmado' ? 'bg-success' : (t.estado === 'pendiente' ? 'bg-warning text-dark' : 'bg-secondary');
        html += `
            <tr>
                <td class="fw-semibold">${t.fecha}</td>
                <td>${t.hora} hs</td>
                <td>${t.motivo}</td>
                <td>${t.clinica || 'Veterinaria'}</td>
                <td><span class="badge ${badgeClass} text-uppercase">${t.estado}</span></td>
            </tr>
        `;
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

/**
 * Renderiza permisos aprobados para esta mascota
 */
function renderPermisos(solicitudes) {
    const container = document.getElementById('permisos-mascota-container');
    if (!container) return;

    const aprobadas = solicitudes.filter(s => s.estado === 'aprobado');
    if (aprobadas.length === 0) {
        container.innerHTML = `
            <div class="text-center py-3 text-muted small">
                <i class="bi bi-shield-x d-block fs-3 mb-2 opacity-50"></i>
                Ninguna veterinaria tiene permiso permanente en este momento.
            </div>
        `;
        return;
    }

    let html = '<div class="d-flex flex-column gap-2">';
    aprobadas.forEach(s => {
        html += `
            <div class="p-3 border rounded-3 d-flex justify-content-between align-items-center bg-light">
                <div>
                    <h6 class="fw-bold mb-0 text-dark">${s.veterinaria}</h6>
                    <small class="text-muted">${s.matricula || 'Matrícula verificada'}</small>
                </div>
                <button class="btn btn-sm btn-outline-danger" onclick="revocarPermiso(${s.id})">
                    <i class="bi bi-x-circle me-1"></i>Revocar
                </button>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

/**
 * Renderiza códigos temporales de esta mascota
 */
function renderCodigos(codigos) {
    const container = document.getElementById('codigos-mascota-container');
    if (!container) return;

    if (codigos.length === 0) {
        container.innerHTML = `
            <div class="text-center py-3 text-muted small">
                <i class="bi bi-key d-block fs-3 mb-2 opacity-50"></i>
                No se han generado códigos temporales para esta mascota.
            </div>
        `;
        return;
    }

    let html = '<div class="d-flex flex-column gap-2">';
    codigos.forEach(c => {
        const badgeClass = c.estado === 'activo' ? 'bg-success' : (c.estado === 'usado' ? 'bg-secondary' : 'bg-danger');
        html += `
            <div class="p-3 border rounded-3 d-flex justify-content-between align-items-center bg-light">
                <div>
                    <span class="font-monospace fw-bold fs-5 text-primary">${c.codigo}</span>
                    <span class="badge ${badgeClass} ms-2 text-uppercase" style="font-size: 0.7rem;">${c.estado}</span>
                    <small class="text-muted d-block" style="font-size: 0.75rem;">Expira: ${window.utils ? window.utils.formatDate(c.fechaExpiracion) : c.fechaExpiracion}</small>
                </div>
                ${c.estado === 'activo' ? `
                    <button class="btn btn-sm btn-outline-danger" onclick="revocarCodigo(${c.id})">
                        Revocar
                    </button>
                ` : ''}
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

function setupFiltrosYModales() {
    // Filtros del timeline
    const filterBtns = document.querySelectorAll('.filter-btn');
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
                renderTimeline(eventosHistoria);
            } else if (filter === 'dueno') {
                renderTimeline(eventosHistoria.filter(e => e.origen === 'cliente_formulario'));
            } else {
                renderTimeline(eventosHistoria.filter(e => e.tipo === filter));
            }
        });
    });

    // Modal código
    const btnGen = document.getElementById('btn-generar-codigo-mascota');
    if (btnGen) {
        btnGen.addEventListener('click', abrirModalGenerarCodigo);
    }

    const formCod = document.getElementById('form-codigo-detalle');
    if (formCod) {
        formCod.addEventListener('submit', async (e) => {
            e.preventDefault();
            const vigencia = parseInt(document.getElementById('detalle-vigencia').value);
            try {
                const res = await window.api.generarCodigoAcceso(mascotaActual.id, vigencia);
                document.getElementById('val-codigo-generado').textContent = res.data.codigo;
                document.getElementById('box-resultado-codigo').classList.remove('d-none');
                document.getElementById('btn-submit-codigo').disabled = true;

                if (window.ToastComponent) {
                    window.ToastComponent.show({ message: `Código ${res.data.codigo} generado con éxito.`, type: 'success' });
                }

                await cargarDatosMascota(mascotaActual.id);
            } catch (err) {
                alert('Error: ' + err.message);
            }
        });
    }
}

function abrirModalGenerarCodigo() {
    document.getElementById('box-resultado-codigo').classList.add('d-none');
    document.getElementById('btn-submit-codigo').disabled = false;
    const modal = new bootstrap.Modal(document.getElementById('modalCodigoMascota'));
    modal.show();
}

async function revocarPermiso(id) {
    if (!confirm('¿Estás seguro de revocar el permiso de acceso a esta clínica?')) return;
    try {
        await window.api.responderSolicitudAcceso(id, 'revocado');
        if (window.ToastComponent) window.ToastComponent.show({ message: 'Permiso revocado.', type: 'warning' });
        await cargarDatosMascota(mascotaActual.id);
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

async function revocarCodigo(id) {
    if (!confirm('¿Revocar este código? Ya no podrá ser canjeado.')) return;
    try {
        await window.api.revocarCodigoAcceso(id);
        if (window.ToastComponent) window.ToastComponent.show({ message: 'Código revocado.', type: 'warning' });
        await cargarDatosMascota(mascotaActual.id);
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

window.abrirModalGenerarCodigo = abrirModalGenerarCodigo;
window.revocarPermiso = revocarPermiso;
window.revocarCodigo = revocarCodigo;
