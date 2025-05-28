// Esperar a que el DOM esté completamente cargado antes de ejecutar el código
/**
 * Archivo: auth.js
 * Descripción: Manejo de la autenticación y registro de usuarios
 * 
 * Contiene:
 * - Validación de formularios de login y registro
 * - Manejo de envío de formularios
 * - Gestión de mensajes de error
 * - Redirección post-autenticación
 * 

 */

document.addEventListener('DOMContentLoaded', function() {
    // Obtener referencias a los formularios de login y registro
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Configurar el manejo del formulario de login
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            // Prevenir el comportamiento por defecto del formulario
            e.preventDefault();

            // Recopilar datos del formulario de login
            const formData = {
                email: this.querySelector('[name="email"]').value,
                password: this.querySelector('[name="password"]').value
            };

            try {
                // Enviar petición al servidor para iniciar sesión
                const response = await fetch('/api/login', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                // Procesar la respuesta del servidor
                const data = await response.json();

                if (response.ok) {
                    // Si el login es exitoso, mostrar mensaje y redirigir
                    alert('¡Inicio de sesión exitoso!');
                    window.location.href = '/index.html';
                } else {
                    // Si hay error, mostrar el mensaje de error
                    alert(data.error || 'Error al iniciar sesión');
                }
            } catch (error) {
                // Manejar errores de conexión
                console.error('Error:', error);
                alert('Error al conectar con el servidor');
            }
        });
    }

    // Configurar el manejo del formulario de registro
    if (registerForm) {
        registerForm.addEventListener('submit', async function(e) {
            // Prevenir el comportamiento por defecto del formulario
            e.preventDefault();

            // Recopilar datos del formulario de registro
            const formData = {
                nombre: this.querySelector('[name="nombre"]').value,
                email: this.querySelector('[name="email"]').value,
                password: this.querySelector('[name="password"]').value,
                edad: parseInt(this.querySelector('[name="edad"]').value) // Convertir edad a número
            };

            try {
                // Enviar petición al servidor para registrar usuario
                const response = await fetch('/api/register', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(formData)
                });

                // Procesar la respuesta del servidor
                const data = await response.json();

                if (response.ok) {
                    // Si el registro es exitoso, mostrar mensaje y cambiar a la pestaña de login
                    alert('¡Registro exitoso! Por favor inicia sesión.');
                    document.getElementById('login-tab').click();
                } else {
                    // Si hay error, mostrar el mensaje de error
                    alert(data.error || 'Error al registrar usuario');
                }
            } catch (error) {
                // Manejar errores de conexión
                console.error('Error:', error);
                alert('Error al conectar con el servidor');
            }
        });
    }
});