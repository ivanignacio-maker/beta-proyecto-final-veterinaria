/**
 * Lógica para la Gestión de Mascotas del Cliente
 */

let misMascotas = [];

document.addEventListener('DOMContentLoaded', async () => {
    if (window.auth) window.auth.requireAuth('CLIENTE');

    if (window.HeaderComponent) window.HeaderComponent.render('header-container');
    if (window.SidebarComponent) window.SidebarComponent.render('sidebar-container');
    if (window.FooterComponent) window.FooterComponent.render('footer-container');

    await cargarMascotas();
    setupEventos();
});

async function cargarMascotas() {
    try {
        const res = await window.api.getMisMascotas();
        misMascotas = res.data || [];
        renderMascotasGrid(misMascotas);
    } catch (err) {
        console.error('Error al cargar mascotas:', err);
    }
}

function renderMascotasGrid(lista) {
    const container = document.getElementById('mascotas-grid-container');
    const contador = document.getElementById('contador-mascotas');
    if (!container) return;

    if (contador) contador.textContent = `${lista.length} mascota${lista.length === 1 ? '' : 's'}`;

    if (lista.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-heart text-muted display-4 d-block mb-3"></i>
                <h5 class="fw-bold text-dark">No se encontraron mascotas</h5>
                <p class="text-muted small">Registrá a tu compañero animal para comenzar a gestionar su historial clínico.</p>
                <button class="btn btn-primary" onclick="abrirModalAlta()">
                    <i class="bi bi-plus-lg me-1"></i>Registrar Mascota
                </button>
            </div>
        `;
        return;
    }

    let html = '';
    lista.forEach(m => {
        const edad = window.utils ? window.utils.formatDate(m.fechaNacimiento) : m.fechaNacimiento;
        const iconType = m.tipo === 'perro' ? 'bi-emoji-smile' : (m.tipo === 'gato' ? 'bi-emoji-heart-eyes' : 'bi-heart-fill');

        html += `
            <div class="col-md-6 col-xl-4">
                <div class="card border-0 shadow-sm rounded-4 overflow-hidden h-100 bg-white">
                    <div class="position-relative">
                        <img src="${m.foto}" alt="${m.nombre}" class="card-img-top object-fit-cover" style="height: 190px;">
                        <span class="position-absolute top-0 end-0 m-3 badge bg-white text-dark shadow-sm py-2 px-3 rounded-pill text-capitalize border">
                            <i class="bi ${iconType} text-primary me-1"></i>${m.tipo}
                        </span>
                    </div>
                    <div class="card-body p-4">
                        <div class="d-flex justify-content-between align-items-center mb-2">
                            <h4 class="fw-bold mb-0 text-dark">${m.nombre}</h4>
                            <button class="btn btn-sm btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center" style="width: 32px; height: 32px;" onclick="abrirModalEditar(${m.id})" title="Editar datos">
                                <i class="bi bi-pencil"></i>
                            </button>
                        </div>
                        <p class="text-muted small mb-3">
                            <strong>${m.raza || 'Mestizo'}</strong> &bull; ${m.peso ? `${m.peso} kg` : 'Sin peso'}
                        </p>

                        <div class="bg-light rounded-3 p-3 mb-3 small">
                            <div class="d-flex justify-content-between mb-1">
                                <span class="text-muted">Nacimiento:</span>
                                <span class="fw-semibold text-dark">${edad}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-1">
                                <span class="text-muted">Color:</span>
                                <span class="fw-semibold text-dark">${m.color || 'No especifica'}</span>
                            </div>
                            <div class="d-flex justify-content-between">
                                <span class="text-muted">Microchip:</span>
                                <span class="fw-semibold text-dark">${m.microchip || 'Sin chip'}</span>
                            </div>
                        </div>

                        <div class="d-grid gap-2">
                            <a href="cliente-mascota-detalle.html?id=${m.id}" class="btn btn-primary fw-semibold shadow-sm">
                                <i class="bi bi-clipboard2-pulse me-1"></i>Ver Historia Clínica
                            </a>
                            <div class="d-flex gap-2">
                                <a href="cliente-turnos.html?mascotaId=${m.id}" class="btn btn-outline-success btn-sm flex-fill">
                                    <i class="bi bi-calendar-plus me-1"></i>Pedir Turno
                                </a>
                                <a href="cliente-reporte.html?mascotaId=${m.id}" class="btn btn-outline-warning btn-sm flex-fill text-dark">
                                    <i class="bi bi-journal-medical me-1"></i>Reporte
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function setupEventos() {
    // Búsqueda y Filtros
    const searchInput = document.getElementById('search-mascotas');
    const filtroTipo = document.getElementById('filtro-tipo');

    const filtrar = () => {
        const query = searchInput.value.toLowerCase().trim();
        const tipo = filtroTipo.value.toLowerCase();

        const filtradas = misMascotas.filter(m => {
            const coincideNombre = m.nombre.toLowerCase().includes(query) || (m.raza && m.raza.toLowerCase().includes(query));
            const coincideTipo = !tipo || m.tipo.toLowerCase() === tipo;
            return coincideNombre && coincideTipo;
        });

        renderMascotasGrid(filtradas);
    };

    if (searchInput) searchInput.addEventListener('input', filtrar);
    if (filtroTipo) filtroTipo.addEventListener('change', filtrar);

    // Botón nueva mascota
    const btnNueva = document.getElementById('btn-nueva-mascota');
    if (btnNueva) btnNueva.addEventListener('click', abrirModalAlta);

    // Formulario de mascota
    const form = document.getElementById('form-mascota');
    if (form) {
        const petNombreInput = document.getElementById('m-nombre');
        const petTipoInput = document.getElementById('m-tipo');

        // Chequeo de duplicados en tiempo real (solo en alta)
        const chequearDuplicado = async () => {
            const editId = document.getElementById('edit-mascota-id').value;
            if (editId) return; // Si estamos editando, no alertar

            const nombre = petNombreInput.value.trim();
            const tipo = petTipoInput.value;
            if (nombre.length >= 2) {
                const res = await window.api.verificarDuplicadoMascota({ nombre, tipo });
                const alerta = document.getElementById('alerta-duplicado');
                const msg = document.getElementById('duplicado-mensaje');
                if (res.hayDuplicado) {
                    alerta.classList.remove('d-none');
                    msg.textContent = `Ya tenés una mascota registrada como "${res.candidato.nombre}" (${res.candidato.tipo}). ¿Deseas confirmar que se trata de otra mascota?`;
                } else {
                    alerta.classList.add('d-none');
                }
            }
        };

        petNombreInput.addEventListener('blur', chequearDuplicado);
        petTipoInput.addEventListener('change', chequearDuplicado);

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const editId = document.getElementById('edit-mascota-id').value;
            const nombre = petNombreInput.value.trim();
            const tipo = petTipoInput.value;
            const raza = document.getElementById('m-raza').value.trim();
            const fechaNac = document.getElementById('m-fecha').value;
            const peso = document.getElementById('m-peso').value;
            const color = document.getElementById('m-color').value.trim();
            const microchip = document.getElementById('m-microchip').value.trim();

            if (!nombre) {
                petNombreInput.classList.add('is-invalid');
                return;
            }

            try {
                if (editId) {
                    // Editar mascota
                    await window.api.editarMascota(editId, {
                        nombre,
                        tipo,
                        raza,
                        fechaNacimiento: fechaNac,
                        peso: parseFloat(peso) || 0,
                        color,
                        microchip
                    });
                    if (window.ToastComponent) window.ToastComponent.show({ message: 'Mascota actualizada correctamente.', type: 'success' });
                } else {
                    // Alta nueva mascota
                    await window.api.registrarMascota({
                        nombre,
                        tipo,
                        raza,
                        fechaNacimiento: fechaNac || new Date().toISOString().split('T')[0],
                        peso: parseFloat(peso) || 0,
                        color,
                        microchip
                    });
                    if (window.ToastComponent) window.ToastComponent.show({ message: `¡${nombre} fue registrada exitosamente!`, type: 'success' });
                }

                const modal = bootstrap.Modal.getInstance(document.getElementById('modalAltaMascota'));
                if (modal) modal.hide();
                await cargarMascotas();
            } catch (err) {
                alert('Error: ' + err.message);
            }
        });
    }
}

