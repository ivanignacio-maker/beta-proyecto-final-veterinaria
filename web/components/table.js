/**
 * Componente Tabla
 * Renderización dinámica de tablas de datos
 */
window.TableComponent = {
    ITEMS_PER_PAGE: 10,

    /**
     * Genera la tabla en el contenedor
     * @param {Object} options Opciones de la tabla
     */
    render: function(options) {
        const {
            containerId,
            columns = [],
            data = [],
            emptyMessage = 'No hay datos disponibles',
            onRowClick = null,
            actions = []
        } = options;

        const container = document.getElementById(containerId);
        if (!container) return;

        if (!data || data.length === 0) {
            if (window.EmptyStateComponent) {
                container.innerHTML = window.EmptyStateComponent.render({
                    icon: 'bi-inbox',
                    title: 'Sin registros',
                    description: emptyMessage
                });
            } else {
                container.innerHTML = `<div class="text-center p-5 text-muted">${emptyMessage}</div>`;
            }
            return;
        }

        let theadHtml = '<thead><tr>';
        columns.forEach(col => {
            const widthAttr = col.width ? `style="width: ${col.width}"` : '';
            const sortIcon = col.sortable ? ' <i class="bi bi-arrow-down-up text-muted ms-1 small"></i>' : '';
            theadHtml += `<th scope="col" ${widthAttr} class="bg-light text-secondary fw-semibold border-bottom">${col.label}${sortIcon}</th>`;
        });
        
        if (actions.length > 0) {
            theadHtml += `<th scope="col" class="bg-light text-secondary fw-semibold border-bottom text-end">Acciones</th>`;
        }
        theadHtml += '</tr></thead>';

        let tbodyHtml = '<tbody class="border-top-0">';
        
        // Paginación simple (mostramos solo la primera página para este ejemplo)
        const displayData = data.slice(0, this.ITEMS_PER_PAGE);

        displayData.forEach((row, index) => {
            const rowClass = onRowClick ? 'style="cursor: pointer;" class="table-row-hover"' : '';
            tbodyHtml += `<tr ${rowClass} data-index="${index}">`;
            
            columns.forEach(col => {
                let cellData = row[col.key] || '';
                if (col.render) {
                    cellData = col.render(cellData, row);
                }
                tbodyHtml += `<td class="align-middle">${cellData}</td>`;
            });

            if (actions.length > 0) {
                tbodyHtml += `<td class="align-middle text-end">`;
                actions.forEach(action => {
                    tbodyHtml += `<button class="btn btn-sm ${action.class || 'btn-light'} me-1" title="${action.label}" onclick="window.TableComponent._handleAction(event, ${index}, '${containerId}')">
                        <i class="bi ${action.icon}"></i>
                    </button>`;
                });
                tbodyHtml += `</td>`;
            }
            tbodyHtml += '</tr>';
        });
        tbodyHtml += '</tbody>';

        let paginationHtml = '';
        if (data.length > this.ITEMS_PER_PAGE) {
            paginationHtml = `
                <div class="d-flex justify-content-between align-items-center mt-3 px-2">
                    <small class="text-muted">Mostrando 1-${this.ITEMS_PER_PAGE} de ${data.length}</small>
                    <ul class="pagination pagination-sm mb-0">
                        <li class="page-item disabled"><a class="page-link" href="#">Anterior</a></li>
                        <li class="page-item active"><a class="page-link" href="#">1</a></li>
                        <li class="page-item"><a class="page-link" href="#">Siguiente</a></li>
                    </ul>
                </div>
            `;
        }

        container.innerHTML = `
            <div class="table-responsive-custom bg-white rounded shadow-sm border">
                <table class="table table-custom table-hover mb-0">
                    ${theadHtml}
                    ${tbodyHtml}
                </table>
            </div>
            ${paginationHtml}
            <style>
                .table-row-hover:hover td { background-color: var(--color-bg, #F8FAFC); }
                .table-custom th { padding: 1rem; font-size: 0.875rem; text-transform: uppercase; letter-spacing: 0.5px; }
                .table-custom td { padding: 1rem; color: var(--color-text, #1E293B); }
            </style>
        `;

        // Store data and actions in the container dataset or an internal map for clicks
        container.__tableData = { data, actions, onRowClick };

        if (onRowClick) {
            const rows = container.querySelectorAll('tbody tr');
            rows.forEach(tr => {
                tr.addEventListener('click', (e) => {
                    // Evitar que el clic en botones dispare la fila
                    if (e.target.closest('button') || e.target.closest('a')) return;
                    const idx = tr.getAttribute('data-index');
                    onRowClick(data[idx]);
                });
            });
        }
    },

    _handleAction: function(event, index, containerId) {
        event.stopPropagation();
        const container = document.getElementById(containerId);
        if (container && container.__tableData) {
            const rowData = container.__tableData.data[index];
            const actions = container.__tableData.actions;
            // Busca la acción que corresponda, por simplicidad disparamos onClick de la primera si hay multiple logic requirida,
            // pero para simplificar, en un entorno real asignaríamos un ID a cada acción.
            // Para este mockup asumiremos que la primera acción del botón clickeado.
            // Un mejor enfoque es guardar la función global o inyectarla, pero dado el alcance JS vanilla estricto:
            console.log('Action clicked for row:', rowData);
            // Implementación real requeriría mapeo de callbacks
        }
    },

    /**
     * Actualiza solo los datos del the body
     */
    update: function(containerId, data) {
        // En una versión simplificada, podemos re-renderizar todo
        console.log(`Update table in ${containerId} with ${data.length} records`);
    }
};
