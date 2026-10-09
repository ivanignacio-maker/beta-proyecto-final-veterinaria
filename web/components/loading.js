/**
 * Componente Loading
 * Proporciona indicadores de carga para distintas áreas
 */
window.LoadingComponent = {
    /**
     * Genera HTML para un skeleton loader
     * @param {string} type Tipo de skeleton
     * @param {number} count Cantidad
     * @returns {string} HTML
     */
    skeleton: function(type = 'text', count = 1) {
        let html = '';
        for (let i = 0; i < count; i++) {
            if (type === 'card') {
                html += `
                <div class="card border-0 shadow-sm mb-3 skeleton-card placeholder-glow">
                    <div class="card-body">
                        <div class="placeholder col-6 placeholder-lg mb-3 rounded"></div>
                        <div class="placeholder col-4 mb-2 rounded"></div>
                        <div class="placeholder col-8 mb-2 rounded"></div>
                        <div class="d-flex justify-content-end mt-3"><div class="placeholder col-3 placeholder-lg rounded"></div></div>
                    </div>
                </div>`;
            } else if (type === 'table-row') {
                html += `
                <tr class="placeholder-glow">
                    <td><span class="placeholder col-8 rounded"></span></td>
                    <td><span class="placeholder col-6 rounded"></span></td>
                    <td><span class="placeholder col-10 rounded"></span></td>
                    <td><span class="placeholder col-4 rounded"></span></td>
                </tr>`;
            } else {
                html += `<p class="placeholder-glow mb-2"><span class="placeholder col-${Math.floor(Math.random() * 5) + 6} rounded"></span></p>`;
            }
        }
        return html;
    },

    /**
     * Spinner circular
     */
    spinner: function(size = 'md', color = 'primary') {
        const sizeClass = size === 'sm' ? 'spinner-border-sm' : (size === 'lg' ? 'spinner-border-lg' : '');
        return `<div class="spinner-border text-${color} ${sizeClass}" role="status"><span class="visually-hidden">Cargando...</span></div>`;
    },

    /**
     * Overlay de carga para un contenedor específico
     */
    overlay: function(containerId, show) {
        const container = document.getElementById(containerId);
        if (!container) return;
        
        let overlay = container.querySelector('.loading-overlay');
        
        if (show) {
            container.style.position = container.style.position || 'relative';
            if (!overlay) {
                overlay = document.createElement('div');
                overlay.className = 'loading-overlay d-flex justify-content-center align-items-center rounded';
                overlay.style.cssText = 'position: absolute; inset: 0; background: rgba(255,255,255,0.7); z-index: 10; backdrop-filter: blur(2px);';
                overlay.innerHTML = this.spinner('lg', 'primary');
                container.appendChild(overlay);
            }
        } else if (overlay) {
            overlay.remove();
        }
    },

    /**
     * Loading inline
     */
    inline: function(text = 'Cargando...') {
        return `<span class="d-inline-flex align-items-center gap-2">${this.spinner('sm')} ${text}</span>`;
    },

    /**
     * Full page loading
     */
    page: function() {
        if (!document.getElementById('pageLoader')) {
            const loaderHtml = `
                <div id="pageLoader" class="position-fixed inset-0 d-flex flex-column justify-content-center align-items-center bg-white" style="z-index: 9999; top:0; bottom:0; left:0; right:0;">
                    ${this.spinner('lg', 'primary')}
                    <h5 class="mt-3 text-primary fw-bold">Cargando VetCare...</h5>
                </div>
            `;
            document.body.insertAdjacentHTML('beforeend', loaderHtml);
        }
    },

    /**
     * Remove full page loading
     */
    removePage: function() {
        const loader = document.getElementById('pageLoader');
        if (loader) {
            loader.style.opacity = '0';
            loader.style.transition = 'opacity 0.3s ease';
            setTimeout(() => loader.remove(), 300);
        }
    }
};
