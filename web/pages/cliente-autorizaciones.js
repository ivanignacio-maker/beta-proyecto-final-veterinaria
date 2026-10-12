/**
 * Lógica de Autorizaciones y Códigos de Acceso del Cliente
 */

let misSolicitudes = [];
let misCodigos = [];
let misMascotas = [];

document.addEventListener('DOMContentLoaded', async () => {
    if (window.auth) window.auth.requireAuth('CLIENTE');

    if (window.HeaderComponent) window.HeaderComponent.render('header-container');
    if (window.SidebarComponent) window.SidebarComponent.render('sidebar-container');
    if (window.FooterComponent) window.FooterComponent.render('footer-container');

    await cargarDatos();
    setupEventos();
});

async function cargarDatos() {
    try {
        const [solRes, codRes, masRes] = await Promise.all([
            window.api.getMisSolicitudes(),
            window.api.getMisCodigos(),
            window.api.getMisMascotas()
        ]);

        misSolicitudes = solRes.data || [];
        misCodigos = codRes.data || [];
        misMascotas = masRes.data || [];

        renderTablaSolicitudes(misSolicitudes);
        renderTablaCodigos(misCodigos);
        llenarSelectMascotas();

    } catch (err) {
        console.error('Error cargando autorizaciones:', err);
    }
}

