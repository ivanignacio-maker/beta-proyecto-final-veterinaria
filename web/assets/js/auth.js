/**
 * Servicio de autenticación
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
        if (loginTime && (Date.now() - parseInt(loginTime)) > APP_CONFIG.SESSION_DURATION) {
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
        return localStorage.getItem(APP_CONFIG.TOKEN_KEY);
    },

    /**
     * Obtiene los datos del usuario logueado
     * @returns {Object|null}
     */
    getUser: function() {
        const userData = localStorage.getItem(APP_CONFIG.USER_KEY);
        return userData ? JSON.parse(userData) : null;
    },

    /**
     * Inicia sesión (Simulado o real dependiendo del config)
     * @param {string} email 
     * @param {string} password 
     * @returns {Promise<Object>}
     */
    login: async function(email, password) {
        if (APP_CONFIG.MOCK_MODE) {
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    if (email === 'admin@vetcare.com' && password === '123456') {
                        const mockUser = {
                            id: 1,
                            nombre: 'Veterinaria San Bernardo',
                            email: email,
                            rol: 'VETERINARIA'
                        };
                        this._saveSession('mock-jwt-token-123456', mockUser);
                        resolve(mockUser);
                    } else {
                        reject(new Error('Credenciales inválidas'));
                    }
                }, 500);
            });
        }

        // Implementación real
        try {
            const response = await fetch(`${APP_CONFIG.API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            if (!response.ok) {
                const error = await response.json();
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
     * Guarda los datos de sesión
     * @private
     */
    _saveSession: function(token, user) {
        localStorage.setItem(APP_CONFIG.TOKEN_KEY, token);
        localStorage.setItem(APP_CONFIG.USER_KEY, JSON.stringify(user));
        localStorage.setItem('vetcare_login_time', Date.now().toString());
    },

    /**
     * Cierra la sesión
     */
    logout: function() {
        localStorage.removeItem(APP_CONFIG.TOKEN_KEY);
        localStorage.removeItem(APP_CONFIG.USER_KEY);
        localStorage.removeItem('vetcare_login_time');
        window.location.href = 'login.html'; // Ajustar ruta según estructura
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
     */
    requireAuth: function() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html'; // Redirigir si no está logueado
        }
    },

    /**
     * Obtiene datos de la veterinaria actual
     * @returns {Object|null}
     */
    getCurrentVet: function() {
        return this.getUser();
    }
};

window.auth = auth;
