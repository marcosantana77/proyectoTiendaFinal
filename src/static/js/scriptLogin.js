document.addEventListener("DOMContentLoaded", function() {
    document.getElementById("iniciar").addEventListener("click", function(event) {
        event.preventDefault(); // Evitar el comportamiento predeterminado del formulario

        let usuario = document.getElementById("usuario").value;
        let clave = document.getElementById("clave").value;

        // Crear objeto con las credenciales del usuario
        const credenciales = {
            username: usuario,
            password: clave
        };

        // Realizar solicitud POST al servidor para validar el login
        fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Configurar el tipo de medio como JSON
            },
            body: JSON.stringify(credenciales) // Convertir el objeto a JSON
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                // Si la validación es exitosa, redirigir a la página de inicio
                window.location.href = '/home';
            } else {
                // Si las credenciales son inválidas, mostrar mensaje de error
                document.getElementById("errorMessage").textContent = "Usuario o contraseña incorrectos";
            }
        })
        .catch(error => console.error('Error al iniciar sesión:', error));
    });
});