function renderTablaSolicitudes(lista) {
    const tbody = document.getElementById('solicitudes-tbody');
    const badgeContador = document.getElementById('badge-contador-solicitudes');
    if (!tbody) return;

    if (badgeContador) badgeContador.textContent = `${lista.length} solicitudes`;

    if (lista.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="6" class="text-center py-5 text-muted">
                    <i class="bi bi-shield-x display-6 d-block mb-2 opacity-50"></i>
                    No hay solicitudes de acceso registradas para tus mascotas.
                </td>
            </tr>
        `;
        return;
    }

    let html = '';
    lista.forEach(s => {
        let badgeClass = 'bg-secondary';
        if (s.estado === 'aprobado') badgeClass = 'bg-success';
        else if (s.estado === 'pendiente') badgeClass = 'bg-warning text-dark';
        else if (s.estado === 'rechazado' || s.estado === 'revocado') badgeClass = 'bg-danger';

        const fecha = window.utils ? window.utils.formatDate(s.fechaSolicitud) : s.fechaSolicitud;

        let accionesHtml = '';
        if (s.estado === 'pendiente') {
            accionesHtml = `
                <div class="d-flex justify-content-end gap-1">
                    <button class="btn btn-sm btn-success fw-semibold" onclick="responderSolicitud(${s.id}, 'aprobado')">
                        <i class="bi bi-check-lg me-1"></i>Aprobar
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="responderSolicitud(${s.id}, 'rechazado')">
                        Rechazar
                    </button>
                </div>
            `;
        } else if (s.estado === 'aprobado') {
            accionesHtml = `
                <button class="btn btn-sm btn-outline-danger" onclick="responderSolicitud(${s.id}, 'revocado')">
                    <i class="bi bi-shield-x me-1"></i>Revocar Acceso
                </button>
            `;
        } else {
            accionesHtml = `<span class="text-muted small">Sin acciones</span>`;
        }

        html += `
            <tr>
                <td class="ps-4">
                    <strong class="text-dark d-block">${s.veterinaria}</strong>
                    <small class="text-muted">${s.matricula || 'Matrícula verificada'}</small>
                </td>
                <td>
                    <span class="fw-semibold text-primary">${s.mascotaNombre}</span>
                </td>
                <td>
                    <span class="small text-muted">${s.motivo || 'Atención y seguimiento'}</span>
                </td>
                <td>
                    <span class="small text-muted">${fecha}</span>
                </td>
                <td>
                    <span class="badge ${badgeClass} text-uppercase px-2 py-1" style="font-size: 0.72rem;">${s.estado}</span>
                </td>
                <td class="text-end pe-4">
                    ${accionesHtml}
                </td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

function renderTablaCodigos(lista) {
    const tbody = document.getElementById('codigos-tbody');
    if (!tbody) return;

    if (lista.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="7" class="text-center py-5 text-muted">
                    <i class="bi bi-key display-6 d-block mb-2 opacity-50"></i>
                    No has generado ningún código de acceso temporal todavía.
                </td>
            </tr>
        `;
        return;
    }

    let html = '';
    lista.forEach(c => {
        let badgeClass = 'bg-secondary';
        if (c.estado === 'activo') badgeClass = 'bg-success';
        else if (c.estado === 'usado') badgeClass = 'bg-info text-dark';
        else if (c.estado === 'expirado') badgeClass = 'bg-warning text-dark';
        else if (c.estado === 'revocado') badgeClass = 'bg-danger';

        const creacion = window.utils ? window.utils.formatDate(c.fechaCreacion) : c.fechaCreacion;
        const expiracion = window.utils ? window.utils.formatDate(c.fechaExpiracion) : c.fechaExpiracion;

        let auditoria = '<span class="text-muted small">Sin canjear</span>';
        if (c.usadoPor) {
            auditoria = `<span class="badge bg-light text-dark border small"><i class="bi bi-check-circle text-success me-1"></i>Canjeado por: ${c.usadoPor}</span>`;
        }

        let accion = '&mdash;';
        if (c.estado === 'activo') {
            accion = `
                <button class="btn btn-sm btn-outline-danger" onclick="revocarCodigo(${c.id})">
                    <i class="bi bi-x-circle me-1"></i>Revocar
                </button>
            `;
        }

        html += `
            <tr>
                <td class="ps-4">
                    <span class="font-monospace fw-bold fs-5 text-primary">${c.codigo}</span>
                </td>
                <td>
                    <strong class="text-dark">${c.mascotaNombre}</strong>
                </td>
                <td><small class="text-muted">${creacion}</small></td>
                <td><small class="text-muted">${expiracion}</small></td>
                <td>
                    <span class="badge ${badgeClass} text-uppercase px-2 py-1" style="font-size: 0.72rem;">${c.estado}</span>
                </td>
                <td>${auditoria}</td>
                <td class="text-end pe-4">${accion}</td>
            </tr>
        `;
    });

    tbody.innerHTML = html;
}

function llenarSelectMascotas() {
    const select = document.getElementById('select-mascota-codigo');
    if (!select) return;

    select.innerHTML = '<option value="" disabled selected>Seleccioná para qué mascota querés el código...</option>';
    misMascotas.forEach(m => {
        select.innerHTML += `<option value="${m.id}">${m.nombre} (${m.tipo} - ${m.raza || 'Mestizo'})</option>`;
    });
}

function setupEventos() {
    const btnGenModal = document.getElementById('btn-generar-codigo-modal');
    if (btnGenModal) btnGenModal.addEventListener('click', abrirModalGenerarCodigo);

    const formGen = document.getElementById('form-generar-codigo');
    if (formGen) {
        formGen.addEventListener('submit', async (e) => {
            e.preventDefault();
            const mascotaId = document.getElementById('select-mascota-codigo').value;
            const vigencia = parseInt(document.getElementById('select-vigencia').value);

            if (!mascotaId) {
                alert('Por favor seleccioná una mascota.');
                return;
            }

            try {
                const res = await window.api.generarCodigoAcceso(mascotaId, vigencia);
                const codigoVal = res.data.codigo;

                document.getElementById('texto-codigo-generado').textContent = codigoVal;
                document.getElementById('codigo-resultado-box').classList.remove('d-none');
                document.getElementById('btn-submit-crear-codigo').disabled = true;

                if (window.ToastComponent) {
                    window.ToastComponent.show({ 
                        message: `¡Código ${codigoVal} generado! Válido por ${vigencia} horas.`, 
                        type: 'success' 
                    });
                }

                await cargarDatos();
            } catch (err) {
                alert('Error al generar código: ' + err.message);
            }
        });
    }

    const btnCopiar = document.getElementById('btn-copiar-codigo');
    if (btnCopiar) {
        btnCopiar.addEventListener('click', () => {
            const txt = document.getElementById('texto-codigo-generado').textContent;
            navigator.clipboard.writeText(txt).then(() => {
                if (window.ToastComponent) window.ToastComponent.show({ message: 'Código copiado al portapapeles.', type: 'info' });
            });
        });
    }
}

function abrirModalGenerarCodigo() {
    document.getElementById('codigo-resultado-box').classList.add('d-none');
    document.getElementById('btn-submit-crear-codigo').disabled = false;
    const modal = new bootstrap.Modal(document.getElementById('modalGenerarCodigo'));
    modal.show();
}

async function responderSolicitud(id, estado) {
    const accion = estado === 'aprobado' ? 'aprobar' : (estado === 'rechazado' ? 'rechazar' : 'revocar');
    if (estado === 'revocado' && !confirm('¿Estás seguro de revocar el acceso a esta veterinaria?')) return;

    try {
        await window.api.responderSolicitudAcceso(id, estado);
        if (window.ToastComponent) {
            window.ToastComponent.show({ 
                message: `Permiso ${estado} con éxito.`, 
                type: estado === 'aprobado' ? 'success' : 'warning' 
            });
        }
        await cargarDatos();
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

async function revocarCodigo(id) {
    if (!confirm('¿Estás seguro de revocar este código temporal? Dejará de dar acceso de inmediato.')) return;
    try {
        await window.api.revocarCodigoAcceso(id);
        if (window.ToastComponent) {
            window.ToastComponent.show({ message: 'Código de acceso revocado.', type: 'warning' });
        }
        await cargarDatos();
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

window.abrirModalGenerarCodigo = abrirModalGenerarCodigo;
window.responderSolicitud = responderSolicitud;
window.revocarCodigo = revocarCodigo;
