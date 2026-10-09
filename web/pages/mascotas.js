/**
 * Lógica para la página de Mascotas
 */

let todasLasMascotas = [];
let mascotasFiltradas = [];
let paginaActual = 1;
const ITEMS_POR_PAGINA = 12;
let debounceTimer;
let modoVista = 'tabla'; // 'tabla' o 'grid'
let filtroClienteId = null;

document.addEventListener('DOMContentLoaded', () => {
    // Comprobar si venimos filtrados por un cliente (ej: ?clienteId=1)
    const urlParams = new URLSearchParams(window.location.search);
    filtroClienteId = urlParams.get('clienteId');
    
    inicializarEventos();
    cargarMascotas();
});

function inicializarEventos() {
    const inputBuscar = document.getElementById('input-buscar');
    const selectTipo = document.getElementById('filtro-tipo');
    const btnTabla = document.getElementById('btn-vista-tabla');
    const btnGrid = document.getElementById('btn-vista-grid');
    
    if (inputBuscar) {
        inputBuscar.addEventListener('input', (e) => {
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(aplicarFiltros, 300);
        });
    }
    
    if (selectTipo) {
        selectTipo.addEventListener('change', aplicarFiltros);
    }
    
    if (btnTabla) {
        btnTabla.addEventListener('change', () => {
            modoVista = 'tabla';
            renderizarMascotas();
        });
    }
    
    if (btnGrid) {
        btnGrid.addEventListener('change', () => {
            modoVista = 'grid';
            renderizarMascotas();
        });
    }
}

async function cargarMascotas() {
    try {
        // En un entorno real llamaríamos a la API
        await new Promise(resolve => setTimeout(resolve, 600));
        
        // Simular datos
        todasLasMascotas = Array.from({length: 30}, (_, i) => {
            const tipos = ['Perro', 'Gato', 'Conejo', 'Ave'];
            const tipo = tipos[Math.floor(Math.random() * tipos.length)];
            const clienteIdMock = Math.floor(Math.random() * 5) + 1;
            
            return {
                id: i + 1,
                nombre: `Mascota ${i + 1}`,
                tipo: tipo,
                raza: tipo === 'Perro' ? 'Mestizo' : (tipo === 'Gato' ? 'Siamés' : 'Común'),
                edad: `${Math.floor(Math.random() * 10) + 1} años`,
                sexo: Math.random() > 0.5 ? 'Macho' : 'Hembra',
                propietarioId: clienteIdMock,
                propietarioNombre: `Propietario ${clienteIdMock}`,
                ultimaConsulta: '2023-10-01'
            };
        });
        
        // Si hay un cliente filtrado, aplicar ese filtro inicial
        if (filtroClienteId) {
            todasLasMascotas = todasLasMascotas.filter(m => m.propietarioId.toString() === filtroClienteId);
            
            // Añadir nota de que estamos filtrando
            const headerElement = document.querySelector('h1');
            if (headerElement && todasLasMascotas.length > 0) {
                headerElement.innerHTML = `Mascotas de <span class="text-primary">${todasLasMascotas[0].propietarioNombre}</span>`;
            }
        }
        
        mascotasFiltradas = [...todasLasMascotas];
        renderizarMascotas();
        
    } catch (error) {
        console.error('Error al cargar mascotas:', error);
        Toast.show('Error al cargar mascotas', 'error');
        document.getElementById('mascotas-container').innerHTML = `
            <div class="alert alert-danger">Error al cargar los datos. Intente nuevamente.</div>
        `;
    }
}

function aplicarFiltros() {
    const texto = document.getElementById('input-buscar').value.toLowerCase().trim();
    const tipo = document.getElementById('filtro-tipo').value;
    
    mascotasFiltradas = todasLasMascotas.filter(mascota => {
        const coincideTexto = mascota.nombre.toLowerCase().includes(texto) || 
                              mascota.propietarioNombre.toLowerCase().includes(texto);
        const coincideTipo = tipo === '' || mascota.tipo === tipo;
        
        return coincideTexto && coincideTipo;
    });
    
    paginaActual = 1;
    renderizarMascotas();
}

function renderizarMascotas() {
    const contenedor = document.getElementById('mascotas-container');
    const paginacionDiv = document.getElementById('paginacion-container');
    
    if (mascotasFiltradas.length === 0) {
        contenedor.innerHTML = `
            <div class="card border-0 shadow-sm text-center py-5">
                <i class="bi bi-search fs-1 mb-3 text-muted"></i>
                <h5 class="text-muted">No se encontraron mascotas</h5>
                <p class="mb-0">Intente modificar los filtros de búsqueda</p>
            </div>
        `;
        paginacionDiv.style.display = 'none';
        return;
    }
    
    const inicio = (paginaActual - 1) * ITEMS_POR_PAGINA;
    const fin = inicio + ITEMS_POR_PAGINA;
    const itemsPagina = mascotasFiltradas.slice(inicio, fin);
    
    if (modoVista === 'tabla') {
        renderizarVistaTabla(itemsPagina, contenedor);
    } else {
        renderizarVistaGrid(itemsPagina, contenedor);
    }
    
    paginacionDiv.style.display = 'block';
    actualizarPaginacion();
}

