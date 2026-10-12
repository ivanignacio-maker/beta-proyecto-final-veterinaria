/**
 * Lógica del Dashboard del Dueño de Mascota
 */

document.addEventListener('DOMContentLoaded', async () => {
    // 1. Proteger ruta: solo accesible para clientes
    if (window.auth) {
        window.auth.requireAuth('CLIENTE');
    }

    // 2. Renderizar componentes de layout
    if (window.HeaderComponent) window.HeaderComponent.render('header-container');
    if (window.SidebarComponent) window.SidebarComponent.render('sidebar-container');
    if (window.FooterComponent) window.FooterComponent.render('footer-container');

    const currentUser = window.auth ? window.auth.getUser() : null;
    if (currentUser) {
        const saludoEl = document.getElementById('saludo-usuario');
        if (saludoEl) saludoEl.textContent = `¡Hola, ${currentUser.nombreSimple || currentUser.nombre}! 👋`;
    }

    // Cargar datos del dashboard
    await cargarDashboardData();

    // Setup de modales y acciones
    setupModales();
});

async function cargarDashboardData() {
    try {
        const [mascotasRes, turnosRes, solicitudesRes, codigosRes] = await Promise.all([
            window.api.getMisMascotas(),
            window.api.getMisTurnos(),
            window.api.getMisSolicitudes(),
            window.api.getMisCodigos()
        ]);

        const mascotas = mascotasRes.data || [];
        const turnos = turnosRes.data || [];
        const solicitudes = solicitudesRes.data || [];
        const codigos = codigosRes.data || [];

        // Estadísticas
        document.getElementById('stat-mascotas').textContent = mascotas.length;
        
        const turnosFuturos = turnos.filter(t => t.estado === 'confirmado' || t.estado === 'pendiente');
        document.getElementById('stat-turnos').textContent = turnosFuturos.length;

        const solicitudesPendientes = solicitudes.filter(s => s.estado === 'pendiente');
        document.getElementById('stat-solicitudes').textContent = solicitudesPendientes.length;

        const codigosActivos = codigos.filter(c => c.estado === 'activo');
        document.getElementById('stat-codigos').textContent = codigosActivos.length;

        // Renderizar secciones
        renderAlertas(solicitudesPendientes, codigos);
        renderMascotas(mascotas);
        renderTurnos(turnosFuturos);
        renderSolicitudes(solicitudes);
        llenarSelectMascotasCodigo(mascotas);

    } catch (error) {
        console.error('Error cargando datos del dashboard:', error);
    }
}

/**
 * Renderiza alertas prioritarias (solicitudes pendientes y fallback de informe)
 */
function renderAlertas(solicitudesPendientes, codigos) {
    const container = document.getElementById('alertas-notificaciones-container');
    if (!container) return;

    let alertasHtml = '';

    // Alerta 1: Solicitudes pendientes de veterinarias
    if (solicitudesPendientes.length > 0) {
        const primera = solicitudesPendientes[0];
        alertasHtml += `
            <div class="alert alert-warning border-warning shadow-sm rounded-4 p-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
                <div class="d-flex align-items-center gap-3">
                    <div class="rounded-circle bg-warning p-2 text-white">
                        <i class="bi bi-shield-exclamation fs-4"></i>
                    </div>
                    <div>
                        <strong class="d-block text-dark">Solicitud de acceso clínico pendiente</strong>
                        <span class="text-muted small"><strong>${primera.veterinaria}</strong> solicita acceso al historial de <strong>${primera.mascotaNombre}</strong>.</span>
                    </div>
                </div>
                <div class="d-flex gap-2">
                    <button class="btn btn-sm btn-success fw-semibold" onclick="responderSolicitud(${primera.id}, 'aprobado')">
                        <i class="bi bi-check-lg me-1"></i>Aprobar acceso
                    </button>
                    <button class="btn btn-sm btn-outline-danger" onclick="responderSolicitud(${primera.id}, 'rechazado')">
                        Rechazar
                    </button>
                    <a href="cliente-autorizaciones.html" class="btn btn-sm btn-light border">Ver todas</a>
                </div>
            </div>
        `;
    }

    // Alerta 2: Fallback cuando una veterinaria externa canjeó código hace +48hs y no informó
    const codigoSinInforme = codigos.find(c => c.estado === 'usado' && !c.informeCargado);
    if (codigoSinInforme) {
        alertasHtml += `
            <div class="alert alert-info border-info shadow-sm rounded-4 p-3 d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-3">
                <div class="d-flex align-items-center gap-3">
                    <div class="rounded-circle bg-info p-2 text-white">
                        <i class="bi bi-bell-fill fs-4"></i>
                    </div>
                    <div>
                        <strong class="d-block text-dark">Atención externa sin informe registrado</strong>
                        <span class="text-muted small">Se canjeó un código para <strong>${codigoSinInforme.mascotaNombre}</strong> pero la veterinaria no cargó informe aún. Podés registrar lo realizado vos mismo.</span>
                    </div>
                </div>
                <div>
                    <a href="cliente-reporte.html?mascotaId=${codigoSinInforme.mascotaId}" class="btn btn-sm btn-primary fw-semibold">
                        <i class="bi bi-pencil-square me-1"></i>Reportar atención (Fallback)
                    </a>
                </div>
            </div>
        `;
    }

    container.innerHTML = alertasHtml;
}

