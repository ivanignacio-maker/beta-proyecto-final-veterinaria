/**
 * Utilidades generales
 */
const utils = {
    /**
     * Formatea fecha en español
     * @param {string|Date} date 
     * @param {string} format 'short' | 'long'
     * @returns {string}
     */
    formatDate: function(date, format = 'short') {
        if (!date) return '';
        const d = new Date(date);
        
        if (format === 'short') {
            return d.toLocaleDateString('es-AR', { day: '2-digit', month: '2-digit', year: 'numeric' });
        }
        return d.toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
    },

    /**
     * Formato de tiempo relativo (ej: hace 5 minutos)
     * @param {string|Date} date 
     * @returns {string}
     */
    formatRelativeTime: function(date) {
        if (!date) return '';
        const rtf = new Intl.RelativeTimeFormat('es', { numeric: 'auto' });
        const d = new Date(date);
        const now = new Date();
        const diffInSeconds = (d - now) / 1000;
        
        const rtfOptions = [
            { max: 60, unit: 'second' },
            { max: 3600, unit: 'minute' },
            { max: 86400, unit: 'hour' },
            { max: 604800, unit: 'day' },
            { max: 2592000, unit: 'week' },
            { max: 31536000, unit: 'month' },
            { max: Infinity, unit: 'year' }
        ];

        let absDiff = Math.abs(diffInSeconds);
        for (let opt of rtfOptions) {
            if (absDiff < opt.max) {
                let val = Math.round(diffInSeconds / (opt.unit === 'second' ? 1 :
                    opt.unit === 'minute' ? 60 :
                    opt.unit === 'hour' ? 3600 :
                    opt.unit === 'day' ? 86400 :
                    opt.unit === 'week' ? 604800 :
                    opt.unit === 'month' ? 2592000 : 31536000));
                return rtf.format(val, opt.unit);
            }
        }
        return this.formatDate(d);
    },

    /**
     * Limita las llamadas a una función
     * @param {Function} fn 
     * @param {number} delay 
     * @returns {Function}
     */
    debounce: function(fn, delay) {
        let timeoutId;
        return function(...args) {
            if (timeoutId) clearTimeout(timeoutId);
            timeoutId = setTimeout(() => {
                fn.apply(this, args);
            }, delay);
        };
    },

    /**
     * Previene XSS
     * @param {string} str 
     * @returns {string}
     */
    escapeHtml: function(str) {
        if (!str) return '';
        const div = document.createElement('div');
        div.innerText = str;
        return div.innerHTML;
    },

    /**
     * Trunca texto con elipsis
     * @param {string} str 
     * @param {number} maxLength 
     * @returns {string}
     */
    truncateText: function(str, maxLength) {
        if (!str) return '';
        if (str.length <= maxLength) return str;
        return str.substring(0, maxLength) + '...';
    },

    /**
     * Genera un ID alfanumérico temporal
     * @returns {string}
     */
    generateId: function() {
        return Math.random().toString(36).substr(2, 9);
    },

    /**
     * Obtiene iniciales de un nombre
     * @param {string} name 
     * @returns {string}
     */
    getInitials: function(name) {
        if (!name) return '??';
        const parts = name.trim().split(' ');
        if (parts.length >= 2) {
            return (parts[0][0] + parts[1][0]).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    },

    /**
     * Obtiene parámetro de URL
     * @param {string} param 
     * @returns {string|null}
     */
    getUrlParam: function(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    },

    /**
     * Scroll arriba de manera suave
     */
    scrollToTop: function() {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    /**
     * Copia texto al portapapeles
     * @param {string} text 
     * @returns {Promise}
     */
    copyToClipboard: async function(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Error copiando al portapapeles:', err);
            return false;
        }
    },

    /**
     * Muestra una notificación toast simple (requiere HTML base en layout)
     * @param {string} message 
     * @param {string} type 'success' | 'error' | 'warning' | 'info'
     */
    showToast: function(message, type = 'info') {
        const container = document.getElementById('toast-container') || this._createToastContainer();
        const toast = document.createElement('div');
        toast.className = `toast-custom toast-${type}`;
        
        let icon = 'info-circle';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'exclamation-circle';
        if (type === 'warning') icon = 'exclamation-triangle';

        toast.innerHTML = `
            <i class="bi bi-${icon} fs-5"></i>
            <div>${this.escapeHtml(message)}</div>
        `;
        
        container.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.add('hide');
            setTimeout(() => toast.remove(), 300);
        }, APP_CONFIG.TOAST_DURATION);
    },

    _createToastContainer: function() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'toast-container';
        document.body.appendChild(container);
        return container;
    }
};

window.utils = utils;
