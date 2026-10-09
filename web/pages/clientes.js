/**
 * Lógica para la página de Clientes
 */

let todosLosClientes = [];
let clientesFiltrados = [];
let paginaActual = 1;
const ITEMS_POR_PAGINA = 10;
let debounceTimer;

document.addEventListener('DOMContentLoaded', () => {
    inicializarBusqueda();
    cargarClientes();
});

/**
 * Configura los eventos del buscador
 */
function inicializarBusqueda() {
    const inputBuscar = document.getElementById('input-buscar');
    const btnBuscar = document.getElementById('btn-buscar');
    
    if (inputBuscar) {
        // Búsqueda con debounce para no saturar al escribir
        inputBuscar.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                filtrarClientes(e.target.value);
            }, 300);
        });
    }
    
    if (btnBuscar && inputBuscar) {
        btnBuscar.addEventListener('click', () => {
            filtrarClientes(inputBuscar.value);
        });
    }
}

/**
 * Obtiene la lista de clientes desde la API
 */
async function cargarClientes() {
    try {
        mostrarCargando();
        
        // Simular obtención de datos
        // En un entorno real se obtendría desde api.clientes.getAll()
        todosLosClientes = Array.from({length: 25}, (_, i) => ({
            id: i + 1,
            nombre: `Cliente ${i + 1}`,
            apellido: 'Pérez',
            dni: `${20000000 + i}`,
            email: `cliente${i + 1}@correo.com`,
            telefono: `+54 9 11 1234-${5678 + i}`,
            cantidadMascotas: Math.floor(Math.random() * 4) + 1,
            fechaRegistro: '2025-01-15'
        }));
        
        clientesFiltrados = [...todosLosClientes];
        renderizarTabla();
        
    } catch (error) {
        console.error('Error al cargar clientes:', error);
        Toast.show('Error al cargar la lista de clientes', 'error');
        mostrarError();
    }
}

/**
 * Filtra los clientes basándose en la cadena de búsqueda
 * @param {string} busqueda Texto a buscar
 */
function filtrarClientes(busqueda) {
    if (!busqueda.trim()) {
        clientesFiltrados = [...todosLosClientes];
    } else {
        const busquedaLower = busqueda.toLowerCase().trim();
        clientesFiltrados = todosLosClientes.filter(cliente => {
            const nombreCompleto = `${cliente.nombre} ${cliente.apellido}`.toLowerCase();
            return nombreCompleto.includes(busquedaLower) || 
                   cliente.dni.includes(busquedaLower) || 
                   cliente.email.toLowerCase().includes(busquedaLower);
        });
    }
    
    paginaActual = 1;
    renderizarTabla();
}

/**
 * Muestra el estado de carga en la tabla
 */
function mostrarCargando() {
    const tbody = document.getElementById('clientes-tbody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-5">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Cargando clientes...</span>
                    </div>
                </td>
            </tr>
        `;
    }
}

/**
 * Muestra un mensaje de error si falla la carga
 */
function mostrarError() {
    const tbody = document.getElementById('clientes-tbody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4 text-danger">
                    <i class="bi bi-exclamation-triangle fs-2 mb-2 d-block"></i>
                    Ocurrió un error al intentar cargar los datos. Intente nuevamente.
                </td>
            </tr>
        `;
    }
}

/**
 * Renderiza los clientes en la tabla HTML con paginación
 */
