document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("form").addEventListener("submit", function(event) {
        event.preventDefault();
    
        const usuario = document.getElementById("Correo").value;
        const Contrasena = document.getElementById("Contrasena").value;
        const errorElement = document.getElementById('error');
    
        errorElement.innerText = '';

        if (usuario.trim() === '' || Contrasena.trim() === '') {
            errorElement.innerText = 'Por favor, complete todos los campos.';
            return;
        }
    
        fetch("http://localhost:3000/verificar-usuario", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usuario, Contrasena })
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(error => { throw error; });
            }
            return response.json();
        })
        .then(data => {
            console.log('Inicio de sesión exitoso:', data);
            localStorage.setItem('usuario', JSON.stringify(data.usuario));
            localStorage.setItem('rolUsuario', data.rol);
            mostrarBotonesSegunRol(data.rol); 
            window.location.href = "/front/Html/Salas.html"; 
        })
        .catch(error => {
            console.error('Error:', error);
            if (error.mensaje) {
                document.getElementById('error').innerText = error.mensaje;
            } else {
                document.getElementById('error').innerText = "Error de conexión. Por favor, intenta de nuevo más tarde.";
            }
        });
    });
});

function mostrarBotonesSegunRol(Rol) {
    const botonesEliminarSalas = document.querySelectorAll('.eliminar-Salas');
    const botonesEliminarEquipos = document.querySelectorAll('.eliminar-equipo');

    if (Rol === 'admind') {
        botonesEliminarSalas.forEach(boton => {
            boton.style.display = 'block'; 
        });
        botonesEliminarEquipos.forEach(boton => {
            boton.style.display = 'block'; 
        });
    } else if (Rol === 'soporte') {
        botonesEliminarSalas.forEach(boton => {
            boton.style.display = 'none'; 
        });
        botonesEliminarEquipos.forEach(boton => {
            boton.style.display = 'none'; 
        });
    } else {
        botonesEliminarSalas.forEach(boton => {
            boton.style.display = 'none';
        });
        botonesEliminarEquipos.forEach(boton => {
            boton.style.display = 'none';
        });
    }
}
