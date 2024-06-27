document.addEventListener("DOMContentLoaded", function() {
    const usuarioJSON = localStorage.getItem('usuario');
    const perfilContainer = document.getElementById('perfilContainer');

    if (!usuarioJSON || !perfilContainer) {
        console.error('No hay información de usuario disponible o no se encontró el contenedor de perfil');
        return;
    }

    const usuario = JSON.parse(usuarioJSON);

    if (usuario) {
        const profileDiv = document.createElement('div');
        profileDiv.classList.add("profile-info");

        const profileImg = document.createElement('img');
        profileImg.src = "/front/images/Usuario.webp";
        profileImg.alt = "Profile Picture";
        profileImg.classList.add("rounded-image");

        const profileUl = document.createElement('ul');

        const nameLi = document.createElement('li');
        nameLi.innerHTML = "<strong>Nombre:</strong> " + usuario.Nombre;

        const emailLi = document.createElement('li');
        emailLi.innerHTML = "<strong>Correo:</strong> " + usuario.Correo;

        const roleLi = document.createElement('li');
        roleLi.innerHTML = "<strong>Rol:</strong> <span class='role'>" + usuario.Rol + "</span>";

        profileUl.appendChild(nameLi);
        profileUl.appendChild(emailLi);
        profileUl.appendChild(roleLi);

        profileDiv.appendChild(profileImg);
        profileDiv.appendChild(profileUl);

        perfilContainer.appendChild(profileDiv);
    } else {
        console.error('No hay información de usuario disponible');
    }
});
