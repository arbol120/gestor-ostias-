let token = null;

// ----- Registro -----
async function register() {
    const username = document.getElementById('reg-username').value;
    const password = document.getElementById('reg-password').value;

    const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();
    alert(data.message || `Registrado como ${data.username}`);
}

// ----- Login -----
async function login() {
    const username = document.getElementById('login-username').value;
    const password = document.getElementById('login-password').value;

    const res = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });
    const data = await res.json();

    if (data.token) {
        token = data.token;
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('product-section').style.display = 'block';
        loadProducts();
    } else {
        alert(data.message);
    }
}

// ----- Logout -----
function logout() {
    token = null;
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('product-section').style.display = 'none';
}

// ----- Cargar productos -----
async function loadProducts() {
    const res = await fetch('http://localhost:5000/api/products', {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const products = await res.json();

    const list = document.getElementById('product-list');
    list.innerHTML = '';

    products.forEach(p => {
        const li = document.createElement('li');
        li.innerHTML = `
            ${p.name} - $${p.price} 
            <button onclick="deleteProduct('${p._id}')">Eliminar</button>
            <button onclick="editProduct('${p._id}', '${p.name}', '${p.description}', ${p.price})">Editar</button>
        `;
        list.appendChild(li);
    });
}

// ----- Agregar producto -----
async function addProduct() {
    const name = document.getElementById('prod-name').value;
    const description = document.getElementById('prod-desc').value;
    const price = Number(document.getElementById('prod-price').value);

    await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name, description, price })
    });
    loadProducts();
}

// ----- Eliminar producto -----
async function deleteProduct(id) {
    await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    loadProducts();
}

// ----- Editar producto -----
async function editProduct(id, name, description, price) {
    const newName = prompt("Nombre:", name);
    const newDesc = prompt("Descripción:", description);
    const newPrice = prompt("Precio:", price);

    if (!newName || !newPrice) return;

    await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ name: newName, description: newDesc, price: Number(newPrice) })
    });
    loadProducts();
}
