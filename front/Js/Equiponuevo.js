document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/Salas')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al obtener los datos de las Salas');
            }
            return response.json();
        })
        .then(data => {
            const salaSelect = document.getElementById('idsala');
            data.forEach(sala => {
                const option = document.createElement('option');
                option.value = sala.Nombre;
                option.textContent = sala.Nombre;
                option.dataset.capacidad = sala.Capacidad_de_Equipos;
                salaSelect.appendChild(option);
            });
        })
        .catch(error => {
            console.error('Error:', error);
        });

    document.getElementById('form-equipos').addEventListener('submit', function(event) {
        event.preventDefault();

        const equipoId = document.getElementById('idequipos').value;

        fetch(`http://localhost:3000/verificar-equipo/${equipoId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al verificar el ID del equipo');
                }
                return response.json();
            })
            .then(data => {
                if (data.existe) {
                    alert('El codigo de activo fijo del equipo ya existe. Por favor, escogue otro.');
                } else {
                    agregarEquipo();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error de conexión. Por favor, inténtalo de nuevo más tarde.');
            });
    });

    function agregarEquipo() {
        var Marca = document.getElementById('Marca').value;
        var Descripcion = document.getElementById('Descripcion').value;
        var Estado = document.getElementById('Estado').value;
        var Empresa = document.getElementById('Empresa').value;
        var Equipo = document.getElementById('Equipo').value;
        var Sala = document.getElementById('idsala').value;
        var serial = document.getElementById('idequipos').value;
        var imagen = document.getElementById('imagen').files[0];

        var datos = new FormData();
        datos.append('Marca', Marca);
        datos.append('Descripcion', Descripcion);
        datos.append('Estado', Estado);
        datos.append('Empresa', Empresa);
        datos.append('Equipo', Equipo);
        datos.append('Sala', Sala);
        datos.append('serial', serial);
        datos.append('imagen', imagen);

        fetch('http://localhost:3000/G-Equipos', {
            method: 'POST',
            body: datos
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            return response.json();
        })
        .then(data => {
            console.log('Respuesta del servidor:', data);
            document.getElementById('success-message').innerText = "Equipo añadido correctamente";
            alert("El equipo ha sido añadido correctamente. Por favor, dirígete a la página principal para verificar si el equipo aparece en la sala correspondiente");
           // window.location.href = `/front/html/Salas.html`;
           window.location.reload()
        })
        .catch(error => {
            console.error('Error:', error);
            if (error.mensaje) {
                document.getElementById('error').innerText = error.mensaje;
            } else {
                document.getElementById('error').innerText = "Error de conexión. Por favor, inténtalo de nuevo más tarde.";
            }
        });
    }
});
