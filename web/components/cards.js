/**
 * Componente Cards
 * Generador de tarjetas comunes para el sistema.
 */
window.CardsComponent = {
    /**
     * Tarjeta de estadística (Dashboard)
     */
    statCard: function(options) {
        const { icon, iconBg = 'bg-primary', value, label, trend, trendUp = true } = options;
        
        let trendHtml = '';
        if (trend) {
            const trendColor = trendUp ? 'text-success' : 'text-danger';
            const trendIcon = trendUp ? 'bi-arrow-up-right' : 'bi-arrow-down-right';
            trendHtml = `<div class="mt-2 small"><span class="${trendColor} fw-bold"><i class="bi ${trendIcon} me-1"></i>${trend}</span> <span class="text-muted">vs último mes</span></div>`;
        }

        return `
            <div class="card border-0 shadow-sm h-100 stat-card">
                <div class="card-body p-4">
                    <div class="d-flex justify-content-between align-items-start">
                        <div>
                            <p class="text-muted text-uppercase small fw-bold mb-1">${label}</p>
                            <h3 class="fw-bold mb-0 text-dark">${value}</h3>
                        </div>
                        <div class="rounded-circle ${iconBg} bg-opacity-10 p-3 d-flex align-items-center justify-content-center" style="width: 48px; height: 48px;">
                            <i class="bi ${icon} fs-4 text-${iconBg.replace('bg-','')}"></i>
                        </div>
                    </div>
                    ${trendHtml}
                </div>
            </div>
            <style>
                .stat-card { transition: transform 0.2s, box-shadow 0.2s; }
                .stat-card:hover { transform: translateY(-3px); box-shadow: 0 .5rem 1rem rgba(0,0,0,.15)!important; }
            </style>
        `;
    },

    /**
     * Tarjeta de mascota
     */
    petCard: function(pet) {
        const typeIcon = pet.type === 'Gato' ? 'bi-bug' : 'bi-bug'; // Idealmente icono de animal
        
        return `
            <div class="card border-0 shadow-sm h-100">
                <div class="card-body">
                    <div class="d-flex align-items-center gap-3 mb-3">
                        <div class="bg-primary bg-opacity-10 text-primary rounded-circle d-flex align-items-center justify-content-center fs-3" style="width: 60px; height: 60px;">
                            <i class="bi bi-heart-fill"></i>
                        </div>
                        <div>
                            <h5 class="fw-bold mb-1 text-dark">${pet.name}</h5>
                            <span class="badge bg-light text-secondary border"><i class="bi ${typeIcon} me-1"></i>${pet.type}</span>
                        </div>
                    </div>
                    <ul class="list-unstyled small text-muted mb-4">
                        <li class="mb-2"><i class="bi bi-info-circle me-2"></i><strong>Raza:</strong> ${pet.breed || 'Mestizo'}</li>
                        <li class="mb-2"><i class="bi bi-calendar3 me-2"></i><strong>Edad:</strong> ${pet.age || 'Desconocida'}</li>
                        <li class="mb-2"><i class="bi bi-person me-2"></i><strong>Dueño:</strong> ${pet.owner || 'No especificado'}</li>
                    </ul>
                    <a href="mascota-detalle.html?id=${pet.id}" class="btn btn-outline-primary w-100">Ver historia clínica</a>
                </div>
            </div>
        `;
    },

    /**
     * Tarjeta de cliente
     */
    clientCard: function(client) {
        const initials = client.name ? client.name.substring(0, 2).toUpperCase() : 'CL';
        
        return `
            <div class="card border-0 shadow-sm">
                <div class="card-body d-flex align-items-center justify-content-between p-3">
                    <div class="d-flex align-items-center gap-3">
                        <div class="bg-secondary bg-opacity-10 text-secondary rounded-circle d-flex align-items-center justify-content-center fw-bold fs-5" style="width: 48px; height: 48px;">
                            ${initials}
                        </div>
                        <div>
                            <h6 class="fw-bold mb-1">${client.name}</h6>
                            <p class="text-muted small mb-0"><i class="bi bi-envelope me-1"></i>${client.email}</p>
                        </div>
                    </div>
                    <div class="text-end">
                        <div class="small fw-bold text-dark mb-1"><i class="bi bi-hearts text-danger me-1"></i> ${client.petCount} Mascotas</div>
                        <button class="btn btn-sm btn-light border">Ver ficha</button>
                    </div>
                </div>
            </div>
        `;
    },

    appointmentCard: function(appointment) {
        return `<div class="card border-0 shadow-sm p-3 mb-2"><h6 class="mb-1">${appointment.petName}</h6><p class="small text-muted mb-0">${appointment.date} - ${appointment.reason}</p></div>`;
    },

    accessRequestCard: function(request) {
        return `<div class="card border-0 shadow-sm p-3 mb-2"><h6 class="mb-1">${request.clinic}</h6><p class="small text-muted mb-0">Mascota: ${request.petName}</p></div>`;
    }
};
