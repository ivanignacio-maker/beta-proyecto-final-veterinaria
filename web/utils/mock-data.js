/**
 * Datos simulados para desarrollo (Mock Data) con persistencia en LocalStorage
 */

// Datos base por defecto
const DEFAULT_MOCK_DATA = {
    currentVet: {
        id: 1,
        nombre: 'Veterinaria San Bernardo',
        email: 'admin@vetcare.com',
        direccion: 'Av. Libertador 1234, CABA',
        telefono: '+54 11 4567-8901',
        matricula: 'MP-4567',
        logo: 'https://via.placeholder.com/150'
    },

    veterinarias: [
        { id: 1, nombre: 'Veterinaria San Bernardo', direccion: 'Av. Libertador 1234, CABA', telefono: '+54 11 4567-8901', matricula: 'MP-4567', especialidad: 'Clínica General y Cirugía' },
        { id: 2, nombre: 'Hospital Veterinario Norte', direccion: 'Av. Cabildo 3120, CABA', telefono: '+54 11 4789-2233', matricula: 'MP-3312', especialidad: 'Traumatología y Urgencias' },
        { id: 3, nombre: 'Guardia 24hs Vet', direccion: 'Av. San Martín 850, CABA', telefono: '+54 11 4555-0011', matricula: 'MP-8891', especialidad: 'Guardia y Terapia Intensiva' },
        { id: 4, nombre: 'Centro Dermatológico Vet', direccion: 'Calle Juramento 1540, CABA', telefono: '+54 11 4333-8899', matricula: 'MP-6521', especialidad: 'Dermatología y Alergias' },
        { id: 5, nombre: 'CardioVet Especialidades', direccion: 'Av. Santa Fe 2200, CABA', telefono: '+54 11 4821-4455', matricula: 'MP-9943', especialidad: 'Cardiología y Ecocardiografía' }
    ],
    
    clientes: [
        { id: 1, nombre: 'María', apellido: 'García', dni: '30123456', email: 'maria.g@email.com', password: 'password123', telefono: '1122334455', direccion: 'Calle Falsa 123', cantidadMascotas: 2, fechaRegistro: '2023-01-15', debeCambiarPassword: false },
        { id: 2, nombre: 'Juan', apellido: 'Pérez', dni: '28765432', email: 'juan.p@email.com', password: 'password123', telefono: '1199887766', direccion: 'Av. Corrientes 456', cantidadMascotas: 1, fechaRegistro: '2023-03-20', debeCambiarPassword: false },
        { id: 3, nombre: 'Ana', apellido: 'López', dni: '35456789', email: 'ana.l@email.com', password: 'password123', telefono: '1155443322', direccion: 'Belgrano 789', cantidadMascotas: 3, fechaRegistro: '2023-05-10', debeCambiarPassword: false },
        { id: 4, nombre: 'Carlos', apellido: 'Rodríguez', dni: '22345678', email: 'carlos.r@email.com', password: 'password123', telefono: '1166778899', direccion: 'San Martín 101', cantidadMascotas: 1, fechaRegistro: '2023-06-15', debeCambiarPassword: false },
        { id: 5, nombre: 'Laura', apellido: 'Martínez', dni: '40112233', email: 'laura.m@email.com', password: 'password123', telefono: '1133221100', direccion: 'Rivadavia 202', cantidadMascotas: 2, fechaRegistro: '2023-08-05', debeCambiarPassword: false },
        { id: 6, nombre: 'Diego', apellido: 'Fernández', dni: '31998877', email: 'diego.f@email.com', password: 'password123', telefono: '1177665544', direccion: 'Sarmiento 303', cantidadMascotas: 1, fechaRegistro: '2023-09-12', debeCambiarPassword: false },
        { id: 7, nombre: 'Valentina', apellido: 'Sánchez', dni: '38554433', email: 'valen.s@email.com', password: 'password123', telefono: '1188990011', direccion: 'Pueyrredón 404', cantidadMascotas: 1, fechaRegistro: '2023-11-20', debeCambiarPassword: false },
        { id: 8, nombre: 'Roberto', apellido: 'Díaz', dni: '25667788', email: 'roberto.d@email.com', password: 'password123', telefono: '1144556677', direccion: 'Córdoba 505', cantidadMascotas: 1, fechaRegistro: '2024-01-10', debeCambiarPassword: false }
    ],

    mascotas: [
        { id: 1, nombre: 'Bobby', tipo: 'perro', raza: 'Golden Retriever', fechaNacimiento: '2020-05-15', peso: 25.5, color: 'Dorado', microchip: '981020000123456', propietarioId: 1, propietarioNombre: 'María García', foto: 'https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=400&q=80', estado: 'activo' },
        { id: 2, nombre: 'Luna', tipo: 'gato', raza: 'Siamés', fechaNacimiento: '2021-08-20', peso: 4.2, color: 'Crema', microchip: null, propietarioId: 1, propietarioNombre: 'María García', foto: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80', estado: 'activo' },
        { id: 3, nombre: 'Rex', tipo: 'perro', raza: 'Pastor Alemán', fechaNacimiento: '2019-02-10', peso: 32.0, color: 'Negro y Fuego', microchip: '981020000654321', propietarioId: 2, propietarioNombre: 'Juan Pérez', foto: 'https://images.unsplash.com/photo-1589941013453-ec89f33b5455?auto=format&fit=crop&w=400&q=80', estado: 'activo' },
        { id: 4, nombre: 'Mimi', tipo: 'gato', raza: 'Persa', fechaNacimiento: '2022-11-05', peso: 3.8, color: 'Blanco', microchip: null, propietarioId: 3, propietarioNombre: 'Ana López', foto: 'https://images.unsplash.com/photo-1533738363-b7f9aef128ce?auto=format&fit=crop&w=400&q=80', estado: 'activo' },
        { id: 5, nombre: 'Coco', tipo: 'perro', raza: 'Caniche', fechaNacimiento: '2021-04-18', peso: 6.5, color: 'Blanco', microchip: null, propietarioId: 3, propietarioNombre: 'Ana López', foto: 'https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=400&q=80', estado: 'activo' },
        { id: 6, nombre: 'Tambor', tipo: 'conejo', raza: 'Belier', fechaNacimiento: '2023-01-25', peso: 2.1, color: 'Gris', microchip: null, propietarioId: 3, propietarioNombre: 'Ana López', foto: 'https://images.unsplash.com/photo-1585110396000-c9ffd4e4b308?auto=format&fit=crop&w=400&q=80', estado: 'activo' },
        { id: 7, nombre: 'Rocco', tipo: 'perro', raza: 'Bulldog Francés', fechaNacimiento: '2020-09-30', peso: 12.5, color: 'Atigrado', microchip: '981020000789012', propietarioId: 4, propietarioNombre: 'Carlos Rodríguez', foto: 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=400&q=80', estado: 'activo' },
        { id: 8, nombre: 'Simba', tipo: 'gato', raza: 'Mestizo', fechaNacimiento: '2022-03-12', peso: 5.0, color: 'Naranja', microchip: null, propietarioId: 5, propietarioNombre: 'Laura Martínez', foto: 'https://images.unsplash.com/photo-1518791841217-8f162f1e1131?auto=format&fit=crop&w=400&q=80', estado: 'activo' },
        { id: 9, nombre: 'Kira', tipo: 'perro', raza: 'Husky Siberiano', fechaNacimiento: '2018-12-05', peso: 22.0, color: 'Blanco y Negro', microchip: '981020000345678', propietarioId: 5, propietarioNombre: 'Laura Martínez', foto: 'https://images.unsplash.com/photo-1537151625747-768eb6cf92b2?auto=format&fit=crop&w=400&q=80', estado: 'activo' },
        { id: 10, nombre: 'Pipo', tipo: 'ave', raza: 'Canario', fechaNacimiento: '2023-06-10', peso: 0.2, color: 'Amarillo', microchip: null, propietarioId: 6, propietarioNombre: 'Diego Fernández', foto: 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=400&q=80', estado: 'activo' },
        { id: 11, nombre: 'Max', tipo: 'perro', raza: 'Mestizo', fechaNacimiento: '2017-07-22', peso: 18.5, color: 'Marrón', microchip: null, propietarioId: 7, propietarioNombre: 'Valentina Sánchez', foto: 'https://images.unsplash.com/photo-1561037404-61cd46aa615b?auto=format&fit=crop&w=400&q=80', estado: 'activo' },
        { id: 12, nombre: 'Garfield', tipo: 'gato', raza: 'Europeo de Pelo Corto', fechaNacimiento: '2019-10-15', peso: 6.8, color: 'Naranja atigrado', microchip: null, propietarioId: 8, propietarioNombre: 'Roberto Díaz', foto: 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=400&q=80', estado: 'activo' }
    ],

    historiaClinica: [
        { id: 1, mascotaId: 1, tipo: 'consulta', fecha: '2023-01-20', descripcion: 'Control general cachorro', observaciones: 'Buen estado, se indica desparasitación', profesional: 'Dr. López', clinica: 'Veterinaria San Bernardo', origen: 'veterinaria_interna' },
        { id: 2, mascotaId: 1, tipo: 'vacuna', fecha: '2023-02-15', descripcion: 'Quíntuple 1ra dosis', observaciones: 'Sin reacciones adversas', profesional: 'Dr. López', clinica: 'Veterinaria San Bernardo', origen: 'veterinaria_interna' },
        { id: 3, mascotaId: 1, tipo: 'estudio', fecha: '2023-10-05', descripcion: 'Hemograma completo', observaciones: 'Valores normales. Se adjunta PDF.', profesional: 'Dra. Martínez', clinica: 'LabVet', origen: 'veterinaria_externa_codigo' },
        { id: 4, mascotaId: 1, tipo: 'consulta', fecha: '2024-01-10', descripcion: 'Dermatitis leve', observaciones: 'Se recetan corticoides tópicos por 7 días', profesional: 'Dr. López', clinica: 'Veterinaria San Bernardo', origen: 'veterinaria_interna' },
        { id: 5, mascotaId: 2, tipo: 'vacuna', fecha: '2023-05-12', descripcion: 'Triple Felina', observaciones: 'Aplicación anual', profesional: 'Dr. López', clinica: 'Veterinaria San Bernardo', origen: 'veterinaria_interna' },
        { id: 6, mascotaId: 2, tipo: 'consulta', fecha: '2023-11-20', descripcion: 'Vómitos esporádicos tras ingesta de planta', observaciones: 'Atendido en urgencia por el dueño. Se administró protector gástrico.', profesional: 'María García (Dueña)', clinica: 'Atención Domiciliaria', origen: 'cliente_formulario' },
        { id: 7, mascotaId: 3, tipo: 'consulta', fecha: '2023-04-10', descripcion: 'Control de cadera', observaciones: 'Leve displasia, inicio de condroprotectores', profesional: 'Dr. Ruiz (Traumatólogo)', clinica: 'Hospital Veterinario Norte', origen: 'veterinaria_externa_codigo' },
        { id: 8, mascotaId: 3, tipo: 'estudio', fecha: '2023-04-10', descripcion: 'Radiografía cadera', observaciones: 'Evidencia displasia grado I', profesional: 'Dr. Ruiz', clinica: 'Hospital Veterinario Norte', origen: 'veterinaria_externa_codigo' },
        { id: 9, mascotaId: 3, tipo: 'vacuna', fecha: '2024-02-05', descripcion: 'Antirrábica', observaciones: 'Refuerzo anual', profesional: 'Dr. López', clinica: 'Veterinaria San Bernardo', origen: 'veterinaria_interna' },
        { id: 10, mascotaId: 4, tipo: 'consulta', fecha: '2023-07-18', descripcion: 'Limpieza dental', observaciones: 'Bajo sedación leve', profesional: 'Dr. López', clinica: 'Veterinaria San Bernardo', origen: 'veterinaria_interna' },
        { id: 11, mascotaId: 5, tipo: 'consulta', fecha: '2023-08-22', descripcion: 'Otitis', observaciones: 'Limpieza y gotas óticas c/12h', profesional: 'Dr. López', clinica: 'Veterinaria San Bernardo', origen: 'veterinaria_interna' },
        { id: 12, mascotaId: 7, tipo: 'estudio', fecha: '2023-09-15', descripcion: 'Ecografía abdominal', observaciones: 'Sin hallazgos patológicos', profesional: 'Dra. Silva', clinica: 'Centro de Imágenes Vet', origen: 'veterinaria_externa_codigo' },
        { id: 13, mascotaId: 7, tipo: 'vacuna', fecha: '2023-10-01', descripcion: 'Sextuple', observaciones: '', profesional: 'Dr. López', clinica: 'Veterinaria San Bernardo', origen: 'veterinaria_interna' },
        { id: 14, mascotaId: 8, tipo: 'consulta', fecha: '2023-06-10', descripcion: 'Corte de uñas y desparasitación', observaciones: '', profesional: 'Dr. López', clinica: 'Veterinaria San Bernardo', origen: 'veterinaria_interna' },
        { id: 15, mascotaId: 9, tipo: 'consulta', fecha: '2023-12-05', descripcion: 'Herida en pata', observaciones: 'Curación y vendaje, antibióticos preventivos', profesional: 'Dr. López', clinica: 'Veterinaria San Bernardo', origen: 'veterinaria_interna' },
        { id: 16, mascotaId: 10, tipo: 'consulta', fecha: '2023-09-20', descripcion: 'Revisión plumaje', observaciones: 'Muda normal, suplemento vitamínico', profesional: 'Diego Fernández', clinica: 'Reporte del dueño', origen: 'cliente_formulario' },
        { id: 17, mascotaId: 11, tipo: 'consulta', fecha: '2023-03-15', descripcion: 'Control geriátrico', observaciones: 'Soplo grado II, se deriva a cardiología', profesional: 'Dr. López', clinica: 'Veterinaria San Bernardo', origen: 'veterinaria_interna' },
        { id: 18, mascotaId: 11, tipo: 'estudio', fecha: '2023-03-25', descripcion: 'Ecocardiograma', observaciones: 'Insuficiencia mitral leve', profesional: 'Dr. Paz', clinica: 'CardioVet', origen: 'veterinaria_externa_codigo' },
        { id: 19, mascotaId: 12, tipo: 'consulta', fecha: '2024-01-30', descripcion: 'Control de peso', observaciones: 'Sobrepeso, dieta estricta', profesional: 'Dr. López', clinica: 'Veterinaria San Bernardo', origen: 'veterinaria_interna' },
        { id: 20, mascotaId: 12, tipo: 'vacuna', fecha: '2024-01-30', descripcion: 'Antirrábica', observaciones: '', profesional: 'Dr. López', clinica: 'Veterinaria San Bernardo', origen: 'veterinaria_interna' }
    ],

    turnos: [
        { id: 1, mascotaId: 1, mascotaNombre: 'Bobby', propietarioNombre: 'María García', propietarioId: 1, fecha: '2024-02-25', hora: '10:00', motivo: 'Control anual y vacunas', estado: 'confirmado', profesional: 'Dr. López', clinica: 'Veterinaria San Bernardo' },
        { id: 2, mascotaId: 4, mascotaNombre: 'Mimi', propietarioNombre: 'Ana López', propietarioId: 3, fecha: '2024-02-26', hora: '16:30', motivo: 'Vacunación', estado: 'pendiente', profesional: 'Dr. López', clinica: 'Veterinaria San Bernardo' },
        { id: 3, mascotaId: 7, mascotaNombre: 'Rocco', propietarioNombre: 'Carlos Rodríguez', propietarioId: 4, fecha: '2024-02-25', hora: '11:15', motivo: 'Revisión otitis', estado: 'confirmado', profesional: 'Dr. López', clinica: 'Veterinaria San Bernardo' },
        { id: 4, mascotaId: 2, mascotaNombre: 'Luna', propietarioNombre: 'María García', propietarioId: 1, fecha: '2024-02-28', hora: '09:00', motivo: 'Desparasitación periódica', estado: 'pendiente', profesional: 'Dra. Ramos', clinica: 'Centro Dermatológico Vet' },
        { id: 5, mascotaId: 9, mascotaNombre: 'Kira', propietarioNombre: 'Laura Martínez', propietarioId: 5, fecha: '2024-03-05', hora: '14:00', motivo: 'Extracción puntos', estado: 'pendiente', profesional: 'Dr. López', clinica: 'Veterinaria San Bernardo' },
        { id: 6, mascotaId: 5, mascotaNombre: 'Coco', propietarioNombre: 'Ana López', propietarioId: 3, fecha: '2024-02-10', hora: '10:30', motivo: 'Consulta general', estado: 'realizado', profesional: 'Dr. López', clinica: 'Veterinaria San Bernardo' },
        { id: 7, mascotaId: 11, mascotaNombre: 'Max', propietarioNombre: 'Valentina Sánchez', propietarioId: 7, fecha: '2024-02-15', hora: '15:00', motivo: 'Control cardiológico', estado: 'realizado', profesional: 'Dr. Paz', clinica: 'CardioVet' },
        { id: 8, mascotaId: 8, mascotaNombre: 'Simba', propietarioNombre: 'Laura Martínez', propietarioId: 5, fecha: '2024-02-20', hora: '17:00', motivo: 'Vacuna antirrábica', estado: 'cancelado', profesional: 'Dr. López', clinica: 'Veterinaria San Bernardo' },
        { id: 9, mascotaId: 12, mascotaNombre: 'Garfield', propietarioNombre: 'Roberto Díaz', propietarioId: 8, fecha: '2024-03-10', hora: '11:00', motivo: 'Control peso', estado: 'pendiente', profesional: 'Dr. López', clinica: 'Veterinaria San Bernardo' },
        { id: 10, mascotaId: 3, mascotaNombre: 'Rex', propietarioNombre: 'Juan Pérez', propietarioId: 2, fecha: '2024-03-12', hora: '16:00', motivo: 'Radiografía control', estado: 'pendiente', profesional: 'Dr. Ruiz', clinica: 'Hospital Veterinario Norte' }
    ],

    solicitudesAcceso: [
        { id: 1, mascotaId: 1, mascotaNombre: 'Bobby', propietarioId: 1, propietarioNombre: 'María García', veterinaria: 'Guardia 24hs Vet', matricula: 'MP-8891', estado: 'pendiente', fechaSolicitud: '2024-02-24T22:15:00Z', fechaRespuesta: null, motivo: 'Ingreso nocturno por guardia' },
        { id: 2, mascotaId: 3, mascotaNombre: 'Rex', propietarioId: 2, propietarioNombre: 'Juan Pérez', veterinaria: 'Hospital Veterinario Norte', matricula: 'MP-3312', estado: 'aprobado', fechaSolicitud: '2024-02-20T10:00:00Z', fechaRespuesta: '2024-02-20T10:15:00Z', motivo: 'Seguimiento traumatológico' },
        { id: 3, mascotaId: 7, mascotaNombre: 'Rocco', propietarioId: 4, propietarioNombre: 'Carlos Rodríguez', veterinaria: 'Centro Dermatológico Vet', matricula: 'MP-6521', estado: 'pendiente', fechaSolicitud: '2024-02-23T14:30:00Z', fechaRespuesta: null, motivo: 'Consulta dermatología' },
        { id: 4, mascotaId: 5, mascotaNombre: 'Coco', propietarioId: 3, propietarioNombre: 'Ana López', veterinaria: 'Vet Sur', matricula: 'MP-1122', estado: 'rechazado', fechaSolicitud: '2024-02-15T09:00:00Z', fechaRespuesta: '2024-02-15T11:00:00Z', motivo: 'Atención puntual' },
        { id: 5, mascotaId: 9, mascotaNombre: 'Kira', propietarioId: 5, propietarioNombre: 'Laura Martínez', veterinaria: 'Emergencias Vet', matricula: 'MP-9900', estado: 'revocado', fechaSolicitud: '2024-01-10T23:00:00Z', fechaRespuesta: '2024-01-11T12:00:00Z', motivo: 'Guardia urgente' },
        { id: 6, mascotaId: 11, mascotaNombre: 'Max', propietarioId: 7, propietarioNombre: 'Valentina Sánchez', veterinaria: 'CardioVet', matricula: 'MP-9943', estado: 'aprobado', fechaSolicitud: '2023-12-05T08:30:00Z', fechaRespuesta: '2023-12-05T09:00:00Z', motivo: 'Interconsulta cardiológica' },
        { id: 7, mascotaId: 2, mascotaNombre: 'Luna', propietarioId: 1, propietarioNombre: 'María García', veterinaria: 'Veterinaria San Bernardo', matricula: 'MP-4567', estado: 'aprobado', fechaSolicitud: '2023-01-15T09:00:00Z', fechaRespuesta: '2023-01-15T09:10:00Z', motivo: 'Veterinaria de cabecera' }
    ],

    codigosAcceso: [
        { id: 1, mascotaId: 1, mascotaNombre: 'Bobby', propietarioId: 1, codigo: 'B8X9A2', estado: 'activo', fechaCreacion: '2024-02-24T09:00:00Z', fechaExpiracion: '2024-02-27T09:00:00Z', creadoPor: 'María García', usadoPor: null, informeCargado: false },
        { id: 2, mascotaId: 2, mascotaNombre: 'Luna', propietarioId: 1, codigo: 'M5C2L1', estado: 'usado', fechaCreacion: '2024-02-20T14:00:00Z', fechaExpiracion: '2024-02-22T14:00:00Z', creadoPor: 'María García', usadoPor: 'Vet Especialista Dra. Gómez', informeCargado: true },
        { id: 3, mascotaId: 12, mascotaNombre: 'Garfield', propietarioId: 8, codigo: 'K9P4W7', estado: 'expirado', fechaCreacion: '2024-01-15T10:00:00Z', fechaExpiracion: '2024-01-16T10:00:00Z', creadoPor: 'Roberto Díaz', usadoPor: null, informeCargado: false },
        { id: 4, mascotaId: 4, mascotaNombre: 'Mimi', propietarioId: 3, codigo: 'J2R8T5', estado: 'activo', fechaCreacion: '2024-02-24T16:30:00Z', fechaExpiracion: '2024-02-26T16:30:00Z', creadoPor: 'Ana López', usadoPor: null, informeCargado: false },
        { id: 5, mascotaId: 8, mascotaNombre: 'Simba', propietarioId: 5, codigo: 'N4F6D3', estado: 'revocado', fechaCreacion: '2024-02-10T11:00:00Z', fechaExpiracion: '2024-02-11T11:00:00Z', creadoPor: 'Laura Martínez', usadoPor: null, informeCargado: false }
    ],

    dashboardStats: {
        mascotasAtendidas: 47,
        turnosProximos: 8,
        consultasRecientes: 12,
        solicitudesPendientes: 3
    },

    actividadesRecientes: [
        { id: 1, tipo: 'consulta', descripcion: 'Nueva consulta registrada para Bobby (María García)', fecha: '2024-02-24T10:30:00Z', icono: 'bi-clipboard-plus' },
        { id: 2, tipo: 'turno', descripcion: 'Turno confirmado para Rocco (Mañana 11:15)', fecha: '2024-02-24T09:15:00Z', icono: 'bi-calendar-check' },
        { id: 3, tipo: 'acceso', descripcion: 'Nueva solicitud de acceso para Bobby', fecha: '2024-02-23T22:15:00Z', icono: 'bi-shield-exclamation' },
        { id: 4, tipo: 'vacuna', descripcion: 'Vacuna Antirrábica aplicada a Rex', fecha: '2024-02-23T16:45:00Z', icono: 'bi-bandaid' },
        { id: 5, tipo: 'estudio', descripcion: 'Informe de ecografía recibido para Coco', fecha: '2024-02-22T14:20:00Z', icono: 'bi-file-medical' },
        { id: 6, tipo: 'turno', descripcion: 'Turno cancelado por Laura Martínez', fecha: '2024-02-22T08:10:00Z', icono: 'bi-calendar-x' },
        { id: 7, tipo: 'cliente', descripcion: 'Nuevo cliente registrado: Roberto Díaz', fecha: '2024-02-21T11:30:00Z', icono: 'bi-person-plus' },
        { id: 8, tipo: 'acceso', descripcion: 'Código B8X9A2 generado para Bobby', fecha: '2024-02-21T09:00:00Z', icono: 'bi-key' }
    ]
};

// Gestor de persistencia en LocalStorage
const STORAGE_KEY = 'vetcare_mock_db';

function loadMockData() {
    try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            return JSON.parse(stored);
        }
    } catch (e) {
        console.warn('Error leyendo mock data de localStorage:', e);
    }
    // Guardar los datos iniciales
    saveMockData(DEFAULT_MOCK_DATA);
    return JSON.parse(JSON.stringify(DEFAULT_MOCK_DATA));
}

function saveMockData(data) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.warn('Error guardando mock data en localStorage:', e);
    }
}

// Inicializar MOCK_DATA activo
const MOCK_DATA = loadMockData();

// Helpers para modificar y guardar
MOCK_DATA.save = function() {
    saveMockData(this);
};

MOCK_DATA.reset = function() {
    localStorage.removeItem(STORAGE_KEY);
    Object.assign(MOCK_DATA, JSON.parse(JSON.stringify(DEFAULT_MOCK_DATA)));
    saveMockData(DEFAULT_MOCK_DATA);
};

window.MOCK_DATA = MOCK_DATA;
