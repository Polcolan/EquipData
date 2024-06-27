document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('form-Eventos');
    const equiposContainer = document.getElementById('equipos-container');

    fetch('http://localhost:3000/Salas')
        .then(response => response.json())
        .then(data => {
            const salaSelect = document.getElementById('relacion');
            const salaSelect2 = document.getElementById('final');
            data.forEach(sala => {
                const option = document.createElement('option');
                option.value = sala.Nombre;
                option.textContent = sala.Nombre;
                salaSelect.appendChild(option);

                const option2 = document.createElement('option');
                option2.value = sala.Nombre;
                option2.textContent = sala.Nombre;
                salaSelect2.appendChild(option2);
            });
        })
        .catch(error => console.error('Error:', error));

    form.addEventListener('change', (event) => {
        if (event.target.id === 'relacion') {
            const salaInicial = event.target.value;
            fetch(`http://localhost:3000/consulta/${salaInicial}`)
                .then(response => response.json())
                .then(data => {
                    equiposContainer.innerHTML = '';
                    data.forEach(equipo => {
                        const checkbox = document.createElement('input');
                        checkbox.type = 'checkbox';
                        checkbox.value = equipo.idEquipos;
                        checkbox.id = `equipo-${equipo.idEquipos}`;
                        const label = document.createElement('label');
                        label.textContent = equipo.idEquipos;
                        label.htmlFor = `equipo-${equipo.Serial}`;
                        equiposContainer.appendChild(checkbox);
                        equiposContainer.appendChild(label);
                        equiposContainer.appendChild(document.createElement('br'));
                    });
                })
                .catch(error => console.error('Error:', error));
        }
    });

    document.getElementById('submite').addEventListener('click', (event) => {
        event.preventDefault();
        const salaFinal = document.getElementById('final').value;
        const equiposSeleccionados = Array.from(equiposContainer.querySelectorAll('input[type="checkbox"]:checked')).map(checkbox => checkbox.value);

        if (salaFinal && equiposSeleccionados.length > 0) {
            equiposSeleccionados.forEach(equipoSerial => {
                fetch('http://localhost:3000/mover-equipo', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ equipoId: equipoSerial, nuevaSala: salaFinal })
                })
                .then(response => response.json().then(data => {
                    if (!response.ok) {
                        throw new Error(data.mensaje);
                    }
                    console.log(data.mensaje);
                    document.getElementById('success-message').innerText = "Se movió el equipo con éxito";
                    alert("El equipo se movio correctamente, puede dirigirte a la pagina principal a ver lo cambios ")
                    window.location.reload()
                }))
                .catch(error => {
                    console.error('Error:', error);
                    alert(error.message); 
                });
            });
        } else {
            alert('Seleccione una sala final y al menos un equipo para mover.');
        }
    });
});
