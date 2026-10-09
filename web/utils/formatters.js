/**
 * Formateadores de datos específicos del dominio
 */
const formatters = {
    formatPetAge: function(birthDate) {
        if (!birthDate) return 'Desconocida';
        const birth = new Date(birthDate);
        const now = new Date();
        
        let years = now.getFullYear() - birth.getFullYear();
        let months = now.getMonth() - birth.getMonth();
        
        if (months < 0 || (months === 0 && now.getDate() < birth.getDate())) {
            years--;
            months += 12;
        }
        
        if (years === 0) {
            return `${months} ${months === 1 ? 'mes' : 'meses'}`;
        }
        if (months === 0) {
            return `${years} ${years === 1 ? 'año' : 'años'}`;
        }
        return `${years} años y ${months} meses`;
    },

    formatPetType: function(type) {
        const types = {
            'perro': 'Perro',
            'gato': 'Gato',
            'ave': 'Ave',
            'roedor': 'Roedor',
            'conejo': 'Conejo',
            'reptil': 'Reptil',
            'otro': 'Otro'
        };
        return types[type.toLowerCase()] || type;
    },

    formatAppointmentStatus: function(status) {
        const map = {
            'pendiente': { text: 'Pendiente', class: 'badge-pendiente' },
            'confirmado': { text: 'Confirmado', class: 'badge-confirmado' },
            'cancelado': { text: 'Cancelado', class: 'badge-cancelado' },
            'realizado': { text: 'Realizado', class: 'badge-realizado' }
        };
        return map[status.toLowerCase()] || { text: status, class: 'badge-status' };
    },

    formatAccessStatus: function(status) {
        const map = {
            'pendiente': { text: 'Pendiente', class: 'badge-pendiente' },
            'aprobado': { text: 'Aprobado', class: 'badge-aprobado' },
            'rechazado': { text: 'Rechazado', class: 'badge-cancelado' },
            'revocado': { text: 'Revocado', class: 'badge-revocado' }
        };
        return map[status.toLowerCase()] || { text: status, class: 'badge-status' };
    },

    formatCodeStatus: function(status) {
        const map = {
            'activo': { text: 'Activo', class: 'badge-activo' },
            'usado': { text: 'Usado', class: 'badge-usado' },
            'expirado': { text: 'Expirado', class: 'badge-expirado' },
            'revocado': { text: 'Revocado', class: 'badge-revocado' }
        };
        return map[status.toLowerCase()] || { text: status, class: 'badge-status' };
    },

    formatEventType: function(type) {
        const types = {
            'consulta': 'Consulta General',
            'vacuna': 'Vacunación',
            'estudio': 'Estudio Médico',
            'cirugia': 'Cirugía',
            'informe': 'Informe Externo'
        };
        return types[type.toLowerCase()] || type;
    },

    formatOrigin: function(origin) {
        const origins = {
            'veterinaria_interna': { text: 'Veterinaria Interna', class: 'badge-origen-interna', verified: true },
            'veterinaria_externa_codigo': { text: 'Veterinaria Externa', class: 'badge-origen-externa', verified: true },
            'cliente_formulario': { text: 'Reportado por Dueño', class: 'badge-origen-dueno', verified: false }
        };
        return origins[origin] || { text: origin, class: '', verified: false };
    },

    formatPhoneNumber: function(phone) {
        if (!phone) return '';
        const cleaned = ('' + phone).replace(/\D/g, '');
        const match = cleaned.match(/^(\d{2,4})(\d{6,8})$/);
        if (match) {
            return `+54 ${match[1]} ${match[2]}`;
        }
        return phone;
    },

    capitalizeFirst: function(str) {
        if (!str) return '';
        return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
    }
};

window.formatters = formatters;
