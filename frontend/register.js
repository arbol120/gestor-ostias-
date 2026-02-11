const registerForm = document.getElementById('registerForm');
const message = document.getElementById('message');

registerForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const res = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, password })
        });

        const data = await res.json();

        if (res.ok) {
            message.style.color = 'green';
            message.innerText = 'Registro exitoso, redirigiendo al login...';
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
        } else {
            message.style.color = 'red';
            message.innerText = data.message;
        }
    } catch (err) {
        message.innerText = 'Error en el servidor';
    }
});
