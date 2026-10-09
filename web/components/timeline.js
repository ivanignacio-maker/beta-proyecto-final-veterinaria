/**
 * Componente Timeline
 * Presenta eventos de historia clínica cronológicamente.
 */
window.TimelineComponent = {
    _types: {
        'consulta': { icon: 'bi-clipboard-pulse', color: '#2563EB', bg: 'bg-primary' },
        'vacuna': { icon: 'bi-shield-plus', color: '#059669', bg: 'bg-success' },
        'estudio': { icon: 'bi-file-earmark-medical', color: '#0891B2', bg: 'bg-info' },
        'informe': { icon: 'bi-file-text', color: '#7C3AED', bg: 'bg-secondary' } // purple
    },

    /**
     * Renderiza el timeline
     */
    render: function(containerId, events, options = {}) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const { readOnly = false, showOrigin = true, showFilters = true } = options;

        if (!events || events.length === 0) {
            if (window.EmptyStateComponent) {
                container.innerHTML = window.EmptyStateComponent.noClinicalHistory();
            } else {
                container.innerHTML = `<p class="text-center text-muted">No hay eventos registrados.</p>`;
            }
            return;
        }

        let html = '';

        if (showFilters) {
            html += `
                <div class="timeline-filters d-flex gap-2 mb-4 overflow-auto pb-2">
                    <button class="btn btn-primary btn-sm rounded-pill px-3" onclick="window.TimelineComponent.filter('${containerId}', 'todos')">Todos</button>
                    <button class="btn btn-outline-secondary btn-sm rounded-pill px-3" onclick="window.TimelineComponent.filter('${containerId}', 'consulta')">Consultas</button>
                    <button class="btn btn-outline-secondary btn-sm rounded-pill px-3" onclick="window.TimelineComponent.filter('${containerId}', 'vacuna')">Vacunas</button>
                    <button class="btn btn-outline-secondary btn-sm rounded-pill px-3" onclick="window.TimelineComponent.filter('${containerId}', 'estudio')">Estudios</button>
                    <button class="btn btn-outline-secondary btn-sm rounded-pill px-3" onclick="window.TimelineComponent.filter('${containerId}', 'informe')">Informes</button>
                </div>
            `;
        }

        html += `<div class="timeline position-relative ps-4" style="border-left: 2px solid var(--color-border, #E2E8F0);">`;

        events.forEach(event => {
            const typeConfig = this._types[event.type] || this._types['informe'];
            let badgeOrigin = '';
            
            if (showOrigin && window.BadgesComponent) {
                badgeOrigin = window.BadgesComponent.origin(event.origin);
            }

            let alertHtml = '';
            if (event.origin === 'cliente_formulario') {
                alertHtml = `
                    <div class="alert alert-warning py-2 px-3 mt-3 mb-0 d-flex align-items-center gap-2 small border-0 bg-warning bg-opacity-10">
                        <i class="bi bi-exclamation-triangle-fill text-warning"></i>
                        <span>Información reportada por el dueño. No verificada por un profesional.</span>
                    </div>
                `;
            }

            let actionsHtml = '';
            if (!readOnly) {
                actionsHtml = `
                    <div class="dropdown">
                        <button class="btn btn-sm btn-light p-1" type="button" data-bs-toggle="dropdown"><i class="bi bi-three-dots-vertical"></i></button>
                        <ul class="dropdown-menu dropdown-menu-end shadow-sm">
                            <li><a class="dropdown-item" href="#"><i class="bi bi-pencil me-2"></i>Editar</a></li>
                            <li><a class="dropdown-item text-danger" href="#"><i class="bi bi-trash me-2"></i>Eliminar</a></li>
                        </ul>
                    </div>
                `;
            }

            html += `
                <div class="timeline-item position-relative mb-4" data-type="${event.type}">
                    <div class="timeline-point position-absolute ${typeConfig.bg} rounded-circle text-white d-flex align-items-center justify-content-center shadow-sm" style="width: 32px; height: 32px; left: -41px; top: 0; z-index: 2;">
                        <i class="bi ${typeConfig.icon} small"></i>
                    </div>
                    <div class="card timeline-card border-0 shadow-sm" style="border-left: 4px solid ${typeConfig.color} !important;">
                        <div class="card-header bg-white border-bottom-0 pt-3 pb-0 d-flex justify-content-between align-items-start">
                            <div class="d-flex flex-wrap gap-2 align-items-center">
                                <h6 class="fw-bold mb-0 text-dark">${event.title || 'Evento'}</h6>
                                <span class="badge ${typeConfig.bg} bg-opacity-10 text-dark border">${event.type.charAt(0).toUpperCase() + event.type.slice(1)}</span>
                                ${badgeOrigin}
                            </div>
                            <div class="d-flex align-items-center gap-3">
                                <span class="text-muted small fw-medium"><i class="bi bi-calendar3 me-1"></i>${event.date}</span>
                                ${actionsHtml}
                            </div>
                        </div>
                        <div class="card-body py-3">
                            <p class="card-text text-secondary mb-2">${event.description}</p>
                            ${event.observations ? `<p class="card-text small text-muted fst-italic mb-0"><i class="bi bi-chat-left-text me-1"></i>${event.observations}</p>` : ''}
                            ${alertHtml}
                        </div>
                        <div class="card-footer bg-light bg-opacity-50 border-top-0 d-flex flex-wrap gap-3 py-2 small text-muted">
                            ${event.professional ? `<span><i class="bi bi-person-badge me-1"></i>${event.professional}</span>` : ''}
                            ${event.clinic ? `<span><i class="bi bi-hospital me-1"></i>${event.clinic}</span>` : ''}
                        </div>
                    </div>
                </div>
            `;
        });

        html += `</div>`;
        container.innerHTML = html;
        container.__timelineData = { events, options };
    },

    filter: function(containerId, type) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const items = container.querySelectorAll('.timeline-item');
        const buttons = container.querySelectorAll('.timeline-filters button');

        // Update active button state
        buttons.forEach(btn => {
            if (btn.innerText.toLowerCase().includes(type.toLowerCase()) || (type === 'todos' && btn.innerText === 'Todos')) {
                btn.classList.replace('btn-outline-secondary', 'btn-primary');
            } else {
                btn.classList.replace('btn-primary', 'btn-outline-secondary');
            }
        });

        // Filter items
        items.forEach(item => {
            if (type === 'todos' || item.getAttribute('data-type') === type) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    },

    addEvent: function(containerId, event) {
        // Implementación simplificada para añadir un evento arriba
        console.log('Añadiendo evento a timeline', event);
    }
};
