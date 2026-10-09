/**
 * Utilidades para validación de formularios
 */
const validators = {
    isRequired: (value, fieldName = 'Este campo') => {
        if (value === undefined || value === null || String(value).trim() === '') {
            return `${fieldName} es requerido`;
        }
        return null;
    },

    isEmail: (value) => {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (value && !regex.test(value)) {
            return 'Email inválido';
        }
        return null;
    },

    isMinLength: (value, min) => {
        if (value && String(value).length < min) {
            return `Debe tener al menos ${min} caracteres`;
        }
        return null;
    },

    isMaxLength: (value, max) => {
        if (value && String(value).length > max) {
            return `No debe exceder ${max} caracteres`;
        }
        return null;
    },

    isDNI: (value) => {
        const regex = /^\d{7,8}$/;
        if (value && !regex.test(value)) {
            return 'Formato de DNI inválido';
        }
        return null;
    },

    isDate: (value) => {
        const date = new Date(value);
        if (value && isNaN(date.getTime())) {
            return 'Fecha inválida';
        }
        return null;
    },

    isFutureDate: (value) => {
        const date = new Date(value);
        const now = new Date();
        now.setHours(0,0,0,0); // Ignorar la hora para comparar fechas
        if (value && date < now) {
            return 'La fecha debe ser igual o posterior a hoy';
        }
        return null;
    },

    isCode: (value) => {
        const regex = /^[A-Za-z0-9]{6,8}$/;
        if (value && !regex.test(value)) {
            return 'Formato de código inválido';
        }
        return null;
    },

    /**
     * Valida un formulario entero buscando atributos data-validate
     * @param {HTMLElement} formElement 
     * @returns {boolean} true si es válido
     */
    validateForm: function(formElement) {
        let isValid = true;
        this.clearAllErrors(formElement);

        const fields = formElement.querySelectorAll('[data-validate]');
        fields.forEach(field => {
            const rules = field.getAttribute('data-validate').split(',');
            const value = field.value;
            let errorMessage = null;

            for (let rule of rules) {
                const parts = rule.trim().split(':');
                const ruleName = parts[0];
                const param = parts[1];

                switch (ruleName) {
                    case 'required':
                        errorMessage = this.isRequired(value, field.getAttribute('placeholder') || 'Campo');
                        break;
                    case 'email':
                        errorMessage = this.isEmail(value);
                        break;
                    case 'minLength':
                        errorMessage = this.isMinLength(value, parseInt(param));
                        break;
                    case 'dni':
                        errorMessage = this.isDNI(value);
                        break;
                    case 'date':
                        errorMessage = this.isDate(value);
                        break;
                    case 'code':
                        errorMessage = this.isCode(value);
                        break;
                }

                if (errorMessage) {
                    this.showFieldError(field, errorMessage);
                    isValid = false;
                    break; // Solo muestra el primer error de cada campo
                }
            }
        });

        return isValid;
    },

    showFieldError: function(field, message) {
        field.classList.add('is-invalid');
        
        let feedback = field.nextElementSibling;
        if (!feedback || !feedback.classList.contains('invalid-feedback-custom')) {
            feedback = document.createElement('div');
            feedback.className = 'invalid-feedback-custom';
            field.parentNode.insertBefore(feedback, field.nextSibling);
        }
        feedback.innerText = message;
    },

    clearFieldError: function(field) {
        field.classList.remove('is-invalid');
        const feedback = field.nextElementSibling;
        if (feedback && feedback.classList.contains('invalid-feedback-custom')) {
            feedback.remove();
        }
    },

    clearAllErrors: function(formElement) {
        const fields = formElement.querySelectorAll('.is-invalid');
        fields.forEach(field => this.clearFieldError(field));
    }
};

window.validators = validators;
