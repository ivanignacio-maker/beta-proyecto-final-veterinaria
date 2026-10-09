/**
 * Componente Toast
 * Manejo de notificaciones (toasts) globales
 */
window.ToastComponent = {
    /**
     * Inicializa el contenedor de toasts
     */
    init: function() {
        if (!document.getElementById('toastContainer')) {
            const containerHtml = `
                <div id="toastContainer" class="toast-container position-fixed top-0 end-0 p-3" style="z-index: 1080;"></div>
            `;
            document.body.insertAdjacentHTML('beforeend', containerHtml);
        }
    },

    /**
     * Muestra un toast
     * @param {Object} options Opciones del toast
     */
    show: function(options) {
        this.init();
        
        const {
            message = '',
            type = 'info', // success, error, warning, info
            duration = 4000
        } = options;

        const container = document.getElementById('toastContainer');
        const toastId = 'toast_' + Date.now();
        
        let icon = 'bi-info-circle-fill';
        let colorClass = 'text-info';
        let bgClass = 'bg-white';

        if (type === 'success') {
            icon = 'bi-check-circle-fill';
            colorClass = 'text-success';
        } else if (type === 'error') {
            icon = 'bi-x-circle-fill';
            colorClass = 'text-danger';
        } else if (type === 'warning') {
            icon = 'bi-exclamation-triangle-fill';
            colorClass = 'text-warning';
        }

        const toastHtml = `
            <div id="${toastId}" class="toast align-items-center shadow-sm border-0 ${bgClass} slide-in-right" role="alert" aria-live="assertive" aria-atomic="true" data-bs-delay="${duration}">
                <div class="d-flex p-2">
                    <div class="toast-body d-flex align-items-center fw-medium gap-2">
                        <i class="bi ${icon} fs-5 ${colorClass}"></i>
                        <span class="text-dark">${message}</span>
                    </div>
                    <button type="button" class="btn-close me-2 m-auto" data-bs-dismiss="toast" aria-label="Close"></button>
                </div>
            </div>
            <style>
                @keyframes slideInRight {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .slide-in-right { animation: slideInRight 0.3s ease-out forwards; }
            </style>
        `;

        container.insertAdjacentHTML('beforeend', toastHtml);
        const toastElement = document.getElementById(toastId);
        
        if (window.bootstrap) {
            const toast = new bootstrap.Toast(toastElement);
            toast.show();
            
            toastElement.addEventListener('hidden.bs.toast', () => {
                toastElement.remove();
            });
        }
    },

    success: function(message) { this.show({ message, type: 'success' }); },
    error: function(message) { this.show({ message, type: 'error' }); },
    warning: function(message) { this.show({ message, type: 'warning' }); },
    info: function(message) { this.show({ message, type: 'info' }); }
};
