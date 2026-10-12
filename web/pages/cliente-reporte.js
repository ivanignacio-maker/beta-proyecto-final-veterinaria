/**
 * Lógica del Formulario Fallback del Dueño
 */

let misMascotas = [];

document.addEventListener('DOMContentLoaded', async () => {
    if (window.auth) window.auth.requireAuth('CLIENTE');

    if (window.HeaderComponent) window.HeaderComponent.render('header-container');
    if (window.SidebarComponent) window.SidebarComponent.render('sidebar-container');
    if (window.FooterComponent) window.FooterComponent.render('footer-container');

    await inicializarFormulario();
});

async function inicializarFormulario() {
    try {
        const res = await window.api.getMisMascotas();
        misMascotas = res.data || [];

        const selectMascota = document.getElementById('rep-mascota');
        if (selectMascota) {
            selectMascota.innerHTML = '<option value="" disabled selected>Seleccioná qué mascota fue atendida...</option>';
            misMascotas.forEach(m => {
                selectMascota.innerHTML += `<option value="${m.id}">${m.nombre} (${m.tipo} - ${m.raza || 'Mestizo'})</option>`;
            });

            // Si vino preseleccionada por query param
            const paramId = new URLSearchParams(window.location.search).get('mascotaId');
            if (paramId) {
                selectMascota.value = paramId;
            }
        }

        const fechaInput = document.getElementById('rep-fecha');
        if (fechaInput) {
            fechaInput.value = new Date().toISOString().split('T')[0];
        }

        setupSubmit();

    } catch (err) {
        console.error('Error inicializando reporte:', err);
    }
}

function setupSubmit() {
    const form = document.getElementById('form-reporte-dueno');
    if (!form) return;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const mascotaId = document.getElementById('rep-mascota').value;
        const fecha = document.getElementById('rep-fecha').value;
        const clinica = document.getElementById('rep-clinica').value.trim();
        const procedimiento = document.getElementById('rep-procedimiento').value.trim();
        const medicamentos = document.getElementById('rep-medicamentos').value.trim();
        const observaciones = document.getElementById('rep-observaciones').value.trim();

        if (!mascotaId || !fecha || !procedimiento) {
            alert('Por favor completá los campos obligatorios (*).');
            return;
        }

        const btnSubmit = document.getElementById('btn-submit-reporte');
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Guardando...';

        try {
            await window.api.registrarReporteDueño(mascotaId, {
                fecha,
                clinica: clinica || 'Atención no verificada',
                procedimiento,
                medicamentos,
                observaciones
            });

            if (window.ToastComponent) {
                window.ToastComponent.show({ 
                    message: 'Atención agregada con éxito a la historia clínica.', 
                    type: 'success' 
                });
            }

            // Redirigir a la historia clínica de la mascota
            setTimeout(() => {
                window.location.href = `cliente-mascota-detalle.html?id=${mascotaId}`;
            }, 800);

        } catch (err) {
            alert('Error al guardar reporte: ' + err.message);
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = '<i class="bi bi-check-circle me-1"></i>Guardar en la Historia Clínica';
        }
    });
}
