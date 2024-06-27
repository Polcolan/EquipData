
document.addEventListener('DOMContentLoaded', function() {
document.getElementById('form-Eventos').addEventListener('submit', function(event) {
    event.preventDefault()

    var FechaE= document.getElementById('F-evento').value;
    var Descripcion= document.getElementById('D-E').value;
   
    

    
    var datos = {
        FechaE: FechaE,
        Descripcion : Descripcion,
      
      }

    


    fetch('http://localhost:3000/G-Eventos', {
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
    })
    .catch(error => {
        console.error('Error:', error)
    });
});

});