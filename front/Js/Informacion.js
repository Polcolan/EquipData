document.addEventListener('DOMContentLoaded', () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sala = urlParams.get('sala');
    const rolUsuario = localStorage.getItem('rolUsuario');

    function mostrarBotonesSegunRol() {
        const botonesEliminarSalas = document.querySelectorAll('.eliminar-Salas');
        const botonesEliminarEquipos = document.querySelectorAll('.eliminar-equipo');
        const botonesCambiarEstado= document.querySelectorAll(".editar-estado")
        const botonagregarsalas=document.getElementById("Sala")

        if (rolUsuario === 'admind') {
            botonesEliminarSalas.forEach(boton => {
                boton.style.display = 'block';
            });
            botonesEliminarEquipos.forEach(boton => {
                boton.style.display = 'block';
            });
        } else if (rolUsuario === 'soporte') {
            botonesEliminarSalas.forEach(boton => {
                boton.style.display = 'none';
            });
            botonesEliminarEquipos.forEach(boton => {
                boton.style.display = 'none';
            });
        } else if(rolUsuario==="lector") {
            botonesEliminarSalas.forEach(boton => {
                boton.style.display = 'none';
            });
            botonesEliminarEquipos.forEach(boton => {
                boton.style.display = 'none';
            });
            botonesCambiarEstado.forEach(boton=>{
                boton.style.display="none";
            })
            botonagregarsalas.forEach(boton=>{
                boton.style.display="none";
            })

        }
    }
   
    

    if (sala) {
        fetch(`http://localhost:3000/consulta/${sala}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al obtener los datos de los equipos');
                }
                return response.json();
            })
            .then(data => {
                console.log('Datos de equipos recibidos:', data);
                const equiposContainer = document.getElementById('Equipos-F');

                function createEquipoCard(datos) {
                    const nuevoDiv = document.createElement('div');
                    nuevoDiv.classList.add('card', 'col-md-4');
                    nuevoDiv.setAttribute('data-tipo', datos.Tipo_de_Equipo);

                    const contenidoCard = `
                        <div class="card-body">
                            <h5 class="card-title">Marca: ${datos.Marca}</h5>
                            <p class="card-text">Serial: ${datos.idEquipos}</p>
                            <p class="estado">Estado: ${datos.Estado}</p>
                            <button class="btn btn-primary ver-mas">Ver más</button> 
                            <div class="contenido-adicional" style="display: none;">
                                <p>Descripcion: ${datos.Descripcion}</p>
                                <p>Empresa: ${datos.Empresa}</p> 
                                <p>${datos.Estado}</p>
                                <p>${datos.Tipo_de_Equipo}</p>
                            </div>
                            <button class="btn btn-danger eliminar-equipo">Eliminar</button>
                            <button  class="btn btn-secondary editar-estado">Editar Estado</button>
                            <div class="editar-estado-form" style="display: none;">
                                <input type="text" class="nuevo-estado" placeholder="Nuevo Estado" />
                                <button class="btn btn-success guardar-estado">Guardar</button>
                            </div>
                        </div>
                    `;

                    if (datos.img) {
                        nuevoDiv.innerHTML = `<img src="data:image/png;base64,${datos.img}" class="card-img-top" alt="...">${contenidoCard}`;
                    } else {
                        nuevoDiv.innerHTML = contenidoCard;
                    }

                    equiposContainer.appendChild(nuevoDiv);

                    nuevoDiv.querySelector('.eliminar-equipo').addEventListener('click', () => {
                        const serial = datos.idEquipos;
                        eliminarEquipo(serial);
                    });

                    const editarEstadoBtn = nuevoDiv.querySelector('.editar-estado');
                    const editarEstadoForm = nuevoDiv.querySelector('.editar-estado-form');
                    const guardarEstadoBtn = nuevoDiv.querySelector('.guardar-estado');
                    const nuevoEstadoInput = nuevoDiv.querySelector('.nuevo-estado');

                    editarEstadoBtn.addEventListener('click', () => {
                        editarEstadoForm.style.display = editarEstadoForm.style.display === 'none' ? 'block' : 'none';
                    });

                    guardarEstadoBtn.addEventListener('click', () => {
                        const nuevoEstado = nuevoEstadoInput.value;
                        if (nuevoEstado) {
                            actualizarEstado(datos.idEquipos, nuevoEstado, nuevoDiv);
                        }
                    });
                }
                function filterEquiposByTipo(tipoSeleccionado) {
                    const equipos = document.querySelectorAll('.card');
                    equipos.forEach(equipo => {
                        const tipoEquipo = equipo.getAttribute('data-tipo');
                        if (tipoEquipo === tipoSeleccionado) {
                            equipo.style.display = 'block';
                        } else {
                            equipo.style.display = 'none';
                        }
                    });
                }

                const dropdownItems = document.querySelectorAll('.dropdown-item');
                dropdownItems.forEach(item => {
                    item.addEventListener('click', () => {
                        const tipoSeleccionado = item.getAttribute('data-tipo');
                        filterEquiposByTipo(tipoSeleccionado);
                    });
                });
                function actualizarEstado(idEquipo, nuevoEstado, card) {
                    fetch(`http://localhost:3000/actualizar-estado/${idEquipo}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({ estado: nuevoEstado })
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error al actualizar el estado del equipo');
                        }
                        return response.json();
                    })
                    .then(data => {
                        console.log(data.mensaje);
                        card.querySelector('.estado').textContent = nuevoEstado;
                        card.querySelector('.editar-estado-form').style.display = 'none';
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                }

                function eliminarEquipo(serial) {
                    fetch(`http://localhost:3000/eliminar-equipo/${serial}`, {
                        method: 'DELETE',
                    })
                    .then(response => {
                        if (!response.ok) {
                            throw new Error('Error al eliminar el equipo');
                        }

                        const equipoCard = document.querySelector(`.card[data-serial="${serial}"]`);
                        if (equipoCard) {
                            equipoCard.remove();
                            console.log('Equipo eliminado correctamente, ');
                        } else {
                            console.error('El elemento a eliminar no se encontró en el DOM.');
                            alert(`El equipo con el id: ${serial} ha sido eliminado, se atualizara la pagina para ver lo cambios`);
                            window.location.reload()
                        }
                    })
                    .catch(error => {
                        console.error('Error:', error);
                    });
                }

                data.forEach(datos => {
                    createEquipoCard(datos);
                });

                const botonesVerMas = document.querySelectorAll('.ver-mas');
                botonesVerMas.forEach((boton) => {
                    boton.addEventListener('click', () => {
                        const contenidoAdicional = boton.nextElementSibling;
                        if (contenidoAdicional.style.display === 'none' || contenidoAdicional.style.display === '') {
                            contenidoAdicional.style.display = 'block';
                            boton.textContent = 'Ver menos';
                        } else {
                            contenidoAdicional.style.display = 'none';
                            boton.textContent = 'Ver más';
                        }
                    });
                });
                mostrarBotonesSegunRol();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    } else {
        console.error('No se proporcionó el parámetro de la sala');
    }
});
