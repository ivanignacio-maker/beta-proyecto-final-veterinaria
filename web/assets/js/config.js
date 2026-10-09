// Configuración global de la aplicación
const APP_CONFIG = {
    API_BASE_URL: 'http://localhost:8000/api',
    APP_NAME: 'VetCare - Historia Clínica Única',
    APP_SHORT_NAME: 'VetCare',
    APP_VERSION: '1.0.0',
    TOKEN_KEY: 'vetcare_auth_token',
    USER_KEY: 'vetcare_user_data',
    SESSION_DURATION: 8 * 60 * 60 * 1000, // 8 horas
    EXTERNAL_SESSION_DURATION: 4 * 60 * 60 * 1000, // 4 horas para acceso externo
    MAX_CODE_ATTEMPTS: 5,
    CODE_ATTEMPT_WINDOW: 15 * 60 * 1000, // 15 minutos
    ITEMS_PER_PAGE: 10,
    DEBOUNCE_DELAY: 300,
    TOAST_DURATION: 4000,
    MOCK_MODE: true // Cambiar a false en producción
};

// Exportar para uso modular si se implementa un bundler, 
// o dejar global si se carga por script tag
window.APP_CONFIG = APP_CONFIG;
