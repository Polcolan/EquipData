document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('form').addEventListener('submit', function(event) {
        event.preventDefault();

        var nombre = document.getElementById('nombre').value;
        var Contrasena = document.getElementById('Contrasena').value;
        var Correo = document.getElementById('Correo').value;
        var Rol = document.getElementById('Rol').value;

        var datos = {
            nombre: nombre,
            Contrasena: Contrasena,
            Correo: Correo,
            Rol: Rol
        };

        fetch('http://localhost:3000/guardar-datos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datos)
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => { throw error; });
            }
            return response.json();
        })
        .then(data => {
            console.log('Respuesta del servidor:', data);
            window.location.href = "/front/Html/Salas.html";
          
        })
        .catch(error => {
            console.error('Error:', error);
            if (error.mensaje) {
                document.getElementById('error-message').innerText = error.mensaje;
            } else {
                document.getElementById('error-message').innerText = "Error al procesar la solicitud.";
            }
        });
    });
});