function renderizarVistaTabla(items, contenedor) {
    let html = `
        <div class="card border-0 shadow-sm">
            <div class="card-body p-0">
                <div class="table-responsive">
                    <table class="table table-hover align-middle mb-0">
                        <thead class="table-light text-muted">
                            <tr>
                                <th class="ps-4">Mascota</th>
                                <th>Detalles</th>
                                <th>Propietario</th>
                                <th>Última Consulta</th>
                                <th class="text-end pe-4">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
    `;
    
    items.forEach(mascota => {
        let iconColor = 'text-primary';
        if(mascota.tipo === 'Gato') iconColor = 'text-warning';
        if(mascota.tipo === 'Conejo') iconColor = 'text-secondary';
        
        html += `
            <tr class="cursor-pointer" onclick="verMascota(${mascota.id})" style="cursor: pointer;">
                <td class="ps-4">
                    <div class="d-flex align-items-center">
                        <div class="rounded-circle bg-light d-flex justify-content-center align-items-center me-3" style="width: 45px; height: 45px;">
                            <i class="bi bi-circle-fill ${iconColor}"></i>
                        </div>
                        <div>
                            <span class="fw-bold d-block text-dark">${mascota.nombre}</span>
                            <span class="badge bg-light text-dark border small mt-1">${mascota.tipo}</span>
                        </div>
                    </div>
                </td>
                <td>
                    <div class="small">
                        <span class="text-muted">Raza:</span> <span class="fw-medium">${mascota.raza}</span><br>
                        <span class="text-muted">Edad:</span> <span class="fw-medium">${mascota.edad}</span>
                    </div>
                </td>
                <td>
                    <a href="cliente-detalle.html?id=${mascota.propietarioId}" class="text-decoration-none fw-medium" onclick="event.stopPropagation();">
                        ${mascota.propietarioNombre}
                    </a>
                </td>
                <td>${Formatters.date(mascota.ultimaConsulta) || 'Sin registro'}</td>
                <td class="text-end pe-4" onclick="event.stopPropagation();">
                    <button class="btn btn-sm btn-outline-primary" onclick="verMascota(${mascota.id})">
                        Historia Clínica
                    </button>
                </td>
            </tr>
        `;
    });
    
    html += `
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    `;
    
    contenedor.innerHTML = html;
}

function renderizarVistaGrid(items, contenedor) {
    let html = '<div class="row g-3">';
    
    items.forEach(mascota => {
        let iconColor = 'text-primary';
        if(mascota.tipo === 'Gato') iconColor = 'text-warning';
        if(mascota.tipo === 'Conejo') iconColor = 'text-secondary';
        
        html += `
            <div class="col-12 col-md-6 col-lg-4 col-xl-3">
                <div class="card border-0 shadow-sm h-100 pet-card-hover" onclick="verMascota(${mascota.id})" style="cursor: pointer; transition: transform 0.2s;">
                    <div class="card-body">
                        <div class="text-center mb-3">
                            <div class="rounded-circle bg-light d-inline-flex justify-content-center align-items-center mb-2" style="width: 70px; height: 70px;">
                                <i class="bi bi-circle-fill fs-2 ${iconColor}"></i>
                            </div>
                            <h5 class="fw-bold mb-0">${mascota.nombre}</h5>
                            <span class="badge bg-light text-dark border mt-1">${mascota.tipo}</span>
                        </div>
                        
                        <div class="border-top pt-3 mt-3">
                            <div class="d-flex justify-content-between mb-2 small">
                                <span class="text-muted">Raza:</span>
                                <span class="fw-medium">${mascota.raza}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-2 small">
                                <span class="text-muted">Edad:</span>
                                <span class="fw-medium">${mascota.edad}</span>
                            </div>
                            <div class="d-flex justify-content-between mb-3 small">
                                <span class="text-muted">Dueño:</span>
                                <span class="text-primary text-truncate ms-2" style="max-width: 100px;">
                                    ${mascota.propietarioNombre}
                                </span>
                            </div>
                        </div>
                        
                        <button class="btn btn-outline-primary btn-sm w-100" onclick="event.stopPropagation(); verMascota(${mascota.id})">
                            Historia Clínica
                        </button>
                    </div>
                </div>
            </div>
        `;
    });
    
    html += '</div>';
    contenedor.innerHTML = html;
}

function actualizarPaginacion() {
    const totalItems = mascotasFiltradas.length;
    const totalPaginas = Math.ceil(totalItems / ITEMS_POR_PAGINA);
    
    const infoSpan = document.getElementById('paginacion-info');
    if (infoSpan) {
        const inicio = ((paginaActual - 1) * ITEMS_POR_PAGINA) + 1;
        const fin = Math.min(paginaActual * ITEMS_POR_PAGINA, totalItems);
        infoSpan.textContent = `Mostrando ${inicio} - ${fin} de ${totalItems} mascotas`;
    }
    
    const ulPaginacion = document.getElementById('paginacion-ul');
    if (ulPaginacion) {
        if (totalPaginas <= 1) {
            ulPaginacion.style.display = 'none';
            return;
        }
        
        ulPaginacion.style.display = 'flex';
        let html = '';
        
        html += `
            <li class="page-item ${paginaActual === 1 ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="cambiarPagina(event, ${paginaActual - 1})">Anterior</a>
            </li>
        `;
        
        for (let i = 1; i <= totalPaginas; i++) {
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
        
        html += `
            <li class="page-item ${paginaActual === totalPaginas ? 'disabled' : ''}">
                <a class="page-link" href="#" onclick="cambiarPagina(event, ${paginaActual + 1})">Siguiente</a>
            </li>
        `;
        
        ulPaginacion.innerHTML = html;
    }
}

window.cambiarPagina = function(event, pagina) {
    event.preventDefault();
    const totalPaginas = Math.ceil(mascotasFiltradas.length / ITEMS_POR_PAGINA);
    
    if (pagina >= 1 && pagina <= totalPaginas) {
        paginaActual = pagina;
        renderizarMascotas();
        document.getElementById('mascotas-container').scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
};

window.verMascota = function(id) {
    window.location.href = `mascota-detalle.html?id=${id}`;
};
