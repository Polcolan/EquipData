document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('form-Salas').addEventListener('submit', function(event) {
        event.preventDefault();
        const NombreS = document.getElementById('N-sala').value; 
        fetch(`http://localhost:3000/verificar-salas/${NombreS}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error al verificar el Nombre de la sala');
                }
                return response.json();
            })
            .then(data => {
                if (data.existe) {
                    alert('Ya existe una sala con ese nombre, escriba otro nombre ');
                } else {
                    agregarSala();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error de conexión. Por favor, inténtalo de nuevo más tarde.');
            });
    });

    function agregarSala() {
        var Nombre = document.getElementById('N-sala').value; 
        var Ubicacion = document.getElementById('Ubicacion').value;
        var PuertosR = document.getElementById('N-R').value;
        var CapacidadE = document.getElementById('C-Equipos').value;

        var datos = {
            Nombre: Nombre,
            Ubicacion: Ubicacion,
            PuertosR: PuertosR,
            CapacidadE: CapacidadE,
        };

        fetch('http://localhost:3000/G-Salas', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error en la solicitud');
            }
            return response.json();
        })
        .then(data => {
            console.log('Respuesta del servidor:', data);
            document.getElementById('success-message').innerText = "Se agregó la nueva Sala";
            alert("Se agregó la nueva Sala");
            window.location.href = `/front/html/nuevoequipo.html`;
        })
        .catch(error => {
            console.error('Error:', error);
            if (error.mensaje) {
                document.getElementById('error').innerText = error.mensaje;
            } else {
                document.getElementById('error').innerText = "Error de conexión. Por favor, intenta de nuevo más tarde.";
            }
        });
    }
});
