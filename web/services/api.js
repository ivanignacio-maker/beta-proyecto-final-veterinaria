/**
 * Capa de comunicación con la API
 */
const api = {
    /**
     * Helper interno para fetch con headers y manejo de errores
     */
    _fetch: async function(endpoint, options = {}) {
        if (APP_CONFIG.MOCK_MODE) {
            return this._mockResponse(endpoint, options);
        }

        const url = `${APP_CONFIG.API_BASE_URL}${endpoint}`;
        const token = auth.getToken();
        
        const headers = {
            'Content-Type': 'application/json',
            ...(options.headers || {})
        };

        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config = {
            ...options,
            headers
        };

        try {
            const response = await fetch(url, config);
            
            if (response.status === 401) {
                auth.logout();
                throw new Error('Sesión expirada');
            }
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || `Error HTTP ${response.status}`);
            }

            // Para DELETE u otras operaciones sin body de retorno
            if (response.status === 204) return null;

            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },

    /**
     * Simulador de respuestas para MOCK_MODE
     */
    _mockResponse: function(endpoint, options) {
        return new Promise((resolve, reject) => {
            const delay = Math.random() * 500 + 300; // 300-800ms
            
            setTimeout(() => {
                try {
                    // Simular rutas básicas
                    if (endpoint.includes('/clientes')) {
                        if (endpoint.match(/\/clientes\/\d+/)) {
                            const id = parseInt(endpoint.split('/').pop());
                            resolve({ data: MOCK_DATA.clientes.find(c => c.id === id) });
                        } else {
                            resolve({ data: MOCK_DATA.clientes, total: MOCK_DATA.clientes.length });
                        }
                    } 
                    else if (endpoint.includes('/mascotas')) {
                        if (endpoint.match(/\/mascotas\/\d+/)) {
                            const id = parseInt(endpoint.split('/').pop());
                            resolve({ data: MOCK_DATA.mascotas.find(m => m.id === id) });
                        } else {
                            resolve({ data: MOCK_DATA.mascotas, total: MOCK_DATA.mascotas.length });
                        }
                    }
                    else if (endpoint.includes('/historia-clinica')) {
                        const mascotaId = parseInt(utils.getUrlParam('id') || endpoint.split('/').pop());
                        resolve({ data: MOCK_DATA.historiaClinica.filter(h => h.mascotaId === mascotaId) });
                    }
                    else if (endpoint.includes('/turnos')) {
                        resolve({ data: MOCK_DATA.turnos });
                    }
                    else if (endpoint.includes('/solicitudes')) {
                        resolve({ data: MOCK_DATA.solicitudesAcceso });
                    }
                    else if (endpoint.includes('/dashboard')) {
                        resolve({ data: MOCK_DATA.dashboardStats });
                    }
                    else if (endpoint.includes('/actividades')) {
                        resolve({ data: MOCK_DATA.actividadesRecientes });
                    }
                    else if (endpoint.includes('/perfil')) {
                        resolve({ data: MOCK_DATA.currentVet });
                    }
                    // Para POST/PUT devolvemos éxito
                    else if (options.method === 'POST' || options.method === 'PUT') {
                        resolve({ success: true, message: 'Operación simulada exitosa', data: { id: 999 } });
                    }
                    else {
                        resolve({ data: [] });
                    }
                } catch (err) {
                    reject(new Error('Error simulado'));
                }
            }, delay);
        });
    },

    // ==================== ENDPOINTS ====================

    login: (email, password) => auth.login(email, password),
    logout: () => auth.logout(),

    getClientes: (page = 1, search = '', filters = {}) => {
        let query = `?page=${page}`;
        if (search) query += `&search=${encodeURIComponent(search)}`;
        return api._fetch(`/clientes${query}`);
    },
    
    getCliente: (id) => api._fetch(`/clientes/${id}`),

    getMascotas: (page = 1, search = '', filters = {}) => {
        let query = `?page=${page}`;
        if (search) query += `&search=${encodeURIComponent(search)}`;
        return api._fetch(`/mascotas${query}`);
    },

    getMascota: (id) => api._fetch(`/mascotas/${id}`),

    getHistoriaClinica: (mascotaId) => api._fetch(`/mascotas/${mascotaId}/historia-clinica`),

    crearConsulta: (mascotaId, data) => api._fetch(`/mascotas/${mascotaId}/consulta`, {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    crearVacuna: (mascotaId, data) => api._fetch(`/mascotas/${mascotaId}/vacuna`, {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    crearEstudio: (mascotaId, data) => api._fetch(`/mascotas/${mascotaId}/estudio`, {
        method: 'POST',
        body: JSON.stringify(data) // Para un multipart, habría que adaptar el _fetch
    }),

    getTurnos: (page = 1, filters = {}) => api._fetch(`/turnos?page=${page}`),

    crearTurno: (data) => api._fetch('/turnos', {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    actualizarTurno: (id, data) => api._fetch(`/turnos/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
    }),

    getSolicitudes: (page = 1, filters = {}) => api._fetch(`/solicitudes?page=${page}`),

    crearSolicitudAcceso: (mascotaId) => api._fetch('/solicitudes', {
        method: 'POST',
        body: JSON.stringify({ mascotaId })
    }),

    canjearCodigo: (codigo, identificacion) => api._fetch('/acceso/externo', {
        method: 'POST',
        body: JSON.stringify({ codigo, identificacion })
    }),

    enviarInformeExterno: (codigoId, data) => api._fetch(`/acceso/informe/${codigoId}`, {
        method: 'POST',
        body: JSON.stringify(data)
    }),

    getPerfil: () => api._fetch('/perfil'),

    actualizarPerfil: (data) => api._fetch('/perfil', {
        method: 'PUT',
        body: JSON.stringify(data)
    }),

    getDashboardStats: () => api._fetch('/dashboard/stats'),
    
    getActividadesRecientes: () => api._fetch('/dashboard/actividades')
};

window.api = api;
