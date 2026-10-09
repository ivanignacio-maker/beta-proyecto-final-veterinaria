/**
 * Componente Forms
 * Validación y manejo de estados de formularios sin librerías externas.
 */
window.FormsComponent = {
    /**
     * Inicializa un formulario con validaciones custom
     * @param {HTMLElement} formElement Formulario DOM
     * @param {Function} onSubmit Callback de éxito
     */
    init: function(formElement, onSubmit) {
        if (!formElement) return;
        
        // Desactivar validación nativa HTML5
        formElement.setAttribute('novalidate', true);

        formElement.addEventListener('submit', (e) => {
            e.preventDefault();
            this.clearMessages(formElement);
            
            let isValid = true;
            const fields = formElement.querySelectorAll('[data-validate]');

            fields.forEach(field => {
                const rules = field.getAttribute('data-validate').split('|');
                let fieldValid = true;
                let errorMessage = '';

                // Reglas simples
                if (rules.includes('required') && !field.value.trim()) {
                    fieldValid = false;
                    errorMessage = 'Este campo es obligatorio';
                } else if (rules.includes('email') && field.value) {
                    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
                    if (!emailRegex.test(field.value)) {
                        fieldValid = false;
                        errorMessage = 'Formato de correo inválido';
                    }
                }

                if (!fieldValid) {
                    isValid = false;
                    field.classList.add('is-invalid');
                    let errorEl = field.nextElementSibling;
                    if (!errorEl || !errorEl.classList.contains('invalid-feedback')) {
                        errorEl = document.createElement('div');
                        errorEl.className = 'invalid-feedback';
                        field.parentNode.insertBefore(errorEl, field.nextSibling);
                    }
                    errorEl.textContent = errorMessage;
                } else {
                    field.classList.remove('is-invalid');
                    field.classList.add('is-valid');
                }
            });

            if (isValid && onSubmit) {
                const data = this.getData(formElement);
                onSubmit(data, formElement);
            }
        });

        // Limpiar error on input
        formElement.addEventListener('input', (e) => {
            if (e.target.classList.contains('is-invalid')) {
                e.target.classList.remove('is-invalid');
            }
        });
    },

    setLoading: function(formElement, loading) {
        const submitBtn = formElement.querySelector('button[type="submit"]');
        if (!submitBtn) return;
        
        if (loading) {
            submitBtn.disabled = true;
            submitBtn.dataset.originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>Cargando...';
            // Disable all inputs
            formElement.querySelectorAll('input, select, textarea').forEach(el => el.disabled = true);
        } else {
            submitBtn.disabled = false;
            submitBtn.innerHTML = submitBtn.dataset.originalText || 'Guardar';
            formElement.querySelectorAll('input, select, textarea').forEach(el => el.disabled = false);
        }
    },

    showSuccess: function(formElement, message) {
        this.clearMessages(formElement);
        const alertHtml = `<div class="alert alert-success alert-form"><i class="bi bi-check-circle-fill me-2"></i>${message}</div>`;
        formElement.insertAdjacentHTML('afterbegin', alertHtml);
    },

    showError: function(formElement, message) {
        this.clearMessages(formElement);
        const alertHtml = `<div class="alert alert-danger alert-form"><i class="bi bi-exclamation-triangle-fill me-2"></i>${message}</div>`;
        formElement.insertAdjacentHTML('afterbegin', alertHtml);
    },

    clearMessages: function(formElement) {
        formElement.querySelectorAll('.alert-form').forEach(el => el.remove());
    },

    getData: function(formElement) {
        const formData = new FormData(formElement);
        const data = {};
        formData.forEach((value, key) => data[key] = value);
        return data;
    },

    reset: function(formElement) {
        formElement.reset();
        this.clearMessages(formElement);
        formElement.querySelectorAll('.is-invalid, .is-valid').forEach(el => {
            el.classList.remove('is-invalid', 'is-valid');
        });
    }
};
