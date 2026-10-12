/**
 * Servicio de autenticación para VetCare
 * Soporta roles: VETERINARIA y CLIENTE (Dueño de Mascota)
 */
const auth = {
    /**
     * Verifica si el usuario está autenticado
     * @returns {boolean}
     */
    isAuthenticated: function() {
        const token = this.getToken();
        if (!token) return false;
        
        // Verificar expiración simple si guardamos la fecha de login
        const loginTime = localStorage.getItem('vetcare_login_time');
        if (loginTime && (Date.now() - parseInt(loginTime)) > (APP_CONFIG.SESSION_DURATION || 8 * 3600 * 1000)) {
            this.logout();
            return false;
        }
        return true;
    },

    /**
     * Obtiene el token actual
     * @returns {string|null}
     */
    getToken: function() {
        return localStorage.getItem(APP_CONFIG.TOKEN_KEY || 'vetcare_auth_token');
    },

    /**
     * Obtiene los datos del usuario logueado
     * @returns {Object|null}
     */
    getUser: function() {
        const userData = localStorage.getItem(APP_CONFIG.USER_KEY || 'vetcare_user_data');
        return userData ? JSON.parse(userData) : null;
    },

    /**
     * Comprueba si el usuario logueado es una Veterinaria
     * @returns {boolean}
     */
    isVeterinaria: function() {
        const user = this.getUser();
        return user && user.rol === 'VETERINARIA';
    },

    /**
     * Comprueba si el usuario logueado es un Dueño de Mascota (Cliente)
     * @returns {boolean}
     */
    isCliente: function() {
        const user = this.getUser();
        return user && user.rol === 'CLIENTE';
    },

    /**
     * Inicia sesión (soporta VETERINARIA y CLIENTE)
     * @param {string} emailOrDni 
     * @param {string} password 
     * @param {string|null} forcedRole Opcional: 'VETERINARIA' o 'CLIENTE'
     * @returns {Promise<Object>}
     */
    login: async function(emailOrDni, password, forcedRole = null) {
        if (APP_CONFIG.MOCK_MODE) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const identifier = emailOrDni.trim().toLowerCase();

                    // 1. Caso Veterinaria
                    if (
                        (!forcedRole || forcedRole === 'VETERINARIA') &&
                        (identifier === 'admin@vetcare.com' || identifier === 'veterinaria') &&
                        (password === 'admin123' || password === '123456')
                    ) {
                        const mockUser = {
                            id: 1,
                            nombre: 'Veterinaria San Bernardo',
                            email: 'admin@vetcare.com',
                            rol: 'VETERINARIA',
                            matricula: 'MP-4567'
                        };
                        this._saveSession('mock-vet-jwt-token-123456', mockUser);
                        resolve(mockUser);
                        return;
                    }

                    // 2. Caso Cliente (Dueño de Mascota)
                    const clientes = MOCK_DATA.clientes || [];
                    const cliente = clientes.find(c => 
                        c.email.toLowerCase() === identifier || 
                        c.dni.toString() === identifier
                    );

                    if (cliente) {
                        // Acepta password configurado, '123456', 'admin123' o su propio DNI
                        const validPass = (cliente.password && cliente.password === password) ||
                                          password === '123456' || 
                                          password === 'password123' ||
                                          password === cliente.dni.toString();

                        if (validPass) {
                            const debeCambiarPass = cliente.debeCambiarPassword || (password === cliente.dni.toString());
                            const mockUser = {
                                id: cliente.id,
                                nombre: `${cliente.nombre} ${cliente.apellido}`,
                                nombreSimple: cliente.nombre,
                                apellido: cliente.apellido,
                                email: cliente.email,
                                dni: cliente.dni,
                                telefono: cliente.telefono,
                                direccion: cliente.direccion,
                                rol: 'CLIENTE',
                                debeCambiarPassword: debeCambiarPass
                            };
                            this._saveSession('mock-client-jwt-token-' + cliente.id, mockUser);
                            resolve(mockUser);
                            return;
                        } else {
                            reject(new Error('Contraseña incorrecta'));
                            return;
                        }
                    }

                    // Si no existe ni veterinaria ni cliente
                    reject(new Error('Usuario no registrado o credenciales inválidas'));
                }, 400);
            });
        }

        // Modo API Real
        try {
            const response = await fetch(`${APP_CONFIG.API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: emailOrDni, password, rol: forcedRole })
            });

            if (!response.ok) {
                const error = await response.json().catch(() => ({}));
                throw new Error(error.message || 'Error en autenticación');
            }

            const data = await response.json();
            this._saveSession(data.token, data.user);
            return data.user;
        } catch (error) {
            throw error;
        }
    },

    /**
     * Registra un nuevo Cliente (Dueño de mascota)
     * @param {Object} datosCliente { nombre, apellido, dni, email, telefono, direccion, password }
     * @returns {Promise<Object>}
     */
    registerCliente: async function(datosCliente) {
        if (APP_CONFIG.MOCK_MODE) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    const clientes = MOCK_DATA.clientes || [];
                    
                    // Criterio de aceptación: validar DNI duplicado
                    const dniExiste = clientes.some(c => c.dni.toString() === datosCliente.dni.toString());
                    if (dniExiste) {
                        reject(new Error('Ya existe una cuenta registrada con ese DNI'));
                        return;
                    }

                    // Validar email duplicado
                    const emailExiste = clientes.some(c => c.email.toLowerCase() === datosCliente.email.toLowerCase());
                    if (emailExiste) {
                        reject(new Error('Ya existe una cuenta registrada con ese correo electrónico'));
                        return;
                    }

                    const nuevoId = clientes.length > 0 ? Math.max(...clientes.map(c => c.id)) + 1 : 1;
                    const nuevoCliente = {
                        id: nuevoId,
                        nombre: datosCliente.nombre,
                        apellido: datosCliente.apellido,
                        dni: datosCliente.dni,
                        email: datosCliente.email,
                        telefono: datosCliente.telefono || '',
                        direccion: datosCliente.direccion || '',
                        password: datosCliente.password || datosCliente.dni.toString(),
                        cantidadMascotas: 0,
                        fechaRegistro: new Date().toISOString().split('T')[0],
                        debeCambiarPassword: !datosCliente.password // Si se usó DNI por defecto
                    };

                    clientes.push(nuevoCliente);
                    MOCK_DATA.save();

                    const userSession = {
                        id: nuevoCliente.id,
                        nombre: `${nuevoCliente.nombre} ${nuevoCliente.apellido}`,
                        nombreSimple: nuevoCliente.nombre,
                        apellido: nuevoCliente.apellido,
                        email: nuevoCliente.email,
                        dni: nuevoCliente.dni,
                        telefono: nuevoCliente.telefono,
                        direccion: nuevoCliente.direccion,
                        rol: 'CLIENTE',
                        debeCambiarPassword: nuevoCliente.debeCambiarPassword
                    };

                    this._saveSession('mock-client-jwt-token-' + nuevoCliente.id, userSession);
                    resolve(userSession);
                }, 500);
            });
        }

        const response = await fetch(`${APP_CONFIG.API_BASE_URL}/auth/register-cliente`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datosCliente)
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            throw new Error(error.message || 'Error al registrar el cliente');
        }

        const data = await response.json();
        this._saveSession(data.token, data.user);
        return data.user;
    },

    /**
     * Guarda los datos de sesión en localStorage
     * @private
     */
    _saveSession: function(token, user) {
        localStorage.setItem(APP_CONFIG.TOKEN_KEY || 'vetcare_auth_token', token);
        localStorage.setItem(APP_CONFIG.USER_KEY || 'vetcare_user_data', JSON.stringify(user));
        localStorage.setItem('vetcare_login_time', Date.now().toString());
    },

    /**
     * Cierra la sesión
     */
    logout: function() {
        localStorage.removeItem(APP_CONFIG.TOKEN_KEY || 'vetcare_auth_token');
        localStorage.removeItem(APP_CONFIG.USER_KEY || 'vetcare_user_data');
        localStorage.removeItem('vetcare_login_time');
        window.location.href = 'login.html';
    },

    /**
     * Verifica periódicamente si la sesión expiró
     */
    checkSession: function() {
        if (!this.isAuthenticated()) {
            this.logout();
        }
    },

    /**
     * Guardia para proteger rutas privadas
     * @param {string|null} requiredRole 'VETERINARIA' | 'CLIENTE' | null
     */
    requireAuth: function(requiredRole = null) {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return;
        }

        const user = this.getUser();
        if (requiredRole && user && user.rol !== requiredRole) {
            // Redirigir a su portal correspondiente
            if (user.rol === 'CLIENTE') {
                window.location.href = 'cliente-dashboard.html';
            } else if (user.rol === 'VETERINARIA') {
                window.location.href = 'dashboard.html';
            }
        }
    },

    /**
     * Obtiene datos de la veterinaria actual
     * @returns {Object|null}
     */
    getCurrentVet: function() {
        const user = this.getUser();
        return (user && user.rol === 'VETERINARIA') ? user : (MOCK_DATA.currentVet || null);
    }
};

window.auth = auth;
