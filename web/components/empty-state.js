/**
 * Componente EmptyState
 * Maneja las vistas de estado vacío para listas o contenedores sin datos.
 */
window.EmptyStateComponent = {
    /**
     * Renderiza un empty state
     * @param {Object} options Opciones de renderizado
     * @returns {string} HTML del empty state
     */
    render: function(options) {
        const {
            icon = 'bi-inbox',
            title = 'Sin resultados',
            description = 'No hay información para mostrar en este momento.',
            actionText = null,
            actionHref = '#',
            actionOnClick = null
        } = options;

        let actionHtml = '';
        if (actionText) {
            const onClickAttr = actionOnClick ? `onclick="${actionOnClick}"` : '';
            actionHtml = `<a href="${actionHref}" class="btn btn-primary mt-3" ${onClickAttr}>${actionText}</a>`;
        }

        return `
            <div class="empty-state d-flex flex-column align-items-center justify-content-center text-center p-5 bg-white rounded border border-dashed">
                <div class="empty-state-icon bg-light rounded-circle d-flex align-items-center justify-content-center mb-3 text-muted" style="width: 80px; height: 80px;">
                    <i class="bi ${icon} display-4"></i>
                </div>
                <h4 class="fw-bold text-dark mb-2">${title}</h4>
                <p class="text-muted mb-0" style="max-width: 400px;">${description}</p>
                ${actionHtml}
            </div>
            <style>
                .border-dashed { border-style: dashed !important; border-width: 2px !important; border-color: var(--color-border, #E2E8F0) !important; }
            </style>
        `;
    },

    // Templates predefinidos
    noResults: function() {
        return this.render({
            icon: 'bi-search',
            title: 'No se encontraron resultados',
            description: 'Intenta ajustar los filtros de búsqueda o cambiar los términos.'
        });
    },

    noData: function(entity = 'datos') {
        return this.render({
            icon: 'bi-inbox',
            title: `No hay ${entity} registrados`,
            description: `Aún no se han agregado ${entity} al sistema.`
        });
    },

    noAccess: function() {
        return this.render({
            icon: 'bi-shield-lock',
            title: 'Acceso restringido',
            description: 'No tienes permisos suficientes para ver esta información.'
        });
    },

    noClinicalHistory: function() {
        return this.render({
            icon: 'bi-clipboard-pulse',
            title: 'Sin historia clínica',
            description: 'Esta mascota aún no tiene eventos clínicos registrados.'
        });
    },

    noAppointments: function() {
        return this.render({
            icon: 'bi-calendar-x',
            title: 'No hay turnos',
            description: 'No hay turnos programados para la fecha seleccionada.'
        });
    }
};