/**
 * Renderiza la lista de mascotas
 */
function renderMascotas(mascotas) {
    const container = document.getElementById('mascotas-list-container');
    if (!container) return;

    if (mascotas.length === 0) {
        container.innerHTML = `
            <div class="text-center py-5">
                <i class="bi bi-heart text-muted display-4 d-block mb-2"></i>
                <h6 class="fw-bold text-dark">Aún no registraste mascotas</h6>
                <p class="text-muted small mb-3">Agregá a tus compañeros para centralizar sus historias clínicas.</p>
                <button class="btn btn-primary btn-sm" onclick="abrirModalNuevaMascota()">
                    <i class="bi bi-plus-lg me-1"></i>Registrar primera mascota
                </button>
            </div>
        `;
        return;
    }

    let html = '<div class="row g-3">';
    mascotas.forEach(m => {
        const edadTexto = window.utils ? window.utils.formatDate(m.fechaNacimiento) : m.fechaNacimiento;
        const iconType = m.tipo === 'perro' ? 'bi-emoji-smile' : (m.tipo === 'gato' ? 'bi-emoji-heart-eyes' : 'bi-heart-fill');
        
        html += `
            <div class="col-md-6">
                <div class="card border rounded-4 overflow-hidden h-100 shadow-sm hover-shadow transition">
                    <div class="d-flex p-3 gap-3">
                        <img src="${m.foto}" alt="${m.nombre}" class="rounded-3 object-fit-cover" style="width: 72px; height: 72px;">
                        <div class="flex-grow-1 overflow-hidden">
                            <div class="d-flex justify-content-between align-items-start mb-1">
                                <h6 class="fw-bold mb-0 text-dark text-truncate">${m.nombre}</h6>
                                <span class="badge bg-primary-subtle text-primary border border-primary-subtle text-capitalize">${m.tipo}</span>
                            </div>
                            <small class="text-muted d-block text-truncate">${m.raza || 'Mestizo'} &bull; ${m.peso || 0} kg</small>
                            <small class="text-muted d-block" style="font-size: 0.75rem;">Nacimiento: ${edadTexto}</small>
                        </div>
                    </div>
                    <div class="card-footer bg-light border-top p-2 d-flex gap-2">
                        <a href="cliente-mascota-detalle.html?id=${m.id}" class="btn btn-sm btn-outline-primary flex-fill fw-medium">
                            <i class="bi bi-clipboard2-pulse me-1"></i>Historia clínica
                        </a>
                        <a href="cliente-turnos.html?mascotaId=${m.id}" class="btn btn-sm btn-light border flex-fill text-muted" title="Pedir turno">
                            <i class="bi bi-calendar-plus text-success"></i>
                        </a>
                        <button class="btn btn-sm btn-light border text-muted" onclick="generarCodigoParaMascota(${m.id})" title="Generar código temporal">
                            <i class="bi bi-key text-info"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    html += '</div>';

    container.innerHTML = html;
}

/**
 * Renderiza los turnos próximos
 */
function renderTurnos(turnos) {
    const container = document.getElementById('turnos-list-container');
    if (!container) return;

    if (turnos.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4 text-muted small">
                <i class="bi bi-calendar-x d-block fs-3 mb-2 opacity-50"></i>
                No tenés turnos programados próximamente.
                <div class="mt-2">
                    <a href="cliente-turnos.html" class="btn btn-sm btn-outline-success">Solicitar turno</a>
                </div>
            </div>
        `;
        return;
    }

    let html = '<div class="d-flex flex-column gap-2">';
    turnos.slice(0, 3).forEach(t => {
        const badgeClass = t.estado === 'confirmado' ? 'bg-success' : 'bg-warning text-dark';
        html += `
            <div class="p-3 rounded-3 border bg-light d-flex justify-content-between align-items-center">
                <div>
                    <div class="d-flex align-items-center gap-2 mb-1">
                        <span class="badge ${badgeClass} text-uppercase" style="font-size: 0.65rem;">${t.estado}</span>
                        <strong class="text-dark small">${t.mascotaNombre}</strong>
                    </div>
                    <small class="text-muted d-block">${t.motivo}</small>
                    <small class="text-primary fw-medium" style="font-size: 0.75rem;">
                        <i class="bi bi-clock me-1"></i>${t.fecha} - ${t.hora} hs &bull; ${t.clinica || 'Clínica'}
                    </small>
                </div>
                <div>
                    <button class="btn btn-sm btn-outline-danger" onclick="cancelarTurno(${t.id})" title="Cancelar turno">
                        <i class="bi bi-x"></i>
                    </button>
                </div>
            </div>
        `;
    });
    html += '</div>';

    container.innerHTML = html;
}

/**
 * Renderiza las solicitudes recibidas de veterinarias
 */
function renderSolicitudes(solicitudes) {
    const container = document.getElementById('solicitudes-list-container');
    if (!container) return;

    if (solicitudes.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4 text-muted small">
                <i class="bi bi-shield-check d-block fs-3 mb-2 opacity-50"></i>
                No tenés solicitudes de acceso pendientes ni recientes.
            </div>
        `;
        return;
    }

    let html = '<div class="d-flex flex-column gap-2">';
    solicitudes.slice(0, 3).forEach(s => {
        const badgeClass = s.estado === 'aprobado' ? 'bg-success-subtle text-success border border-success-subtle' :
                           s.estado === 'pendiente' ? 'bg-warning-subtle text-warning border border-warning-subtle' :
                           'bg-danger-subtle text-danger border border-danger-subtle';

        html += `
            <div class="p-2 border rounded-3 d-flex justify-content-between align-items-center">
                <div>
                    <span class="fw-semibold text-dark small d-block">${s.veterinaria}</span>
                    <small class="text-muted" style="font-size: 0.75rem;">Para: ${s.mascotaNombre}</small>
                </div>
                <span class="badge ${badgeClass} text-capitalize" style="font-size: 0.75rem;">${s.estado}</span>
            </div>
        `;
    });
    html += '</div>';

    container.innerHTML = html;
}

/**
 * Configuración de modales y formularios interactivos
 */
function setupModales() {
    const btnAbrirModalMascota = document.getElementById('btn-modal-nueva-mascota');
    if (btnAbrirModalMascota) {
        btnAbrirModalMascota.addEventListener('click', abrirModalNuevaMascota);
    }

    const formAltaMascota = document.getElementById('form-alta-mascota');
    if (formAltaMascota) {
        // Validación interactiva de duplicados al escribir el nombre
        const petNombreInput = document.getElementById('pet-nombre');
        const petTipoInput = document.getElementById('pet-tipo');

        const chequearDuplicado = async () => {
            const nombre = petNombreInput.value.trim();
            const tipo = petTipoInput.value;
            if (nombre.length >= 2) {
                const res = await window.api.verificarDuplicadoMascota({ nombre, tipo });
                const alertaDuplicado = document.getElementById('alerta-duplicado');
                const duplicadoMsg = document.getElementById('duplicado-mensaje');
                if (res.hayDuplicado) {
                    alertaDuplicado.classList.remove('d-none');
                    duplicadoMsg.textContent = `Ya tenés registrada una mascota llamada "${res.candidato.nombre}" de especie ${res.candidato.tipo}. Para evitar duplicados, confirmá si se trata de un nuevo animal o editala.`;
                } else {
                    alertaDuplicado.classList.add('d-none');
                }
            }
        };

        petNombreInput.addEventListener('blur', chequearDuplicado);
        petTipoInput.addEventListener('change', chequearDuplicado);

        formAltaMascota.addEventListener('submit', async (e) => {
            e.preventDefault();
            const nombre = petNombreInput.value.trim();
            const tipo = petTipoInput.value;
            const raza = document.getElementById('pet-raza').value.trim();
            const fechaNac = document.getElementById('pet-fecha-nac').value;
            const peso = document.getElementById('pet-peso').value;
            const color = document.getElementById('pet-color').value.trim();
            const microchip = document.getElementById('pet-microchip').value.trim();

            if (!nombre) {
                petNombreInput.classList.add('is-invalid');
                return;
            }

            try {
                await window.api.registrarMascota({
                    nombre,
                    tipo,
                    raza,
                    fechaNacimiento: fechaNac || new Date().toISOString().split('T')[0],
                    peso,
                    color,
                    microchip
                });

                // Cerrar modal
                const modalEl = document.getElementById('modalRegistrarMascota');
                const modal = bootstrap.Modal.getInstance(modalEl);
                if (modal) modal.hide();
                formAltaMascota.reset();

                if (window.ToastComponent) {
                    window.ToastComponent.show({ message: `¡${nombre} fue registrado con éxito!`, type: 'success' });
                }

                // Recargar datos
                await cargarDashboardData();
            } catch (err) {
                alert('Error al registrar mascota: ' + err.message);
            }
        });
    }

    // Modal código rápido
    const btnGenerarCodigo = document.getElementById('btn-generar-codigo-rapido');
    if (btnGenerarCodigo) {
        btnGenerarCodigo.addEventListener('click', () => {
            const modal = new bootstrap.Modal(document.getElementById('modalGenerarCodigoRapido'));
            modal.show();
        });
    }

    const formCodigoRapido = document.getElementById('form-codigo-rapido');
    if (formCodigoRapido) {
        formCodigoRapido.addEventListener('submit', async (e) => {
            e.preventDefault();
            const mascotaId = document.getElementById('codigo-mascota-select').value;
            const vigencia = parseInt(document.getElementById('codigo-vigencia-select').value);

            if (!mascotaId) {
                alert('Por favor seleccioná una mascota.');
                return;
            }

            try {
                const res = await window.api.generarCodigoAcceso(mascotaId, vigencia);
                const codigoVal = res.data.codigo;

                document.getElementById('codigo-generado-val').textContent = codigoVal;
                document.getElementById('resultado-codigo-box').classList.remove('d-none');
                document.getElementById('btn-crear-codigo-submit').disabled = true;

                if (window.ToastComponent) {
                    window.ToastComponent.show({ message: `Código ${codigoVal} generado con éxito.`, type: 'success' });
                }

                await cargarDashboardData();
            } catch (err) {
                alert('Error al generar código: ' + err.message);
            }
        });
    }
}

function abrirModalNuevaMascota() {
    const modalEl = document.getElementById('modalRegistrarMascota');
    if (modalEl) {
        const modal = new bootstrap.Modal(modalEl);
        modal.show();
    }
}

function llenarSelectMascotasCodigo(mascotas) {
    const select = document.getElementById('codigo-mascota-select');
    if (!select) return;

    select.innerHTML = '<option value="" disabled selected>Elegí una mascota...</option>';
    mascotas.forEach(m => {
        select.innerHTML += `<option value="${m.id}">${m.nombre} (${m.tipo})</option>`;
    });
}

function generarCodigoParaMascota(mascotaId) {
    const select = document.getElementById('codigo-mascota-select');
    if (select) select.value = mascotaId;
    const modal = new bootstrap.Modal(document.getElementById('modalGenerarCodigoRapido'));
    modal.show();
}

async function responderSolicitud(id, estado) {
    try {
        await window.api.responderSolicitudAcceso(id, estado);
        if (window.ToastComponent) {
            window.ToastComponent.show({ 
                message: `Permiso ${estado === 'aprobado' ? 'aprobado' : 'rechazado'} con éxito.`, 
                type: estado === 'aprobado' ? 'success' : 'info' 
            });
        }
        await cargarDashboardData();
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

async function cancelarTurno(id) {
    if (!confirm('¿Estás seguro de que deseas cancelar este turno?')) return;
    try {
        await window.api.cancelarTurnoCliente(id);
        if (window.ToastComponent) {
            window.ToastComponent.show({ message: 'Turno cancelado.', type: 'warning' });
        }
        await cargarDashboardData();
    } catch (err) {
        alert('Error: ' + err.message);
    }
}

window.abrirModalNuevaMascota = abrirModalNuevaMascota;
window.generarCodigoParaMascota = generarCodigoParaMascota;
window.responderSolicitud = responderSolicitud;
window.cancelarTurno = cancelarTurno;
