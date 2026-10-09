/**
 * Lógica para la vista de Historia Clínica Externa
 */
document.addEventListener('DOMContentLoaded', async () => {
    
    // 1. Verificar sesión externa
    const sessionDataStr = sessionStorage.getItem('vetcare_external_session');
    if (!sessionDataStr) {
        window.location.href = 'acceso.html';
        return;
    }
    
    const sessionData = JSON.parse(sessionDataStr);
    document.getElementById('banner-clinica-name').textContent = sessionData.clinica;

    // Verificar si ya se envió el informe en esta sesión
    if (sessionData.informeEnviado) {
        mostrarEstadoEnviado();
    }

    // 2. Cargar datos (Mock)
    await cargarDatosMascota(sessionData.mascotaId);

    // 3. Configurar formulario de informe
    configurarFormulario(sessionData);

    // 4. Configurar botones de finalización de acceso
    document.getElementById('btn-finalizar-acceso').addEventListener('click', finalizarAcceso);
    document.getElementById('btn-finalizar-acceso-2').addEventListener('click', finalizarAcceso);
});

async function cargarDatosMascota(mascotaId) {
    const loadingState = document.getElementById('loading-state');
    const contentLoaded = document.getElementById('content-loaded');

    // Simular retardo de red
    await new Promise(resolve => setTimeout(resolve, 800));

    // Datos Mock
    const mascotaMock = {
        nombre: 'Boby',
        especie: 'Perro',
        raza: 'Golden Retriever',
        edad: '4 años',
        peso: '32 kg',
        color: 'Dorado',
        propietario: 'María Pérez',
        eventos: [
            { fecha: '2023-09-15', tipo: 'Consulta general', detalle: 'Control anual y desparasitación.', clinica: 'Vet Center' },
            { fecha: '2023-01-10', tipo: 'Vacunación', detalle: 'Vacuna quíntuple y rabia.', clinica: 'Vet Center' },
            { fecha: '2022-05-20', tipo: 'Cirugía', detalle: 'Castración.', clinica: 'Clínica Veterinaria Central' }
        ]
    };

    // Rellenar cabecera
    document.getElementById('pet-name').textContent = mascotaMock.nombre;
    document.getElementById('pet-species').textContent = mascotaMock.especie;
    document.getElementById('pet-breed').textContent = mascotaMock.raza;
    document.getElementById('pet-age').textContent = mascotaMock.edad;
    document.getElementById('pet-weight').textContent = mascotaMock.peso;
    document.getElementById('pet-color').textContent = mascotaMock.color;
    document.getElementById('pet-owner').textContent = mascotaMock.propietario;

    const icon = document.getElementById('pet-icon');
    icon.className = mascotaMock.especie.toLowerCase() === 'perro' ? 'bi bi-suit-heart-fill fs-1' : 'bi bi-heptagon-fill fs-1';

    // Rellenar Timeline (Mock fallback manual para que no falle si no hay componente)
    renderTimelineMock(mascotaMock.eventos);

    loadingState.classList.add('d-none');
    contentLoaded.classList.remove('d-none');
}

function renderTimelineMock(eventos) {
    const container = document.getElementById('timeline-container');
    
    // Si TimelineComponent global existiera, lo usaríamos así:
    // if(window.TimelineComponent) { TimelineComponent.render(container, eventos, {readOnly: true}); return; }

    if (!eventos || eventos.length === 0) {
        container.innerHTML = '<p class="text-muted text-center py-3">No hay historial clínico previo.</p>';
        return;
    }

    let html = '<div class="timeline-mock">';
    eventos.forEach(evt => {
        let badgeColor = 'bg-secondary';
        if (evt.tipo.toLowerCase().includes('vacuna')) badgeColor = 'bg-success';
        if (evt.tipo.toLowerCase().includes('cirugía')) badgeColor = 'bg-danger';
        if (evt.tipo.toLowerCase().includes('consulta')) badgeColor = 'bg-primary';

        html += `
            <div class="timeline-item">
                <div class="d-flex justify-content-between align-items-center mb-1">
                    <span class="badge ${badgeColor}">${evt.tipo}</span>
                    <small class="text-muted fw-bold">${evt.fecha}</small>
                </div>
                <p class="mb-1">${evt.detalle}</p>
                <small class="text-muted"><i class="bi bi-hospital me-1"></i> Origen: ${evt.clinica}</small>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

function configurarFormulario(sessionData) {
    const form = document.getElementById('informe-form');
    const fechaInput = document.getElementById('informe-fecha');
    const btnSubmit = document.getElementById('btn-submit-informe');
    const errorDiv = document.getElementById('informe-error');

    // Default: hoy
    const hoy = new Date().toISOString().split('T')[0];
    fechaInput.value = hoy;

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        errorDiv.classList.add('d-none');

        const meds = document.getElementById('informe-medicamentos').value.trim();
        const procs = document.getElementById('informe-procedimientos').value.trim();
        const ests = document.getElementById('informe-estudios').value.trim();

        // Validar que al menos un textarea de los 3 principales tenga contenido
        if (!meds && !procs && !ests) {
            errorDiv.classList.remove('d-none');
            return;
        }

        // Simular envío
        btnSubmit.disabled = true;
        btnSubmit.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span> Enviando...';

        try {
            await new Promise(r => setTimeout(r, 1500)); // mock delay
            
            // Marcar como enviado en sessionStorage
            sessionData.informeEnviado = true;
            sessionStorage.setItem('vetcare_external_session', JSON.stringify(sessionData));

            mostrarEstadoEnviado();
        } catch (error) {
            alert('Error al enviar el informe. Intenta nuevamente.');
            btnSubmit.disabled = false;
            btnSubmit.innerHTML = '<i class="bi bi-send me-2"></i> Enviar informe';
        }
    });
}

function mostrarEstadoEnviado() {
    document.getElementById('informe-container').classList.add('d-none');
    document.getElementById('informe-enviado').classList.remove('d-none');
    
    const badge = document.getElementById('badge-codigo');
    if (badge) {
        badge.className = 'badge bg-secondary mt-3 mt-md-0';
        badge.textContent = 'Código Usado';
    }
}

function finalizarAcceso() {
    // Confirmar si el formulario no fue enviado
    const sessionData = JSON.parse(sessionStorage.getItem('vetcare_external_session') || '{}');
    if (!sessionData.informeEnviado) {
        const confirmar = confirm("¿Estás seguro de finalizar el acceso sin enviar el informe de atención?");
        if (!confirmar) return;
    }

    sessionStorage.removeItem('vetcare_external_session');
    window.location.href = 'index.html';
}