function renderizarTabla() {
    const tbody = document.getElementById('clientes-tbody');
    if (!tbody) return;
    
    if (clientesFiltrados.length === 0) {
        tbody.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-5 text-muted">
                    <i class="bi bi-search fs-1 mb-3 d-block"></i>
                    <p class="mb-0">No se encontraron clientes que coincidan con la búsqueda.</p>
                </td>
            </tr>
        `;
        actualizarPaginacion();
        return;
    }
    
    // Lógica de paginación
    const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
    const fin = inicio + ITEMS_POR_PAGINA;
    const clientesPagina = clientesFiltrados.slice(inicio, fin);
    
    let html = '';
    
    clientesPagina.forEach(cliente => {
        html += `
            <tr class="cursor-pointer" onclick="verCliente(${cliente.id})" style="cursor: pointer;">
                <td class="ps-4">
                    <div class="d-flex align-items-center">
                        <div class="rounded-circle bg-light d-flex justify-content-center align-items-center text-primary fw-bold me-3" style="width: 40px; height: 40px;">
                            ${cliente.nombre.charAt(0)}${cliente.apellido.charAt(0)}
                        </div>
                        <div>
                            <span class="fw-bold d-block text-dark">${cliente.nombre} ${cliente.apellido}</span>
                        </div>
                    </div>
                </td>
                <td>${Formatters.dni(cliente.dni)}</td>
                <td>
                    <div class="small">
                        <div class="text-muted"><i class="bi bi-envelope me-1"></i> ${cliente.email}</div>
                        <div class="text-muted"><i class="bi bi-telephone me-1"></i> ${cliente.telefono}</div>
                    </div>
                </td>
                <td class="text-center">
                    <span class="badge bg-info text-dark rounded-pill px-3 py-2">${cliente.cantidadMascotas}</span>
                </td>
                <td class="text-end pe-4" onclick="event.stopPropagation();">
                    <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-outline-primary" onclick="verCliente(${cliente.id})" title="Ver detalle de cliente">
                            <i class="bi bi-eye"></i> Ver
                        </button>
                        <button type="button" class="btn btn-sm btn-outline-secondary" onclick="verMascotasCliente(${cliente.id})" title="Ver mascotas del cliente">
                            <i class="bi bi-hearts"></i> Mascotas
                        </button>
                    </div>
                </td>
            </tr>
        `;
    });
    
    tbody.innerHTML = html;
    actualizarPaginacion();
}

/**
 * Actualiza los controles e información de paginación
 */
function actualizarPaginacion() {
    const totalItems = clientesFiltrados.length;
    const totalPaginas = Math.ceil(totalItems / ITEMS_POR_PAGINA);
    
    // Actualizar texto informativo
    const infoSpan = document.getElementById('paginacion-info');
    if (infoSpan) {
        if (totalItems === 0) {
            infoSpan.textContent = 'Mostrando 0 clientes';
        } else {
            const inicio = ((paginaActual - 1) * ITEMS_POR_PAGINA) + 1;
            const fin = Math.min(paginaActual * ITEMS_POR_PAGINA, totalItems);
            infoSpan.textContent = `Mostrando ${inicio} - ${fin} de ${totalItems} clientes`;
        }
    }
    
    // Actualizar controles de paginación
    const ulPaginacion = document.getElementById('paginacion-ul');
    if (ulPaginacion) {
        if (totalPaginas <= 1) {
            ulPaginacion.style.display = 'none';
            return;
        }
        
        ulPaginacion.style.display = 'flex';
        let html = '';
        
        // Botón Anterior
        html += `
            <li class="page-item ${paginaActual === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="cambiarPagina(event, ${paginaActual - 1})">Anterior</a>
            </li>
        `;
        
        // Números de página
        for (let i = 1; i <= totalPaginas; i++) {
            // Mostrar solo páginas cercanas para no saturar si hay muchas
            if (i === 1 || i === totalPaginas || (i >= paginaActual - 1 && i <= paginaActual + 1)) {
                html += `
                    <li class="page-item ${paginaActual === i ? 'active' : ''}">
                        <a class="page-link" href="#" onclick="cambiarPagina(event, ${i})">${i}</a>
                    </li>
                `;
            } else if (i === paginaActual - 2 || i === paginaActual + 2) {
                html += `
                    <li class="page-item disabled"><a class="page-link" href="#">...</a></li>
                `;
            }
        }
        
        // Botón Siguiente
        html += `
            <li class="page-item ${paginaActual === totalPaginas ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="cambiarPagina(event, ${paginaActual + 1})">Siguiente</a>
            </li>
        `;
        
        ulPaginacion.innerHTML = html;
    }
}

/**
 * Cambia la página actual y vuelve a renderizar
 */
window.cambiarPagina = function(event, pagina) {
    event.preventDefault();
    const totalPaginas = Math.ceil(clientesFiltrados.length / ITEMS_POR_PAGINA);
    
    if (pagina >= 1 && pagina <= totalPaginas) {
        paginaActual = pagina;
        renderizarTabla();
        // Volver arriba de la tabla suavemente
        document.querySelector('.table-responsive').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

/**
 * Redirige a la página de detalle del cliente
 */
window.verCliente = function(id) {
    window.location.href = `cliente-detalle.html?id=${id}`;
};

/**
 * Redirige a la página de mascotas filtrando por el cliente
 */
window.verMascotasCliente = function(id) {
    window.location.href = `mascotas.html?clienteId=${id}`;
};
