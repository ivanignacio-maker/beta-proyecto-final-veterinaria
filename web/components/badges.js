/**
 * Componente Badges
 * Maneja la presentación visual de estados y etiquetas.
 */
window.BadgesComponent = {
    /**
     * Retorna badge de estado
     * @param {string} estado Estado del elemento
     * @returns {string} HTML del badge
     */
    status: function(estado) {
        let colorClass = 'bg-secondary';
        let text = estado || 'Desconocido';

        const statusMap = {
            'pendiente': { color: 'bg-warning text-dark', label: 'Pendiente' },
            'aprobado': { color: 'bg-success', label: 'Aprobado' },
            'confirmado': { color: 'bg-primary', label: 'Confirmado' },
            'revocado': { color: 'bg-danger', label: 'Revocado' },
            'cancelado': { color: 'bg-danger', label: 'Cancelado' },
            'realizado': { color: 'bg-success', label: 'Realizado' },
            'activo': { color: 'bg-success', label: 'Activo' },
            'usado': { color: 'bg-secondary', label: 'Usado' },
            'expirado': { color: 'bg-dark', label: 'Expirado' }
        };

        const key = String(estado).toLowerCase();
        if (statusMap[key]) {
            colorClass = statusMap[key].color;
            text = statusMap[key].label;
        }

        return `<span class="badge rounded-pill ${colorClass} px-3 py-2 fw-medium border">${text}</span>`;
    },

    /**
     * Retorna badge de origen
     * @param {string} origen Origen de los datos
     * @returns {string} HTML del badge
     */
    origin: function(origen) {
        const originMap = {
            'veterinaria_interna': { label: 'Veterinaria interna', color: 'text-primary bg-primary bg-opacity-10', icon: 'bi-building' },
            'veterinaria_externa_codigo': { label: 'Veterinaria externa', color: 'text-info bg-info bg-opacity-10', icon: 'bi-key' },
            'cliente_formulario': { label: 'Reportado por dueño (No verificado)', color: 'text-warning bg-warning bg-opacity-10', icon: 'bi-exclamation-triangle' }
        };

        const config = originMap[origen] || { label: origen, color: 'text-secondary bg-secondary bg-opacity-10', icon: 'bi-circle' };
        
        return `<span class="badge rounded-pill border-0 ${config.color} d-inline-flex align-items-center gap-1 px-3 py-2">
            <i class="bi ${config.icon}"></i> ${config.label}
        </span>`;
    },

    /**
     * Retorna badge del tipo de mascota
     * @param {string} tipo Tipo de mascota (perro, gato, etc)
     * @returns {string} HTML del badge
     */
    petType: function(tipo) {
        const typeMap = {
            'perro': { icon: 'bi-bug', color: 'text-success bg-success bg-opacity-10' }, // Idealmente bi-dog si existiera
            'gato': { icon: 'bi-bug', color: 'text-warning bg-warning bg-opacity-10' },
            'conejo': { icon: 'bi-flower1', color: 'text-pink bg-pink bg-opacity-10' },
            'ave': { icon: 'bi-twitter', color: 'text-info bg-info bg-opacity-10' }
        };

        const config = typeMap[String(tipo).toLowerCase()] || { icon: 'bi-heart', color: 'text-secondary bg-light' };
        
        return `<span class="badge ${config.color} border px-2 py-1"><i class="bi ${config.icon} me-1"></i>${tipo}</span>`;
    },

    /**
     * Retorna badge numérico (contador)
     * @param {number} number Número a mostrar
     * @param {string} variant Variante de color (primary, danger, etc)
     * @returns {string} HTML del badge
     */
    count: function(number, variant = 'primary') {
        return `<span class="badge bg-${variant} rounded-circle p-2 d-inline-flex align-items-center justify-content-center" style="width: 24px; height: 24px; font-size: 0.75rem;">${number}</span>`;
    }
};
