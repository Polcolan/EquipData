document.addEventListener('DOMContentLoaded', () => {
    const rolUsuario = localStorage.getItem('rolUsuario');

    function mostrarBotonesSegunRol() {
        const botonesEliminarSalas = document.querySelectorAll('.eliminar-Salas');
        const botonesEliminarEquipos = document.querySelectorAll('.eliminar-equipo');
        

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
           

    }}
   
    fetch('http://localhost:3000/Salas')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos de las Salas');
            }
            return response.json();
        })
        .then(data => {
            console.log('Datos de equipos recibidos:', data);
            const equiposContainer = document.getElementById('Salas');
            data.forEach(datos => {
                const nuevoli = document.createElement('li');
                nuevoli.classList.add("list-group-item");
                nuevoli.innerHTML = `
                    <div class="card" data-nombre="${datos.Nombre}">
                        <div class="card-body">
                            <h5 class="card-title">Nombre: ${datos.Nombre}</h5>
                            <p class="card-text">Ubicacion: ${datos.ubicacion}</p>
                            <p class="card-text">Capacidad de equipos: ${datos.Capacidad_de_Equipos}</p>
                            <button class="btn btn-primary ver-mas" data-sala="${datos.Nombre}">Ver Más</button>
                            <button id="eliminar-s" class="btn btn-danger eliminar-Salas" data-nombre="${datos.Nombre}">Eliminar</button>
                        </div>
                    </div>
                `;
                equiposContainer.appendChild(nuevoli);
                nuevoli.querySelector('.eliminar-Salas').addEventListener('click', () => {
                    const Nombre = datos.Nombre;
                    console.log('Intentando eliminar la sala:', Nombre);
                    eliminarSala(Nombre);
                });
            });

           function eliminarSala(Nombre) {
    fetch(`http://localhost:3000/consulta/${Nombre}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener la lista de equipos de la sala');
            }
            return response.json();
        })
        .then(equipos => {
            if (equipos.length > 0) {
                alert(`Antes de eliminar la sala "${Nombre}", asegúrese de mover o eliminar los siguientes equipos:\n${equipos.map(equipo =>`Marca: ${equipo.Marca}, Serial: ${equipo.idEquipos}`).join('\n')}`);
            } else {
                
                fetch(`http://localhost:3000/eliminar-Salas/${Nombre}`, {
                    method: 'DELETE',
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Error al eliminar la sala');
                    }
                    const SalasCard = document.querySelector(`.card[data-nombre="${Nombre}"]`);
                    if (SalasCard) {
                        SalasCard.remove();
                        alert(`Se ha eliminado correctamente la sala: ${Nombre}`);
                    } else {
                        console.error('El elemento a eliminar no se encontró en el DOM.');
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
}


            equiposContainer.addEventListener('click', (event) => {
                if (event.target && event.target.classList.contains('ver-mas')) {
                    const sala = event.target.getAttribute('data-sala');
                    window.location.href = `equipos.html?sala=${sala}`;
                }
            });
            mostrarBotonesSegunRol();
        })
        .catch(error => {
            console.error('Error:', error);
            
        });
});
