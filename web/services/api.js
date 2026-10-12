/**
 * Capa de comunicación con la API REST (o Mock)
 * Integra soporte para Veterinarias y Dueños de Mascotas (Clientes)
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
            const delay = Math.random() * 300 + 200; // 200-500ms
            
            setTimeout(() => {
                try {
                    const currentUser = auth.getUser();
                    const clienteId = (currentUser && currentUser.rol === 'CLIENTE') ? currentUser.id : null;

                    // Clientes
                    if (endpoint.startsWith('/clientes')) {
                        if (endpoint.match(/\/clientes\/\d+/)) {
                            const id = parseInt(endpoint.split('/').pop());
                            const c = MOCK_DATA.clientes.find(item => item.id === id);
                            resolve({ data: c });
                        } else {
                            resolve({ data: MOCK_DATA.clientes, total: MOCK_DATA.clientes.length });
                        }
                    } 
                    // Mascotas
                    else if (endpoint.startsWith('/mascotas')) {
                        if (endpoint.match(/\/mascotas\/\d+$/)) {
                            const id = parseInt(endpoint.split('/').pop());
                            const m = MOCK_DATA.mascotas.find(item => item.id === id);
                            resolve({ data: m });
                        } else if (endpoint.includes('/mis-mascotas') || clienteId) {
                            // Mascotas del cliente actual
                            const targetId = clienteId || 1;
                            const mList = MOCK_DATA.mascotas.filter(item => item.propietarioId === targetId);
                            resolve({ data: mList, total: mList.length });
                        } else {
                            resolve({ data: MOCK_DATA.mascotas, total: MOCK_DATA.mascotas.length });
                        }
                    }
                    // Historia Clínica
                    else if (endpoint.includes('/historia-clinica')) {
                        const parts = endpoint.split('/');
                        const mascotaId = parseInt(parts[2] || utils.getUrlParam('id') || 1);
                        const eventos = MOCK_DATA.historiaClinica.filter(h => h.mascotaId === mascotaId);
                        // Ordenar por fecha descendente
                        eventos.sort((a, b) => new Date(b.fecha) - new Date(a.fecha));
                        resolve({ data: eventos });
                    }
                    // Turnos
                    else if (endpoint.startsWith('/turnos')) {
                        if (clienteId) {
                            const turnosCliente = MOCK_DATA.turnos.filter(t => t.propietarioId === clienteId);
                            resolve({ data: turnosCliente });
                        } else {
                            resolve({ data: MOCK_DATA.turnos });
                        }
                    }
                    // Solicitudes de acceso
                    else if (endpoint.startsWith('/solicitudes')) {
                        if (clienteId) {
                            const solicitudesCliente = MOCK_DATA.solicitudesAcceso.filter(s => s.propietarioId === clienteId);
                            resolve({ data: solicitudesCliente });
                        } else {
                            resolve({ data: MOCK_DATA.solicitudesAcceso });
                        }
                    }
                    // Códigos de acceso
                    else if (endpoint.startsWith('/codigos')) {
                        if (clienteId) {
                            const codigosCliente = MOCK_DATA.codigosAcceso.filter(c => c.propietarioId === clienteId);
                            resolve({ data: codigosCliente });
                        } else {
                            resolve({ data: MOCK_DATA.codigosAcceso });
                        }
                    }
                    // Veterinarias
                    else if (endpoint.startsWith('/veterinarias')) {
                        resolve({ data: MOCK_DATA.veterinarias || [] });
                    }
                    // Dashboard stats
                    else if (endpoint.startsWith('/dashboard/stats')) {
                        resolve({ data: MOCK_DATA.dashboardStats });
                    }
                    // Actividades
                    else if (endpoint.startsWith('/dashboard/actividades')) {
                        resolve({ data: MOCK_DATA.actividadesRecientes });
                    }
                    // Perfil
                    else if (endpoint.startsWith('/perfil')) {
                        resolve({ data: currentUser || MOCK_DATA.currentVet });
                    }
                    // Fallback para POST/PUT
                    else if (options.method === 'POST' || options.method === 'PUT') {
                        resolve({ success: true, message: 'Operación simulada exitosa', data: { id: Date.now() } });
                    }
                    else {
                        resolve({ data: [] });
                    }
                } catch (err) {
                    console.error('Mock error:', err);
                    reject(new Error('Error en el servidor de pruebas'));
                }
            }, delay);
        });
    },

    // ==================== ENDPOINTS GENERALES ====================

    login: (email, password, role = null) => auth.login(email, password, role),
    registerCliente: (datos) => auth.registerCliente(datos),
    logout: () => auth.logout(),

    // ==================== VETERINARIA ====================

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

    crearConsulta: (mascotaId, data) => {
        if (APP_CONFIG.MOCK_MODE) {
            const nuevoEvento = {
                id: Date.now(),
                mascotaId: parseInt(mascotaId),
                tipo: 'consulta',
                fecha: data.fecha || new Date().toISOString().split('T')[0],
                descripcion: data.descripcion,
                observaciones: data.observaciones || '',
                profesional: data.profesional || 'Dr. López',
                clinica: 'Veterinaria San Bernardo',
                origen: 'veterinaria_interna'
            };
            MOCK_DATA.historiaClinica.unshift(nuevoEvento);
            MOCK_DATA.save();
            return Promise.resolve({ success: true, data: nuevoEvento });
        }
        return api._fetch(`/mascotas/${mascotaId}/consulta`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    crearVacuna: (mascotaId, data) => {
        if (APP_CONFIG.MOCK_MODE) {
            const nuevoEvento = {
                id: Date.now(),
                mascotaId: parseInt(mascotaId),
                tipo: 'vacuna',
                fecha: data.fecha || new Date().toISOString().split('T')[0],
                descripcion: `${data.nombreVacuna || 'Vacuna'} (Lote: ${data.lote || 'N/A'})`,
                observaciones: data.observaciones || '',
                profesional: data.profesional || 'Dr. López',
                clinica: 'Veterinaria San Bernardo',
                origen: 'veterinaria_interna'
            };
            MOCK_DATA.historiaClinica.unshift(nuevoEvento);
            MOCK_DATA.save();
            return Promise.resolve({ success: true, data: nuevoEvento });
        }
        return api._fetch(`/mascotas/${mascotaId}/vacuna`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    crearEstudio: (mascotaId, data) => {
        if (APP_CONFIG.MOCK_MODE) {
            const nuevoEvento = {
                id: Date.now(),
                mascotaId: parseInt(mascotaId),
                tipo: 'estudio',
                fecha: data.fecha || new Date().toISOString().split('T')[0],
                descripcion: `${data.tipoEstudio || 'Estudio'}: ${data.descripcion}`,
                observaciones: data.resultado || data.observaciones || '',
                profesional: data.profesional || 'Dr. López',
                clinica: 'Veterinaria San Bernardo',
                origen: 'veterinaria_interna'
            };
            MOCK_DATA.historiaClinica.unshift(nuevoEvento);
            MOCK_DATA.save();
            return Promise.resolve({ success: true, data: nuevoEvento });
        }
        return api._fetch(`/mascotas/${mascotaId}/estudio`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    getTurnos: (page = 1, filters = {}) => api._fetch(`/turnos?page=${page}`),

    crearTurno: (data) => {
        if (APP_CONFIG.MOCK_MODE) {
            const nuevoTurno = {
                id: Date.now(),
                mascotaId: parseInt(data.mascotaId),
                mascotaNombre: data.mascotaNombre || 'Mascota',
                propietarioId: data.propietarioId || (auth.getUser() ? auth.getUser().id : 1),
                propietarioNombre: data.propietarioNombre || (auth.getUser() ? auth.getUser().nombre : 'Cliente'),
                fecha: data.fecha,
                hora: data.hora,
                motivo: data.motivo,
                estado: data.estado || 'pendiente',
                profesional: data.profesional || 'Dr. López',
                clinica: data.clinica || 'Veterinaria San Bernardo'
            };
            MOCK_DATA.turnos.push(nuevoTurno);
            MOCK_DATA.save();
            return Promise.resolve({ success: true, data: nuevoTurno });
        }
        return api._fetch('/turnos', {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    actualizarTurno: (id, data) => {
        if (APP_CONFIG.MOCK_MODE) {
            const t = MOCK_DATA.turnos.find(item => item.id === parseInt(id));
            if (t) {
                Object.assign(t, data);
                MOCK_DATA.save();
            }
            return Promise.resolve({ success: true, data: t });
        }
        return api._fetch(`/turnos/${id}`, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    getSolicitudes: (page = 1, filters = {}) => api._fetch(`/solicitudes?page=${page}`),

    crearSolicitudAcceso: (mascotaId, motivo = '') => {
        if (APP_CONFIG.MOCK_MODE) {
            const m = MOCK_DATA.mascotas.find(item => item.id === parseInt(mascotaId));
            const nueva = {
                id: Date.now(),
                mascotaId: parseInt(mascotaId),
                mascotaNombre: m ? m.nombre : 'Mascota',
                propietarioId: m ? m.propietarioId : 1,
                propietarioNombre: m ? m.propietarioNombre : 'Cliente',
                veterinaria: 'Veterinaria San Bernardo',
                matricula: 'MP-4567',
                estado: 'pendiente',
                fechaSolicitud: new Date().toISOString(),
                fechaRespuesta: null,
                motivo: motivo || 'Solicitud de acceso clínico'
            };
            MOCK_DATA.solicitudesAcceso.push(nueva);
            MOCK_DATA.save();
            return Promise.resolve({ success: true, data: nueva });
        }
        return api._fetch('/solicitudes', {
            method: 'POST',
            body: JSON.stringify({ mascotaId, motivo })
        });
    },

    // ==================== ACCESO EXTERNO POR CÓDIGO ====================

    canjearCodigo: (codigo, identificacion) => {
        if (APP_CONFIG.MOCK_MODE) {
            const cod = codigo.toUpperCase().trim();
            if (cod === 'EXPIRED1') throw new Error('expired');
            if (cod === 'REVOKED1') throw new Error('revoked');
            if (cod === 'USED0001') throw new Error('used');

            // Buscar en códigos mock
            const item = MOCK_DATA.codigosAcceso.find(c => c.codigo.toUpperCase() === cod);
            if (item) {
                if (item.estado === 'expirado') throw new Error('expired');
                if (item.estado === 'revocado') throw new Error('revoked');
                if (item.estado === 'usado') throw new Error('used');
                
                // Válido
                item.usadoPor = identificacion.nombreClinica || 'Veterinaria Externa';
                item.estado = 'usado';
                MOCK_DATA.save();
                return Promise.resolve({
                    success: true,
                    codigoId: item.id,
                    mascota: MOCK_DATA.mascotas.find(m => m.id === item.mascotaId) || MOCK_DATA.mascotas[0],
                    expiraEnHoras: 4
                });
            }

            if (cod === 'A1B2C3D4' || cod === 'B8X9A2') {
                return Promise.resolve({
                    success: true,
                    codigoId: 1,
                    mascota: MOCK_DATA.mascotas[0],
                    expiraEnHoras: 4
                });
            }

            throw new Error('invalid');
        }

        return api._fetch('/acceso/externo', {
            method: 'POST',
            body: JSON.stringify({ codigo, identificacion })
        });
    },

    enviarInformeExterno: (codigoId, data) => {
        if (APP_CONFIG.MOCK_MODE) {
            const nuevo = {
                id: Date.now(),
                mascotaId: 1,
                tipo: 'informe',
                fecha: data.fecha || new Date().toISOString().split('T')[0],
                descripcion: `Atención Externa: ${data.tipoAtencion || 'Consulta'}. Procedimientos: ${data.procedimientos || 'Sin detalles'}. Medicamentos: ${data.medicamentos || 'Ninguno'}.`,
                observaciones: data.observaciones || '',
                profesional: 'Profesional Externo',
                clinica: 'Veterinaria Externa (por Código)',
                origen: 'veterinaria_externa_codigo'
            };
            MOCK_DATA.historiaClinica.unshift(nuevo);
            MOCK_DATA.save();
            return Promise.resolve({ success: true, data: nuevo });
        }

        return api._fetch(`/acceso/informe/${codigoId}`, {
            method: 'POST',
            body: JSON.stringify(data)
        });
    },

    // ==================== ENDPOINTS DEL CLIENTE (DUEÑO) ====================

    getMisMascotas: () => {
        const u = auth.getUser();
        const cid = u ? u.id : 1;
        return api._fetch(`/mascotas/mis-mascotas?clienteId=${cid}`);
    },

    /**
     * Motor de resolución de identidad y registro de mascotas (HU Registrar Mascotas)
     * Detecta duplicados basados en: DNI dueño + Nombre + Tipo + Raza
     */
    verificarDuplicadoMascota: (datosMascota) => {
        const u = auth.getUser();
        const dni = u ? u.dni : '30123456';
        const mascotas = MOCK_DATA.mascotas || [];

        // Buscar mascotas del mismo dueño con nombre y especie similar
        const candidatos = mascotas.filter(m => {
            const mismoDueno = m.propietarioId === (u ? u.id : 1);
            const mismoNombre = m.nombre.toLowerCase().trim() === datosMascota.nombre.toLowerCase().trim();
            const mismoTipo = m.tipo.toLowerCase() === datosMascota.tipo.toLowerCase();
            return mismoDueno && (mismoNombre || mismoTipo);
        });

        // Duplicado exacto o muy alto (nombre + tipo + raza)
        const duplicadoFuerte = candidatos.find(m => 
            m.nombre.toLowerCase().trim() === datosMascota.nombre.toLowerCase().trim() &&
            m.tipo.toLowerCase() === datosMascota.tipo.toLowerCase()
        );

        return Promise.resolve({
            hayDuplicado: !!duplicadoFuerte,
            candidato: duplicadoFuerte || null,
            similares: candidatos
        });
    },

    registrarMascota: (datos) => {
        if (APP_CONFIG.MOCK_MODE) {
            const u = auth.getUser();
            const ownerId = u ? u.id : 1;
            const ownerName = u ? u.nombre : 'María García';

            const nuevaMascota = {
                id: Date.now(),
                nombre: datos.nombre,
                tipo: datos.tipo,
                raza: datos.raza || 'Mestizo',
                fechaNacimiento: datos.fechaNacimiento || '2023-01-01',
                peso: parseFloat(datos.peso) || 5.0,
                color: datos.color || 'Varios',
                microchip: datos.microchip || null,
                propietarioId: ownerId,
                propietarioNombre: ownerName,
                foto: datos.foto || 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80',
                estado: 'activo'
            };

            MOCK_DATA.mascotas.push(nuevaMascota);
            
            // Actualizar contador en cliente
            const cliente = MOCK_DATA.clientes.find(c => c.id === ownerId);
            if (cliente) {
                cliente.cantidadMascotas = (cliente.cantidadMascotas || 0) + 1;
            }

            MOCK_DATA.save();
            return Promise.resolve({ success: true, data: nuevaMascota });
        }

        return api._fetch('/mascotas', {
            method: 'POST',
            body: JSON.stringify(datos)
        });
    },

    editarMascota: (id, datos) => {
        if (APP_CONFIG.MOCK_MODE) {
            const m = MOCK_DATA.mascotas.find(item => item.id === parseInt(id));
            if (m) {
                Object.assign(m, datos);
                MOCK_DATA.save();
                return Promise.resolve({ success: true, data: m });
            }
            return Promise.reject(new Error('Mascota no encontrada'));
        }
        return api._fetch(`/mascotas/${id}`, {
            method: 'PUT',
            body: JSON.stringify(datos)
        });
    },

    getMisTurnos: () => {
        return api._fetch('/turnos/mis-turnos');
    },

    cancelarTurnoCliente: (turnoId) => {
        return api.actualizarTurno(turnoId, { estado: 'cancelado' });
    },

    getMisSolicitudes: () => {
        return api._fetch('/solicitudes/mis-solicitudes');
    },

    responderSolicitudAcceso: (solicitudId, nuevoEstado) => {
        if (APP_CONFIG.MOCK_MODE) {
            const s = MOCK_DATA.solicitudesAcceso.find(item => item.id === parseInt(solicitudId));
            if (s) {
                s.estado = nuevoEstado; // 'aprobado' | 'rechazado' | 'revocado'
                s.fechaRespuesta = new Date().toISOString();
                MOCK_DATA.save();
                return Promise.resolve({ success: true, data: s });
            }
            return Promise.reject(new Error('Solicitud no encontrada'));
        }
        return api._fetch(`/solicitudes/${solicitudId}/responder`, {
            method: 'POST',
            body: JSON.stringify({ estado: nuevoEstado })
        });
    },

    getMisCodigos: () => {
        return api._fetch('/codigos/mis-codigos');
    },

    generarCodigoAcceso: (mascotaId, horasVigencia = 48) => {
        if (APP_CONFIG.MOCK_MODE) {
            const u = auth.getUser();
            const m = MOCK_DATA.mascotas.find(item => item.id === parseInt(mascotaId));
            
            // Generar código aleatorio 6-8 chars alfanuméricos
            const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
            let codigoGenerado = '';
            for (let i = 0; i < 6; i++) {
                codigoGenerado += chars.charAt(Math.floor(Math.random() * chars.length));
            }

            const ahora = new Date();
            const expira = new Date(ahora.getTime() + horasVigencia * 3600 * 1000);

            const nuevoCodigo = {
                id: Date.now(),
                mascotaId: parseInt(mascotaId),
                mascotaNombre: m ? m.nombre : 'Mascota',
                propietarioId: u ? u.id : 1,
                codigo: codigoGenerado,
                estado: 'activo',
                fechaCreacion: ahora.toISOString(),
                fechaExpiracion: expira.toISOString(),
                creadoPor: u ? u.nombre : 'Dueño',
                usadoPor: null,
                informeCargado: false
            };

            MOCK_DATA.codigosAcceso.unshift(nuevoCodigo);
            MOCK_DATA.save();
            return Promise.resolve({ success: true, data: nuevoCodigo });
        }

        return api._fetch('/codigos/generar', {
            method: 'POST',
            body: JSON.stringify({ mascotaId, horasVigencia })
        });
    },

    revocarCodigoAcceso: (codigoId) => {
        if (APP_CONFIG.MOCK_MODE) {
            const c = MOCK_DATA.codigosAcceso.find(item => item.id === parseInt(codigoId));
            if (c) {
                c.estado = 'revocado';
                MOCK_DATA.save();
                return Promise.resolve({ success: true, data: c });
            }
            return Promise.reject(new Error('Código no encontrado'));
        }
        return api._fetch(`/codigos/${codigoId}/revocar`, {
            method: 'POST'
        });
    },

    /**
     * Formulario de fallback del dueño (HU Formulario fallback del dueño)
     * Registra un evento clínico con origen 'cliente_formulario'
     * y marca explícitamente "Reportado por el dueño, no verificado por un profesional"
     */
    registrarReporteDueño: (mascotaId, datos) => {
        if (APP_CONFIG.MOCK_MODE) {
            const u = auth.getUser();
            const autor = u ? u.nombre : 'Dueño de la mascota';

            const nuevoEvento = {
                id: Date.now(),
                mascotaId: parseInt(mascotaId),
                tipo: 'consulta',
                fecha: datos.fecha || new Date().toISOString().split('T')[0],
                descripcion: `Reporte del Dueño: ${datos.procedimiento || 'Atención realizada'}. Medicamentos: ${datos.medicamentos || 'No especifica'}.`,
                observaciones: datos.observaciones || 'Reporte de fallback cargado por el propietario.',
                profesional: `${autor} (Dueño/a)`,
                clinica: datos.clinica || 'Atención externa no verificada',
                origen: 'cliente_formulario',
                adjuntoUrl: datos.comprobanteUrl || null
            };

            MOCK_DATA.historiaClinica.unshift(nuevoEvento);
            MOCK_DATA.save();
            return Promise.resolve({ success: true, data: nuevoEvento });
        }

        return api._fetch(`/mascotas/${mascotaId}/reporte-dueno`, {
            method: 'POST',
            body: JSON.stringify(datos)
        });
    },

    getVeterinariasDisponibles: () => {
        return api._fetch('/veterinarias');
    },

    getPerfil: () => api._fetch('/perfil'),

    actualizarPerfil: (data) => {
        if (APP_CONFIG.MOCK_MODE) {
            const u = auth.getUser();
            if (u) {
                Object.assign(u, data);
                localStorage.setItem(APP_CONFIG.USER_KEY || 'vetcare_user_data', JSON.stringify(u));
            }
            return Promise.resolve({ success: true, data: u });
        }
        return api._fetch('/perfil', {
            method: 'PUT',
            body: JSON.stringify(data)
        });
    },

    getDashboardStats: () => api._fetch('/dashboard/stats'),
    
    getActividadesRecientes: () => api._fetch('/dashboard/actividades')
};

window.api = api;
