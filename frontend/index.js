const loginForm = document.getElementById('loginForm');
const message = document.getElementById('message');

// 🔹 Si ya hay token, redirigir automáticamente
const token = localStorage.getItem('token');
if (token) {
    window.location.href = 'products.html';
}

loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('http://localhost:5000/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (res.ok) {
            message.style.color = 'green';
            message.innerText = '¡Inicio de sesión exitoso! Redirigiendo...';
            // Guardar token en localStorage
            localStorage.setItem('token', data.token);
            setTimeout(() => {
                window.location.href = 'products.html';
            }, 1000);
        } else {
            message.style.color = 'red';
            message.innerText = data.message;
        }
    } catch (err) {
        message.innerText = 'Error en el servidor';
    }
});
