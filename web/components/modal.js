/**
 * Componente Modal
 * Gestión de modales dinámicos utilizando Bootstrap 5
 */
window.ModalComponent = {
    /**
     * Crea un modal dinámico
     * @param {Object} options Opciones del modal
     * @returns {HTMLElement} Elemento modal
     */
    create: function(options) {
        const {
            id = 'dynamicModal_' + Date.now(),
            title = 'Modal',
            body = '',
            size = 'md', // sm, md, lg, xl
            footer = null,
            onConfirm = null,
            onCancel = null,
            confirmText = 'Confirmar',
            cancelText = 'Cancelar',
            confirmClass = 'btn-primary'
        } = options;

        this.destroy(id);

        const modalHtml = `
            <div class="modal fade modal-custom" id="${id}" tabindex="-1" aria-labelledby="${id}Label" aria-hidden="true">
                <div class="modal-dialog modal-${size} modal-dialog-centered">
                    <div class="modal-content border-0 shadow-lg">
                        <div class="modal-header border-bottom-0 pb-0">
                            <h5 class="modal-title fw-bold" id="${id}Label">${title}</h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body py-4">
                            ${body}
                        </div>
                        <div class="modal-footer border-top-0 pt-0">
                            ${footer !== null ? footer : `
                                <button type="button" class="btn btn-light" data-bs-dismiss="modal">${cancelText}</button>
                                <button type="button" class="btn ${confirmClass}" id="${id}ConfirmBtn">${confirmText}</button>
                            `}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', modalHtml);
        const modalElement = document.getElementById(id);
        
        // Configurar eventos
        if (onConfirm && footer === null) {
            const confirmBtn = document.getElementById(`${id}ConfirmBtn`);
            confirmBtn.addEventListener('click', () => {
                onConfirm(modalElement);
            });
        }

        if (onCancel) {
            modalElement.addEventListener('hidden.bs.modal', () => {
                onCancel();
                this.destroy(id);
            }, { once: true });
        } else {
            modalElement.addEventListener('hidden.bs.modal', () => {
                this.destroy(id);
            }, { once: true });
        }

        return modalElement;
    },

    /**
     * Muestra un modal
     * @param {string} id ID del modal
     */
    show: function(id) {
        const modalElement = document.getElementById(id);
        if (modalElement && window.bootstrap) {
            const modal = new bootstrap.Modal(modalElement);
            modal.show();
        }
    },

    /**
     * Oculta un modal
     * @param {string} id ID del modal
     */
    hide: function(id) {
        const modalElement = document.getElementById(id);
        if (modalElement && window.bootstrap) {
            const modal = bootstrap.Modal.getInstance(modalElement);
            if (modal) modal.hide();
        }
    },

    /**
     * Atajo para crear y mostrar un modal de confirmación rápida
     * @param {Object} options Opciones
     */
    confirm: function(options) {
        const {
            title = 'Confirmación',
            message = '¿Estás seguro?',
            confirmText = 'Aceptar',
            confirmClass = 'btn-primary',
            onConfirm
        } = options;

        const modalId = 'confirmModal_' + Date.now();
        const bodyContent = `<p class="mb-0 fs-5">${message}</p>`;

        this.create({
            id: modalId,
            title: title,
            body: bodyContent,
            confirmText: confirmText,
            confirmClass: confirmClass,
            onConfirm: (el) => {
                if (onConfirm) onConfirm();
                this.hide(modalId);
            }
        });

        this.show(modalId);
    },

    /**
     * Elimina el modal del DOM
     * @param {string} id ID del modal
     */
    destroy: function(id) {
        const modalElement = document.getElementById(id);
        if (modalElement) {
            modalElement.remove();
        }
    }
};
