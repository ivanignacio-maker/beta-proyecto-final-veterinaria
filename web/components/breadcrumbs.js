/**
 * Componente Breadcrumbs
 * Genera la navegación de migas de pan
 */
window.BreadcrumbsComponent = {
    /**
     * Renderiza breadcrumbs
     * @param {string} containerId Contenedor ID
     * @param {Array} items Lista de items {label, href, active}
     */
    render: function(containerId, items) {
        const container = document.getElementById(containerId);
        if (!container || !items || !items.length) return;

        let html = `
            <nav aria-label="breadcrumb">
                <ol class="breadcrumb breadcrumb-custom mb-4 bg-transparent p-0">
        `;

        items.forEach((item, index) => {
            const isLast = index === items.length - 1;
            const isActive = item.active || isLast;
            
            if (isActive) {
                html += `<li class="breadcrumb-item active text-dark fw-semibold" aria-current="page">${item.label}</li>`;
            } else {
                html += `<li class="breadcrumb-item"><a href="${item.href || '#'}" class="text-decoration-none text-muted">${item.label}</a></li>`;
            }
        });

        html += `
                </ol>
            </nav>
            <style>
                .breadcrumb-custom .breadcrumb-item + .breadcrumb-item::before {
                    content: "›"; /* bi-chevron-right eq */
                    font-size: 1.2rem;
                    line-height: 1;
                    vertical-align: middle;
                    color: var(--color-text-secondary, #64748B);
                }
                .breadcrumb-custom a:hover { color: var(--color-primary, #2563EB) !important; }
            </style>
        `;

        container.innerHTML = html;
    }
};