function abrirModalAlta() {
    const form = document.getElementById('form-mascota');
    if (form) form.reset();
    document.getElementById('edit-mascota-id').value = '';
    document.getElementById('modalAltaMascota').querySelector('.modal-title').innerHTML = '<i class="bi bi-plus-circle text-primary me-2"></i>Registrar Nueva Mascota';
    document.getElementById('alerta-duplicado').classList.add('d-none');
    
    const modal = new bootstrap.Modal(document.getElementById('modalAltaMascota'));
    modal.show();
}

function abrirModalEditar(id) {
    const m = misMascotas.find(item => item.id === parseInt(id));
    if (!m) return;

    document.getElementById('edit-mascota-id').value = m.id;
    document.getElementById('m-nombre').value = m.nombre;
    document.getElementById('m-tipo').value = m.tipo;
    document.getElementById('m-raza').value = m.raza || '';
    document.getElementById('m-fecha').value = m.fechaNacimiento || '';
    document.getElementById('m-peso').value = m.peso || '';
    document.getElementById('m-color').value = m.color || '';
    document.getElementById('m-microchip').value = m.microchip || '';

    document.getElementById('modalAltaMascota').querySelector('.modal-title').innerHTML = `<i class="bi bi-pencil text-primary me-2"></i>Editar a ${m.nombre}`;
    document.getElementById('alerta-duplicado').classList.add('d-none');

    const modal = new bootstrap.Modal(document.getElementById('modalAltaMascota'));
    modal.show();
}

window.abrirModalAlta = abrirModalAlta;
window.abrirModalEditar = abrirModalEditar;
